import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Clock, Users, Brain, Star, ArrowRight, Calendar, Gift } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Trivia() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Countdown to next Friday 7PM
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const nextFriday = new Date();
      
      // Find next Friday
      const daysUntilFriday = (5 - now.getDay() + 7) % 7;
      if (daysUntilFriday === 0 && now.getHours() >= 19) {
        nextFriday.setDate(now.getDate() + 7);
      } else {
        nextFriday.setDate(now.getDate() + daysUntilFriday);
      }
      
      nextFriday.setHours(19, 0, 0, 0); // 7 PM
      
      const difference = nextFriday.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const triviaStats = [
    { label: "Total Players", value: "300+", icon: Users },
    { label: "Questions Asked", value: "1,200+", icon: Brain },
    { label: "Prize Money Given", value: "₵2,400", icon: Trophy },
    { label: "Weekly Sessions", value: "Every Friday", icon: Calendar },
  ];

  const leaderboard = [
    { rank: 1, name: "Kwame A.", points: 950, badges: ["🏆", "🔥", "🧠"] },
    { rank: 2, name: "Ama O.", points: 920, badges: ["🥈", "⚡"] },
    { rank: 3, name: "Kojo M.", points: 880, badges: ["🥉", "🎯"] },
    { rank: 4, name: "Akosua D.", points: 850, badges: ["⭐"] },
    { rank: 5, name: "Fiifi K.", points: 820, badges: ["🎪"] },
  ];

  const triviaCategories = [
    { name: "Ghanaian History", emoji: "🏛️", difficulty: "Medium" },
    { name: "Pop Culture", emoji: "🎬", difficulty: "Easy" },
    { name: "Sports", emoji: "⚽", difficulty: "Medium" },
    { name: "Science & Tech", emoji: "🔬", difficulty: "Hard" },
    { name: "Music", emoji: "🎵", difficulty: "Easy" },
    { name: "Geography", emoji: "🗺️", difficulty: "Medium" },
  ];

  const prizes = [
    { position: "1st Place", prize: "₵100 + Trophy", color: "bg-yellow-500/10 border-yellow-500/20" },
    { position: "2nd Place", prize: "₵50 + Medal", color: "bg-gray-400/10 border-gray-400/20" },
    { position: "3rd Place", prize: "₵25 + Certificate", color: "bg-orange-600/10 border-orange-600/20" },
  ];

  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gaming via-primary to-accent py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            className="text-6xl mb-6"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 200 }}
          >
            🧠⚡
          </motion.div>
          <motion.h1 
            className="text-4xl lg:text-6xl font-bold text-white mb-6"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Trivia Friday
          </motion.h1>
          <motion.p 
            className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Test your knowledge, win amazing prizes, and have fun with fellow trivia enthusiasts every Friday at 7 PM!
          </motion.p>

          {/* Countdown */}
          <motion.div 
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-12 max-w-2xl mx-auto"
            initial={{ y: 50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8, type: "spring", stiffness: 100 }}
          >
            <motion.h3 
              className="text-2xl font-bold text-white mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              Next Trivia Session In:
            </motion.h3>
            <div className="grid grid-cols-4 gap-4">
              {[
                { value: timeLeft.days, label: 'DAYS' },
                { value: timeLeft.hours, label: 'HOURS' },
                { value: timeLeft.minutes, label: 'MINUTES' },
                { value: timeLeft.seconds, label: 'SECONDS' }
              ].map((item, index) => (
                <motion.div 
                  key={item.label}
                  className="bg-white/20 rounded-2xl p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                >
                  <div className="text-3xl font-bold text-white">{item.value}</div>
                  <div className="text-white/80 text-sm">{item.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            <Button 
              variant="hero" 
              size="lg" 
              className="bg-white text-gaming hover:bg-white/90 text-lg px-8 py-4 shadow-2xl"
              onClick={() => window.open('https://chat.whatsapp.com/trivia-link', '_blank')}
            >
              Join This Friday's Trivia
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.8 }}
          >
            {triviaStats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="text-center"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 2.0 + index * 0.1 }}
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-2 inline-block">
                  <stat.icon className="h-8 w-8 text-white mx-auto" />
                </div>
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">How Trivia Friday Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple, fun, and competitive! Here's what to expect in our weekly trivia sessions.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mb-16">
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="text-4xl mb-4">📱</div>
                <CardTitle>Join WhatsApp</CardTitle>
                <CardDescription>Get the Zoom link sent to our trivia group every Friday</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="text-4xl mb-4">⏰</div>
                <CardTitle>7 PM Start</CardTitle>
                <CardDescription>Sessions begin promptly at 7 PM and last about 90 minutes</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="text-4xl mb-4">🎯</div>
                <CardTitle>Answer Questions</CardTitle>
                <CardDescription>5 rounds, 5 questions each, covering various topics</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="text-4xl mb-4">🏆</div>
                <CardTitle>Win Prizes</CardTitle>
                <CardDescription>Top 3 players win cash prizes and bragging rights!</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories & Prizes */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Categories */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-8">Question Categories</h2>
              <div className="space-y-4">
                {triviaCategories.map((category, index) => (
                  <Card key={index} className="border-0 shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{category.emoji}</div>
                          <div>
                            <div className="font-semibold">{category.name}</div>
                          </div>
                        </div>
                        <Badge 
                          variant={category.difficulty === 'Easy' ? 'default' : 
                                 category.difficulty === 'Medium' ? 'secondary' : 'destructive'}
                        >
                          {category.difficulty}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Prizes */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-8">Weekly Prizes</h2>
              <div className="space-y-6">
                {prizes.map((prize, index) => (
                  <Card key={index} className={`border-2 ${prize.color}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-3xl">
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                          </div>
                          <div>
                            <div className="text-xl font-bold">{prize.position}</div>
                            <div className="text-2xl font-bold text-primary">{prize.prize}</div>
                          </div>
                        </div>
                        <Gift className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                  <CardContent className="p-6 text-center">
                    <Star className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="font-semibold text-lg">Special Bonuses</div>
                    <div className="text-sm text-muted-foreground">
                      Perfect scores, winning streaks, and themed night bonuses!
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Monthly Leaderboard</h2>
            <p className="text-xl text-muted-foreground">
              Our top trivia champions this month. Will you make the list?
            </p>
          </div>

          <div className="space-y-4">
            {leaderboard.map((player) => (
              <Card key={player.rank} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                        player.rank === 1 ? 'bg-yellow-500' :
                        player.rank === 2 ? 'bg-gray-400' :
                        player.rank === 3 ? 'bg-orange-600' :
                        'bg-primary'
                      }`}>
                        {player.rank}
                      </div>
                      <div>
                        <div className="font-semibold text-lg">{player.name}</div>
                        <div className="flex items-center gap-1">
                          {player.badges.map((badge, index) => (
                            <span key={index} className="text-lg">{badge}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{player.points}</div>
                      <div className="text-sm text-muted-foreground">points</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-gaming to-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Show Off Your Knowledge?
          </h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Join our WhatsApp trivia group to get notified about this week's session and compete for amazing prizes!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="hero" 
              size="lg" 
              className="bg-white text-gaming hover:bg-white/90"
              onClick={() => window.open('https://chat.whatsapp.com/trivia-link', '_blank')}
            >
              Join Trivia WhatsApp Group
              <Brain className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white/10"
              onClick={() => alert('Past questions archive coming soon!')}
            >
              View Past Questions
            </Button>
          </div>
          
          <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto">
            <div className="text-sm text-white/80 mb-2">This Friday, December 15th</div>
            <div className="text-2xl font-bold text-white">Special Holiday Trivia!</div>
            <div className="text-white/90">Double prizes + festive questions 🎄</div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}