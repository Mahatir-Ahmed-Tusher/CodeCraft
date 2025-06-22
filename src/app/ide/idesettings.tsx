import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, Palette, Type, Monitor, Save, RotateCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface IDESettings {
  theme: 'dark' | 'light' | 'solarized' | 'monokai' | 'github';
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  tabSize: number;
  wordWrap: boolean;
  minimap: boolean;
  autoSave: boolean;
  formatOnSave: boolean;
  lineNumbers: boolean;
  folding: boolean;
  bracketMatching: boolean;
  autoClosingBrackets: boolean;
  autoIndent: boolean;
}

const defaultSettings: IDESettings = {
  theme: 'dark',
  fontFamily: 'JetBrains Mono',
  fontSize: 14,
  lineHeight: 1.5,
  tabSize: 2,
  wordWrap: true,
  minimap: true,
  autoSave: true,
  formatOnSave: true,
  lineNumbers: true,
  folding: true,
  bracketMatching: true,
  autoClosingBrackets: true,
  autoIndent: true,
};

const themes = [
  { value: 'dark', label: 'Dark Theme', description: 'Default dark theme' },
  { value: 'light', label: 'Light Theme', description: 'Clean light theme' },
  { value: 'solarized', label: 'Solarized Dark', description: 'Popular developer theme' },
  { value: 'monokai', label: 'Monokai', description: 'Sublime Text inspired' },
  { value: 'github', label: 'GitHub Light', description: 'GitHub style theme' },
];

const fontFamilies = [
  { value: 'JetBrains Mono', label: 'JetBrains Mono' },
  { value: 'Fira Code', label: 'Fira Code' },
  { value: 'Monaco', label: 'Monaco' },
  { value: 'Consolas', label: 'Consolas' },
  { value: 'SF Mono', label: 'SF Mono' },
  { value: 'Cascadia Code', label: 'Cascadia Code' },
];

