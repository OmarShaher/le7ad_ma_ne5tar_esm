import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Target, Clock, Zap } from "lucide-react";
import { fetchDashboardSummary, type DashboardSummary } from "@/lib/api";
import { useState, useEffect } from "react";

interface WelcomeSectionProps {
  userName?: string;
  progress?: number;
}

export function WelcomeSection({ userName = "Ahmed", progress = 65 }: WelcomeSectionProps) {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchDashboardSummary();
        setSummary(data);
      } catch {
        // Keep default values if fetch fails
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "صباح الخير" : currentHour < 18 ? "مساء الخير" : "مساء الخير";

  // Use data from summary if available, otherwise use defaults
  const stats = summary?.stats || { completed: 24, inProgress: 8, studyTimeHours: 42, streak: 15 };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-tech rounded-2xl p-6 text-white shadow-elegant">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {greeting}, {userName}! 👋
            </h1>
            <p className="text-white/90 text-lg">
              Ready to continue your tech journey?
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <div className="text-sm text-white/80 mb-1">Overall Progress</div>
            <div className="text-3xl font-bold">{progress}%</div>
          </div>
        </div>
        
        <div className="mt-6">
          <Progress value={progress} className="h-3 bg-white/20" />
          <div className="flex justify-between text-sm text-white/80 mt-2">
            <span>Beginner</span>
            <span>Intermediate</span>
            <span>Advanced</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-0 shadow-elegant hover:shadow-glow transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-level-beginner/10 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-level-beginner" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-foreground">{loading ? '—' : stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-elegant hover:shadow-glow transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-level-intermediate/10 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-level-intermediate" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-foreground">{loading ? '—' : stats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-elegant hover:shadow-glow transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-tech-blue/10 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-tech-blue" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Study Time</p>
                <p className="text-2xl font-bold text-foreground">{loading ? '—' : `${stats.studyTimeHours}h`}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-elegant hover:shadow-glow transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-tech-purple/10 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-tech-purple" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Streak</p>
                <p className="text-2xl font-bold text-foreground">{loading ? '—' : stats.streak}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}