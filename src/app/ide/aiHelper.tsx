import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

interface AIHelperProps {
  currentFileContent: string;
  onInsertCode: (code: string) => void;
}

export const AIHelper: React.FC<AIHelperProps> = ({ currentFileContent, onInsertCode }) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const callOpenRouter = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a coding assistant. Provide code or explanations based on the user prompt and context.' },
            { role: 'user', content: `File content:\n${currentFileContent}\n\nPrompt: ${prompt}` }
          ]
        })
      });
      const data = await res.json();
      setResponse(data.choices[0].message.content);
    } catch (error) {
      setResponse('Error: Could not connect to AI service.');
    }
    setIsLoading(false);
  };

  return (
    <>
      <motion.div
        className="fixed bottom-4 right-4"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button onClick={() => setIsOpen(true)} className="bg-gradient-to-r from-purple-500 to-pink-500">
          AI Helper
        </Button>
      </motion.div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle>AI Coding Assistant</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to code..."
            />
            <Button onClick={callOpenRouter} disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Generate Code'}
            </Button>
            {response && (
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded">
                <pre className="whitespace-pre-wrap">{response}</pre>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
            {response && (
              <Button onClick={() => onInsertCode(response)}>Insert Code</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};