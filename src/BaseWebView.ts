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
    // Added 'unsafe-eval' to script-src to allow Monaco Editor to work if needed (though ideally avoid it).
    // Added https: to script-src to allow loading external scripts if necessary (like Monaco from CDN).
    // Added blob: to script-src and worker-src to allow Monaco Editor to create web workers.
    // Added https: to style-src to allow loading external styles (like Monaco from CDN).
    // Added data: to font-src to allow loading fonts from data URIs (Monaco uses this).
    const csp = `default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline' https:; script-src 'nonce-${nonce}' https: 'unsafe-eval' blob:; worker-src blob:; img-src ${webview.cspSource} https: data:; font-src ${webview.cspSource} https: data:; connect-src https:;`;

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="Content-Security-Policy" content="${csp}">
          <title>Pulse API Client</title>
          <link href="${resetCssSrc}" rel="stylesheet">
          <link href="${mainStylesCssSrc}" rel="stylesheet">
          <style>
            #root {
              width: 100%;
              height: 100%;
              min-height: 100vh;
            }
          </style>
        </head>
        <body>
          <div id="root"></div>
          <script nonce="${nonce}">
            console.log("Inline script executing...");
            window.vscode = acquireVsCodeApi();
            console.log("vscode API acquired:", window.vscode);

            // Log when DOM is ready
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', () => {
                console.log("DOM Content Loaded");
              });
            } else {
              console.log("DOM already loaded");
            }
          </script>
          <script type="module" src="${scriptSrc}" nonce="${nonce}"></script>
        </body>
      </html>`;
  }
}
