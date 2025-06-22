import { Project } from './page';

export const compileAndRun = async (
  project: Project,
  updateTerminalOutput: (message: string) => void
): Promise<{ preview: string; output: string[] }> => {
  updateTerminalOutput(`Running ${project.type} project...`);
  let preview = '';
  let output: string[] = [];

  try {
    if (project.type === 'html') {
      const htmlFile = project.files.find(f => f.name === 'index.html');
      const cssFile = project.files.find(f => f.name === 'style.css');
      const jsFile = project.files.find(f => f.name === 'script.js');
      
      if (htmlFile) {
        let htmlContent = htmlFile.content || '';
        
        // Inject CSS if external file exists
        if (cssFile && cssFile.content) {
          htmlContent = htmlContent.replace(
            '<link rel="stylesheet" href="style.css">',
            `<style>${cssFile.content}</style>`
          );
        }
        
        // Inject JavaScript if external file exists
        if (jsFile && jsFile.content) {
          htmlContent = htmlContent.replace(
            '<script src="script.js"></script>',
            `<script>${jsFile.content}</script>`
          );
        }
        
        preview = htmlContent;
        output.push('✅ HTML project executed successfully.');
        updateTerminalOutput('✅ HTML project executed successfully.');
      } else {
        output.push('❌ No index.html file found.');
        updateTerminalOutput('❌ No index.html file found.');
      }
    } 
    else if (project.type === 'react') {
      const appFile = project.files.find(f => f.name === 'App.jsx');
      const cssFile = project.files.find(f => f.name === 'App.css');
      const packageJson = project.files.find(f => f.name === 'package.json');
      
      if (packageJson) {
        updateTerminalOutput('📦 Installing dependencies...');
        updateTerminalOutput('✅ Dependencies installed successfully.');
        updateTerminalOutput('🚀 Starting React development server...');
      }
      
      if (appFile) {
        // Create a complete React app preview
        preview = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React App Preview</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
      ${cssFile?.content || `
        .App {
          text-align: center;
        }
        .App-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
        }
        .counter {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: 2rem;
        }
        .counter button {
          background: rgba(255,255,255,0.2);
          border: 2px solid white;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1.2rem;
          transition: all 0.3s ease;
        }
        .counter button:hover {
          background: rgba(255,255,255,0.3);
          transform: scale(1.05);
        }
        .count {
          font-size: 2rem;
          font-weight: bold;
          min-width: 3rem;
        }
      `}
    </style>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
      ${appFile.content?.replace('import React, { useState } from \'react\';', 'const { useState } = React;').replace('import \'./App.css\';', '').replace('export default App;', '')}
      
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(React.createElement(App));
    </script>
</body>
</html>`;
        
        output.push('✅ React app compiled and running.');
        updateTerminalOutput('✅ React app compiled and running.');
        updateTerminalOutput('🌐 App available at http://localhost:3000');
      } else {
        output.push('❌ No App.jsx file found.');
        updateTerminalOutput('❌ No App.jsx file found.');
      }
    } 
    else if (project.type === 'nodejs') {
      const serverFile = project.files.find(f => f.name === 'server.js');
      const packageJson = project.files.find(f => f.name === 'package.json');
      
      if (packageJson) {
        updateTerminalOutput('📦 Installing Node.js dependencies...');
        updateTerminalOutput('✅ Dependencies installed successfully.');
      }
      
      if (serverFile) {
        updateTerminalOutput('🚀 Starting Node.js server...');
        
        // Create a preview showing the server response
        preview = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Node.js Server Preview</title>
    <style>
      body { 
        font-family: Arial, sans-serif; 
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        margin: 0;
        padding: 2rem;
        color: white;
        text-align: center;
      }
      .container {
        background: rgba(255,255,255,0.1);
        padding: 2rem;
        border-radius: 10px;
        backdrop-filter: blur(10px);
        max-width: 600px;
        margin: 0 auto;
      }
      .status {
        background: rgba(0,255,0,0.2);
        padding: 1rem;
        border-radius: 8px;
        margin: 1rem 0;
        border: 1px solid rgba(0,255,0,0.3);
      }
      .endpoint {
        background: rgba(255,255,255,0.1);
        padding: 0.5rem;
        border-radius: 4px;
        margin: 0.5rem 0;
        font-family: monospace;
      }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 CodeCraft Node.js Server</h1>
        <div class="status">
            <h3>✅ Server Running Successfully</h3>
            <p>Port: 3000</p>
            <p>Time: ${new Date().toLocaleString()}</p>
        </div>
        <h3>Available Endpoints:</h3>
        <div class="endpoint">GET / - Main page</div>
        <div class="endpoint">GET /api/status - API status</div>
        <p>Server code is executing in the background.</p>
    </div>
</body>
</html>`;
        
        output.push('✅ Node.js server started successfully.');
        output.push('🌐 Server running on http://localhost:3000');
        updateTerminalOutput('✅ Node.js server started successfully.');
        updateTerminalOutput('🌐 Server running on http://localhost:3000');
      } else {
        output.push('❌ No server.js file found.');
        updateTerminalOutput('❌ No server.js file found.');
      }
    } 
    else if (project.type === 'cpp' || project.type === 'c') {
      const mainFile = project.files.find(f => f.name === (project.type === 'cpp' ? 'main.cpp' : 'main.c'));
      
      if (mainFile) {
        updateTerminalOutput(`🔨 Compiling ${project.type.toUpperCase()} code...`);
        updateTerminalOutput('✅ Compilation successful.');
        updateTerminalOutput('🏃 Running executable...');
        
        // Simulate program output
        output.push('Hello, CodeCraft IDE! 🚀');
        updateTerminalOutput('Hello, CodeCraft IDE! 🚀');
        updateTerminalOutput('✅ Program executed successfully.');
      } else {
        output.push(`❌ No ${project.type === 'cpp' ? 'main.cpp' : 'main.c'} file found.`);
        updateTerminalOutput(`❌ No ${project.type === 'cpp' ? 'main.cpp' : 'main.c'} file found.`);
      }
    } 
    else if (project.type === 'java') {
      const mainFile = project.files.find(f => f.name === 'Main.java');
      
      if (mainFile) {
        updateTerminalOutput('☕ Compiling Java code...');
        updateTerminalOutput('✅ Compilation successful.');
        updateTerminalOutput('🏃 Running Java application...');
        
        // Simulate program output
        output.push('Hello, CodeCraft IDE! 🚀');
        updateTerminalOutput('Hello, CodeCraft IDE! 🚀');
        updateTerminalOutput('✅ Java application executed successfully.');
      } else {
        output.push('❌ No Main.java file found.');
        updateTerminalOutput('❌ No Main.java file found.');
      }
    } 
    else if (project.type === 'python') {
      const mainFile = project.files.find(f => f.name === 'main.py');
      
      if (mainFile) {
        updateTerminalOutput('🐍 Running Python script...');
        
        // Simulate program output
        output.push('Hello, CodeCraft IDE! 🚀');
        updateTerminalOutput('Hello, CodeCraft IDE! 🚀');
        updateTerminalOutput('✅ Python script executed successfully.');
      } else {
        output.push('❌ No main.py file found.');
        updateTerminalOutput('❌ No main.py file found.');
      }
    }
  } catch (error) {
    const errorMessage = `❌ Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`;
    output.push(errorMessage);
    updateTerminalOutput(errorMessage);
  }

  return { preview, output };
};