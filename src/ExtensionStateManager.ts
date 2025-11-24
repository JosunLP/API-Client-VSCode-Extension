import * as vscode from "vscode";

import { COLLECTION } from "./constants";
import { IUserRequestSidebarState } from "./utils/type";

class ExtensionStateManager {
  private context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  getExtensionContext(state: string) {
    const userRequestHistory: IUserRequestSidebarState[] | undefined =
      this.context.globalState.get(state);

    return {
      userRequestHistory: userRequestHistory,
    };
  }

  async addExtensionContext(
    state: string,
    { history }: { history: IUserRequestSidebarState[] },
  ) {
    await this.context.globalState.update(state, history);
  }

  /**
   * Adds an item to the favorites collection.
   * Also updates the item in the history collection to mark it as favorite.
   * @param id The ID of the item to add to favorites.
   */
  async addToFavorites(id: string) {
    const currentTime = new Date().getTime();
    const updatedHistory = await this.updateHistoryItem(id, {
      isUserFavorite: true,
      favoritedTime: currentTime,
    });

    // Update favorites
    const favorites =
      this.context.globalState.get<IUserRequestSidebarState[]>(
        COLLECTION.FAVORITES_COLLECTION,
      ) || [];

    const itemToAdd = updatedHistory.find((item) => item.id === id);

    if (itemToAdd) {
      // Add to favorites if not already present (or update if present)
      const updatedFavorites = [
        ...favorites.filter((f) => f.id !== id),
        itemToAdd,
      ];
      await this.context.globalState.update(
        COLLECTION.FAVORITES_COLLECTION,
        updatedFavorites,
      );
    }
  }

  /**
   * Removes an item from the favorites collection.
   * Also updates the item in the history collection to mark it as not favorite.
   * @param id The ID of the item to remove from favorites.
   */
  async removeFromFavorites(id: string) {
    await this.updateHistoryItem(id, {
      isUserFavorite: false,
      favoritedTime: null,
    });

    // Remove from favorites
    await this.deleteExtensionContext(COLLECTION.FAVORITES_COLLECTION, id);
  }

  /**
   * Marks an item as not favorite in the history collection.
   * This is typically used when an item is deleted from the favorites collection directly.
   * @param id The ID of the item to unfavorite.
   */
  async unfavoriteInHistory(id: string) {
    await this.updateHistoryItem(id, {
      isUserFavorite: false,
      favoritedTime: null,
    });
  }

  private async updateHistoryItem(
    id: string,
    updates: Partial<IUserRequestSidebarState>,
  ) {
    const history =
      this.context.globalState.get<IUserRequestSidebarState[]>(
        COLLECTION.HISTORY_COLLECTION,
      ) || [];

    const updatedHistory = history.map((item) => {
      if (item.id === id) {
        return { ...item, ...updates };
      }
      return item;
    });

    await this.context.globalState.update(
      COLLECTION.HISTORY_COLLECTION,
      updatedHistory,
    );
    return updatedHistory;
  }

  async updateFavoriteFolder(id: string, folder: string) {
    const globalFavoritesState: IUserRequestSidebarState[] | undefined =
      this.context.globalState.get(COLLECTION.FAVORITES_COLLECTION);

    if (!globalFavoritesState) return;

    const updatedFavorites = globalFavoritesState.map((item) => {
      if (item.id === id) {
        return { ...item, folder: folder };
      }
      return item;
    });

    await this.context.globalState.update(
      COLLECTION.FAVORITES_COLLECTION,
      updatedFavorites,
    );
  }

  async deleteExtensionContext(targetExtensionContext: string, id?: string) {
    const targetGlobalState: IUserRequestSidebarState[] | undefined =
      this.context.globalState.get(targetExtensionContext);

    if (!targetGlobalState) return;

    if (!id) {
      await this.context.globalState.update(targetExtensionContext, []);
    } else {
      const filteredExtenionContext = targetGlobalState.filter(
        (history) => history.id !== id,
      );

      await this.context.globalState.update(targetExtensionContext, [
        ...filteredExtenionContext,
      ]);
    }
  }
}

export default ExtensionStateManager;
