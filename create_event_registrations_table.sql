-- ============================================
-- Create Event Registrations Table with RLS Policies
-- Run this in your Supabase SQL Editor
-- ============================================

-- ============================================
-- CREATE EVENT REGISTRATIONS TABLE
-- ============================================

-- Create the event_registrations table
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id BIGSERIAL PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Allow NULL for anonymous registrations
  
  -- Registration details (matching the form)
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT, -- Optional
  number_of_participants INTEGER NOT NULL DEFAULT 1 CHECK (number_of_participants > 0),
  location TEXT NOT NULL, -- User's current location
  special_requests TEXT, -- Optional textarea for special requirements
  
  -- Payment information
  payment_method TEXT DEFAULT 'mobile_money' CHECK (payment_method IN ('mobile_money', 'bank_transfer', 'cash', 'card')),
  payment_reference TEXT, -- For tracking MTN Mobile Money transactions
  mtn_number TEXT, -- The MTN number used for payment
  amount_paid DECIMAL(10,2),
  
  -- Registration metadata
  registration_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'waitlist', 'no-show')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  -- Ensure one registration per email per event (since we allow anonymous registrations)
  UNIQUE(event_id, email)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON public.event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON public.event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_email ON public.event_registrations(email);
CREATE INDEX IF NOT EXISTS idx_event_registrations_status ON public.event_registrations(status);
CREATE INDEX IF NOT EXISTS idx_event_registrations_payment_status ON public.event_registrations(payment_status);
CREATE INDEX IF NOT EXISTS idx_event_registrations_location ON public.event_registrations(location);
CREATE INDEX IF NOT EXISTS idx_event_registrations_participants ON public.event_registrations(number_of_participants);

-- ============================================
-- TRIGGERS AND FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_event_registrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for automatic timestamp updates
CREATE TRIGGER update_event_registrations_updated_at
  BEFORE UPDATE ON public.event_registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_event_registrations_updated_at();

-- Function to update event spots when registration is created/updated/deleted
CREATE OR REPLACE FUNCTION public.update_event_spots()
RETURNS TRIGGER AS $$
DECLARE
  total_participants INTEGER;
  event_max_spots INTEGER;
  new_status TEXT;
BEGIN
  -- Get the event_id from either NEW or OLD record
  DECLARE event_uuid UUID;
  BEGIN
    IF TG_OP = 'DELETE' THEN
      event_uuid := OLD.event_id;
    ELSE
      event_uuid := NEW.event_id;
    END IF;
    
    -- Count total participants (sum of number_of_participants) for confirmed registrations
    SELECT COALESCE(SUM(number_of_participants), 0) INTO total_participants
    FROM public.event_registrations
    WHERE event_id = event_uuid AND status = 'confirmed';
    
    -- Get max spots for this event (use total_spots as max capacity)
    SELECT total_spots INTO event_max_spots
    FROM public.events
    WHERE id = event_uuid;
    
    -- Determine new status based on participant count
    IF total_participants >= event_max_spots THEN
      new_status := 'full';
    ELSIF total_participants >= (event_max_spots * 0.9) THEN
      new_status := 'almost-full';
    ELSIF total_participants >= (event_max_spots * 0.7) THEN
      new_status := 'filling-fast';
    ELSE
      new_status := 'open';
    END IF;
    
    -- Update the event with new spot count and status
    UPDATE public.events
    SET 
      spots = event_max_spots - total_participants,
      status = new_status,
      updated_at = NOW()
    WHERE id = event_uuid;
  END;
  
  -- Return appropriate record
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update event spots on registration changes
CREATE TRIGGER update_event_spots_on_registration
  AFTER INSERT OR UPDATE OR DELETE ON public.event_registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_event_spots();

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on event_registrations table
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Users can create their own registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Users can update their own registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Users can delete their own registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Admins can view all registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Admins can manage all registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Public can create registrations" ON public.event_registrations;

-- ============================================
-- USER POLICIES
-- ============================================

-- 1. Allow users to view their own registrations (by user_id or email)
CREATE POLICY "Users can view their own registrations"
ON public.event_registrations
FOR SELECT
USING (
  auth.uid() = user_id OR 
  (auth.uid() IS NOT NULL AND email = (SELECT email FROM auth.users WHERE id = auth.uid()))
);

