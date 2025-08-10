// Added: New Register page matching existing UI style; uses existing UI components
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { DashboardLayout } from "@/components/DashboardLayout";
import { authRegister, setToken } from "@/lib/api";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authRegister(form);
      setToken(res.token);
      toast({ title: "Account created", description: `Welcome, ${res.user.name}` });
      navigate("/");
    } catch (err: any) {
      toast({ title: "Registration failed", description: String(err.message), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto py-10">
      <Card className="bg-card border-0 shadow-elegant">
        <CardHeader>
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <Input placeholder="Confirm password" type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
            <Button disabled={loading} className="w-full bg-gradient-primary">
              {loading ? "Creating..." : "Create account"}
            </Button>
          </form>
          <div className="text-sm text-muted-foreground mt-4">
            Already have an account? <Link to="/login" className="underline">Login</Link>
          </div>
        </CardContent>
      </Card>
      </div>
    </DashboardLayout>
  );
}


