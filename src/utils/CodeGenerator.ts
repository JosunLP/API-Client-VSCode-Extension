import { IRequestHeaderInformation } from "./type";

export class CodeGenerator {
  /**
   * Generates a cURL command for the request.
   */
  static generateCurl(
    url: string,
    method: string,
    headers: IRequestHeaderInformation,
    body?: string
  ): string {
    let command = `curl -X ${method.toUpperCase()} "${url}"`;

    // Add headers
    for (const [key, value] of Object.entries(headers)) {
      if (key && value) {
        command += ` \\\n  -H "${key}: ${value}"`;
      }
    }

    // Add body
    if (body && method.toUpperCase() !== "GET" && method.toUpperCase() !== "HEAD") {
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
    body?: string
  ): string {
    const options: {
      method: string;
      headers: Record<string, string>;
      body?: string;
    } = {
      method: method.toUpperCase(),
      headers: headers,
    };

    if (body && method.toUpperCase() !== "GET" && method.toUpperCase() !== "HEAD") {
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
   * Generates a Python Requests code snippet.
   */
  static generatePythonRequests(
    url: string,
    method: string,
    headers: IRequestHeaderInformation,
    body?: string
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

    if (body && method.toUpperCase() !== "GET" && method.toUpperCase() !== "HEAD") {
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