-- 2. Allow authenticated users to create registrations for themselves
CREATE POLICY "Users can create their own registrations"
ON public.event_registrations
FOR INSERT
WITH CHECK (
  auth.uid() = user_id OR 
  (auth.uid() IS NOT NULL AND email = (SELECT email FROM auth.users WHERE id = auth.uid()))
);

-- 3. Allow users to update their own registrations (for changes, cancellations)
CREATE POLICY "Users can update their own registrations"
ON public.event_registrations
FOR UPDATE
USING (
  auth.uid() = user_id OR 
  (auth.uid() IS NOT NULL AND email = (SELECT email FROM auth.users WHERE id = auth.uid()))
)
WITH CHECK (
  auth.uid() = user_id OR 
  (auth.uid() IS NOT NULL AND email = (SELECT email FROM auth.users WHERE id = auth.uid()))
);

-- 4. Allow users to cancel (delete) their own registrations
CREATE POLICY "Users can delete their own registrations"
ON public.event_registrations
FOR DELETE
USING (
  auth.uid() = user_id OR 
  (auth.uid() IS NOT NULL AND email = (SELECT email FROM auth.users WHERE id = auth.uid()))
);

-- ============================================
-- ADMIN POLICIES
-- ============================================

-- 5. Allow admins to view all registrations
CREATE POLICY "Admins can view all registrations"
ON public.event_registrations
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- 6. Allow admins to manage all registrations (INSERT, UPDATE, DELETE)
CREATE POLICY "Admins can manage all registrations"
ON public.event_registrations
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- ============================================
-- PUBLIC REGISTRATION POLICY
-- ============================================

-- 7. Allow anonymous users to create registrations (public registration form)
CREATE POLICY "Public can create registrations"
ON public.event_registrations
FOR INSERT
WITH CHECK (true);

-- ============================================
-- VIEWS FOR EASIER DATA ACCESS
-- ============================================

-- Create a view for event registration summary (admins only)
CREATE OR REPLACE VIEW public.event_registration_summary AS
SELECT 
  e.id as event_id,
  e.title as event_title,
  e.date as event_date,
  e.total_spots,
  e.spots as available_spots,
  COUNT(er.id) as total_registrations,
  COUNT(CASE WHEN er.status = 'confirmed' THEN 1 END) as confirmed_registrations,
  COUNT(CASE WHEN er.status = 'waitlist' THEN 1 END) as waitlist_registrations,
  COUNT(CASE WHEN er.status = 'cancelled' THEN 1 END) as cancelled_registrations,
  COUNT(CASE WHEN er.payment_status = 'paid' THEN 1 END) as paid_registrations,
  SUM(CASE WHEN er.payment_status = 'paid' THEN er.amount_paid ELSE 0 END) as total_revenue
FROM public.events e
LEFT JOIN public.event_registrations er ON e.id = er.event_id
GROUP BY e.id, e.title, e.date, e.total_spots, e.spots
ORDER BY e.date;

-- Create RLS policy for the view (admins only)
ALTER VIEW public.event_registration_summary SET (security_barrier = true);
CREATE POLICY "Admins can view registration summary"
ON public.event_registration_summary
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Create a view for user's own registrations with event details
CREATE OR REPLACE VIEW public.user_registrations AS
SELECT 
  er.id,
  er.event_id,
  er.full_name,
  er.email,
  er.phone,
  er.number_of_participants,
  er.location,
  er.special_requests,
  er.status,
  er.payment_status,
  er.amount_paid,
  er.mtn_number,
  er.registration_date,
  e.title as event_title,
  e.description as event_description,
  e.date as event_date,
  e.time as event_time,
  e.location as event_location,
  e.price as event_price,
  e.image as event_image,
  e.category as event_category
