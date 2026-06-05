import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ShoppingCart, LogIn, LogOut, User, Settings } from "lucide-react";
import logoPath from "@assets/logo_1780400879312.jpeg";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@workspace/replit-auth-web";

export function Header() {
  const [location] = useLocation();
  const { itemCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isLoading, isAuthenticated, login, logout } = useAuth();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Track Booking", href: "/booking" },
    { name: "Events", href: "/events" },
    { name: "Cafe Menu", href: "/menu" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <img src={logoPath} alt="LA RC HUB & CAFE Logo" className="h-12 w-12 rounded-full border border-primary/50" />
          <div className="hidden sm:flex flex-col">
            <span className="font-display text-xl font-bold tracking-wider leading-none text-white">LA RC HUB</span>
            <span className="font-display text-xs font-semibold tracking-[0.2em] text-accent">& CAFE 2026</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium uppercase tracking-wider transition-colors hover:text-primary ${
                location === link.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Admin */}
          {isAuthenticated && (
            <Link href="/admin" className="relative group p-2" data-testid="link-admin">
              <Settings className="h-6 w-6 text-white group-hover:text-primary transition-colors" />
            </Link>
          )}

          {/* Cart */}
          <Link href="/shop" className="relative group p-2" data-testid="link-cart">
            <ShoppingCart className="h-6 w-6 text-white group-hover:text-primary transition-colors" />
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Auth Button — desktop */}
          {!isLoading && (
            <div className="hidden md:flex items-center gap-2">
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
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
                  <span className="text-sm text-gray-300 max-w-[100px] truncate">
                    {user?.firstName ?? user?.email ?? "User"}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    data-testid="button-logout"
                    className="text-muted-foreground hover:text-white gap-1 px-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  onClick={login}
                  data-testid="button-login"
                  className="bg-primary hover:bg-primary/90 text-white gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  Log in
                </Button>
              )}
            </div>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-background border-l-border/10">
                <div className="flex flex-col gap-6 pt-10">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`text-lg font-display font-bold uppercase tracking-wider ${
                        location === link.href ? "text-primary" : "text-white"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}

                  {/* Auth in mobile menu */}
                  <div className="pt-4 border-t border-white/10">
                    {!isLoading && (
                      isAuthenticated ? (
                        <div className="space-y-3">
                          <p className="text-sm text-gray-400">
                            Signed in as <span className="text-white">{user?.firstName ?? user?.email ?? "User"}</span>
                          </p>
                          <Button
                            variant="outline"
                            className="w-full gap-2"
                            onClick={() => { setIsMobileMenuOpen(false); logout(); }}
                            data-testid="button-logout-mobile"
                          >
                            <LogOut className="h-4 w-4" /> Log out
                          </Button>
                        </div>
                      ) : (
                        <Button
                          className="w-full bg-primary hover:bg-primary/90 text-white gap-2"
                          onClick={() => { setIsMobileMenuOpen(false); login(); }}
                          data-testid="button-login-mobile"
                        >
                          <LogIn className="h-4 w-4" /> Log in
                        </Button>
                      )
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Decorative racing stripe */}
      <div className="h-1 w-full bg-gradient-to-r from-primary via-accent to-primary opacity-80" />
    </header>
  );
}
