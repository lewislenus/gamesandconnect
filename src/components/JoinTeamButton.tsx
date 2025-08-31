import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Users, Trophy, Target } from 'lucide-react';
import { joinTeam, getUserTeamMembership, type JoinTeamData } from '@/lib/team-api';
import { useToast } from '@/hooks/use-toast';

interface JoinTeamButtonProps {
  teamName: 'red' | 'blue' | 'green' | 'yellow';
  teamDisplayName: string;
  teamColor: string;
  teamMotto: string;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'secondary';
  children?: React.ReactNode;
}

export function JoinTeamButton({ 
  teamName, 
  teamDisplayName, 
  teamColor, 
  teamMotto,
  className = '',
  size = 'default',
  variant = 'default',
  children 
}: JoinTeamButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: ''
  });
  const [currentTeam, setCurrentTeam] = useState<string | null>(null);
  const { toast } = useToast();

  // Check current team membership when dialog opens
  const handleOpenChange = async (open: boolean) => {
    setIsOpen(open);
    if (open && formData.email) {
      const result = await getUserTeamMembership(formData.email);
      if (result.success && result.data) {
        setCurrentTeam(result.data.team_name);
      } else {
        setCurrentTeam(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName.trim() || !formData.email.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name and email address.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const joinData: JoinTeamData = {
        user_email: formData.email.trim(),
        full_name: formData.fullName.trim(),
        phone_number: formData.phoneNumber.trim() || undefined,
        team_name: teamName
      };

      const result = await joinTeam(joinData);

      if (result.success) {
        toast({
          title: "Welcome to the Team! 🎉",
          description: `You've successfully joined ${teamDisplayName}. Get ready for some epic games!`,
          duration: 5000
        });
        
        // Reset form and close dialog
        setFormData({ fullName: '', email: '', phoneNumber: '' });
        setIsOpen(false);
        setCurrentTeam(teamName);
      } else {
        toast({
          title: "Join Failed",
          description: result.error || "Something went wrong. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error joining team:', error);
      toast({
        title: "Error",
        description: "Failed to join team. Please check your connection and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTeamIcon = () => {
    switch (teamName) {
      case 'red': return '🔥';
      case 'blue': return '🌊';
      case 'green': return '🌿';
      case 'yellow': return '⚡';
      default: return '🎮';
    }
  };

  const getTeamGradient = () => {
    switch (teamName) {
      case 'red': return 'from-red-500 to-red-600';
      case 'blue': return 'from-blue-500 to-blue-600';
      case 'green': return 'from-green-500 to-green-600';
      case 'yellow': return 'from-yellow-500 to-yellow-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          size={size} 
          variant={variant}
          className={className}
        >
          {children || `Join ${teamDisplayName}`}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">{getTeamIcon()}</div>
            <div>
              <DialogTitle className="text-xl">Join {teamDisplayName}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                "{teamMotto}"
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Current Team Warning */}
        {currentTeam && currentTeam !== teamName && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-yellow-800">
                <Target className="h-4 w-4" />
                <span className="text-sm font-medium">
                  You're currently in Team {currentTeam.charAt(0).toUpperCase() + currentTeam.slice(1)}
                </span>
              </div>
              <p className="text-xs text-yellow-700 mt-1">
                Joining {teamDisplayName} will automatically move you from your current team.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Team Preview */}
        <Card className={`bg-gradient-to-r ${getTeamGradient()} text-white border-0`}>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">{teamDisplayName}</h3>
                <p className="text-white/90 text-sm">{teamMotto}</p>
              </div>
              <div className="text-right text-sm">
                <div className="flex items-center gap-1 justify-end">
                  <Users className="h-3 w-3" />
                  <span>Growing team</span>
                </div>
                <div className="flex items-center gap-1 justify-end mt-1">
                  <Trophy className="h-3 w-3" />
                  <span>Ready to win</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="+233 XX XXX XXXX"
              value={formData.phoneNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
            />
          </div>

          <DialogFooter className="gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className={`bg-gradient-to-r ${getTeamGradient()} hover:opacity-90`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  Join {teamDisplayName}
                  <span className="ml-2">{getTeamIcon()}</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
