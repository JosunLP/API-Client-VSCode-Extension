import { render } from "@testing-library/react";
import { vi } from "vitest";

import RequestAuthBearerToken from "../features/Request/Authorization/RequestAuthBearerToken";
import useStore from "../store/useStore";

vi.mock("../store/useStore", () => ({
  default: vi.fn(),
}));

describe("RequestAuthBearerToken component test", () => {
  it("should display the correct input placeholder text", () => {
    useStore.mockImplementationOnce(() => ({
      authData: { username: "", password: "", token: "" },
    }));

    const { getByPlaceholderText } = render(<RequestAuthBearerToken />);

    expect(getByPlaceholderText(/Token/i)).toBeInTheDocument();
  });

  it("should display the data from requestDataSlice", () => {
    useStore.mockImplementationOnce(() => ({
      authDataToken: "secret token value!!",
    }));

    const { getByPlaceholderText } = render(<RequestAuthBearerToken />);

    expect(getByPlaceholderText("token").value).toBe("secret token value!!");
  });
});
