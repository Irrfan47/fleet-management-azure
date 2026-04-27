import { useState } from "react";
import { Link } from "react-router-dom";
import { Car, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/common";
import { Card, CardContent } from "@/components/ui/card";
import { APP_NAME } from "@/utils/constants";

const schema = z.object({ email: z.string().trim().email("Invalid email").max(255) });
type FormValues = z.infer<typeof schema>;

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  return (
    <div className="flex min-h-screen items-center justify-center gradient-subtle p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl gradient-primary text-primary-foreground shadow-elegant-lg">
            <Car className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{APP_NAME}</h1>
        </div>

        <Card className="shadow-elegant-lg">
          <CardContent className="p-6">
            {sent ? (
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <CheckCircle2 className="h-12 w-12 text-success" />
                <h2 className="text-xl font-semibold">Check your inbox</h2>
                <p className="text-sm text-muted-foreground">We've sent reset instructions to your email.</p>
              </div>
            ) : (
              <>
                <h2 className="mb-1 text-xl font-semibold">Forgot password</h2>
                <p className="mb-6 text-sm text-muted-foreground">Enter your email and we'll send you a reset link.</p>
                <form onSubmit={handleSubmit(() => setSent(true))} className="space-y-4">
                  <FormInput label="Email" type="email" placeholder="you@company.com" {...register("email")} error={errors.email?.message} />
                  <Button type="submit" className="w-full">Send reset link</Button>
                </form>
              </>
            )}
            <Link to="/login" className="mt-6 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              <ArrowLeft className="h-3 w-3" /> Back to sign in
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
