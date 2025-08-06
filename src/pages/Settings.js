import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Github, 
  Zap, 
  Save, 
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Key,
  Bell,
  Moon,
  Sun,
  Monitor,
  Shield,
  Server,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { healthCheck } from '../services/api';
import { useQuery } from 'react-query';
import { useTheme } from '../contexts/ThemeContext';
import toast from 'react-hot-toast';
import { cn } from '../utils/helpers';

const Settings = () => {
  const [settings, setSettings] = useState({
    githubToken: localStorage.getItem('githubToken') || '',
    geminiKey: localStorage.getItem('geminiKey') || '',
    autoSave: localStorage.getItem('autoSave') !== 'false',
    notifications: localStorage.getItem('notifications') !== 'false',
  });

  const { isDarkMode, toggleTheme } = useTheme();

  const { data: health, isLoading: healthLoading, refetch: refetchHealth } = useQuery('health', healthCheck, {
    refetchInterval: 30000,
  });

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('githubToken', settings.githubToken);
    localStorage.setItem('geminiKey', settings.geminiKey);
    localStorage.setItem('autoSave', settings.autoSave.toString());
    localStorage.setItem('notifications', settings.notifications.toString());
    
    // If tokens are provided, update the backend configuration
    if (settings.githubToken || settings.geminiKey) {
      // The tokens will be used from localStorage in API calls
      toast.success('Settings saved successfully! API keys are now configured.');
    } else {
      toast.success('Settings saved successfully!');
    }
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
      className="w-full space-y-8"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10 rounded-3xl" />
        <div className="relative p-8 lg:p-10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200 dark:border-blue-800">
              <SettingsIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                Configuration Center
              </span>
            </div>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
              Settings
            </span>
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
            Configure your TestGen application, manage API integrations, and customize your experience.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 xl:gap-8">
        {/* Main Settings Column */}
        <div className="xl:col-span-2 space-y-6">
          {/* API Configuration */}
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">API Configuration</h2>
              <Key className="w-5 h-5 text-gray-400 dark:text-gray-600" />
            </div>
            
            <div className="space-y-5">
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
                  Required for GitHub repository access and pull request creation
                </p>
              </div>

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
                    placeholder="your_gemini_api_key"
                    className="input pl-10"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Powers the AI test generation capabilities
                </p>
              </div>
            </div>
          </motion.div>

          {/* Application Preferences */}
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Application Preferences</h2>
              <SettingsIcon className="w-5 h-5 text-gray-400 dark:text-gray-600" />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Save className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Auto-save</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Automatically save test cases</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoSave}
                    onChange={(e) => setSettings(prev => ({ ...prev, autoSave: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Bell className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Notifications</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Show alerts and updates</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => setSettings(prev => ({ ...prev, notifications: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div variants={itemVariants}>
            <button 
              onClick={handleSave} 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all transform hover:scale-[1.02]"
            >
              <Save className="w-5 h-5 mr-2" />
              Save All Settings
            </button>
          </motion.div>
        </div>

        {/* System Status Sidebar */}
        <div className="xl:col-span-1 space-y-6">
          {/* System Status Card */}
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">System Status</h2>
              <button 
                onClick={() => refetchHealth()}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <RefreshCw className={cn(
                  "w-4 h-4 text-gray-500 dark:text-gray-400",
                  healthLoading && "animate-spin"
                )} />
              </button>
            </div>
            
            <div className="space-y-3">
              {/* Backend API Status */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    healthLoading ? "bg-gray-100 dark:bg-gray-800" :
                    health?.status === 'OK' ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
                  )}>
                    {healthLoading ? (
                      <Server className="w-4 h-4 text-gray-400 dark:text-gray-600" />
                    ) : health?.status === 'OK' ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Backend API</span>
                </div>
                <span className={cn(
                  "text-sm font-semibold",
                  healthLoading ? "text-gray-500 dark:text-gray-400" :
                  health?.status === 'OK' ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                )}>
                  {healthLoading ? 'Checking...' : health?.status || 'Unknown'}
                </span>
              </div>

              {/* GitHub Status */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    settings.githubToken ? "bg-green-100 dark:bg-green-900/30" : "bg-amber-100 dark:bg-amber-900/30"
                  )}>
                    <Github className={cn(
                      "w-4 h-4",
                      settings.githubToken ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"
                    )} />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">GitHub</span>
                </div>
                <span className={cn(
                  "text-sm font-semibold",
                  settings.githubToken ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"
                )}>
                  {settings.githubToken ? 'Connected' : 'Not configured'}
                </span>
              </div>

              {/* AI Service Status */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    settings.geminiKey ? "bg-green-100 dark:bg-green-900/30" : "bg-amber-100 dark:bg-amber-900/30"
                  )}>
                    <Sparkles className={cn(
                      "w-4 h-4",
                      settings.geminiKey ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"
                    )} />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Service</span>
                </div>
                <span className={cn(
                  "text-sm font-semibold",
                  settings.geminiKey ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"
                )}>
                  {settings.geminiKey ? 'Connected' : 'Not configured'}
                </span>
              </div>

              {/* Security Status */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Security</span>
                </div>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                  Secure
                </span>
              </div>
            </div>
          </motion.div>

          {/* Help Card */}
          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800"
          >
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Need Help?
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  Check our documentation for detailed setup instructions and troubleshooting guides.
                </p>
                <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                  View Documentation →
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;