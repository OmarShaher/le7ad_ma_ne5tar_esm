import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code, Trophy, Target, Zap } from "lucide-react";

const Practice = () => {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Coding Practice</h1>
          <p className="text-muted-foreground">Sharpen your programming skills with hands-on exercises</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-card border-0 shadow-elegant">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Code className="w-5 h-5 text-level-beginner" />
                <CardTitle>Algorithm Challenges</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Practice fundamental algorithms and data structures</p>
              <Badge className="mb-4">50+ Problems</Badge>
              <div className="mt-4">
                <Button className="w-full">Start Practicing</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-elegant">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-level-intermediate" />
                <CardTitle>Competitive Programming</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Compete with other students and improve your ranking</p>
              <Badge className="mb-4">Weekly Contests</Badge>
              <div className="mt-4">
                <Button className="w-full">Join Contest</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-elegant">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-level-advanced" />
                <CardTitle>Interview Prep</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Practice common interview questions from top tech companies</p>
              <Badge className="mb-4">FAANG Ready</Badge>
              <div className="mt-4">
                <Button className="w-full">Start Prep</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Practice;