"use client";
import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';

interface FileType {
  name: string;
  content: string;
  language: string;
  path: string;
}

interface IdeSettings {
  theme: 'vs-dark' | 'vs-light' | 'github-dark' | 'github-light';
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  tabSize: number;
  wordWrap: boolean;
  minimap: boolean;
  autoSave: boolean;
  formatOnSave: boolean;
  lineNumbers: boolean;
}

interface IdeContextType {
  initializeIDE: () => void;
  files: FileType[];
  activeFile: FileType | null;
  settings: IdeSettings;
  isLoading: boolean;
  projectType: string;
  setActiveFile: (file: FileType) => void;
  updateFileContent: (path: string, content: string) => void;
  addFile: (file: FileType) => void;
  deleteFile: (path: string) => void;
  renameFile: (oldPath: string, newPath: string, newName: string) => void;
  createFolder: (path: string) => void;
  updateSettings: (newSettings: Partial<IdeSettings>) => void;
  setProjectType: (type: string) => void;
  updateFileStructure: (newFiles: FileType[]) => void;
}

const defaultSettings: IdeSettings = {
  theme: 'vs-dark',
  fontFamily: 'JetBrains Mono, Monaco, monospace',
  fontSize: 14,
  lineHeight: 1.5,
  tabSize: 2,
  wordWrap: true,
  minimap: false,
  autoSave: true,
  formatOnSave: true,
  lineNumbers: true,
};

const IdeContext = createContext<IdeContextType | undefined>(undefined);

