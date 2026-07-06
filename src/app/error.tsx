"use client";

import { useEffect } from "react";
import { RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface for observability; wire to your error tracker in production.
    console.error(error);
  }, [error]);

  return (
    <div className="mesh-bg flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <Logo className="mb-10" />
      <h1 className="font-display text-2xl font-bold tracking-tight">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        An unexpected error occurred. You can try again, or head back to safety.
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-xs text-muted-foreground">
          Reference: {error.digest}
        </p>
      )}
      <div className="mt-8 flex gap-3">
        <Button onClick={reset}>
          <RefreshCw className="h-4 w-4" /> Try again
        </Button>
        <Link href="/">
          <Button variant="outline">
            <Home className="h-4 w-4" /> Back home
          </Button>
        </Link>
      </div>
    </div>
  );
}
