-- SQL Script to Create Admin User in Supabase
-- Email: gamesandconnectgh@gmail.com
-- Password: Trewq12@@

-- Step 1: Check if user already exists
DO $$
DECLARE
    user_exists BOOLEAN;
    new_user_id UUID;
BEGIN
    -- Check if user already exists
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'gamesandconnectgh@gmail.com') INTO user_exists;
    
    IF NOT user_exists THEN
        -- Generate new UUID for the user
        new_user_id := gen_random_uuid();
        
        -- Create the user in auth.users table
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            invited_at,
            confirmation_token,
            confirmation_sent_at,
            recovery_token,
            recovery_sent_at,
            email_change_token_new,
            email_change,
            email_change_sent_at,
            last_sign_in_at,
            raw_app_meta_data,
            raw_user_meta_data,
            is_super_admin,
            created_at,
            updated_at,
            phone,
            phone_confirmed_at,
            phone_change,
            phone_change_token,
            phone_change_sent_at,
            email_change_token_current,
            email_change_confirm_status,
            banned_until,
            reauthentication_token,
            reauthentication_sent_at,
            is_sso_user,
            deleted_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            new_user_id,
            'authenticated',
            'authenticated',
            'gamesandconnectgh@gmail.com',
            crypt('Trewq12@@', gen_salt('bf')),
            NOW(),
            NOW(),
            '',
            NOW(),
            '',
            NULL,
            '',
            '',
            NULL,
            NULL,
            '{"provider": "email", "providers": ["email"]}',
            '{"full_name": "Games Connect Admin"}',
            FALSE,
            NOW(),
            NOW(),
            NULL,
            NULL,
            '',
            '',
            NULL,
            '',
            0,
            NULL,
            '',
            NULL,
            FALSE,
            NULL
        );

        -- Create identity record
        INSERT INTO auth.identities (
            provider_id,
            user_id,
            identity_data,
            provider,
            last_sign_in_at,
            created_at,
            updated_at
        ) VALUES (
            'gamesandconnectgh@gmail.com',
            new_user_id,
            format('{"sub":"%s","email":"gamesandconnectgh@gmail.com"}', new_user_id::text)::jsonb,
            'email',
            NOW(),
            NOW(),
            NOW()
        );
        
        RAISE NOTICE 'Admin user created successfully with ID: %', new_user_id;
    ELSE
        RAISE NOTICE 'User with email gamesandconnectgh@gmail.com already exists';
    END IF;
END $$;

-- Step 2: Verify the user was created
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users 
WHERE email = 'gamesandconnectgh@gmail.com';

-- Step 3: Optional - Add to admin_users table if it exists
DO $$
DECLARE
    admin_table_exists BOOLEAN;
    target_user_id UUID;
BEGIN
    -- Check if admin_users table exists
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'admin_users'
    ) INTO admin_table_exists;
    
    IF admin_table_exists THEN
        -- Get the user ID
        SELECT id INTO target_user_id 
        FROM auth.users 
        WHERE email = 'gamesandconnectgh@gmail.com';
        
        IF target_user_id IS NOT NULL THEN
            -- Check if record already exists
            IF NOT EXISTS(SELECT 1 FROM admin_users WHERE user_id = target_user_id) THEN
                INSERT INTO admin_users (user_id, is_active, created_at, updated_at)
                VALUES (target_user_id, true, NOW(), NOW());
                RAISE NOTICE 'Added user to admin_users table';
            ELSE
                -- Update existing record
                UPDATE admin_users 
                SET is_active = true, updated_at = NOW()
                WHERE user_id = target_user_id;
                RAISE NOTICE 'Updated existing admin_users record';
            END IF;
        END IF;
    ELSE
        RAISE NOTICE 'admin_users table does not exist, skipping';
    END IF;
END $$;
