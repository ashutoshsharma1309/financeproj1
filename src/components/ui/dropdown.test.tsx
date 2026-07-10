import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dropdown, DropdownItem } from "./dropdown";

describe("Dropdown", () => {
  it("is closed initially and opens when the trigger is clicked", async () => {
    render(
      <Dropdown trigger={<button>Menu</button>}>
        <DropdownItem>Profile</DropdownItem>
      </Dropdown>,
    );
    expect(screen.queryByText("Profile")).not.toBeInTheDocument();
    await userEvent.click(screen.getByText("Menu"));
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("fires a DropdownItem's onClick", async () => {
    const onClick = vi.fn();
    render(
      <Dropdown trigger={<button>Menu</button>}>
        <DropdownItem onClick={onClick}>Log out</DropdownItem>
      </Dropdown>,
    );
    await userEvent.click(screen.getByText("Menu"));
    await userEvent.click(screen.getByText("Log out"));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
