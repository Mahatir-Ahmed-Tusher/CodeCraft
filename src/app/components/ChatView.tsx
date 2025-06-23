"use client"
import { useParams } from 'next/navigation';
import React, { useContext, useEffect, useState, memo, useCallback } from 'react';
import { MessageContext } from '@/data/context/MessageContext';
import { ArrowRight, Loader2Icon, Sparkles } from 'lucide-react';
import Lookup from '@/data/Lookup';
import axios from 'axios';
import Prompt from '@/data/Prompt';
import { Button } from '@/components/ui/button';

// Memoized message component for better performance
const MessageItem = memo(({ msg, index }: { msg: any; index: number }) => (
  <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg m-2 flex gap-5 items-start shadow-lg border border-gray-200/50 dark:border-gray-700/50'>
    <div className='w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold shadow-lg'>
      {msg.role === 'user' ? 'U' : 'AI'}
    </div>
    <div className='mt-1 flex-1'>
      <h2 className="text-gray-800 dark:text-gray-200">{msg.content}</h2>
    </div>
  </div>
));

MessageItem.displayName = 'MessageItem';

const ChatView = () => {
  const messageContext = useContext(MessageContext);
  
  // Safe fallback if context is not available
  if (!messageContext) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  const { messages, setMessages } = messageContext;
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);

  // Limited suggestions (3 only)
  const limitedSuggestions = [
    'Create a unit converter',
    'Make a functional calculator',
    'Make a todo app'
  ];

  const GetAiResponse = useCallback(async () => {
    setLoading(true);
    try {
      const PROMPT = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
      const result = await axios.post('/api/ai-chat', {
        prompt: PROMPT
      });
      const aiResponse = { role: 'ai', content: result.data.result };
      setMessages((prev: any) => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorResponse = { role: 'ai', content: 'Sorry, I encountered an error. Please try again.' };
      setMessages((prev: any) => [...prev, errorResponse]);
    }
    setLoading(false);
  }, [messages, setMessages]);

  useEffect(() => {
    if (messages.length > 0) {
      const role = messages[messages.length - 1].role;
      if (role === 'user') {
        GetAiResponse();
      }
    }
  }, [messages, GetAiResponse]);

  const enhanceWithAI = useCallback(async () => {
    if (!userInput.trim()) return;
    
    setEnhancing(true);
    try {
      const enhancePrompt = `Enhance this user prompt to be more detailed and specific for building a web application. Make it clear, actionable, and include relevant features. Original prompt: "${userInput}"`;
      
      const result = await axios.post('/api/ai-chat', {
        prompt: enhancePrompt
      });
      
      const enhancedPrompt = result.data.result;
      setUserInput(enhancedPrompt);
    } catch (error) {
      console.error('Error enhancing prompt:', error);
    }
    setEnhancing(false);
  }, [userInput]);

  const onGenerate = useCallback((input: any) => {
    setMessages((prev: any) => [...prev, { role: 'user', content: input }]);
    setUserInput('');
  }, [setMessages]);

  // Show Bolt.new style UI when no messages
  if (messages.length === 0) {
    return (
      <div className='relative h-[76vh] flex flex-col items-center justify-center pt-8'>
        {/* Bolt.new style hero section */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <span className="text-2xl">⚡</span>
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
            What do you want to build?
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Prompt, run, edit, and deploy full-stack web apps.
          </p>
        </div>

        {/* Input section */}
        <div className="w-full max-w-2xl">
          <div className="p-5 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl">
            <div className="flex gap-2 mb-3">
              <textarea
                placeholder={Lookup.INPUT_PLACEHOLDER}
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
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 p-2 h-10 w-10 rounded-md cursor-pointer hover:from-blue-600 hover:via-purple-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-white shadow-lg transition-all duration-200"
                />
              )}
            </div>
            
            {/* AI Enhance Button */}
            {userInput && (
              <div className="flex justify-end">
                <Button
                  onClick={enhanceWithAI}
                  disabled={enhancing}
                  variant="outline"
                  size="sm"
                  className="text-xs border-purple-200 hover:bg-purple-50 dark:border-purple-700 dark:hover:bg-purple-900/20"
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

          {/* Limited Suggestions */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            {limitedSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onGenerate(suggestion)}
                className="p-2 px-4 border border-gray-300 dark:border-gray-600 rounded-full text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:border-blue-400 dark:hover:border-purple-400 cursor-pointer transition-all duration-200 bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show chat interface when messages exist
  return (
    <div className='relative h-[76vh] flex flex-col'>
      <div className='flex-1 overflow-y-scroll no-scrollbar'>
        {Array.isArray(messages) && messages?.map((msg: any, index: number) => (
          <MessageItem key={index} msg={msg} index={index} />
        ))}
        {loading && (
          <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg m-2 flex gap-5 items-start shadow-lg border border-gray-200/50 dark:border-gray-700/50'>
            <Loader2Icon className='animate-spin text-blue-500' />
            <h2 className="text-gray-800 dark:text-gray-200">Generating response...</h2>
          </div>
        )}
      </div>
      {/* Input */}
      <div className="p-5 border-2 border-gray-200 dark:border-gray-700 rounded-xl max-w-xl w-full mt-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl">
        <div className="flex gap-2 mb-3">
          <textarea
            placeholder={Lookup.INPUT_PLACEHOLDER}
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
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 p-2 h-10 w-10 rounded-md cursor-pointer hover:from-blue-600 hover:via-purple-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-white shadow-lg transition-all duration-200"
            />
          )}
        </div>
        
        {/* AI Enhance Button */}
        {userInput && (
          <div className="flex justify-end">
            <Button
              onClick={enhanceWithAI}
              disabled={enhancing}
              variant="outline"
              size="sm"
              className="text-xs border-purple-200 hover:bg-purple-50 dark:border-purple-700 dark:hover:bg-purple-900/20"
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
    </div>
  );
};

export default ChatView;