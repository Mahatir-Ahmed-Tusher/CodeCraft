"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { 
  Code, 
  Zap, 
  Eye, 
  Download, 
  MessageSquare, 
  Rocket, 
  CheckCircle, 
  ArrowRight,
  Github,
  Twitter,
  Mail,
  Star,
  Users,
  Globe,
  Smartphone,
  Database,
  Layers,
  BarChart3,
  Sparkles,
  Monitor,
  Palette,
  Play,
  Brain
} from "lucide-react";
import { useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import Typed from "typed.js";

// Memoized components for better performance
const FeatureCard = memo(({ feature, index }: { feature: any; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
      <CardHeader>
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-lg flex items-center justify-center text-white mb-4 shadow-lg">
          {feature.icon}
        </div>
        <CardTitle className="text-xl">{feature.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">
          {feature.description}
        </CardDescription>
      </CardContent>
    </Card>
  </motion.div>
));

const UseCaseCard = memo(({ useCase, index }: { useCase: any; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    <Card className="text-center p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-lg">
        {useCase.icon}
      </div>
      <h3 className="text-2xl font-bold mb-4">{useCase.title}</h3>
      <p className="text-muted-foreground mb-6">{useCase.description}</p>
      <ul className="space-y-2">
        {useCase.examples.map((example: string, i: number) => (
          <li key={i} className="flex items-center justify-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-500" />
            {example}
          </li>
        ))}
      </ul>
    </Card>
  </motion.div>
));

const TestimonialCard = memo(({ testimonial, index }: { testimonial: any; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
      <div className="flex mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
      <div>
        <div className="font-semibold">{testimonial.name}</div>
        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
      </div>
    </Card>
  </motion.div>
));

// Cursor follower component
const CursorFollower = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className="fixed w-96 h-96 rounded-full opacity-20 pointer-events-none transition-all duration-1000 ease-out z-0"
      style={{
        background: `radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)`,
        left: mousePosition.x - 192,
        top: mousePosition.y - 192,
      }}
    />
  );
};

// Typing animation component
const TypingAnimation = () => {
  const el = React.useRef(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [
        'const app = createApp();',
        'function buildAmazing() { return "Hello World"; }',
        'npm start',
        'git commit -m "🚀 Deploy"',
        'console.log("Ready to build!");'
      ],
      typeSpeed: 50,
      backSpeed: 30,
      loop: true,
      showCursor: true,
      cursorChar: '|'
    });

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
      <div className="font-mono text-lg text-gray-600 dark:text-gray-400">
        <span ref={el}></span>
      </div>
    </div>
  );
};

// Simple animated fake code component for demo purposes
const AnimatedFakeCode = () => {
  const [step, setStep] = useState(0);
  const codeLines = [
    'import React, { useState } from "react";',
    "",
    "function TodoApp() {",
    "  const [todos, setTodos] = useState([]);",
    "  return (",
    "    <div>",
    '      <h1> CodeCraft Todo List</h1>',
    "    </div>",
   
  ];

  useEffect(() => {
    if (step < codeLines.length) {
      const timer = setTimeout(() => setStep(step + 1), 300);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <pre>
      <code>
        {codeLines.slice(0, step).join("\n")}
        {step < codeLines.length && <span className="animate-pulse">|</span>}
      </code>
    </pre>
  );
};

export default function Landing() {
  const [showFABMessage, setShowFABMessage] = useState(false);

  useEffect(() => {
    // Show FAB message on page load
    setShowFABMessage(true);
    const hideTimer = setTimeout(() => {
      setShowFABMessage(false);
    }, 5000);

    return () => clearTimeout(hideTimer);
  }, []);

  const features = [
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Natural Language to Code",
      description: "Describe your app in simple terms and watch it come to life instantly."
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Live Preview",
      description: "See your application running in real-time as you make changes."
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Modern Stack",
      description: "Generated apps use React, TypeScript, Tailwind CSS, and modern best practices."
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Export & Deploy",
      description: "Download your code as a ZIP file or deploy directly to the web."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "AI-powered generation creates complete applications in seconds."
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Full-Stack Ready",
      description: "Generate both frontend React apps and backend Node.js APIs."
    }
  ];

  const useCases = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Landing Pages",
      description: "Create stunning marketing websites and portfolios",
      examples: ["Business websites", "Personal portfolios", "Product showcases"]
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Web Applications",
      description: "Build interactive tools and productivity apps",
      examples: ["Todo managers", "Calculators", "Form builders"]
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Dashboard & Analytics",
      description: "Generate data visualization and admin panels",
      examples: ["Analytics dashboards", "Admin interfaces", "Charts & graphs"]
    }
  ];

  const testimonials = [
    {
      name: "Mashrufa Hasnin Nourin",
      role: "Student",
      content: "I used CodeCraft to build a class project with almost no coding experience. The AI-generated code gave me a solid starting point, and I could see changes live as I tweaked my prompt. It made learning React much less intimidating!",
      rating: 5
    },
    {
      name: "Tanvir Rahman",
      role: "Startup Founder",
      content: "As a founder, I needed to quickly validate an idea. CodeCraft let me generate a working MVP in a single afternoon. I still had to polish some parts, but it saved us days of setup and boilerplate.",
      rating: 5
    },
    {
      name: "Farzana Akter",
      role: "UI/UX Designer",
      content: "I tried CodeCraft to prototype a dashboard for a client. The natural language prompts made it easy to experiment with layouts and features. It’s not perfect, but it’s a huge time-saver for early design iterations.",
      rating: 4
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Cursor Follower */}
      <CursorFollower />

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50 group">
        <Link href="/chat">
          <div className="relative flex items-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                size="lg"
                className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 hover:scale-110 hover:shadow-[0_0_35px_rgba(99,102,241,0.8)] transition-all duration-300 ease-in-out border-4 border-white/80 dark:border-gray-800/80 shadow-2xl backdrop-blur-md"
              >
                <MessageSquare className="w-6 h-6 text-white" />
                {!showFABMessage && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-xs font-bold text-white">!</span>
                  </div>
                )}
              </Button>
            </motion.div>

            {showFABMessage && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="ml-4 px-4 py-2 rounded-xl bg-white dark:bg-gray-900 shadow-xl border border-blue-400/50 dark:border-purple-500/50 text-sm font-medium text-blue-700 dark:text-purple-300"
              >
                Chat with CodeCraft AI
              </motion.div>
            )}
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="border-b bg-gradient-to-r from-blue-50 via-purple-50 to-cyan-50 dark:from-blue-950/50 dark:via-purple-950/50 dark:to-cyan-950/50 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
              <Code className="w-4 h-4 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">CodeCraft</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors hover:scale-105 duration-200">Features</a>
            <a href="#use-cases" className="text-muted-foreground hover:text-foreground transition-colors hover:scale-105 duration-200">Use Cases</a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors hover:scale-105 duration-200">Testimonials</a>
            <Link href="/aboutus">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground transition-colors hover:scale-105 duration-200">
                About Us
              </Button>
            </Link>
            <a href="https://github.com/Mahatir-Ahmed-Tusher/CodeCraft" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm" className="hover:scale-110 transition-transform duration-200">
                <Github className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 dark:from-blue-950/50 dark:via-purple-950/50 dark:to-cyan-950/50">
        <TypingAnimation />
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <motion.div
          className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-10 blur-3xl"
          animate={{ 
        scale: [1, 1.2, 1],
        rotate: [0, 180, 360]
          }}
          transition={{ 
        duration: 20,
        repeat: Infinity,
        ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-r from-purple-400 to-cyan-500 rounded-full opacity-10 blur-3xl"
          animate={{ 
        scale: [1.2, 1, 1.2],
        rotate: [360, 180, 0]
          }}
          transition={{ 
        duration: 25,
        repeat: Infinity,
        ease: "linear"
          }}
        />
        
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
          >
        <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 border-0 shadow-lg">
          ✨ AI-Powered • No-Code • Open Source
        </Badge>
          </motion.div>
          
          <motion.h1
        className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
          >
        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent animate-gradient-x">
          Build Apps and Analyze Data with
        </span>
        <br />
        <span className="bg-gradient-to-r from-purple-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent animate-gradient-x">
          AI Magic
        </span>
          </motion.h1>
          
          <motion.p
        className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
          >
        Transform your ideas into fully functional web applications using natural language. No coding experience required.
          </motion.p>
          
          <motion.div
        className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
          >
        <Link href="/onboarding" prefetch={true}>
          <Button size="lg" className="w-full sm:w-auto px-8 py-4 text-lg bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 hover:from-blue-600 hover:via-purple-600 hover:to-cyan-600 transform hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25">
            <Rocket className="w-6 h-6 mr-3" />
            Generate Web-APP
          </Button>
        </Link>
        
        <Link href="/ide-selector" prefetch={true}>
          <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-4 text-lg border-2 border-purple-200 dark:border-purple-800 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-900/20 dark:hover:to-blue-900/20 transform hover:scale-110 transition-all duration-300 shadow-xl">
            <Monitor className="w-6 h-6 mr-3" />
            CodeCraft IDE
          </Button>
        </Link>

        <Link href="/datagen" prefetch={true}>
          <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-4 text-lg border-2 border-green-200 dark:border-green-800 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 dark:hover:from-green-900/20 dark:hover:to-emerald-900/20 transform hover:scale-110 transition-all duration-300 shadow-xl">
            <Brain className="w-6 h-6 mr-3" />
            DataGenie
          </Button>
        </Link>
          </motion.div>

          {/* Feature Preview */}
          <motion.div 
        className="mt-20 relative"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
          >
        <Card className="bg-card shadow-2xl overflow-hidden border-0 bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-gradient-to-r from-gray-50/90 to-white/90 dark:from-gray-800/90 dark:to-gray-900/90">
            <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
            </div>
            <div className="text-sm text-muted-foreground font-medium">CodeCraft Editor</div>
            <div className="w-6"></div>
          </div>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              Your Prompt
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-lg p-4 text-sm border border-blue-200/50 dark:border-blue-800/50">
              "Create a todo list app with React that has add, delete, and mark complete functionality"
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Code className="w-4 h-4 text-green-500" />
              Generated Code
            </div>
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-4 text-sm text-green-400 font-mono border shadow-inner min-h-[200px]">
              <AnimatedFakeCode />
            </div>
          </motion.div>
            </div>
          </CardContent>
        </Card>
          </motion.div>
        </div>
      </section>

      {/* DataGenie Promotion Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 dark:from-blue-950/50 dark:via-purple-950/50 dark:to-cyan-950/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <motion.div 
          animate={{ 
        scale: [1, 1.1, 1],
        opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
          }}
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-3xl"
        ></motion.div>
        
        <div className="container mx-auto relative z-10">
          <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto"
          >
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <div className="p-4 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full shadow-2xl">
          <Database className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
          DataGenie
            </h2>
            <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
          <Sparkles className="w-8 h-8 text-blue-500" />
            </motion.div>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-2xl text-gray-600 dark:text-gray-300 mb-4 font-medium"
          >
            Effortless AI-powered data analysis and visualization.
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-4xl mx-auto"
          >
            Instantly process, analyze, and visualize your data with DataGenie. No code required—just upload your dataset and let AI do the magic.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-6">
          {[
            { icon: <Zap className="w-6 h-6" />, title: "Data Processing", desc: "Effortlessly handle large datasets with powerful AI-driven tools" },
            { icon: <BarChart3 className="w-6 h-6" />, title: "Advanced Analytics", desc: "Generate insights with built-in machine learning and visualization" },
            { icon: <Database className="w-6 h-6" />, title: "Data Integration", desc: "Seamlessly connect and process data from multiple sources" }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="flex items-start gap-4"
            >
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg flex-shrink-0">
            <div className="text-white">{feature.icon}</div>
              </div>
              <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
            </div>

            <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
            >
          <Link href="/datagenie">
            <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 text-white font-semibold px-12 py-4 text-lg transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25">
              <Database className="w-6 h-6 mr-3" />
              Try DataGenie
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-sm text-gray-400 font-medium">DataGenie Console</div>
            <div className="w-6"></div>
          </div>
          <div className="p-6">
            <div className="space-y-3 text-sm font-mono">
              <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-blue-400"
              >
            $ datagenie analyze data.csv
              </motion.div>
              <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-green-400"
              >
            # AI-powered data analysis
              </motion.div>
              <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="text-purple-400"
              >
            model = train_model(data)
              </motion.div>
              <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="text-yellow-400 ml-4"
              >
            predictions = model.predict(X_test)
              </motion.div>
            </div>
          </div>
            </div>
            <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-3 shadow-lg"
            >
          <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <motion.div
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute -bottom-4 -left-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full p-3 shadow-lg"
            >
          <Database className="w-6 h-6 text-white" />
            </motion.div>
          </motion.div>
        </div>
          </motion.div>
        </div>
      </section>



      <section id="features" className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Everything You Need to Build Amazing Apps
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From idea to deployment in minutes, not months
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section id="use-cases" className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              What Can You Build?
            </h2>
            <p className="text-xl text-muted-foreground">
              From simple tools to complex applications
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <UseCaseCard key={index} useCase={useCase} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Highly Appreciated by Our Early Users
            </h2>
            <p className="text-xl text-muted-foreground">
              See what people are saying about CodeCraft
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 dark:from-blue-950/50 dark:via-purple-950/50 dark:to-cyan-950/50">
        <div className="container mx-auto text-center">
          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Ready to Build Your Next App?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join our journey, let's learn and grow together
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/onboarding" prefetch={true}>
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 hover:from-blue-600 hover:via-purple-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-200 shadow-xl">
                  Start Building Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              
              <Link href="/chat" prefetch={true}>
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-purple-200 dark:border-purple-800 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-900/20 dark:hover:to-blue-900/20 transform hover:scale-105 transition-all duration-200">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Try Chat Assistant
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4 bg-muted/10">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Code className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">CodeCraft</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Building the future of no-code development with AI
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/onboarding" className="hover:text-foreground transition-colors">Code Generator</Link></li>
                <li><Link href="/chat" className="hover:text-foreground transition-colors">AI Chat</Link></li>
                <li><Link href="/ide-selector" className="hover:text-foreground transition-colors">CodeCraft IDE</Link></li>
                <li><Link href="/datagen" className="hover:text-foreground transition-colors">DataGenie</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#use-cases" className="hover:text-foreground transition-colors">Use Cases</a></li>
                <li><a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a></li>
                <li><Link href="/aboutus" className="hover:text-foreground transition-colors">About Us</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="p-2 hover:scale-110 transition-transform duration-200" asChild>
                  <a href="https://github.com/Mahatir-Ahmed-Tusher/CodeCraft" target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4" />
                  </a>
                </Button>
                <Button variant="ghost" size="sm" className="p-2 hover:scale-110 transition-transform duration-200">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2 hover:scale-110 transition-transform duration-200">
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}