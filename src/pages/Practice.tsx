import * as React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code, Trophy, Target, Zap } from "lucide-react";
import { fetchQuestions, submitAttempt, type Question } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const Practice = () => {
  const { toast } = useToast();
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [selectedChoice, setSelectedChoice] = React.useState<Record<string, number | undefined>>({});

  const load = async () => {
    setLoading(true);
    try {
      const qs = await fetchQuestions({ limit: 6 });
      setQuestions(qs);
      setSelectedChoice({});
    } catch (e: any) {
      toast({ title: 'Failed to load questions', description: String(e.message), variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    load();
  }, []);
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
              <div className="flex items-center justify-between mb-3">
                <p className="text-muted-foreground">Practice fundamental algorithms and data structures</p>
                <Button size="sm" onClick={load} disabled={loading}>
                  {loading ? 'Loading...' : 'Refresh'}
                </Button>
              </div>
              <div className="space-y-4">
                {questions.map((q) => (
                  <div key={q._id} className="p-4 rounded-lg bg-card">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{q.title}</div>
                      <Badge>{q.difficulty}</Badge>
                    </div>
                    {q.description && <p className="text-sm text-muted-foreground mt-1">{q.description}</p>}
                    {Array.isArray(q.choices) && q.choices.length > 0 && (
                      <div className="mt-3 grid gap-2">
                        {q.choices.map((c, idx) => (
                          <Button
                            key={idx}
                            variant={selectedChoice[q._id] === idx ? 'default' : 'outline'}
                            className="justify-start"
                            onClick={() => setSelectedChoice((s) => ({ ...s, [q._id]: idx }))}
                          >
                            {c}
                          </Button>
                        ))}
                      </div>
                    )}
                    <div className="mt-3 flex gap-2">
                      <Button
                        onClick={async () => {
                          try {
                            const idx = selectedChoice[q._id];
                            if (typeof idx !== 'number') return;
                            const res = await submitAttempt(q._id, idx);
                            toast({ title: res.status === 'correct' ? 'Correct!' : 'Incorrect', description: q.title });
                          } catch (e: any) {
                            toast({ title: 'Submit failed', description: String(e.message), variant: 'destructive' });
                          }
                        }}
                        disabled={typeof selectedChoice[q._id] !== 'number'}
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                ))}
                {questions.length === 0 && !loading && (
                  <div className="text-sm text-muted-foreground">No questions yet.</div>
                )}
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