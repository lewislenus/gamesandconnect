import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, Calendar, Users, Image, Gamepad2, Ticket } from 'lucide-react';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'Community', path: '/community', icon: Users },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className="flex items-center hover:opacity-80 transition-opacity duration-300"
          >
            <img 
              src="https://res.cloudinary.com/drkjnrvtu/image/upload/v1755287885/gameskkc_ytwhpi.png"
              alt="Games & Connect Logo"
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-all duration-300 ${
                  isActive(item.path)
                    ? 'text-primary font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.name.toUpperCase()}
              </Link>
            ))}
            <div className="flex space-x-4">
              <Link to="/my-registrations">
                <Button variant="outline" size="sm" className="rounded-full">
                  <Ticket className="mr-2 h-4 w-4" />
                  My Adventures
                </Button>
              </Link>
              <Link to="/events">
                <Button size="sm" className="rounded-full">
                  Join the Journey
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 ${
                    isActive(item.path)
                      ? 'text-primary font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name.toUpperCase()}
                </Link>
              ))}
              <div className="px-3 py-2">
                <Link to="/my-registrations" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full rounded-full mb-2">
                    <Ticket className="mr-2 h-4 w-4" />
                    My Adventures
                  </Button>
                </Link>
                <Link to="/events" onClick={() => setIsOpen(false)}>
                  <Button className="w-full rounded-full">
                    Join the Journey
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};