export default function IDESettings() {
  const [settings, setSettings] = useState<IDESettings>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('ide-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);

  const updateSetting = <K extends keyof IDESettings>(key: K, value: IDESettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const saveSettings = () => {
    localStorage.setItem('ide-settings', JSON.stringify(settings));
    
    // Apply theme to document
    document.documentElement.className = settings.theme;
    
    // Apply global CSS variables
    const root = document.documentElement;
    root.style.setProperty('--editor-font-family', settings.fontFamily);
    root.style.setProperty('--editor-font-size', `${settings.fontSize}px`);
    root.style.setProperty('--editor-line-height', settings.lineHeight.toString());
    
    // Dispatch custom event for Monaco editor to update
    window.dispatchEvent(new CustomEvent('ide-settings-changed', { 
      detail: settings 
    }));

    setHasChanges(false);
    toast({
      title: "Settings Saved",
      description: "Your IDE preferences have been updated successfully.",
    });
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    setHasChanges(true);
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to defaults.",
    });
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'codecraft-ide-settings.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <Link href="/ide">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to IDE
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <Settings className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  IDE Settings
                </h1>
                <p className="text-gray-400">Customize your development environment</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              onClick={resetSettings}
              className="border-gray-600 hover:border-red-500"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button 
              onClick={saveSettings} 
              disabled={!hasChanges}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Theme Settings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Palette className="w-5 h-5 mr-2 text-blue-400" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-medium text-gray-300 mb-3 block">
                    Color Theme
                  </Label>
                  <Select 
                    value={settings.theme} 
                    onValueChange={(value: any) => updateSetting('theme', value)}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {themes.map((theme) => (
                        <SelectItem key={theme.value} value={theme.value}>
                          <div>
                            <div className="font-medium">{theme.label}</div>
                            <div className="text-xs text-gray-400">{theme.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-gray-300">Auto Save</Label>
                    <Switch 
                      checked={settings.autoSave}
                      onCheckedChange={(checked) => updateSetting('autoSave', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-gray-300">Format on Save</Label>
                    <Switch 
                      checked={settings.formatOnSave}
                      onCheckedChange={(checked) => updateSetting('formatOnSave', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Editor Settings */}
          <motion.div
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Type className="w-5 h-5 mr-2 text-green-400" />
                  Editor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-medium text-gray-300 mb-3 block">
                    Font Family
                  </Label>
                  <Select 
                    value={settings.fontFamily} 
                    onValueChange={(value) => updateSetting('fontFamily', value)}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {fontFamilies.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          {font.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-300 mb-3 block">
                    Font Size: {settings.fontSize}px
                  </Label>
                  <Slider
                    value={[settings.fontSize]}
                    onValueChange={([value]) => updateSetting('fontSize', value)}
                    min={10}
                    max={24}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-300 mb-3 block">
                    Line Height: {settings.lineHeight}
                  </Label>
                  <Slider
                    value={[settings.lineHeight]}
                    onValueChange={([value]) => updateSetting('lineHeight', value)}
                    min={1.0}
                    max={2.0}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-300 mb-3 block">
                    Tab Size: {settings.tabSize} spaces
                  </Label>
                  <Slider
                    value={[settings.tabSize]}
                    onValueChange={([value]) => updateSetting('tabSize', value)}
                    min={2}
                    max={8}
                    step={2}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Advanced Settings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Monitor className="w-5 h-5 mr-2 text-purple-400" />
                  Advanced
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'wordWrap', label: 'Word Wrap' },
                  { key: 'minimap', label: 'Show Minimap' },
                  { key: 'lineNumbers', label: 'Line Numbers' },
                  { key: 'folding', label: 'Code Folding' },
                  { key: 'bracketMatching', label: 'Bracket Matching' },
                  { key: 'autoClosingBrackets', label: 'Auto-closing Brackets' },
                  { key: 'autoIndent', label: 'Auto Indent' },
                ].map((setting) => (
                  <div key={setting.key} className="flex items-center justify-between">
                    <Label className="text-sm text-gray-300">{setting.label}</Label>
                    <Switch 
                      checked={settings[setting.key as keyof IDESettings] as boolean}
                      onCheckedChange={(checked) => updateSetting(setting.key as keyof IDESettings, checked)}
                    />
                  </div>
                ))}

                <div className="pt-4 border-t border-gray-700">
                  <Button 
                    variant="outline" 
                    className="w-full border-gray-600 hover:border-blue-500"
                    onClick={exportSettings}
                  >
                    Export Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Preview Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="bg-gray-900 p-4 rounded-lg border border-gray-700"
                style={{
                  fontFamily: settings.fontFamily,
                  fontSize: `${settings.fontSize}px`,
                  lineHeight: settings.lineHeight,
                }}
              >
                <pre className="text-gray-300">
{`function welcomeToCodeCraft() {
  const message = "Hello, Developer!";
  console.log(message);
  
  return {
    ide: "CodeCraft",
    theme: "${settings.theme}",
    font: "${settings.fontFamily}",
    ready: true
  };
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-r from-blue-800/30 to-purple-800/30 backdrop-blur-sm border-blue-500/30">
            <CardHeader>
              <CardTitle className="text-white">About CodeCraft IDE</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              <p className="mb-4">
                CodeCraft IDE is a modern, multi-language web development environment built for creators, 
                learners, and professionals. It enables real-time code execution and AI-assisted development.
              </p>
              <p className="mb-4">
                Created by <span className="text-blue-400 font-semibold">Mahatir Ahmed Tusher</span>, 
                a graduate from VIT University, a problem solver and MLOps engineer passionate about 
                democratizing code.
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <span className="bg-blue-500/20 px-3 py-1 rounded-full">Version 1.0.0</span>
                <span className="bg-green-500/20 px-3 py-1 rounded-full">React + TypeScript</span>
                <span className="bg-purple-500/20 px-3 py-1 rounded-full">Monaco Editor</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}