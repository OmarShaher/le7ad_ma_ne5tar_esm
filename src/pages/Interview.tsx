import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Briefcase, Calendar, Target, Clock } from "lucide-react";

const Interview = () => {
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
                <div className="text-3xl font-bold">15</div>
                <div className="text-primary-foreground/80">Mock Interviews</div>
              </div>
              <div>
                <div className="text-3xl font-bold">89%</div>
                <div className="text-primary-foreground/80">Success Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold">32</div>
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
              <Badge className="mb-4">200+ Questions</Badge>
              <Progress value={75} className="mb-4" />
              <Button className="w-full">Practice Now</Button>
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
              <Progress value={60} className="mb-4" />
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
              <Badge className="mb-4">FAANG Focus</Badge>
              <Progress value={45} className="mb-4" />
              <Button className="w-full">Start Prep</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Interview;