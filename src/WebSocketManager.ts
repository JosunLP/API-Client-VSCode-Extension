import * as vscode from "vscode";
import type { WebSocket } from "ws";

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private panel: vscode.WebviewPanel;

  constructor(panel: vscode.WebviewPanel) {
    this.panel = panel;
  }

  public async connect(url: string, headers?: Record<string, string>) {
    if (this.ws) {
      this.disconnect();
    }

    try {
      const { default: WebSocket } = await import("ws");
      // Pass headers if provided
      const options = headers ? { headers } : undefined;
      this.ws = new WebSocket(url, options);

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

      this.ws.on("message", (data, isBinary) => {
        // Handle binary data
        const messageData = isBinary ? data.toString("hex") : data.toString();
        this.postMessage("socket-event", {
          data: messageData,
          isBinary,
        });
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

  public async send(data: unknown) {
    const { default: WebSocket } = await import("ws");
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
