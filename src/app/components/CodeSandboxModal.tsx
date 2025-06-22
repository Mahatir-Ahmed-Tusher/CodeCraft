"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, X, Sparkles } from 'lucide-react';

interface CodeSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSandbox: () => void;
}

const CodeSandboxModal: React.FC<CodeSandboxModalProps> = ({ isOpen, onClose, onOpenSandbox }) => {
  const [showModal, setShowModal] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (isOpen) {
      // Delay showing the modal for a smooth animation
      timerRef.current = setTimeout(() => {
        setShowModal(true);
        timerRef.current = null;
      }, 500);
    } else {
      setShowModal(false);
    }

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isOpen]);

  // Additional cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  return (
    <Dialog open={showModal} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border-2 border-blue-200/50 dark:border-purple-500/50">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🎉 Code Generated Successfully!
            </DialogTitle>
          </div>
          <DialogDescription className="text-base text-gray-600 dark:text-gray-300">
            Your web application has been generated! For the best preview experience, we recommend opening it in CodeSandbox.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 mt-4">
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-lg p-4 border border-yellow-200/50 dark:border-orange-500/30">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-1">Preview Instructions</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  ⚠️ Preview not available. Please click the "Preview" tab above. Once it fails, the real "Open Sandbox" option will appear there. Click that to continue in CodeSandbox.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg p-4 border border-blue-200/50 dark:border-purple-500/30">
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">✨ Why CodeSandbox?</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Live preview with instant updates</li>
              <li>• Better performance and reliability</li>
              <li>• Full editing capabilities</li>
              <li>• Easy sharing and collaboration</li>
            </ul>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1 border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
            >
              Got it, thanks!
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CodeSandboxModal;