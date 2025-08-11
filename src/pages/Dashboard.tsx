// Added: Minimal protected dashboard using existing UI; shows user info
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

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
              {user.university && <div className="text-sm">University: {user.university}</div>}
              <div className="text-sm text-muted-foreground mt-4">
                Go to Settings to logout or manage your account.
              </div>
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


