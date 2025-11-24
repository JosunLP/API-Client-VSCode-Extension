import { io, Socket } from "socket.io-client";
import * as vscode from "vscode";

/**
 * Manages WebSocket connections.
 * Follows OOP principles to encapsulate socket logic.
 */
export class SocketIOManager {
  private socket: Socket | null = null;
  private panel: vscode.WebviewPanel;

  constructor(panel: vscode.WebviewPanel) {
    this.panel = panel;
  }

  /**
   * Connects to a socket endpoint.
   * @param url The URL to connect to.
   * @param options Optional connection options.
   */
  public connect(url: string, options?: object) {
    if (this.socket) {
      this.disconnect();
    }

    try {
      this.socket = io(url, options);

      this.socket.on("connect", () => {
        this.postMessage("socket-connected", { id: this.socket?.id });
      });

      this.socket.on("disconnect", () => {
        this.postMessage("socket-disconnected");
      });

      this.socket.on("connect_error", (err) => {
        this.postMessage("socket-error", { message: err.message });
      });

      // Listen to all events (wildcard equivalent not directly available in standard socket.io client without plugin,
      // but we can listen to specific events if user provides them, or just generic 'message' if supported)
      // For generic debugging, we might need a way to capture all events.
      // socket.io-client doesn't support wildcard listening out of the box easily without a plugin.
      // For now, let's assume standard 'message' event or specific events.

      this.socket.onAny((event, ...args) => {
        this.postMessage("socket-event", { event, args });
      });
    } catch (error) {
      if (error instanceof Error) {
        this.postMessage("socket-error", { message: error.message });
      } else {
        this.postMessage("socket-error", { message: String(error) });
      }
    }
  }

  /**
   * Disconnects the current socket.
   */
  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Emits an event to the server.
   * @param event The event name.
   * @param data The data to send.
   */
  public emit(event: string, data: unknown) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
    } else {
      this.postMessage("socket-error", { message: "Socket not connected" });
    }
  }

  private postMessage(type: string, payload?: unknown) {
    this.panel.webview.postMessage({
      type: type,
      payload: payload,
    });
  }
}
