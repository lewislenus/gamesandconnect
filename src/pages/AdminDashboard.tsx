import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getDashboardStats, getRecentActivity, getTopEvents } from '@/lib/admin-api';
import { Skeleton } from "@/components/ui/skeleton";
import AdminNavigation from '@/components/AdminNavigation';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Activity, 
  DollarSign,
  Eye,
  UserPlus,
  CalendarPlus,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Star,
  BarChart3,
  PieChart,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  totalEvents: number;
  totalUsers: number;
  totalRegistrations: number;
  totalRevenue: number;
  activeEvents: number;
  pendingRegistrations: number;
  completedEvents: number;
  averageRating: number;
}

interface RecentActivity {
  id: string;
  type: 'registration' | 'event_created' | 'event_updated' | 'user_joined';
  description: string;
  timestamp: string;
  user?: string;
  event?: string;
}

interface TopEvent {
  id: string;
  title: string;
  registrations: number;
  capacity: number;
  revenue: number;
  rating: number | null;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [topEvents, setTopEvents] = useState<TopEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, activityData, eventsData] = await Promise.all([
        getDashboardStats(),
        getRecentActivity(),
        getTopEvents()
      ]);

      setStats(statsData);
      setRecentActivity(activityData);
      setTopEvents(eventsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast({
        title: "Error Loading Dashboard",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    trend = 'up' 
  }: { 
    title: string; 
    value: string | number; 
    change: string; 
    icon: any; 
    trend?: 'up' | 'down' | 'neutral';
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${
          trend === 'up' ? 'text-green-600' : 
          trend === 'down' ? 'text-red-600' : 
          'text-muted-foreground'
        }`}>
          {change}
        </p>
      </CardContent>
    </Card>
  );

  const ActivityItem = ({ activity }: { activity: RecentActivity }) => {
    const getActivityIcon = (type: string) => {
      switch (type) {
        case 'registration': return <UserPlus className="h-4 w-4 text-green-600" />;
        case 'event_created': return <CalendarPlus className="h-4 w-4 text-blue-600" />;
        case 'event_updated': return <Settings className="h-4 w-4 text-orange-600" />;
        case 'user_joined': return <Users className="h-4 w-4 text-purple-600" />;
        default: return <Activity className="h-4 w-4 text-muted-foreground" />;
      }
    };

    return (
      <div className="flex items-center gap-3 p-3 rounded-lg border">
        {getActivityIcon(activity.type)}
        <div className="flex-1">
          <p className="text-sm font-medium">{activity.description}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(activity.timestamp).toLocaleDateString()} at{' '}
            {new Date(activity.timestamp).toLocaleTimeString()}
          </p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-96" />
            </div>
            <div>
              <Skeleton className="h-96" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Navigation */}
        <AdminNavigation />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Events"
            value={stats?.totalEvents || 0}
            change="+12% from last month"
            icon={Calendar}
            trend="up"
          />
          <StatCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            change="+8% from last month"
            icon={Users}
            trend="up"
          />
          <StatCard
            title="Total Registrations"
            value={stats?.totalRegistrations || 0}
            change="+15% from last month"
            icon={UserPlus}
            trend="up"
          />
          <StatCard
            title="Revenue"
            value={`₵${stats?.totalRevenue || 0}`}
            change="+22% from last month"
            icon={DollarSign}
            trend="up"
          />
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Charts and Analytics */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Active Events</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        {stats?.activeEvents || 0}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-muted-foreground">Currently running</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Pending Registrations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-600">
                        {stats?.pendingRegistrations || 0}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <span className="text-sm text-muted-foreground">Need approval</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Average Rating</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">
                        {stats?.averageRating?.toFixed(1) || 'N/A'}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Star className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-muted-foreground">Event satisfaction</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Top Events */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Events</CardTitle>
                    <CardDescription>
                      Events with highest registration rates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topEvents.map((event, index) => (
                        <div key={event.id} className="flex items-center gap-4 p-3 rounded-lg border">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{event.title}</h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{event.registrations}/{event.capacity} registered</span>
                              <span>₵{event.revenue} revenue</span>
                              {event.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-current text-yellow-500" />
                                  <span>{event.rating.toFixed(1)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <Progress 
                            value={(event.registrations / event.capacity) * 100} 
                            className="w-20"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="events" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Event Management</CardTitle>
                    <CardDescription>
                      Quick actions for managing events
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Link to="/admin/events">
                        <Button className="w-full justify-start">
                          <CalendarPlus className="h-4 w-4 mr-2" />
                          Create New Event
                        </Button>
                      </Link>
                      <Link to="/admin/events/manage">
                        <Button variant="outline" className="w-full justify-start">
                          <Settings className="h-4 w-4 mr-2" />
                          Manage Events
                        </Button>
                      </Link>
                      <Link to="/admin/registrations">
                        <Button variant="outline" className="w-full justify-start">
                          <Users className="h-4 w-4 mr-2" />
                          View Registrations
                        </Button>
                      </Link>
                      <Link to="/admin/analytics">
                        <Button variant="outline" className="w-full justify-start">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Event Analytics
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                {/* Event Status Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Event Status Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {stats?.activeEvents || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">Active</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {stats?.totalEvents || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">Total</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-600">
                          {stats?.completedEvents || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          3
                        </div>
                        <div className="text-sm text-muted-foreground">Draft</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="users" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                      Manage community members and registrations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Link to="/admin/users">
                        <Button className="w-full justify-start">
                          <Users className="h-4 w-4 mr-2" />
                          Manage Users
                        </Button>
                      </Link>
                      <Link to="/admin/registrations">
                        <Button variant="outline" className="w-full justify-start">
                          <UserPlus className="h-4 w-4 mr-2" />
                          View Registrations
                        </Button>
                      </Link>
                      <Link to="/admin/feedback">
                        <Button variant="outline" className="w-full justify-start">
                          <Star className="h-4 w-4 mr-2" />
                          User Feedback
                        </Button>
                      </Link>
                      <Link to="/admin/analytics/users">
                        <Button variant="outline" className="w-full justify-start">
                          <PieChart className="h-4 w-4 mr-2" />
                          User Analytics
                        </Button>
                      </Link>
                    </div>

                    {/* User Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="text-center p-4 bg-muted/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {stats?.totalUsers || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Users</div>
                      </div>
                      <div className="text-center p-4 bg-muted/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {Math.round((stats?.totalRegistrations || 0) / (stats?.totalUsers || 1) * 10) / 10}
                        </div>
                        <div className="text-sm text-muted-foreground">Avg. Events/User</div>
                      </div>
                      <div className="text-center p-4 bg-muted/20 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {stats?.pendingRegistrations || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">Pending</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Recent Activity Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest actions in your community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity) => (
                      <ActivityItem key={activity.id} activity={activity} />
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No recent activity
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/admin/events">
                  <Button className="w-full justify-start">
                    <CalendarPlus className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                </Link>
                <Link to="/admin/users">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                  </Button>
                </Link>
                <Link to="/admin/settings">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={loadDashboardData}
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Payment System</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Service</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">File Storage</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Online
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
