import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold">Verifying Access</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Please wait while we check your credentials...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // If admin access is required but user is not admin
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-red-900">Access Denied</h3>
                <p className="text-sm text-red-700 mt-1">
                  You don't have admin privileges to access this area.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Contact your administrator if you believe this is an error.
                </p>
              </div>
              <Button 
                onClick={() => window.history.back()} 
                variant="outline"
                className="mt-4"
              >
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User is authenticated and has required permissions
  return <>{children}</>;
}

// Higher-order component for admin routes
export function withAdminAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AdminProtectedComponent(props: P) {
    return (
      <ProtectedRoute requireAdmin={true}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

// Higher-order component for general protected routes
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}
