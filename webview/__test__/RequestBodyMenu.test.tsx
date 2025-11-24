import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { vi } from "vitest";

import RequestBodyMenu from "../features/Request/Body/RequestBodySelectMenu";
import useStore from "../store/useStore";

vi.mock("../store/useStore", () => ({
  default: vi.fn(),
}));

describe("RequestBodyMenu component test", () => {
  beforeEach(() => {
    useStore.mockImplementation((selector) =>
      selector({
        bodyOption: "None",
        bodyRawOption: "Text",
        handleRequestBodyOption: vi.fn(),
        addRequestBodyHeaders: vi.fn(),
        removeRequestBodyHeaders: vi.fn(),
      }),
    );
  });

  it("should render correct amount of request body option", () => {
    const { getAllByRole } = render(<RequestBodyMenu />);

    expect(getAllByRole("radio").length).toEqual(4);
  });

  it("should render correct radio button when first rendered", async () => {
    const { getByLabelText } = render(<RequestBodyMenu />);

    expect(getByLabelText("None")).toBeChecked();
  });

  it("should call handler when radio button is clicked", async () => {
    const handleRequestBodyOption = vi.fn();
    useStore.mockImplementation((selector) =>
      selector({
        bodyOption: "None",
        bodyRawOption: "Text",
        handleRequestBodyOption,
        addRequestBodyHeaders: vi.fn(),
        removeRequestBodyHeaders: vi.fn(),
      }),
    );
    const { getByLabelText } = render(<RequestBodyMenu />);

    await userEvent.click(getByLabelText("Form Data"));

    expect(handleRequestBodyOption).toHaveBeenCalledWith("Form Data");
  });
});
