import { render } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";

import RequestButton from "../features/Request/Button/RequestButton";
import useStore from "../store/useStore";

vi.mock("../store/useStore", () => ({
  default: vi.fn(),
}));

describe("RequestNoAuth component test", () => {
  beforeEach(() => {
    useStore.mockImplementation((selector) =>
      selector({
        requestInProcess: false,
        requestMethod: "GET",
        socketConnected: false,
      }),
    );
  });

  it("should display correct message when auth option is not selected", () => {
    const { getByText } = render(<RequestButton />);

    expect(getByText(/Send/i)).toBeInTheDocument();
  });
});
