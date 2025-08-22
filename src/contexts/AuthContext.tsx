import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  checkAdminStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check if user is admin
  const checkAdminStatus = async (emailParam?: string): Promise<boolean> => {
    const emailToCheck = emailParam ?? user?.email;
    if (!emailToCheck) {
      console.log('❌ No user or email found');
      return false;
    }

    try {
      // Simple admin check based on email for now
      // This can be extended to use database roles later
      const adminEmails = [
        'admin@gamesconnect.com',
        'admin@example.com',
        'admin@gmail.com',
        'gamesandconnectgh@gmail.com'
      ];
      
      console.log('🔍 Checking admin status for:', emailToCheck);
      console.log('📋 Admin emails list:', adminEmails);
      
      const adminStatus = adminEmails.includes(emailToCheck.toLowerCase());
      console.log('✅ Admin status result:', adminStatus);
      
      setIsAdmin(adminStatus);
      return adminStatus;
    } catch (error) {
      console.error('❌ Error checking admin status:', error);
      return false;
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        console.log('🔐 User signed in:', data.user.email);
        setUser(data.user);
        setSession(data.session);
        
        // Check admin status (pass email directly to avoid state timing issues)
        console.log('🔍 Checking admin status...');
        const adminStatus = await checkAdminStatus(data.user.email ?? undefined);
        console.log('📊 Admin check result:', adminStatus);
        
        if (!adminStatus) {
          console.log('❌ User is not admin, signing out...');
          await signOut();
          return { success: false, error: 'Access denied. Admin privileges required.' };
        }

        console.log('✅ Admin access granted!');
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in to the admin panel.",
        });

        return { success: true };
      }

      return { success: false, error: 'Login failed' };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          setSession(session);
          setUser(session.user);
          await checkAdminStatus(session.user.email ?? undefined);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (session?.user) {
          setSession(session);
          setUser(session.user);
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            await checkAdminStatus(session.user.email ?? undefined);
          }
        } else {
          setSession(null);
          setUser(null);
          setIsAdmin(false);
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    user,
    session,
    isAdmin,
    isLoading,
    signIn,
    signOut,
    checkAdminStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
