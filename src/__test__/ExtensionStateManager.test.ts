import { beforeEach, describe, expect, it, vi } from "vitest";

import { COLLECTION } from "../constants";
import ExtensionStateManager from "../ExtensionStateManager";
import { IUserRequestSidebarState } from "../utils/type";

// Mock vscode module
vi.mock("vscode", () => {
  return {
    ExtensionContext: class {},
  };
});

describe("ExtensionStateManager", () => {
  let stateManager: ExtensionStateManager;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockContext: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let globalState: Map<string, any>;

  const mockHistoryItem: IUserRequestSidebarState = {
    id: "1",
    url: "http://test.com",
    method: "GET",
    headers: {},
    responseType: "JSON",
    requestedTime: 1234567890,
    favoritedTime: null,
    isUserFavorite: false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    requestObject: {} as any,
  };

  beforeEach(() => {
    globalState = new Map();
    mockContext = {
      globalState: {
        get: vi.fn((key: string) => globalState.get(key)),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        update: vi.fn((key: string, value: any) => {
          globalState.set(key, value);
          return Promise.resolve();
        }),
      },
    };
    stateManager = new ExtensionStateManager(mockContext);
  });

  it("should get extension context", () => {
    const history = [mockHistoryItem];
    globalState.set(COLLECTION.HISTORY_COLLECTION, history);

    const result = stateManager.getExtensionContext(
      COLLECTION.HISTORY_COLLECTION,
    );
    expect(result.userRequestHistory).toEqual(history);
  });

  it("should add extension context", async () => {
    const history = [mockHistoryItem];
    await stateManager.addExtensionContext(COLLECTION.HISTORY_COLLECTION, {
      history,
    });

    expect(mockContext.globalState.update).toHaveBeenCalledWith(
      COLLECTION.HISTORY_COLLECTION,
      history,
    );
    expect(globalState.get(COLLECTION.HISTORY_COLLECTION)).toEqual(history);
  });

  describe("Favorites Management", () => {
    it("addToFavorites should set isUserFavorite to true and add to favorites collection", async () => {
      const history = [{ ...mockHistoryItem, isUserFavorite: false }];
      globalState.set(COLLECTION.HISTORY_COLLECTION, history);
      globalState.set(COLLECTION.FAVORITES_COLLECTION, []);

      await stateManager.addToFavorites("1");

      const updatedHistory = globalState.get(COLLECTION.HISTORY_COLLECTION);
      expect(updatedHistory[0].isUserFavorite).toBe(true);
      expect(updatedHistory[0].favoritedTime).not.toBeNull();

      const updatedFavorites = globalState.get(COLLECTION.FAVORITES_COLLECTION);
      expect(updatedFavorites).toHaveLength(1);
      expect(updatedFavorites[0].id).toBe("1");
    });

    it("removeFromFavorites should set isUserFavorite to false and remove from favorites collection", async () => {
      const historyItem = {
        ...mockHistoryItem,
        isUserFavorite: true,
        favoritedTime: 123,
      };
      const history = [historyItem];
      const favorites = [historyItem];

      globalState.set(COLLECTION.HISTORY_COLLECTION, history);
      globalState.set(COLLECTION.FAVORITES_COLLECTION, favorites);

      await stateManager.removeFromFavorites("1");

      const updatedHistory = globalState.get(COLLECTION.HISTORY_COLLECTION);
      expect(updatedHistory[0].isUserFavorite).toBe(false);
      expect(updatedHistory[0].favoritedTime).toBeNull();

      const updatedFavorites = globalState.get(COLLECTION.FAVORITES_COLLECTION);
      expect(updatedFavorites).toHaveLength(0);
    });

    it("unfavoriteInHistory should set isUserFavorite to false in history", async () => {
      const historyItem = {
        ...mockHistoryItem,
        isUserFavorite: true,
        favoritedTime: 123,
      };
      const history = [historyItem];
      globalState.set(COLLECTION.HISTORY_COLLECTION, history);

      await stateManager.unfavoriteInHistory("1");

      const updatedHistory = globalState.get(COLLECTION.HISTORY_COLLECTION);
      expect(updatedHistory[0].isUserFavorite).toBe(false);
      expect(updatedHistory[0].favoritedTime).toBeNull();
    });
  });

  describe("deleteExtensionContext", () => {
    it("should delete item from context", async () => {
      const history = [mockHistoryItem];
      globalState.set(COLLECTION.HISTORY_COLLECTION, history);

      await stateManager.deleteExtensionContext(
        COLLECTION.HISTORY_COLLECTION,
        "1",
      );

      const updatedHistory = globalState.get(COLLECTION.HISTORY_COLLECTION);
      expect(updatedHistory).toHaveLength(0);
    });

    it("should clear context if no id provided", async () => {
      const history = [mockHistoryItem];
      globalState.set(COLLECTION.HISTORY_COLLECTION, history);

      await stateManager.deleteExtensionContext(COLLECTION.HISTORY_COLLECTION);

      const updatedHistory = globalState.get(COLLECTION.HISTORY_COLLECTION);
      expect(updatedHistory).toHaveLength(0);
    });
  });
});
