import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Palette, Type, Monitor, Save, RotateCcw, ArrowLeft, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

export interface IDESettings {
  theme: 'vs-dark' | 'vs-light' | 'github-dark' | 'github-light';
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  tabSize: number;
  wordWrap: boolean;
  minimap: boolean;
  autoSave: boolean;
  formatOnSave: boolean;
  lineNumbers: boolean;
}

interface SettingsModalProps {
  settings: IDESettings;
  onSave: (settings: IDESettings) => void;
  onClose: () => void;
}

const defaultSettings: IDESettings = {
  theme: 'vs-dark',
  fontFamily: 'JetBrains Mono, Fira Code, Monaco, monospace',
  fontSize: 14,
  lineHeight: 1.5,
  tabSize: 2,
  wordWrap: true,
  minimap: false,
  autoSave: true,
  formatOnSave: true,
  lineNumbers: true
};

const themes = [
  { value: 'vs-dark', label: 'Dark Theme', icon: Moon },
  { value: 'vs-light', label: 'Light Theme', icon: Sun },
  { value: 'github-dark', label: 'GitHub Dark', icon: Moon },
  { value: 'github-light', label: 'GitHub Light', icon: Sun },
];

const fontFamilies = [
  'JetBrains Mono, monospace',
  'Fira Code, monospace',
  'Monaco, monospace',
  'Consolas, monospace',
  'SF Mono, monospace',
  'Cascadia Code, monospace',
  'Source Code Pro, monospace'
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onSave, onClose }) => {
  const [localSettings, setLocalSettings] = useState<IDESettings>(settings);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
    setHasChanges(false);
  }, [settings]);

  const updateSetting = <K extends keyof IDESettings>(key: K, value: IDESettings[K]) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(localSettings);
    setHasChanges(false);
    onClose();
  };

  const handleReset = () => {
    setLocalSettings(defaultSettings);
    setHasChanges(true);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Settings className="w-5 h-5 mr-2 text-blue-400" />
            IDE Settings
          </DialogTitle>
        </DialogHeader>

        <div className="grid lg:grid-cols-3 gap-6 py-4">
          {/* Appearance Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Palette className="w-4 h-4 mr-2 text-purple-400" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-300 mb-2 block">
                    Color Theme
                  </Label>
                  <Select 
                    value={localSettings.theme} 
                    onValueChange={(value: any) => updateSetting('theme', value)}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {themes.map((theme) => {
                        const IconComponent = theme.icon;
                        return (
                          <SelectItem key={theme.value} value={theme.value}>
                            <div className="flex items-center">
                              <IconComponent className="w-4 h-4 mr-2" />
                              {theme.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-gray-300">Auto Save</Label>
                    <Switch 
                      checked={localSettings.autoSave}
                      onCheckedChange={(checked) => updateSetting('autoSave', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-gray-300">Format on Save</Label>
                    <Switch 
                      checked={localSettings.formatOnSave}
                      onCheckedChange={(checked) => updateSetting('formatOnSave', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-gray-300">Word Wrap</Label>
                    <Switch 
                      checked={localSettings.wordWrap}
                      onCheckedChange={(checked) => updateSetting('wordWrap', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-gray-300">Line Numbers</Label>
                    <Switch 
                      checked={localSettings.lineNumbers}
                      onCheckedChange={(checked) => updateSetting('lineNumbers', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Editor Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Type className="w-4 h-4 mr-2 text-green-400" />
                  Editor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-300 mb-2 block">
                    Font Family
                  </Label>
                  <Select 
                    value={localSettings.fontFamily} 
                    onValueChange={(value) => updateSetting('fontFamily', value)}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {fontFamilies.map((font) => (
                        <SelectItem key={font} value={font}>
                          <span style={{ fontFamily: font }}>{font.split(',')[0]}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-300 mb-2 block">
                    Font Size: {localSettings.fontSize}px
                  </Label>
                  <Slider
                    value={[localSettings.fontSize]}
                    onValueChange={([value]) => updateSetting('fontSize', value)}
                    min={10}
                    max={24}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-300 mb-2 block">
                    Line Height: {localSettings.lineHeight}
                  </Label>
                  <Slider
                    value={[localSettings.lineHeight]}
                    onValueChange={([value]) => updateSetting('lineHeight', value)}
                    min={1.0}
                    max={2.0}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-300 mb-2 block">
                    Tab Size: {localSettings.tabSize} spaces
                  </Label>
                  <Slider
                    value={[localSettings.tabSize]}
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Monitor className="w-4 h-4 mr-2 text-cyan-400" />
                  Advanced
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-gray-300">Show Minimap</Label>
                  <Switch 
                    checked={localSettings.minimap}
                    onCheckedChange={(checked) => updateSetting('minimap', checked)}
                  />
                </div>

                {/* Preview */}
                <div className="mt-6">
                  <Label className="text-sm font-medium text-gray-300 mb-2 block">
                    Preview
                  </Label>
                  <div 
                    className="bg-gray-900 p-3 rounded-lg border border-gray-700 text-xs"
                    style={{
                      fontFamily: localSettings.fontFamily,
                      fontSize: `${localSettings.fontSize}px`,
                      lineHeight: localSettings.lineHeight,
                    }}
                  >
                    <pre className="text-gray-300">
{`function hello() {
  console.log("CodeCraft IDE");
  return "Hello World!";
}`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="border-gray-600 hover:bg-gray-700"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!hasChanges}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};