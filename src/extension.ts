import * as vscode from "vscode";

import { COLLECTION, COMMAND } from "./constants";
import ExtentionStateManager from "./ExtensionStateManger";
import MainWebViewPanel from "./MainWebViewPanel";
import SidebarWebViewPanel from "./SidebarWebViewPanel";

export async function activate(context: vscode.ExtensionContext) {
  console.log("Pulse API Client: Activating extension...");
  
  // Initialize state manager immediately for data integrity
  const StateManager = new ExtentionStateManager(context);
  
  // Ensure collections exist but don't initialize heavy providers yet
  if (!StateManager.getExtensionContext(COLLECTION.HISTORY_COLLECTION)) {
    await StateManager.addExtensionContext(COLLECTION.HISTORY_COLLECTION, {
      history: [],
    });
  }

  if (!StateManager.getExtensionContext(COLLECTION.FAVORITES_COLLECTION)) {
    await StateManager.addExtensionContext(COLLECTION.FAVORITES_COLLECTION, {
      history: [],
    });
  }

  if (!StateManager.getExtensionContext(COLLECTION.PROJECTS_COLLECTION)) {
    await StateManager.addExtensionContext(COLLECTION.PROJECTS_COLLECTION, {
      history: [],
    });
  }

  // Lazy initialization of providers - only create when needed
  // This defers heavyweight initialization until the user actually
  // opens the sidebar or main panel, improving extension startup time
  let SidebarWebViewProvider: SidebarWebViewPanel | null = null;
  let MainWebViewProvider: MainWebViewPanel | null = null;
  let currentPanel: vscode.WebviewPanel | null = null;

  const getSidebarProvider = () => {
    if (!SidebarWebViewProvider) {
      SidebarWebViewProvider = new SidebarWebViewPanel(
        context.extensionUri,
        StateManager,
      );
    }
    return SidebarWebViewProvider;
  };

  const getMainProvider = () => {
    if (!MainWebViewProvider) {
      const sidebar = getSidebarProvider();
      MainWebViewProvider = new MainWebViewPanel(
        context.extensionUri,
        StateManager,
        sidebar,
      );
    }
    return MainWebViewProvider;
  };

  // Register sidebar provider lazily
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      COMMAND.SIDEBAR_WEB_VIEW_PANEL,
      {
        resolveWebviewView(webviewView: vscode.WebviewView) {
          return getSidebarProvider().resolveWebviewView(webviewView);
        },
      } as vscode.WebviewViewProvider,
      { webviewOptions: { retainContextWhenHidden: true } },
    ),
  );

  // Register main command
  context.subscriptions.push(
    vscode.commands.registerCommand(COMMAND.MAIN_WEB_VIEW_PANEL, () => {
      if (currentPanel) {
        currentPanel.reveal(vscode.ViewColumn.One);
      } else {
        const mainProvider = getMainProvider();
        currentPanel = mainProvider.initializeWebView();

        const sidebar = getSidebarProvider();
        sidebar.mainWebViewPanel = mainProvider.mainPanel;

        if (mainProvider.mainPanel) {
          mainProvider.mainPanel.onDidDispose(() => {
            sidebar.mainWebViewPanel = null;
            currentPanel = null;
          }, null);
        }
      }
    }),
  );

  console.log("Pulse API Client: Extension activated successfully!");
}
