import * as vscode from "vscode";

import { COLLECTION, COMMAND } from "./constants";
import ExtensionStateManager from "./ExtensionStateManager";
import MainWebViewPanel from "./MainWebViewPanel";
import SidebarWebViewPanel from "./SidebarWebViewPanel";

/**
 * Controller for the extension.
 * Manages the lifecycle of the extension, including state, webviews, and commands.
 */
export class ExtensionController {
  private context: vscode.ExtensionContext;
  private stateManager: ExtensionStateManager;
  private sidebarWebViewPanel: SidebarWebViewPanel;
  private mainWebViewPanel: MainWebViewPanel | null = null;
  private currentPanel: vscode.WebviewPanel | null = null;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.stateManager = new ExtensionStateManager(context);
    this.sidebarWebViewPanel = new SidebarWebViewPanel(
      context.extensionUri,
      this.stateManager,
    );
  }

  /**
   * Initializes the extension.
   */
  public async initialize() {
    await this.initializeState();
    this.registerProviders();
    this.registerCommands();
  }

  /**
   * Initializes the global state if it doesn't exist.
   */
  private async initializeState() {
    const historyContext = this.stateManager.getExtensionContext(
      COLLECTION.HISTORY_COLLECTION,
    );
    if (!historyContext.userRequestHistory) {
      await this.stateManager.addExtensionContext(
        COLLECTION.HISTORY_COLLECTION,
        {
          history: [],
        },
      );
    }

    const favoritesContext = this.stateManager.getExtensionContext(
      COLLECTION.FAVORITES_COLLECTION,
    );
    if (!favoritesContext.userRequestHistory) {
      await this.stateManager.addExtensionContext(
        COLLECTION.FAVORITES_COLLECTION,
        {
          history: [],
        },
      );
    }
  }

  /**
   * Registers the webview view providers.
   */
  private registerProviders() {
    this.context.subscriptions.push(
      vscode.window.registerWebviewViewProvider(
        COMMAND.SIDEBAR_WEB_VIEW_PANEL,
        this.sidebarWebViewPanel,
        { webviewOptions: { retainContextWhenHidden: true } },
      ),
    );
  }

  /**
   * Registers the extension commands.
   */
  private registerCommands() {
    this.context.subscriptions.push(
      vscode.commands.registerCommand(COMMAND.MAIN_WEB_VIEW_PANEL, () => {
        this.handleMainWebViewPanelCommand();
      }),
    );
  }

  /**
   * Handles the command to open or reveal the main webview panel.
   */
  private handleMainWebViewPanelCommand() {
    if (this.currentPanel) {
      this.currentPanel.reveal(vscode.ViewColumn.One);
    } else {
      if (!this.mainWebViewPanel) {
        this.mainWebViewPanel = new MainWebViewPanel(
          this.context.extensionUri,
          this.stateManager,
          this.sidebarWebViewPanel,
        );
      }
      this.currentPanel = this.mainWebViewPanel.initializeWebView();

      this.sidebarWebViewPanel.mainWebViewPanel =
        this.mainWebViewPanel.mainPanel;

      if (this.mainWebViewPanel.mainPanel) {
        this.mainWebViewPanel.mainPanel.onDidDispose(() => {
          this.sidebarWebViewPanel.mainWebViewPanel = null;
          this.currentPanel = null;
        }, null);
      }
    }
  }
}
