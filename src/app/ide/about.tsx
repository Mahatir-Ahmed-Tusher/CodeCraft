import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 dark:from-blue-950/50 dark:via-purple-950/50 dark:to-cyan-950/50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-2xl"
      >
        <h1 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          About CodeCraft IDE
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          CodeCraft IDE is a modern, multi-language web development environment built for creators, learners, and professionals. It enables real-time code execution and AI-assisted development.
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          Created by <strong>Mahatir Ahmed Tusher</strong>, a graduate from VIT University, a problem solver and MLOps engineer passionate about democratizing code.
        </p>
        <div className="flex justify-center">
          <Button asChild>
            <Link href="/ide">Back to IDE</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default About;