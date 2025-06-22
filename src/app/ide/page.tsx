"use client";
import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { IdeContextProvider } from '@/context/IdeContext';
import { Loader2Icon } from 'lucide-react';

// Lazy load the IDE component for better performance
const IDE = dynamic(() => import('./ide'), {
  loading: () => (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <Loader2Icon className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
        <p className="text-gray-300">Loading CodeCraft IDE...</p>
      </div>
    </div>
  ),
  ssr: false // Disable SSR for Monaco Editor compatibility
});

const IdePage = () => {
  return (
    <IdeContextProvider>
      <Suspense fallback={
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <Loader2Icon className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-gray-300">Initializing IDE...</p>
          </div>
        </div>
      }>
        <IDE />
      </Suspense>
    </IdeContextProvider>
  );
};

export default IdePage;