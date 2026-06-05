import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { FaWhatsapp } from "react-icons/fa";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col relative text-foreground">
      <Header />
      <main className="flex-1 flex flex-col w-full">{children}</main>
      <Footer />
      
      {/* Floating WhatsApp CTA for Mobile */}
      <a
        href="https://wa.me/918825042800"
        target="_blank"
        rel="noreferrer"
        className="md:hidden fixed bottom-6 right-6 h-14 w-14 bg-green-500 rounded-full flex items-center justify-center text-white shadow-[0_4px_14px_rgba(34,197,94,0.5)] z-50 hover:scale-110 transition-transform"
        aria-label="Book on WhatsApp"
      >
        <FaWhatsapp className="text-3xl" />
      </a>
    </div>
  );
}
