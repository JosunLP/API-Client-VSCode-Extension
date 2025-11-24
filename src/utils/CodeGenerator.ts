import { IRequestHeaderInformation } from "./type";

export class CodeGenerator {
  /**
   * Generates a cURL command for the request.
   */
  static generateCurl(
    url: string,
    method: string,
    headers: IRequestHeaderInformation,
    body?: string,
  ): string {
    let command = `curl -X ${method.toUpperCase()} "${url}"`;

    // Add headers
    for (const [key, value] of Object.entries(headers)) {
      if (key && value) {
        command += ` \\\n  -H "${key}: ${value}"`;
      }
    }

    // Add body
    if (
      body &&
      method.toUpperCase() !== "GET" &&
      method.toUpperCase() !== "HEAD"
    ) {
      // Escape single quotes for shell
      const escapedBody = body.replace(/'/g, "'\\''");
      command += ` \\\n  -d '${escapedBody}'`;
    }

    return command;
  }

  /**
   * Generates a JavaScript Fetch code snippet.
   */
  static generateFetch(
    url: string,
    method: string,
    headers: IRequestHeaderInformation,
    body?: string,
  ): string {
    const options: {
      method: string;
      headers: Record<string, string>;
      body?: string;
    } = {
      method: method.toUpperCase(),
      headers: headers,
    };

    if (
      body &&
      method.toUpperCase() !== "GET" &&
      method.toUpperCase() !== "HEAD"
    ) {
      options.body = body;
    }

    // Filter out empty headers
    const cleanHeaders: Record<string, string> = {};
    for (const [key, value] of Object.entries(headers)) {
      if (key && value) {
        cleanHeaders[key] = value;
      }
    }
    options.headers = cleanHeaders;

    // If body is JSON, we might want to format it, but for now keep it as string
    // If the body is a string that looks like JSON, we could parse it, but passing it as string is safer for exact representation.

    return `fetch("${url}", ${JSON.stringify(options, null, 2)});`;
  }

  /**
   * Generates a JavaScript Axios code snippet.
   */
  static generateAxios(
    url: string,
    method: string,
    headers: IRequestHeaderInformation,
    body?: string,
  ): string {
    const options: {
      method: string;
      url: string;
      headers: Record<string, string>;
      data?: unknown;
    } = {
      method: method.toUpperCase(),
      url: url,
      headers: {},
    };

    // Filter out empty headers
    for (const [key, value] of Object.entries(headers)) {
      if (key && value) {
        options.headers[key] = value;
      }
    }

    if (
      body &&
      method.toUpperCase() !== "GET" &&
      method.toUpperCase() !== "HEAD"
    ) {
      try {
        options.data = JSON.parse(body);
      } catch {
        options.data = body;
      }
    }

    return `const axios = require('axios');\n\naxios(${JSON.stringify(
      options,
      null,
      2,
    )})\n  .then(function (response) {\n    console.log(JSON.stringify(response.data));\n  })\n  .catch(function (error) {\n    console.log(error);\n  });`;
  }

  /**
   * Generates a Go code snippet.
   */
  static generateGo(
    url: string,
    method: string,
    headers: IRequestHeaderInformation,
    body?: string,
  ): string {
    let code = `package main\n\nimport (\n\t"fmt"\n\t"io/ioutil"\n\t"net/http"\n\t"strings"\n)\n\nfunc main() {\n\n\turl := "${url}"\n\tmethod := "${method.toUpperCase()}"\n\n`;

    if (
      body &&
      method.toUpperCase() !== "GET" &&
      method.toUpperCase() !== "HEAD"
    ) {
      // Escape double quotes
      const escapedBody = body.replace(/"/g, '\\"');
      code += `\tpayload := strings.NewReader("${escapedBody}")\n\n`;
      code += `\tclient := &http.Client {}\n`;
      code += `\treq, err := http.NewRequest(method, url, payload)\n`;
    } else {
      code += `\tclient := &http.Client {}\n`;
      code += `\treq, err := http.NewRequest(method, url, nil)\n`;
    }

    code += `\n\tif err != nil {\n\t\tfmt.Println(err)\n\t\treturn\n\t}\n`;

    for (const [key, value] of Object.entries(headers)) {
      if (key && value) {
        code += `\treq.Header.Add("${key}", "${value}")\n`;
      }
    }

    code += `\n\tres, err := client.Do(req)\n\tif err != nil {\n\t\tfmt.Println(err)\n\t\treturn\n\t}\n\tdefer res.Body.Close()\n\n\tbody, err := ioutil.ReadAll(res.Body)\n\tif err != nil {\n\t\tfmt.Println(err)\n\t\treturn\n\t}\n\tfmt.Println(string(body))\n}`;

    return code;
  }

  /**
   * Generates a C# HttpClient code snippet.
   */
  static generateCSharp(
    url: string,
    method: string,
    headers: IRequestHeaderInformation,
    body?: string,
  ): string {
    let code = `using System;\nusing System.Net.Http;\nusing System.Text;\nusing System.Threading.Tasks;\n\nnamespace PulseApiClient\n{\n    class Program\n    {\n        static async Task Main(string[] args)\n        {\n            var client = new HttpClient();\n            var request = new HttpRequestMessage(new HttpMethod("${method.toUpperCase()}"), "${url}");\n`;

    for (const [key, value] of Object.entries(headers)) {
      if (key && value) {
        code += `            request.Headers.TryAddWithoutValidation("${key}", "${value}");\n`;
      }
    }

    if (
      body &&
      method.toUpperCase() !== "GET" &&
      method.toUpperCase() !== "HEAD"
    ) {
      // Escape double quotes
      const escapedBody = body.replace(/"/g, '\\"');
      code += `\n            request.Content = new StringContent("${escapedBody}");\n`;
      // Try to set content type if present in headers, though HttpClient handles it on content usually.
      // For simplicity, we assume application/json or text/plain if not specified, but StringContent defaults to text/plain.
      // If Content-Type header is present, we should set it on the content.
      const contentType = Object.entries(headers).find(
        ([k]) => k.toLowerCase() === "content-type",
      );
      if (contentType) {
        code += `            request.Content.Headers.ContentType = System.Net.Http.Headers.MediaTypeHeaderValue.Parse("${contentType[1]}");\n`;
      }
    }

    code += `\n            var response = await client.SendAsync(request);\n            response.EnsureSuccessStatusCode();\n            Console.WriteLine(await response.Content.ReadAsStringAsync());\n        }\n    }\n}`;

    return code;
  }

  /**
   * Generates a Python Requests code snippet.
   */
  static generatePythonRequests(
    url: string,
    method: string,
    headers: IRequestHeaderInformation,
    body?: string,
  ): string {
    let code = `import requests\n\n`;
    code += `url = "${url}"\n`;

    const cleanHeaders: Record<string, string> = {};
    for (const [key, value] of Object.entries(headers)) {
      if (key && value) {
        cleanHeaders[key] = value;
      }
    }

    if (Object.keys(cleanHeaders).length > 0) {
      code += `headers = ${JSON.stringify(cleanHeaders, null, 4)}\n`;
    } else {
      code += `headers = {}\n`;
    }

    if (
      body &&
      method.toUpperCase() !== "GET" &&
      method.toUpperCase() !== "HEAD"
    ) {
      // Try to parse as JSON to print as a dict if possible, otherwise string
      try {
        JSON.parse(body);
        code += `payload = ${body}\n`; // If it's valid JSON, python might accept it as a dict representation if it's simple, but JSON.stringify produces JS syntax.
        // Better to use json.dumps in python or pass as string.
        // Let's pass as string for safety or json parameter if it is json.
        code += `payload = ${JSON.stringify(JSON.parse(body), null, 4)}\n`;
        code += `response = requests.request("${method.toUpperCase()}", url, headers=headers, json=payload)\n`;
      } catch {
        code += `payload = ${JSON.stringify(body)}\n`;
        code += `response = requests.request("${method.toUpperCase()}", url, headers=headers, data=payload)\n`;
      }
    } else {
      code += `response = requests.request("${method.toUpperCase()}", url, headers=headers)\n`;
    }

    code += `\nprint(response.text)`;
    return code;
  }
}
