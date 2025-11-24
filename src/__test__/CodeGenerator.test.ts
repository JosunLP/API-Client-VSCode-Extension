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

  describe("generateAxios", () => {
    it("should generate correct axios snippet", () => {
      const axiosCode = CodeGenerator.generateAxios(url, method, headers, body);
      expect(axiosCode).toContain(`const axios = require('axios');`);
      expect(axiosCode).toContain(`"url": "${url}"`);
      expect(axiosCode).toContain(`"method": "POST"`);
      expect(axiosCode).toContain(`"Content-Type": "application/json"`);
      // Axios data can be object or string, here we expect object since body is JSON
      expect(axiosCode).toContain(`"data": {`);
      expect(axiosCode).toContain(`"name": "John Doe"`);
    });
  });

  describe("generateGo", () => {
    it("should generate correct go snippet", () => {
      const goCode = CodeGenerator.generateGo(url, method, headers, body);
      expect(goCode).toContain(`package main`);
      expect(goCode).toContain(`"net/http"`);
      expect(goCode).toContain(`url := "${url}"`);
      expect(goCode).toContain(`method := "POST"`);
      expect(goCode).toContain(
        `payload := strings.NewReader("{\\"name\\":\\"John Doe\\",\\"age\\":30}")`,
      );
      expect(goCode).toContain(
        `req.Header.Add("Content-Type", "application/json")`,
      );
    });
  });

  describe("generateCSharp", () => {
    it("should generate correct c# snippet", () => {
      const csharpCode = CodeGenerator.generateCSharp(
        url,
        method,
        headers,
        body,
      );
      expect(csharpCode).toContain(`using System.Net.Http;`);
      expect(csharpCode).toContain(`new HttpMethod("POST")`);
      expect(csharpCode).toContain(`"${url}"`);
      expect(csharpCode).toContain(
        `request.Headers.TryAddWithoutValidation("Authorization", "Bearer token123")`,
      );
      expect(csharpCode).toContain(
        `new StringContent("{\\"name\\":\\"John Doe\\",\\"age\\":30}")`,
      );
      expect(csharpCode).toContain(
        `MediaTypeHeaderValue.Parse("application/json")`,
      );
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
