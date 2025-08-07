import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Github, 
  Save, 
  RefreshCw,
  Key,
  Sparkles,
  Trash2
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import toast from 'react-hot-toast';

const Settings = () => {
  const [settings, setSettings] = useState({
    githubToken: localStorage.getItem('githubToken') || '',
    geminiKey: localStorage.getItem('geminiKey') || '',
  });

  const { isDarkMode, toggleTheme } = useTheme();

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('githubToken', settings.githubToken);
    localStorage.setItem('geminiKey', settings.geminiKey);
    
    // If tokens are provided, update the backend configuration
    if (settings.githubToken && settings.geminiKey) {
      toast.success('API keys saved successfully! You can now use all features.', {
        duration: 4000,
        icon: '✅'
      });
    } else if (settings.githubToken || settings.geminiKey) {
      toast.success('Settings saved! Please configure both API keys to use all features.', {
        duration: 4000,
        icon: '⚠️'
      });
    } else {
      toast.error('Please enter your API keys to use the application.', {
        duration: 4000,
        icon: '❌'
      });
    }
  };

  const handleReset = () => {
    // Clear settings from state
    setSettings({
      githubToken: '',
      geminiKey: '',
    });
    
    // Clear from localStorage
    localStorage.removeItem('githubToken');
    localStorage.removeItem('geminiKey');
    
    toast.success('All settings have been reset!', {
      duration: 3000,
      icon: '🔄'
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="text-center lg:text-left">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">API Keys Setup</h1>
          <p className="text-gray-600 dark:text-gray-400 lg:text-lg">
            Configure your GitHub and Gemini API keys to enable all features
          </p>
        </div>
      </motion.div>

      {/* Main Content - Left and Right Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 lg:gap-8">
        {/* Left Section - API Configuration */}
        <motion.div 
          variants={itemVariants}
          className="xl:col-span-3 bg-white dark:bg-gray-800 rounded-2xl p-6 lg:p-8 border border-gray-200 dark:border-gray-700 shadow-sm h-fit"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">API Configuration</h2>
            <Key className="w-6 h-6 text-gray-400 dark:text-gray-600" />
          </div>
          
          <div className="space-y-6">
            {/* GitHub Token Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                GitHub Personal Access Token
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Github className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="password"
                  value={settings.githubToken}
                  onChange={(e) => setSettings(prev => ({ ...prev, githubToken: e.target.value }))}
                  placeholder="ghp_your_token_here"
                  className="input pl-10"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Required for GitHub repository access. 
                <a 
                  href="https://github.com/settings/tokens" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                >
                  Get your token here →
                </a>
              </p>
            </div>

            {/* Gemini API Key Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Google Gemini API Key
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Sparkles className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="password"
                  value={settings.geminiKey}
                  onChange={(e) => setSettings(prev => ({ ...prev, geminiKey: e.target.value }))}
                  placeholder="AIzaSy..."
                  className="input pl-10"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Powers the test generation capabilities. 
                <a 
                  href="https://makersuite.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                >
                  Get your API key here →
                </a>
              </p>
            </div>

            {/* Status Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${settings.githubToken ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  GitHub: {settings.githubToken ? 'Configured' : 'Not Set'}
                </span>
              </div>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${settings.geminiKey ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Gemini: {settings.geminiKey ? 'Configured' : 'Not Set'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button 
                onClick={handleSave} 
                className="inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all transform hover:scale-[1.02]"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </button>
              
              <button 
                onClick={handleReset} 
                className="inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all transform hover:scale-[1.02]"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Reset All
              </button>
            </div>
          </div>
        </motion.div>

        {/* Right Section - Setup Guide */}
        <motion.div 
          variants={itemVariants}
          className="xl:col-span-2 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800 h-fit"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <RefreshCw className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
            Quick Setup
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <div className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                1
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">GitHub Token</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Settings → Developer → Tokens → Generate
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Scope:</span>
                  <code className="text-xs bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded font-mono">repo</code>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <div className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                2
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Gemini Key</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  AI Studio → Get API Key → Create Key
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Free tier available
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <div className="flex-shrink-0 w-5 h-5 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                3
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Save & Start</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Enter keys → Save → Go to Repositories
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-1.5 mb-1">
              <Sparkles className="w-3 h-3 text-green-600 dark:text-green-400" />
              <span className="text-xs font-semibold text-green-800 dark:text-green-300">Pro Tip</span>
            </div>
            <p className="text-xs text-green-700 dark:text-green-400">
              Both services offer free tiers!
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Settings;