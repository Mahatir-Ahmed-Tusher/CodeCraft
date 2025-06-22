"use client";
import React, { useContext, useEffect, useState, useCallback, memo } from 'react';
import { MessageContext } from '@/data/context/MessageContext';
import { WorkspaceContext } from '@/data/context/WorkspaceContext';
import { ArrowRight, Link, Loader2Icon, Sparkles, Home, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import axios from 'axios';
import Lookup from '@/data/Lookup';
import Prompt from '@/data/Prompt';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Memoized message component for better performance
const MessageItem = memo(({ msg, index }: { msg: any; index: number }) => (
  <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg m-2 flex gap-5 items-start shadow-lg border border-gray-200/50 dark:border-gray-700/50'>
    <div className='w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white text-sm font-bold shadow-lg'>
      {msg.role === 'user' ? 'U' : 'AI'}
    </div>
    <div className='mt-1 flex-1'>
      <h2 className="text-gray-800 dark:text-gray-200">{msg.content}</h2>
    </div>
  </div>
));

MessageItem.displayName = 'MessageItem';

const HtmlWorkspace = () => {
  // Get context values without destructuring initially
  const messageContext = useContext(MessageContext);
  const workspaceContext = useContext(WorkspaceContext);

  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [previewContent, setPreviewContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const limitedSuggestions = [
    'Create a landing page',
    'Build a portfolio website',
    'Make a simple calculator'
  ];

  // Show loading state if contexts are not available
  if (!messageContext || !workspaceContext) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 dark:from-blue-950/50 dark:via-purple-950/50 dark:to-cyan-950/50 flex items-center justify-center'>
        <div className="text-center">
          <Loader2Icon className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-500" />
          <p className="text-gray-600 dark:text-gray-300">Loading workspace...</p>
        </div>
      </div>
    );
  }

  // Now safely destructure after confirming contexts exist
  const { messages, setMessages } = messageContext;
  const { files, setFiles } = workspaceContext;

  const GetAiResponse = useCallback(async () => {
    if (!messages.length) return;
    
    setLoading(true);
    setError(null);
    try {
      const PROMPT = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
      const result = await axios.post('/api/ai-chat', {
        prompt: PROMPT
      });
      const aiResponse = { role: 'ai', content: result.data.result };
      setMessages((prev: any) => [...prev, aiResponse]);
    } catch (error: any) {
      console.error('Error getting AI response:', error);
      const errorMessage = error.response?.data?.error || 'Failed to get AI response. Please try again.';
      setError(errorMessage);
      const errorResponse = { role: 'ai', content: `Sorry, I encountered an error: ${errorMessage}` };
      setMessages((prev: any) => [...prev, errorResponse]);
    }
    setLoading(false);
  }, [messages, setMessages, setLoading, setError]);

  const GenerateHtmlCode = useCallback(async () => {
    if (!messages.length) return;
    
    try {
      const HTML_PROMPT = `Generate a complete HTML/CSS/JavaScript project based on this request: ${JSON.stringify(messages)}

Create exactly 3 files:
1. index.html - Complete HTML structure with embedded CSS and JavaScript
2. style.css - External CSS file (if needed for organization)
3. script.js - External JavaScript file (if needed for functionality)

Requirements:
- Use modern HTML5, CSS3, and vanilla JavaScript
- Make it responsive and mobile-friendly
- Include proper meta tags and structure
- Use beautiful styling with gradients, shadows, and animations
- Ensure the HTML file can run standalone
- Add interactive elements where appropriate

Return JSON format:
{
  "projectTitle": "",
  "explanation": "",
  "files": {
    "/index.html": { "code": "complete HTML with embedded styles and scripts" },
    "/style.css": { "code": "additional CSS if needed" },
    "/script.js": { "code": "JavaScript functionality" }
  }
}`;

      const result = await axios.post('/api/ai-code', {
        prompt: HTML_PROMPT
      });

      const aiResponse = result.data;
      setFiles(aiResponse?.files || {});
    } catch (error: any) {
      console.error('Error generating HTML code:', error);
      const errorMessage = error.response?.data?.error || 'Failed to generate code. Please try again.';
      setError(errorMessage);
    }
  }, [messages, setFiles, setError]);

  useEffect(() => {
    if (messages.length > 0) {
      const role = messages[messages.length - 1].role;
      if (role === 'user') {
        GetAiResponse();
        GenerateHtmlCode();
      }
    }
  }, [messages, GetAiResponse, GenerateHtmlCode]);

  const updatePreview = useCallback(() => {
    if (files && files['/index.html']) {
      let htmlContent = files['/index.html'].code || files['/index.html'];
      
      // Inject CSS if external file exists
      if (files['/style.css']) {
        const cssContent = files['/style.css'].code || files['/style.css'];
        htmlContent = htmlContent.replace(
          '</head>',
          `<style>${cssContent}</style></head>`
        );
      }
      
      // Inject JavaScript if external file exists
      if (files['/script.js']) {
        const jsContent = files['/script.js'].code || files['/script.js'];
        htmlContent = htmlContent.replace(
          '</body>',
          `<script>${jsContent}</script></body>`
        );
      }
      
      setPreviewContent(htmlContent);
    }
  }, [files]);

  useEffect(() => {
    if (files && files['/index.html']) {
      updatePreview();
    }
  }, [files, updatePreview]);

  const enhanceWithAI = useCallback(async () => {
    if (!userInput.trim()) return;
    
    setEnhancing(true);
    setError(null);
    try {
      const enhancePrompt = `Enhance this user prompt to be more detailed and specific for building a web application. Make it clear, actionable, and include relevant features. Original prompt: "${userInput}"`;
      
      const result = await axios.post('/api/ai-chat', {
        prompt: enhancePrompt
      });
      
      const enhancedPrompt = result.data.result;
      setUserInput(enhancedPrompt);
    } catch (error: any) {
      console.error('Error enhancing prompt:', error);
      const errorMessage = error.response?.data?.error || 'Failed to enhance prompt. Please try again.';
      setError(errorMessage);
    }
    setEnhancing(false);
  }, [userInput, setEnhancing, setError]);

  const onGenerate = useCallback((input: string) => {
    setMessages((prev: any) => [...prev, { role: 'user', content: input }]);
    setUserInput('');
    setError(null);
  }, [setMessages, setError]);

  const downloadProject = useCallback(async () => {
    if (!files || Object.keys(files).length === 0) return;

    const zip = new JSZip();
    
    Object.keys(files).forEach(filePath => {
      const fileName = filePath.startsWith('/') ? filePath.slice(1) : filePath;
      const fileContent = files[filePath].code || files[filePath];
      zip.file(fileName, fileContent);
    });

    try {
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'CodeCraft-HTML-Project.zip');
    } catch (error) {
      console.error('Error creating ZIP file:', error);
      setError('Failed to download project. Please try again.');
    }
  }, [files, setError]);

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 dark:from-blue-950/50 dark:via-purple-950/50 dark:to-cyan-950/50'>
      {/* Header */}
      <div className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">HTML Workspace</span>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={downloadProject}
              disabled={!files || Object.keys(files).length === 0}
              variant="outline"
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Download ZIP
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="/">
                <Home className="w-4 h-4 mr-2" />
                Home
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-500/30 rounded-lg p-4 m-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <Button 
            onClick={() => setError(null)} 
            variant="outline" 
            size="sm" 
            className="mt-2"
          >
            Dismiss
          </Button>
        </div>
      )}

      <div className='p-10'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-7'>
          {/* Chat Section */}
          <div className='relative h-[76vh] flex flex-col'>
            {messages.length === 0 ? (
              <div className='relative h-[76vh] flex flex-col items-center justify-center pt-8'>
                <div className="text-center max-w-2xl mx-auto mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                    <span className="text-2xl">💻</span>
                  </div>
                  <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
                    HTML/CSS/JS Workspace
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                    Build beautiful static websites with vanilla web technologies
                  </p>
                </div>

                <div className="w-full max-w-2xl">
                  <div className="p-5 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl">
                    <div className="flex gap-2 mb-3">
                      <textarea
                        placeholder="Describe your website idea..."
                        className="outline-none bg-transparent w-full h-24 max-h-56 resize-none text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                        onChange={(e) => setUserInput(e.target.value)}
                        value={userInput}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            onGenerate(userInput);
                          }
                        }}
                      />
                      {userInput && (
                        <ArrowRight
                          onClick={() => onGenerate(userInput)}
                          className="bg-gradient-to-r from-orange-500 to-red-500 p-2 h-10 w-10 rounded-md cursor-pointer hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 text-white shadow-lg transition-all duration-200"
                        />
                      )}
                    </div>
                    
                    {userInput && (
                      <div className="flex justify-end">
                        <Button
                          onClick={enhanceWithAI}
                          disabled={enhancing}
                          variant="outline"
                          size="sm"
                          className="text-xs border-orange-200 hover:bg-orange-50 dark:border-orange-700 dark:hover:bg-orange-900/20"
                        >
                          {enhancing ? (
                            <Loader2Icon className="w-3 h-3 mr-1 animate-spin" />
                          ) : (
                            <Sparkles className="w-3 h-3 mr-1" />
                          )}
                          ✨ Enhance with AI
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                    {limitedSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => onGenerate(suggestion)}
                        className="p-2 px-4 border border-gray-300 dark:border-gray-600 rounded-full text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:border-orange-400 dark:hover:border-red-400 cursor-pointer transition-all duration-200 bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className='flex-1 overflow-y-scroll no-scrollbar'>
                  {Array.isArray(messages) && messages?.map((msg: any, index: number) => (
                    <MessageItem key={index} msg={msg} index={index} />
                  ))}
                  {loading && (
                    <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg m-2 flex gap-5 items-start shadow-lg border border-gray-200/50 dark:border-gray-700/50'>
                      <Loader2Icon className='animate-spin text-orange-500' />
                      <h2 className="text-gray-800 dark:text-gray-200">Generating response...</h2>
                    </div>
                  )}
                </div>
                
                <div className="p-5 border-2 border-gray-200 dark:border-gray-700 rounded-xl max-w-xl w-full mt-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl">
                  <div className="flex gap-2 mb-3">
                    <textarea
                      placeholder="Continue the conversation..."
                      className="outline-none bg-transparent w-full h-24 max-h-56 resize-none text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                      onChange={(e) => setUserInput(e.target.value)}
                      value={userInput}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          onGenerate(userInput);
                        }
                      }}
                    />
                    {userInput && (
                      <ArrowRight
                        onClick={() => onGenerate(userInput)}
                        className="bg-gradient-to-r from-orange-500 to-red-500 p-2 h-10 w-10 rounded-md cursor-pointer hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 text-white shadow-lg transition-all duration-200"
                      />
                    )}
                  </div>
                  
                  {userInput && (
                    <div className="flex justify-end">
                      <Button
                        onClick={enhanceWithAI}
                        disabled={enhancing}
                        variant="outline"
                        size="sm"
                        className="text-xs border-orange-200 hover:bg-orange-50 dark:border-orange-700 dark:hover:bg-orange-900/20"
                      >
                        {enhancing ? (
                          <Loader2Icon className="w-3 h-3 mr-1 animate-spin" />
                        ) : (
                          <Sparkles className="w-3 h-3 mr-1" />
                        )}
                        ✨ Enhance with AI
                      </Button>
                    </div>
                  )}
                  
                  <div>
                    <Link className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Code/Preview Section */}
          <div className='col-span-2 relative'>
            {!messages || messages.length === 0 ? (
              <div className='h-[74vh] bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 shadow-xl flex items-center justify-center'>
                <div className="text-center max-w-md">
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                    <span className="text-3xl">💻</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    Ready to Build
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Start by describing your website idea. Your HTML, CSS, and JavaScript will appear here with live preview.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm w-full p-2 border border-gray-200/50 dark:border-gray-700/50 rounded-t-lg shadow-lg -mt-10'>
                  <div className='flex gap-3 items-center justify-between'>
                    <div className='flex gap-3 items-center justify-center flex-wrap shrink-0 bg-gray-100 dark:bg-gray-900 p-1 w-[140px] rounded-full'>
                      <h2 className={`text-sm cursor-pointer transition-all duration-200 ${activeTab == 'code' && 'text-orange-500 bg-orange-500 bg-opacity-25 p-1 px-2 rounded-full'}`}
                        onClick={() => setActiveTab('code')}>Code</h2>
                      <h2 className={`text-sm cursor-pointer transition-all duration-200 ${activeTab == 'preview' && 'text-orange-500 bg-orange-500 bg-opacity-25 p-1 px-2 rounded-full'}`}
                        onClick={() => setActiveTab('preview')}>Preview</h2>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-b-lg border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
                  {activeTab === 'code' ? (
                    <div className="h-[74vh] p-4 overflow-auto">
                      {files && Object.keys(files).map((filePath) => (
                        <div key={filePath} className="mb-6">
                          <div className="flex items-center gap-2 mb-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-t-lg">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{filePath}</span>
                          </div>
                          <pre className="bg-gray-900 text-green-400 p-4 rounded-b-lg overflow-x-auto text-sm">
                            <code>{files[filePath].code || ''}</code>
                          </pre>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-[74vh]">
                      {previewContent ? (
                        <iframe
                          srcDoc={previewContent}
                          className="w-full h-full border-0 rounded-b-lg"
                          title="Live Preview"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-gray-500 dark:text-gray-400">No preview available</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HtmlWorkspace;