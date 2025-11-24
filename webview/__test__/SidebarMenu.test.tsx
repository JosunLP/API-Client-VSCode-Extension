import { render } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";

import SidebarMenu from "../features/Sidebar/Menu/SidebarMenu";
import useStore from "../store/useStore";

vi.mock("../store/useStore", () => ({
  default: vi.fn(),
}));

describe("SidebarGuideMenu component test", () => {
  beforeEach(() => {
    useStore.mockImplementation((selector) =>
      selector({
        sidebarOption: "History",
        handleSidebarOption: vi.fn(),
      }),
    );
  });

  it("should display correct default sidebar message", () => {
    const { getAllByText } = render(<SidebarMenu />);

    expect(getAllByText(/History/i)).toHaveLength(3);
  });

  it("should have correct styles applied for History text", () => {
    const { getByText } = render(<SidebarMenu />);

    expect(getByText("History")).toHaveStyle("font-size:1.25rem");
    expect(getByText("History")).toHaveStyle("font-weight:200");
  });

  it("should have correct styles applied for Favorites text", () => {
    const { getByText } = render(<SidebarMenu />);

    expect(getByText("Favorites")).toHaveStyle("font-size:1.25rem");
    expect(getByText("Favorites")).toHaveStyle("font-weight:200");
  });
});
