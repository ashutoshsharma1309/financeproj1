import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./card";

describe("Card", () => {
  it("renders composed header, title, description and content", () => {
    render(
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Revenue</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </div>
        </CardHeader>
        <CardContent>Body</CardContent>
      </Card>,
    );
    expect(screen.getByRole("heading", { name: "Revenue" })).toBeInTheDocument();
    expect(screen.getByText("Last 30 days")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
  });

  it("forwards arbitrary props like data attributes", () => {
    render(<Card data-testid="k">x</Card>);
    expect(screen.getByTestId("k")).toBeInTheDocument();
  });
});
