import { render } from "@testing-library/react";
import React from "react";
import { vi } from "vitest";

import { COMMON } from "../constants";
import LoadJSONFileButton from "../features/Request/Button/LoadJSONFileButton";
import useStore from "../store/useStore";

vi.mock("../store/useStore", () => ({
  default: vi.fn(),
}));

describe("LoadJSONFileButton component test", () => {
  beforeEach(() => {
    useStore.mockImplementation((selector) =>
      selector({
        handleFileUpload: vi.fn(),
      }),
    );
  });

  it("should render text correctly", () => {
    const { getByText } = render(
      <LoadJSONFileButton replaceValues={false} optionsType={COMMON.HEADERS} />,
    );
    expect(getByText(/Add data from file/i)).toBeInTheDocument();
  });

  it("should render text correctly when 'replaceValues' prop is true", () => {
    const { getByText } = render(
      <LoadJSONFileButton optionsType={COMMON.HEADERS} replaceValues />,
    );
    expect(getByText(/Set data from file/i)).toBeInTheDocument();
  });
});
