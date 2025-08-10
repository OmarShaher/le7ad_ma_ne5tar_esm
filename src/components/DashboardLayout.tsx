// Modified: Display logged-in user's initial in the header avatar
import * as React from "react";
import { ThemeProvider } from "@/hooks/use-theme";
import { NaviSidebar } from "@/components/NaviSidebar";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authMe, getToken } from "@/lib/api";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [userName, setUserName] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    const token = getToken();
    if (!token) return;
    (async () => {
      try {
        const me = await authMe();
        if (mounted) setUserName(me?.name ?? null);
      } catch {
        // ignore if not authenticated
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const initial = (userName?.trim()?.charAt(0) ?? "A").toUpperCase();
  return (
    <ThemeProvider defaultTheme="light" storageKey="navitech-theme">
      <div className="min-h-screen bg-background flex w-full">
        {/* Sidebar */}
        <NaviSidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Navigation */}
          <header className="bg-card border-b border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search courses, topics..." 
                    className="pl-10 w-64 bg-background"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full text-xs flex items-center justify-center text-destructive-foreground">
                    3
                  </span>
                </Button>
                <ThemeToggle />
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center" title={userName ?? undefined}>
                  <span className="text-sm font-bold text-primary-foreground">{initial}</span>
                </div>
              </div>
            </div>
          </header>
          
          {/* Page Content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}