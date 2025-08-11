// Added: New Login page matching existing UI style; uses existing UI components
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { DashboardLayout } from "@/components/DashboardLayout";
import { authLogin, setToken } from "@/lib/api";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authLogin(form);
      setToken(res.token);
      login(res.token, res.user);
      toast({ title: "Welcome back", description: res.user.email });
      
      // Redirect to the page they were trying to access, or home
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (err: any) {
      toast({ title: "Login failed", description: String(err.message), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto py-10">
      <Card className="bg-card border-0 shadow-elegant">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <Input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <Button disabled={loading} className="w-full bg-gradient-primary">
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <div className="text-sm text-muted-foreground mt-4">
            New here? <Link to="/register" className="underline">Create an account</Link>
          </div>
        </CardContent>
      </Card>
      </div>
    </DashboardLayout>
  );
}


