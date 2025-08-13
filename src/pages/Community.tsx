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
      quote: "Games & Connect helped me find my tribe in Accra! I've made lifelong friends through trivia nights and beach trips.",
      rating: 5,
      events: 12
    },
    {
      name: "Kwame Asante",
      location: "Kumasi", 
      image: "👨🏾",
      quote: "The gaming tournaments are epic! I've improved my skills and won some prize money too. This community rocks!",
      rating: 5,
      events: 8
    },
    {
      name: "Ama Osei",
      location: "Tema",
      image: "👩🏾‍🦱",
      quote: "As someone new to Ghana, G&C made me feel at home immediately. The travel experiences are unforgettable!",
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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-accent to-secondary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Join Our Amazing Community
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed">
            Connect with 500+ young, vibrant Ghanaians who love games, adventures, and making memories together. 
            Your new best friends are waiting!
          </p>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {communityStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-2 inline-block">
                  <stat.icon className="h-8 w-8 text-white mx-auto" />
                </div>
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>

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
            <h2 className="text-4xl font-bold text-foreground mb-4">How to Join</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Getting started is easy! Follow these simple steps to become part of the family.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="text-4xl mb-4">📱</div>
                <CardTitle className="text-2xl">Step 1</CardTitle>
                <CardDescription>Join our WhatsApp group for event updates and community chat</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="text-4xl mb-4">👋</div>
                <CardTitle className="text-2xl">Step 2</CardTitle>
                <CardDescription>Introduce yourself and tell us about your interests</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="text-4xl mb-4">🎉</div>
                <CardTitle className="text-2xl">Step 3</CardTitle>
                <CardDescription>Register for your first event and start making friends!</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Connect?</h3>
            <p className="text-muted-foreground mb-6">Join our main WhatsApp group with 500+ members</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg">
                Join Main Group
              </Button>
              <Button variant="outline" size="lg">
                Join Accra Group
              </Button>
              <Button variant="outline" size="lg">
                Join Kumasi Group
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Member Stories */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Member Stories</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hear from our amazing community members about their experiences with Games & Connect
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
    </div>
  );
}