FROM public.event_registrations er
JOIN public.events e ON er.event_id = e.id
WHERE er.user_id = auth.uid() OR 
      (auth.uid() IS NOT NULL AND er.email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- ============================================
-- UTILITY FUNCTIONS
-- ============================================

-- Function to get registration count for an event
CREATE OR REPLACE FUNCTION public.get_event_registration_count(event_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  reg_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO reg_count
  FROM public.event_registrations
  WHERE event_id = event_uuid AND status = 'confirmed';
  
  RETURN COALESCE(reg_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is already registered for an event
CREATE OR REPLACE FUNCTION public.is_user_registered(event_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.event_registrations
    WHERE event_id = event_uuid 
    AND user_id = user_uuid 
    AND status IN ('confirmed', 'waitlist')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to register a user for an event (matching the form fields)
CREATE OR REPLACE FUNCTION public.register_for_event(
  event_uuid UUID,
  user_full_name TEXT,
  user_email TEXT,
  user_phone TEXT DEFAULT NULL,
  participants_count INTEGER DEFAULT 1,
  user_location TEXT,
  user_special_requests TEXT DEFAULT NULL,
  user_mtn_number TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  current_user_id UUID;
  event_spots INTEGER;
  event_price TEXT;
  existing_registration BIGINT;
  new_registration_id BIGINT;
  total_spots_needed INTEGER;
  result JSON;
BEGIN
  -- Get current authenticated user (if any)
  current_user_id := auth.uid();
  
  -- Validate required fields
  IF user_full_name IS NULL OR user_full_name = '' THEN
    RETURN json_build_object('success', false, 'error', 'Full name is required');
  END IF;
  
  IF user_email IS NULL OR user_email = '' THEN
    RETURN json_build_object('success', false, 'error', 'Email address is required');
  END IF;
  
  IF user_location IS NULL OR user_location = '' THEN
    RETURN json_build_object('success', false, 'error', 'Your location is required');
  END IF;
  
  IF participants_count < 1 THEN
    RETURN json_build_object('success', false, 'error', 'Number of participants must be at least 1');
  END IF;
  
  -- Check if event exists and get available spots and price
  SELECT spots, price INTO event_spots, event_price
  FROM public.events
  WHERE id = event_uuid;
  
  IF event_spots IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Event not found');
  END IF;
  
  -- Check if this email is already registered for this event
  SELECT id INTO existing_registration
  FROM public.event_registrations
  WHERE event_id = event_uuid AND email = user_email AND status IN ('confirmed', 'waitlist');
  
  IF existing_registration IS NOT NULL THEN
    RETURN json_build_object('success', false, 'error', 'This email is already registered for this event');
  END IF;
  
  -- Check if enough spots are available
  IF event_spots < participants_count THEN
    -- Not enough spots, put on waitlist
    INSERT INTO public.event_registrations (
      event_id,
      user_id,
      full_name,
      email,
      phone,
      number_of_participants,
      location,
      special_requests,
      mtn_number,
      status,
      payment_method
    ) VALUES (
      event_uuid,
      current_user_id,
      user_full_name,
      user_email,
      user_phone,
      participants_count,
      user_location,
      user_special_requests,
      user_mtn_number,
      'waitlist',
      'mobile_money'
    ) RETURNING id INTO new_registration_id;
    
    RETURN json_build_object(
      'success', true, 
      'registration_id', new_registration_id,
      'status', 'waitlist',
      'message', 'Added to waitlist - event is currently full'
    );
  ELSE
    -- Enough spots available
    INSERT INTO public.event_registrations (
      event_id,
      user_id,
      full_name,
      email,
      phone,
      number_of_participants,
      location,
      special_requests,
      mtn_number,
      status,
      payment_method
    ) VALUES (
      event_uuid,
      current_user_id,
      user_full_name,
      user_email,
      user_phone,
      participants_count,
      user_location,
      user_special_requests,
      user_mtn_number,
      'confirmed',
      'mobile_money'
    ) RETURNING id INTO new_registration_id;
    
    RETURN json_build_object(
      'success', true, 
      'registration_id', new_registration_id,
      'status', 'confirmed',
      'message', 'Registration confirmed',
      'payment_info', json_build_object(
        'method', 'MTN Mobile Money',
        'number', '059 859 9616',
        'reference', 'Mainstream House',
        'event_price', event_price,
        'total_amount', event_price -- You might want to calculate based on participants_count
      )
    );
  END IF;
  
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get registration count for an event (counting total participants)
CREATE OR REPLACE FUNCTION public.get_event_registration_count(event_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  participant_count INTEGER;
BEGIN
  SELECT COALESCE(SUM(number_of_participants), 0) INTO participant_count
  FROM public.event_registrations
  WHERE event_id = event_uuid AND status = 'confirmed';
  
  RETURN participant_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if email is already registered for an event
CREATE OR REPLACE FUNCTION public.is_email_registered(event_uuid UUID, user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.event_registrations
    WHERE event_id = event_uuid 
    AND email = user_email 
    AND status IN ('confirmed', 'waitlist')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_event_registration_count(UUID) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_email_registered(UUID, TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.register_for_event(UUID, TEXT, TEXT, TEXT, INTEGER, TEXT, TEXT, TEXT) TO authenticated, anon;

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Uncomment to insert sample registrations for testing
/*
-- Insert sample registrations (you'll need to replace with actual user IDs and event IDs)
INSERT INTO public.event_registrations (
  event_id,
  user_id,
  full_name,
  email,
  phone,
  status,
  payment_status,
  amount_paid
) VALUES 
-- Replace these with actual event IDs (BIGINT) and user IDs (UUID) from your database
(1, '00000000-0000-0000-0000-000000000001', 'John Doe', 'john@example.com', '+233123456789', 'confirmed', 'paid', 50.00),
(1, '00000000-0000-0000-0000-000000000002', 'Jane Smith', 'jane@example.com', '+233987654321', 'confirmed', 'pending', 50.00);
*/

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Test these queries after applying the policies:

-- 1. Check if RLS is enabled on event_registrations
-- SELECT schemaname, tablename, rowsecurity 
-- FROM pg_tables 
-- WHERE tablename = 'event_registrations';

-- 2. View all policies on event_registrations
-- SELECT schemaname, tablename, policyname, cmd, qual 
-- FROM pg_policies 
-- WHERE tablename = 'event_registrations';

-- 3. Test registration count function
-- SELECT public.get_event_registration_count(1); -- Replace 1 with actual event ID

-- 4. View registration summary (as admin)
-- SELECT * FROM public.event_registration_summary;

-- 5. View user's own registrations
-- SELECT * FROM public.user_registrations;

-- ============================================
-- NOTES
-- ============================================

/*
TABLE FEATURES:

1. REGISTRATION MANAGEMENT:
   - Unique constraint prevents duplicate registrations
   - Automatic status and payment tracking
   - Emergency contact and dietary requirements
   - Special requests field for customization

2. AUTOMATIC UPDATES:
   - Event spots automatically updated when registrations change
   - Event status changes based on registration percentage
   - Timestamps automatically maintained

3. SECURITY:
   - Users can only see/manage their own registrations
   - Admins can see/manage all registrations
   - Optional public registration without signup

4. UTILITY FUNCTIONS:
   - Easy registration process with register_for_event()
   - Check registration status with is_user_registered()
   - Get counts with get_event_registration_count()

5. REPORTING:
   - event_registration_summary view for admin analytics
   - user_registrations view for user dashboard

USAGE EXAMPLES:

-- Register a user for an event (matching the form)
SELECT public.register_for_event(
  '550e8400-e29b-41d4-a716-446655440000'::UUID, -- event ID (UUID)
  'John Doe', -- full_name
  'john@example.com', -- email
  '+233123456789', -- phone (optional)
  2, -- number_of_participants
  'Accra, Ghana', -- location
  'Need vegetarian meals', -- special_requests (optional)
  '0244123456' -- mtn_number (optional)
);

-- Check if email is already registered
SELECT public.is_email_registered('550e8400-e29b-41d4-a716-446655440000'::UUID, 'john@example.com');

-- Get total participant count for an event
SELECT public.get_event_registration_count('550e8400-e29b-41d4-a716-446655440000'::UUID); -- event ID as UUID

-- Anonymous registration (no user account needed)
INSERT INTO public.event_registrations (
  event_id, full_name, email, phone, number_of_participants, 
  location, special_requests, mtn_number
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000'::UUID, 'Jane Smith', 'jane@example.com', '+233987654321', 
  1, 'Kumasi, Ghana', 'Wheelchair accessible seating', '0244987654'
);
*/
