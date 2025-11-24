import { fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import RequestAuthSelectMenu from "../features/Request/Authorization/RequestAuthSelectMenu";
import useStore from "../store/useStore";

vi.mock("../store/useStore", () => ({
  default: vi.fn(),
}));

describe("RequestAuthSelectMenu component test", () => {
  beforeEach(() => {
    useStore.mockImplementation((selector) =>
      selector({
        authOption: "No Auth",
        handleRequestAuthType: vi.fn(),
        authData: { username: "", password: "" },
        shouldShowPassword: true,
        handleRequestAuthData: vi.fn(),
        handleShouldShowPassword: vi.fn(),
      }),
    );
  });

  it("should select option should display correct default option", () => {
    const { getByRole } = render(<RequestAuthSelectMenu />);

    expect(getByRole("option", { name: "No Auth" }).selected).toBe(true);
  });

  it("should display the correct number of options", () => {
    const { getAllByRole } = render(<RequestAuthSelectMenu />);

    expect(getAllByRole("option").length).toBe(3);
  });

  it("should call handler when user selects request method", async () => {
    const handleRequestAuthType = vi.fn();
    useStore.mockImplementation((selector) =>
      selector({
        authOption: "No Auth",
        handleRequestAuthType,
        authData: { username: "", password: "" },
      }),
    );
    const { getByRole } = render(<RequestAuthSelectMenu />);

    await userEvent.selectOptions(
      getByRole("combobox"),
      getByRole("option", { name: "Basic Auth" }),
    );

    expect(handleRequestAuthType).toHaveBeenCalledWith("Basic Auth");
  });

  it("should display basic auth input placeholder text correctly when Basic Auth is selected", () => {
    useStore.mockImplementation((selector) =>
      selector({
        authOption: "Basic Auth",
        handleRequestAuthType: vi.fn(),
        authData: { username: "", password: "" },
        shouldShowPassword: true,
        handleRequestAuthData: vi.fn(),
        handleShouldShowPassword: vi.fn(),
      }),
    );
    const { getByPlaceholderText } = render(<RequestAuthSelectMenu />);

    expect(getByPlaceholderText(/Username/i)).toBeInTheDocument();
    expect(getByPlaceholderText(/Password/i)).toBeInTheDocument();
  });

  it("should call handler when basic auth username input value changes", () => {
    const handleRequestAuthData = vi.fn();
    useStore.mockImplementation((selector) =>
      selector({
        authOption: "Basic Auth",
        handleRequestAuthType: vi.fn(),
        authData: { username: "", password: "" },
        shouldShowPassword: true,
        handleRequestAuthData,
        handleShouldShowPassword: vi.fn(),
      }),
    );
    const { getByPlaceholderText } = render(<RequestAuthSelectMenu />);

    fireEvent.change(getByPlaceholderText(/Username/i), {
      target: { value: "testuser" },
    });

    expect(handleRequestAuthData).toHaveBeenCalled();
  });
});
