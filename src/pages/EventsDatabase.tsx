import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Code, Database, Eye, FileText } from 'lucide-react';
import EventsDisplay from '@/components/EventsDisplay';

export default function EventsDatabase() {
  const [activeView, setActiveView] = useState('display');

  const codeExample = `
// Example: Fetching events from Supabase
import { fetchEventsFromSupabase } from '@/lib/events-fetcher';

async function loadEvents() {
  const result = await fetchEventsFromSupabase();
  
  if (result.success) {
    console.log('Events loaded:', result.data);
    // Handle successful data
    result.data.forEach(event => {
      console.log(\`Event: \${event.title}\`);
      console.log(\`Date: \${event.formatted_date}\`);
      console.log(\`Location: \${event.location}\`);
      console.log(\`Description: \${event.description}\`);
      console.log('---');
    });
  } else {
    console.error('Failed to load events:', result.error);
    // Handle error state
  }
}
  `.trim();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-accent py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Supabase Events Fetcher
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Comprehensive solution for fetching, handling, and displaying events data from Supabase 
            with proper error handling and loading states.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs value={activeView} onValueChange={setActiveView} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="display" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Live Display
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Implementation
            </TabsTrigger>
            <TabsTrigger value="docs" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documentation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="display">
            <EventsDisplay />
          </TabsContent>

          <TabsContent value="code" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Implementation Code</CardTitle>
                <CardDescription>
                  Complete code example showing how to fetch and handle events data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{codeExample}</code>
                </pre>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Key Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="w-2 h-2 p-0 rounded-full bg-green-500"></Badge>
                      Comprehensive error handling
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="w-2 h-2 p-0 rounded-full bg-green-500"></Badge>
                      Connection status checking
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="w-2 h-2 p-0 rounded-full bg-green-500"></Badge>
                      Loading states and skeletons
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="w-2 h-2 p-0 rounded-full bg-green-500"></Badge>
                      Data transformation and formatting
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="w-2 h-2 p-0 rounded-full bg-green-500"></Badge>
                      Responsive display components
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Error Handling</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="w-2 h-2 p-0 rounded-full bg-blue-500"></Badge>
                      Database connection failures
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="w-2 h-2 p-0 rounded-full bg-blue-500"></Badge>
                      Empty result sets
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="w-2 h-2 p-0 rounded-full bg-blue-500"></Badge>
                      Network timeouts
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="w-2 h-2 p-0 rounded-full bg-blue-500"></Badge>
                      Data parsing errors
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="w-2 h-2 p-0 rounded-full bg-blue-500"></Badge>
                      Graceful fallbacks
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="docs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Documentation</CardTitle>
                <CardDescription>
                  Complete guide to using the events fetcher functions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">fetchEventsFromSupabase()</h3>
                  <p className="text-muted-foreground mb-3">
                    Main function to fetch all events from the Supabase events table.
                  </p>
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Returns: FetchEventsResult</h4>
                    <ul className="text-sm space-y-1">
                      <li><code>success: boolean</code> - Whether the fetch was successful</li>
                      <li><code>data: EventData[]</code> - Array of enhanced event objects</li>
                      <li><code>error?: string</code> - Error message if fetch failed</li>
                      <li><code>isEmpty: boolean</code> - Whether the result set is empty</li>
                      <li><code>totalCount: number</code> - Total number of events</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">fetchEventById(eventId: string)</h3>
                  <p className="text-muted-foreground mb-3">
                    Fetches a single event by its ID with error handling.
                  </p>
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Returns: EventData | null</h4>
                    <p className="text-sm">Returns the event data or null if not found/error occurred.</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">checkDatabaseConnection()</h3>
                  <p className="text-muted-foreground mb-3">
                    Tests the database connection status.
                  </p>
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Returns: Connection Status</h4>
                    <ul className="text-sm space-y-1">
                      <li><code>connected: boolean</code> - Connection status</li>
                      <li><code>error?: string</code> - Error message if connection failed</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Database Schema</CardTitle>
                <CardDescription>
                  Expected structure of the events table
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Events Table Columns:</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <ul className="space-y-1">
                        <li><code>id</code> - Primary key (bigint)</li>
                        <li><code>title</code> - Event title (text)</li>
                        <li><code>description</code> - Short description (text)</li>
                        <li><code>long_description</code> - Detailed description (text)</li>
                        <li><code>date</code> - Event date (date)</li>
                        <li><code>time</code> - Event time (text)</li>
                      </ul>
                    </div>
                    <div>
                      <ul className="space-y-1">
                        <li><code>location</code> - Event location (text)</li>
                        <li><code>category</code> - Event category (text)</li>
                        <li><code>spots</code> - Available spots (integer)</li>
                        <li><code>total_spots</code> - Total capacity (integer)</li>
                        <li><code>price</code> - Event price (text)</li>
                        <li><code>status</code> - Event status (text)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}