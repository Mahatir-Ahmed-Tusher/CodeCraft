"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code, Globe, Server, ArrowRight, Sparkles, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

type ProjectType = 'html' | 'react' | 'nodejs';

const OnboardingPage = () => {
  const [selectedType, setSelectedType] = useState<ProjectType | null>(null);
  const router = useRouter();

  const projectTypes = [
    {
      id: 'html' as ProjectType,
      title: 'HTML / CSS / JavaScript',
      description: 'Build static websites with vanilla web technologies',
      icon: <Globe className="w-8 h-8" />,
      features: ['Static websites', 'Landing pages', 'Simple web apps', 'No build process'],
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50'
    },
    {
      id: 'react' as ProjectType,
      title: 'React',
      description: 'Create modern, interactive web applications',
      icon: <Code className="w-8 h-8" />,
      features: ['Component-based', 'Interactive UIs', 'Modern JavaScript', 'Rich ecosystem'],
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50'
    },
    {
      id: 'nodejs' as ProjectType,
      title: 'Node.js',
      description: 'Build server-side applications and APIs',
      icon: <Server className="w-8 h-8" />,
      features: ['Backend APIs', 'Server applications', 'Database integration', 'Full-stack apps'],
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50'
    }
  ];

  // Auto-navigate when a project type is selected
  const handleProjectTypeSelect = (type: ProjectType) => {
    setSelectedType(type);
    
    // Immediate navigation based on project type
    if (type === 'html') {
      router.push('/workspace/html/new');
    } else {
      router.push('/workspace/advanced/new');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 dark:from-blue-950/50 dark:via-purple-950/50 dark:to-cyan-950/50">
      {/* Header */}
      <div className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
              <Code className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">CodeCraft</span>
          </Link>
          
          <Link href="/">
            <Button variant="outline" size="sm">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
            What type of web project would you like to build?
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Choose your preferred technology stack to get started with the perfect development environment
          </p>
          
          <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 border-0 shadow-lg">
            ✨ Instant workspace access - no extra clicks needed
          </Badge>
        </div>

        {/* Project Type Selection */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {projectTypes.map((type, index) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 bg-gradient-to-br ${type.bgColor} backdrop-blur-sm h-full`}
                onClick={() => handleProjectTypeSelect(type.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${type.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg`}>
                    {type.icon}
                  </div>
                  <CardTitle className="text-xl font-bold">{type.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="text-center">
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {type.description}
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    {type.features.map((feature, index) => (
                      <div key={index} className="flex items-center justify-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center justify-center gap-2 text-blue-700 dark:text-blue-300 font-medium">
                      <ArrowRight className="w-4 h-4" />
                      Click to Start Building
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Info Section */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl">
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">
              🚀 What happens next?
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>• Get a customized workspace for your project type</li>
              <li>• Start building with AI-powered code generation</li>
              <li>• Preview your app in real-time</li>
              <li>• Download your project as a ZIP file</li>
            </ul>
          </Card>
          
          <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl">
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">
              💡 Need help deciding?
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>• <strong>HTML/CSS/JS:</strong> Simple websites and landing pages</li>
              <li>• <strong>React:</strong> Interactive web applications</li>
              <li>• <strong>Node.js:</strong> Backend services and APIs</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;