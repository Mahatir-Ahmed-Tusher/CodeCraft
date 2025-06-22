CodeCraft IDE
Project Vision
CodeCraft IDE is a modern, web-based Integrated Development Environment (IDE) designed for creators, learners, and professionals. It supports multiple programming languages, real-time code execution, AI-assisted development, and a sleek, user-friendly interface. The goal is to democratize coding by providing an accessible, browser-based platform for building and prototyping applications.
Tech Stack

Frontend: React, Next.js, TypeScript
UI Components: Shadcn UI, Lucide React
Editor: Monaco Editor
Animations: Framer Motion
File Management: JSZip, file-saver
Layout: react-resizable-panels
Styling: Tailwind CSS
AI Integration: OpenRouter API
Persistence: localStorage
Compilers: WebAssembly-based (CheerpJ for Java, Emscripten for C/C++, Pyodide for Python)

Supported Languages and Environments

HTML/CSS/JavaScript: Full preview support in the browser.
React: Simulated build with npm support.
Node.js: Simulated server with Express and npm support.
C/C++: WebAssembly-based compilation (Emscripten).
Java: WebAssembly-based compilation (CheerpJ).
Python: Browser-based execution (Pyodide).

Features

Multi-Language Support: Create and edit projects in HTML, CSS, JS, React, Node.js, C, C++, Java, and Python.
File Explorer: Full CRUD operations (create, rename, delete, download) with right-click context menus.
Code Editor: Monaco Editor with syntax highlighting and customizable settings.
Preview and Terminal: Real-time preview for web projects and terminal output for all languages.
AI Helper: Integrated with OpenRouter API for code suggestions and completion.
Multiple Workspaces: Open multiple projects with isolated file trees and terminals.
Settings: Customize theme, font family, font size, line height, and tab size, persisted in localStorage.
File Upload: Import projects via ZIP files.
Modern UI: Frosted glass effects, gradients, animations, and WCAG-compliant themes.

Screenshots
(TODO: Add screenshots or GIFs of the IDE in action)
Setup Instructions

Clone the Repository:git clone https://github.com/yourusername/codecraft-ide.git
cd codecraft-ide


Install Dependencies:npm install


Set Environment Variables:Create a .env.local file in the root directory and add:NEXT_PUBLIC_OPENROUTER_API_KEY=your_openrouter_api_key


Run Locally:npm run dev

Open http://localhost:3000 in your browser.
Build for Production:npm run build
npm run start



Running in VS Code

Open the project in VS Code.
Install recommended extensions: ESLint, Prettier, Tailwind CSS IntelliSense.
Run npm install in the integrated terminal.
Start the development server with npm run dev.

Contributing
Contributions are welcome! Please open an issue or submit a pull request with your changes.
License
MIT License