import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { vi } from "vitest";

import ResponseBodyMenuOption from "../features/Response/Body/ResponseBodyMenuOption";
import useStore from "../store/useStore";

vi.mock("../store/useStore", () => ({
  default: vi.fn(),
}));

describe("ResponseBodyMenu component test", () => {
  beforeEach(() => {
    useStore.mockImplementation((selector) =>
      selector({
        responseBodyContent: "JSON",
        handleResponseBodyContent: vi.fn(),
        responseOption: "Body",
        responseBodyOption: "Pretty",
        responseBodyViewFormat: "JSON",
        responseData: null,
        responseHeaders: null,
        handleResponseBodyOption: vi.fn(),
        handleResponseBodyViewFormatChange: vi.fn(),
      }),
    );
  });

  it("should render correct default response body option", () => {
    const { getByText } = render(<ResponseBodyMenuOption />);

    expect(getByText(/json/i)).toBeInTheDocument();
    expect(getByText(/html/i)).toBeInTheDocument();
    expect(getByText(/text/i)).toBeInTheDocument();
  });

  it("should render correct default response body pretty option", () => {
    const { getByRole } = render(<ResponseBodyMenuOption />);
    const optionElement = getByRole("option", {
      name: "JSON",
    }) as HTMLOptionElement;

    expect(optionElement.selected).toBe(true);
  });

  it("should display the correct number of options", () => {
    const { getAllByRole } = render(<ResponseBodyMenuOption />);

    expect(getAllByRole("option").length).toBe(3);
  });

  it("should call handler when user selects body menu option", async () => {
    const handleResponseBodyViewFormatChange = vi.fn();
    useStore.mockImplementation((selector) =>
      selector({
        responseBodyContent: "JSON",
        handleResponseBodyContent: vi.fn(),
        responseOption: "Body",
        responseBodyOption: "Pretty",
        responseBodyViewFormat: "JSON",
        responseData: null,
        responseHeaders: null,
        handleResponseBodyOption: vi.fn(),
        handleResponseBodyViewFormatChange,
      }),
    );
    const { getByRole } = render(<ResponseBodyMenuOption />);

    await userEvent.selectOptions(
      getByRole("combobox"),
      getByRole("option", { name: "HTML" }),
    );

    expect(handleResponseBodyViewFormatChange).toHaveBeenCalledWith("HTML");
  });
});
