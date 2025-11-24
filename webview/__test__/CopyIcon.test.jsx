import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import CopyIcon from "../components/CopyIcon";

const originalClipboard = { ...global.navigator.clipboard };

const handleCopyIconClick = (value) => {
  navigator.clipboard.writeText(value);
};

beforeEach(() => {
  let clipboardData = "";

  const mockClipboard = {
    writeText: vi.fn((data) => {
      clipboardData = data;
    }),
    readText: vi.fn(() => {
      return clipboardData;
    }),
  };
  global.navigator.clipboard = mockClipboard;
});

afterEach(() => {
  vi.resetAllMocks();
  if (global.navigator) {
    global.navigator.clipboard = originalClipboard;
  }
});

describe("CopyIcon component test", () => {
  it("should copy code to clipboard when icon is clicked", async () => {
    const stringValue = "Very important Pulse API Client code 🧐";

    const { getByRole } = render(
      <CopyIcon handleClick={handleCopyIconClick} value={stringValue} />,
    );

    await userEvent.click(getByRole("button"));

    expect(navigator.clipboard.readText()).toBe(stringValue);
    expect(navigator.clipboard.writeText).toBeCalledTimes(1);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(stringValue);
  });
});
