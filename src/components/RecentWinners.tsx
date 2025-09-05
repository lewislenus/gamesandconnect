import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Calendar, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  getRecentWinners, 
  TournamentResult, 
  getTeamDisplayInfo, 
  formatTournamentDate
} from '@/lib/tournament-api';

interface RecentWinnersProps {
  limit?: number;
  showImages?: boolean;
  className?: string;
}

export function RecentWinners({ limit = 1, showImages = true, className = '' }: RecentWinnersProps) {
  const [winners, setWinners] = useState<TournamentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWinners() {
      try {
        setLoading(true);
        const data = await getRecentWinners(limit);
        setWinners(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch recent winners:', err);
        setError('Failed to load recent winners');
      } finally {
        setLoading(false);
      }
    }

    fetchWinners();
  }, [limit]);

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading recent winners...</p>
        </div>
      </div>
    );
  }

  if (error || winners.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">
          {error || 'No recent winners to display'}
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          🏆 Latest <span className="text-primary">Champion</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Celebrating our latest tournament winner and their incredible achievement
        </p>
      </div>

      <div className="flex justify-center">
        <div className="max-w-md w-full">
          {winners.map((winner, index) => {
            const teamInfo = getTeamDisplayInfo(winner.winning_team);
            const runnerUpInfo = winner.runner_up_team ? getTeamDisplayInfo(winner.runner_up_team) : null;
            
            // Skip if no team info found
            if (!teamInfo) {
              console.warn('No team info found for team:', winner.winning_team, 'Available teams: red, blue, green, yellow');
              return null;
            }

          return (
            <motion.div
              key={winner.tournament_name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={`relative overflow-hidden bg-gradient-to-br ${teamInfo.gradientFrom} ${teamInfo.gradientTo} text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}>
                {/* Winner Badge */}
                {index === 0 && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-yellow-500 text-yellow-900 border-yellow-400">
                      <Trophy className="w-3 h-3 mr-1" />
                      Latest Winner
                    </Badge>
                  </div>
                )}

                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/20 transform translate-x-16 -translate-y-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/10 transform -translate-x-12 translate-y-12"></div>
                </div>

                {/* Tournament Image */}
                {showImages && winner.highlight_image && (
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={winner.highlight_image} 
                      alt={`${winner.tournament_name} highlights`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                )}

                <CardHeader className="relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-3xl">{teamInfo.emoji}</div>
                    <div>
                      <CardTitle className="text-lg font-bold text-white">
                        {teamInfo.name}
                      </CardTitle>
                      <CardDescription className="text-white/80 font-medium">
                        {winner.game_type} Champion
                      </CardDescription>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {winner.tournament_name}
                  </h3>
                </CardHeader>

                <CardContent className="relative z-10 pt-0">
                  {/* Tournament Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-white/90">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{formatTournamentDate(winner.tournament_date)}</span>
                    </div>
                    
                    {winner.participants_count && (
                      <div className="flex items-center gap-2 text-white/90">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">{winner.participants_count} participants</span>
                      </div>
                    )}
                  </div>

                  {/* Runner-up */}
                  {runnerUpInfo && (
                    <div className="flex items-center gap-2 mb-4">
                      <Medal className="w-4 h-4 text-white/70" />
                      <span className="text-sm text-white/70">
                        Runner-up: <span className="font-semibold">{runnerUpInfo.name}</span>
                      </span>
                    </div>
                  )}

                  {/* Description */}
                  {winner.description && (
                    <p className="text-white/80 text-sm leading-relaxed">
                      {winner.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
        </div>
      </div>
    </div>
  );
}

export default RecentWinners;
