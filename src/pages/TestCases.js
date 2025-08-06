import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Search, 
  Filter, 
  Trash2, 
  Eye, 
  Download, 
  Copy,
  Calendar,
  Code,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  X,
  Zap
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { testCasesAPI } from '../services/api';
import { cn, getFrameworkIcon, getTestTypeColor, formatDate, getRelativeTime, downloadFile, copyToClipboard } from '../utils/helpers';
import toast from 'react-hot-toast';

const TestCases = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFramework, setSelectedFramework] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedTestCase, setSelectedTestCase] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  // Fetch test cases
  const { data: testCases, isLoading } = useQuery('testCases', testCasesAPI.getTestCases);

  // Delete test case mutation
  const deleteMutation = useMutation(testCasesAPI.deleteTestCase, {
    onSuccess: () => {
      queryClient.invalidateQueries('testCases');
      toast.success('Test case deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete test case');
    }
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this test case?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleViewTestCase = (testCase) => {
    setSelectedTestCase(testCase);
    setShowModal(true);
  };

  const handleCopyCode = async (content) => {
    if (await copyToClipboard(content)) {
      toast.success('Code copied to clipboard!');
    } else {
      toast.error('Failed to copy code');
    }
  };

  const handleDownloadCode = (testCase) => {
    downloadFile(testCase.content, testCase.fileName, 'text/plain');
    toast.success('Test case downloaded!');
  };

  // Filter test cases
  const filteredTestCases = testCases?.testCases?.filter(testCase => {
    const matchesSearch = testCase.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testCase.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFramework = !selectedFramework || testCase.framework === selectedFramework;
    const matchesType = !selectedType || testCase.type === selectedType;
    
    return matchesSearch && matchesFramework && matchesType;
  }) || [];

  // Get unique frameworks and types for filters
  const frameworks = [...new Set(testCases?.testCases?.map(tc => tc.framework) || [])];
  const types = [...new Set(testCases?.testCases?.map(tc => tc.type) || [])];

  const getLanguageForSyntax = (language) => {
    const languageMap = {
      'JavaScript': 'javascript',
      'TypeScript': 'typescript',
      'Python': 'python',
      'Java': 'java',
      'C++': 'cpp',
      'C': 'c',
      'C#': 'csharp',
      'PHP': 'php',
      'Ruby': 'ruby',
      'Go': 'go',
      'Rust': 'rust',
      'Swift': 'swift',
      'Kotlin': 'kotlin',
      'Scala': 'scala',
      'HTML': 'html',
      'CSS': 'css',
      'SCSS': 'scss',
      'Vue': 'vue',
      'Svelte': 'svelte',
    };
    return languageMap[language] || 'javascript';
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header with AI-Powered Badge */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start space-x-4 mb-4">
            <div className="flex items-center space-x-2 bg-primary-50 border border-primary-200 rounded-lg px-3 py-2">
              <Zap className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-primary-700">AI-Powered</span>
            </div>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Test Cases</h1>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto lg:mx-0 lg:text-lg">
            Manage and review your generated test cases
          </p>
        </div>
        <div className="flex items-center justify-center lg:justify-end space-x-2">
          <span className="text-sm lg:text-base text-gray-500">
            {filteredTestCases.length} of {testCases?.testCases?.length || 0} test cases
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search test cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Framework</label>
            <select
              value={selectedFramework}
              onChange={(e) => setSelectedFramework(e.target.value)}
              className="select"
            >
              <option value="">All Frameworks</option>
              {frameworks.map(framework => (
                <option key={framework} value={framework}>
                  {getFrameworkIcon(framework)} {framework}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="select"
            >
              <option value="">All Types</option>
              {types.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedFramework('');
                setSelectedType('');
              }}
              className="btn-secondary w-full"
            >
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Test Cases List */}
      <div className="card p-6">
        {isLoading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-gray-500">Loading test cases...</p>
          </div>
        ) : filteredTestCases.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No test cases found</h3>
            <p className="text-gray-500 mb-4">
              {testCases?.testCases?.length === 0 
                ? "You haven't generated any test cases yet."
                : "No test cases match your current filters."
              }
            </p>
            {testCases?.testCases?.length === 0 && (
              <button 
                onClick={() => window.location.href = '/generator'}
                className="btn-primary"
              >
                <Code className="w-4 h-4 mr-2" />
                Generate Your First Test Case
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTestCases.map((testCase) => (
              <motion.div
                key={testCase.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-soft transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <FileText className="w-5 h-5 text-primary-600" />
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {testCase.fileName}
                      </h3>
                      <span className={cn(
                        "badge",
                        getTestTypeColor(testCase.type) === 'success' && "badge-success",
                        getTestTypeColor(testCase.type) === 'warning' && "badge-warning",
                        getTestTypeColor(testCase.type) === 'primary' && "badge-primary",
                        getTestTypeColor(testCase.type) === 'secondary' && "badge-secondary"
                      )}>
                        {testCase.type}
                      </span>
                      <span className="badge-secondary">
                        {getFrameworkIcon(testCase.framework)} {testCase.framework}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {testCase.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(testCase.createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Code className="w-4 h-4" />
                        <span>{testCase.language}</span>
                      </div>
                      {testCase.sourceFiles?.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <span>• {testCase.sourceFiles.length} source file(s)</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleViewTestCase(testCase)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="View test case"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCopyCode(testCase.content)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Copy code"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDownloadCode(testCase)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Download file"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(testCase.id)}
                      className="p-2 text-gray-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-colors"
                      title="Delete test case"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Test Case Modal */}
      <AnimatePresence>
        {showModal && selectedTestCase && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedTestCase.fileName}</h3>
                  <p className="text-sm text-gray-500">{selectedTestCase.description}</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-auto p-6">
                <div className="mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Framework</p>
                      <p className="text-gray-900 flex items-center">
                        <span className="mr-2">{getFrameworkIcon(selectedTestCase.framework)}</span>
                        {selectedTestCase.framework}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Type</p>
                      <span className={cn(
                        "badge",
                        getTestTypeColor(selectedTestCase.type) === 'success' && "badge-success",
                        getTestTypeColor(selectedTestCase.type) === 'warning' && "badge-warning",
                        getTestTypeColor(selectedTestCase.type) === 'primary' && "badge-primary",
                        getTestTypeColor(selectedTestCase.type) === 'secondary' && "badge-secondary"
                      )}>
                        {selectedTestCase.type}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Created</p>
                      <p className="text-gray-900">{formatDate(selectedTestCase.createdAt)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute top-2 right-2 z-10 flex space-x-2">
                    <button
                      onClick={() => handleCopyCode(selectedTestCase.content)}
                      className="p-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
                      title="Copy code"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDownloadCode(selectedTestCase)}
                      className="p-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
                      title="Download file"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                  <SyntaxHighlighter
                    language={getLanguageForSyntax(selectedTestCase.language)}
                    style={tomorrow}
                    customStyle={{
                      margin: 0,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                    }}
                    showLineNumbers
                  >
                    {selectedTestCase.content}
                  </SyntaxHighlighter>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TestCases; 