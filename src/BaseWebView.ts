import * as vscode from "vscode";

import { getNonce } from "./utils";

/**
 * Base class for WebViews to share common logic like HTML generation.
 * Follows DRY and OOP principles.
 */
export abstract class BaseWebView {
  constructor(protected readonly extensionUri: vscode.Uri) {}

  /**
   * Generates the HTML content for the webview.
   * @param webview The webview instance.
   * @param scriptName The name of the script file to load (e.g., 'bundle.js').
   * @returns The HTML string.
   */
  protected getHtmlForWebview(
    webview: vscode.Webview,
    scriptName: string,
  ): string {
    const scriptPath = vscode.Uri.joinPath(
      this.extensionUri,
      "dist",
      scriptName,
    );
    const resetCssPath = vscode.Uri.joinPath(
      this.extensionUri,
      "media",
      "reset.css",
    );
    const vscodeStylesCssPath = vscode.Uri.joinPath(
      this.extensionUri,
      "media",
      "vscode.css",
    );

    const resetCssSrc = webview.asWebviewUri(resetCssPath);
    const mainStylesCssSrc = webview.asWebviewUri(vscodeStylesCssPath);
    const scriptSrc = webview.asWebviewUri(scriptPath);
    const nonce = getNonce();

    // Content Security Policy (CSP)
    // Allow scripts with the specific nonce, and styles from the extension.
    const csp = `default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}'; img-src ${webview.cspSource} https:; font-src ${webview.cspSource};`;

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="Content-Security-Policy" content="${csp}">
          <title>REST API Client</title>
          <link href="${resetCssSrc}" rel="stylesheet">
          <link href="${mainStylesCssSrc}" rel="stylesheet">
        </head>
        <body>
          <div id="root"></div>
          <script nonce="${nonce}">
            let vscode;
            if (typeof acquireVsCodeApi !== "undefined") {
              vscode = acquireVsCodeApi();
            }
          </script>
          <script type="module" src="${scriptSrc}" nonce="${nonce}"></script>
        </body>
      </html>`;
  }
}
