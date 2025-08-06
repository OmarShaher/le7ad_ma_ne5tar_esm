import { DashboardLayout } from "@/components/DashboardLayout";
import { ChatbotPanel } from "@/components/ChatbotPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, BookOpen, MessageCircle, Lightbulb } from "lucide-react";

const Tutor = () => {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">AI Tutor</h1>
              <p className="text-muted-foreground">Get personalized help with your studies in Arabic or English</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gradient-card border-0 shadow-elegant">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-tech-blue" />
                    <CardTitle className="text-lg">Concept Explanation</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Get detailed explanations of complex CS concepts in simple terms</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-0 shadow-elegant">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5 text-tech-purple" />
                    <CardTitle className="text-lg">Q&A Session</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Ask questions and get instant answers about programming and algorithms</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-0 shadow-elegant">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Lightbulb className="w-5 h-5 text-tech-cyan" />
                    <CardTitle className="text-lg">Problem Solving</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Get step-by-step guidance on solving coding problems</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-0 shadow-elegant">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Bot className="w-5 h-5 text-level-beginner" />
                    <CardTitle className="text-lg">Study Plan</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Get personalized study recommendations based on your progress</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-1">
            <ChatbotPanel />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Tutor;