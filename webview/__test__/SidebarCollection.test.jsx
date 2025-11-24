import { fireEvent, render } from "@testing-library/react";
import { vi } from "vitest";

import SidebarCollection from "../features/Sidebar/Collection/SidebarCollection";

describe("SidebarCollection component test", () => {
  let mockData;

  beforeEach(() => {
    mockData = [
      {
        url: "http://netflix.com",
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
          Accept: "*/*",
          "Accept-Encoding": "gzip,deflate",
          Connection: "keep-alive",
        },
        requestedTime: 1658086010977,
        favoritedTime: 1658086023824,
        isUserFavorite: false,
        id: "76deed12-b222-45a5-a3ac-18a785fcef7c",
      },
    ];
    // Mock current time to be 19 hours after favoritedTime (1658086023824)
    // 19 hours = 19 * 60 * 60 * 1000 = 68400000
    // 1658086023824 + 68400000 = 1658154423824
    vi.useFakeTimers();
    vi.setSystemTime(1658154423824);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should display correct sidebar empty message when props are passed", () => {
    const { getByText } = render(<SidebarCollection sidebarOption="History" />);

    expect(
      getByText(/Your history collection seems to be empty./i),
    ).toBeInTheDocument();
    expect(
      getByText(/Start making requests to view your history collection./i),
    ).toBeInTheDocument();
  });

  it("should display correct sidebar empty message when props are passed again", () => {
    const { getByText } = render(
      <SidebarCollection sidebarOption="Favorites" />,
    );

    expect(
      getByText(/Your favorites collection seems to be empty./i),
    ).toBeInTheDocument();
    expect(
      getByText(
        /Press the heart icon from your history collection to add it to your favorites collection./i,
      ),
    ).toBeInTheDocument();
  });

  it("should display input placeholder text correctly when there is data to be displayed", () => {
    const { getByPlaceholderText } = render(
      <SidebarCollection userCollection={mockData} />,
    );

    expect(getByPlaceholderText(/Search collection.../i)).toBeInTheDocument();
  });

  it("should change value when user inputs value", () => {
    const testInputValue = "facebook?!";
    const { getByPlaceholderText } = render(
      <SidebarCollection userCollection={mockData} />,
    );

    fireEvent.change(getByPlaceholderText(/Search collection.../i), {
      target: { value: testInputValue },
    });

    expect(getByPlaceholderText(/Search collection.../i).value).toBe(
      testInputValue,
    );
  });

  it("should display correct url when passed userCollection as props", () => {
    const { getByText } = render(
      <SidebarCollection userCollection={mockData} />,
    );

    expect(getByText("http://netflix.com")).toBeInTheDocument();
    expect(getByText(/GET/i)).toBeInTheDocument();
    expect(getByText(/Added 19 hours ago/i)).toBeInTheDocument();
  });

  it("should delete collection when delete button is clicked", async () => {
    const mockHandleDeleteButton = vi.fn();

    const { getByTestId } = render(
      <SidebarCollection
        userCollection={mockData}
        handleDeleteButton={mockHandleDeleteButton}
      />,
    );

    const deleteButton = getByTestId("delete-button");

    fireEvent.click(deleteButton);

    expect(mockHandleDeleteButton).toHaveBeenCalledWith(mockData[0].id);
  });
});
