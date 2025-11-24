import { describe, expect, it } from "vitest";

import { CodeGenerator } from "../utils/CodeGenerator";

describe("CodeGenerator", () => {
  const url = "https://api.example.com/users";
  const method = "POST";
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer token123",
  };
  const body = JSON.stringify({ name: "John Doe", age: 30 });

  describe("generateCurl", () => {
    it("should generate correct cURL command", () => {
      const curl = CodeGenerator.generateCurl(url, method, headers, body);
      expect(curl).toContain(`curl -X POST "${url}"`);
      expect(curl).toContain(`-H "Content-Type: application/json"`);
      expect(curl).toContain(`-H "Authorization: Bearer token123"`);
      expect(curl).toContain(`-d '${body}'`);
    });

    it("should handle GET request without body", () => {
      const curl = CodeGenerator.generateCurl(url, "GET", headers);
      expect(curl).toContain(`curl -X GET "${url}"`);
      expect(curl).not.toContain(`-d`);
    });
  });

  describe("generateFetch", () => {
    it("should generate correct fetch snippet", () => {
      const fetchCode = CodeGenerator.generateFetch(url, method, headers, body);
      expect(fetchCode).toContain(`fetch("${url}"`);
      expect(fetchCode).toContain(`"method": "POST"`);
      expect(fetchCode).toContain(`"Content-Type": "application/json"`);
      expect(fetchCode).toContain(`"body": "${body.replace(/"/g, '\\"')}"`);
    });
  });

  describe("generatePythonRequests", () => {
    it("should generate correct python requests snippet", () => {
      const pythonCode = CodeGenerator.generatePythonRequests(
        url,
        method,
        headers,
        body,
      );
      expect(pythonCode).toContain(`import requests`);
      expect(pythonCode).toContain(`url = "${url}"`);
      expect(pythonCode).toContain(`"Content-Type": "application/json"`);
      expect(pythonCode).toContain(`json=payload`);
    });
  });
});