export const IdeContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<FileType[]>([]);
  const [activeFile, setActiveFile] = useState<FileType | null>(null);
  const [settings, setSettings] = useState<IdeSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [projectType, setProjectType] = useState('html');

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('ide-settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.warn('Failed to load IDE settings:', error);
    }
  }, []);

  // Get project type from URL params
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const type = urlParams.get('type') || 'html';
      setProjectType(type);
    }
  }, []);

  const getDefaultFiles = useCallback((type: string): FileType[] => {
    switch (type) {
      case 'html':
        return [
          {
            name: 'index.html',
            path: '/index.html',
            language: 'html',
            content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CodeCraft Project</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>🚀 Welcome to CodeCraft IDE</h1>
        <p>Start building amazing web applications!</p>
        <button onclick="showMessage()">Click Me!</button>
        <div id="output"></div>
    </div>
    <script src="script.js"></script>
</body>
</html>`
          },
          {
            name: 'style.css',
            path: '/style.css',
            language: 'css',
            content: `body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.container {
    text-align: center;
    background: rgba(255,255,255,0.1);
    padding: 2rem;
    border-radius: 10px;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

h1 { 
    margin-bottom: 1rem;
    font-size: 2.5rem;
}

button {
    background: rgba(255,255,255,0.2);
    border: 2px solid white;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    margin: 10px;
    font-size: 16px;
    transition: all 0.3s ease;
}

button:hover { 
    background: rgba(255,255,255,0.3);
    transform: translateY(-2px);
}

#output {
    margin-top: 20px;
    font-size: 18px;
}`
          },
          {
            name: 'script.js',
            path: '/script.js',
            language: 'javascript',
            content: `// CodeCraft IDE JavaScript
console.log('🚀 CodeCraft IDE is ready!');

function showMessage() {
    const output = document.getElementById('output');
    output.innerHTML = '<p>✨ Hello from CodeCraft! Welcome to the future of coding.</p>';
    
    // Add some animation
    output.style.opacity = '0';
    setTimeout(() => {
        output.style.transition = 'opacity 0.5s ease';
        output.style.opacity = '1';
    }, 100);
}

function greet(name) {
    return \`Hello, \${name}! Welcome to CodeCraft IDE.\`;
}

// Example of modern JavaScript features
const features = [
    'File Management',
    'Code Editing',
    'Live Preview',
    'Multi-language Support'
];

features.forEach((feature, index) => {
    console.log(\`\${index + 1}. \${feature}\`);
});`
          }
        ];
      
      case 'react':
        return [
          {
            name: 'App.jsx',
            path: '/App.jsx',
            language: 'javascript',
            content: `import React, { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('');

  const handleIncrement = () => {
    setCount(prev => prev + 1);
    setMessage(\`Count increased to \${count + 1}!\`);
  };

  const handleDecrement = () => {
    setCount(prev => prev - 1);
    setMessage(\`Count decreased to \${count - 1}!\`);
  };

  const resetCounter = () => {
    setCount(0);
    setMessage('Counter reset!');
  };

  return (
    <div className="app">
      <div className="container">
        <h1>🚀 React App</h1>
        <p>Built with CodeCraft IDE</p>
        
        <div className="counter-section">
          <div className="counter-display">
            <span className="count-label">Count:</span>
            <span className="count-value">{count}</span>
          </div>
          
          <div className="button-group">
            <button onClick={handleDecrement} className="btn btn-secondary">
              -
            </button>
            <button onClick={resetCounter} className="btn btn-reset">
              Reset
            </button>
            <button onClick={handleIncrement} className="btn btn-primary">
              +
            </button>
          </div>
          
          {message && (
            <div className="message">
              {message}
            </div>
          )}
        </div>
        
        <div className="features">
          <h3>Features:</h3>
          <ul>
            <li>✅ State Management</li>
            <li>✅ Event Handling</li>
            <li>✅ Conditional Rendering</li>
            <li>✅ Modern React Hooks</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;`
          },
          {
            name: 'App.css',
            path: '/App.css',
            language: 'css',
            content: `.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 20px;
}

.container {
  text-align: center;
  background: rgba(255,255,255,0.1);
  padding: 3rem;
  border-radius: 20px;
  backdrop-filter: blur(15px);
  color: white;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  max-width: 500px;
  width: 100%;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(45deg, #fff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.counter-section {
  margin: 2rem 0;
}

.counter-display {
  margin-bottom: 2rem;
}

.count-label {
  font-size: 1.2rem;
  margin-right: 1rem;
}

.count-value {
  font-size: 3rem;
  font-weight: bold;
  color: #ffd700;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1rem;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 60px;
}

.btn-primary {
  background: linear-gradient(45deg, #4CAF50, #45a049);
  color: white;
}

.btn-secondary {
  background: linear-gradient(45deg, #f44336, #da190b);
  color: white;
}

.btn-reset {
  background: linear-gradient(45deg, #ff9800, #e68900);
  color: white;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.btn:active {
  transform: translateY(0);
}

.message {
  background: rgba(255,255,255,0.2);
  padding: 10px;
  border-radius: 8px;
  margin-top: 1rem;
  font-weight: 500;
}

.features {
  margin-top: 2rem;
  text-align: left;
  background: rgba(255,255,255,0.1);
  padding: 1.5rem;
  border-radius: 10px;
}

.features h3 {
  margin-bottom: 1rem;
  text-align: center;
}

.features ul {
  list-style: none;
  padding: 0;
}

.features li {
  padding: 0.5rem 0;
  font-size: 1rem;
}`
          },
          {
            name: 'package.json',
            path: '/package.json',
            language: 'json',
            content: `{
  "name": "codecraft-react-app",
  "version": "1.0.0",
  "description": "A React application built with CodeCraft IDE",
  "main": "App.jsx",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "keywords": ["react", "codecraft", "ide"],
  "author": "CodeCraft IDE",
  "license": "MIT"
}`
          }
        ];
      
      case 'nodejs':
        return [
          {
            name: 'server.js',
            path: '/server.js',
            language: 'javascript',
            content: `const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Welcome to CodeCraft Node.js Server!',
    timestamp: new Date().toISOString(),
    status: 'running',
    version: '1.0.0',
    endpoints: [
      'GET /',
      'GET /api/hello',
      'GET /api/users',
      'POST /api/users',
      'GET /health'
    ]
  });
});

app.get('/api/hello', (req, res) => {
  const { name = 'Developer' } = req.query;
  res.json({
    message: \`Hello, \${name}! Welcome to CodeCraft API!\`,
    data: { 
      greeting: 'Welcome to the server',
      timestamp: new Date().toISOString()
    }
  });
});

// Mock users data
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

app.get('/api/users', (req, res) => {
  res.json({
    success: true,
    data: users,
    count: users.length
  });
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: 'Name and email are required'
    });
  }
  
  const newUser = {
    id: users.length + 1,
    name,
    email
  };
  
  users.push(newUser);
  
  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: newUser
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.listen(port, () => {
  console.log(\`🚀 CodeCraft Server running at http://localhost:\${port}\`);
  console.log(\`📝 API Documentation available at http://localhost:\${port}\`);
});`
          },
          {
            name: 'package.json',
            path: '/package.json',
            language: 'json',
            content: `{
  "name": "codecraft-nodejs-app",
  "version": "1.0.0",
  "description": "A Node.js server built with CodeCraft IDE",
  "main": "server.js",
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3"
  },
  "devDependencies": {
    "nodemon": "^2.0.20"
  },
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "keywords": ["nodejs", "express", "api", "codecraft"],
  "author": "CodeCraft IDE",
  "license": "MIT",
  "engines": {
    "node": ">=14.0.0"
  }
}`
          },
          {
            name: 'README.md',
            path: '/README.md',
            language: 'markdown',
            content: `# CodeCraft Node.js Server

A simple Express.js server built with CodeCraft IDE.

## Features

- ✅ Express.js framework
- ✅ RESTful API endpoints
- ✅ JSON middleware
- ✅ CORS support
- ✅ Error handling
- ✅ Health check endpoint

## API Endpoints

### GET /
Returns server information and available endpoints.

### GET /api/hello?name=YourName
Returns a personalized greeting.

### GET /api/users
Returns a list of all users.

### POST /api/users
Creates a new user. Requires \`name\` and \`email\` in request body.

### GET /health
Returns server health status.

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Start the server:
   \`\`\`bash
   npm start
   \`\`\`

3. For development with auto-reload:
   \`\`\`bash
   npm run dev
   \`\`\`

The server will start on http://localhost:3000

## Built with CodeCraft IDE

This project was created using CodeCraft IDE - the modern web-based development environment.
`
          }
        ];
      
      default:
        return [
          {
            name: 'main.txt',
            path: '/main.txt',
            language: 'plaintext',
            content: `Welcome to CodeCraft IDE!

Start coding your amazing project here.

Features:
- Multi-language support
- File management
- Live preview
- Code editing with syntax highlighting

Happy coding! 🚀`
          }
        ];
    }
  }, []);

  const initializeIDE = useCallback(() => {
    setIsLoading(true);
    
    // Simulate initialization delay for smooth UX
    setTimeout(() => {
      const defaultFiles = getDefaultFiles(projectType);
      setFiles(defaultFiles);
      if (defaultFiles.length > 0) {
        setActiveFile(defaultFiles[0]);
      }
      setIsLoading(false);
    }, 100);
  }, [projectType, getDefaultFiles]);

  const updateFileContent = useCallback((path: string, content: string) => {
    setFiles(prev => prev.map(file => 
      file.path === path ? { ...file, content } : file
    ));
    
    if (activeFile?.path === path) {
      setActiveFile(prev => prev ? { ...prev, content } : null);
    }
  }, [activeFile]);

  const addFile = useCallback((file: FileType) => {
    setFiles(prev => [...prev, file]);
  }, []);

  const deleteFile = useCallback((path: string) => {
    setFiles(prev => prev.filter(file => file.path !== path));
    if (activeFile?.path === path) {
      setActiveFile(null);
    }
  }, [activeFile]);

  const renameFile = useCallback((oldPath: string, newPath: string, newName: string) => {
    setFiles(prev => prev.map(file => 
      file.path === oldPath 
        ? { ...file, path: newPath, name: newName }
        : file
    ));
    
    if (activeFile?.path === oldPath) {
      setActiveFile(prev => prev ? { ...prev, path: newPath, name: newName } : null);
    }
  }, [activeFile]);

  const createFolder = useCallback((path: string) => {
    // For now, we'll create a placeholder file in the folder
    // In a real implementation, you'd handle folder structure differently
    const placeholderFile: FileType = {
      name: '.gitkeep',
      path: `${path}/.gitkeep`,
      content: '# This file keeps the folder in version control',
      language: 'plaintext'
    };
    addFile(placeholderFile);
  }, [addFile]);

  const updateFileStructure = useCallback((newFiles: FileType[]) => {
    setFiles(newFiles);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<IdeSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('ide-settings', JSON.stringify(updated));
      } catch (error) {
        console.warn('Failed to save IDE settings:', error);
      }
      return updated;
    });
  }, []);

  const contextValue: IdeContextType = {
    initializeIDE,
    files,
    activeFile,
    settings,
    isLoading,
    projectType,
    setActiveFile,
    updateFileContent,
    addFile,
    deleteFile,
    renameFile,
    createFolder,
    updateSettings,
    setProjectType,
    updateFileStructure,
  };

  return (
    <IdeContext.Provider value={contextValue}>
      {children}
    </IdeContext.Provider>
  );
};

export const useIdeContext = () => {
  const context = useContext(IdeContext);
  if (context === undefined) {
    throw new Error('useIdeContext must be used within an IdeContextProvider');
  }
  return context;
};