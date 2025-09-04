import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminNavigation from '@/components/AdminNavigation';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Check, 
  X, 
  Clock,
  Users,
  Calendar,
  Mail,
  Phone,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getEventRegistrations, updateRegistrationStatus, EventRegistration } from '@/lib/admin-api';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminRegistrations() {
  const { toast } = useToast();
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRegistration, setSelectedRegistration] = useState<EventRegistration | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const loadRegistrations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getEventRegistrations();
      setRegistrations(data);
    } catch (error) {
      console.error('Failed to load registrations:', error);
      toast({
        title: "Error Loading Registrations",
        description: "Failed to load registration data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const filterRegistrations = useCallback(() => {
    let filtered = registrations;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(registration =>
        registration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registration.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registration.event?.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(registration => registration.status === statusFilter);
    }

    setFilteredRegistrations(filtered);
  }, [registrations, searchTerm, statusFilter]);

  useEffect(() => {
    loadRegistrations();
  }, [loadRegistrations]);

  useEffect(() => {
    filterRegistrations();
  }, [filterRegistrations]);

  const handleStatusUpdate = async (registrationId: string, newStatus: 'confirmed' | 'pending' | 'cancelled') => {
    setUpdatingStatus(registrationId);
    try {
      const result = await updateRegistrationStatus(registrationId, newStatus);
      
      if (result.success) {
        setRegistrations(prev => 
          prev.map(reg => 
            reg.id === registrationId 
              ? { ...reg, status: newStatus }
              : reg
          )
        );
        
        toast({
          title: "Status Updated",
          description: `Registration status updated to ${newStatus}.`,
        });
      } else {
        toast({
          title: "Update Failed",
          description: result.error || "Failed to update registration status.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Update Error",
        description: "An error occurred while updating the status.",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const exportRegistrations = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Event', 'Date', 'Status', 'Registration Date'].join(','),
      ...filteredRegistrations.map(reg => [
        reg.name,
        reg.email,
        reg.phone,
        reg.event?.title || '',
        reg.event?.date || '',
        reg.status,
        new Date(reg.created_at).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrations-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Registration data has been exported to CSV.",
    });
  };

  const stats = {
    total: registrations.length,
    confirmed: registrations.filter(r => r.status === 'confirmed').length,
    pending: registrations.filter(r => r.status === 'pending').length,
    cancelled: registrations.filter(r => r.status === 'cancelled').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>

          <Skeleton className="h-96" />
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Total Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="flex items-center gap-2 mt-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">All time</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Confirmed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
              <div className="flex items-center gap-2 mt-1">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-sm text-muted-foreground">Active participants</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="text-sm text-muted-foreground">Awaiting approval</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Cancelled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
              <div className="flex items-center gap-2 mt-1">
                <X className="h-4 w-4 text-red-600" />
                <span className="text-sm text-muted-foreground">No longer attending</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filter Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, or event..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={exportRegistrations} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Registrations Table */}
        <Card>
          <CardHeader>
            <CardTitle>Registrations ({filteredRegistrations.length})</CardTitle>
            <CardDescription>
              Manage event registrations and participant status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Participant</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Registration Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistrations.map((registration) => (
                    <TableRow key={registration.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{registration.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {registration.email}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {registration.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{registration.event?.title}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {registration.event?.date}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{registration.event?.date}</TableCell>
                      <TableCell>{getStatusBadge(registration.status)}</TableCell>
                      <TableCell>
                        {new Date(registration.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedRegistration(registration);
                              setShowDetails(true);
                            }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          
                          {registration.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 hover:bg-green-50"
                                onClick={() => handleStatusUpdate(registration.id, 'confirmed')}
                                disabled={updatingStatus === registration.id}
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:bg-red-50"
                                onClick={() => handleStatusUpdate(registration.id, 'cancelled')}
                                disabled={updatingStatus === registration.id}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                          
                          {registration.status === 'confirmed' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:bg-red-50"
                              onClick={() => handleStatusUpdate(registration.id, 'cancelled')}
                              disabled={updatingStatus === registration.id}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                          
                          {registration.status === 'cancelled' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 hover:bg-green-50"
                              onClick={() => handleStatusUpdate(registration.id, 'confirmed')}
                              disabled={updatingStatus === registration.id}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredRegistrations.length === 0 && (
              <div className="text-center py-12">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  No registrations found
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'No event registrations have been made yet.'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Registration Details Dialog */}
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Registration Details</DialogTitle>
              <DialogDescription>
                View and manage this registration
              </DialogDescription>
            </DialogHeader>
            
            {selectedRegistration && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Participant Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Name:</strong> {selectedRegistration.name}</div>
                      <div><strong>Email:</strong> {selectedRegistration.email}</div>
                      <div><strong>Phone:</strong> {selectedRegistration.phone}</div>
                      <div><strong>Status:</strong> {getStatusBadge(selectedRegistration.status)}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Event Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Event:</strong> {selectedRegistration.event?.title}</div>
                      <div><strong>Date:</strong> {selectedRegistration.event?.date}</div>
                      <div><strong>Location:</strong> {selectedRegistration.event?.location}</div>
                      <div><strong>Registered:</strong> {new Date(selectedRegistration.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <div className="space-x-2">
                    {selectedRegistration.status !== 'confirmed' && (
                      <Button
                        onClick={() => {
                          handleStatusUpdate(selectedRegistration.id, 'confirmed');
                          setShowDetails(false);
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Confirm
                      </Button>
                    )}
                    
                    {selectedRegistration.status !== 'cancelled' && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          handleStatusUpdate(selectedRegistration.id, 'cancelled');
                          setShowDetails(false);
                        }}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    )}
                  </div>
                  
                  <Button variant="outline" onClick={() => setShowDetails(false)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
