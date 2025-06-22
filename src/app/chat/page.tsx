"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Copy, Download, Code, Bug, MessageSquare, Sparkles, User, Bot } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatPage = () => {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugCode, setDebugCode] = useState('');
  const [debugError, setDebugError] = useState('');
  const [debugLoading, setDebugLoading] = useState(false);
  const [debugResult, setDebugResult] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'debug'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (mounted) {
      scrollToBottom();
    }
  }, [messages, mounted]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('/api/ai-chat', {
        prompt: `You are CodeCraft AI, a helpful coding assistant. Respond to: ${input}`
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.result || 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setLoading(false);
  };

  const processDebugSubmission = async () => {
    if (!debugCode.trim() || !debugError.trim() || debugLoading) return;

    setDebugLoading(true);
    try {
      const debugPrompt = `Act as a senior developer. Fix the following code based on this error log. Return only the corrected code with brief explanation.

CODE:
${debugCode}

ERROR LOG:
${debugError}`;

      const response = await axios.post('/api/ai-chat', {
        prompt: debugPrompt
      });

      setDebugResult(response.data.result || 'Sorry, I encountered an error while debugging. Please try again.');
    } catch (error) {
      console.error('Error debugging code:', error);
      setDebugResult('Sorry, I encountered an error while debugging. Please try again.');
    }
    setDebugLoading(false);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const downloadCode = (code: string) => {
    try {
      const blob = new Blob([code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'fixed-code.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download code:', error);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 dark:from-blue-950/50 dark:via-purple-950/50 dark:to-cyan-950/50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 dark:from-blue-950/50 dark:via-purple-950/50 dark:to-cyan-950/50">
      {/* Header */}
      <div className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">CodeCraft AI</span>
          </Link>
          
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'chat' ? 'default' : 'outline'}
              onClick={() => setActiveTab('chat')}
              size="sm"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
            </Button>
            <Button
              variant={activeTab === 'debug' ? 'default' : 'outline'}
              onClick={() => setActiveTab('debug')}
              size="sm"
            >
              <Bug className="w-4 h-4 mr-2" />
              Debug
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {activeTab === 'chat' ? (
          // Chat Interface
          <div className="flex flex-col h-[calc(100vh-200px)]">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-6">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                    Chat with CodeCraft AI
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Get coding help, ask questions, or discuss your projects
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {[
                      "How do I center a div?",
                      "Explain React hooks",
                      "Debug my JavaScript code",
                      "Best practices for CSS"
                    ].map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setInput(suggestion)}
                        className="text-xs"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold shadow-lg flex-shrink-0">
                        {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <Card className={`p-4 ${message.role === 'user' ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' : 'bg-white/80 dark:bg-gray-800/80'} backdrop-blur-sm shadow-lg`}>
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                        {message.content.includes('```') && message.role === 'assistant' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(message.content)}
                            className="mt-2 text-xs"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </Button>
                        )}
                      </Card>
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex gap-4 justify-start">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                      <Bot className="w-4 h-4" />
                    </div>
                    <Card className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">Thinking...</span>
                      </div>
                    </Card>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <Card className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl">
              <div className="flex gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything about coding..."
                  className="flex-1 resize-none border-0 bg-transparent focus:outline-none text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                  rows={3}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 hover:from-blue-600 hover:via-purple-600 hover:to-cyan-600"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          // Debug Interface
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                🐞 AI Debug Assistant
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Paste your code and error log to get AI-powered debugging help
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Code Input */}
              <Card className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Code className="w-5 h-5 text-blue-500" />
                  <h3 className="font-semibold">Code Input 🧩</h3>
                </div>
                <textarea
                  value={debugCode}
                  onChange={(e) => setDebugCode(e.target.value)}
                  placeholder="Paste your problematic code here..."
                  className="w-full h-40 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </Card>

              {/* Error Log Input */}
              <Card className="p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Bug className="w-5 h-5 text-red-500" />
                  <h3 className="font-semibold">Error Log 🐞</h3>
                </div>
                <textarea
                  value={debugError}
                  onChange={(e) => setDebugError(e.target.value)}
                  placeholder="Paste your error message here..."
                  className="w-full h-40 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </Card>
            </div>

            {/* Debug Button */}
            <div className="text-center">
              <Button
                onClick={processDebugSubmission}
                disabled={!debugCode.trim() || !debugError.trim() || debugLoading}
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 px-8 py-3"
              >
                {debugLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Bug className="w-4 h-4 mr-2" />
                )}
                Debug Code
              </Button>
            </div>

            {/* Debug Result */}
            {debugResult && (
              <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Fixed Code</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(debugResult)}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      📋 Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadCode(debugResult)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      ⬇️ Download
                    </Button>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <ReactMarkdown>{debugResult}</ReactMarkdown>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;