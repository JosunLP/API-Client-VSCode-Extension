import * as vscode from "vscode";
// import WebSocket from "ws";

export class WebSocketManager {
  private ws: any | null = null;
  private panel: vscode.WebviewPanel;

  constructor(panel: vscode.WebviewPanel) {
    this.panel = panel;
  }

  public async connect(url: string) {
    if (this.ws) {
      this.disconnect();
    }

    try {
      const { default: WebSocket } = await import("ws");
      this.ws = new WebSocket(url);

      this.ws.on("open", () => {
        this.postMessage("socket-connected", { type: "websocket" });
      });

      this.ws.on("close", (code, reason) => {
        this.postMessage("socket-disconnected", {
          code,
          reason: reason.toString(),
        });
      });

      this.ws.on("error", (err) => {
        this.postMessage("socket-error", { message: err.message });
      });

      this.ws.on("message", (data) => {
        this.postMessage("socket-event", { data: data.toString() });
      });
    } catch (error) {
      if (error instanceof Error) {
        this.postMessage("socket-error", { message: error.message });
      } else {
        this.postMessage("socket-error", { message: String(error) });
      }
    }
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  public send(data: unknown) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message =
        typeof data === "object" ? JSON.stringify(data) : String(data);
      this.ws.send(message);
    } else {
      this.postMessage("socket-error", { message: "WebSocket not connected" });
    }
  }

  private postMessage(type: string, payload?: unknown) {
    this.panel.webview.postMessage({
      type: type,
      payload: payload,
    });
  }
}
