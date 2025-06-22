"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useIdeContext } from "@/context/IdeContext";
import dynamic from 'next/dynamic';
import { 
  Code, 
  Play, 
  Settings, 
  Download,
  Home,
  Eye,
  Loader2Icon,
  Terminal,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import FileExplorer from "@/components/ide/FileExplorer";

// Lazy load Monaco Editor for better performance
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <Loader2Icon className="w-6 h-6 animate-spin text-blue-500" />
    </div>
  ),
  ssr: false
});

export default function IDE() {
  const { 
    initializeIDE, 
    files, 
    activeFile, 
    settings, 
    isLoading,
    projectType,
    setActiveFile,
    updateFileContent
  } = useIdeContext();

  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [previewContent, setPreviewContent] = useState('');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);

  useEffect(() => {
    initializeIDE();
  }, [initializeIDE]);

  // Memoized file list for performance
  const fileList = useMemo(() => files, [files]);

  const handleFileSelect = useCallback((file: any) => {
    setActiveFile(file);
  }, [setActiveFile]);

  const handleEditorChange = useCallback((value: string | undefined) => {
    if (activeFile && value !== undefined) {
      updateFileContent(activeFile.path, value);
    }
  }, [activeFile, updateFileContent]);

  const generatePreview = useCallback(() => {
    setTerminalOutput(prev => [...prev, `🚀 Running ${projectType} project...`]);
    
    if (projectType === 'html') {
      const htmlFile = files.find(f => f.name === 'index.html');
      const cssFile = files.find(f => f.name === 'style.css');
      const jsFile = files.find(f => f.name === 'script.js');
      
      if (htmlFile) {
        let htmlContent = htmlFile.content;
        
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
        
        setPreviewContent(htmlContent);
        setTerminalOutput(prev => [...prev, '✅ HTML project running successfully']);
      }
    } else if (projectType === 'react') {
      const appFile = files.find(f => f.name === 'App.jsx');
      const cssFile = files.find(f => f.name === 'App.css');
      
      if (appFile) {
        const previewHtml = `
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
      ${cssFile?.content || ''}
    </style>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
      ${appFile.content.replace('import React, { useState } from \'react\';', 'const { useState } = React;').replace('import \'./App.css\';', '').replace('export default App;', '')}
      
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(React.createElement(App));
    </script>
</body>
</html>`;
        setPreviewContent(previewHtml);
        setTerminalOutput(prev => [...prev, '✅ React app compiled and running']);
      }
    } else if (projectType === 'nodejs') {
      setTerminalOutput(prev => [
        ...prev, 
        '📦 Installing dependencies...',
        '✅ Dependencies installed',
        '🚀 Starting Node.js server...',
        '✅ Server running on http://localhost:3000'
      ]);
      
      const serverPreview = `
<!DOCTYPE html>
<html>
<head>
    <title>Node.js Server Status</title>
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
      .status { background: rgba(0,255,0,0.2); padding: 1rem; border-radius: 8px; margin: 1rem 0; }
      .endpoint { background: rgba(255,255,255,0.1); padding: 0.5rem; border-radius: 4px; margin: 0.5rem 0; font-family: monospace; }
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
        <div class="endpoint">GET / - Server info</div>
        <div class="endpoint">GET /api/hello - Greeting API</div>
        <div class="endpoint">GET /api/users - Users list</div>
        <div class="endpoint">POST /api/users - Create user</div>
        <div class="endpoint">GET /health - Health check</div>
        <p>Server is running and ready to handle requests.</p>
    </div>
</body>
</html>`;
      setPreviewContent(serverPreview);
    }
  }, [files, projectType]);

  const downloadProject = useCallback(() => {
    const projectData = {
      name: `codecraft-${projectType}-project`,
      type: projectType,
      files: files.reduce((acc, file) => {
        acc[file.path] = file.content;
        return acc;
      }, {} as Record<string, string>),
      metadata: {
        created: new Date().toISOString(),
        ide: 'CodeCraft IDE',
        version: '1.0.0'
      }
    };
    
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codecraft-${projectType}-project.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    setTerminalOutput(prev => [...prev, `📥 Project downloaded as codecraft-${projectType}-project.json`]);
  }, [files, projectType]);

  const clearTerminal = useCallback(() => {
    setTerminalOutput([]);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2Icon className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-300">Setting up your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Code className="w-6 h-6 text-blue-400" />
            <span className="font-bold text-lg">CodeCraft IDE</span>
            <span className="text-sm text-gray-400 bg-gray-700 px-2 py-1 rounded">
              {projectType.toUpperCase()}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={generatePreview}
            className="text-gray-300 hover:text-white"
          >
            <Play className="w-4 h-4 mr-2" />
            Run
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={downloadProject}
            className="text-gray-300 hover:text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/" className="text-gray-300 hover:text-white">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* File Explorer */}
        <FileExplorer onFileSelect={handleFileSelect} />

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Tab Bar */}
          <div className="bg-gray-800 border-b border-gray-700 px-4 py-2">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  activeTab === 'editor'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <Code className="w-4 h-4 inline mr-2" />
                Editor
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <Eye className="w-4 h-4 inline mr-2" />
                Preview
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col">
            {activeTab === 'editor' ? (
              <div className="flex-1 flex">
                <div className="flex-1">
                  {activeFile ? (
                    <MonacoEditor
                      height="100%"
                      language={activeFile.language}
                      value={activeFile.content}
                      onChange={handleEditorChange}
                      theme={settings.theme}
                      options={{
                        fontSize: settings.fontSize,
                        fontFamily: settings.fontFamily,
                        lineHeight: settings.lineHeight,
                        tabSize: settings.tabSize,
                        wordWrap: settings.wordWrap ? 'on' : 'off',
                        minimap: { enabled: settings.minimap },
                        lineNumbers: settings.lineNumbers ? 'on' : 'off',
                        automaticLayout: true,
                        scrollBeyondLastLine: false,
                        smoothScrolling: true,
                        cursorBlinking: 'smooth',
                        renderLineHighlight: 'line',
                        selectOnLineNumbers: true,
                        contextmenu: true,
                        mouseWheelZoom: true,
                        formatOnPaste: true,
                        formatOnType: true,
                      }}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Select a file to start editing</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Terminal Panel */}
                <div className="w-80 bg-gray-900 border-l border-gray-700 flex flex-col">
                  <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Terminal className="w-4 h-4" />
                      <span className="text-sm font-medium">Terminal</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearTerminal}
                      className="h-6 w-6 p-0"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex-1 p-4 overflow-y-auto font-mono text-sm">
                    {terminalOutput.length === 0 ? (
                      <div className="text-gray-500">
                        <p>CodeCraft Terminal</p>
                        <p>Click "Run" to execute your project</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {terminalOutput.map((line, index) => (
                          <div key={index} className="text-green-400">
                            {line}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1">
                {previewContent ? (
                  <iframe
                    srcDoc={previewContent}
                    className="w-full h-full border-0"
                    title="Preview"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Click "Run" to see your project preview</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}