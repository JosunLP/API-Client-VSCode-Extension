import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import RequestBodyRawOptions from "../features/Request/Body/RequestBodyRawOptions";
import useStore from "../store/useStore";

vi.mock("../store/useStore", () => ({
  default: vi.fn(),
}));

describe("RequestBodyRawOptions component test", () => {
  beforeEach(() => {
    useStore.mockImplementation((selector) =>
      selector({
        bodyRawOption: "Text",
        handleBodyRawOption: vi.fn(),
        addRequestBodyHeaders: vi.fn(),
        removeRequestBodyHeaders: vi.fn(),
      }),
    );
  });

  it("should select option should display correct default option", () => {
    const { getByRole } = render(<RequestBodyRawOptions />);

    expect(getByRole("option", { name: "Text" }).selected).toBe(true);
  });

  it("should display the correct number of options", () => {
    const { getAllByRole } = render(<RequestBodyRawOptions />);

    expect(getAllByRole("option").length).toBe(4);
  });

  it("should call handler when user selects request body raw options", async () => {
    const handleBodyRawOption = vi.fn();
    useStore.mockImplementation((selector) =>
      selector({
        bodyRawOption: "Text",
        handleBodyRawOption,
        addRequestBodyHeaders: vi.fn(),
        removeRequestBodyHeaders: vi.fn(),
      }),
    );
    const { getByRole } = render(<RequestBodyRawOptions />);

    await userEvent.selectOptions(
      getByRole("combobox"),
      getByRole("option", { name: "JavaScript" }),
    );

    expect(handleBodyRawOption).toHaveBeenCalledWith("JavaScript");
  });
});
