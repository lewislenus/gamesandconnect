import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Users, MessageCircle, Star, Award, Handshake, ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Community() {
  const testimonials = [
    {
      name: "Akosua Mensah",
      location: "Accra",
      image: "👩🏾",
      quote: "G&C turned me from a weekend Netflix binger into an adventure seeker! From beach cleanups to mountain hikes, I've discovered a Ghana I never knew existed.",
      rating: 5,
      events: 12
    },
    {
      name: "Kwame Asante",
      location: "Kumasi", 
      image: "👨🏾",
      quote: "The gaming community here is incredible! I've leveled up my FIFA skills, won tournaments, and built friendships that extend way beyond gaming.",
      rating: 5,
      events: 8
    },
    {
      name: "Ama Osei",
      location: "Tema",
      image: "👩🏾‍🦱",
      quote: "Through G&C's networking events, I connected with my current business partners and mentors. This community changed my career trajectory completely!",
      rating: 5,
      events: 15
    }
  ];

  const communityStats = [
    { label: "Active Members", value: "500+", icon: Users },
    { label: "WhatsApp Groups", value: "3", icon: MessageCircle },
    { label: "Cities", value: "8", icon: Heart },
    { label: "Events This Year", value: "48", icon: Star },
  ];

  const loyaltyTiers = [
    {
      name: "Explorer",
      requirement: "0-3 events",
      benefits: ["Welcome kit", "Event notifications", "Community chat access"],
      color: "bg-muted"
    },
    {
      name: "Adventurer", 
      requirement: "4-9 events",
      benefits: ["Priority registration", "10% event discounts", "Exclusive content"],
      color: "bg-primary/10 border-primary/20"
    },
    {
      name: "Champion",
      requirement: "10+ events",
      benefits: ["VIP access", "Free merchandise", "Event planning input", "Leadership opportunities"],
      color: "bg-secondary/10 border-secondary/20"
    }
  ];

  const volunteerRoles = [
    {
      title: "Event Coordinator",
      description: "Help organize and manage events from start to finish",
      commitment: "2-3 hours per event",
      benefits: "Free event access, leadership experience"
    },
    {
      title: "Social Media Manager",
      description: "Create content and manage our online presence",
      commitment: "3-4 hours per week", 
      benefits: "Portfolio building, marketing skills"
    },
    {
      title: "Community Ambassador",
      description: "Welcome new members and represent G&C in your city",
      commitment: "Flexible",
      benefits: "Networking, referral bonuses"
    }
  ];

  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-accent to-secondary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="text-4xl lg:text-5xl font-bold text-white mb-6"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Where Adventure Begins
          </motion.h1>
          <motion.p 
            className="text-xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Join 500+ young, vibrant Ghanaians who live by our motto: Play, Travel, and Connect. 
            Your tribe of adventurers, gamers, and explorers is waiting!
          </motion.p>
          
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {communityStats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="text-center"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-2 inline-block">
                  <stat.icon className="h-8 w-8 text-white mx-auto" />
                </div>
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          <Button 
            variant="hero" 
            size="lg" 
            className="bg-green-500 text-white hover:bg-green-600 text-lg px-8 py-4"
            onClick={() => window.open('https://chat.whatsapp.com/LT0Zolnz9fMLm7b7aKtQld', '_blank')}
          >
            Join WhatsApp Group
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* How to Join */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Your Journey Starts Here</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ready to play, travel, and connect? Follow these simple steps to join Ghana's most adventurous community.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="text-4xl mb-4">🎮</div>
                <CardTitle className="text-2xl">Step 1: Play</CardTitle>
                <CardDescription>Join our gaming tournaments and challenges to showcase your skills</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="text-4xl mb-4">✈️</div>
                <CardTitle className="text-2xl">Step 2: Travel</CardTitle>
                <CardDescription>Explore Ghana's beauty through our organized adventures and trips</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="text-4xl mb-4">🤝</div>
                <CardTitle className="text-2xl">Step 3: Connect</CardTitle>
                <CardDescription>Build lasting friendships and professional networks with like-minded people</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">Ready for Adventure?</h3>
            <p className="text-muted-foreground mb-6">Connect with adventurers across Ghana through our WhatsApp communities</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="hero" 
                size="lg"
                onClick={() => window.open('https://chat.whatsapp.com/LT0Zolnz9fMLm7b7aKtQld', '_blank')}
              >
                Join Main Community
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => window.open('https://chat.whatsapp.com/LT0Zolnz9fMLm7b7aKtQld', '_blank')}
              >
                Accra Adventurers
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => window.open('https://chat.whatsapp.com/LT0Zolnz9fMLm7b7aKtQld', '_blank')}
              >
                Kumasi Explorers
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Member Stories */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Adventure Stories</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hear how our community members have embraced the play, travel, and connect lifestyle
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">{testimonial.image}</div>
                    <div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                      <CardDescription>{testimonial.location}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                    <Badge variant="outline">{testimonial.events} events attended</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Loyalty Program */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Loyalty Rewards</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The more events you attend, the more benefits you unlock. Everyone starts as an Explorer!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {loyaltyTiers.map((tier, index) => (
              <Card key={index} className={`border-2 ${tier.color} transition-all duration-300 hover:shadow-lg`}>
                <CardHeader className="text-center">
                  <div className="text-2xl mb-2">
                    {index === 0 ? '🗺️' : index === 1 ? '🎯' : '👑'}
                  </div>
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <CardDescription className="font-semibold">{tier.requirement}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tier.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Opportunities */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Volunteer With Us</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Help shape our community and gain valuable experience while giving back
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {volunteerRoles.map((role, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="text-3xl mb-2">
                    {index === 0 ? '📋' : index === 1 ? '📱' : '🌟'}
                  </div>
                  <CardTitle className="text-xl">{role.title}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-semibold text-primary">Time Commitment</div>
                      <div className="text-sm text-muted-foreground">{role.commitment}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-primary">Benefits</div>
                      <div className="text-sm text-muted-foreground">{role.benefits}</div>
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-4" 
                    variant="community"
                    onClick={() => window.open('https://chat.whatsapp.com/LT0Zolnz9fMLm7b7aKtQld', '_blank')}
                  >
                    Apply to Volunteer
                    <Handshake className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Interested in volunteering but don't see the right fit?
            </p>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => window.open('https://chat.whatsapp.com/LT0Zolnz9fMLm7b7aKtQld', '_blank')}
            >
              Contact Us About Other Opportunities
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
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
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.80l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
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
                    <Link to="/events" className="text-white/80 hover:text-primary transition-colors duration-200">
                      Upcoming Events
                    </Link>
                  </li>
                  <li>
                    <Link to="/community" className="text-white/80 hover:text-primary transition-colors duration-200">
                      Community
                    </Link>
                  </li>
                  <li>
                    <Link to="/team-red" className="text-white/80 hover:text-primary transition-colors duration-200">
                      Join a Team
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact & Info */}
              <div>
                <h4 className="font-semibold text-orange-400 mb-4">Get In Touch</h4>
                <ul className="space-y-3 text-sm text-white/80">
                  <li className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>Accra, Ghana</span>
                  </li>
                  <li>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-white/80 hover:text-primary p-0 h-auto font-normal justify-start"
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
                      <div className="text-lg font-bold text-primary">200+</div>
                      <div className="text-white/60">Members</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">48+</div>
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
                  className="hover:text-primary transition-colors duration-200"
                >
                  Privacy Policy
                </button>
                <button 
                  onClick={() => alert('Terms of service coming soon!')}
                  className="hover:text-primary transition-colors duration-200"
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
    </motion.div>
  );
}