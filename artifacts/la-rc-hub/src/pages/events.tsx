import { useState } from "react";
import { Layout } from "@/components/layout";
import { 
  useListEvents, getListEventsQueryKey,
  useCreateEvent, useUpdateEvent, useDeleteEvent 
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MapPin, User, Trash2, Edit2, Plus, Clock } from "lucide-react";
import { format, isAfter, startOfDay } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Event } from "@workspace/api-client-react/src/generated/api.schemas";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  organizer: z.string().min(1, "Organizer is required"),
});

export default function Events() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: events, isLoading } = useListEvents({
    query: { queryKey: getListEventsQueryKey() }
  });

  const createMutation = useCreateEvent();
  const updateMutation = useUpdateEvent();
  const deleteMutation = useDeleteEvent();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      startDate: new Date().toISOString().slice(0, 16),
      endDate: "",
      organizer: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Format dates to ISO strings suitable for the API
    const formattedValues = {
      ...values,
      startDate: new Date(values.startDate).toISOString(),
      endDate: values.endDate ? new Date(values.endDate).toISOString() : undefined
    };

    if (editingId) {
      updateMutation.mutate(
        { id: editingId, data: formattedValues },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListEventsQueryKey() });
            setIsOpen(false);
            form.reset();
            setEditingId(null);
            toast({ title: "Event updated" });
          },
        }
      );
    } else {
      createMutation.mutate(
        { data: formattedValues },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListEventsQueryKey() });
            setIsOpen(false);
            form.reset();
            toast({ title: "Event created" });
          },
        }
      );
    }
  };

  const handleEdit = (event: Event) => {
    setEditingId(event.id);
    form.reset({
      title: event.title,
      description: event.description,
      location: event.location,
      startDate: new Date(event.startDate).toISOString().slice(0, 16),
      endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : "",
      organizer: event.organizer,
    });
    setIsOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this event?")) {
      deleteMutation.mutate(
        { id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListEventsQueryKey() });
            toast({ title: "Event deleted" });
          },
        }
      );
    }
  };

  // Sort events
  const today = startOfDay(new Date());
  
  const upcomingEvents = events
    ?.filter(e => isAfter(new Date(e.startDate), today) || new Date(e.startDate).getTime() === today.getTime())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()) || [];
    
  const pastEvents = events
    ?.filter(e => !isAfter(new Date(e.startDate), today) && new Date(e.startDate).getTime() !== today.getTime())
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()) || [];

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Events</h1>
            <p className="text-muted-foreground mt-2">Meetups, meetings, and activities.</p>
          </div>
          
          <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) {
              setTimeout(() => {
                form.reset();
                setEditingId(null);
              }, 200);
            }
          }}>
            <DialogTrigger asChild>
              <Button className="shrink-0 gap-2">
                <Plus className="h-4 w-4" /> Schedule Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Event" : "Schedule Event"}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Monthly Meetup" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date & Time</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Time (Optional)</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Community Center or Zoom link" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Event details..." className="min-h-[100px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="organizer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organizer</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name or group" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                      {editingId ? "Save Changes" : "Schedule"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : (
          <div className="space-y-12">
            <div>
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" /> Upcoming
              </h2>
              <div className="grid gap-6">
                {upcomingEvents.map((event) => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onEdit={() => handleEdit(event)}
                    onDelete={() => handleDelete(event.id)}
                    upcoming={true}
                  />
                ))}
                {upcomingEvents.length === 0 && (
                  <Card className="bg-muted/50 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                      <Calendar className="h-12 w-12 text-muted-foreground/50 mb-4" />
                      <h3 className="text-lg font-medium text-foreground">No upcoming events</h3>
                      <p className="mt-1">Schedule something to get the community together.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {pastEvents.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-6 text-muted-foreground">Past Events</h2>
                <div className="grid gap-6 md:grid-cols-2 opacity-75 grayscale-[0.2]">
                  {pastEvents.map((event) => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      onEdit={() => handleEdit(event)}
                      onDelete={() => handleDelete(event.id)}
                      upcoming={false}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

function EventCard({ event, onEdit, onDelete, upcoming }: { event: Event, onEdit: () => void, onDelete: () => void, upcoming: boolean }) {
  const startDate = new Date(event.startDate);
  
  return (
    <Card className={`overflow-hidden transition-all ${upcoming ? 'hover:shadow-md hover:border-primary/30 border-l-4 border-l-primary' : ''}`}>
      <div className="flex flex-col md:flex-row">
        {/* Date block */}
        <div className={`md:w-32 flex md:flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r border-border ${upcoming ? 'bg-primary/5 text-primary' : 'bg-muted/50'}`}>
          <div className="text-sm font-bold uppercase tracking-wider">{format(startDate, "MMM")}</div>
          <div className="text-3xl font-black mx-2 md:mx-0 leading-none">{format(startDate, "dd")}</div>
          <div className="text-sm font-medium">{format(startDate, "EEE")}</div>
        </div>
        
        {/* Content block */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start gap-4">
              <h3 className="text-xl font-bold tracking-tight">{event.title}</h3>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={onEdit}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={onDelete}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <p className="text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
              {event.description}
            </p>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5 text-foreground/80">
              <Clock className="h-4 w-4 text-primary" />
              <span className="font-medium">{format(startDate, "h:mm a")}</span>
              {event.endDate && (
                <> - <span>{format(new Date(event.endDate), "h:mm a")}</span></>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {event.location}
            </div>
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              {event.organizer}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}