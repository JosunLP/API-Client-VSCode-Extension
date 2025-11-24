import * as vscode from "vscode";

import { BaseWebView } from "./BaseWebView";
import { CATEGORY, COLLECTION, COMMAND, MESSAGE, TYPE } from "./constants";
import ExtentionStateManager from "./ExtensionStateManger";
import { filterObjectKey, generateResponseObject } from "./utils";
import { IProject, IUserRequestSidebarState } from "./utils/type";

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

  constructor(extensionUri: vscode.Uri, stateManager: ExtentionStateManager) {
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
    const projectsData = this.stateManager.getExtensionContext(
      COLLECTION.PROJECTS_COLLECTION,
    );

    this.receiveSidebarWebViewMessage();

    // Send initial data after a short delay to ensure React has mounted
    setTimeout(() => {
      if (this.sidebarWebview) {
        console.log("Pulse API Client: Sending initial data to sidebar...", {
          history: historyData,
          favorites: favoritesData,
          projects: projectsData,
        });

        this.sidebarWebview.webview.postMessage({
          messageCategory: CATEGORY.COLLECTION_DATA,
          history: historyData,
          favorites: favoritesData,
          projects: projectsData,
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

    const projectsData = this.stateManager.getExtensionContext(
      COLLECTION.PROJECTS_COLLECTION,
    );

    this.sidebarWebview.webview.postMessage({
      messageCategory: CATEGORY.COLLECTION_DATA,
      history: userHistoryData,
      favorites: userFavoritesData,
      projects: projectsData,
    });
  }

  /**
   * Sends the current state (history, favorites, projects) to the sidebar webview.
   * This ensures the UI stays in sync with persisted data after backend operations.
   */
  private syncSidebarState() {
    if (!this.sidebarWebview) return;

    const historyData = this.stateManager.getExtensionContext(
      COLLECTION.HISTORY_COLLECTION,
    );
    const favoritesData = this.stateManager.getExtensionContext(
      COLLECTION.FAVORITES_COLLECTION,
    );
    const projectsData = this.stateManager.getExtensionContext(
      COLLECTION.PROJECTS_COLLECTION,
    );

    this.sidebarWebview.webview.postMessage({
      messageCategory: CATEGORY.COLLECTION_DATA,
      history: historyData,
      favorites: favoritesData,
      projects: projectsData,
    });
  }

  private receiveSidebarWebViewMessage() {
    if (!this.sidebarWebview) return;

    this.sidebarWebview.webview.onDidReceiveMessage(
      async ({
        command,
        id,
        target,
        name,
        favoriteId,
        projectId,
      }: {
        command: string;
        id?: string;
        target?: string;
        name?: string;
        favoriteId?: string;
        projectId?: string | null;
      }) => {
        if (command === COMMAND.START_APP) {
          vscode.commands.executeCommand(COMMAND.MAIN_WEB_VIEW_PANEL);
        } else if (command === "ADD_PROJECT") {
          // Add new project
          const projects = (this.stateManager.getExtensionContext(
            COLLECTION.PROJECTS_COLLECTION,
          ).userRequestHistory as IProject[] | undefined) || [];
          const newProject: IProject = {
            id: `project-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
            name: name || "New Project",
            createdTime: Date.now(),
            collapsed: false,
          };
          await this.stateManager.addExtensionContext(
            COLLECTION.PROJECTS_COLLECTION,
            { history: [...projects, newProject] },
          );
          // Sync state back to frontend
          this.syncSidebarState();
        } else if (command === "UPDATE_PROJECT") {
          // Update project name
          const projects = (this.stateManager.getExtensionContext(
            COLLECTION.PROJECTS_COLLECTION,
          ).userRequestHistory as IProject[] | undefined) || [];
          const updatedProjects = projects.map((p) =>
            p.id === id ? { ...p, name: name || p.name } : p,
          );
          await this.stateManager.addExtensionContext(
            COLLECTION.PROJECTS_COLLECTION,
            { history: updatedProjects },
          );
          // Sync state back to frontend
          this.syncSidebarState();
        } else if (command === "DELETE_PROJECT") {
          // Delete project and unassign favorites
          const projects = (this.stateManager.getExtensionContext(
            COLLECTION.PROJECTS_COLLECTION,
          ).userRequestHistory as IProject[] | undefined) || [];
          const updatedProjects = projects.filter((p) => p.id !== id);
          await this.stateManager.addExtensionContext(
            COLLECTION.PROJECTS_COLLECTION,
            { history: updatedProjects },
          );
          
          // Unassign favorites from deleted project
          const favorites = (this.stateManager.getExtensionContext(
            COLLECTION.FAVORITES_COLLECTION,
          ).userRequestHistory as IUserRequestSidebarState[] | undefined) || [];
          const updatedFavorites = favorites.map((f) =>
            f.projectId === id ? { ...f, projectId: undefined } : f,
          );
          await this.stateManager.addExtensionContext(
            COLLECTION.FAVORITES_COLLECTION,
            { history: updatedFavorites },
          );
          // Sync state back to frontend
          this.syncSidebarState();
        } else if (command === "TOGGLE_PROJECT_COLLAPSE") {
          // Toggle project collapse state
          const projects = (this.stateManager.getExtensionContext(
            COLLECTION.PROJECTS_COLLECTION,
          ).userRequestHistory as IProject[] | undefined) || [];
          const updatedProjects = projects.map((p) =>
            p.id === id ? { ...p, collapsed: !p.collapsed } : p,
          );
          await this.stateManager.addExtensionContext(
            COLLECTION.PROJECTS_COLLECTION,
            { history: updatedProjects },
          );
          // Sync state back to frontend
          this.syncSidebarState();
        } else if (command === "ASSIGN_TO_PROJECT") {
          // Assign favorite to project
          const favorites = (this.stateManager.getExtensionContext(
            COLLECTION.FAVORITES_COLLECTION,
          ).userRequestHistory as IUserRequestSidebarState[] | undefined) || [];
          const updatedFavorites = favorites.map((f) =>
            f.id === favoriteId ? { ...f, projectId: projectId || undefined } : f,
          );
          await this.stateManager.addExtensionContext(
            COLLECTION.FAVORITES_COLLECTION,
            { history: updatedFavorites },
          );
          // Sync state back to frontend
          this.syncSidebarState();
        } else if (command === COMMAND.ADD_TO_FAVORITES) {
          await this.stateManager.updateExtensionContext(
            COLLECTION.HISTORY_COLLECTION,
            id,
            COMMAND.ADD,
          );
        } else if (command === COMMAND.REMOVE_FROM_FAVORITES) {
          await this.stateManager.updateExtensionContext(
            COLLECTION.HISTORY_COLLECTION,
            id,
          );

          await this.stateManager.deleteExtensionContext(
            COLLECTION.FAVORITES_COLLECTION,
            id,
          );
        } else if (command === COMMAND.DELETE) {
          if (target === COLLECTION.FAVORITES_COLLECTION) {
            await this.stateManager.updateExtensionContext(
              COLLECTION.HISTORY_COLLECTION,
              id,
            );
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
