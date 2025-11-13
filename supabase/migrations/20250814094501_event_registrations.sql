-- Create registrations table to store event registrations
CREATE TABLE public.registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    emergency_contact TEXT,
    dietary_requirements TEXT,
    additional_info TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'attended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    ticket_number TEXT,
    is_paid BOOLEAN DEFAULT FALSE,
    amount_paid DECIMAL(10, 2) DEFAULT 0.00,
    payment_method TEXT,
    payment_reference TEXT,
    attended_at TIMESTAMP WITH TIME ZONE
);

-- Create admin_users table first (needed for policies below)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE(user_id)
);

-- Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Only super admins can manage admin users
CREATE POLICY "Only super admins can manage admin users"
ON public.admin_users
FOR ALL
USING (
    auth.uid() IN (
        SELECT user_id FROM public.admin_users WHERE is_active = true
    )
);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Create policies for registrations table
-- Allow users to view their own registrations
CREATE POLICY "Users can view their own registrations" 
ON public.registrations
FOR SELECT 
USING (auth.uid() = user_id);

-- Allow users to create registrations
CREATE POLICY "Users can create registrations" 
ON public.registrations
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);

-- Allow users to update their own registrations if not cancelled
CREATE POLICY "Users can update their own registrations" 
ON public.registrations
FOR UPDATE 
USING (auth.uid() = user_id AND status != 'cancelled')
WITH CHECK (auth.uid() = user_id AND status != 'cancelled');

-- Allow admins to view all registrations
CREATE POLICY "Admins can view all registrations" 
ON public.registrations
FOR ALL 
USING (
    auth.uid() IN (
        SELECT user_id FROM public.admin_users WHERE is_active = true
    )
);

-- Create function to update spots count when registrations change
CREATE OR REPLACE FUNCTION update_event_spots()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status != 'cancelled' THEN
        -- Decrease available spots when new registration is added
        UPDATE public.events 
        SET spots = GREATEST(spots - 1, 0)
        WHERE id = NEW.event_id;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.status != 'cancelled' AND NEW.status = 'cancelled' THEN
            -- Increase available spots when registration is cancelled
            UPDATE public.events 
            SET spots = LEAST(spots + 1, total_spots)
            WHERE id = NEW.event_id;
        ELSIF OLD.status = 'cancelled' AND NEW.status != 'cancelled' THEN
            -- Decrease available spots when cancelled registration is reactivated
            UPDATE public.events 
            SET spots = GREATEST(spots - 1, 0)
            WHERE id = NEW.event_id;
        END IF;
    ELSIF TG_OP = 'DELETE' AND OLD.status != 'cancelled' THEN
        -- Increase available spots when registration is deleted
        UPDATE public.events 
        SET spots = LEAST(spots + 1, total_spots)
        WHERE id = OLD.event_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for registrations
CREATE TRIGGER update_event_spots_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.registrations
FOR EACH ROW
EXECUTE FUNCTION update_event_spots();

-- Create registration_logs table to track registration changes
CREATE TABLE public.registration_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID REFERENCES public.registrations(id) ON DELETE CASCADE,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    old_status TEXT,
    new_status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    notes TEXT
);

-- Enable RLS on registration_logs
ALTER TABLE public.registration_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view logs
CREATE POLICY "Only admins can view registration logs"
ON public.registration_logs
FOR SELECT
USING (
    auth.uid() IN (
        SELECT user_id FROM public.admin_users WHERE is_active = true
    )
);

-- Create function to log registration changes
CREATE OR REPLACE FUNCTION log_registration_change()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.registration_logs (
            registration_id, event_id, user_id, action, new_status
        ) VALUES (
            NEW.id, NEW.event_id, NEW.user_id, 'created', NEW.status
        );
    ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
        INSERT INTO public.registration_logs (
            registration_id, event_id, user_id, action, old_status, new_status
        ) VALUES (
            NEW.id, NEW.event_id, NEW.user_id, 'status_changed', OLD.status, NEW.status
        );
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO public.registration_logs (
            registration_id, event_id, user_id, action, old_status
        ) VALUES (
            OLD.id, OLD.event_id, OLD.user_id, 'deleted', OLD.status
        );
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for registration logs
CREATE TRIGGER log_registration_change_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.registrations
FOR EACH ROW
EXECUTE FUNCTION log_registration_change();

-- Add index to improve query performance
CREATE INDEX idx_registrations_event_id ON public.registrations(event_id);
CREATE INDEX idx_registrations_user_id ON public.registrations(user_id);
CREATE INDEX idx_registrations_status ON public.registrations(status);
CREATE INDEX idx_registration_logs_registration_id ON public.registration_logs(registration_id);
CREATE INDEX idx_registration_logs_event_id ON public.registration_logs(event_id);

