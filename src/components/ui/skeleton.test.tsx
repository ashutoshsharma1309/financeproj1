import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Skeleton, TableSkeleton } from "./skeleton";

describe("Skeleton", () => {
  it("renders a placeholder element with the skeleton class", () => {
    const { container } = render(<Skeleton className="h-4 w-24" />);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain("skeleton");
    expect(el.className).toContain("h-4");
  });

  it("TableSkeleton renders one placeholder row per requested row", () => {
    const { container } = render(<TableSkeleton rows={3} />);
    // Each row is a Skeleton div inside the wrapper.
    expect(container.querySelectorAll(".skeleton")).toHaveLength(3);
  });
});
