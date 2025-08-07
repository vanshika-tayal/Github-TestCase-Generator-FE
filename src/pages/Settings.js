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
import toast from 'react-hot-toast';

const Settings = () => {
  const [settings, setSettings] = useState({
    githubToken: localStorage.getItem('githubToken') || '',
    geminiKey: localStorage.getItem('geminiKey') || '',
  });


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
      className="w-full h-full flex flex-col overflow-hidden"
    >
      {/* Mobile Header */}
      <motion.div variants={itemVariants} className="lg:hidden flex flex-col gap-4 mb-4 flex-shrink-0">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">API Keys Setup</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Configure your API keys to enable all features
          </p>
        </div>
      </motion.div>

      {/* Desktop Layout - Header and Content Side by Side */}
      <div className="lg:flex lg:gap-6 flex-1 min-h-0 h-full">
        {/* Header Section - Left Side on Desktop */}
        <motion.div 
          variants={itemVariants}
          className="hidden lg:block lg:w-1/3 flex-shrink-0 lg:h-full"
        >
          <div className="text-left">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">API Keys Setup</h1>
            <p className="text-gray-600 dark:text-gray-400 text-base lg:text-lg">
              Configure your GitHub and Gemini API keys to enable all features
            </p>
            
            {/* Configuration Status */}
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Configuration Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Github className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">GitHub Token</span>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${settings.githubToken ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Gemini API</span>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${settings.geminiKey ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                  </div>
                </div>
              </div>
              
              {/* Quick Setup Guide */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                  <RefreshCw className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
                  Quick Setup
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start space-x-2">
                    <span className="font-bold text-blue-600 dark:text-blue-400">1.</span>
                    <span className="text-gray-600 dark:text-gray-400">Get GitHub token from Settings → Developer</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="font-bold text-blue-600 dark:text-blue-400">2.</span>
                    <span className="text-gray-600 dark:text-gray-400">Get Gemini key from AI Studio</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="font-bold text-green-600 dark:text-green-400">3.</span>
                    <span className="text-gray-600 dark:text-gray-400">Save and start building!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content Section - Right Side on Desktop */}
        <div className="lg:flex-1 min-h-0 lg:h-full">
          <motion.div 
            variants={itemVariants}
            className="h-full"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm h-[600px] flex flex-col">
              <div className="p-5 lg:p-7 flex-1 min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
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
                      disabled={!settings.githubToken || !settings.geminiKey}
                      className={`inline-flex items-center justify-center px-4 py-2.5 font-semibold rounded-xl transition-all transform ${
                        settings.githubToken && settings.geminiKey
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:scale-[1.02] cursor-pointer'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50'
                      }`}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Settings
                    </button>
                    
                    <button 
                      onClick={handleReset} 
                      disabled={!settings.githubToken && !settings.geminiKey}
                      className={`inline-flex items-center justify-center px-4 py-2.5 font-semibold rounded-xl transition-all transform ${
                        settings.githubToken || settings.geminiKey
                          ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white hover:shadow-lg hover:scale-[1.02] cursor-pointer'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50'
                      }`}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Reset All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;