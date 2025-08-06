import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Transition } from '@headlessui/react';
import { 
  Home, 
  FolderGit2, 
  TestTube, 
  FileText, 
  Settings, 
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
  Zap
} from 'lucide-react';
import { cn } from '../utils/helpers';
import { useTheme } from '../contexts/ThemeContext';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home, color: 'blue' },
  { name: 'Repositories', href: '/repositories', icon: FolderGit2, color: 'purple' },
  { name: 'Test Generator', href: '/generator', icon: TestTube, color: 'green' },
  { name: 'Test Cases', href: '/test-cases', icon: FileText, color: 'amber' },
  { name: 'Settings', href: '/settings', icon: Settings, color: 'gray' },
];

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();

  const getIconColor = (color, isActive) => {
    if (!isActive) return 'text-gray-400 dark:text-gray-500';
    
    const colors = {
      blue: 'text-blue-500 dark:text-blue-400',
      purple: 'text-purple-500 dark:text-purple-400',
      green: 'text-green-500 dark:text-green-400',
      amber: 'text-amber-500 dark:text-amber-400',
      gray: 'text-gray-600 dark:text-gray-400'
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
                        TestGen
                      </h1>
                      <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">AI Test Generator</p>
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
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full"
                          initial={false}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                      
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

            {/* Theme Toggle */}
            <div className="px-3 py-2">
              <button
                onClick={toggleTheme}
                className={cn(
                  "w-full flex items-center justify-center space-x-2 px-3 py-2.5",
                  "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700",
                  "hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-600",
                  "rounded-xl transition-all duration-200 group"
                )}
              >
                <AnimatePresence mode="wait">
                  {isDarkMode ? (
                    <motion.div
                      key="moon"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center"
                    >
                      <Moon className={cn(
                        "w-5 h-5 text-purple-500",
                        sidebarCollapsed && "mx-auto"
                      )} />
                      {!sidebarCollapsed && (
                        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                          Dark Mode
                        </span>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="sun"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center"
                    >
                      <Sun className={cn(
                        "w-5 h-5 text-amber-500",
                        sidebarCollapsed && "mx-auto"
                      )} />
                      {!sidebarCollapsed && (
                        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                          Light Mode
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>

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
          {/* Mobile Header */}
          <header className="lg:hidden flex items-center justify-between h-16 px-4 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2.5 rounded-xl bg-white dark:bg-gray-800 shadow-md text-gray-500 dark:text-gray-400 hover:shadow-lg transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg">
                <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                TestGen
              </span>
            </div>

            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-white dark:bg-gray-800 shadow-md text-gray-500 dark:text-gray-400 hover:shadow-lg transition-all"
            >
              {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
          </header>

          {/* Main Content with proper transitions */}
          <main className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-gray-900/50">
            <motion.div 
              className="w-full h-full"
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
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;