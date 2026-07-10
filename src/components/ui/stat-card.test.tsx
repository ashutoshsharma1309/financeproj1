import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Wallet } from "lucide-react";
import { StatCard } from "./stat-card";

describe("StatCard", () => {
  it("renders the label and value", () => {
    render(<StatCard label="Cash" value="$1,000" icon={Wallet} />);
    expect(screen.getByText("Cash")).toBeInTheDocument();
    expect(screen.getByText("$1,000")).toBeInTheDocument();
  });

  it("shows a hint (not a delta) when delta is null", () => {
    render(<StatCard label="Cash" value="$0" icon={Wallet} delta={null} hint="No data yet" />);
    expect(screen.getByText("No data yet")).toBeInTheDocument();
  });

  it("renders a signed percentage delta when provided", () => {
    render(<StatCard label="Revenue" value="$2,000" icon={Wallet} delta={12.5} />);
    // formatPercent renders the magnitude with a percent sign.
    expect(screen.getByText(/12\.5%/)).toBeInTheDocument();
    expect(screen.getByText("vs last month")).toBeInTheDocument();
  });
});
