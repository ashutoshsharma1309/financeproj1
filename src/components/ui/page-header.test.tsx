import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageHeader } from "./page-header";

describe("PageHeader", () => {
  it("renders the title as a level-1 heading", () => {
    render(<PageHeader title="Invoices" />);
    expect(screen.getByRole("heading", { level: 1, name: "Invoices" })).toBeInTheDocument();
  });

  it("renders the description when provided", () => {
    render(<PageHeader title="Invoices" description="Manage your billing" />);
    expect(screen.getByText("Manage your billing")).toBeInTheDocument();
  });

  it("renders an action node", () => {
    render(<PageHeader title="Invoices" action={<button>New invoice</button>} />);
    expect(screen.getByRole("button", { name: "New invoice" })).toBeInTheDocument();
  });

  it("omits the description paragraph when not given", () => {
    const { container } = render(<PageHeader title="Invoices" />);
    expect(container.querySelector("p")).toBeNull();
  });
});
