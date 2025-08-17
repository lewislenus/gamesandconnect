# Admin Authentication Setup Guide

## Overview
This guide explains how to set up and use the admin authentication system for Games & Connect.

## Features Implemented

### 🔐 Authentication System
- **Secure Login/Logout**: Email and password authentication via Supabase Auth
- **Role-Based Access Control**: Admin role verification for protected routes
- **Session Management**: Persistent login sessions with automatic refresh
- **Protected Routes**: All admin pages require authentication and admin privileges

### 🚪 Admin Access Routes
- `/admin/login` - Admin login page
- `/admin` - Admin dashboard (protected)
- `/admin/events` - Create events (protected)
- `/admin/events/manage` - Manage events (protected)
- `/admin/registrations` - Manage registrations (protected)

### 🎨 UI Components
- **AdminLogin**: Beautiful login form with demo credentials
- **AdminHeader**: Header with user menu, logout, and navigation
- **ProtectedRoute**: HOC for route protection
- **AuthContext**: Global authentication state management

## Quick Setup (Simplified)

### 1. Create Admin Account
1. Go to your Supabase project dashboard
2. Navigate to **Authentication > Users**
3. Click **Add User** and create a user with one of these emails:
   - `admin@gamesconnect.com`
   - `admin@example.com`  
   - `admin@gmail.com`
4. Set a secure password for the admin account

### 2. Test Admin Access
1. Navigate to `http://localhost:8082/admin`
2. You'll be redirected to the login page
3. Use the email and password you created in Supabase
4. After successful login, you'll have full admin access

### 3. Admin Verification
The system checks if the logged-in user's email matches one of the predefined admin emails. This provides immediate admin access without complex database setup.

## Usage Instructions

### 1. Access Admin Panel
1. Navigate to `http://localhost:8082/admin`
2. You'll be redirected to `/admin/login` if not authenticated
3. Use the demo credentials provided on the login page
4. After successful login, you'll be redirected to the admin dashboard

### 2. Admin Navigation
- **Dashboard**: Overview with stats and quick actions
- **Events**: Create new events
- **Manage Events**: Edit/delete existing events  
- **Registrations**: Manage user registrations
- **User Menu**: Access profile, settings, and logout

### 3. Security Features
- **Auto-redirect**: Unauthenticated users redirected to login
- **Role Verification**: Non-admin users see access denied message
- **Session Persistence**: Login state maintained across browser sessions
- **Secure Logout**: Complete session cleanup on logout

## Development Notes

### Authentication Flow
1. User submits login credentials
2. Supabase Auth validates email/password
3. System checks user role in `profiles` table
4. Admin users get access, regular users get denied
5. Session maintained via Supabase Auth state

### Adding New Admin Users
To create additional admin users:

1. **Method 1 - Update Auth Context**:
   Edit `src/contexts/AuthContext.tsx` and add emails to the `adminEmails` array:
   ```typescript
   const adminEmails = [
     'admin@gamesconnect.com',
     'admin@example.com',
     'newadmin@yourdomain.com'  // Add new admin email here
   ];
   ```

2. **Method 2 - Supabase Dashboard**:
   - Create the user in Authentication > Users
   - Ensure their email matches one in the `adminEmails` array

### Customization Options
- **Roles**: Extend beyond 'admin'/'user' (e.g., 'moderator')
- **Permissions**: Add granular permissions per admin section
- **Branding**: Customize login page styling and branding
- **Features**: Add password reset, email verification, etc.

## Security Considerations

### ✅ Implemented
- Route protection with role verification
- Secure session management via Supabase Auth
- Database-level Row Level Security (RLS) policies
- Input validation and error handling

### 🔄 Recommended Enhancements
- Password complexity requirements
- Account lockout after failed attempts
- Multi-factor authentication (MFA)
- Audit logging for admin actions
- Regular session timeout

## Troubleshooting

### Common Issues

**1. "Cannot find module" errors**
- Restart TypeScript language server
- Check import paths are correct

**2. Authentication not working**
- Verify Supabase connection
- Check database migration was applied
- Confirm admin user exists in profiles table

**3. Access denied for admin user**
- Check user role in profiles table
- Verify RLS policies are correct
- Clear browser cache/localStorage

### Debug Steps
1. Check browser console for errors
2. Verify Supabase project URL and anon key
3. Test database connection in Supabase dashboard
4. Check user exists in auth.users and profiles tables

## Next Steps

### Immediate
1. Test the authentication flow
2. Create additional admin users if needed
3. Customize branding/styling as desired

### Future Enhancements
- Add user management interface
- Implement audit logging
- Add email notifications
- Create role-based permissions system
- Add API rate limiting

---

**Need Help?** Check the console for any error messages or reach out for additional support!
