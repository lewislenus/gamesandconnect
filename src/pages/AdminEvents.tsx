import { useState, useEffect, useCallback, type ChangeEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
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

// Helper functions for time formatting
function formatSingleTime(timeStr: string): string {
  return timeStr.replace(/([ap])m/i, ' $1M').replace(/\s+/g, ' ').trim().toUpperCase();
}

function formatTimeRange(rangeStr: string): string {
  const parts = rangeStr.split(/\s*[-–—]\s*/);
  if (parts.length === 2) {
    let startTime = parts[0].trim();
    let endTime = parts[1].trim();
    
    startTime = formatSingleTime(startTime);
    endTime = formatSingleTime(endTime);
    
    if (!/[ap]m/i.test(endTime) && /[ap]m/i.test(startTime)) {
      const ampm = startTime.match(/([ap]m)/i)?.[1] || 'AM';
      endTime = endTime + ' ' + ampm.toUpperCase();
    }
    
    return `${startTime} - ${endTime}`;
  }
  
  return formatSingleTime(rangeStr);
}

interface EventForm {
  title: string;
  description: string;
  date: string; // display string; raw yyyy-mm-dd kept separately
  time_range: string;
  location: string;
  category: 'trivia' | 'gaming' | 'travel' | 'social' | '';
  price: string;
  organizer: string; // direct field in DB
  capacity: number | null; // required DB column
  requirements: string[];
  includes: string[];
  agenda: { time: string; activity: string }[];
}

const initialForm: EventForm = {
  title: '',
  description: '',
  date: '',
  time_range: '',
  location: '',
  category: 'social',
  price: '',
  organizer: '',
  capacity: null,
  requirements: [''],
  includes: [''],
  agenda: [{ time: '', activity: '' }]
};

// Type aligned with Supabase events schema
interface AdminEventRow {
  id: number | string;
  title: string;
  date: string; // yyyy-mm-dd
  time_range: string;
  location: string;
  description: string;
  image_url?: string | null;
  price?: string | null;
  capacity?: number | null;
  created_at?: string | null;
  organizer?: string | null; // direct field in DB
  category?: string | null;
  additional_info?: any | null; // Can be null since we don't use it anymore
  gallery?: any;
  event_schedule?: string | null; // normalized snake_case column
  agenda?: Array<{ time: string; activity: string }> | null; // parsed from event_schedule for UI convenience
  requirements?: string[] | null;
  includes?: string[] | null;
}

export default function AdminEvents() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [form, setForm] = useState<EventForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [flyerFile, setFlyerFile] = useState<File | null>(null);
  const [flyerPreview, setFlyerPreview] = useState<string | null>(null);
  const [uploadingFlyer, setUploadingFlyer] = useState(false);
  const [dateRaw, setDateRaw] = useState<string>('');
  const { toast } = useToast();

  // Events list state
  const [events, setEvents] = useState<AdminEventRow[]>([]);
  const [listLoading, setListLoading] = useState<boolean>(false);

  const fetchEvents = useCallback(async () => {
    try {
      setListLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });
      if (error) throw error;
      const normalized: AdminEventRow[] = (data || []).map((ev: any) => ({
        id: ev.id,
        title: ev.title,
        date: ev.date,
        time_range: ev.time_range,
        location: ev.location,
        description: ev.description,
        image_url: ev.image_url ?? null,
        price: ev.price ?? null,
        capacity: ev.capacity ?? null,
        created_at: ev.created_at ?? null,
        organizer: ev.organizer ?? null, // direct field from DB
        category: ev.category ?? null,
        additional_info: ev.additional_info ?? null,
        gallery: ev.gallery ?? null,
        event_schedule: ev.event_schedule ?? ev["event schedule"] ?? null,
        agenda: (ev.event_schedule ?? ev["event schedule"]) 
          ? String(ev.event_schedule ?? ev["event schedule"]) 
              .split(/\n+/)
              .map((line: string) => line.trim())
              .filter(Boolean)
              .map((line: string) => {
                // Enhanced time/activity parsing: supports formats
                const rangeMatch = line.match(/^(\d{1,2}:\d{2}(?:\s*(?:AM|PM))?\s*-\s*\d{1,2}:\d{2}(?:\s*(?:AM|PM))?)(?:\s+[-–—]\s+|\s+)(.+)$/i);
                if (rangeMatch) return { time: formatTimeRange(rangeMatch[1]), activity: rangeMatch[2].trim() };
                
                const dashMatch = line.match(/^(\d{1,2}:\d{2}(?:\s*(?:AM|PM))?)\s*[-–—:]\s*(.+)$/i);
                if (dashMatch) return { time: formatSingleTime(dashMatch[1]), activity: dashMatch[2].trim() };
                
                const startMatch = line.match(/^(\d{1,2}:\d{2}(?:\s*(?:AM|PM))?)\s+(.+)$/i);
                if (startMatch) return { time: formatSingleTime(startMatch[1]), activity: startMatch[2].trim() };
                
                return { time: '', activity: line };
              }).filter(item => item.activity)
          : null,
        requirements: Array.isArray(ev.requirements) ? ev.requirements : null,
        includes: Array.isArray(ev.includes) ? ev.includes : null,
      }));
      setEvents(normalized);
    } catch (err: any) {
      console.error('[Supabase fetch events error]', err);
      toast({
        title: 'Failed to load events',
        description: err?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setListLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Auto-load event for editing from URL params
  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId && events.length > 0) {
      const eventToEdit = events.find(ev => String(ev.id) === editId);
      if (eventToEdit) {
        console.log('Auto-loading event for edit from URL:', eventToEdit);
        const displayDate = new Date(eventToEdit.date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        
        const formData = {
          title: eventToEdit.title || '',
          description: eventToEdit.description || '',
          date: displayDate,
          time_range: eventToEdit.time_range || '',
          location: eventToEdit.location || '',
          category: (eventToEdit.category as any) || 'social',
          price: eventToEdit.price || '',
          organizer: eventToEdit.organizer || '',
          capacity: eventToEdit.capacity ?? null,
          requirements: eventToEdit.requirements && eventToEdit.requirements.length ? [...eventToEdit.requirements] : [''],
          includes: eventToEdit.includes && eventToEdit.includes.length ? [...eventToEdit.includes] : [''],
          agenda: eventToEdit.agenda && eventToEdit.agenda.length ? [...eventToEdit.agenda] : [{ time: '', activity: '' }]
        };
        
        setForm(formData);
        setDateRaw(eventToEdit.date);
        setEditingId(eventToEdit.id);
        // Clear the URL param after loading
        setSearchParams({});
        // Scroll to top to show the form
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [searchParams, events, setSearchParams]);

  const updateArrayField = (field: 'requirements' | 'includes', index: number, value: string) => {
    const newArray = [...form[field]];
    newArray[index] = value;
    setForm({ ...form, [field]: newArray });
  };

  const handleDelete = async (id: number | string) => {
    try {
      const confirmed = window.confirm('Delete this event? This cannot be undone.');
      if (!confirmed) return;
      // Normalize bigint id which may arrive as string from UI
      const eventId = typeof id === 'string' ? Number(id) : id;
      if (typeof eventId === 'number' && Number.isNaN(eventId)) {
        throw new Error('Invalid event id');
      }
      // Supabase types for this project expect a string for id comparison
      const { error } = await supabase.from('events').delete().eq('id', String(eventId));
      if (error) throw error;
      toast({ title: 'Deleted', description: 'Event removed.' });
      fetchEvents();
    } catch (err: any) {
      console.error('[Supabase delete error]', err);
      toast({ title: 'Error', description: err?.message || 'Failed to delete event', variant: 'destructive' });
    }
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
    newAgenda[index] = { ...newAgenda[index], [field]: value } as any;
    setForm({ ...form, agenda: newAgenda });
  };

  const addAgendaItem = () => {
    setForm({ ...form, agenda: [...form.agenda, { time: '', activity: '' }] });
  };

  const removeAgendaItem = (index: number) => {
    const newAgenda = form.agenda.filter((_, i) => i !== index);
    setForm({ ...form, agenda: newAgenda });
  };

  const handleFlyerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFlyerFile(file);
    setFlyerPreview(file ? URL.createObjectURL(file) : null);
  };

  const uploadFlyerToCloudinary = async (file: File): Promise<{ url: string; public_id: string } | null> => {
    try {
      setUploadingFlyer(true);
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;
      const folder = (import.meta.env.VITE_CLOUDINARY_FOLDER as string) || 'flyers';

      if (!cloudName || !uploadPreset) {
        throw new Error('Cloudinary is not configured. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      formData.append('folder', folder);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Cloudinary upload failed: ${errText}`);
      }

      const data = await res.json();
      return { url: data.secure_url as string, public_id: data.public_id as string };
    } catch (err: any) {
      console.error('Error uploading to Cloudinary:', err);
      toast({
        title: 'Flyer Upload Failed',
        description: err.message || 'Could not upload flyer image. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploadingFlyer(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Basic validation for required DB columns
      if (!dateRaw) throw new Error('Please select a valid date.');
      if (!form.time_range?.trim()) throw new Error('Please provide a time range.');
      if (!form.location?.trim()) throw new Error('Please provide a location.');
      if (!form.title?.trim() || !form.description?.trim()) throw new Error('Title and Description are required.');
  if (form.capacity == null || isNaN(form.capacity) || form.capacity <= 0) throw new Error('Capacity is required and must be > 0.');

      // Upload flyer if provided
      let flyerUrl: string | null = null;
      if (flyerFile) {
        const uploaded = await uploadFlyerToCloudinary(flyerFile);
        if (!uploaded) throw new Error('Flyer upload failed');
        flyerUrl = uploaded.url;
      }

      // Clean up empty items
      const cleanRequirements = form.requirements.filter(req => req.trim() !== '');
      const cleanIncludes = form.includes.filter(inc => inc.trim() !== '');
      const cleanAgenda = form.agenda.filter(item => item.time.trim() !== '' && item.activity.trim() !== '');

      // Build payload matching DB columns exactly
      const eventData: Record<string, any> = {
        title: form.title,
        description: form.description,
        date: dateRaw, // yyyy-mm-dd for date column
        time_range: form.time_range,
        location: form.location,
        category: form.category || null,
        price: form.price || null,
        image_url: flyerUrl || null, // Only from flyer upload, no manual emoji input
        capacity: form.capacity!,
        organizer: form.organizer || null, // direct field in DB
        requirements: cleanRequirements.length > 0 ? cleanRequirements : null, // JSONB array
        includes: cleanIncludes.length > 0 ? cleanIncludes : null, // JSONB array
        // Prefer new snake_case column if it exists; fallback to legacy spaced name handled by DB if needed
        event_schedule: cleanAgenda.length ? cleanAgenda.map(a => `${a.time} - ${a.activity}`).join('\n') : null,
        additional_info: null, // No additional info needed since we removed long_description
        gallery: null, // Can be added later if you wire a multi-image uploader
      };

      // Persist to DB (update when editing, insert otherwise)
      let dbOpError: any = null;
      if (editingId) {
        // Do not send id field on update payload; filter by id instead
        const { id, ...updatePayload } = eventData as any;
        const { error } = await supabase
          .from('events')
          .update(updatePayload)
          .eq('id', String(editingId));
        dbOpError = error;
      } else {
        const { error } = await supabase.from('events').insert([eventData as any]);
        dbOpError = error;
      }

      if (dbOpError) {
        // Retry with legacy column name if rename not applied
        if (String(dbOpError.message || '').includes('event_schedule')) {
          eventData['event schedule'] = eventData.event_schedule;
          delete eventData.event_schedule;
          if (editingId) {
            const { error: retryErr } = await supabase
              .from('events')
              .update(eventData as any)
              .eq('id', String(editingId));
            if (retryErr) throw retryErr;
          } else {
            const { error: retryErr } = await supabase.from('events').insert([eventData as any]);
            if (retryErr) throw retryErr;
          }
        } else {
          console.error('[Supabase save error]', dbOpError);
          throw dbOpError;
        }
      }

      toast({ title: 'Success!', description: editingId ? 'Event updated successfully.' : 'Event added successfully.' });

      // Reset form
      setForm(initialForm);
      setFlyerFile(null);
      setFlyerPreview(null);
      setDateRaw('');
      setEditingId(null);
      // Refresh list
      fetchEvents();
    } catch (error: any) {
      console.error('Error adding event:', error);
      toast({
        title: 'Error',
        description: error?.message || error?.hint || error?.details || 'Failed to add event. Please try again.',
        variant: 'destructive',
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
            <CardTitle>{editingId ? 'Edit Event' : 'Add New Event'}</CardTitle>
            <CardDescription>
              {editingId ? 'Update the event details below' : 'Create a new event for the Games & Connect website'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {editingId && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Editing Mode:</strong> You are currently editing an existing event. Make your changes and click "Update Event" to save.
                </p>
              </div>
            )}
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

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={dateRaw}
                    onChange={(e) => {
                      const raw = e.target.value; // yyyy-mm-dd
                      setDateRaw(raw);
                      if (raw) {
                        const formatted = new Date(raw + 'T00:00:00').toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        });
                        setForm({ ...form, date: formatted });
                      } else {
                        setForm({ ...form, date: '' });
                      }
                    }}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time Range</Label>
                  <Input
                    id="time"
                    value={form.time_range}
                    onChange={(e) => setForm({ ...form, time_range: e.target.value })}
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
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min={1}
                    value={form.capacity ?? ''}
                    onChange={(e) => setForm({ ...form, capacity: e.target.value ? parseInt(e.target.value, 10) : null })}
                    placeholder="e.g. 50"
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

              {/* Flyer Upload */}
              <div>
                <Label htmlFor="flyer">Event Flyer</Label>
                <Input id="flyer" type="file" accept="image/*" onChange={handleFlyerChange} />
                {flyerPreview && (
                  <img
                    src={flyerPreview}
                    alt="Flyer preview"
                    className="mt-2 h-40 w-auto rounded border"
                  />
                )}
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {(loading || uploadingFlyer) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {uploadingFlyer ? 'Uploading Flyer...' : (editingId ? 'Update Event' : 'Add Event')}
                </Button>
                {editingId && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setForm(initialForm);
                      setFlyerFile(null);
                      setFlyerPreview(null);
                      setDateRaw('');
                      setEditingId(null);
                    }}
                    className="px-8"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Existing Events */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Existing Events</CardTitle>
            <CardDescription>Events fetched from Supabase</CardDescription>
          </CardHeader>
          <CardContent>
            {listLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading events...
              </div>
            ) : events.length === 0 ? (
              <div className="text-sm text-muted-foreground">No events found.</div>
            ) : (
              <div className="space-y-3">
                {events.map((ev) => (
                  <div key={ev.id} className="flex items-start justify-between rounded border p-3">
                    <div className="flex items-start gap-4 flex-grow">
                      {ev.image_url &&
                        (ev.image_url.startsWith('http') ? (
                          <img
                            src={ev.image_url}
                            alt={ev.title}
                            className="h-24 w-24 rounded-md object-cover"
                          />
                        ) : (
                          <div className="flex h-24 w-24 items-center justify-center rounded-md bg-gray-100 text-4xl">
                            {ev.image_url}
                          </div>
                        ))}
                      <div className="space-y-1 flex-grow">
                        <div className="font-medium">{ev.title}</div>
                        <div className="text-sm text-muted-foreground">
                          <span>{new Date(ev.date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                          {ev.time_range && <span> • {ev.time_range}</span>}
                          {ev.location && <span> • {ev.location}</span>}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {ev.category && <span className="mr-2">Category: {ev.category}</span>}
                          {ev.organizer && <span className="mr-2">Organizer: {ev.organizer}</span>}
                          {typeof ev.capacity === 'number' && <span className="mr-2">Capacity: {ev.capacity}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => {
                        console.log('Edit button clicked for event:', ev);
                        // Load event into form for editing
                        const displayDate = new Date(ev.date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                        console.log('Parsed display date:', displayDate, 'from raw date:', ev.date);
                        
                        const formData = {
                          title: ev.title || '',
                          description: ev.description || '',
                          date: displayDate,
                          time_range: ev.time_range || '',
                          location: ev.location || '',
                          category: (ev.category as any) || 'social',
                          price: ev.price || '',
                          organizer: ev.organizer || '',
                          capacity: ev.capacity ?? null,
                          requirements: ev.requirements && ev.requirements.length ? [...ev.requirements] : [''],
                          includes: ev.includes && ev.includes.length ? [...ev.includes] : [''],
                          agenda: ev.agenda && ev.agenda.length ? [...ev.agenda] : [{ time: '', activity: '' }]
                        };
                        
                        console.log('Setting form data:', formData);
                        setForm(formData);
                        setDateRaw(ev.date);
                        setEditingId(ev.id);
                        console.log('Edit state set - editingId:', ev.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}>
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(ev.id)}>
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
