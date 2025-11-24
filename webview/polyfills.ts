import { Buffer } from "buffer";

if (typeof window !== "undefined") {
  // @ts-expect-error: Polyfill for global
  window.global = window;
  // @ts-expect-error: Polyfill for Buffer
  window.Buffer = Buffer;
  // @ts-expect-error: Polyfill for process
  window.process = {
    env: {},
    version: "",
    platform: "browser",
    browser: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    nextTick: (cb: any) => setTimeout(cb, 0),
    cwd: () => "/",
  };
}
