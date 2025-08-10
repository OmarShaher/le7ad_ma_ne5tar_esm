// Added: Minimal protected dashboard using existing UI; shows user info and logout
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { DashboardLayout } from "@/components/DashboardLayout";
import { authMe, clearToken } from "@/lib/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const me = await authMe();
        setUser(me);
      } catch (err: any) {
        toast({ title: "Session expired", description: String(err.message), variant: "destructive" });
        navigate("/login");
      }
    })();
  }, [navigate, toast]);

  const logout = () => {
    clearToken();
    navigate("/login");
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto py-10">
      <Card className="bg-card border-0 shadow-elegant">
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {user ? (
            <>
              <div className="text-sm">Name: {user.name}</div>
              <div className="text-sm">Email: {user.email}</div>
              <Button onClick={logout} className="mt-4 bg-gradient-primary">Logout</Button>
            </>
          ) : (
            <div>Loading...</div>
          )}
        </CardContent>
      </Card>
      </div>
    </DashboardLayout>
  );
}


