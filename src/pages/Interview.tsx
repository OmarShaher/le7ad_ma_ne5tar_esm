import * as React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Briefcase, Calendar, Target } from "lucide-react";
import { fetchDashboardSummary } from "@/lib/api";

const Interview = () => {
  const [summary, setSummary] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const s = await fetchDashboardSummary();
        setSummary(s);
      } catch {
        // keep defaults
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const mockCount = summary?.mockInterviewsCount ?? 0;
  const successPercent = Math.round((summary?.successRate ?? 0) * 100);
  const solved = summary?.problemsSolvedCount ?? 0;
  const techTotal = summary?.cards?.technicalQuestions?.total ?? 0;
  const techCompleted = summary?.cards?.technicalQuestions?.completed ?? 0;
  const techProgress = summary?.cards?.technicalQuestions?.progressPercent ?? 0;
  const mockCompleted = summary?.cards?.mockInterviews?.completed ?? 0;
  const mockAvg = summary?.cards?.mockInterviews?.avgScore ?? 0;
  const company = summary?.cards?.companyPrep?.activeCompany || "FAANG Focus";
  const companyProgress = summary?.cards?.companyPrep?.progressPercent ?? 0;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Interview Preparation</h1>
          <p className="text-muted-foreground">Get ready for technical interviews at top tech companies</p>
        </div>

        <Card className="bg-gradient-primary text-primary-foreground border-0 shadow-glow">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold">{loading ? '—' : mockCount}</div>
                <div className="text-primary-foreground/80">Mock Interviews</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{loading ? '—' : `${successPercent}%`}</div>
                <div className="text-primary-foreground/80">Success Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{loading ? '—' : solved}</div>
                <div className="text-primary-foreground/80">Problems Solved</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-gradient-card border-0 shadow-elegant">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-level-beginner" />
                <CardTitle>Technical Questions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Practice common technical interview questions</p>
              <Badge className="mb-4">{loading ? '—' : `${techTotal}+ Questions`}</Badge>
              <Progress value={loading ? 0 : techProgress} className="mb-4" />
              <Button className="w-full" onClick={() => window.location.href = '/practice'}>Practice Now</Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-elegant">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-level-intermediate" />
                <CardTitle>Mock Interviews</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Simulate real interview conditions</p>
              <Badge className="mb-4">AI Powered</Badge>
              <Progress value={loading ? 0 : Math.min(100, Math.round((mockCompleted / Math.max(1, mockCount)) * 100))} className="mb-4" />
              <Button className="w-full">Schedule Mock</Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-elegant">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-level-advanced" />
                <CardTitle>Company Prep</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Prepare for specific companies</p>
              <Badge className="mb-4">{company || '—'}</Badge>
              <Progress value={loading ? 0 : companyProgress} className="mb-4" />
              <Button className="w-full">Start Prep</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Interview;