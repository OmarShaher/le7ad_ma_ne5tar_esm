// Modified: Populate Profile form with authenticated user's data from /api/auth/me
import * as React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { User, Bell, Languages, Shield, Palette } from "lucide-react";
import { authMe, getToken, updateProfile } from "@/lib/api";
import { EGYPT_UNIVERSITIES, OTHER_UNI_VALUE } from "@/lib/egypt-universities";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [profile, setProfile] = React.useState<{ name: string; email: string; university: string }>({
    name: "",
    email: "",
    university: "",
  });
  const [uniOther, setUniOther] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(true);
  const [saving, setSaving] = React.useState<boolean>(false);

  React.useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const me = await authMe();
        setProfile({ name: me?.name ?? "", email: me?.email ?? "", university: me?.university ?? "" });
        if (me?.university && !EGYPT_UNIVERSITIES.includes(me.university)) {
          setProfile((p) => ({ ...p, university: OTHER_UNI_VALUE }));
          setUniOther(me.university);
        }
      } catch {
        // ignore unauthenticated
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Customize your learning experience</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <Card className="bg-gradient-card border-0 shadow-elegant">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-primary" />
                <CardTitle>Profile</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} disabled={loading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} disabled={loading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="university">University</Label>
                <Select
                  value={profile.university || ""}
                  onValueChange={(v) => {
                    setProfile({ ...profile, university: v });
                  }}
                  disabled={loading}
                >
                  <SelectTrigger id="university">
                    <SelectValue placeholder="Select your university" />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {EGYPT_UNIVERSITIES.map((u) => (
                      <SelectItem key={u} value={u}>{u}</SelectItem>
                    ))}
                    <SelectItem value={OTHER_UNI_VALUE}>{OTHER_UNI_VALUE}</SelectItem>
                  </SelectContent>
                </Select>
                {profile.university === OTHER_UNI_VALUE && (
                  <div className="pt-2">
                    <Label htmlFor="university-other" className="text-sm">Specify university</Label>
                    <Input
                      id="university-other"
                      placeholder="Enter your university"
                      value={uniOther}
                      onChange={(e) => setUniOther(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                )}
              </div>
              <Button className="w-full" disabled={loading || saving} onClick={async () => {
                setSaving(true);
                try {
                  const payload = {
                    ...profile,
                    university: profile.university === OTHER_UNI_VALUE ? uniOther.trim() : profile.university,
                  };
                  const updated = await updateProfile(payload);
                  setProfile({
                    name: updated.name,
                    email: updated.email,
                    university: EGYPT_UNIVERSITIES.includes(updated.university ?? "") ? updated.university : (updated.university ? OTHER_UNI_VALUE : ""),
                  });
                  // restore other value for custom universities
                  if (updated.university && !EGYPT_UNIVERSITIES.includes(updated.university)) {
                    setUniOther(updated.university);
                  } else {
                    setUniOther("");
                  }
                  toast({ title: "Profile updated" });
                } catch (err: any) {
                  toast({ title: "Update failed", description: String(err.message), variant: "destructive" });
                } finally {
                  setSaving(false);
                }
              }}>
                {loading ? "Loading..." : saving ? "Saving..." : "Update Profile"}
              </Button>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="bg-gradient-card border-0 shadow-elegant">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Palette className="w-5 h-5 text-primary" />
                <CardTitle>Preferences</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Theme</Label>
                  <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                </div>
                <ThemeToggle />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Arabic Interface</Label>
                  <p className="text-sm text-muted-foreground">Switch to Arabic interface</p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-translate</Label>
                  <p className="text-sm text-muted-foreground">Automatically translate content</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-gradient-card border-0 shadow-elegant">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-primary" />
                <CardTitle>Notifications</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Study Reminders</Label>
                  <p className="text-sm text-muted-foreground">Get reminded to study daily</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Progress Updates</Label>
                  <p className="text-sm text-muted-foreground">Weekly progress summaries</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>New Content</Label>
                  <p className="text-sm text-muted-foreground">Notifications for new courses</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card className="bg-gradient-card border-0 shadow-elegant">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-primary" />
                <CardTitle>Privacy & Security</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Public Profile</Label>
                  <p className="text-sm text-muted-foreground">Make your profile visible to others</p>
                </div>
                <Switch />
              </div>
              
              <Separator />
              
              <Button variant="outline" className="w-full">
                Change Password
              </Button>
              <Button variant="outline" className="w-full">
                Download Data
              </Button>
              <Button variant="destructive" className="w-full">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;