import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Lock, Mail, Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn(email, password);
      
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div 
            className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 200 }}
          >
            <Shield className="h-8 w-8 text-white" />
          </motion.div>
          <motion.h1 
            className="text-3xl font-bold text-gray-900 mb-2"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Admin Portal
          </motion.h1>
          <motion.p 
            className="text-gray-600"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Sign in to access the Games & Connect admin dashboard
          </motion.p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 1.0, type: "spring", stiffness: 100 }}
        >
          <Card className="shadow-lg">
            <CardHeader className="space-y-1">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                <CardTitle className="text-2xl text-center">Sign In</CardTitle>
                <CardDescription className="text-center">
                  Enter your admin credentials to continue
                </CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                <motion.div 
                  className="space-y-2"
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.4 }}
                >
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                      autoComplete="email"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div 
                  className="space-y-2"
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.6 }}
                >
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      disabled={isLoading}
                      autoComplete="current-password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.8 }}
                >
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <motion.div
                        className="flex items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Signing In...
                      </motion.div>
                    ) : (
                      <motion.div
                        className="flex items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Sign In to Admin Panel
                      </motion.div>
                    )}
                  </Button>
                </motion.div>
            </form>

            {/* Demo Credentials Info */}
            <motion.div 
              className="mt-6 p-4 bg-blue-50 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 2.0 }}
            >
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                Demo Admin Access
              </h4>
              <div className="text-xs text-blue-700 space-y-1">
                <p><strong>Step 1:</strong> Create a Supabase account with these emails:</p>
                <p>• admin@gamesconnect.com</p>
                <p>• admin@example.com</p>
                <p>• admin@gmail.com</p>
                <p>• gamesandconnectgh@gmail.com</p>
                <p className="text-blue-600 mt-2">
                  <strong>Step 2:</strong> Use your chosen email and password to sign in
                </p>
                <p className="text-blue-500 text-xs mt-1">
                  💡 Tip: Click the eye icon to show/hide your password while typing
                </p>
                <p className="text-blue-500 text-xs">
                  Note: Create the account in Supabase Auth first, then use those credentials here
                </p>
              </div>
            </motion.div>
          </CardContent>
        </Card>
        </motion.div>

        {/* Footer */}
        <motion.div 
          className="text-center mt-8 text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 2.2 }}
        >
          <p>© 2025 Games & Connect. All rights reserved.</p>
          <p className="mt-1">
            Secure admin access powered by Supabase Auth
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
