import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Github, 
  Zap, 
  Save, 
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { healthCheck } from '../services/api';
import { useQuery } from 'react-query';
import toast from 'react-hot-toast';

const Settings = () => {
  const [settings, setSettings] = useState({
    githubToken: '',
    geminiKey: '',
    autoSave: true,
    notifications: true,
    theme: 'light'
  });

  const { data: health, isLoading: healthLoading } = useQuery('health', healthCheck, {
    refetchInterval: 30000,
  });

  const handleSave = () => {
    // In a real app, you'd save to backend/localStorage
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header with AI-Powered Badge */}
      <div className="text-center lg:text-left">
        <div className="flex items-center justify-center lg:justify-start space-x-4 mb-4">
          <div className="flex items-center space-x-2 bg-primary-50 border border-primary-200 rounded-lg px-3 py-2">
            <Zap className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-medium text-primary-700">AI-Powered</span>
          </div>
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto lg:mx-0 lg:text-lg">
          Configure your TestGen application settings
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 xl:gap-8">
        {/* API Configuration */}
        <div className="xl:col-span-2">
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">API Configuration</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GitHub Personal Access Token
                </label>
                <div className="flex items-center space-x-2">
                  <Github className="w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={settings.githubToken}
                    onChange={(e) => setSettings(prev => ({ ...prev, githubToken: e.target.value }))}
                    placeholder="ghp_your_token_here"
                    className="input flex-1"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Required for GitHub repository access
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Gemini API Key
                </label>
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={settings.geminiKey}
                    onChange={(e) => setSettings(prev => ({ ...prev, geminiKey: e.target.value }))}
                    placeholder="your_gemini_api_key"
                    className="input flex-1"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Required for AI-powered test generation
                </p>
              </div>
            </div>
          </div>

          {/* Application Settings */}
          <div className="card p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Auto-save test cases</h3>
                  <p className="text-sm text-gray-500">Automatically save generated test cases</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoSave}
                    onChange={(e) => setSettings(prev => ({ ...prev, autoSave: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                  <p className="text-sm text-gray-500">Show success and error notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => setSettings(prev => ({ ...prev, notifications: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme
                </label>
                <select
                  value={settings.theme}
                  onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value }))}
                  className="select"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button onClick={handleSave} className="btn-primary">
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </button>
          </div>
        </div>

        {/* System Status */}
        <div className="xl:col-span-1">
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">System Status</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  {healthLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />
                  ) : health?.status === 'OK' ? (
                    <CheckCircle className="w-4 h-4 text-success-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-error-600" />
                  )}
                  <span className="text-sm font-medium">Backend API</span>
                </div>
                <span className={healthLoading ? "text-gray-500" : health?.status === 'OK' ? "text-success-600" : "text-error-600"}>
                  {healthLoading ? 'Checking...' : health?.status || 'Unknown'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Github className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium">GitHub</span>
                </div>
                <span className={settings.githubToken ? "text-success-600" : "text-error-600"}>
                  {settings.githubToken ? 'Connected' : 'Not configured'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium">AI Service</span>
                </div>
                <span className={settings.geminiKey ? "text-success-600" : "text-error-600"}>
                  {settings.geminiKey ? 'Connected' : 'Not configured'}
                </span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Need Help?</h3>
              <p className="text-sm text-blue-700 mb-3">
                Check the documentation for setup instructions and troubleshooting.
              </p>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View Documentation →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 