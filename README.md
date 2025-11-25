<div align="center">
  <a href="https://github.com/JosunLP/API-Client-VSCode-Extension">
    <img
      src="https://raw.githubusercontent.com/JosunLP/API-Client-VSCode-Extension/8b9e3f6ca2070466d0c2ffa0e3fe552cad7cf228/icons/images/icon.png"
      width="100"
      height="100"
    />
  </a>

  <h3>Pulse API Client</h3>
  <h5>Simple and intuitive API Client made into a VSCode extension.</h5>

<a href="https://marketplace.visualstudio.com/items?itemName=JosunLP.pulse-api-client">Visual Studio Marketplace</a>
•
<a href="https://github.com/JosunLP/API-Client-VSCode-Extension">Repository</a>
•
<a href="https://github.com/JosunLP/API-Client-VSCode-Extension/blob/main/CHANGELOG.md">Releases</a>

<br>

<a href="https://marketplace.visualstudio.com/items?itemName=JosunLP.pulse-api-client&ssr=false#review-details">
    <img src="https://img.shields.io/visual-studio-marketplace/stars/JosunLP.pulse-api-client?color=informational&style=for-the-badge"/>
</a>
<a href="https://marketplace.visualstudio.com/items?itemName=JosunLP.pulse-api-client&ssr=false#overview">
    <img src="https://img.shields.io/visual-studio-marketplace/i/JosunLP.pulse-api-client?color=blue&style=for-the-badge"/>
</a>

</div>

<br>

<div>
  <p>
    Visual Studio Code extension to send HTTP/S requests and establish WebSocket connections with
    an intuitive UI within Visual Studio Code to enhance work productivity.
  </p>
  <img
    src="https://user-images.githubusercontent.com/83770081/179973792-c8db3488-3f90-4829-8eb4-f1f671d89577.gif"
    alt="Pulse API Client preview"
  />
</div>

<br>

