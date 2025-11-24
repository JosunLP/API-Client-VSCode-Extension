import { render } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";

import SidebarPage from "../pages/SidebarPage";
import useStore from "../store/useStore";

vi.mock("../store/useStore", () => ({
  default: vi.fn(),
}));

describe("SidebarPage component test", () => {
  beforeEach(() => {
    useStore.mockImplementation((selector) =>
      selector({
        sidebarOption: "History",
        handleSidebarOption: vi.fn(),
        deleteCollection: vi.fn(),
        resetFavoriteIconState: vi.fn(),
        handleUserHistoryCollection: vi.fn(),
        handleUserFavoritesCollection: vi.fn(),
        userFavorites: [],
        userRequestHistory: [],
        handleUserDeleteIcon: vi.fn(),
        handleUserFavoriteIcon: vi.fn(),
        addCollectionToFavorites: vi.fn(),
        removeFromFavoriteCollection: vi.fn(),
      }),
    );
  });

  it("should display default menu with correct message", () => {
    const { getByText } = render(<SidebarPage />);

    expect(getByText("History")).toBeInTheDocument();
    expect(getByText("Favorites")).toBeInTheDocument();
    expect(
      getByText("Your history collection seems to be empty."),
    ).toBeInTheDocument();
    expect(
      getByText("Start making requests to view your history collection."),
    ).toBeInTheDocument();
  });
});
