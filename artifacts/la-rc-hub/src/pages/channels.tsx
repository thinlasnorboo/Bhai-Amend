import { useState } from "react";
import { Layout } from "@/components/layout";
import { 
  useListChannels, getListChannelsQueryKey,
  useCreateChannel, useDeleteChannel 
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { Hash, MessageSquare, Trash2, Plus, ChevronRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

const formSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  description: z.string().optional(),
});

export default function Channels() {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: channels, isLoading } = useListChannels({
    query: { queryKey: getListChannelsQueryKey() }
  });

  const createMutation = useCreateChannel();
  const deleteMutation = useDeleteChannel();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createMutation.mutate(
      { data: { name: values.name, description: values.description || "" } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListChannelsQueryKey() });
          setIsOpen(false);
          form.reset();
          toast({ title: "Channel created" });
        },
      }
    );
  };

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.preventDefault(); // Prevent navigating to channel
    e.stopPropagation();
    
    if (confirm("Are you sure you want to delete this channel? All messages will be lost.")) {
      deleteMutation.mutate(
        { id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListChannelsQueryKey() });
            toast({ title: "Channel deleted" });
          },
        }
      );
    }
  };

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Channels</h1>
            <p className="text-muted-foreground mt-2">Topic-based chat rooms for the community.</p>
          </div>
          
          <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) form.reset();
          }}>
            <DialogTrigger asChild>
              <Button className="shrink-0 gap-2">
                <Plus className="h-4 w-4" /> New Channel
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Channel</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Channel Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Hash className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="general-chat" className="pl-9" {...field} />
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
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="What's this channel about?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit" disabled={createMutation.isPending}>
                      Create Channel
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full" />)}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {channels?.map((channel) => (
              <Link key={channel.id} href={`/channels/${channel.id}`}>
                <Card className="hover:border-primary/50 transition-all hover:shadow-md cursor-pointer h-full flex flex-col group hover-elevate">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl flex items-center gap-1.5 text-primary group-hover:text-primary transition-colors">
                        <Hash className="h-5 w-5" />
                        {channel.name}
                      </CardTitle>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-destructive -mt-1 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity" 
                        onClick={(e) => handleDelete(e, channel.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {channel.description && (
                      <CardDescription className="line-clamp-2 mt-1">
                        {channel.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="mt-auto pt-4 flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5 bg-muted px-2 py-1 rounded-md">
                      <MessageSquare className="h-3.5 w-3.5" />
                      {channel.messageCount || 0} msgs
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </CardContent>
                </Card>
              </Link>
            ))}
            {channels?.length === 0 && (
              <div className="col-span-full">
                <Card className="bg-muted/50 border-dashed">
                  <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                    <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium text-foreground">No channels</h3>
                    <p className="mt-1">Create a channel to start chatting.</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}