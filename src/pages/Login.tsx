import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Car, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/common";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { APP_NAME, APP_TAGLINE } from "@/utils/constants";

const schema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
});
type FormValues = z.infer<typeof schema>;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "admin@fleet.com", password: "demo123" },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      toast.success("Welcome back!");
      navigate("/");
    } catch {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center gradient-subtle p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl gradient-primary text-primary-foreground shadow-elegant-lg">
            <Car className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{APP_NAME}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{APP_TAGLINE}</p>
        </div>

        <Card className="shadow-elegant-lg">
          <CardContent className="p-6">
            <h2 className="mb-1 text-xl font-semibold">Sign in</h2>
            <p className="mb-6 text-sm text-muted-foreground">Enter your credentials to access the dashboard</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormInput label="Email" type="email" placeholder="you@company.com" {...register("email")} error={errors.email?.message} />
              <FormInput label="Password" type="password" placeholder="••••••••" {...register("password")} error={errors.password?.message} />

              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-xs font-medium text-primary hover:underline">Forgot password?</Link>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Sign in
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              Demo: any email · Tip: include "admin" in email for admin role
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
