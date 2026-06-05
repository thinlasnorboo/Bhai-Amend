import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2 } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const bookingSchema = z.object({
  name: z.string().min(2, "Name is required"),
  mobile: z.string().min(10, "Valid mobile number required"),
  address: z.string().min(5, "Address is required"),
  date: z.string().min(1, "Date is required"),
  timeSlot: z.string().min(1, "Time slot is required"),
});

const WHATSAPP_NUMBER = "918825042800";

export default function Booking() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingValues, setBookingValues] = useState<z.infer<typeof bookingSchema> | null>(null);

  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      mobile: "",
      address: "",
      date: "",
      timeSlot: "",
    },
  });

  function onSubmit(values: z.infer<typeof bookingSchema>) {
    setBookingValues(values);
    setIsSubmitted(true);

    const message =
      `*New Track Booking Request*\n\n` +
      `*Name:* ${values.name}\n` +
      `*Mobile:* ${values.mobile}\n` +
      `*Address:* ${values.address}\n` +
      `*Date:* ${values.date}\n` +
      `*Time Slot:* ${values.timeSlot}\n\n` +
      `Please confirm my booking. Thank you!`;

    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  }

  return (
    <Layout>
      <div className="bg-black py-16 border-b border-white/10 relative">
        <div className="absolute inset-0 bg-checkered opacity-10 pointer-events-none" />
        <div className="container px-4 md:px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white uppercase tracking-wider mb-4">
            Book Track Time
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Fill in your details below and your booking will be sent directly to us on WhatsApp.
          </p>
        </div>
      </div>

      <div className="container px-4 md:px-6 py-12 max-w-3xl mx-auto">
        <div className="bg-card border border-white/10 rounded-2xl p-6 md:p-10 shadow-xl">
          {isSubmitted ? (
            <div className="text-center py-12 space-y-6">
              <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-display font-bold text-white uppercase">Booking Sent!</h2>
              <p className="text-gray-400 text-lg max-w-md mx-auto">
                Your booking details have been sent to our WhatsApp. We will confirm your slot shortly.
              </p>

              {bookingValues && (
                <div className="bg-black/50 border border-white/10 rounded-xl p-6 mt-4 max-w-sm mx-auto text-left space-y-2 text-sm">
                  <p className="text-accent font-bold uppercase tracking-wider mb-3">Booking Summary</p>
                  <p className="text-gray-300"><span className="text-white font-semibold">Name:</span> {bookingValues.name}</p>
                  <p className="text-gray-300"><span className="text-white font-semibold">Mobile:</span> {bookingValues.mobile}</p>
                  <p className="text-gray-300"><span className="text-white font-semibold">Date:</span> {bookingValues.date}</p>
                  <p className="text-gray-300"><span className="text-white font-semibold">Time:</span> {bookingValues.timeSlot}</p>
                </div>
              )}

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl transition-colors mt-4"
                data-testid="button-whatsapp-contact"
              >
                <FaWhatsapp className="text-xl" /> Open WhatsApp
              </a>

              <div className="pt-4">
                <Button
                  variant="outline"
                  onClick={() => { setIsSubmitted(false); form.reset(); }}
                  data-testid="button-book-another"
                >
                  Book Another Slot
                </Button>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Full Name</FormLabel>
                        <FormControl>
                          <Input data-testid="input-name" placeholder="Your Name" className="bg-black/50 border-white/10 text-white" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Mobile Number</FormLabel>
                        <FormControl>
                          <Input data-testid="input-mobile" placeholder="+91 98765 43210" type="tel" className="bg-black/50 border-white/10 text-white" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Address</FormLabel>
                      <FormControl>
                        <Input data-testid="input-address" placeholder="Your address, Ladakh" className="bg-black/50 border-white/10 text-white" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Date</FormLabel>
                        <FormControl>
                          <Input data-testid="input-date" type="date" className="bg-black/50 border-white/10 text-white [color-scheme:dark]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="timeSlot"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Time Slot</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-timeslot" className="bg-black/50 border-white/10 text-white">
                              <SelectValue placeholder="Select a time slot" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-card border-white/10">
                            <SelectItem value="9AM-11AM">9:00 AM – 11:00 AM</SelectItem>
                            <SelectItem value="11AM-1PM">11:00 AM – 1:00 PM</SelectItem>
                            <SelectItem value="1PM-3PM">1:00 PM – 3:00 PM</SelectItem>
                            <SelectItem value="3PM-5PM">3:00 PM – 5:00 PM</SelectItem>
                            <SelectItem value="5PM-7PM">5:00 PM – 7:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-6">
                  <Button
                    type="submit"
                    data-testid="button-book-submit"
                    className="w-full h-14 text-lg font-bold bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-3"
                  >
                    <FaWhatsapp className="text-2xl" /> Book via WhatsApp
                  </Button>
                  <p className="text-center text-sm text-gray-500 mt-3">
                    Tapping this will open WhatsApp with your booking details pre-filled.
                  </p>
                </div>
              </form>
            </Form>
          )}
        </div>
      </div>
    </Layout>
  );
}
