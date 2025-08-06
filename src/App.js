import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import RepositoryBrowser from './pages/RepositoryBrowser';
import TestGenerator from './pages/TestGenerator';
import TestCases from './pages/TestCases';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ThemeProvider>
      <Layout>
      <AnimatePresence mode="wait">
        <Routes>
          <Route 
            path="/" 
            element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Dashboard />
              </motion.div>
            } 
          />
          <Route 
            path="/repositories" 
            element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <RepositoryBrowser />
              </motion.div>
            } 
          />
          <Route 
            path="/generator" 
            element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TestGenerator />
              </motion.div>
            } 
          />
          <Route 
            path="/test-cases" 
            element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TestCases />
              </motion.div>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Settings />
              </motion.div>
            } 
          />
          <Route 
            path="*" 
            element={
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <NotFound />
              </motion.div>
            } 
          />
        </Routes>
      </AnimatePresence>
    </Layout>
    </ThemeProvider>
  );
}

export default App; 