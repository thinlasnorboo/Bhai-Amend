import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function Contact() {
  return (
    <Layout>
      <div className="bg-black py-16 border-b border-white/10 relative">
        <div className="absolute inset-0 bg-checkered opacity-10 pointer-events-none" />
        <div className="container px-4 md:px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white uppercase tracking-wider mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Questions about parts? Need to book an event? Get in touch.
          </p>
        </div>
      </div>

      <div className="container px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Info & Map */}
          <div className="space-y-8">
            <div className="bg-card border border-white/10 rounded-2xl p-8 space-y-6">
              <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider mb-6">Info</h2>
              
              <div className="flex items-start gap-4 text-gray-300">
                <MapPin className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-white mb-1">Location</p>
                  <p>Ladakh, Jammu & Kashmir<br/>India — 194101</p>
                </div>
              </div>

              <div className="flex items-start gap-4 text-gray-300">
                <Phone className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-white mb-1">Phone / WhatsApp</p>
                  <p className="mb-2">+91 88250 42800</p>
                  <a 
                    href="https://wa.me/918825042800"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm bg-green-500/20 text-green-500 hover:bg-green-500/30 px-3 py-1 rounded-full transition-colors"
                  >
                    <FaWhatsapp className="text-lg" /> Chat on WhatsApp
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 text-gray-300">
                <Mail className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-white mb-1">Email</p>
                  <p>info@larchub.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4 text-gray-300">
                <Clock className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-white mb-1">Hours</p>
                  <table className="w-full text-sm">
                    <tbody>
                      <tr><td className="py-1 w-24">Mon - Thu</td><td>10:00 AM - 8:00 PM</td></tr>
                      <tr><td className="py-1">Friday</td><td>10:00 AM - 11:00 PM</td></tr>
                      <tr><td className="py-1">Weekend</td><td>9:00 AM - 10:00 PM</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-white/10 h-[300px] bg-card">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d210946.35566563265!2d77.41663!3d34.16487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38fdec4e63f76a91%3A0x96d21c3d2e8a280e!2sLadakh!5m2!1s0!2e0" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps Location"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider mb-6">Send a Message</h2>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Name</label>
                  <Input placeholder="Your Name" className="bg-black/50 border-white/10" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Email</label>
                  <Input type="email" placeholder="your@email.com" className="bg-black/50 border-white/10" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Subject</label>
                <Input placeholder="How can we help?" className="bg-black/50 border-white/10" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Message</label>
                <Textarea placeholder="Write your message here..." className="bg-black/50 border-white/10 min-h-[150px]" />
              </div>
              <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold text-lg">
                Send Message
              </Button>
            </form>
          </div>

        </div>
      </div>
    </Layout>
  );
}
