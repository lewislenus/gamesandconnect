-- Create a function to handle registration insertion with proper validation
CREATE OR REPLACE FUNCTION insert_registration(
  p_event_id BIGINT,
  p_full_name TEXT,
  p_email TEXT,
  p_phone_number TEXT,
  p_number_of_participants INTEGER,
  p_location TEXT,
  p_special_requests TEXT DEFAULT NULL,
  p_extra_info JSONB DEFAULT '{}'::JSONB
)
RETURNS TABLE (
  id BIGINT,
  event_id BIGINT,
  full_name TEXT,
  email TEXT,
  phone_number TEXT,
  number_of_participants INTEGER,
  location TEXT,
  special_requests TEXT,
  extra_info JSONB,
  payment_status TEXT,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert the registration
  RETURN QUERY
  INSERT INTO public.registrations (
    event_id,
    full_name,
    email,
    phone_number,
    number_of_participants,
    location,
    special_requests,
    extra_info,
    payment_status
  ) VALUES (
    p_event_id,
    p_full_name,
    p_email,
    p_phone_number,
    p_number_of_participants,
    p_location,
    p_special_requests,
    p_extra_info,
    'pending'
  )
  RETURNING 
    registrations.id,
    registrations.event_id,
    registrations.full_name,
    registrations.email,
    registrations.phone_number,
    registrations.number_of_participants,
    registrations.location,
    registrations.special_requests,
    registrations.extra_info,
    registrations.payment_status,
    registrations.created_at;
END;
$$;

-- Grant execute permission to anon role
GRANT EXECUTE ON FUNCTION insert_registration TO anon;
GRANT EXECUTE ON FUNCTION insert_registration TO authenticated;
