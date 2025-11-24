import { render } from "@testing-library/react";
import { vi } from "vitest";

import ResponsePanel from "../features/Response/Panel/ResponsePanel";
import useStore from "../store/useStore";

vi.mock("../store/useStore", () => ({
  default: vi.fn(),
}));

describe("ResponsePanel component test", () => {
  it("should display default message when response panel menu is shown", () => {
    useStore.mockImplementationOnce(() => ({
      responseData: "",
      requestInProcess: "",
    }));

    const { getByText } = render(<ResponsePanel />);

    expect(
      getByText(/Enter request URL and click send to get a response/i),
    ).toBeInTheDocument();
  });

  it("should display loading message when request is in progress", () => {
    useStore.mockImplementationOnce(() => ({
      responseData: "",
      requestInProcess: "Loading",
    }));

    const { getByText } = render(<ResponsePanel />);

    expect(getByText(/Sending Request.../i)).toBeInTheDocument();
  });

  it("should display error message when request is in progress", () => {
    useStore.mockImplementationOnce(() => ({
      responseData: "",
      requestInProcess: "Error",
    }));

    const { getByText } = render(<ResponsePanel />);

    expect(getByText(/Could not send request/i)).toBeInTheDocument();
  });
});