-- Create ticket_templates table to store event ticket templates
CREATE TABLE public.ticket_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    template_name TEXT NOT NULL,
    template_html TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(event_id, template_name)
);

-- Enable RLS on ticket_templates
ALTER TABLE public.ticket_templates ENABLE ROW LEVEL SECURITY;

-- Only admins can manage ticket templates
CREATE POLICY "Only admins can manage ticket templates"
ON public.ticket_templates
FOR ALL
USING (
    auth.uid() IN (
        SELECT user_id FROM public.admin_users WHERE is_active = true
    )
);

-- Add default ticket template for all events
INSERT INTO public.ticket_templates (
    event_id,
    template_name,
    template_html
)
SELECT 
    id, 
    'Default Template',
    '<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
        <div style="text-align: center; padding: 20px 0;">
            <h1 style="color: #333;">{{event_title}}</h1>
            <p style="font-size: 18px;">{{event_date}} at {{event_time}}</p>
            <p style="font-size: 16px;">{{event_location}}</p>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9; margin: 20px 0; border-radius: 5px;">
            <h2 style="margin-top: 0;">Attendee Information</h2>
            <p><strong>Name:</strong> {{attendee_name}}</p>
            <p><strong>Email:</strong> {{attendee_email}}</p>
            <p><strong>Phone:</strong> {{attendee_phone}}</p>
            <p><strong>Ticket Number:</strong> {{ticket_number}}</p>
        </div>
        <div style="padding: 20px; border-top: 1px solid #ddd;">
            <h3>Event Details</h3>
            <p>{{event_description}}</p>
            <p><strong>Organized by:</strong> {{event_organizer}}</p>
        </div>
        <div style="text-align: center; padding: 20px; margin-top: 20px;">
            <img src="data:image/png;base64,{{qr_code}}" alt="QR Code" style="max-width: 200px;"/>
            <p style="font-size: 14px; color: #666; margin-top: 10px;">Please present this ticket (printed or digital) at the event entrance.</p>
        </div>
    </div>'
FROM public.events;

-- Create waitlist table for full events
CREATE TABLE public.waitlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'notified', 'registered', 'expired')),
    notified_at TIMESTAMP WITH TIME ZONE,
    notification_count INTEGER DEFAULT 0,
    UNIQUE(event_id, email)
);

-- Enable RLS on waitlist
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow users to join waitlist
CREATE POLICY "Users can join waitlist"
ON public.waitlist
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Allow users to view their own waitlist entries
CREATE POLICY "Users can view their own waitlist entries"
ON public.waitlist
FOR SELECT
USING (auth.uid() = user_id);

-- Allow admins to manage waitlist
CREATE POLICY "Admins can manage waitlist"
ON public.waitlist
FOR ALL
USING (
    auth.uid() IN (
        SELECT user_id FROM public.admin_users WHERE is_active = true
    )
);

-- Create function to notify waitlist when spots become available
CREATE OR REPLACE FUNCTION notify_waitlist()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' AND OLD.spots < NEW.spots AND NEW.spots > 0 THEN
        -- Update waitlist entries to 'notified' status for the oldest waiting entries
        -- up to the number of new spots available
        UPDATE public.waitlist
        SET status = 'notified', notified_at = now(), notification_count = notification_count + 1
        WHERE id IN (
            SELECT id FROM public.waitlist
            WHERE event_id = NEW.id AND status = 'waiting'
            ORDER BY created_at ASC
            LIMIT NEW.spots
        );
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for waitlist notifications
CREATE TRIGGER notify_waitlist_trigger
AFTER UPDATE ON public.events
FOR EACH ROW
WHEN (OLD.spots < NEW.spots AND NEW.spots > 0)
EXECUTE FUNCTION notify_waitlist();

-- Create table for event feedback/ratings
CREATE TABLE public.event_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    registration_id UUID REFERENCES public.registrations(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    feedback_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    is_anonymous BOOLEAN DEFAULT FALSE,
    UNIQUE(event_id, user_id)
);

-- Enable RLS on event_feedback
ALTER TABLE public.event_feedback ENABLE ROW LEVEL SECURITY;

-- Allow users to submit and view their own feedback
CREATE POLICY "Users can submit and view their own feedback"
ON public.event_feedback
FOR ALL
USING (auth.uid() = user_id);

