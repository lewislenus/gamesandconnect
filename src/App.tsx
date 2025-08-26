import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminHeader from "./components/AdminHeader";
import HomePage from "./pages/HomePage";
import Events from "./pages/Events";
import Community from "./pages/Community";

import EventDetails from "./pages/EventDetails";
import UserRegistrations from "./pages/UserRegistrations";
import AdminLogin from "./pages/AdminLogin";
import AdminEvents from "./pages/AdminEvents";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRegistrations from "./pages/AdminRegistrations";
import AdminEventManagement from "./pages/AdminEventManagement";
import Teams from "./pages/Teams";
import TeamRed from "./pages/TeamRed";
import TeamGreen from "./pages/TeamGreen";
import TeamBlue from "./pages/TeamBlue";
import TeamYellow from "./pages/TeamYellow";
import NotFound from "./pages/NotFound";
import EventsDatabase from "./pages/EventsDatabase";

const queryClient = new QueryClient();

// Admin Layout Component
const AdminLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background">
    <AdminHeader />
    {children}
  </div>
);

// Main Site Layout Component  
const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background">
    <Navigation />
    {children}
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
            <Route path="/events" element={<MainLayout><Events /></MainLayout>} />
            <Route path="/events/:id" element={<MainLayout><EventDetails /></MainLayout>} />
            <Route path="/community" element={<MainLayout><Community /></MainLayout>} />

            <Route path="/my-registrations" element={<MainLayout><UserRegistrations /></MainLayout>} />
            <Route path="/teams" element={<MainLayout><Teams /></MainLayout>} />
            <Route path="/team-red" element={<MainLayout><TeamRed /></MainLayout>} />
            <Route path="/team-green" element={<MainLayout><TeamGreen /></MainLayout>} />
            <Route path="/team-blue" element={<MainLayout><TeamBlue /></MainLayout>} />
            <Route path="/team-yellow" element={<MainLayout><TeamYellow /></MainLayout>} />
            <Route path="/events-database" element={<MainLayout><EventsDatabase /></MainLayout>} />
            
            {/* Admin Login Route */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout><AdminDashboard /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/events" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout><AdminEvents /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/events/manage" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout><AdminEventManagement /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/registrations" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout><AdminRegistrations /></AdminLayout>
              </ProtectedRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
