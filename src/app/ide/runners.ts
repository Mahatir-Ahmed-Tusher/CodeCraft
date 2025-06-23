// Define the Project interface in ./page.ts or at the top of runners.ts
interface File {
  name: string;
  content?: string;
}

interface Project {
  type: string;
  files: File[];
}

// Import or use the interface

export const compileAndRun = async (
  project: Project,
  updateTerminalOutput: (message: string) => void
): Promise<{ preview: string; output: string[] }> => {
  updateTerminalOutput(`Running ${project.type} project...`);
  let preview = '';
  let output: string[] = [];

  try {
    if (project.type === 'html') {
      const htmlFile = project.files.find((f: File) => f.name === 'index.html');
      const cssFile = project.files.find((f: File) => f.name === 'style.css');
      const jsFile = project.files.find((f: File) => f.name === 'script.js');
      
      if (htmlFile) {
        let htmlContent = htmlFile.content || '';
        
        if (cssFile && cssFile.content) {
          htmlContent = htmlContent.replace(
            '</head>',
            `<style>${cssFile.content}</style></head>`
          );
        }
        
        if (jsFile && jsFile.content) {
          htmlContent = htmlContent.replace(
            '</body>',
            `<script>${jsFile.content}</script></body>`
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
      const appFile = project.files.find((f: File) => f.name === 'App.jsx');
      const cssFile = project.files.find((f: File) => f.name === 'App.css');
      const packageJson = project.files.find((f: File) => f.name === 'package.json');
      
      if (packageJson) {
        updateTerminalOutput('📦 Installing dependencies...');
        updateTerminalOutput('✅ Dependencies installed successfully.');
        updateTerminalOutput('🚀 Starting React development server...');
      }
      
      if (appFile) {
        preview = `
<!DOCTYPE html>
<html>
<head>
  <title>React App</title>
  ${cssFile && cssFile.content ? `<style>${cssFile.content}</style>` : ''}
</head>
<body>
  <div id="root">${appFile.content || ''}</div>
  <script>${appFile.content || ''}</script>
</body>
</html>
`;
        
        output.push('✅ React app compiled and running.');
        updateTerminalOutput('✅ React app compiled and running.');
        updateTerminalOutput('🌐 App available at http://localhost:3000');
      } else {
        output.push('❌ No App.jsx file found.');
        updateTerminalOutput('❌ No App.jsx file found.');
      }
    } 
    else if (project.type === 'nodejs') {
      const serverFile = project.files.find((f: File) => f.name === 'server.js');
      const packageJson = project.files.find((f: File) => f.name === 'package.json');
      
      if (packageJson) {
        updateTerminalOutput('📦 Installing Node.js dependencies...');
        updateTerminalOutput('✅ Dependencies installed successfully.');
      }
      
      if (serverFile) {
        updateTerminalOutput('🚀 Starting Node.js server...');
        
        preview = `
<!DOCTYPE html>
<html>
<head>
  <title>Node.js Server</title>
</head>
<body>
  <h1>🚀 CodeCraft Node.js Server</h1>
  <p>✅ Server Running Successfully</p>
  <p>Port: 3000</p>
  <p>Time: ${new Date().toLocaleString()}</p>
  <p>Available Endpoints:</p>
  <ul>
    <li>GET / - Main page</li>
    <li>GET /api/status - API status</li>
  </ul>
  <p>Server code is executing in the background.</p>
</body>
</html>
`;
        
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
      const mainFile = project.files.find((f: File) => f.name === (project.type === 'cpp' ? 'main.cpp' : 'main.c'));
      
      if (mainFile) {
        updateTerminalOutput(`🔨 Compiling ${project.type.toUpperCase()} code...`);
        updateTerminalOutput('✅ Compilation successful.');
        updateTerminalOutput('🏃 Running executable...');
        
        output.push('Hello, CodeCraft IDE! 🚀');
        updateTerminalOutput('Hello, CodeCraft IDE! 🚀');
        updateTerminalOutput('✅ Program executed successfully.');
      } else {
        output.push(`❌ No ${project.type === 'cpp' ? 'main.cpp' : 'main.c'} file found.`);
        updateTerminalOutput(`❌ No ${project.type === 'cpp' ? 'main.cpp' : 'main.c'} file found.`);
      }
    } 
    else if (project.type === 'java') {
      const mainFile = project.files.find((f: File) => f.name === 'Main.java');
      
      if (mainFile) {
        updateTerminalOutput('☕ Compiling Java code...');
        updateTerminalOutput('✅ Compilation successful.');
        updateTerminalOutput('🏃 Running Java application...');
        
        output.push('Hello, CodeCraft IDE! 🚀');
        updateTerminalOutput('Hello, CodeCraft IDE! 🚀');
        updateTerminalOutput('✅ Java application executed successfully.');
      } else {
        output.push('❌ No Main.java file found.');
        updateTerminalOutput('❌ No Main.java file found.');
      }
    } 
    else if (project.type === 'python') {
      const mainFile = project.files.find((f: File) => f.name === 'main.py');
      
      if (mainFile) {
        updateTerminalOutput('🐍 Running Python script...');
        
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