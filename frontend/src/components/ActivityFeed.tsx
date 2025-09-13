import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { ledgerApiClient } from '@/api/ledger';
import { ActivityEvent } from '@/types/ledger';
import toast from 'react-hot-toast';

interface ActivityFeedProps {
  tenantId: string;
  limit?: number;
}

export default function ActivityFeed({ tenantId, limit = 10 }: ActivityFeedProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);
  const pollingIntervalRef = useRef<number | null>(null);

  // Initial fetch of activity events
  const { data: initialEvents, refetch } = useQuery({
    queryKey: ['activity-events', tenantId, limit],
    queryFn: () => ledgerApiClient.getActivityEvents(tenantId, limit),
    refetchInterval: 30000, // Fallback polling every 30 seconds
  });

  useEffect(() => {
    if (initialEvents) {
      setEvents(initialEvents);
    }
  }, [initialEvents]);

  // Setup real-time connection
  useEffect(() => {
    const setupRealTimeConnection = () => {
      try {
        // Try Server-Sent Events first
        const eventSource = ledgerApiClient.createEventStream(tenantId);
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
          setIsConnected(true);
          console.log('Real-time connection established');
        };

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            if (data.type === 'journal.posted') {
              const newEvent: ActivityEvent = {
                id: data.id || Date.now().toString(),
                type: 'journal.posted',
                tenantId: data.tenantId,
                journalEntryId: data.journalEntryId,
                reference: data.reference,
                description: data.description || `Journal entry posted${data.reference ? ` for ${data.reference}` : ''}`,
                createdAt: data.createdAt || new Date().toISOString(),
              };

              setEvents(prev => [newEvent, ...prev.slice(0, limit - 1)]);
              
              // Show toast notification
              toast.success(`New journal entry posted${data.reference ? `: ${data.reference}` : ''}`);
            }
          } catch (error) {
            console.error('Failed to parse event data:', error);
          }
        };

        eventSource.onerror = (error) => {
          console.error('EventSource error:', error);
          setIsConnected(false);
          
          // Fallback to polling if SSE fails
          if (!pollingIntervalRef.current) {
            startPolling();
          }
        };

      } catch (error) {
        console.error('Failed to setup real-time connection:', error);
        setIsConnected(false);
        startPolling();
      }
    };

    const startPolling = () => {
      pollingIntervalRef.current = setInterval(async () => {
        try {
          const newEvents = await ledgerApiClient.getActivityEvents(tenantId, limit);
          setEvents(newEvents);
        } catch (error) {
          console.error('Polling error:', error);
        }
      }, 15000); // Poll every 15 seconds as fallback
    };

    setupRealTimeConnection();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [tenantId, limit]);

  const handleRefresh = () => {
    refetch();
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'journal.posted':
        return <Activity className="h-4 w-4 text-green-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getEventBadgeColor = (type: string) => {
    switch (type) {
      case 'journal.posted':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activity Feed
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {isConnected ? (
                <Wifi className="h-4 w-4 text-green-600" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-600" />
              )}
              <span className="text-xs text-muted-foreground">
                {isConnected ? 'Live' : 'Polling'}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription>
          Real-time updates on journal entries and account changes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent activity</p>
            </div>
          ) : (
            events.map((event) => (
              <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg border bg-gray-50">
                <div className="flex-shrink-0 mt-0.5">
                  {getEventIcon(event.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={getEventBadgeColor(event.type)}>
                      {event.type.replace('.', ' ')}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(event.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-900">{event.description}</p>
                  {event.reference && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Reference: {event.reference}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
