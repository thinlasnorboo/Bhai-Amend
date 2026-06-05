import { useState } from "react";
import { Layout } from "@/components/layout";
import { 
  useListAnnouncements, getListAnnouncementsQueryKey,
  useCreateAnnouncement, useUpdateAnnouncement, useDeleteAnnouncement 
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Pin, Megaphone, Trash2, Edit2, Plus } from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Announcement } from "@workspace/api-client-react/src/generated/api.schemas";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  author: z.string().min(1, "Author is required"),
  pinned: z.boolean().default(false),
});

export default function Announcements() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: announcements, isLoading } = useListAnnouncements({
    query: { queryKey: getListAnnouncementsQueryKey() }
  });

  const createMutation = useCreateAnnouncement();
  const updateMutation = useUpdateAnnouncement();
  const deleteMutation = useDeleteAnnouncement();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      author: "",
      pinned: false,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (editingId) {
      updateMutation.mutate(
        { id: editingId, data: values },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListAnnouncementsQueryKey() });
            setIsOpen(false);
            form.reset();
            setEditingId(null);
            toast({ title: "Announcement updated" });
          },
        }
      );
    } else {
      createMutation.mutate(
        { data: values },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListAnnouncementsQueryKey() });
            setIsOpen(false);
            form.reset();
            toast({ title: "Announcement created" });
          },
        }
      );
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingId(announcement.id);
    form.reset({
      title: announcement.title,
      content: announcement.content,
      author: announcement.author,
      pinned: announcement.pinned,
    });
    setIsOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      deleteMutation.mutate(
        { id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListAnnouncementsQueryKey() });
            toast({ title: "Announcement deleted" });
          },
        }
      );
    }
  };

  const pinned = announcements?.filter(a => a.pinned) || [];
  const unpinned = announcements?.filter(a => !a.pinned) || [];

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
            <p className="text-muted-foreground mt-2">Important news and updates for the community.</p>
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
                <Plus className="h-4 w-4" /> New Announcement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Announcement" : "Create Announcement"}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Write your announcement..." className="min-h-[150px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pinned"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Pin announcement</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            This will make the announcement stick to the top of the dashboard.
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                      {editingId ? "Save Changes" : "Create"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : (
          <div className="space-y-8">
            {pinned.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-primary">
                  <Pin className="h-5 w-5" /> Pinned
                </h2>
                <div className="grid gap-4">
                  {pinned.map((item) => (
                    <AnnouncementCard 
                      key={item.id} 
                      item={item} 
                      onEdit={() => handleEdit(item)}
                      onDelete={() => handleDelete(item.id)}
                    />
                  ))}
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              {pinned.length > 0 && unpinned.length > 0 && (
                <h2 className="text-lg font-semibold text-muted-foreground">Recent</h2>
              )}
              <div className="grid gap-4">
                {unpinned.map((item) => (
                  <AnnouncementCard 
                    key={item.id} 
                    item={item} 
                    onEdit={() => handleEdit(item)}
                    onDelete={() => handleDelete(item.id)}
                  />
                ))}
                {announcements?.length === 0 && (
                  <Card className="bg-muted/50 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                      <Megaphone className="h-12 w-12 text-muted-foreground/50 mb-4" />
                      <h3 className="text-lg font-medium text-foreground">No announcements</h3>
                      <p className="mt-1">Create an announcement to share news with the community.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

function AnnouncementCard({ item, onEdit, onDelete }: { item: Announcement, onEdit: () => void, onDelete: () => void }) {
  return (
    <Card className={`transition-all ${item.pinned ? 'border-primary/30 bg-primary/5' : 'hover:border-border/80'}`}>
      <CardHeader className="pb-2 flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-xl flex items-center gap-2">
            {item.pinned && <Pin className="h-4 w-4 text-primary" />}
            {item.title}
          </CardTitle>
          <div className="text-sm text-muted-foreground mt-1">
            Posted by <span className="font-medium text-foreground">{item.author}</span> • {format(new Date(item.createdAt), "MMM d, yyyy")}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={onEdit}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed">
          {item.content}
        </p>
      </CardContent>
    </Card>
  );
}