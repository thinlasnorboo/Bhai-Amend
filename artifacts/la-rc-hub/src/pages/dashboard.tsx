import { Layout } from "@/components/layout";
import { 
  useGetStats, getGetStatsQueryKey, 
  useGetRecentActivity, getGetRecentActivityQueryKey,
  useGetUpcomingEvents, getGetUpcomingEventsQueryKey,
  useListAnnouncements, getListAnnouncementsQueryKey
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Megaphone, MessageSquare, Calendar, Pin } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetStats({
    query: { queryKey: getGetStatsQueryKey() }
  });
  
  const { data: activity, isLoading: activityLoading } = useGetRecentActivity({
    query: { queryKey: getGetRecentActivityQueryKey() }
  });
  
  const { data: upcomingEvents, isLoading: eventsLoading } = useGetUpcomingEvents({
    query: { queryKey: getGetUpcomingEventsQueryKey() }
  });

  const { data: announcements, isLoading: announcementsLoading } = useListAnnouncements({
    query: { queryKey: getListAnnouncementsQueryKey() }
  });

  const pinnedAnnouncements = announcements?.filter(a => a.pinned) || [];

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back to the Hub</h1>
          <p className="text-muted-foreground mt-2">Here's what's happening in the community today.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Members" value={stats?.totalMembers} icon={Users} loading={statsLoading} />
          <StatCard title="Announcements" value={stats?.totalAnnouncements} icon={Megaphone} loading={statsLoading} />
          <StatCard title="Channels" value={stats?.totalChannels} icon={MessageSquare} loading={statsLoading} />
          <StatCard title="Upcoming Events" value={stats?.upcomingEventsCount} icon={Calendar} loading={statsLoading} />
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-8">
            {/* Pinned Announcements */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Pin className="h-5 w-5 text-primary" />
                  Pinned Announcements
                </h2>
                <Link href="/announcements" className="text-sm text-primary hover:underline font-medium">View all</Link>
              </div>
              <div className="space-y-4">
                {announcementsLoading ? (
                  <Skeleton className="h-32 w-full rounded-xl" />
                ) : pinnedAnnouncements.length > 0 ? (
                  pinnedAnnouncements.map((announcement) => (
                    <Card key={announcement.id} className="border-primary/20 bg-primary/5">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{announcement.title}</CardTitle>
                        <div className="text-xs text-muted-foreground">
                          Posted by <span className="font-medium">{announcement.author}</span> on {format(new Date(announcement.createdAt), "MMM d, yyyy")}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                          {announcement.content}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="bg-muted/50 border-dashed">
                    <CardContent className="p-8 text-center text-muted-foreground">
                      No pinned announcements right now.
                    </CardContent>
                  </Card>
                )}
              </div>
            </section>

            {/* Recent Activity */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <Card>
                <CardContent className="p-0">
                  {activityLoading ? (
                    <div className="p-6 space-y-4">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ) : activity && activity.length > 0 ? (
                    <div className="divide-y border-t-0">
                      {activity.map((item) => (
                        <div key={item.id} className="p-4 flex items-start gap-4 hover:bg-muted/50 transition-colors">
                          <div className="mt-1 bg-primary/10 p-2 rounded-full text-primary">
                            {item.type === 'message' && <MessageSquare className="h-4 w-4" />}
                            {item.type === 'announcement' && <Megaphone className="h-4 w-4" />}
                            {item.type === 'event' && <Calendar className="h-4 w-4" />}
                            {item.type === 'member' && <Users className="h-4 w-4" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm"><span className="font-semibold">{item.actor}</span> {item.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">{format(new Date(item.occurredAt), "MMM d, h:mm a")}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      No recent activity.
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          </div>

          <div className="space-y-8">
            {/* Upcoming Events */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Upcoming Events</h2>
                <Link href="/events" className="text-sm text-primary hover:underline font-medium">View all</Link>
              </div>
              <div className="space-y-4">
                {eventsLoading ? (
                  <Skeleton className="h-24 w-full rounded-xl" />
                ) : upcomingEvents && upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <Card key={event.id} className="overflow-hidden hover:border-primary/50 transition-colors">
                      <div className="h-1 bg-primary w-full" />
                      <CardContent className="p-4">
                        <div className="font-semibold truncate">{event.title}</div>
                        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(event.startDate), "MMM d, h:mm a")}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 truncate">
                          {event.location}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="bg-muted/50 border-dashed">
                    <CardContent className="p-6 text-center text-muted-foreground text-sm">
                      No upcoming events.
                    </CardContent>
                  </Card>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ title, value, icon: Icon, loading }: { title: string, value?: number, icon: any, loading: boolean }) {
  return (
    <Card>
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          {loading ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <p className="text-3xl font-bold">{value || 0}</p>
          )}
        </div>
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Icon className="h-6 w-6" />
        </div>
      </CardContent>
    </Card>
  );
}
