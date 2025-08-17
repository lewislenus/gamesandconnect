import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import AdminNavigation from '@/components/AdminNavigation';

interface EventForm {
  title: string;
  description: string;
  long_description: string;
  date: string;
  time: string;
  location: string;
  category: 'trivia' | 'gaming' | 'travel' | 'social';
  spots: number;
  total_spots: number;
  price: string;
  image: string;
  status: 'open' | 'filling-fast' | 'almost-full' | 'full';
  organizer: string;
  requirements: string[];
  includes: string[];
  agenda: { time: string; activity: string }[];
}

const initialForm: EventForm = {
  title: '',
  description: '',
  long_description: '',
  date: '',
  time: '',
  location: '',
  category: 'social',
  spots: 0,
  total_spots: 0,
  price: '',
  image: '🎮',
  status: 'open',
  organizer: '',
  requirements: [''],
  includes: [''],
  agenda: [{ time: '', activity: '' }]
};

export default function AdminEvents() {
  const [form, setForm] = useState<EventForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const updateArrayField = (field: 'requirements' | 'includes', index: number, value: string) => {
    const newArray = [...form[field]];
    newArray[index] = value;
    setForm({ ...form, [field]: newArray });
  };

  const addArrayItem = (field: 'requirements' | 'includes') => {
    setForm({ ...form, [field]: [...form[field], ''] });
  };

  const removeArrayItem = (field: 'requirements' | 'includes', index: number) => {
    const newArray = form[field].filter((_, i) => i !== index);
    setForm({ ...form, [field]: newArray });
  };

  const updateAgenda = (index: number, field: 'time' | 'activity', value: string) => {
    const newAgenda = [...form.agenda];
    newAgenda[index] = { ...newAgenda[index], [field]: value };
    setForm({ ...form, agenda: newAgenda });
  };

  const addAgendaItem = () => {
    setForm({ ...form, agenda: [...form.agenda, { time: '', activity: '' }] });
  };

  const removeAgendaItem = (index: number) => {
    const newAgenda = form.agenda.filter((_, i) => i !== index);
    setForm({ ...form, agenda: newAgenda });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Clean up empty items
      const cleanRequirements = form.requirements.filter(req => req.trim() !== '');
      const cleanIncludes = form.includes.filter(inc => inc.trim() !== '');
      const cleanAgenda = form.agenda.filter(item => item.time.trim() !== '' && item.activity.trim() !== '');

      const eventData = {
        title: form.title,
        description: form.description,
        long_description: form.long_description,
        date: form.date,
        time: form.time,
        location: form.location,
        category: form.category,
        spots: form.spots,
        total_spots: form.total_spots,
        price: form.price,
        image: form.image,
        status: form.status,
        organizer: form.organizer,
        requirements: JSON.stringify(cleanRequirements),
        includes: JSON.stringify(cleanIncludes),
        agenda: JSON.stringify(cleanAgenda),
        flyer: JSON.stringify({
          url: `https://res.cloudinary.com/games-and-connect/image/upload/v1/flyers/${form.title.toLowerCase().replace(/\s+/g, '-')}`,
          downloadUrl: `/downloads/${form.title.toLowerCase().replace(/\s+/g, '-')}-flyer.pdf`,
          alt: `${form.title} Event Flyer`
        })
      };

      const { error } = await supabase
        .from('events')
        .insert([eventData]);

      if (error) {
        throw error;
      }

      toast({
        title: "Success!",
        description: "Event added successfully.",
      });

      // Reset form
      setForm(initialForm);
    } catch (error: any) {
      console.error('Error adding event:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Admin Navigation */}
        <AdminNavigation />
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Add New Event</CardTitle>
            <CardDescription>
              Create a new event for the Games & Connect website
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="organizer">Organizer</Label>
                  <Input
                    id="organizer"
                    value={form.organizer}
                    onChange={(e) => setForm({ ...form, organizer: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Short Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="long_description">Long Description</Label>
                <Textarea
                  id="long_description"
                  value={form.long_description}
                  onChange={(e) => setForm({ ...form, long_description: e.target.value })}
                  rows={5}
                />
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    placeholder="December 15, 2024"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    placeholder="7:00 PM - 11:00 PM"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Category and Status */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={form.category} onValueChange={(value: any) => setForm({ ...form, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trivia">Trivia</SelectItem>
                      <SelectItem value="gaming">Gaming</SelectItem>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={form.status} onValueChange={(value: any) => setForm({ ...form, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="filling-fast">Filling Fast</SelectItem>
                      <SelectItem value="almost-full">Almost Full</SelectItem>
                      <SelectItem value="full">Full</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="₵25 or Free"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="image">Emoji</Label>
                  <Input
                    id="image"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="🎮"
                    required
                  />
                </div>
              </div>

              {/* Spots */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="total_spots">Total Spots</Label>
                  <Input
                    id="total_spots"
                    type="number"
                    value={form.total_spots}
                    onChange={(e) => setForm({ ...form, total_spots: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="spots">Available Spots</Label>
                  <Input
                    id="spots"
                    type="number"
                    value={form.spots}
                    onChange={(e) => setForm({ ...form, spots: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
              </div>

              {/* Requirements */}
              <div>
                <Label>Requirements</Label>
                {form.requirements.map((req, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <Input
                      value={req}
                      onChange={(e) => updateArrayField('requirements', index, e.target.value)}
                      placeholder="Enter requirement"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeArrayItem('requirements', index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayItem('requirements')}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Requirement
                </Button>
              </div>

              {/* Includes */}
              <div>
                <Label>What's Included</Label>
                {form.includes.map((inc, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <Input
                      value={inc}
                      onChange={(e) => updateArrayField('includes', index, e.target.value)}
                      placeholder="Enter what's included"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeArrayItem('includes', index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayItem('includes')}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              {/* Agenda */}
              <div>
                <Label>Agenda</Label>
                {form.agenda.map((item, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <Input
                      value={item.time}
                      onChange={(e) => updateAgenda(index, 'time', e.target.value)}
                      placeholder="Time (e.g., 7:00 PM)"
                      className="w-1/3"
                    />
                    <Input
                      value={item.activity}
                      onChange={(e) => updateAgenda(index, 'activity', e.target.value)}
                      placeholder="Activity description"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeAgendaItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addAgendaItem}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Agenda Item
                </Button>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Add Event
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
