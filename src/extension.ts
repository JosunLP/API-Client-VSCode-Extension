import * as vscode from "vscode";

import { ExtensionController } from "./ExtensionController";

export async function activate(context: vscode.ExtensionContext) {
  const controller = new ExtensionController(context);
  await controller.initialize();
}
