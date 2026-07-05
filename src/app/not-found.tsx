import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mesh-bg flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <Logo className="mb-10" />
      <p className="text-7xl font-bold gradient-text">404</p>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4" /> Back home
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button>
            <Home className="h-4 w-4" /> Go to dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
