import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Database, AlertCircle, CheckCircle } from 'lucide-react';
import { testSupabaseConnection } from '@/lib/test-events';
import { uploadSampleEvents, clearAllEvents } from '@/lib/sample-events-upload';
import { checkRLSPolicies, getTableStructure } from '@/lib/check-rls-policies';

interface DatabaseStatusProps {
  onStatusChange?: (status: 'connected' | 'disconnected' | 'testing') => void;
}

export const DatabaseStatus = ({ onStatusChange }: DatabaseStatusProps) => {
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'testing'>('testing');
  const [details, setDetails] = useState<any>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [rlsDetails, setRlsDetails] = useState<any>(null);

  const checkConnection = async () => {
    setStatus('testing');
    onStatusChange?.('testing');
    
    try {
      const result = await testSupabaseConnection();
      setDetails(result);
      
      if (result.success) {
        setStatus('connected');
        onStatusChange?.('connected');
      } else {
        setStatus('disconnected');
        onStatusChange?.('disconnected');
      }
    } catch (error) {
      setStatus('disconnected');
      onStatusChange?.('disconnected');
      setDetails({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
    
    setLastChecked(new Date());
  };

  const checkRLS = async () => {
    try {
      const rlsResult = await checkRLSPolicies();
      const structureResult = await getTableStructure();
      setRlsDetails({ rls: rlsResult, structure: structureResult });
    } catch (error) {
      console.error('Error checking RLS:', error);
    }
  };

  useEffect(() => {
    checkConnection();
    checkRLS();
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'disconnected':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'testing':
        return <RefreshCw className="h-4 w-4 text-yellow-600 animate-spin" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'disconnected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'testing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  if (process.env.NODE_ENV !== 'development') {
    return null; // Only show in development
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Database className="h-4 w-4" />
          Database Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-sm font-medium">
              {status === 'connected' && 'Connected to Supabase'}
              {status === 'disconnected' && 'Database Connection Failed'}
              {status === 'testing' && 'Testing Connection...'}
            </span>
          </div>
          <Badge className={getStatusColor()}>
            {status.toUpperCase()}
          </Badge>
        </div>
        
        {details && (
          <div className="text-xs text-muted-foreground space-y-1">
            {details.success && (
              <>
                <div>✅ Events found: {details.eventsCount}</div>
                {details.sampleEvent && (
                  <div>📝 Sample event: {details.sampleEvent.title}</div>
                )}
              </>
            )}
            {!details.success && (
              <div className="text-red-600">❌ Error: {details.error}</div>
            )}
          </div>
        )}

        {rlsDetails && (
          <div className="text-xs text-muted-foreground space-y-1 mt-2 pt-2 border-t">
            <div className="font-medium">RLS & Table Access:</div>
            <div>📋 Table accessible: {rlsDetails.rls?.tableAccessible ? '✅' : '❌'}</div>
            <div>✏️ Can insert: {rlsDetails.rls?.canInsert ? '✅' : '❌'}</div>
            <div>🗑️ Can delete: {rlsDetails.rls?.canDelete ? '✅' : '❌'}</div>
            <div>📊 Has data: {rlsDetails.structure?.hasData ? '✅' : '❌'}</div>
            {rlsDetails.rls?.errors?.table && (
              <div className="text-red-600">❌ Table error: {rlsDetails.rls.errors.table}</div>
            )}
            {rlsDetails.rls?.errors?.insert && (
              <div className="text-red-600">❌ Insert error: {rlsDetails.rls.errors.insert}</div>
            )}
          </div>
        )}
        
        {lastChecked && (
          <div className="text-xs text-muted-foreground">
            Last checked: {lastChecked.toLocaleTimeString()}
          </div>
        )}
        
        <div className="space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={checkConnection}
            disabled={status === 'testing'}
            className="w-full"
          >
            <RefreshCw className={`h-3 w-3 mr-2 ${status === 'testing' ? 'animate-spin' : ''}`} />
            Test Connection
          </Button>
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={async () => {
                const result = await uploadSampleEvents();
                if (result.success) {
                  alert('Sample events uploaded successfully!');
                  checkConnection();
                  checkRLS();
                } else {
                  alert('Failed to upload: ' + result.error);
                }
              }}
              className="text-xs"
            >
              Upload Sample
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={async () => {
                if (confirm('Are you sure you want to clear all events?')) {
                  const result = await clearAllEvents();
                  if (result.success) {
                    alert('All events cleared!');
                    checkConnection();
                    checkRLS();
                  } else {
                    alert('Failed to clear: ' + result.error);
                  }
                }
              }}
              className="text-xs"
            >
              Clear All
            </Button>
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={checkRLS}
            className="w-full text-xs"
          >
            🔍 Check RLS Policies
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
