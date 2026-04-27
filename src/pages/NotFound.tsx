import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 gradient-subtle p-8 text-center">
      <h1 className="text-7xl font-bold tracking-tight text-primary">404</h1>
      <p className="text-lg text-muted-foreground">The page you're looking for doesn't exist.</p>
      <Button asChild><Link to="/">Back to dashboard</Link></Button>
    </div>
  );
}
