import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, ArrowRight, BookOpen, Code, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

const roadmapStages = [
  {
    level: "Beginner",
    color: "level-beginner",
    icon: BookOpen,
    topics: [
      { name: "Programming Fundamentals", completed: true },
      { name: "Data Structures Basics", completed: true },
      { name: "Algorithm Introduction", completed: false, current: true },
    ]
  },
  {
    level: "Intermediate",
    color: "level-intermediate", 
    icon: Code,
    topics: [
      { name: "Advanced Algorithms", completed: false },
      { name: "System Design Basics", completed: false },
      { name: "Database Management", completed: false },
    ]
  },
  {
    level: "Advanced",
    color: "level-advanced",
    icon: Brain,
    topics: [
      { name: "Machine Learning", completed: false },
      { name: "Cloud Architecture", completed: false },
      { name: "Advanced System Design", completed: false },
    ]
  }
];

const nextRecommendedTopic = {
  title: "Algorithm Introduction",
  description: "Learn fundamental algorithms including sorting, searching, and basic graph traversal.",
  estimatedTime: "3 hours",
  difficulty: "Beginner",
  topics: ["Bubble Sort", "Binary Search", "Linear Search", "Time Complexity"]
};

export function RoadmapSection() {
  return (
    <div className="space-y-8">
      {/* Visual Roadmap */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Your Learning Path</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {roadmapStages.map((stage, stageIndex) => (
            <Card 
              key={stage.level} 
              className={cn(
                "relative border-2 transition-all duration-300 hover:shadow-elegant",
                "bg-gradient-card",
                stageIndex === 0 ? "border-level-beginner/30" :
                stageIndex === 1 ? "border-level-intermediate/30" :
                "border-level-advanced/30"
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    stageIndex === 0 ? "bg-level-beginner/10" :
                    stageIndex === 1 ? "bg-level-intermediate/10" :
                    "bg-level-advanced/10"
                  )}>
                    <stage.icon className={cn(
                      "w-5 h-5",
                      stageIndex === 0 ? "text-level-beginner" :
                      stageIndex === 1 ? "text-level-intermediate" :
                      "text-level-advanced"
                    )} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{stage.level}</CardTitle>
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "text-xs",
                        stageIndex === 0 ? "bg-level-beginner/10 text-level-beginner" :
                        stageIndex === 1 ? "bg-level-intermediate/10 text-level-intermediate" :
                        "bg-level-advanced/10 text-level-advanced"
                      )}
                    >
                      {stage.topics.filter(t => t.completed).length}/{stage.topics.length} Complete
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {stage.topics.map((topic, index) => (
                    <div 
                      key={index} 
                      className={cn(
                        "flex items-center space-x-3 p-2 rounded-lg transition-colors",
                        topic.current ? "bg-primary/5 border border-primary/20" : "",
                        topic.completed ? "text-muted-foreground" : "text-foreground"
                      )}
                    >
                      {topic.completed ? (
                        <CheckCircle className="w-4 h-4 text-level-beginner" />
                      ) : (
                        <Circle className={cn(
                          "w-4 h-4",
                          topic.current ? "text-primary" : "text-muted-foreground"
                        )} />
                      )}
                      <span className={cn(
                        "text-sm",
                        topic.completed ? "line-through" : "",
                        topic.current ? "font-medium text-primary" : ""
                      )}>
                        {topic.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
              
              {/* Connection Line */}
              {stageIndex < roadmapStages.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2">
                  <ArrowRight className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Next Recommended Topic */}
      <div>
        <h3 className="text-xl font-bold text-foreground mb-4">Next Recommended</h3>
        
        <Card className="bg-gradient-primary border-0 text-primary-foreground shadow-glow">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <h4 className="text-xl font-bold mb-2">{nextRecommendedTopic.title}</h4>
                <p className="text-primary-foreground/90 mb-4">
                  {nextRecommendedTopic.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {nextRecommendedTopic.topics.map((topic, index) => (
                    <Badge key={index} variant="secondary" className="bg-white/20 text-primary-foreground">
                      {topic}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-primary-foreground/80">
                  <span>⏱️ {nextRecommendedTopic.estimatedTime}</span>
                  <span>📈 {nextRecommendedTopic.difficulty}</span>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 md:ml-6">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 text-primary-foreground border-white/30"
                >
                  Start Learning
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}