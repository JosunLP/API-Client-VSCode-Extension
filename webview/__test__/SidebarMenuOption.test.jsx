import { render } from "@testing-library/react";
import { vi } from "vitest";

import SidebarMenuOption from "../features/Sidebar/Menu/SidebarMenuOption";
import useStore from "../store/useStore";

vi.mock("../store/useStore", () => ({
  default: vi.fn(),
}));

describe("SidebarMenuOption component test", () => {
  it("should render empty history collection message", () => {
    useStore.mockImplementationOnce(() => ({
      projects: [],
      sidebarOption: "History",
      userRequestHistory: [],
      userFavorites: [],
      handleUserDeleteIcon: vi.fn(),
      handleUserFavoriteIcon: vi.fn(),
      addCollectionToFavorites: vi.fn(),
      removeFromFavoriteCollection: vi.fn(),
      addProject: vi.fn(),
      updateProject: vi.fn(),
      deleteProject: vi.fn(),
      toggleProjectCollapse: vi.fn(),
      assignToProject: vi.fn(),
    }));

    const { getByText } = render(<SidebarMenuOption />);

    expect(
      getByText(/Your history collection seems to be empty./i),
    ).toBeInTheDocument();
    expect(
      getByText(/Start making requests to view your history collection./i),
    ).toBeInTheDocument();
  });

  it("should render empty favorites collection message", () => {
    useStore.mockImplementationOnce(() => ({
      projects: [],
      sidebarOption: "Favorites",
      userRequestHistory: [],
      userFavorites: [],
      handleUserDeleteIcon: vi.fn(),
      handleUserFavoriteIcon: vi.fn(),
      addCollectionToFavorites: vi.fn(),
      removeFromFavoriteCollection: vi.fn(),
      addProject: vi.fn(),
      updateProject: vi.fn(),
      deleteProject: vi.fn(),
      toggleProjectCollapse: vi.fn(),
      assignToProject: vi.fn(),
    }));

    const { getByText } = render(<SidebarMenuOption />);

    expect(
      getByText(/Your favorites collection seems to be empty./i),
    ).toBeInTheDocument();
    expect(
      getByText(
        /Press the heart icon from your history collection to add it to your favorites collection./i,
      ),
    ).toBeInTheDocument();
  });
});
