import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./badge";

describe("Badge", () => {
  it("renders its content", () => {
    render(<Badge>Overdue</Badge>);
    expect(screen.getByText("Overdue")).toBeInTheDocument();
  });

  it("applies the tone class for a given tone", () => {
    render(<Badge tone="danger">Late</Badge>);
    expect(screen.getByText("Late").className).toContain("text-danger");
  });

  it("defaults to the neutral tone", () => {
    render(<Badge>Draft</Badge>);
    expect(screen.getByText("Draft").className).toContain("text-muted-foreground");
  });
});
