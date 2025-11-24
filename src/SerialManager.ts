// import type { SerialPort } from "serialport";
import * as vscode from "vscode";

export class SerialManager {
  private port: any | null = null;
  private panel: vscode.WebviewPanel;

  constructor(panel: vscode.WebviewPanel) {
    this.panel = panel;
  }

  public async connect(path: string, baudRate: number = 9600) {
    if (this.port) {
      this.disconnect();
    }

    // Parse path for optional baudrate if not provided explicitly or if path contains it (e.g. COM3:115200)
    let portPath = path;
    let portBaudRate = baudRate;

    if (path.includes(":")) {
      const parts = path.split(":");
      portPath = parts[0];
      const parsedBaud = parseInt(parts[1]);
      if (!isNaN(parsedBaud)) {
        portBaudRate = parsedBaud;
      }
    }

    try {
      const moduleName = "serialport";
      const { SerialPort } = await import(moduleName);
      this.port = new SerialPort({
        path: portPath,
        baudRate: portBaudRate,
        autoOpen: false,
      });

      this.port.open((err) => {
        if (err) {
          this.postMessage("socket-error", { message: err.message });
        } else {
          this.postMessage("socket-connected", {
            type: "serial",
            path: portPath,
            baudRate: portBaudRate,
          });
        }
      });

      this.port.on("close", () => {
        this.postMessage("socket-disconnected");
      });

      this.port.on("error", (err) => {
        this.postMessage("socket-error", { message: err.message });
      });

      this.port.on("data", (data) => {
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
    if (this.port && this.port.isOpen) {
      this.port.close();
      this.port = null;
    }
  }

  public send(data: unknown) {
    if (this.port && this.port.isOpen) {
      const message =
        typeof data === "object" ? JSON.stringify(data) : String(data);
      this.port.write(message, (err) => {
        if (err) {
          this.postMessage("socket-error", { message: err.message });
        }
      });
    } else {
      this.postMessage("socket-error", {
        message: "Serial port not connected",
      });
    }
  }

  private postMessage(type: string, payload?: unknown) {
    this.panel.webview.postMessage({
      type: type,
      payload: payload,
    });
  }
}
