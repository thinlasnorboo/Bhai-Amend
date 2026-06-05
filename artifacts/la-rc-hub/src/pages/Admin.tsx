import { useState } from "react";
import { useAuth } from "@workspace/replit-auth-web";
import { useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Trash2, Plus, LogIn, Loader2, Edit, User } from "lucide-react";

import {
  useListProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  getListProductsQueryKey,
  useListBookings,
  useUpdateBookingStatus,
  useDeleteBooking,
  getListBookingsQueryKey,
  useListEvents,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
  getListEventsQueryKey,
} from "@workspace/api-client-react";

import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";

// --- Products Tab ---

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().min(0, "Price must be >= 0"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  inStock: z.boolean().default(true),
});

type ProductFormValues = z.infer<typeof productSchema>;

function ProductsTab() {
  const { data: products = [], isLoading } = useListProducts();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category: "",
      price: 0,
      description: "",
      imageUrl: "",
      inStock: true,
    },
  });

  const onSubmit = async (values: ProductFormValues) => {
    try {
      if (editingId) {
        await updateProduct.mutateAsync({
          id: editingId,
          data: values,
        });
        toast({ title: "Product updated successfully" });
      } else {
        await createProduct.mutateAsync({
          data: values,
        });
        toast({ title: "Product created successfully" });
      }
      queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
      setIsDialogOpen(false);
      form.reset();
      setEditingId(null);
    } catch (error) {
      toast({ title: "Error saving product", variant: "destructive" });
    }
  };

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    form.reset({
      name: product.name,
      category: product.category,
      price: Number(product.price),
      description: product.description || "",
      imageUrl: product.imageUrl || "",
      inStock: product.inStock,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getListProductsQueryKey() });
      toast({ title: "Product deleted" });
    } catch (error) {
      toast({ title: "Error deleting product", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold font-display tracking-wider text-white">Products</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            form.reset();
            setEditingId(null);
          }
        }}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-product" className="bg-green-600 hover:bg-green-700 text-white gap-2">
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-zinc-950 text-white border-zinc-800">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Product" : "Add Product"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...form.register("name")} className="bg-zinc-900 border-zinc-700" />
                {form.formState.errors.name && <p className="text-red-500 text-xs">{form.formState.errors.name.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Controller
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-zinc-900 border-zinc-700">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-950 border-zinc-800 text-white">
                        <SelectItem value="Drift RC Cars">Drift RC Cars</SelectItem>
                        <SelectItem value="Crawler RC Cars">Crawler RC Cars</SelectItem>
                        <SelectItem value="Huina Construction Vehicles">Huina Construction Vehicles</SelectItem>
                        <SelectItem value="Volvo RC Trucks">Volvo RC Trucks</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.category && <p className="text-red-500 text-xs">{form.formState.errors.category.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input id="price" type="number" step="0.01" {...form.register("price")} className="bg-zinc-900 border-zinc-700" />
                {form.formState.errors.price && <p className="text-red-500 text-xs">{form.formState.errors.price.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...form.register("description")} className="bg-zinc-900 border-zinc-700" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input id="imageUrl" {...form.register("imageUrl")} className="bg-zinc-900 border-zinc-700" />
              </div>

              <div className="flex items-center space-x-2">
                <Controller
                  control={form.control}
                  name="inStock"
                  render={({ field }) => (
                    <Switch
                      id="inStock"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="inStock">In Stock</Label>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={createProduct.isPending || updateProduct.isPending} className="bg-primary hover:bg-primary/90 text-white">
                  {(createProduct.isPending || updateProduct.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Product
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="rounded-md border border-zinc-800 bg-zinc-900/50 overflow-hidden">
          <Table>
            <TableHeader className="bg-zinc-900">
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-zinc-400">Name</TableHead>
                <TableHead className="text-zinc-400">Category</TableHead>
                <TableHead className="text-zinc-400">Price</TableHead>
                <TableHead className="text-zinc-400">Stock</TableHead>
                <TableHead className="text-zinc-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-zinc-500 py-8">No products found.</TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id} className="border-zinc-800 hover:bg-zinc-800/50">
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>₹{Number(product.price).toFixed(2)}</TableCell>
                    <TableCell>
                      {product.inStock ? (
                        <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">Yes</Badge>
                      ) : (
                        <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">No</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(product)} className="text-zinc-400 hover:text-white" data-testid={`edit-product-${product.id}`}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300 hover:bg-red-400/10" data-testid={`delete-product-${product.id}`}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-zinc-950 border-zinc-800 text-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription className="text-zinc-400">
                              This will permanently delete "{product.name}". This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800">Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(product.id)}
                              className="bg-red-600 text-white hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// --- Bookings Tab ---

function BookingsTab() {
  const { data: bookings = [], isLoading } = useListBookings();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const updateBookingStatus = useUpdateBookingStatus();
  const deleteBooking = useDeleteBooking();

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateBookingStatus.mutateAsync({
        id,
        data: { status: status as 'pending' | 'confirmed' | 'cancelled' },
      });
      queryClient.invalidateQueries({ queryKey: getListBookingsQueryKey() });
      toast({ title: "Booking status updated" });
    } catch (error) {
      toast({ title: "Error updating booking", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteBooking.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getListBookingsQueryKey() });
      toast({ title: "Booking deleted" });
    } catch (error) {
      toast({ title: "Error deleting booking", variant: "destructive" });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">Confirmed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">Cancelled</Badge>;
      default:
        return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold font-display tracking-wider text-white">Bookings</h2>
      
      {isLoading ? (
        <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="rounded-md border border-zinc-800 bg-zinc-900/50 overflow-hidden">
          <Table>
            <TableHeader className="bg-zinc-900">
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-zinc-400">Name</TableHead>
                <TableHead className="text-zinc-400">Mobile</TableHead>
                <TableHead className="text-zinc-400">Date</TableHead>
                <TableHead className="text-zinc-400">Time Slot</TableHead>
                <TableHead className="text-zinc-400">Status</TableHead>
                <TableHead className="text-zinc-400">Received</TableHead>
                <TableHead className="text-zinc-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-zinc-500 py-8">No bookings found.</TableCell>
                </TableRow>
              ) : (
                bookings.map((booking) => (
                  <TableRow key={booking.id} className="border-zinc-800 hover:bg-zinc-800/50">
                    <TableCell className="font-medium">{booking.name}</TableCell>
                    <TableCell>{booking.mobile}</TableCell>
                    <TableCell>{booking.date}</TableCell>
                    <TableCell>{booking.timeSlot}</TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell className="text-zinc-400 text-sm">
                      {booking.createdAt ? format(new Date(booking.createdAt), "MMM d, HH:mm") : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center space-x-2">
                        <Select 
                          defaultValue={booking.status} 
                          onValueChange={(val) => handleStatusChange(booking.id, val)}
                        >
                          <SelectTrigger className="w-[130px] h-8 text-xs bg-zinc-900 border-zinc-700">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-950 border-zinc-800 text-white">
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300 hover:bg-red-400/10" data-testid={`delete-booking-${booking.id}`}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-zinc-950 border-zinc-800 text-white">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete booking?</AlertDialogTitle>
                              <AlertDialogDescription className="text-zinc-400">
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800">Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(booking.id)}
                                className="bg-red-600 text-white hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// --- Events Tab ---

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.string().min(1, "Date is required"),
  location: z.string().optional(),
  description: z.string().optional(),
  registrationOpen: z.boolean().default(true),
});

type EventFormValues = z.infer<typeof eventSchema>;

function EventsTab() {
  const { data: events = [], isLoading } = useListEvents();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      date: "",
      location: "",
      description: "",
      registrationOpen: true,
    },
  });

  const onSubmit = async (values: EventFormValues) => {
    try {
      if (editingId) {
        await updateEvent.mutateAsync({
          id: editingId,
          data: values,
        });
        toast({ title: "Event updated successfully" });
      } else {
        await createEvent.mutateAsync({
          data: values,
        });
        toast({ title: "Event created successfully" });
      }
      queryClient.invalidateQueries({ queryKey: getListEventsQueryKey() });
      setIsDialogOpen(false);
      form.reset();
      setEditingId(null);
    } catch (error) {
      toast({ title: "Error saving event", variant: "destructive" });
    }
  };

  const handleEdit = (event: any) => {
    setEditingId(event.id);
    form.reset({
      title: event.title,
      date: event.date,
      location: event.location || "",
      description: event.description || "",
      registrationOpen: event.registrationOpen,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteEvent.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getListEventsQueryKey() });
      toast({ title: "Event deleted" });
    } catch (error) {
      toast({ title: "Error deleting event", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold font-display tracking-wider text-white">Events</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            form.reset();
            setEditingId(null);
          }
        }}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-event" className="bg-green-600 hover:bg-green-700 text-white gap-2">
              <Plus className="h-4 w-4" /> Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-zinc-950 text-white border-zinc-800">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Event" : "Add Event"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...form.register("title")} className="bg-zinc-900 border-zinc-700" />
                {form.formState.errors.title && <p className="text-red-500 text-xs">{form.formState.errors.title.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" placeholder="e.g. July 15, 2026" {...form.register("date")} className="bg-zinc-900 border-zinc-700" />
                {form.formState.errors.date && <p className="text-red-500 text-xs">{form.formState.errors.date.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...form.register("location")} className="bg-zinc-900 border-zinc-700" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...form.register("description")} className="bg-zinc-900 border-zinc-700" />
              </div>

              <div className="flex items-center space-x-2">
                <Controller
                  control={form.control}
                  name="registrationOpen"
                  render={({ field }) => (
                    <Switch
                      id="registrationOpen"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="registrationOpen">Registration Open</Label>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={createEvent.isPending || updateEvent.isPending} className="bg-primary hover:bg-primary/90 text-white">
                  {(createEvent.isPending || updateEvent.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Event
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="rounded-md border border-zinc-800 bg-zinc-900/50 overflow-hidden">
          <Table>
            <TableHeader className="bg-zinc-900">
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-zinc-400">Title</TableHead>
                <TableHead className="text-zinc-400">Date</TableHead>
                <TableHead className="text-zinc-400">Location</TableHead>
                <TableHead className="text-zinc-400">Registration</TableHead>
                <TableHead className="text-zinc-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-zinc-500 py-8">No events found.</TableCell>
                </TableRow>
              ) : (
                events.map((event) => (
                  <TableRow key={event.id} className="border-zinc-800 hover:bg-zinc-800/50">
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>{event.date}</TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell>
                      {event.registrationOpen ? (
                        <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">Open</Badge>
                      ) : (
                        <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">Closed</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(event)} className="text-zinc-400 hover:text-white" data-testid={`edit-event-${event.id}`}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300 hover:bg-red-400/10" data-testid={`delete-event-${event.id}`}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-zinc-950 border-zinc-800 text-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription className="text-zinc-400">
                              This will permanently delete "{event.title}". This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800">Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(event.id)}
                              className="bg-red-600 text-white hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// --- Main Page Component ---

export default function AdminPage() {
  const { user, isLoading, isAuthenticated, login } = useAuth();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="flex-1 flex items-center justify-center min-h-[60vh] p-4">
          <Card className="max-w-md w-full bg-zinc-900 border-zinc-800 text-white shadow-xl shadow-black/50">
            <CardContent className="flex flex-col items-center justify-center p-8 space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                <User className="h-8 w-8 text-zinc-400" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold font-display tracking-wider">Access Denied</h2>
                <p className="text-zinc-400 text-sm">
                  Admin access required. Please log in to continue.
                </p>
              </div>
              <Button onClick={login} className="w-full bg-primary hover:bg-primary/90 text-white gap-2 h-11 text-base">
                <LogIn className="h-5 w-5" />
                Log In
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col flex-1 min-h-[calc(100vh-5rem)] bg-black">
        {/* Header Bar */}
        <div className="bg-zinc-950 border-b border-zinc-800 py-6 px-4 md:px-8">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-3xl font-display font-bold tracking-widest uppercase text-white">
              Admin <span className="text-primary">Panel</span>
            </h1>
            <div className="flex items-center gap-3 bg-zinc-900/50 py-2 px-4 rounded-full border border-zinc-800">
              {user?.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt="Profile"
                  className="h-8 w-8 rounded-full border border-primary/50 object-cover"
                />
              ) : (
                <div className="h-8 w-8 rounded-full border border-primary/50 bg-primary/20 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
              )}
              <span className="text-sm font-medium text-white max-w-[120px] truncate">
                {user?.firstName ?? user?.email ?? "Admin"}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto py-8 px-4 md:px-8">
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="bg-zinc-900 border border-zinc-800 p-1 mb-8">
              <TabsTrigger 
                value="products" 
                className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400 px-6 font-medium tracking-wide"
              >
                Products
              </TabsTrigger>
              <TabsTrigger 
                value="bookings" 
                className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400 px-6 font-medium tracking-wide"
              >
                Bookings
              </TabsTrigger>
              <TabsTrigger 
                value="events" 
                className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-zinc-400 px-6 font-medium tracking-wide"
              >
                Events
              </TabsTrigger>
            </TabsList>
            
            <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-6">
              <TabsContent value="products" className="m-0 focus-visible:outline-none">
                <ProductsTab />
              </TabsContent>
              <TabsContent value="bookings" className="m-0 focus-visible:outline-none">
                <BookingsTab />
              </TabsContent>
              <TabsContent value="events" className="m-0 focus-visible:outline-none">
                <EventsTab />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
