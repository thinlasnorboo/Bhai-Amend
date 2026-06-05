import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import carImagePath from "@assets/car_1780400879313.jpeg";
import { ArrowRight, ChevronRight, Flag, Coffee } from "lucide-react";

export default function Home() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi]);

  const slides = [
    {
      title: "Master The Drift",
      subtitle: "Ladakh's Premium Indoor Drift Track",
      image: carImagePath,
      cta: "Book Track Time",
      link: "/booking"
    },
    {
      title: "Scale & Crawl",
      subtitle: "Conquer Impossible Terrain",
      image: "https://images.unsplash.com/photo-1594815442531-15570bbccb35?q=80&w=2000&auto=format&fit=crop",
      cta: "Shop Crawlers",
      link: "/shop"
    },
    {
      title: "Fuel Your Passion",
      subtitle: "Specialty Coffee & Gourmet Snacks",
      image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2000&auto=format&fit=crop",
      cta: "View Menu",
      link: "/menu"
    }
  ];

  return (
    <Layout>
      {/* Hero Slider */}
      <section className="relative h-[80vh] w-full overflow-hidden bg-black">
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black via-black/70 to-transparent pointer-events-none" />
        
        <div className="overflow-hidden h-full" ref={emblaRef}>
          <div className="flex h-full">
            {slides.map((slide, index) => (
              <div key={index} className="flex-[0_0_100%] min-w-0 relative h-full">
                <img 
                  src={slide.image} 
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="absolute inset-0 z-20 flex items-center">
          <div className="container px-4 md:px-6">
            <div className="max-w-2xl">
              <motion.div
                key={selectedIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/50 text-primary font-bold text-sm tracking-wider uppercase mb-6">
                  <Flag className="w-4 h-4" /> Welcome to the Pit Lane
                </div>
                <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-4 leading-[1.1]">
                  {slides[selectedIndex].title}
                </h1>
                <p className="text-xl text-gray-300 mb-8 max-w-lg">
                  {slides[selectedIndex].subtitle}
                </p>
                <Link href={slides[selectedIndex].link}>
                  <Button size="lg" className="h-14 px-8 text-lg font-bold bg-primary hover:bg-primary/90 text-white border-none data-[state=on]:bg-primary">
                    {slides[selectedIndex].cta} <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`h-2 transition-all duration-300 ${
                index === selectedIndex ? "w-8 bg-primary" : "w-2 bg-white/50"
              } rounded-full`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-checkered opacity-20 pointer-events-none" />
        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white uppercase tracking-wider mb-2">
                Pro Shop
              </h2>
              <p className="text-muted-foreground">Premium gear for serious enthusiasts.</p>
            </div>
            <Link href="/shop" className="text-primary hover:text-white font-bold flex items-center transition-colors uppercase tracking-wider text-sm">
              View All Products <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Drift RC Cars", img: carImagePath },
              { title: "Crawler RC Cars", img: "https://images.unsplash.com/photo-1594815442531-15570bbccb35?q=80&w=800&auto=format&fit=crop" },
              { title: "Construction & Trucks", img: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=800&auto=format&fit=crop" }
            ].map((cat, i) => (
              <Link key={i} href="/shop" className="group block relative overflow-hidden rounded-lg aspect-[4/3] border border-white/10">
                <img src={cat.img} alt={cat.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-2xl font-display font-bold text-white uppercase tracking-wider group-hover:text-primary transition-colors">
                    {cat.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Track & Cafe Split */}
      <section className="py-24 bg-card border-y border-white/5">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-accent/10 text-accent mb-2">
                <Flag className="w-8 h-8" />
              </div>
              <h2 className="text-4xl font-display font-bold text-white uppercase tracking-wider">
                The Drift Track
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Experience Ladakh's premier indoor RC drift track. Technical corners, high-speed sweepers, and an immaculate surface designed for precision sliding. Bring your own car or rent one from our pro shop.
              </p>
              <ul className="space-y-3 mb-8">
                {["Polished concrete surface", "Technical layout changes monthly", "Live timing system", "Pit tables with power"].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-300">
                    <ChevronRight className="w-5 h-5 text-primary mr-2" /> {item}
                  </li>
                ))}
              </ul>
              <Link href="/booking">
                <Button className="bg-white text-black hover:bg-gray-200 font-bold h-12 px-8">
                  Reserve a Pit Space
                </Button>
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-6 lg:pl-12 border-t lg:border-t-0 lg:border-l border-white/10 pt-12 lg:pt-0"
            >
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary mb-2">
                <Coffee className="w-8 h-8" />
              </div>
              <h2 className="text-4xl font-display font-bold text-white uppercase tracking-wider">
                Pit Stop Cafe
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Fuel up between heats. We serve specialty coffee roasted locally in LA, alongside gourmet sandwiches, burgers, and snacks. The perfect spot to talk setups and watch the action.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-6 mb-8">
                <div className="p-4 rounded-lg bg-black/50 border border-white/5">
                  <h4 className="font-bold text-white mb-1">Espresso Bar</h4>
                  <p className="text-sm text-muted-foreground">Expertly crafted pulls</p>
                </div>
                <div className="p-4 rounded-lg bg-black/50 border border-white/5">
                  <h4 className="font-bold text-white mb-1">Hot Food</h4>
                  <p className="text-sm text-muted-foreground">Burgers & Sandwiches</p>
                </div>
              </div>
              <Link href="/menu">
                <Button variant="outline" className="border-primary/50 text-white hover:bg-primary/20 font-bold h-12 px-8">
                  View Full Menu
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Upcoming Event Teaser */}
      <section className="py-24 bg-background relative">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center border border-primary/30 rounded-2xl p-8 md:p-12 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 blur-3xl rounded-full" />
            
            <div className="relative z-10">
              <span className="inline-block py-1 px-3 rounded bg-red-500/20 text-red-500 font-bold text-sm tracking-widest uppercase mb-6 border border-red-500/30">
                Next Major Event
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white uppercase tracking-wider mb-4">
                RC Drift Championship 2026
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                The biggest underground drift competition hits LA. $5,000 prize pool.
              </p>
              <Link href="/events">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold h-14 px-10 text-lg shadow-[0_0_20px_rgba(214,40,40,0.4)]">
                  Register Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
