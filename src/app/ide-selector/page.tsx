"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code, Globe, Server, ArrowRight, Sparkles, Home, Cpu, FileCode, Coffee } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

type ProjectType = 'html' | 'react' | 'nodejs' | 'cpp' | 'c' | 'java' | 'python';

const IDESelectorPage = () => {
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
    },
    {
      id: 'cpp' as ProjectType,
      title: 'C++',
      description: 'High-performance system programming',
      icon: <Cpu className="w-8 h-8" />,
      features: ['System programming', 'High performance', 'Memory control', 'Cross-platform'],
      color: 'from-blue-600 to-indigo-600',
      bgColor: 'from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50'
    },
    {
      id: 'c' as ProjectType,
      title: 'C',
      description: 'Low-level programming and embedded systems',
      icon: <FileCode className="w-8 h-8" />,
      features: ['Low-level programming', 'Embedded systems', 'Operating systems', 'Hardware control'],
      color: 'from-gray-600 to-gray-800',
      bgColor: 'from-gray-50 to-gray-100 dark:from-gray-950/50 dark:to-gray-900/50'
    },
    {
      id: 'java' as ProjectType,
      title: 'Java',
      description: 'Enterprise applications and cross-platform development',
      icon: <Coffee className="w-8 h-8" />,
      features: ['Enterprise apps', 'Cross-platform', 'Object-oriented', 'Large-scale systems'],
      color: 'from-red-500 to-orange-500',
      bgColor: 'from-red-50 to-orange-50 dark:from-red-950/50 dark:to-orange-950/50'
    },
    {
      id: 'python' as ProjectType,
      title: 'Python',
      description: 'Data science, AI, and rapid prototyping',
      icon: <Sparkles className="w-8 h-8" />,
      features: ['Data science', 'Machine learning', 'Web development', 'Automation'],
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50'
    }
  ];

  // Auto-navigate when a project type is selected
  const handleProjectTypeSelect = (type: ProjectType) => {
    setSelectedType(type);
    // Immediate navigation to IDE with selected type
    router.push(`/ide?type=${type}`);
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
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">CodeCraft IDE</span>
          </Link>
          
          <Link href="/">
            <Button variant="outline" size="sm">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Code className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
            Choose Your Programming Environment
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Select your preferred programming language and framework to start coding in CodeCraft IDE
          </p>
          
          <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 border-0 shadow-lg">
            ✨ Instant access - no additional clicks required
          </Badge>
        </div>

        {/* Project Type Selection */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
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
                  <CardTitle className="text-lg font-bold">{type.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="text-center">
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                    {type.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    {type.features.map((feature, i) => (
                      <div key={i} className="flex items-center justify-center gap-2 text-xs">
                        <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center justify-center gap-2 text-blue-700 dark:text-blue-300 font-medium text-xs">
                      <ArrowRight className="w-3 h-3" />
                      Click to Launch IDE
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
              🚀 What you get with CodeCraft IDE
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>• Full-featured code editor with syntax highlighting</li>
              <li>• Live preview for web applications</li>
              <li>• Integrated terminal for running code</li>
              <li>• File management and project organization</li>
              <li>• Download projects as ZIP files</li>
            </ul>
          </Card>
          
          <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl">
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">
              💡 Perfect for
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>• Learning new programming languages</li>
              <li>• Rapid prototyping and experimentation</li>
              <li>• Building small to medium projects</li>
              <li>• Teaching and educational purposes</li>
              <li>• Code sharing and collaboration</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IDESelectorPage;