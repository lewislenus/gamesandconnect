import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  UserPlus, 
  BarChart3, 
  Settings,
  Home,
  BookOpen
} from 'lucide-react';

export default function AdminNavigation() {
  const location = useLocation();

  const navItems = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Overview and analytics'
    },
    {
      href: '/admin/events',
      label: 'Create Event',
      icon: Calendar,
      description: 'Add new events'
    },
    {
      href: '/admin/events/manage',
      label: 'Manage Events',
      icon: Settings,
      description: 'Edit and delete events'
    },
    {
      href: '/admin/registrations',
      label: 'Registrations',
      icon: UserPlus,
      description: 'Manage participant registrations'
    },
    {
      href: '/admin/blog',
      label: 'Blog',
      icon: BookOpen,
      description: 'Manage blog posts and content'
    }
  ];

  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <div className="flex flex-wrap gap-2">
          <Link to="/">
            <Button variant="outline" size="sm">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
          
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link key={item.href} to={item.href}>
                <Button 
                  variant={isActive ? "default" : "outline"} 
                  size="sm"
                  className="transition-all duration-200"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
