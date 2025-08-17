import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Users, MessageCircle, Star, Award, Handshake, ArrowRight } from 'lucide-react';

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

          <Button variant="hero" size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4">
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
                onClick={() => window.open('https://chat.whatsapp.com/invite-link', '_blank')}
              >
                Join Main Community
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => window.open('https://chat.whatsapp.com/accra-link', '_blank')}
              >
                Accra Adventurers
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => window.open('https://chat.whatsapp.com/kumasi-link', '_blank')}
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
                  <Button className="w-full mt-4" variant="community">
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
            <Button variant="outline" size="lg">
              Contact Us About Other Opportunities
            </Button>
          </div>
        </div>
      </section>
    </motion.div>
  );
}