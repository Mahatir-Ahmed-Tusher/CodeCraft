"use client";
import React, { useCallback, memo, useContext } from 'react';
import ChatView from '@/app/components/ChatView';
import CodeView from '@/app/components/CodeView';
import { Button } from '@/components/ui/button';
import { Home, Download, Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { WorkspaceContext } from '@/data/context/WorkspaceContext';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Memoized components for better performance
const MemoizedChatView = memo(ChatView);
const MemoizedCodeView = memo(CodeView);

MemoizedChatView.displayName = 'MemoizedChatView';
MemoizedCodeView.displayName = 'MemoizedCodeView';

const AdvancedWorkspace = () => {
  // Safe context consumption with fallback values
  const workspaceContext = useContext(WorkspaceContext);
  const files = workspaceContext?.files || {};

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
      
      console.log('Advanced workspace project downloaded successfully');
    } catch (error) {
      console.error('Error creating ZIP file:', error);
    }
  }, [files]);

  const getProjectName = useCallback((files: any) => {
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
      return 'react-advanced-project';
    } else if (files['/server.js']) {
      return 'nodejs-advanced-project';
    }
    
    return 'codecraft-advanced-project';
  }, []);

  // Show loading state if context is not available
  if (!workspaceContext) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 dark:from-blue-950/50 dark:via-purple-950/50 dark:to-cyan-950/50 flex items-center justify-center'>
        <div className="text-center">
          <Loader2Icon className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600 dark:text-gray-300">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 dark:from-blue-950/50 dark:via-purple-950/50 dark:to-cyan-950/50'>
      {/* Header */}
      <div className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Advanced Workspace</span>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={downloadProject}
              variant="outline"
              size="sm"
              disabled={!files || Object.keys(files).length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Download ZIP
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/" prefetch={true}>
                <Home className="w-4 h-4 mr-2" />
                Home
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className='p-10'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-7'>
          <MemoizedChatView />
          <div className='col-span-2'>
            <MemoizedCodeView />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedWorkspace;