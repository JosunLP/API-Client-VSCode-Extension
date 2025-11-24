import { render } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";

import ResponseMenu from "../features/Response/Menu/ResponseMenu";
import useStore from "../store/useStore";

vi.mock("../store/useStore", () => ({
  default: vi.fn(),
}));

describe("ResponseMenu component test", () => {
  beforeEach(() => {
    useStore.mockImplementation((selector) =>
      selector({
        responseOption: "Body",
        responseMenuOption: "Body",
        handleResponseMenuOption: vi.fn(),
        responseBodyViewFormat: "JSON",
        responseData: null,
        responseHeaders: null,
        responseBodyOption: "Pretty",
      }),
    );
  });

  it("should render response menu with three options", () => {
    const { getAllByRole } = render(<ResponseMenu />);

    expect(getAllByRole("option").length).toEqual(3);
  });

  it("should render response menu option correctly", () => {
    const { getByText } = render(<ResponseMenu />);

    expect(getByText(/Body/i)).toBeInTheDocument();
    expect(getByText(/Headers/i)).toBeInTheDocument();
  });
});
