import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Transition } from '@headlessui/react';
import { 
  Home, 
  FolderGit2, 
  TestTube, 
  FileText, 
  Settings,
  Key, 
  Menu, 
  X,
  Github,
  Sparkles,
  Code2,
  ChevronLeft,
  Moon,
  Sun,
  Monitor,
  Palette,
  Zap,
  Clock,
  Calendar
} from 'lucide-react';
import { cn } from '../utils/helpers';
import { useTheme } from '../contexts/ThemeContext';

const navigation = [
  { name: 'API Keys Setup', href: '/settings', icon: Key, color: 'red' },
  { name: 'Repositories', href: '/repositories', icon: FolderGit2, color: 'purple' },
  { name: 'Test Generator', href: '/generator', icon: TestTube, color: 'green' },
];

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getIconColor = (color, isActive) => {
    if (!isActive) return 'text-gray-400 dark:text-gray-500';
    
    const colors = {
      blue: 'text-blue-500 dark:text-blue-400',
      purple: 'text-purple-500 dark:text-purple-400',
      green: 'text-green-500 dark:text-green-400',
      amber: 'text-amber-500 dark:text-amber-400',
      gray: 'text-gray-600 dark:text-gray-400',
      red: 'text-red-500 dark:text-red-400'
    };
    return colors[color] || 'text-gray-600 dark:text-gray-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30 dark:bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Flex Container */}
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar - Fixed Position */}
        <div className={cn(
          "relative flex-shrink-0 transition-all duration-300",
          sidebarCollapsed ? "w-20" : "w-64"
        )}>
          <motion.aside
            className={cn(
              "fixed inset-y-0 left-0 z-50 flex flex-col bg-white/80 dark:bg-gray-900/95 backdrop-blur-xl",
              "border-r border-gray-200/50 dark:border-gray-700/50 shadow-2xl lg:shadow-xl",
              "transition-all duration-300 ease-in-out",
              // Mobile behavior
              "lg:translate-x-0",
              sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
              // Width handling
              sidebarCollapsed ? "w-20" : "w-64"
            )}
          >
            {/* Logo Section with Gradient */}
            <div className="relative h-20 px-4 flex items-center justify-between border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-transparent via-blue-50/20 to-transparent dark:via-blue-900/10">
              <Link to="/" className="flex items-center space-x-3 group">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity" />
                  <div className="relative flex items-center justify-center w-11 h-11 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-xl shadow-lg">
                    <Code2 className="w-6 h-6 text-white" />
                  </div>
                </motion.div>
                
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent whitespace-nowrap">
                        GitForge.AI
                      </h1>
                      <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">Forge Tests with AI</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Link>
              
              {/* Mobile close button */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation with Beautiful Hover Effects */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className="relative group block"
                  >
                    <motion.div
                      className={cn(
                        "flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                        isActive
                          ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-gray-900 dark:text-white shadow-sm"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      )}
                      whileHover={{ x: !sidebarCollapsed ? 2 : 0 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <item.icon className={cn(
                        "flex-shrink-0 transition-all duration-200",
                        sidebarCollapsed ? "w-6 h-6 mx-auto" : "w-5 h-5 mr-3 ml-1",
                        getIconColor(item.color, isActive)
                      )} />
                      
                      <AnimatePresence>
                        {!sidebarCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                            className="whitespace-nowrap overflow-hidden"
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      
                      {isActive && !sidebarCollapsed && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto"
                        >
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
                        </motion.div>
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </nav>


            {/* Footer with Animated Gradient */}
            <div className="relative px-4 py-4 border-t border-gray-200/50 dark:border-gray-700/50">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10 animate-pulse" />
              <div className="relative">
                <AnimatePresence>
                  {!sidebarCollapsed ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg">
                          <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">AI Powered</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">by Gemini</p>
                        </div>
                      </div>
                      <Github className="w-4 h-4 text-gray-400 dark:text-gray-600" />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex justify-center"
                    >
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg"
                      >
                        <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Collapse Toggle */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex absolute -right-3 top-24 w-6 h-6 items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-md hover:shadow-lg transition-all hover:scale-110 z-10"
            >
              <ChevronLeft className={cn(
                "w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform",
                sidebarCollapsed && "rotate-180"
              )} />
            </button>
          </motion.aside>
        </div>

        {/* Main Content Area - Responsive to sidebar */}
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          {/* Desktop Header with Time */}
          <header 
            className="hidden lg:flex items-center justify-between h-14 px-6 bg-gradient-to-r from-white/95 via-white/90 to-white/95 dark:from-gray-900/95 dark:via-gray-900/90 dark:to-gray-900/95 backdrop-blur-xl border-b border-gradient-to-r from-gray-200/30 via-gray-200/50 to-gray-200/30 dark:from-gray-700/30 dark:via-gray-700/50 dark:to-gray-700/30 fixed top-0 left-0 right-0 z-40 shadow-sm"
            style={{ paddingLeft: sidebarCollapsed ? '5rem' : '16rem' }}
          >
            <div className="flex items-center justify-center flex-1 px-8">
              <span className="text-sm font-mono text-gray-700 dark:text-gray-300 tracking-wide">
                Change the way you build test cases with AI-powered automation 🚀
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <motion.button
                onClick={toggleTheme}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200"
              >
                <AnimatePresence mode="wait">
                  {isDarkMode ? (
                    <motion.div
                      key="moon"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center space-x-1"
                    >
                      <Moon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Dark</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="sun"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center space-x-1"
                    >
                      <Sun className="w-4 h-4 text-amber-500" />
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Light</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </header>

          {/* Mobile Header */}
          <header className="lg:hidden flex flex-col bg-gradient-to-r from-white/90 via-white/85 to-white/90 dark:from-gray-900/90 dark:via-gray-900/85 dark:to-gray-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 fixed top-0 left-0 right-0 z-40 shadow-lg">
            <div className="flex items-center justify-between h-16 px-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2.5 rounded-xl bg-white dark:bg-gray-800 shadow-md text-gray-500 dark:text-gray-400 hover:shadow-lg transition-all"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div className="flex items-center justify-center flex-1">
                <span className="text-xs font-mono text-gray-700 dark:text-gray-300 tracking-wide">
                  Change the way you test 🚀
                </span>
              </div>

              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-white dark:bg-gray-800 shadow-md text-gray-500 dark:text-gray-400 hover:shadow-lg transition-all"
              >
                {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
            </div>
            
            <div className="flex items-center justify-center px-4 pb-2">
              <div className="flex items-center space-x-2">
                <div className="p-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg">
                  <Zap className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  GitForge.AI
                </span>
              </div>
            </div>
          </header>

          {/* Main Content with proper transitions */}
          <main className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-gray-900/50 flex flex-col pt-14 lg:pt-14 pb-20">
            <motion.div 
              className="flex-1 w-full"
              animate={{ 
                paddingLeft: 0,
                transition: { duration: 0.3, ease: "easeInOut" }
              }}
            >
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full max-w-full"
                >
                  {children}
                </motion.div>
              </div>
            </motion.div>
            
            {/* Footer */}
            <footer className="bg-gradient-to-r from-white/95 via-white/90 to-white/95 dark:from-gray-900/95 dark:via-gray-900/90 dark:to-gray-900/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 py-3 px-6 fixed bottom-0 left-0 right-0 z-40 shadow-lg" style={{ paddingLeft: sidebarCollapsed ? '5rem' : '16rem' }}>
              <div className="container mx-auto px-4">
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
                      <Code2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        GitForge.AI
                      </span>
                    </div>
                    <span className="text-gray-400 dark:text-gray-600">•</span>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      © {new Date().getFullYear()}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <a 
                      href="https://github.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all transform hover:scale-105"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg border border-red-100 dark:border-red-800/30">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        Made with
                      </span>
                      <span className="text-red-500 animate-pulse">♥</span>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        for devs
                      </span>
                    </div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-500 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md">
                      v1.0.0
                    </span>
                  </div>
                </div>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;