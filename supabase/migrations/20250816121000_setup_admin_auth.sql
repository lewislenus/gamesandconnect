-- Create a default admin user for authentication
-- First, we need to ensure there's a way to authenticate

-- Insert admin user record into admin_users table
-- This assumes the user will be created manually in Supabase Auth dashboard
-- or we'll use a simple email-based check

-- For now, let's create a simple function to check if a user is admin based on email
CREATE OR REPLACE FUNCTION public.is_admin_user(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Define admin emails here
  RETURN user_email IN (
    'admin@gamesconnect.com',
    'admin@example.com',
    'gamesandconnectgh@gmail.com'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.is_admin_user(TEXT) TO authenticated;

-- Create a simple view for admin users
CREATE OR REPLACE VIEW admin_user_emails AS
SELECT 
  id,
  email,
  created_at
FROM auth.users
WHERE email IN (
  'admin@gamesconnect.com',
  'admin@example.com'
);

-- Insert a record in admin_users table for the admin email if it exists
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Get the user ID for admin email if it exists
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'admin@gamesconnect.com'
  LIMIT 1;
  
  -- Insert into admin_users if we found the user
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO admin_users (user_id, is_active)
    VALUES (admin_user_id, true)
    ON CONFLICT (user_id) DO UPDATE SET is_active = true;
  END IF;
END $$;