-- Allow admins to view all feedback
CREATE POLICY "Admins can view all feedback"
ON public.event_feedback
FOR SELECT
USING (
    auth.uid() IN (
        SELECT user_id FROM public.admin_users WHERE is_active = true
    )
);

-- Function to update event average rating when feedback is submitted
CREATE OR REPLACE FUNCTION update_event_rating()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate new average rating for the event
    UPDATE public.events
    SET rating = (
        SELECT ROUND(AVG(rating)::numeric, 1)
        FROM public.event_feedback
        WHERE event_id = NEW.event_id
    )
    WHERE id = NEW.event_id;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating event ratings
CREATE TRIGGER update_event_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.event_feedback
FOR EACH ROW
EXECUTE FUNCTION update_event_rating();

-- Add rating column to events table if it doesn't exist
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS rating NUMERIC(3,1) DEFAULT NULL;

-- Create stored procedure for confirming registrations and generating ticket numbers
CREATE OR REPLACE PROCEDURE confirm_registration(
    registration_id UUID,
    admin_id UUID DEFAULT NULL,
    payment_method TEXT DEFAULT NULL,
    payment_reference TEXT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
DECLARE
    event_record RECORD;
    ticket_prefix TEXT;
    next_number INT;
BEGIN
    -- Get event info
    SELECT e.id, e.title INTO event_record
    FROM public.registrations r
    JOIN public.events e ON r.event_id = e.id
    WHERE r.id = registration_id;
    
    -- Generate ticket prefix from event title (first letters of each word)
    SELECT STRING_AGG(LEFT(word, 1), '') INTO ticket_prefix
    FROM regexp_split_to_table(UPPER(event_record.title), '\s+') AS word;
    
    -- Get next number for this event
    SELECT COALESCE(MAX(SUBSTRING(ticket_number FROM '^[A-Z]+-(\d+)$')::INT), 0) + 1 INTO next_number
    FROM public.registrations
    WHERE event_id = event_record.id AND ticket_number IS NOT NULL;
    
    -- Update registration
    UPDATE public.registrations
    SET 
        status = 'confirmed',
        ticket_number = ticket_prefix || '-' || LPAD(next_number::TEXT, 4, '0'),
        is_paid = TRUE,
        updated_at = now(),
        payment_method = COALESCE(confirm_registration.payment_method, payment_method),
        payment_reference = COALESCE(confirm_registration.payment_reference, payment_reference)
    WHERE id = registration_id;
    
    -- Log the confirmation
    INSERT INTO public.registration_logs (
        registration_id, event_id, user_id, action, old_status, new_status, admin_id, notes
    )
    SELECT
        r.id, r.event_id, r.user_id, 'confirmation', 'pending', 'confirmed', confirm_registration.admin_id,
        'Payment received via ' || COALESCE(confirm_registration.payment_method, 'unknown')
    FROM public.registrations r
    WHERE r.id = registration_id;
    
END;
$$;

-- Create a view for event statistics
CREATE OR REPLACE VIEW public.event_statistics AS
SELECT
    e.id AS event_id,
    e.title,
    e.date,
    e.category,
    e.total_spots,
    e.spots AS available_spots,
    (e.total_spots - e.spots) AS registered_count,
    ROUND(((e.total_spots - e.spots)::numeric / e.total_spots::numeric) * 100, 1) AS fill_percentage,
    COUNT(DISTINCT r.id) FILTER (WHERE r.status = 'confirmed') AS confirmed_count,
    COUNT(DISTINCT r.id) FILTER (WHERE r.status = 'pending') AS pending_count,
    COUNT(DISTINCT r.id) FILTER (WHERE r.status = 'cancelled') AS cancelled_count,
    COUNT(DISTINCT r.id) FILTER (WHERE r.status = 'attended') AS attended_count,
    COUNT(DISTINCT w.id) AS waitlist_count,
    COALESCE(e.rating, 0) AS average_rating,
    COUNT(DISTINCT f.id) AS feedback_count,
    CASE
        WHEN e.date::date < CURRENT_DATE THEN 'past'
        WHEN e.date::date = CURRENT_DATE THEN 'today'
        ELSE 'upcoming'
    END AS event_status
FROM
    public.events e
LEFT JOIN
    public.registrations r ON e.id = r.event_id
LEFT JOIN
    public.waitlist w ON e.id = w.event_id AND w.status = 'waiting'
LEFT JOIN
    public.event_feedback f ON e.id = f.event_id
GROUP BY
    e.id, e.title, e.date, e.category, e.total_spots, e.spots, e.rating;
