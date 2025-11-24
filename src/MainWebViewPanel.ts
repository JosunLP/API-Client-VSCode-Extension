import { v4 as uuidv4 } from "uuid";
import * as vscode from "vscode";

import { BaseWebView } from "./BaseWebView";
import { COLLECTION, COMMAND, MESSAGE, NAME, TYPE } from "./constants";
import ExtentionStateManager from "./ExtensionStateManger";
import { SerialManager } from "./SerialManager";
import SidebarWebViewPanel from "./SidebarWebViewPanel";
import { SocketIOManager } from "./SocketIOManager";
import { generateResponseObject, getBody, getHeaders, getUrl } from "./utils";
import { IRequestHeaderInformation, IRequestObjectType } from "./utils/type";
import { WebSocketManager } from "./WebSocketManager";

/**
 * Manages the main webview panel for the API Client.
 */
class MainWebViewPanel extends BaseWebView {
  private url: string = "";
  private body: string | FormData | URLSearchParams = "";
  private method: string = "";
  private headers: IRequestHeaderInformation = { key: "" };
  public mainPanel: vscode.WebviewPanel | null = null;
  // private extensionUri; // Handled by BaseWebView
  public stateManager;
  public sidebarWebViewPanel;
  private socketIOManager: SocketIOManager | null = null;
  private webSocketManager: WebSocketManager | null = null;
  private serialManager: SerialManager | null = null;

  constructor(
    extensionUri: vscode.Uri,
    stateManager: ExtentionStateManager,
    sidebarWebViewPanel: SidebarWebViewPanel,
  ) {
    super(extensionUri);
    this.stateManager = stateManager;
    this.sidebarWebViewPanel = sidebarWebViewPanel;
  }

  initializeWebView() {
    this.mainPanel = vscode.window.createWebviewPanel(
      TYPE.WEB_VIEW_TYPE,
      NAME.MAIN_PANEL_NAME,
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          vscode.Uri.joinPath(this.extensionUri, "media"),
          vscode.Uri.joinPath(this.extensionUri, "dist"),
        ],
      },
    );

    this.socketIOManager = new SocketIOManager(this.mainPanel);
    this.webSocketManager = new WebSocketManager(this.mainPanel);
    this.serialManager = new SerialManager(this.mainPanel);

    this.mainPanel.webview.html = this.getHtmlForWebview(
      this.mainPanel.webview,
      "bundle.js",
    );

    this.mainPanel.iconPath = vscode.Uri.joinPath(
      this.extensionUri,
      "icons/images/icon.png",
    );

    this.receiveWebviewMessage();

    return this.mainPanel;
  }

  private receiveWebviewMessage() {
    if (!this.mainPanel) return;

    this.mainPanel.webview.onDidReceiveMessage(async (message) => {
      const {
        requestMethod,
        requestUrl,
        authOption,
        authData,
        bodyOption,
        bodyRawOption,
        bodyRawData,
        keyValueTableData,
        command,
        socketEvent,
        socketData,
      } = message;

      switch (command) {
        case COMMAND.ALERT_COPY:
          vscode.window.showInformationMessage(MESSAGE.COPY_SUCCESFUL_MESSAGE);
          return;

        case COMMAND.SOCKET_CONNECT:
          if (requestUrl) {
            if (requestMethod === "SOCKET") {
              const headers = getHeaders(
                keyValueTableData,
                authOption,
                authData,
              );
              const options = {
                extraHeaders: headers,
                auth: authData,
              };
              this.socketIOManager?.connect(requestUrl, options);
            } else if (requestMethod === "WEBSOCKET") {
              this.webSocketManager?.connect(requestUrl);
            } else if (requestMethod === "SERIAL") {
              this.serialManager?.connect(requestUrl);
            }
          } else {
            vscode.window.showWarningMessage(MESSAGE.WARNING_MESSAGE);
          }
          return;

        case COMMAND.SOCKET_DISCONNECT:
          if (requestMethod === "SOCKET") {
            this.socketIOManager?.disconnect();
          } else if (requestMethod === "WEBSOCKET") {
            this.webSocketManager?.disconnect();
          } else if (requestMethod === "SERIAL") {
            this.serialManager?.disconnect();
          }
          return;

        case COMMAND.SOCKET_EMIT:
          if (requestMethod === "SOCKET") {
            if (socketEvent) {
              this.socketIOManager?.emit(socketEvent, socketData);
            }
          } else if (requestMethod === "WEBSOCKET") {
            this.webSocketManager?.send(socketData);
          } else if (requestMethod === "SERIAL") {
            this.serialManager?.send(socketData);
          }
          return;
      }

      if (requestUrl.length === 0) {
        vscode.window.showWarningMessage(MESSAGE.WARNING_MESSAGE);

        return;
      }
      const requestObject = {
        requestMethod,
        requestUrl,
        authOption,
        authData,
        bodyOption,
        bodyRawOption,
        bodyRawData,
        keyValueTableData,
        command,
      };
      this.url = getUrl(requestUrl);
      this.method = requestMethod;
      this.headers = getHeaders(keyValueTableData, authOption, authData);

      // @ts-expect-error: getBody returns a type that might not match this.body exactly but is handled at runtime
      this.body = getBody(
        keyValueTableData,
        bodyOption,
        bodyRawOption,
        bodyRawData,
      );

      await this.postWebviewMessage(requestObject);
    });
  }

  private async postWebviewMessage(requestObject: IRequestObjectType) {
    const { userRequestHistory } = this.stateManager.getExtensionContext(
      COLLECTION.HISTORY_COLLECTION,
    );

    const axiosConfiguration = {
      url: this.url,
      method: this.method,
      headers: this.headers,
      data: this.body,
      responseType: TYPE.TEXT,
    };

    const responseObject = await generateResponseObject(axiosConfiguration);
    const requestedTime = new Date().getTime();

    if (responseObject && responseObject.type !== MESSAGE.ERROR) {
      if (!userRequestHistory) {
        await this.stateManager.addExtensionContext(
          COLLECTION.HISTORY_COLLECTION,
          {
            history: [
              {
                ...axiosConfiguration,
                requestedTime,
                favoritedTime: null,
                isUserFavorite: false,
                id: uuidv4(),
                requestObject,
              },
            ],
          },
        );
      } else {
        if (!userRequestHistory) return;

        await this.stateManager.addExtensionContext(
          COLLECTION.HISTORY_COLLECTION,
          {
            history: [
              {
                ...axiosConfiguration,
                requestedTime,
                favoritedTime: null,
                isUserFavorite: false,
                id: uuidv4(),
                requestObject,
              },
              ...userRequestHistory,
            ],
          },
        );
      }
    }

    if (this.mainPanel) {
      console.log(
        this.stateManager.getExtensionContext(COLLECTION.HISTORY_COLLECTION),
        this.stateManager.getExtensionContext(COLLECTION.FAVORITES_COLLECTION),
      );
      this.mainPanel.webview.postMessage(responseObject);
      this.sidebarWebViewPanel.postMainWebViewPanelMessage(
        this.stateManager.getExtensionContext(COLLECTION.HISTORY_COLLECTION),
        this.stateManager.getExtensionContext(COLLECTION.FAVORITES_COLLECTION),
      );
    }
  }
}

export default MainWebViewPanel;
