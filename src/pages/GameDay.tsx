import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Clock,
  Trophy,
  Users,
  Gamepad2,
  Camera,
  Timer,
  ArrowRight,
  Sparkles,
  Target,
  Flame,
  Zap,
  Heart,
  Shield,
  Star
} from 'lucide-react';

interface TeamRanking {
  rank: number;
  team: string;
  color: string;
  points: number;
  wins: number;
  played: number;
}

interface PlayerRanking {
  rank: number;
  name: string;
  team: string;
  teamColor: string;
  points: number;
  wins: number;
  mvps: number;
}

export default function GameDay() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    preferred_team: '',
    game_interest: '',
  });

  // Mock leaderboard data
  const teamRankings: TeamRanking[] = [
    { rank: 1, team: 'Team Red', color: 'red', points: 145, wins: 12, played: 18 },
    { rank: 2, team: 'Team Blue', color: 'blue', points: 132, wins: 10, played: 18 },
    { rank: 3, team: 'Team Yellow', color: 'yellow', points: 118, wins: 9, played: 18 },
    { rank: 4, team: 'Team Green', color: 'green', points: 105, wins: 8, played: 18 },
  ];

  const playerRankings: PlayerRanking[] = [
    { rank: 1, name: 'Kwame Mensah', team: 'Team Red', teamColor: 'red', points: 28, wins: 6, mvps: 4 },
    { rank: 2, name: 'Ama Serwaa', team: 'Team Blue', teamColor: 'blue', points: 25, wins: 5, mvps: 3 },
    { rank: 3, name: 'Kofi Asante', team: 'Team Yellow', teamColor: 'yellow', points: 23, wins: 5, mvps: 3 },
    { rank: 4, name: 'Akua Frimpong', team: 'Team Green', teamColor: 'green', points: 21, wins: 4, mvps: 2 },
    { rank: 5, name: 'Yaw Boateng', team: 'Team Red', teamColor: 'red', points: 20, wins: 4, mvps: 2 },
  ];

  const teams = [
    {
      name: 'Team Red',
      color: 'red',
      icon: Flame,
      motto: 'Passion & Energy',
      bgGradient: 'from-red-500 to-red-600',
      textColor: 'text-red-500',
      bgColor: 'bg-red-500',
      borderColor: 'border-red-500',
    },
    {
      name: 'Team Yellow',
      color: 'yellow',
      icon: Zap,
      motto: 'Joy & Creativity',
      bgGradient: 'from-yellow-500 to-yellow-600',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-500',
      borderColor: 'border-yellow-500',
    },
    {
      name: 'Team Blue',
      color: 'blue',
      icon: Shield,
      motto: 'Focus & Strategy',
      bgGradient: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-500',
      bgColor: 'bg-blue-500',
      borderColor: 'border-blue-500',
    },
    {
      name: 'Team Green',
      color: 'green',
      icon: Heart,
      motto: 'Growth & Unity',
      bgGradient: 'from-green-500 to-green-600',
      textColor: 'text-green-500',
      bgColor: 'bg-green-500',
      borderColor: 'border-green-500',
    },
  ];

  const games = [
    { name: 'FIFA', icon: '⚽', color: 'bg-green-100 text-green-600' },
    { name: 'Table Tennis', icon: '🏓', color: 'bg-orange-100 text-orange-600' },
    { name: 'Jenga', icon: '🧱', color: 'bg-amber-100 text-amber-600' },
    { name: 'Cup Games', icon: '🥤', color: 'bg-blue-100 text-blue-600' },
    { name: 'Ludo', icon: '🎲', color: 'bg-red-100 text-red-600' },
    { name: 'Limbo', icon: '🤸', color: 'bg-purple-100 text-purple-600' },
    { name: 'UNO', icon: '🃏', color: 'bg-yellow-100 text-yellow-600' },
    { name: 'Pool', icon: '🎱', color: 'bg-slate-100 text-slate-600' },
  ];

  // Game Day slideshow images - Real photos from Game Day @ Nexus 9
  const googlePhotosImages = [
    'https://res.cloudinary.com/drkjnrvtu/image/upload/v1762939931/IMG_9942_ox5fvt.jpg',
    'https://res.cloudinary.com/drkjnrvtu/image/upload/v1762939930/IMG_0147_qe87ci.jpg',
    'https://res.cloudinary.com/drkjnrvtu/image/upload/v1762939931/IMG_9950_n9juhs.jpg',
    'https://res.cloudinary.com/drkjnrvtu/image/upload/v1762939931/IMG_0166_v8djw1.jpg',
    'https://res.cloudinary.com/drkjnrvtu/image/upload/v1762939931/IMG_0169_kxjvhx.jpg',
    'https://res.cloudinary.com/drkjnrvtu/image/upload/v1762939930/IMG_9922_lzwntt.jpg',
    'https://res.cloudinary.com/drkjnrvtu/image/upload/v1762939930/IMG_0143_dhiqox.jpg',
  ];

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const googleAlbumLink = 'https://photos.google.com/share/AF1QipPvUiXd6i3r8mB8yaD5_MFscTA0CYCnfPEu4_lw-uhtGsZSSDtO2Bj6jVs3WlaBrg?key=eG9IY3pLTEtPLWFrMmdtZDRoYzR3MGxsSVg0THpR';

  // Calculate next Game Day (first Saturday of next month)
  const getNextGameDay = () => {
    const now = new Date();
    let nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    
    // Find first Saturday
    while (nextMonth.getDay() !== 6) {
      nextMonth.setDate(nextMonth.getDate() + 1);
    }
    
    nextMonth.setHours(14, 0, 0, 0); // 2PM
    return nextMonth;
  };


  // Auto-advance slideshow every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % googlePhotosImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % googlePhotosImages.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + googlePhotosImages.length) % googlePhotosImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlideIndex(index);
  };


  // Countdown timer effect
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const targetDate = getNextGameDay().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('registrations').insert([
        {
          full_name: formData.full_name,
          email: formData.email,
          phone_number: formData.phone_number,
          event_id: null, // Game Day is recurring, not tied to a specific event
          extra_info: {
            preferred_team: formData.preferred_team,
            game_interest: formData.game_interest,
            registration_type: 'game_day',
          },
          payment_status: 'confirmed', // Free event
        },
      ]);

      if (error) throw error;

      toast({
        title: 'Registration Successful! 🎉',
        description: `Welcome to ${formData.preferred_team}! See you at Game Day.`,
      });

      // Reset form
      setFormData({
        full_name: '',
        email: '',
        phone_number: '',
        preferred_team: '',
        game_interest: '',
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration Failed',
        description: error?.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      red: 'bg-red-100 text-red-600 border-red-500',
      yellow: 'bg-yellow-100 text-yellow-600 border-yellow-500',
      blue: 'bg-blue-100 text-blue-600 border-blue-500',
      green: 'bg-green-100 text-green-600 border-green-500',
    };
    return colorMap[color] || '';
  };

  const heroBackgroundImage = 'https://res.cloudinary.com/drkjnrvtu/image/upload/v1762888929/gallery/ilkkz09bhbqhq589trfy.jpg';

  return (
    <>
      <SEO
        title="Game Day @ Nexus 9 - Every First Saturday"
        description="Join your team at Game Day - a monthly gaming competition at Nexus 9 Events Center. Free entry, great prizes, and tons of fun!"
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section
          className="relative min-h-[600px] flex items-center justify-center overflow-hidden"
          style={{
            backgroundImage: `url(${heroBackgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Background gradient with overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-yellow-500 to-green-500 opacity-60 mix-blend-multiply" />
          <div className="absolute inset-0 bg-black/25" />
          
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-20 w-32 h-32 bg-red-500 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-yellow-500 rounded-full blur-3xl animate-pulse delay-500" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm px-4 py-2 text-sm">
                <Sparkles className="w-4 h-4 mr-2" />
                Every First Saturday of the Month
              </Badge>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Game Day @ Nexus 9
              </h1>
              
              <p className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
                Join your team – Red, Yellow, Blue, or Green – and compete for fun, prizes, and bragging rights at Nexus 9 Events Center.
              </p>

              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-white/90 text-lg px-8 py-6"
                  onClick={() => scrollToSection('register')}
                >
                  Register for Next Game Day
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6"
                  onClick={() => scrollToSection('leaderboard')}
                >
                  <Trophy className="mr-2 h-5 w-5" />
                  View Leaderboard
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">What is Game Day?</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Game Day is a monthly gaming extravaganza where four teams compete across multiple games and challenges. 
                It's all about community, competition, and having an amazing time together!
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: MapPin,
                  title: 'Venue',
                  description: 'Nexus 9 Events Center, Accra',
                  color: 'text-red-500',
                },
                {
                  icon: Calendar,
                  title: 'Schedule',
                  description: 'Every First Saturday',
                  color: 'text-yellow-600',
                },
                {
                  icon: Clock,
                  title: 'Time',
                  description: '2PM – 9PM',
                  color: 'text-blue-500',
                },
                {
                  icon: Sparkles,
                  title: 'Entry',
                  description: 'FREE (Registration Required)',
                  color: 'text-green-500',
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <item.icon className={`w-12 h-12 mx-auto mb-4 ${item.color}`} />
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Teams Section */}
        <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">Choose Your Team</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Each team brings unique energy and spirit. Which one represents you?
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teams.map((team, index) => {
                const Icon = team.icon;
                return (
                  <motion.div
                    key={team.name}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className={`overflow-hidden hover:shadow-2xl transition-all border-2 ${team.borderColor} group cursor-pointer`}>
                      <div className={`bg-gradient-to-br ${team.bgGradient} p-8 text-white text-center`}>
                        <Icon className="w-16 h-16 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-2">{team.name}</h3>
                        <p className="text-white/90 font-medium">{team.motto}</p>
                      </div>
                      <CardContent className="p-6 text-center">
                        <Button
                          className={`w-full ${team.bgColor} hover:opacity-90 text-white`}
                          onClick={() => scrollToSection('register')}
                        >
                          Join {team.name}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Games Lineup */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">Games Lineup</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                From FIFA tournaments to Jenga battles – there's something for everyone!
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {games.map((game, index) => (
                <motion.div
                  key={game.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card className={`${game.color} border-2 hover:shadow-lg transition-all cursor-pointer`}>
                    <CardContent className="p-6 text-center">
                      <div className="text-5xl mb-3">{game.icon}</div>
                      <h3 className="font-bold text-lg">{game.name}</h3>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Leaderboard Section */}
        <section id="leaderboard" className="py-20 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">Leaderboard</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                See how the teams and players are ranking this season!
              </p>
            </motion.div>

            <Card className="max-w-4xl mx-auto">
              <CardContent className="p-6">
                <Tabs defaultValue="teams" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="teams" className="text-lg">
                      <Users className="w-4 h-4 mr-2" />
                      Team Rankings
                    </TabsTrigger>
                    <TabsTrigger value="players" className="text-lg">
                      <Star className="w-4 h-4 mr-2" />
                      Top Players
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="teams">
                    <div className="space-y-4">
                      {teamRankings.map((team) => (
                        <motion.div
                          key={team.rank}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: team.rank * 0.1 }}
                          className={`flex items-center justify-between p-4 rounded-lg border-2 ${getColorClasses(
                            team.color
                          )}`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-3xl font-bold w-12 text-center">
                              {team.rank === 1 ? '🥇' : team.rank === 2 ? '🥈' : team.rank === 3 ? '🥉' : team.rank}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold">{team.team}</h3>
                              <p className="text-sm text-muted-foreground">
                                {team.wins} Wins • {team.played} Games Played
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold">{team.points}</div>
                            <div className="text-sm text-muted-foreground">Points</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="players">
                    <div className="space-y-4">
                      {playerRankings.map((player) => (
                        <motion.div
                          key={player.rank}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: player.rank * 0.1 }}
                          className={`flex items-center justify-between p-4 rounded-lg border-2 ${getColorClasses(
                            player.teamColor
                          )}`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-2xl font-bold w-12 text-center">
                              {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : player.rank === 3 ? '🥉' : `#${player.rank}`}
                            </div>
                            <div>
                              <h3 className="text-lg font-bold">{player.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {player.team} • {player.wins} Wins • {player.mvps} MVPs
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">{player.points}</div>
                            <div className="text-xs text-muted-foreground">Points</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Camera className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">Game Day Memories</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Relive the best moments from past Game Days!
              </p>
            </motion.div>

            {/* Slideshow */}
            <div className="relative w-full max-w-6xl mx-auto">
              {/* Main slideshow container */}
              <div className="relative aspect-video bg-slate-100 rounded-2xl overflow-hidden shadow-2xl">
                <motion.img
                  key={currentSlideIndex}
                  src={googlePhotosImages[currentSlideIndex]}
                  alt={`Game Day Photo ${currentSlideIndex + 1}`}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  onError={(e) => {
                    console.error('Image failed to load:', googlePhotosImages[currentSlideIndex]);
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1920&h=1080&fit=crop';
                  }}
                  loading="eager"
                />
                
                {/* Navigation arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
                  aria-label="Previous image"
                >
                  <ArrowRight className="h-6 w-6 rotate-180" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
                  aria-label="Next image"
                >
                  <ArrowRight className="h-6 w-6" />
                </button>

                {/* Slide indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full">
                  <p className="text-white text-sm font-medium">
                    {currentSlideIndex + 1} / {googlePhotosImages.length}
                  </p>
                </div>
              </div>

              {/* Thumbnail dots */}
              <div className="flex justify-center gap-2 mt-6 flex-wrap">
                {googlePhotosImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentSlideIndex
                        ? 'bg-primary w-8'
                        : 'bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

            </div>
          </div>
        </section>


        {/* Countdown + Registration Section */}
        <section id="register" className="py-20 bg-gradient-to-br from-primary to-accent text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Countdown */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center lg:text-left"
              >
                <Timer className="w-16 h-16 mb-6 mx-auto lg:mx-0" />
                <h2 className="text-4xl lg:text-5xl font-bold mb-6">Next Game Day In:</h2>
                
                <div className="grid grid-cols-4 gap-4 mb-8">
                  {[
                    { label: 'Days', value: countdown.days },
                    { label: 'Hours', value: countdown.hours },
                    { label: 'Minutes', value: countdown.minutes },
                    { label: 'Seconds', value: countdown.seconds },
                  ].map((item) => (
                    <div key={item.label} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <div className="text-4xl font-bold">{item.value.toString().padStart(2, '0')}</div>
                      <div className="text-sm text-white/80">{item.label}</div>
                    </div>
                  ))}
                </div>

                <p className="text-xl text-white/90 leading-relaxed">
                  {getNextGameDay().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </motion.div>

              {/* Registration Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-2xl">Register for Game Day</CardTitle>
                    <CardDescription>Secure your spot for the next epic competition!</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="full_name">Full Name *</Label>
                        <Input
                          id="full_name"
                          placeholder="John Doe"
                          value={formData.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone_number">Phone Number *</Label>
                        <Input
                          id="phone_number"
                          type="tel"
                          placeholder="0244 123 456"
                          value={formData.phone_number}
                          onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="preferred_team">Preferred Team *</Label>
                        <Select
                          value={formData.preferred_team}
                          onValueChange={(value) => setFormData({ ...formData, preferred_team: value })}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose your team" />
                          </SelectTrigger>
                          <SelectContent>
                            {teams.map((team) => (
                              <SelectItem key={team.name} value={team.name}>
                                {team.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="game_interest">Favorite Game (Optional)</Label>
                        <Textarea
                          id="game_interest"
                          placeholder="Which game are you most excited about?"
                          value={formData.game_interest}
                          onChange={(e) => setFormData({ ...formData, game_interest: e.target.value })}
                          rows={3}
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white text-lg py-6"
                        disabled={loading}
                      >
                        {loading ? 'Registering...' : 'Register Now - It\'s FREE!'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold mb-8">Our Partners</h2>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-xl font-semibold mb-2">Nexus 9 Events Center</h3>
                  <p className="text-muted-foreground">Venue Partner</p>
                </div>
                
                <div className="text-4xl text-muted-foreground hidden md:block">×</div>
                
                <div className="text-center">
                  <div className="text-6xl mb-4">🎮</div>
                  <h3 className="text-xl font-semibold mb-2">Games & Connect</h3>
                  <p className="text-muted-foreground">Community Organizer</p>
                </div>
              </div>

              <p className="text-lg text-muted-foreground">
                Creating unforgettable gaming experiences together
              </p>
            </motion.div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="py-16 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Stay Connected</h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join our community and never miss a Game Day update!
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                className="bg-green-500 hover:bg-green-600 text-white"
                onClick={() => window.open('https://wa.me/YOUR_WHATSAPP_NUMBER', '_blank')}
              >
                Join WhatsApp Community
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10"
                onClick={() => window.open('https://instagram.com/gamesandconnectgh', '_blank')}
              >
                Follow on Instagram
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10"
                onClick={() => window.location.href = '/contact'}
              >
                Partner with Us
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

