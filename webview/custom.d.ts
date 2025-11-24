declare module "*.svg" {
  const content: any;

  export default content;
}

declare module "*.png" {
  const content: any;

  export default content;
}

interface VsCodeApi {
  postMessage(message: any): void;
  getState(): any;
  setState(state: any): void;
}

declare global {
  interface Window {
    vscode: VsCodeApi;
  }
}

declare const vscode: VsCodeApi;
