import { render } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";

import LoadButtonsBlock from "../components/LoadButtonsBlock";
import { COMMON } from "../constants";
import useStore from "../store/useStore";

vi.mock("../store/useStore", () => ({
  default: vi.fn(),
}));

describe("LoadButtonsBlock component test", () => {
  beforeEach(() => {
    useStore.mockImplementation((selector) =>
      selector({
        handleFileUpload: vi.fn(),
      }),
    );
  });

  it("should render text correctly", () => {
    const { getByText } = render(
      <LoadButtonsBlock optionsType={COMMON.HEADERS} />,
    );

    expect(getByText(/Set data from file/i)).toBeInTheDocument();
    expect(getByText(/Add data from file/i)).toBeInTheDocument();
  });
});
