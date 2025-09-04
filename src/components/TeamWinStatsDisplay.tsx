import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingUp, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  getTeamWinStats, 
  TeamWinStats, 
  getTeamDisplayInfo
} from '@/lib/tournament-api';

interface TeamWinStatsDisplayProps {
  className?: string;
}

export function TeamWinStatsDisplay({ className = '' }: TeamWinStatsDisplayProps) {
  const [teamStats, setTeamStats] = useState<TeamWinStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTeamStats() {
      try {
        setLoading(true);
        const data = await getTeamWinStats();
        setTeamStats(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch team stats:', err);
        setError('Failed to load team statistics');
      } finally {
        setLoading(false);
      }
    }

    fetchTeamStats();
  }, []);

  if (loading) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading team statistics...</p>
      </div>
    );
  }

  if (error || teamStats.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">
          {error || 'No team statistics available'}
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          🏆 Tournament <span className="text-primary">Champions</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          See which teams have been dominating our tournaments and competitions
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {teamStats.map((stat, index) => {
          const teamInfo = getTeamDisplayInfo(stat.team_name);
          const isTopTeam = index === 0;

          return (
            <motion.div
              key={stat.team_name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <Card className={`relative overflow-hidden bg-gradient-to-br ${teamInfo.gradientFrom} ${teamInfo.gradientTo} text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}>
                {/* Champion Badge */}
                {isTopTeam && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-yellow-500 text-yellow-900 border-yellow-400">
                      <Trophy className="w-3 h-3 mr-1" />
                      Champion
                    </Badge>
                  </div>
                )}

                {/* Rank Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <Badge variant="outline" className="bg-white/20 border-white/30 text-white">
                    #{index + 1}
                  </Badge>
                </div>

                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/20 transform translate-x-16 -translate-y-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/10 transform -translate-x-12 translate-y-12"></div>
                </div>

                <CardHeader className="relative z-10 text-center pb-4">
                  <div className="text-4xl mb-2">{teamInfo.emoji}</div>
                  <CardTitle className="text-xl font-bold text-white">
                    {teamInfo.name}
                  </CardTitle>
                  <p className="text-white/80 font-medium">{teamInfo.motto}</p>
                </CardHeader>

                <CardContent className="relative z-10 pt-0">
                  <div className="space-y-4">
                    {/* Total Wins */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Trophy className="w-5 h-5 text-white/90" />
                        <span className="text-sm font-medium text-white/90">Tournament Wins</span>
                      </div>
                      <div className="text-3xl font-bold text-white">{stat.total_wins}</div>
                    </div>

                    {/* Recent Win Date */}
                    {stat.recent_win_date && (
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-white/90" />
                          <span className="text-xs font-medium text-white/90">Latest Victory</span>
                        </div>
                        <div className="text-sm text-white/80">
                          {new Date(stat.recent_win_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                    )}

                    {/* Win Rate Indicator */}
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <div className="flex items-center justify-center gap-2">
                        <TrendingUp className="w-4 h-4 text-white/90" />
                        <span className="text-xs text-white/80">
                          {isTopTeam ? 'Leading the pack!' : 'Rising strong!'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12">
        <p className="text-muted-foreground mb-4">
          Want to help your team climb the rankings?
        </p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <a 
            href="/events" 
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
          >
            <Trophy className="w-4 h-4" />
            Join Next Tournament
          </a>
        </motion.div>
      </div>
    </div>
  );
}

export default TeamWinStatsDisplay;
