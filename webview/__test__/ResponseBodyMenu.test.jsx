import { render } from "@testing-library/react";
import { vi } from "vitest";

import ResponseBodyMenu from "../features/Response/Body/ResponseBodyMenu";
import useStore from "../store/useStore";

vi.mock("../store/useStore", () => ({
  default: vi.fn(),
}));

describe("ResponseBodyMenu component test", () => {
  beforeEach(() => {
    useStore.mockImplementation((selector) =>
      selector({
        responseBodyOption: "Pretty",
        responseBodyContent: "JSON",
        handleResponseBodyOption: vi.fn(),
        handleResponseBodyContent: vi.fn(),
      }),
    );
  });

  it("should render correct default response body option", () => {
    const { getByText } = render(<ResponseBodyMenu />);

    expect(getByText(/pretty/i)).toBeInTheDocument();
    expect(getByText(/raw/i)).toBeInTheDocument();
    expect(getByText(/preview/i)).toBeInTheDocument();
  });

  it("should render correct default response body pretty option", () => {
    const { getByRole } = render(<ResponseBodyMenu />);

    expect(getByRole("option", { name: "JSON" }).selected).toBe(true);
  });

  it("should display the correct number of options", () => {
    const { getAllByRole } = render(<ResponseBodyMenu />);

    expect(getAllByRole("option").length).toBe(3);
  });
});