- [🚀 Installation](#-installation)
- [🔐 Security and Privacy](#-security-and-privacy)
- [✨ Features](#-features)
- [💻 Commands](#-commands)
- [📚 Tech Stacks](#-tech-stacks)
  - [This project was created using the following tech stacks](#this-project-was-created-using-the-following-tech-stacks)
- [👨🏻‍💻 Contributing](#-contributing)
  - [🪜 Step-by-step guide on how to make a pull request](#-step-by-step-guide-on-how-to-make-a-pull-request)
  - [🏗 Running the extension locally for development](#-running-the-extension-locally-for-development)
  - [📦 Available Scripts](#-available-scripts)
  - [⚠️ Bugs or Suggestions](#️-bugs-or-suggestions)
- [🫧 Contributors](#-contributors)
- [📋 License](#-license)

<br>

## 🚀 Installation

> ❗️ This extension is best paired with a dark-colored Visual Studio Code theme.

> ❗️ Pulse API Client cannot be installed or used when using a web version of Visual Studio Code

## 🔐 Security and Privacy

- Pulse API Client **does not** collect or store any of your personal information or request data
- Pulse API Client uses VSCode global state API in order to store your request history and favorites collections locally.

## ✨ Features

- Send a request and receive a response from your desired API endpoint.
- Eight request methods
  - `GET`
  - `POST`
  - `PUT`
  - `PATCH`
  - `DELETE`
  - `HEAD`
  - `OPTIONS`
  - `WEBSOCKET` - Real-time WebSocket connections with custom headers support
- Various request options
  - Add parameter to your API endpoint
  - Add authorization option
    - Basic Authorization
    - Bearer Token
  - Add body data
    - Form data
    - x-www-form-urlencoded
    - Raw data
      - `Text`
      - `JavaScript`
      - `JSON`
      - `HTML`
- **Environment Management** - Create and manage multiple environments with variables
  - Define environment variables (key-value pairs)
  - Switch between environments easily
  - Variables are automatically substituted in your requests
- Code snippet of your current request, provided up to 18 different languages with their specific variants, to copy and paste to your codebase.

![Code Snippet preview](https://user-images.githubusercontent.com/83770081/179729908-e20f4b05-2007-4bec-8473-b4944e882f86.gif)

- Resizable vertical menu
- Various response body view format
  - Pretty
    - `JSON`
    - `HTML`
    - `Text`
  - Raw
    - `Plain Text`
  - Visual `HTML` preview of the response data
- Basic metadata information
  - Status code and text
  - Response size
  - Approximate time measurement to receive a response from your request
- Copy and paste code button
- Response headers view mode
- History collection sidebar
- Favorites collection sidebar
- **Favorites Folder Organization** - Organize your favorite requests into folders
- Intuitive icon UI to favorite a request history or delete
- Search bar to find your specific request history
- Click and search from the sidebar collection

![Sidebar preview](https://user-images.githubusercontent.com/83770081/179733141-0fef0d7c-b179-4440-b624-a137ccb14e05.gif)

## 💻 Commands

Simply click Open Menu button or open the Command Palette and type the command below:

> `Command+P` or `Command + Shift + P` on **macOS** and `Ctrl+Shift+P` on **Windows/Linux**

<br>

| Command                | Description              |
| ---------------------- | ------------------------ |
| `> Start: New Request` | Create a API Client menu |

> ❗️ You can only create one panel at a time.

## 📚 Tech Stacks

#### This project was created using the following tech stacks

<p>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"/></a>&nbsp
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/></a>&nbsp
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E"/></a>&nbsp
  <img src="https://img.shields.io/badge/styled--components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white"/></a>&nbsp
</p>

- **Extension** : [VS Code Extension API](https://code.visualstudio.com/api)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI** : [React JS](https://reactjs.org/), [Styled Components](https://styled-components.com/)
- **HTTP/s Request**: [Axios](https://axios-http.com/)
- **WebSocket**: [ws](https://github.com/websockets/ws)
- **State Management Library**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Editor** : [Monaco Editor](https://www.npmjs.com/package/@monaco-editor/react)
- **Local DB** : [VSCode extension global state API](https://code.visualstudio.com/api/extension-capabilities/common-capabilities#:~:text=globalState%20%3A%20A%20global%20storage%20where,using%20setKeysForSync%20method%20on%20globalState%20.)
- **Code Snippet Generator** : [Postman-collection](https://www.npmjs.com/package/postman-collection), [Postman-Code-Generators](https://www.npmjs.com/package/postman-code-generators)
- **Bundler**: [Vite](https://vitejs.dev/)
- **Test:** [Vitest](https://vitest.dev/), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## 👨🏻‍💻 Contributing

If you have a suggestion that would make this project better, please fork this repository from [here](https://github.com/JosunLP/API-Client-VSCode-Extension) and create a pull request.

I appreciate even the tiniest suggestion or contribution you make to this project.

#### 🪜 Step-by-step guide on how to make a pull request

1. Fork this Project from [here](https://github.com/JosunLP/API-Client-VSCode-Extension)
2. Create your Branch &#8594; `git checkout -b feature/newFeature`
3. Code up your outstanding logic &#8594; `console.log("Hello World")`
4. Commit your Changes &#8594; `git commit -m "feat: Add some newFeature"`
5. Push to the Branch &#8594; `git push origin feature/newFeature`
6. Vist your GitHub repository and open a Pull Request

#### 🏗 Running the extension locally for development

1. Run `git clone` from this [repository](https://github.com/JosunLP/API-Client-VSCode-Extension)
2. Run `npm install`
3. Run `npm run dev` (starts both extension and webview in watch mode)
4. Press F5 to launch extension development mode
5. `command + p` or `ctrl + p` and type `> Developer: Toggle Developer Tools` to open browser console for easy debugging

#### 📦 Available Scripts

| Command            | Description                                |
| ------------------ | ------------------------------------------ |
| `npm run dev`      | Start development mode with hot reload     |
| `npm run package`  | Build extension and webview for production |
| `npm run compile`  | Package extension as VSIX file             |
| `npm run lint`     | Run ESLint with auto-fix                   |
| `npm run test`     | Run tests with Vitest                      |
| `npm run coverage` | Run tests with coverage report             |

#### ⚠️ Bugs or Suggestions

If you found any bugs while using this extension or you have a suggestion please post it in [issues](https://github.com/JosunLP/API-Client-VSCode-Extension/issues).

## 🫧 Contributors

[![Contributors](https://contrib.rocks/image?repo=JosunLP/API-Client-VSCode-Extension)](https://github.com/JosunLP/API-Client-VSCode-Extension/graphs/contributors)

## 📋 License

This extension is released under the [MIT license](https://github.com/JosunLP/API-Client-VSCode-Extension/blob/main/LICENSE).
