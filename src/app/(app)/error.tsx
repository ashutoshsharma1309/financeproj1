"use client";

import { useEffect } from "react";
import { RefreshCw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppError({
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
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="surface-card max-w-md p-8 text-center">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-danger/12 text-danger">
          <TriangleAlert className="h-5 w-5" />
        </span>
        <h1 className="mt-5 text-lg font-semibold tracking-tight">
          This page hit a snag
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Something went wrong while rendering this view. Your data is safe — you
          can retry without leaving the app.
        </p>
        {error.digest && (
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            Reference: {error.digest}
          </p>
        )}
        <div className="mt-6 flex justify-center">
          <Button onClick={reset}>
            <RefreshCw className="h-4 w-4" /> Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
