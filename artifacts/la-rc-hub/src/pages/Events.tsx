import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Trophy } from "lucide-react";
import carImagePath from "@assets/car_1780400879313.jpeg";

export default function Events() {
  return (
    <Layout>
      <div className="bg-black py-16 border-b border-white/10 relative">
        <div className="absolute inset-0 bg-checkered opacity-10 pointer-events-none" />
        <div className="container px-4 md:px-6 relative z-10">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white uppercase tracking-wider mb-4">
            Events & Competitions
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Where the best in LA come to prove themselves. Check out our upcoming race schedule.
          </p>
        </div>
      </div>

      <div className="container px-4 md:px-6 py-12">
        {/* Featured Event */}
        <div className="mb-16 rounded-2xl overflow-hidden border border-primary/30 bg-card relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
          <img 
            src={carImagePath} 
            alt="Drift Championship" 
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="relative z-20 p-8 md:p-12 lg:w-2/3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-red-500/20 text-red-500 font-bold text-sm tracking-widest uppercase mb-6 border border-red-500/30">
              <Trophy className="w-4 h-4" /> Featured Event
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white uppercase tracking-wider mb-4 leading-tight">
              RC Drift Championship 2026
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-xl">
              The premier underground drift competition. Top drivers, technical layouts, and a $5,000 prize pool. Don't miss the biggest event of the year.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center text-gray-300 bg-black/50 px-4 py-2 rounded border border-white/10">
                <Calendar className="w-5 h-5 mr-2 text-primary" /> August 15-16, 2026
              </div>
              <div className="flex items-center text-gray-300 bg-black/50 px-4 py-2 rounded border border-white/10">
                <MapPin className="w-5 h-5 mr-2 text-primary" /> LA RC HUB Main Track
              </div>
            </div>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold h-14 px-10 text-lg shadow-[0_0_20px_rgba(214,40,40,0.4)]">
              Register to Compete
            </Button>
          </div>
        </div>

        {/* Regular Events */}
        <h3 className="text-2xl font-display font-bold text-white uppercase tracking-wider mb-8 flex items-center">
          <Calendar className="mr-3 text-accent" /> Upcoming Schedule
        </h3>

        <div className="space-y-6">
          {[
            {
              title: "Friday Night Lights: Rookie Drift",
              date: "Every Friday • 7PM - 11PM",
              desc: "Perfect for beginners. Relaxed atmosphere, music, and experienced drivers helping out new talent. Track fees discounted.",
              tag: "Weekly"
            },
            {
              title: "Scale Crawler Challenge",
              date: "Saturday, Sep 5 • 10AM - 4PM",
              desc: "Navigate our custom built indoor scale terrain. Classes for 1/10 and 1/24 scale crawlers. Bring your most detailed rig.",
              tag: "Competition"
            },
            {
              title: "Heavy Equipment Sandbox Day",
              date: "Sunday, Sep 13 • 12PM - 5PM",
              desc: "Dedicated time for RC excavators, dump trucks, and loaders in our custom dirt pit. Move earth and coordinate with other operators.",
              tag: "Meetup"
            }
          ].map((event, i) => (
            <div key={i} className="bg-card border border-white/10 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center hover:border-white/30 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-accent border border-accent/30 bg-accent/10 px-2 py-1 rounded">
                    {event.tag}
                  </span>
                  <span className="text-primary font-mono text-sm">{event.date}</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">{event.title}</h4>
                <p className="text-gray-400">{event.desc}</p>
              </div>
              <Button variant="outline" className="border-white/20 hover:bg-white/10 w-full md:w-auto font-bold">
                More Info
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
