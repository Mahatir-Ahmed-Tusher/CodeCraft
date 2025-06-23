"use client"
import React, { useContext, useEffect, useState, memo, useCallback, useMemo } from 'react'
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import Lookup from '@/data/Lookup';
import axios from 'axios';
import { MessageContext } from '@/data/context/MessageContext';
import { WorkspaceContext } from '@/data/context/WorkspaceContext';
import Prompt from '@/data/Prompt';
import { Loader2Icon, ExternalLink, RefreshCw, AlertTriangle } from 'lucide-react';
import CodeSandboxModal from './CodeSandboxModal';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Memoized loading component
const LoadingSpinner = memo(() => (
  <div className='p-10 bg-gray-900 opacity-60 gap-1 absolute top-0 rounded-lg w-full h-full flex items-center justify-center'>
    <Loader2Icon className={`animate-spin h-10 w-10 text-white`} />
    <h2 className='text-white font-semibold text-xl'>Generating your code...</h2>
  </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

const CodeView = () => {
  const [activeTab, setActiveTab] = useState('code');
  const messageContext = useContext(MessageContext);
  const workspaceContext = useContext(WorkspaceContext);
  
  // Safe fallbacks if contexts are not available
  const messages = messageContext?.messages || [];
  const files = workspaceContext?.files || {};
  const setFiles = workspaceContext?.setFiles || (() => {});
  
  const [loading, setLoading] = useState(false);
  const [sandpackError, setSandpackError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [codeGenerated, setCodeGenerated] = useState(false);

  // Memoize the GenerateAiCode function to prevent unnecessary re-renders
  const GenerateAiCode = useCallback(async () => {
    if (!messageContext || !workspaceContext) return;
    
    setActiveTab('code');
    setLoading(true);
    setSandpackError(false);
    setCodeGenerated(false);
    
    try {
      const PROMPT = JSON.stringify(messages) + " " + Prompt.CODE_GEN_PROMPT;
      const result = await axios.post('/api/ai-code', {
        prompt: PROMPT
      });
      console.log("ai-code", result.data);
      const aiResponse = result.data;

      // Use the exact same file merging logic as the working code
      const mergeFiles = { ...files, ...aiResponse?.files };
      setFiles(mergeFiles);
      setCodeGenerated(true);
      
      // Show the modal after code generation
      setTimeout(() => {
        setShowModal(true);
      }, 1000);
    } catch (error) {
      console.error('Error generating code:', error);
      setSandpackError(true);
    }
    setLoading(false);
  }, [messages, files, setFiles, messageContext, workspaceContext]);

  useEffect(() => {
    if (messages?.length > 0 && messageContext && workspaceContext) {
      const role = messages[messages.length - 1].role;
      if (role === 'user') {
        GenerateAiCode();
      }
    }
  }, [messages, GenerateAiCode, messageContext, workspaceContext]);

  const downloadProject = useCallback(async () => {
    if (!files || Object.keys(files).length === 0) {
      console.log('No files to download');
      return;
    }

    try {
      const zip = new JSZip();
      
      // Add all files to the zip with proper structure
      Object.keys(files).forEach(filePath => {
        const fileContent = files[filePath];
        const content = typeof fileContent === 'object' ? fileContent.code || '' : fileContent || '';
        
        // Remove leading slash for proper file structure
        const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
        
        // Ensure we have content to add
        if (content.trim()) {
          zip.file(cleanPath, content);
        }
      });

      // Generate and download the zip file
      const zipContent = await zip.generateAsync({ type: 'blob' });
      const projectName = getProjectName(files);
      saveAs(zipContent, `${projectName}.zip`);
      
      console.log('Project downloaded successfully');
    } catch (error) {
      console.error('Error creating ZIP file:', error);
    }
  }, [files]);

  const getProjectName = (files: any) => {
    // Try to get project name from package.json
    if (files['/package.json']) {
      try {
        const packageContent = typeof files['/package.json'] === 'object' 
          ? files['/package.json'].code 
          : files['/package.json'];
        const packageData = JSON.parse(packageContent);
        if (packageData.name) {
          return packageData.name;
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }
    
    // Determine project type and return appropriate name
    if (files['/App.js'] || files['/src/App.js']) {
      return 'react-project';
    } else if (files['/server.js']) {
      return 'nodejs-project';
    } else if (files['/index.html']) {
      return 'html-project';
    }
    
    return 'codecraft-project';
  };

  const openInCodeSandbox = useCallback(() => {
    try {
      // Create a CodeSandbox URL with the current files
      const sandboxFiles = Object.keys(files || {}).reduce((acc, key) => {
        // Remove leading slash for CodeSandbox
        const cleanKey = key.startsWith('/') ? key.slice(1) : key;
        const fileContent = files[key];
        const content = typeof fileContent === 'object' ? fileContent.code || '' : fileContent || '';
        
        if (content.trim()) {
          acc[cleanKey] = { content };
        }
        return acc;
      }, {} as any);

      // Create the CodeSandbox parameters
      const parameters = {
        files: sandboxFiles
      };

      // Convert to JSON string and encode
      const jsonString = JSON.stringify(parameters);
      const encodedParams = btoa(unescape(encodeURIComponent(jsonString)));
      
      // Open CodeSandbox in a new tab
      window.open(`https://codesandbox.io/api/v1/sandboxes/define?parameters=${encodedParams}`, '_blank');
    } catch (error) {
      console.error('Error opening CodeSandbox:', error);
      // Fallback: open CodeSandbox without parameters
      window.open('https://codesandbox.io/', '_blank');
    }
  }, [files]);

  const retryConnection = () => {
    setSandpackError(false);
    setRetryCount(prev => prev + 1);
  };

  // Memoize tab handlers
  const handleCodeTab = useCallback(() => setActiveTab('code'), []);
  const handlePreviewTab = useCallback(() => setActiveTab('preview'), []);
  const handleCloseModal = useCallback(() => setShowModal(false), []);

  // Show welcome message when no messages
  if (!messages || messages.length === 0) {
    return (
      <div className='h-[74vh] bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 shadow-xl flex items-center justify-center'>
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <span className="text-3xl">💻</span>
          </div>
          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
            Ready to Code
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Start by describing what you want to build in the chat. Your code will appear here with live preview.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='relative'>
      <div className='bg-[#181818] w-full p-2 border -mt-10'>
        <div className='flex gap-3 items-center justify-between'>
          <div className='flex gap-3 items-center justify-center flex-wrap shrink-0 bg-black p-1 w-[140px] rounded-full'>
            <h2 className={`text-sm cursor-pointer ${activeTab == 'code' && 'text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full'}`}
              onClick={handleCodeTab}>Code</h2>
            <h2 className={`text-sm cursor-pointer ${activeTab == 'preview' && 'text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full'}`}
              onClick={handlePreviewTab}>Preview</h2>
          </div>
          
          <div className='flex gap-2 items-center'>
            {sandpackError && (
              <button
                onClick={retryConnection}
                className='flex items-center gap-1 px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded-md transition-colors'
              >
                <RefreshCw className='w-3 h-3' />
                Retry
              </button>
            )}
            <button
              onClick={downloadProject}
              className='flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-md transition-colors'
              title='Download Project'
            >
              <svg className='w-3 h-3' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download
            </button>
            <button
              onClick={openInCodeSandbox}
              className='flex items-center gap-1 px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white text-xs rounded-md transition-colors'
              title='Open in CodeSandbox'
            >
              <ExternalLink className='w-3 h-3' />
              CodeSandbox
            </button>
          </div>
        </div>
      </div>

      {sandpackError ? (
        <div className='h-[74vh] bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-b-lg border border-gray-200/50 dark:border-gray-700/50 shadow-xl flex flex-col items-center justify-center text-center p-8'>
          <div className='bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-500/30 rounded-lg p-6 max-w-md'>
            <AlertTriangle className='w-12 h-12 text-red-500 mx-auto mb-4' />
            <h3 className='text-red-600 dark:text-red-400 font-semibold mb-2'>Preview Connection Failed</h3>
            <p className='text-gray-600 dark:text-gray-300 text-sm mb-4'>
              Sandpack couldn't connect to the runtime server. This might be due to network issues or server availability.
            </p>
            <div className='flex gap-2 justify-center'>
              <button
                onClick={retryConnection}
                className='flex items-center gap-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded-md transition-colors'
              >
                <RefreshCw className='w-4 h-4' />
                Retry Connection
              </button>
              <button
                onClick={openInCodeSandbox}
                className='flex items-center gap-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-md transition-colors'
              >
                <ExternalLink className='w-4 h-4' />
                Open Sandbox
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-b-lg border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <SandpackProvider 
            key={retryCount} // Force re-render on retry
            template='react'
            theme={'dark'} 
            files={files}
            options={{
              externalResources: ['https://unpkg.com/@tailwindcss/browser@4']
            }}
            customSetup={{
              dependencies: {
                ...Lookup.DEPENDENCY
              }
            }}
          >
            <SandpackLayout>
              {activeTab == 'code' && <>
                <SandpackFileExplorer 
                  style={{ height: '74vh' }} 
                  initialCollapsedFolder={["components/", "/public/"]} 
                />
                <SandpackCodeEditor style={{ height: '74vh' }} />
              </>}

              {activeTab == 'preview' && <>
                <SandpackPreview 
                  style={{ height: '74vh' }} 
                  showNavigator={true}
                />
              </>}

            </SandpackLayout>
          </SandpackProvider>
        </div>
      )}

      {loading && <LoadingSpinner />}

      {/* CodeSandbox Modal */}
      <CodeSandboxModal 
        isOpen={showModal}
        onClose={handleCloseModal}
        onOpenSandbox={openInCodeSandbox}
      />
    </div>
  )
}

export default CodeView