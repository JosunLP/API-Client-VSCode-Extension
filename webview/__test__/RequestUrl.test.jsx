import { fireEvent, render } from "@testing-library/react";
import { vi } from "vitest";

import RequestUrl from "../features/Request/Url/RequestUrl";
import useStore from "../store/useStore";

vi.mock("../store/useStore", () => ({
  default: vi.fn(),
}));

describe("RequestUrl component test", () => {
  beforeEach(() => {
    useStore.mockImplementation((selector) =>
      selector({
        requestUrl: "",
        requestOption: "Params",
        keyValueTableData: [],
        handleRequestUrlChange: vi.fn(),
      }),
    );
  });

  it("should display input placeholder text correctly", () => {
    const { getByPlaceholderText } = render(<RequestUrl />);

    expect(getByPlaceholderText(/Enter Request URL/i)).toBeInTheDocument();
  });

  it("should call handler when user inputs value", () => {
    const handleRequestUrlChange = vi.fn();
    useStore.mockImplementation((selector) =>
      selector({
        requestUrl: "",
        requestOption: "Params",
        keyValueTableData: [],
        handleRequestUrlChange,
      }),
    );
    const { getByPlaceholderText } = render(<RequestUrl />);

    const requestUrlInputElement = getByPlaceholderText(/Enter Request URL/i);

    const testInputValue = "https://google.com";

    fireEvent.change(requestUrlInputElement, {
      target: { value: testInputValue },
    });

    expect(handleRequestUrlChange).toHaveBeenCalledWith(testInputValue);
  });
});
