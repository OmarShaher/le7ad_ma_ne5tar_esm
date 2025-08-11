import * as React from "react";
import { ThemeProvider } from "@/hooks/use-theme";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { GraduationCap } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <ThemeProvider defaultTheme="light" storageKey="navitech-theme">
      <div className="min-h-screen bg-background flex flex-col">
        {/* Top Navigation */}
        <header className="bg-card border-b border-border p-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-foreground">NaviTech</h1>
                <p className="text-xs text-muted-foreground">Learning Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <ThemeToggle />
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            {children}
          </div>
        </main>
        
        {/* Footer */}
        <footer className="border-t border-border p-4">
          <div className="text-xs text-muted-foreground text-center max-w-7xl mx-auto">
            <p>Version 1.0 - Made for Egyptian Students</p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}
