import { Link } from "wouter";
import { FaFacebook, FaInstagram, FaYoutube, FaWhatsapp } from "react-icons/fa";
import logoPath from "@assets/logo_1780400879312.jpeg";

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 pt-16 pb-8">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-16">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <img src={logoPath} alt="LA RC HUB Logo" className="h-14 w-14 rounded-full border border-primary/30" />
              <div className="flex flex-col">
                <span className="font-display text-xl font-bold tracking-wider leading-none text-white">LA RC HUB</span>
                <span className="font-display text-xs font-semibold tracking-[0.2em] text-accent">& CAFE</span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              The premier destination for RC drift, crawler, and scale enthusiasts in Ladakh, India. Shop, race, and fuel up.
            </p>
            <div className="flex gap-4">
              <a href="#" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:text-white transition-colors">
                <FaFacebook className="text-xl" />
              </a>
              <a href="https://www.instagram.com/la_rc_cafe" target="_blank" rel="noreferrer" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:text-white transition-colors">
                <FaInstagram className="text-xl" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:text-white transition-colors">
                <FaYoutube className="text-xl" />
              </a>
              <a href="https://wa.me/918825042800" target="_blank" rel="noreferrer" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-green-600 hover:text-white transition-colors">
                <FaWhatsapp className="text-xl" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg font-bold uppercase tracking-wider text-white mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">Home</Link></li>
              <li><Link href="/shop" className="text-muted-foreground hover:text-primary transition-colors text-sm">RC Shop</Link></li>
              <li><Link href="/booking" className="text-muted-foreground hover:text-primary transition-colors text-sm">Book Track</Link></li>
              <li><Link href="/events" className="text-muted-foreground hover:text-primary transition-colors text-sm">Events</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-bold uppercase tracking-wider text-white mb-6">Cafe</h3>
            <ul className="space-y-3">
              <li><Link href="/menu" className="text-muted-foreground hover:text-primary transition-colors text-sm">View Menu</Link></li>
              <li><Link href="/gallery" className="text-muted-foreground hover:text-primary transition-colors text-sm">Gallery</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg font-bold uppercase tracking-wider text-white mb-6">Contact</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>Ladakh, India</li>
              <li>Phone: +91 88250 42800</li>
              <li>
                <a href="https://www.instagram.com/la_rc_cafe" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                  @la_rc_cafe
                </a>
              </li>
              <li className="pt-2">
                <a 
                  href="https://wa.me/918825042800" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-accent hover:text-white transition-colors"
                >
                  <FaWhatsapp className="text-lg" /> WhatsApp us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 LA RC HUB & CAFE. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
