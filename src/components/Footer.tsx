import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <img 
                  src="https://res.cloudinary.com/drkjnrvtu/image/upload/v1756502369/games_logo_1_gbimmw.svg"
                  alt="Games & Connect"
                  className="h-10 w-auto"
                />
              </div>
              <p className="text-white/80 mb-6 max-w-md leading-relaxed">
                Ghana's most vibrant community where adventure meets connection. Join us for gaming, travel experiences, and meaningful relationships that last a lifetime.
              </p>
              <div className="mb-6">
                <h4 className="font-semibold text-orange-400 mb-3">Our Mission</h4>
                <p className="text-white/70 text-sm leading-relaxed">
                  To create unforgettable experiences through play, travel, and genuine human connection while celebrating the rich culture of Ghana.
                </p>
              </div>
              {/* Social Links */}
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  size="icon"
                  className="bg-green-600 border-green-500 hover:bg-green-700 text-white"
                  onClick={() => window.open('https://chat.whatsapp.com/LT0Zolnz9fMLm7b7aKtQld', '_blank')}
                  title="WhatsApp"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.488"/>
                  </svg>
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 border-transparent hover:from-purple-600 hover:to-pink-600 text-white"
                  onClick={() => window.open('https://www.instagram.com/games_connect_gh/', '_blank')}
                  title="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="bg-blue-600 border-blue-500 hover:bg-blue-700 text-white"
                  onClick={() => window.open('https://www.facebook.com/gamesandconnect', '_blank')}
                  title="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="bg-black border-gray-700 hover:bg-gray-900 text-white"
                  onClick={() => window.open('https://x.com/GamesConnect_gh', '_blank')}
                  title="X (Twitter)"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="bg-black border-gray-700 hover:bg-gray-900 text-white"
                  onClick={() => window.open('https://www.tiktok.com/@games_and_connect', '_blank')}
                  title="TikTok"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-orange-400 mb-4">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link to="/events" className="text-white/80 hover:text-orange-400 transition-colors duration-200">
                    Upcoming Events
                  </Link>
                </li>
                <li>
                  <Link to="/community" className="text-white/80 hover:text-orange-400 transition-colors duration-200">
                    Community
                  </Link>
                </li>
                <li>
                  <Link to="/teams" className="text-white/80 hover:text-orange-400 transition-colors duration-200">
                    Join a Team
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-white/80 hover:text-orange-400 transition-colors duration-200">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-white/80 hover:text-orange-400 transition-colors duration-200">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact & Info */}
            <div>
              <h4 className="font-semibold text-orange-400 mb-4">Get In Touch</h4>
              <ul className="space-y-3 text-sm text-white/80">
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-400" />
                  <span>Accra, Ghana</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-orange-400" />
                  <a 
                    href="tel:+233505891665"
                    className="hover:text-orange-400 transition-colors duration-200"
                  >
                    +233 50 589 1665
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-orange-400" />
                  <a 
                    href={`mailto:${import.meta.env.VITE_ORGANIZER_EMAIL || 'events@gamesandconnect.com'}`}
                    className="hover:text-orange-400 transition-colors duration-200"
                  >
                    {import.meta.env.VITE_ORGANIZER_EMAIL || 'events@gamesandconnect.com'}
                  </a>
                </li>
                <li>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-white/80 hover:text-orange-400 p-0 h-auto font-normal justify-start"
                    onClick={() => window.open('https://chat.whatsapp.com/LT0Zolnz9fMLm7b7aKtQld', '_blank')}
                  >
                    Join WhatsApp Community
                  </Button>
                </li>
              </ul>

              {/* Stats */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <h5 className="font-medium text-white mb-3">Community Stats</h5>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-400">200+</div>
                    <div className="text-white/60">Members</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-400">48+</div>
                    <div className="text-white/60">Events</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-white/60">
              © 2025 Games & Connect. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm text-white/60">
              <button 
                onClick={() => alert('Privacy policy coming soon!')}
                className="hover:text-orange-400 transition-colors duration-200"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => alert('Terms of service coming soon!')}
                className="hover:text-orange-400 transition-colors duration-200"
              >
                Terms of Service
              </button>
              <span>•</span>
              <span>Play. Travel. Connect.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

