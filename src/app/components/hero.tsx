"use client";
import { ArrowRight, Link } from 'lucide-react';
import React, { useContext, useState } from 'react';
import { MessageContext } from '@/data/context/MessageContext';
import { WorkspaceContext } from '@/data/context/WorkspaceContext';
import Lookup from '@/data/Lookup';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

const Hero = () => {
  const [userInput, setUserInput] = useState('');
  const messageContext = useContext(MessageContext);
  const workspaceContext = useContext(WorkspaceContext);
  const router = useRouter();

  if (!messageContext || !workspaceContext) {
    throw new Error('MessageContext or WorkspaceContext is not provided');
  }

  const { messages, setMessages } = messageContext;
  const { setWorkspaceId, setFiles } = workspaceContext;

  const onGenerate = async (input: string) => {
    const msg = {
      role: 'user',
      content: input,
    };
    
    // Generate a new workspace ID
    const newWorkspaceId = uuidv4();
    setWorkspaceId(newWorkspaceId);
    setMessages([msg]);
    setFiles(Lookup.DEFAULT_FILE);
    
    // Navigate to workspace
    router.push('/workspace/' + newWorkspaceId);
  };

  return (
    <div className="flex flex-col items-center justify-center mt-36 xl:mt-45 gap-2">
      <h2 className="font-bold text-4xl">{Lookup.HERO_HEADING}</h2>
      <p className="text-gray-400 font-medium">{Lookup.HERO_DESC}</p>

      <div className="p-5 border rounded-xl max-w-xl w-full mt-3 bg-[#151515]">
        <div className="flex gap-2 ">
        <textarea
            placeholder={Lookup.INPUT_PLACEHOLDER}
            className="outline-none bg-transparent w-full h-24 max-h-56 resize-none"
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
              onKeyDown={(e) => e.key === 'Enter' && onGenerate(userInput)}
              tabIndex={0}
              className="bg-blue-500 p-2 h-10 w-10 rounded-md cursor-pointer hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            />
          )}
        </div>
        <div>
          <Link className="h-5 w-5" />
        </div>
      </div>
      <div className="flex flex-wrap max-w-2xl items-center justify-center gap-3 mt-5">
        {Lookup.SUGGESTIONS.map((suggestion, index) => (
          <h2
            key={index}
            onClick={() => onGenerate(suggestion)}
            className="p-1 px-2 border rounded-full text-sm text-gray-400 hover:text-white cursor-pointer"
          >
            {suggestion}
          </h2>
        ))}
      </div>
    </div>
  );
};

export default Hero;