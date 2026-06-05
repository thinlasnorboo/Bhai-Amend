import { useState, useRef, useEffect } from "react";
import { Layout } from "@/components/layout";
import { 
  useListMessages, getListMessagesQueryKey,
  useCreateMessage, useListChannels, getListChannelsQueryKey, useDeleteMessage
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Hash, Send, ArrowLeft, Trash2, User } from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  content: z.string().min(1, ""),
  author: z.string().min(1, "Name required"),
});

export default function Channel() {
  const { id } = useParams();
  const channelId = Number(id);
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: channels } = useListChannels({
    query: { queryKey: getListChannelsQueryKey() }
  });
  
  const channel = channels?.find(c => c.id === channelId);

  const { data: messages, isLoading } = useListMessages(channelId, {
    query: { 
      queryKey: getListMessagesQueryKey(channelId),
      enabled: !!channelId,
      refetchInterval: 5000 // Poll every 5s for new messages
    }
  });

  const createMutation = useCreateMessage();
  const deleteMutation = useDeleteMessage();

  // Load saved author name from local storage or use default
  const savedAuthor = typeof window !== 'undefined' ? localStorage.getItem('hub-username') || '' : '';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      author: savedAuthor,
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!channelId) return;
    
    // Save author name for future messages
    localStorage.setItem('hub-username', values.author);

    createMutation.mutate(
      { channelId, data: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListMessagesQueryKey(channelId) });
          queryClient.invalidateQueries({ queryKey: getListChannelsQueryKey() });
          form.reset({ content: "", author: values.author });
          setTimeout(scrollToBottom, 100);
        },
      }
    );
  };
  
  const handleDelete = (msgId: number) => {
    if (confirm("Delete this message?")) {
      deleteMutation.mutate(
        { channelId, id: msgId },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListMessagesQueryKey(channelId) });
            queryClient.invalidateQueries({ queryKey: getListChannelsQueryKey() });
          }
        }
      );
    }
  };

  if (!channel && !isLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <h2 className="text-2xl font-bold mb-4">Channel not found</h2>
          <Link href="/channels" className="text-primary hover:underline">
            Back to channels
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-8rem)] animate-in fade-in duration-300">
        <div className="flex items-center gap-3 pb-4 border-b border-border shrink-0">
          <Link href="/channels">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight flex items-center gap-1.5">
              <Hash className="h-5 w-5 text-primary" />
              {channel?.name || "Loading..."}
            </h1>
            {channel?.description && (
              <p className="text-xs text-muted-foreground mt-0.5">{channel.description}</p>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-6 flex flex-col pr-4 min-h-0">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-16 w-full max-w-md" />
                  </div>
                </div>
              ))}
            </div>
          ) : messages?.length === 0 ? (
            <div className="m-auto text-center text-muted-foreground flex flex-col items-center justify-center max-w-sm">
              <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Hash className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <p className="text-lg font-medium text-foreground mb-1">Welcome to #{channel?.name}</p>
              <p className="text-sm">This is the start of the channel. Send a message to get the conversation started.</p>
            </div>
          ) : (
            messages?.map((msg, idx) => {
              const prevMsg = idx > 0 ? messages[idx - 1] : null;
              const isSameAuthorSequence = prevMsg && 
                prevMsg.author === msg.author && 
                new Date(msg.createdAt).getTime() - new Date(prevMsg.createdAt).getTime() < 5 * 60 * 1000;

              return (
                <div key={msg.id} className={`flex gap-3 group ${isSameAuthorSequence ? 'mt-1' : 'mt-6'}`}>
                  {!isSameAuthorSequence ? (
                    <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold shadow-sm">
                      {msg.author.substring(0, 2).toUpperCase()}
                    </div>
                  ) : (
                    <div className="w-10 shrink-0 flex justify-center text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity pt-1">
                      {format(new Date(msg.createdAt), "h:mm")}
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    {!isSameAuthorSequence && (
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-semibold">{msg.author}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(msg.createdAt), "MMM d, h:mm a")}
                        </span>
                      </div>
                    )}
                    <div className="flex items-start gap-2 justify-between">
                      <p className="text-foreground/90 whitespace-pre-wrap break-words">{msg.content}</p>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive shrink-0 -mt-1 transition-opacity"
                        onClick={() => handleDelete(msg.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="pt-4 border-t border-border shrink-0 bg-background">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem className="w-40 shrink-0">
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Your name" className="pl-8" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative">
                          <Textarea 
                            placeholder={`Message #${channel?.name || 'channel'}`} 
                            className="resize-none min-h-[44px] h-[44px] py-3 pr-12"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                form.handleSubmit(onSubmit)();
                              }
                            }}
                            {...field} 
                          />
                          <Button 
                            type="submit" 
                            size="icon" 
                            className="absolute right-1.5 top-1.5 h-8 w-8 bg-primary text-primary-foreground hover:bg-primary/90"
                            disabled={createMutation.isPending || !form.watch('content').trim()}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Layout>
  );
}