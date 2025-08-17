import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  LogOut, 
  Settings, 
  User, 
  Shield, 
  Home,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function AdminHeader() {
  const { user, isAdmin, signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { toast } = useToast();

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      // Navigation will be handled by the auth context
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getUserInitials = (email: string) => {
    const parts = email.split('@')[0].split('.');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return email.slice(0, 2).toUpperCase();
  };

  // Show warning if user is not admin
  if (!isAdmin) {
    return (
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Alert variant="destructive" className="my-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Warning: You don't have admin privileges. Access to admin features may be restricted.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link to="/admin" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Admin Panel</h1>
                <p className="text-xs text-muted-foreground">Games & Connect</p>
              </div>
            </Link>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Shield className="h-3 w-3 mr-1" />
              Admin Access
            </Badge>
          </div>

          {/* Navigation and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Quick Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Main Site
                </Button>
              </Link>
            </nav>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" alt={user?.email || 'Admin'} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                      {user?.email ? getUserInitials(user.email) : 'AD'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Admin User</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link to="/admin/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link to="/admin/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  className="text-red-600 cursor-pointer"
                  onClick={handleSignOut}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span>Signing out...</span>
                    </>
                  ) : (
                    <>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
