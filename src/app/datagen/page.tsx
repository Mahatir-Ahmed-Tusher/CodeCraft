"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Database, 
  MessageSquare, 
  BarChart3, 
  Cpu, 
  Home, 
  ArrowRight,
  Sparkles,
  FileText,
  TrendingUp,
  Zap,
  Target,
  Code
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const DataGenPage = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sections = [
    {
      id: 'nlp',
      title: 'NLP Pipelines',
      description: 'Build powerful natural language processing workflows with pre-trained models and custom pipelines.',
      icon: <MessageSquare className="w-8 h-8" />,
      features: [
        'Text Classification & Sentiment Analysis',
        'Named Entity Recognition (NER)',
        'Language Translation & Summarization',
        'Custom Model Training & Fine-tuning'
      ],
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50'
    },
    {
      id: 'dataset',
      title: 'Dataset Generation',
      description: 'Generate synthetic datasets for training, testing, and validation with AI-powered data creation.',
      icon: <Database className="w-8 h-8" />,
      features: [
        'Synthetic Data Generation',
        'Data Augmentation & Transformation',
        'Custom Schema Definition',
        'Export in Multiple Formats (CSV, JSON, Parquet)'
      ],
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50'
    },
    {
      id: 'chat',
      title: 'Chat with Dataset',
      description: 'Interact with your data using natural language queries and get instant insights.',
      icon: <Brain className="w-8 h-8" />,
      features: [
        'Natural Language Queries',
        'Automated Data Analysis',
        'Interactive Q&A with Data',
        'Smart Recommendations & Insights'
      ],
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50'
    },
    {
      id: 'visualization',
      title: 'Data Visualization',
      description: 'Create stunning interactive visualizations and dashboards from your data automatically.',
      icon: <BarChart3 className="w-8 h-8" />,
      features: [
        'Automated Chart Generation',
        'Interactive Dashboards',
        'Custom Visualization Templates',
        'Real-time Data Updates'
      ],
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50'
    },
    {
      id: 'ml',
      title: 'Machine Learning Pipeline',
      description: 'Build, train, and deploy ML models with automated pipeline creation and optimization.',
      icon: <Cpu className="w-8 h-8" />,
      features: [
        'AutoML Model Selection',
        'Automated Feature Engineering',
        'Model Training & Validation',
        'One-Click Deployment'
      ],
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50'
    }
  ];

  const stats = [
    { label: 'Models Trained', value: '10K+', icon: <Target className="w-5 h-5" /> },
    { label: 'Datasets Generated', value: '50K+', icon: <Database className="w-5 h-5" /> },
    { label: 'Active Users', value: '5K+', icon: <Brain className="w-5 h-5" /> },
    { label: 'Success Rate', value: '98%', icon: <TrendingUp className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 dark:from-blue-950/50 dark:via-purple-950/50 dark:to-cyan-950/50">
      {/* Header */}
      <div className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">CodeCraft DataGenie</span>
          </Link>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>
        
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 border-0 shadow-lg">
            🧠 AI-Powered Data Science • No Code Required
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent">
              DataGenie
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
              AI Data Science
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Transform your data into insights with AI-powered data science tools. No coding experience required.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 shadow-lg"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="text-green-500">{stat.icon}</div>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">{stat.value}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Complete Data Science Toolkit
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need for modern data science workflows
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`h-full cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 ${
                    activeSection === section.id 
                      ? 'border-green-500 shadow-2xl ring-4 ring-green-500/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
                  } bg-gradient-to-br ${section.bgColor} backdrop-blur-sm`}
                  onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                >
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${section.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg`}>
                      {section.icon}
                    </div>
                    <CardTitle className="text-xl font-bold">{section.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="text-center">
                    <CardDescription className="text-gray-600 dark:text-gray-300 mb-6">
                      {section.description}
                    </CardDescription>
                    
                    <div className="space-y-3 mb-6">
                      {section.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex-shrink-0"></div>
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      className={`w-full bg-gradient-to-r ${section.color} hover:opacity-90 text-white shadow-lg`}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle try button click
                      }}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Try {section.title}
                    </Button>
                    
                    {activeSection === section.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700"
                      >
                        <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-300 font-medium">
                          <Sparkles className="w-4 h-4" />
                          Coming Soon - Advanced Features
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-green-50 via-emerald-50 to-cyan-50 dark:from-green-950/50 dark:via-emerald-950/50 dark:to-cyan-950/50">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Ready to Transform Your Data?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of data scientists and analysts using DataGenie
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-green-500 via-emerald-500 to-cyan-500 hover:from-green-600 hover:via-emerald-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-200 shadow-xl">
                <Brain className="w-5 h-5 mr-2" />
                Start with DataGenie
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-green-200 dark:border-green-800 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 dark:hover:from-green-900/20 dark:hover:to-emerald-900/20 transform hover:scale-105 transition-all duration-200">
                <FileText className="w-5 h-5 mr-2" />
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4 bg-muted/10">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">DataGenie</span>
              </div>
              <p className="text-muted-foreground text-sm">
                AI-powered data science made simple
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#nlp" className="hover:text-foreground transition-colors">NLP Pipelines</a></li>
                <li><a href="#dataset" className="hover:text-foreground transition-colors">Dataset Generation</a></li>
                <li><a href="#chat" className="hover:text-foreground transition-colors">Chat with Data</a></li>
                <li><a href="#visualization" className="hover:text-foreground transition-colors">Visualization</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Examples</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API Reference</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">CodeCraft Suite</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/" className="hover:text-foreground transition-colors">CodeCraft Home</Link></li>
                <li><Link href="/ide" className="hover:text-foreground transition-colors">CodeCraft IDE</Link></li>
                <li><Link href="/chat" className="hover:text-foreground transition-colors">AI Chat</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DataGenPage;