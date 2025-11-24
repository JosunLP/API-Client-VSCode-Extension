import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { vi } from "vitest";

import RequestMethod from "../features/Request/Method/RequestMethod";
import useStore from "../store/useStore";

vi.mock("../store/useStore", () => ({
  default: vi.fn(),
}));

describe("RequestMethod component test", () => {
  beforeEach(() => {
    useStore.mockImplementation((selector) =>
      selector({
        requestMethod: "GET",
        handleRequestMethodChange: vi.fn(),
      }),
    );
  });

  it("should display correct default select option", () => {
    const { getByRole } = render(<RequestMethod />);
    const optionElement = getByRole("option", {
      name: "GET",
    }) as HTMLOptionElement;
    expect(optionElement.selected).toBe(true);
  });

  it("should display the correct number of options", () => {
    const { getAllByRole } = render(<RequestMethod />);

    expect(getAllByRole("option").length).toBe(8);
  });

  it("should call handler when user selects request method", async () => {
    const handleRequestMethodChange = vi.fn();
    useStore.mockImplementation((selector) =>
      selector({
        requestMethod: "GET",
        handleRequestMethodChange,
      }),
    );
    const { getByRole } = render(<RequestMethod />);

    await userEvent.selectOptions(
      getByRole("combobox"),
      getByRole("option", { name: "POST" }),
    );

    expect(handleRequestMethodChange).toHaveBeenCalledWith("POST");
  });
});
