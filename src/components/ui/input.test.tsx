import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input, Field, Select } from "./input";

describe("Input", () => {
  it("accepts typed text", async () => {
    render(<Input aria-label="amount" />);
    const el = screen.getByLabelText("amount") as HTMLInputElement;
    await userEvent.type(el, "1500");
    expect(el.value).toBe("1500");
  });
});

describe("Field", () => {
  it("associates a label and renders its child control", () => {
    render(
      <Field label="Source" htmlFor="source">
        <Input id="source" />
      </Field>,
    );
    expect(screen.getByLabelText("Source")).toBeInTheDocument();
  });

  it("shows the error message and suppresses the hint when in error", () => {
    render(
      <Field label="Amount" error="Amount must be greater than zero" hint="e.g. 1000">
        <Input />
      </Field>,
    );
    expect(screen.getByText("Amount must be greater than zero")).toBeInTheDocument();
    expect(screen.queryByText("e.g. 1000")).not.toBeInTheDocument();
  });

  it("shows the hint when there is no error", () => {
    render(
      <Field label="Amount" hint="e.g. 1000">
        <Input />
      </Field>,
    );
    expect(screen.getByText("e.g. 1000")).toBeInTheDocument();
  });
});

describe("Select", () => {
  it("renders its options and reflects a selection", async () => {
    render(
      <Select aria-label="kind" defaultValue="CASH">
        <option value="CASH">Cash</option>
        <option value="BANK">Bank</option>
      </Select>,
    );
    const el = screen.getByLabelText("kind") as HTMLSelectElement;
    expect(el.value).toBe("CASH");
    await userEvent.selectOptions(el, "BANK");
    expect(el.value).toBe("BANK");
  });
});
