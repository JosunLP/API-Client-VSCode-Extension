import * as vscode from "vscode";

import { BaseWebView } from "./BaseWebView";
import { CATEGORY, COLLECTION, COMMAND, MESSAGE, TYPE } from "./constants";
import ExtensionStateManager from "./ExtensionStateManager";
import { filterObjectKey, generateResponseObject } from "./utils";
import { IEnvironment, IUserRequestSidebarState } from "./utils/type";

/**
 * Manages the sidebar webview panel.
 */
class SidebarWebViewPanel
  extends BaseWebView
  implements vscode.WebviewViewProvider
{
  private sidebarWebview: vscode.WebviewView | null = null;
  // private extensionUri; // Handled by BaseWebView
  public mainWebViewPanel: vscode.WebviewPanel | null = null;
  public stateManager;

  constructor(extensionUri: vscode.Uri, stateManager: ExtensionStateManager) {
    super(extensionUri);
    this.stateManager = stateManager;
  }

  resolveWebviewView(webviewView: vscode.WebviewView): void | Thenable<void> {
    console.log("Pulse API Client: Resolving sidebar webview...");
    this.sidebarWebview = webviewView;

    this.sidebarWebview.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this.extensionUri, "media"),
        vscode.Uri.joinPath(this.extensionUri, "dist"),
      ],
    };

    const html = this.getHtmlForWebview(webviewView.webview, "sidebar.js");
    console.log("Pulse API Client: Generated HTML length:", html.length);
    this.sidebarWebview.webview.html = html;

    const historyData = this.stateManager.getExtensionContext(
      COLLECTION.HISTORY_COLLECTION,
    );
    const favoritesData = this.stateManager.getExtensionContext(
      COLLECTION.FAVORITES_COLLECTION,
    );
    const environmentsData = this.stateManager.getEnvironments();

    this.receiveSidebarWebViewMessage();

    // Send initial data after a short delay to ensure React has mounted
    setTimeout(() => {
      if (this.sidebarWebview) {
        console.log("Pulse API Client: Sending initial data to sidebar...", {
          history: historyData,
          favorites: favoritesData,
          environments: environmentsData,
        });

        this.sidebarWebview.webview.postMessage({
          messageCategory: CATEGORY.COLLECTION_DATA,
          history: historyData,
          favorites: favoritesData,
          environments: environmentsData,
        });
      }
    }, 100);

    console.log("Pulse API Client: Sidebar webview resolved successfully!");
  }

  postMainWebViewPanelMessage(
    userHistoryData: {
      userRequestHistory: IUserRequestSidebarState[] | undefined;
    },
    userFavoritesData: {
      userRequestHistory: IUserRequestSidebarState[] | undefined;
    },
  ) {
    if (!this.sidebarWebview) return;

    const environmentsData = this.stateManager.getEnvironments();

    this.sidebarWebview.webview.postMessage({
      messageCategory: CATEGORY.COLLECTION_DATA,
      history: userHistoryData,
      favorites: userFavoritesData,
      environments: environmentsData,
    });
  }

  private receiveSidebarWebViewMessage() {
    if (!this.sidebarWebview) return;

    this.sidebarWebview.webview.onDidReceiveMessage(
      async ({
        command,
        id,
        target,
        folder,
        environment,
      }: {
        command: string;
        id: string;
        target: string;
        folder?: string;
        environment?: IEnvironment;
      }) => {
        if (command === COMMAND.START_APP) {
          vscode.commands.executeCommand(COMMAND.MAIN_WEB_VIEW_PANEL);
        } else if (command === COMMAND.ADD_TO_FAVORITES) {
          await this.stateManager.addToFavorites(id);
        } else if (command === COMMAND.REMOVE_FROM_FAVORITES) {
          await this.stateManager.removeFromFavorites(id);
        } else if (command === COMMAND.SAVE_ENVIRONMENT) {
          if (environment) {
            await this.stateManager.saveEnvironment(environment);
            this.postMainWebViewPanelMessage(
              this.stateManager.getExtensionContext(
                COLLECTION.HISTORY_COLLECTION,
              ),
              this.stateManager.getExtensionContext(
                COLLECTION.FAVORITES_COLLECTION,
              ),
            );
          }
        } else if (command === COMMAND.SET_ACTIVE_ENVIRONMENT) {
          await this.stateManager.setActiveEnvironment(id);
          this.postMainWebViewPanelMessage(
            this.stateManager.getExtensionContext(
              COLLECTION.HISTORY_COLLECTION,
            ),
            this.stateManager.getExtensionContext(
              COLLECTION.FAVORITES_COLLECTION,
            ),
          );
        } else if (command === COMMAND.DELETE_ENVIRONMENT) {
          await this.stateManager.deleteEnvironment(id);
          this.postMainWebViewPanelMessage(
            this.stateManager.getExtensionContext(
              COLLECTION.HISTORY_COLLECTION,
            ),
            this.stateManager.getExtensionContext(
              COLLECTION.FAVORITES_COLLECTION,
            ),
          );
        } else if (command === COMMAND.DELETE) {
          if (target === COLLECTION.FAVORITES_COLLECTION) {
            await this.stateManager.unfavoriteInHistory(id);
          }

          await this.stateManager.deleteExtensionContext(target, id);
        } else if (command === COMMAND.DELETE_ALL_COLLECTION) {
          const answer = await vscode.window.showWarningMessage(
            MESSAGE.DELETE_REMINDER,
            MESSAGE.YES,
            MESSAGE.NO,
          );

          if (answer === MESSAGE.YES) {
            if (!this.sidebarWebview) return;

            await this.stateManager.deleteExtensionContext(target);

            this.sidebarWebview.webview.postMessage({
              messageCategory: CATEGORY.DELETION_COMPLETE,
              target,
            });
          }
        } else if (command === COMMAND.UPDATE_FAVORITE_FOLDER) {
          if (folder) {
            await this.stateManager.updateFavoriteFolder(id, folder);
          }
        } else {
          if (!this.mainWebViewPanel) {
            vscode.commands.executeCommand(COMMAND.MAIN_WEB_VIEW_PANEL);
          }

          setTimeout(async () => {
            if (!this.mainWebViewPanel) return;

            this.mainWebViewPanel.webview.postMessage({
              type: COLLECTION.COLLECTION_REQUEST,
            });

            const targetHistory = this.stateManager.getExtensionContext(target);

            const selectedCollection = filterObjectKey(
              targetHistory,
              id,
              COLLECTION.FILTERABLE_OBJECT_KEY,
            );

            if (
              selectedCollection &&
              ["GET", "HEAD"].includes(selectedCollection.method.toUpperCase())
            ) {
              selectedCollection.data = undefined;
            }

            const responseObject = await generateResponseObject(
              selectedCollection,
            );

            if (selectedCollection) {
              this.mainWebViewPanel.webview.postMessage(responseObject);
              this.mainWebViewPanel.webview.postMessage({
                type: TYPE.SIDE_BAR_DATA,
                ...selectedCollection.requestObject,
              });
            }
          }, 1000);
        }
      },
    );
  }
}

export default SidebarWebViewPanel;
