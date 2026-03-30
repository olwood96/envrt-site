import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { FilterDropdown } from "@/components/collective/FilterDropdown";

const options = [
  { value: "", label: "All brands" },
  { value: "b1", label: "BrandA" },
  { value: "b2", label: "BrandB" },
];

describe("FilterDropdown", () => {
  it("renders with placeholder label when no value selected", () => {
    render(
      <FilterDropdown
        label="All brands"
        value=""
        options={options}
        onChange={() => {}}
      />,
    );
    expect(screen.getByText("All brands")).toBeInTheDocument();
  });

  it("renders selected option label", () => {
    render(
      <FilterDropdown
        label="All brands"
        value="b1"
        options={options}
        onChange={() => {}}
      />,
    );
    expect(screen.getByText("BrandA")).toBeInTheDocument();
  });

  it("opens dropdown on click and shows all options", () => {
    render(
      <FilterDropdown
        label="All brands"
        value=""
        options={options}
        onChange={() => {}}
      />,
    );

    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByText("BrandA")).toBeInTheDocument();
    expect(screen.getByText("BrandB")).toBeInTheDocument();
  });

  it("calls onChange and closes when an option is clicked", () => {
    const onChange = vi.fn();
    render(
      <FilterDropdown
        label="All brands"
        value=""
        options={options}
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByText("BrandA"));

    expect(onChange).toHaveBeenCalledWith("b1");
    // Dropdown should close — BrandB option should no longer be visible
    expect(screen.queryByText("BrandB")).not.toBeInTheDocument();
  });

  it("closes on Escape key", () => {
    render(
      <FilterDropdown
        label="All brands"
        value=""
        options={options}
        onChange={() => {}}
      />,
    );

    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("BrandB")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByText("BrandB")).not.toBeInTheDocument();
  });

  it("closes on outside click", () => {
    render(
      <div>
        <FilterDropdown
          label="All brands"
          value=""
          options={options}
          onChange={() => {}}
        />
        <button data-testid="outside">Outside</button>
      </div>,
    );

    fireEvent.click(screen.getByText("All brands"));
    expect(screen.getByText("BrandB")).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId("outside"));
    expect(screen.queryByText("BrandB")).not.toBeInTheDocument();
  });
});
