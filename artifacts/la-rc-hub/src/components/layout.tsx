import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Megaphone, MessageSquare, Calendar, Users } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { title: "Dashboard", href: "/", icon: LayoutDashboard },
    { title: "Announcements", href: "/announcements", icon: Megaphone },
    { title: "Channels", href: "/channels", icon: MessageSquare },
    { title: "Events", href: "/events", icon: Calendar },
    { title: "Members", href: "/members", icon: Users },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-[100dvh] w-full bg-background font-sans text-foreground selection:bg-primary/20 selection:text-primary">
        <Sidebar className="border-r border-border bg-sidebar/50 backdrop-blur-xl">
          <SidebarHeader className="p-4 flex items-center justify-between border-b border-border">
            <Link href="/" className="flex items-center gap-2 px-2 hover:opacity-80 transition-opacity">
              <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-bold shadow-sm">
                RC
              </div>
              <span className="font-bold tracking-tight text-sidebar-foreground">LA RC Hub</span>
            </Link>
          </SidebarHeader>
          <SidebarContent className="p-4 gap-2">
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        "rounded-md px-3 py-2 text-sm font-medium transition-colors w-full flex items-center gap-3",
                        isActive
                          ? "bg-primary/10 text-primary hover:bg-primary/15"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <Link href={item.href}>
                        <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-border text-xs text-muted-foreground text-center">
            LA RC Hub &copy; {new Date().getFullYear()}
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b border-border flex items-center px-4 md:px-8 bg-background/95 backdrop-blur z-10 sticky top-0 md:hidden">
            <SidebarTrigger className="mr-2" />
            <div className="font-semibold">LA RC Hub</div>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-8">
            <div className="max-w-6xl mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
