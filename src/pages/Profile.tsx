import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader, StatusBadge } from "@/components/common";
import { useAuth } from "@/context/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  const initials = user?.name?.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase() || "U";
  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Manage your account information" />
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-elegant md:col-span-1">
          <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
            <Avatar className="h-24 w-24"><AvatarFallback className="bg-primary text-2xl text-primary-foreground">{initials}</AvatarFallback></Avatar>
            <div>
              <h2 className="text-lg font-semibold">{user?.name}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <StatusBadge label={user?.role === "admin" ? "Administrator" : "Standard user"} tone={user?.role === "admin" ? "info" : "muted"} />
          </CardContent>
        </Card>
        <Card className="shadow-elegant md:col-span-2">
          <CardHeader><CardTitle className="text-base">Account details</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-sm">
            <Field label="Full name" value={user?.name} />
            <Field label="Email" value={user?.email} />
            <Field label="Role" value={user?.role} />
            <Field label="Department" value="Operations" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between border-b pb-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium capitalize">{value || "—"}</span>
    </div>
  );
}
