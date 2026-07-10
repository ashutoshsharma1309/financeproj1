import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Inbox } from "lucide-react";
import { EmptyState } from "./empty-state";

describe("EmptyState", () => {
  it("renders the title and description", () => {
    render(
      <EmptyState icon={Inbox} title="Nothing here yet" description="Add your first entry." />,
    );
    expect(screen.getByRole("heading", { name: "Nothing here yet" })).toBeInTheDocument();
    expect(screen.getByText("Add your first entry.")).toBeInTheDocument();
  });

  it("renders an action when provided", () => {
    render(
      <EmptyState
        icon={Inbox}
        title="Nothing here yet"
        description="Add your first entry."
        action={<button>Add revenue</button>}
      />,
    );
    expect(screen.getByRole("button", { name: "Add revenue" })).toBeInTheDocument();
  });

  it("omits the action wrapper when no action is given", () => {
    render(<EmptyState icon={Inbox} title="Empty" description="None." />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
