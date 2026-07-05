import * as React from "react";

/**
 * Minimal, safe renderer for the assistant's lightweight markdown
 * (bold, bullet lists, line breaks). No raw HTML is ever injected.
 */
export function MessageContent({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1.5 text-sm leading-relaxed">
      {lines.map((line, i) => {
        if (line.trim() === "") return <div key={i} className="h-1.5" />;
        const isBullet = /^\s*[-•]\s+/.test(line);
        const content = isBullet ? line.replace(/^\s*[-•]\s+/, "") : line;
        return (
          <div key={i} className={isBullet ? "flex gap-2 pl-1" : ""}>
            {isBullet && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
            <p>{renderInline(content)}</p>
          </div>
        );
      })}
    </div>
  );
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}
