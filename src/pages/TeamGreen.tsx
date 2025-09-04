import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Trophy, Calendar, MapPin, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TeamGreen() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const teamImages = [
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915398/_MG_2403_hknyss.jpg",
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915399/_MG_2214_zq4dzb.jpg",
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915389/_MG_2356_nlkxwl.jpg",
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915382/_MG_2210_swxpme.jpg",
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746918852/_MG_2336_mxnylu.jpg"
  ];

  const teamMembers = [
    {
      name: "Akosua B.",
      role: "Team Captain",
      avatar: "👩🏿‍🌾",
      quote: "Team Green is about growth, balance, and sustainability. We build lasting connections and meaningful victories.",
      joinedDate: "Feb 2025",
      achievements: ["Aburi Gardens Champion", "Nature Expert", "Strategic Leader"]
    },
    {
      name: "Kofi T.",
      role: "Nature Guide",
      avatar: "👨🏿‍🔬",
      quote: "Every game we play, every event we attend, we think about the bigger picture and our impact.",
      joinedDate: "Jan 2025",
      achievements: ["Botanical Gardens Expert", "Hiking Leader", "Environmental Mentor"]
    },
    {
      name: "Adwoa M.",
      role: "Adventure Strategist",
      avatar: "👩🏿‍💼",
      quote: "True strength comes from helping others grow. Team Green nurtures talent and builds futures.",
      joinedDate: "Mar 2025",
      achievements: ["Trail Navigator", "Team Builder", "Nature Activity Coach"]
    },
    {
      name: "Kwaku S.",
      role: "Community Liaison",
      avatar: "👨🏿‍🎨",
      quote: "Balance is key to everything we do. We compete hard but always maintain our harmony and friendship.",
      joinedDate: "Apr 2025",
      achievements: ["Harmony Keeper", "Garden Tour Coordinator", "Cultural Ambassador"]
    }
  ];

  const recentEvents = [
    {
      name: "Aburi Gardens Adventure Challenge",
      date: "Jul 22, 2025",
      location: "Aburi Botanical Gardens",
      result: "1st Place - Champions",
      participants: "Green Nature Squad"
    },
    {
      name: "Akosombo Games Day",
      date: "Jun 15, 2025",
      location: "Akosombo, Eastern Region",
      result: "1st Place - Champions",
      participants: "28 Green Members"
    },
    {
      name: "Cape Coast Historical Games",
      date: "Sep 14, 2025",
      location: "Cape Coast, Central Region",
      result: "Participation",
      participants: "32 Team Members"
    }
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % teamImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + teamImages.length) % teamImages.length);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-500 to-green-600 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link to="/teams" className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Teams
          </Link>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="text-8xl">🌿</div>
                <div>
                  <h1 className="text-5xl lg:text-6xl font-black text-white mb-2">
                    Team Green
                  </h1>
                  <p className="text-2xl text-white/90 font-semibold">"Nature's Force"</p>
                </div>
              </div>
              
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                The balanced team that brings harmony and sustainable strategies to overcome any obstacle. 
                Team Green believes in growth, balance, and building a community that lasts.
              </p>
              
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className="text-3xl font-bold text-white mb-1">467</div>
                  <div className="text-white/80 text-sm">Members</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className="text-3xl font-bold text-white mb-1">119</div>
                  <div className="text-white/80 text-sm">Wins</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className="text-3xl font-bold text-white mb-1">#4</div>
                  <div className="text-white/80 text-sm">Ranking</div>
                </div>
              </div>
              
              <Button size="lg" className="bg-white text-green-600 hover:bg-white/90 font-semibold px-8 py-4">
                Join Team Green
              </Button>
            </div>
            
            <div className="relative">
              {/* Team Photo Carousel */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                {imageErrors.has(currentImageIndex) ? (
                  // Show fallback design for failed images
                  <div className="w-full h-96 bg-gradient-to-br from-green-500 to-green-600 flex flex-col items-center justify-center text-white">
                    <div className="text-6xl mb-4">🌱</div>
                    <div className="text-2xl font-bold mb-2">Team Green</div>
                    <div className="text-lg opacity-80">Nature's Balance</div>
                  </div>
                ) : (
                  <img 
                    src={teamImages[currentImageIndex]}
                    alt="Team Green Members"
                    className="w-full h-96 object-cover"
                    onError={() => {
                      console.log('Image failed to load, showing fallback');
                      setImageErrors(prev => new Set([...prev, currentImageIndex]));
                    }}
                    onLoad={() => {
                      console.log('Image loaded successfully:', teamImages[currentImageIndex]);
                      // Remove from error set if it loads successfully
                      setImageErrors(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(currentImageIndex);
                        return newSet;
                      });
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                
                {/* Navigation Buttons */}
                {teamImages.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full bg-white/20 border-white/30 text-white hover:bg-white/30"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full bg-white/20 border-white/30 text-white hover:bg-white/30"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
                
                {/* Dots Indicator */}
                {teamImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {teamImages.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Meet the <span className="text-green-500">Growth Leaders</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The balanced minds and growth-focused members who make Team Green a force of sustainable success.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="border-green-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <CardHeader className="text-center pb-4">
                  <div className="text-5xl mb-4">{member.avatar}</div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="font-semibold text-green-600">{member.role}</CardDescription>
                  <Badge variant="outline" className="w-fit mx-auto mt-2 border-green-200 text-green-600">
                    Joined {member.joinedDate}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-2 mb-4">
                    <Quote className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground italic leading-relaxed">
                      "{member.quote}"
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-green-600 mb-2">Achievements</h4>
                    <div className="flex flex-wrap gap-1">
                      {member.achievements.map((achievement, achievementIndex) => (
                        <Badge key={achievementIndex} variant="secondary" className="text-xs">
                          {achievement}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Events */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Recent <span className="text-green-500">Growth</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how Team Green has been building sustainable success and meaningful impact in the community.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {recentEvents.map((event, index) => (
              <Card key={index} className="border-green-200 bg-gradient-to-br from-green-50 to-green-100/50">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-green-500 text-white">{event.result}</Badge>
                    {index === 0 && <Trophy className="w-5 h-5 text-yellow-500" />}
                  </div>
                  <CardTitle className="text-lg text-green-700">{event.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{event.participants}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Values */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              What Makes Us <span className="text-green-500">Sustainable</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Team Green's core values and what you can expect when you join our growth-focused family.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🌱",
                title: "Growth Mindset",
                description: "We believe in continuous improvement and helping every member reach their potential."
              },
              {
                icon: "⚖️",
                title: "Perfect Balance",
                description: "We balance competition with collaboration, winning with learning, and fun with focus."
              },
              {
                icon: "🤲",
                title: "Sustainability",
                description: "Every decision we make considers long-term impact on our community and environment."
              },
              {
                icon: "🌍",
                title: "Global Thinking",
                description: "We think beyond local competitions and aim to make a positive impact on the wider world."
              },
              {
                icon: "🧘",
                title: "Mindful Gaming",
                description: "We approach gaming with intention, strategy, and respect for all participants."
              },
              {
                icon: "🌟",
                title: "Natural Leadership",
                description: "Our leaders emerge naturally through mentorship, wisdom, and genuine care for others."
              }
            ].map((value, index) => (
              <Card key={index} className="text-center border-green-200 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <CardTitle className="text-xl text-green-600">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-green-500 to-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Grow With Us?
          </h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto">
            Join Team Green and become part of a sustainable community that values growth, balance, 
            and meaningful connections. Let's build something beautiful together!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-green-600 hover:bg-white/90 font-semibold px-8 py-4"
            >
              Join Team Green Now
            </Button>
            <Link to="/events">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white/10 px-8 py-4"
              >
                Attend an Event First
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
