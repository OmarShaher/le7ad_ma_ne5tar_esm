import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Map, 
  Code, 
  Bot, 
  Briefcase, 
  Settings,
  ChevronLeft,
  ChevronRight,
  GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Roadmap", url: "/roadmap", icon: Map },
  { title: "Coding Practice", url: "/practice", icon: Code },
  { title: "AI Tutor", url: "/tutor", icon: Bot },
  { title: "Interview Prep", url: "/interview", icon: Briefcase },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function NaviSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <div 
      className={cn(
        "bg-card border-r border-border h-screen flex flex-col transition-all duration-300 ease-smooth",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-foreground">NaviTech</h1>
                <p className="text-xs text-muted-foreground">Learning Platform</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.title}>
              <NavLink
                to={item.url}
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-3 p-3 rounded-lg transition-all duration-200",
                    "hover:bg-muted/50",
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20 shadow-glow"
                      : "text-muted-foreground hover:text-foreground"
                  )
                }
              >
                <item.icon className={cn("w-5 h-5", collapsed ? "mx-auto" : "")} />
                {!collapsed && (
                  <span className="font-medium text-sm">{item.title}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground text-center">
            <p>Version 1.0</p>
            <p className="text-primary">Made for Egyptian Students</p>
          </div>
        </div>
      )}
    </div>
  );
}