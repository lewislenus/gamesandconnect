import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Trophy, Target, ArrowRight } from 'lucide-react';
import { JoinTeamButton } from '@/components/JoinTeamButton';

export default function Teams() {
  const teams = [
    {
      name: "Team Red",
      color: "red",
      bgColor: "bg-red-500",
      textColor: "text-red-500",
      borderColor: "border-red-500",
      gradientFrom: "from-red-500",
      gradientTo: "to-red-600",
      motto: "Fire & Passion",
      members: "485",
      wins: "127",
      description: "The warriors of the community. Team Red brings fierce competition and unwavering determination to every challenge.",
      strengths: ["Competitive Gaming", "Leadership", "Team Spirit", "Strategic Planning"]
    },
    {
      name: "Team Yellow",
      color: "yellow", 
      bgColor: "bg-yellow-500",
      textColor: "text-yellow-600",
      borderColor: "border-yellow-500",
      gradientFrom: "from-yellow-500",
      gradientTo: "to-yellow-600",
      motto: "Lightning Speed",
      members: "423",
      wins: "134",
      description: "Quick thinkers and fast movers. Team Yellow dominates with speed, agility, and innovative solutions.",
      strengths: ["Quick Thinking", "Innovation", "Adaptability", "Tech Skills"]
    },
    {
      name: "Team Green",
      color: "green",
      bgColor: "bg-green-500", 
      textColor: "text-green-500",
      borderColor: "border-green-500",
      gradientFrom: "from-green-500",
      gradientTo: "to-green-600",
      motto: "Nature's Force",
      members: "467",
      wins: "119",
      description: "The balanced team that brings harmony and sustainable strategies to overcome any obstacle.",
      strengths: ["Sustainability", "Balance", "Growth Mindset", "Community Building"]
    },
    {
      name: "Team Blue",
      color: "blue",
      bgColor: "bg-blue-500",
      textColor: "text-blue-500", 
      borderColor: "border-blue-500",
      gradientFrom: "from-blue-500",
      gradientTo: "to-blue-600",
      motto: "Ocean Deep",
      members: "512",
      wins: "142",
      description: "The depth of knowledge and wisdom. Team Blue excels through careful planning and deep thinking.",
      strengths: ["Strategic Depth", "Knowledge", "Patience", "Analytical Skills"]
    }
  ];

  const totalMembers = teams.reduce((total, team) => total + parseInt(team.members), 0);
  const totalWins = teams.reduce((total, team) => total + parseInt(team.wins), 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-accent py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Choose Your Team
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
            Join one of our four legendary teams and compete for glory, prizes, and bragging rights! 
            Each team has its unique culture, strengths, and approach to the Games & Connect experience.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-3xl font-bold text-white mb-2">{totalMembers}</div>
              <div className="text-white/80">Total Members</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-3xl font-bold text-white mb-2">{totalWins}</div>
              <div className="text-white/80">Combined Wins</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-3xl font-bold text-white mb-2">4</div>
              <div className="text-white/80">Epic Teams</div>
            </div>
          </div>
        </div>
      </section>

      {/* Teams Grid */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Meet the <span className="text-primary">Teams</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Each team brings unique strengths to the Games & Connect community. 
              Discover their stories, meet their members, and find where you belong.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {teams.map((team, index) => (
              <Card key={index} className={`relative bg-gradient-to-br ${team.gradientFrom} ${team.gradientTo} text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 group overflow-hidden`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/20 transform translate-x-16 -translate-y-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/10 transform -translate-x-12 translate-y-12"></div>
                </div>
                
                <CardHeader className="relative z-10 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-6xl">
                      {team.color === 'red' && '🔥'}
                      {team.color === 'yellow' && '⚡'}
                      {team.color === 'green' && '🌿'}
                      {team.color === 'blue' && '🌊'}
                    </div>
                    <Badge className="bg-white/20 text-white border-white/30">
                      #{index + 1}
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-3xl font-black mb-2">{team.name}</CardTitle>
                  <CardDescription className="text-white/90 text-lg font-medium mb-4">
                    "{team.motto}"
                  </CardDescription>
                  <p className="text-white/80 leading-relaxed">{team.description}</p>
                </CardHeader>
                
                <CardContent className="relative z-10 pt-0">
                  {/* Team Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Users className="w-5 h-5" />
                        <span className="text-sm font-medium">Members</span>
                      </div>
                      <div className="text-2xl font-bold">{team.members}</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Trophy className="w-5 h-5" />
                        <span className="text-sm font-medium">Wins</span>
                      </div>
                      <div className="text-2xl font-bold">{team.wins}</div>
                    </div>
                  </div>
                  
                  {/* Team Strengths */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-4 h-4" />
                      <span className="text-sm font-medium">Team Strengths</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {team.strengths.map((strength, strengthIndex) => (
                        <Badge key={strengthIndex} className="bg-white/20 text-white border-white/30 text-xs">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Link to={`/teams/${team.color}`} className="flex-1">
                      <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 border backdrop-blur-sm">
                        Meet the Team
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <JoinTeamButton
                      teamName={team.color as 'red' | 'blue' | 'green' | 'yellow'}
                      teamDisplayName={team.name}
                      teamColor={team.color}
                      teamMotto={team.motto}
                      variant="default"
                      className="bg-white text-black hover:bg-white/90 font-semibold"
                    >
                      Join Team
                    </JoinTeamButton>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Comparison */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Team <span className="text-primary">Rankings</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how our teams stack up against each other in various categories
            </p>
          </div>
          
          <div className="bg-background rounded-3xl p-8 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-muted">
                    <th className="text-left py-4 px-6 font-semibold">Rank</th>
                    <th className="text-left py-4 px-6 font-semibold">Team</th>
                    <th className="text-center py-4 px-6 font-semibold">Members</th>
                    <th className="text-center py-4 px-6 font-semibold">Wins</th>
                    <th className="text-center py-4 px-6 font-semibold">Win Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {teams
                    .sort((a, b) => parseInt(b.wins) - parseInt(a.wins))
                    .map((team, index) => (
                    <tr key={team.name} className="border-b border-muted/50 hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-primary">#{index + 1}</span>
                          {index === 0 && <Trophy className="w-5 h-5 text-yellow-500" />}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">
                            {team.color === 'red' && '🔥'}
                            {team.color === 'yellow' && '⚡'}
                            {team.color === 'green' && '🌿'}
                            {team.color === 'blue' && '🌊'}
                          </div>
                          <div>
                            <div className={`font-bold ${team.textColor}`}>{team.name}</div>
                            <div className="text-sm text-muted-foreground">{team.motto}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center font-semibold">{team.members}</td>
                      <td className="py-4 px-6 text-center font-semibold">{team.wins}</td>
                      <td className="py-4 px-6 text-center">
                        <div className="text-sm font-semibold">
                          {Math.round((parseInt(team.wins) / (parseInt(team.wins) + 50)) * 100)}%
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Ready to Choose Your Side?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
            Don't worry if you can't decide right now - you can switch teams anytime before major tournaments! 
            The most important thing is to start your journey with us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/events">
              <Button 
                size="lg" 
                className="rounded-full text-base px-8 py-6 bg-primary hover:bg-primary/90"
              >
                Join an Event First
              </Button>
            </Link>
            <Link to="/community">
              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-full text-base px-8 py-6"
              >
                Join Community Chat
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
