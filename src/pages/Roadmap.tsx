import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, Play, Clock, Users } from "lucide-react";

const Roadmap = () => {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Your Learning Roadmap</h1>
          <p className="text-muted-foreground">Master computer science step by step</p>
        </div>

        <Card className="bg-gradient-tech text-white border-0 shadow-elegant">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold">24</div>
                <div className="text-white/80">Completed Topics</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">8</div>
                <div className="text-white/80">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">28</div>
                <div className="text-white/80">Remaining</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Detailed Learning Path</h2>
          <p className="text-muted-foreground">Interactive roadmap coming soon with more detailed tracking and personalized recommendations.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Roadmap;