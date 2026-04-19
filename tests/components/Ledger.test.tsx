import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Ledger } from "../../src/components/Ledger";
import { DEFAULT_STATE } from "../../src/utils/defaults";

const noop = () => {};

function renderLedger(overrides = {}) {
  return render(
    <Ledger
      state={{ ...DEFAULT_STATE, ...overrides }}
      onAdd={noop}
      onUpdate={noop}
      onDelete={noop}
    />,
  );
}

describe("Ledger", () => {
  it("renders transaction descriptions", () => {
    renderLedger();
    expect(screen.getByText("Starting funds")).toBeInTheDocument();
    expect(screen.getByText("Sold goblin loot")).toBeInTheDocument();
    expect(screen.getByText("Inn & supplies")).toBeInTheDocument();
  });

  it("renders a totals row in the footer", () => {
    renderLedger();
    expect(screen.getByText("Totals")).toBeInTheDocument();
  });

  it("renders the Add transaction button", () => {
    renderLedger();
    expect(screen.getByText("+ Add transaction")).toBeInTheDocument();
  });

  it("opens the transaction modal when Add is clicked", () => {
    renderLedger();
    fireEvent.click(screen.getByText("+ Add transaction"));
    expect(screen.getByText("Add transaction")).toBeInTheDocument();
  });

  it("shows empty state when there are no transactions", () => {
    renderLedger({ transactions: [] });
    expect(screen.getByText("No transactions yet")).toBeInTheDocument();
  });

  it("calls onDelete when Del is confirmed", () => {
    const onDelete = vi.fn();
    vi.spyOn(window, "confirm").mockReturnValue(true);
    render(
      <Ledger
        state={DEFAULT_STATE}
        onAdd={noop}
        onUpdate={noop}
        onDelete={onDelete}
      />,
    );
    const delButtons = screen.getAllByText("Del");
    fireEvent.click(delButtons[0]);
    expect(onDelete).toHaveBeenCalledOnce();
  });

  it("does not call onDelete when Del is cancelled", () => {
    const onDelete = vi.fn();
    vi.spyOn(window, "confirm").mockReturnValue(false);
    render(
      <Ledger
        state={DEFAULT_STATE}
        onAdd={noop}
        onUpdate={noop}
        onDelete={onDelete}
      />,
    );
    fireEvent.click(screen.getAllByText("Del")[0]);
    expect(onDelete).not.toHaveBeenCalled();
  });
});
