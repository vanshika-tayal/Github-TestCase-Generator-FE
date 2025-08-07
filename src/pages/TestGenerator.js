import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TestTube, 
  FileText, 
  Code, 
  Zap, 
  Copy, 
  Download, 
  Save,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Play,
  Settings,
  Eye,
  EyeOff,
  Github,
  ExternalLink,
  Maximize2,
  Minimize2,
  X
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { aiAPI, testCasesAPI, githubAPI } from '../services/api';
import { cn, detectLanguage, getLanguageColor, getFrameworkIcon, downloadFile, copyToClipboard } from '../utils/helpers';
import toast from 'react-hot-toast';

const TestGenerator = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFramework, setSelectedFramework] = useState('');
  const [generatedSummaries, setGeneratedSummaries] = useState([]);
  const [selectedSummary, setSelectedSummary] = useState(null);
  const [selectedFileTab, setSelectedFileTab] = useState(0);
  const [generatedTestCase, setGeneratedTestCase] = useState(null);
  const [showCode, setShowCode] = useState(true);
  const [isCodeExpanded, setIsCodeExpanded] = useState(false);
  const [prData, setPrData] = useState({
    title: '',
    body: '',
    branch: 'main'
  });

  // Get frameworks
  const { data: frameworks } = useQuery('frameworks', aiAPI.getFrameworks);

  // Generate summaries mutation
  const generateSummariesMutation = useMutation(aiAPI.generateSummaries, {
    onSuccess: (data) => {
      // Add file index to each summary based on the file it belongs to
      const summariesWithFileIndex = data.summaries.map((summary, index) => ({
        ...summary,
        fileIndex: Math.floor(index / Math.max(1, data.summaries.length / selectedFiles.length)),
        id: summary.id || `summary-${index}`
      }));
      setGeneratedSummaries(summariesWithFileIndex);
      setStep(2);
      toast.success('Test case summaries generated successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to generate summaries');
    }
  });

  // Generate test case mutation
  const generateTestCaseMutation = useMutation(aiAPI.generateTestCase, {
    onSuccess: (data) => {
      setGeneratedTestCase(data.testCase);
      setStep(3);
      toast.success('Test case generated successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to generate test case');
    }
  });

  // Save test case mutation
  const saveTestCaseMutation = useMutation(testCasesAPI.saveTestCase, {
    onSuccess: () => {
      toast.success('Test case saved successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to save test case');
    }
  });

  // Create PR mutation
  const createPRMutation = useMutation(githubAPI.createPullRequest, {
    onSuccess: (data) => {
      toast.success('Pull request created successfully!');
      window.open(data.pull_request.html_url, '_blank');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create pull request');
    }
  });

  // Load files from navigation state and fetch their content
  useEffect(() => {
    const fetchFileContents = async () => {
      if (location.state?.selectedFiles) {
        const filesWithContent = await Promise.all(
          location.state.selectedFiles.map(async (file) => {
            try {
              const response = await githubAPI.getFileContent(file.owner, file.repo, file.path);
              return {
                ...file,
                content: response.file.content
              };
            } catch (error) {
              console.error(`Failed to fetch content for ${file.name}:`, error);
              return {
                ...file,
                content: '// Failed to fetch file content'
              };
            }
          })
        );
        setSelectedFiles(filesWithContent);
      }
    };
    
    fetchFileContents();
  }, [location.state]);

  const handleGenerateSummaries = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one file');
      return;
    }

    if (!selectedFramework) {
      toast.error('Please select a testing framework');
      return;
    }

    // Prepare files data
    const filesData = selectedFiles.map(file => ({
      name: file.name,
      path: file.path,
      content: file.content || '// No content available',
      language: detectLanguage(file.name)
    }));

    generateSummariesMutation.mutate({
      files: filesData,
      framework: selectedFramework
    });
  };

  const handleGenerateTestCase = async () => {
    if (!selectedSummary) {
      toast.error('Please select a test case summary');
      return;
    }

    const filesData = selectedFiles.map(file => ({
      name: file.name,
      path: file.path,
      content: file.content || '',
      language: detectLanguage(file.name)
    }));

    generateTestCaseMutation.mutate({
      files: filesData,
      framework: selectedFramework,
      testType: selectedSummary.type,
      description: selectedSummary.description
    });
  };

  const handleSaveTestCase = async () => {
    if (!generatedTestCase) return;

    const sourceFiles = selectedFiles.map(file => ({
      name: file.name,
      path: file.path
    }));

    saveTestCaseMutation.mutate({
      fileName: generatedTestCase.fileName,
      content: generatedTestCase.content,
      framework: generatedTestCase.framework,
      language: generatedTestCase.language,
      type: generatedTestCase.type,
      description: generatedTestCase.description,
      sourceFiles
    });
  };

  const handleCreatePR = async () => {
    if (!generatedTestCase) return;

    const files = [{
      path: `tests/${generatedTestCase.fileName}`,
      content: generatedTestCase.content
    }];

    createPRMutation.mutate({
      owner: selectedFiles[0]?.owner,
      repo: selectedFiles[0]?.repo,
      branch: prData.branch,
      title: prData.title || `Add test case: ${generatedTestCase.fileName}`,
      body: prData.body || `Generated test case for ${generatedTestCase.description}`,
      files
    });
  };

  const handleCopyCode = async () => {
    if (await copyToClipboard(generatedTestCase.content)) {
      toast.success('Code copied to clipboard!');
    } else {
      toast.error('Failed to copy code');
    }
  };

  const handleDownloadCode = () => {
    downloadFile(
      generatedTestCase.content,
      generatedTestCase.fileName,
      'text/plain'
    );
    toast.success('Test case downloaded!');
  };

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
    <div className="w-full h-[calc(100vh-8rem)] flex flex-col overflow-hidden">
      {/* Mobile Progress Steps */}
      <div className="lg:hidden flex items-center justify-center mb-4 flex-shrink-0">
        <div className="flex items-center space-x-2 sm:space-x-4">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={cn(
                "flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 font-semibold text-sm sm:text-base",
                step >= stepNumber 
                  ? "bg-blue-600 border-blue-600 text-white" 
                  : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"
              )}>
                {stepNumber}
              </div>
              {stepNumber < 4 && (
                <div className={cn(
                  "w-8 sm:w-16 h-0.5 mx-1 sm:mx-2",
                  step > stepNumber ? "bg-primary-600" : "bg-gray-300"
                )} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Layout - Header and Content Side by Side */}
      <div className="lg:flex lg:gap-6 flex-1 min-h-0 h-full overflow-hidden">
        {/* Header Section - Left Side on Desktop */}
        <div className="lg:w-1/3 flex-shrink-0 lg:h-full overflow-y-auto">
          <div className="text-center lg:text-left mb-4 lg:mb-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">Test Generator</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto lg:mx-0 text-sm sm:text-base lg:text-lg">
              Generate test cases for your code files
            </p>
          </div>

          {/* Desktop Progress Steps - Vertical Layout */}
          <div className="hidden lg:block mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Progress</h3>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center space-x-3">
                  <div className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full border-2 font-semibold text-sm",
                    step >= stepNumber 
                      ? "bg-blue-600 border-blue-600 text-white" 
                      : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"
                  )}>
                    {stepNumber}
                  </div>
                  <span className={cn(
                    "text-sm font-medium",
                    step >= stepNumber ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                  )}>
                    {stepNumber === 1 && "Select Files & Framework"}
                    {stepNumber === 2 && "Generate Summaries"}
                    {stepNumber === 3 && "Generate Test Case"}
                    {stepNumber === 4 && "Create Pull Request"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Section - Right Side on Desktop */}
        <div className="lg:flex-1 min-h-0 lg:h-full overflow-hidden">
          <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 lg:p-6 h-[calc(100vh-12rem)] max-h-[700px] min-h-[500px] flex flex-col">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex-shrink-0">Step 1: Select Files & Framework</h2>
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              
              {/* Selected Files */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Selected Files</h3>
                {selectedFiles.length > 0 ? (
                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{file.path}</p>
                          </div>
                        </div>
                        <span className="badge-secondary">
                          {detectLanguage(file.name)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <p>No files selected</p>
                    <button 
                      onClick={() => navigate('/repositories')}
                      className="btn-primary mt-2"
                    >
                      Browse Repositories
                    </button>
                  </div>
                )}
              </div>

              {/* Framework Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Testing Framework</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {frameworks?.frameworks?.map((framework) => (
                    <button
                      key={framework.id}
                      onClick={() => setSelectedFramework(framework.id)}
                      className={cn(
                        "p-4 border-2 rounded-lg text-left transition-all duration-200",
                        selectedFramework === framework.id
                          ? "border-primary-500 bg-primary-50"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">{getFrameworkIcon(framework.id)}</span>
                        <span className="font-medium text-gray-900 dark:text-white">{framework.name}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{framework.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerateSummaries}
                disabled={selectedFiles.length === 0 || !selectedFramework || generateSummariesMutation.isLoading}
                className="btn-primary w-full"
              >
                {generateSummariesMutation.isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating Summaries...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Generate Test Summaries
                  </>
                )}
              </button>
              </div>
            </div>
          </motion.div>
        )}

          {/* Step 2: Test Case Summaries */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 h-[calc(100vh-12rem)] max-h-[700px] min-h-[500px] flex flex-col">
                <div className="flex items-center justify-between mb-6 flex-shrink-0">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Step 2: Select Test Case</h2>
                  <button
                    onClick={() => setStep(1)}
                    className="btn-ghost"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </button>
                </div>

                {/* File Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700 mb-4 flex-shrink-0">
                  <div className="flex space-x-1 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                    {selectedFiles.map((file, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedFileTab(index)}
                        className={cn(
                          "px-4 py-2 text-sm font-medium whitespace-nowrap transition-all",
                          "border-b-2 -mb-px",
                          selectedFileTab === index
                            ? "text-blue-600 dark:text-blue-400 border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300"
                        )}
                      >
                        <div className="flex items-center space-x-2">
                          <FileText className="w-3 h-3" />
                          <span>{file.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Test Summaries for Selected File */}
                <div className="flex-1 min-h-0 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generatedSummaries
                  .filter(summary => summary.fileIndex === selectedFileTab || (!summary.fileIndex && selectedFileTab === 0))
                  .map((summary, index) => (
                    <motion.div
                      key={`${selectedFileTab}-${index}`}
                      whileHover={{ scale: 1.01 }}
                      className={cn(
                        "p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 h-fit",
                        selectedSummary?.id === summary.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      )}
                      onClick={() => setSelectedSummary(summary)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-white text-sm">{summary.title}</h3>
                        <span className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          summary.type === 'unit' && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                          summary.type === 'integration' && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
                          summary.type === 'e2e' && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                          summary.type === 'ui' && "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                        )}>
                          {summary.type}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{summary.description}</p>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Scenarios:</p>
                          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                            {summary.scenarios.slice(0, 2).map((scenario, i) => (
                              <li key={i}>• {scenario}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Expected Outcomes:</p>
                          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                            {summary.expectedOutcomes.slice(0, 2).map((outcome, i) => (
                              <li key={i}>• {outcome}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  ))
                  }
                  </div>
                </div>

                <button
                  onClick={handleGenerateTestCase}
                  disabled={!selectedSummary || generateTestCaseMutation.isLoading}
                  className="btn-primary w-full mt-6 flex-shrink-0"
                >
                  {generateTestCaseMutation.isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating Test Case...
                    </>
                  ) : (
                    <>
                      <Code className="w-4 h-4 mr-2" />
                      Generate Test Case
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Generated Test Case */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 h-[calc(100vh-12rem)] max-h-[700px] min-h-[500px] flex flex-col">
                <div className="flex items-center justify-between mb-6 flex-shrink-0">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Step 3: Generated Test Case</h2>
                  <button
                    onClick={() => setStep(2)}
                    className="btn-ghost"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </button>
                </div>

                {/* Test Case Content */}
                <div className="flex-1 min-h-0 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                {generatedTestCase && (
                  <div className="space-y-6">
                  {/* Test Case Info */}
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">File Name</p>
                        <p className="text-gray-900 dark:text-white">{generatedTestCase.fileName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Framework</p>
                        <p className="text-gray-900 dark:text-white flex items-center">
                          <span className="mr-2">{getFrameworkIcon(generatedTestCase.framework)}</span>
                          {generatedTestCase.framework}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</p>
                        <span className={cn(
                          "badge",
                          generatedTestCase.type === 'unit' && "badge-success",
                          generatedTestCase.type === 'integration' && "badge-warning",
                          generatedTestCase.type === 'e2e' && "badge-primary",
                          generatedTestCase.type === 'ui' && "badge-secondary"
                        )}>
                          {generatedTestCase.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Code Toggle */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Generated Code</h3>
                    <button
                      onClick={() => setShowCode(!showCode)}
                      className="btn-ghost"
                    >
                      {showCode ? (
                        <>
                          <EyeOff className="w-4 h-4 mr-2" />
                          Hide Code
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-2" />
                          Show Code
                        </>
                      )}
                    </button>
                  </div>

                  {/* Code Display */}
                  {showCode && (
                    <>
                      <div className="relative border border-gray-200 dark:border-gray-700 rounded-lg h-80">
                        <div className="absolute top-2 right-2 z-10 flex space-x-2">
                          <button
                            onClick={() => setIsCodeExpanded(true)}
                            className="p-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
                            title="Expand code view"
                          >
                            <Maximize2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCopyCode}
                            className="p-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
                            title="Copy code"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleDownloadCode}
                            className="p-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
                            title="Download file"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="h-full overflow-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
                          <SyntaxHighlighter
                            language={getLanguageForSyntax(generatedTestCase.language)}
                            style={tomorrow}
                            customStyle={{
                              margin: 0,
                              borderRadius: '0.5rem',
                              fontSize: '0.875rem',
                              background: '#1a1a1a',
                              color: '#f8f8f2',
                              minHeight: '100%',
                              padding: '16px'
                            }}
                            showLineNumbers
                          >
                            {generatedTestCase.content}
                          </SyntaxHighlighter>
                        </div>
                      </div>

                      {/* Expanded Code Modal */}
                      <AnimatePresence>
                        {isCodeExpanded && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                            onClick={() => setIsCodeExpanded(false)}
                          >
                            <motion.div
                              initial={{ scale: 0.95, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.95, opacity: 0 }}
                              className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {/* Header */}
                              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                                <div className="flex items-center space-x-3">
                                  <Code className="w-5 h-5 text-blue-400" />
                                  <h3 className="text-lg font-semibold text-white">{generatedTestCase.fileName}</h3>
                                  <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-lg">
                                    {generatedTestCase.language}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={handleCopyCode}
                                    className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                    title="Copy code"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={handleDownloadCode}
                                    className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                    title="Download file"
                                  >
                                    <Download className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setIsCodeExpanded(false)}
                                    className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                    title="Close expanded view"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              
                              {/* Code Content */}
                              <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                                <SyntaxHighlighter
                                  language={getLanguageForSyntax(generatedTestCase.language)}
                                  style={tomorrow}
                                  customStyle={{
                                    margin: 0,
                                    padding: '24px',
                                    background: 'transparent',
                                    fontSize: '14px',
                                    lineHeight: '1.6',
                                    minHeight: '100%'
                                  }}
                                  showLineNumbers
                                  wrapLines={true}
                                >
                                  {generatedTestCase.content}
                                </SyntaxHighlighter>
                              </div>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}

                    </div>
                  )}

                )}
                </div>

                <button
                  onClick={() => setStep(4)}
                  disabled={!generatedTestCase}
                  className="btn-primary w-full mt-6 flex-shrink-0"
                >
                  <Github className="w-4 h-4 mr-2" />
                  Create Pull Request
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Create Pull Request */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 h-[calc(100vh-12rem)] max-h-[700px] min-h-[500px] flex flex-col">
                <div className="flex items-center justify-between mb-6 flex-shrink-0">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Step 4: Create Pull Request</h2>
                  <button
                    onClick={() => setStep(3)}
                    className="btn-ghost"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    PR Title
                  </label>
                  <input
                    type="text"
                    value={prData.title}
                    onChange={(e) => setPrData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Add test case: Calculator functionality"
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    PR Description
                  </label>
                  <textarea
                    value={prData.body}
                    onChange={(e) => setPrData(prev => ({ ...prev, body: e.target.value }))}
                    placeholder="This PR adds comprehensive test cases for the calculator functionality..."
                    rows={4}
                    className="textarea"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target Branch
                  </label>
                  <input
                    type="text"
                    value={prData.branch}
                    onChange={(e) => setPrData(prev => ({ ...prev, branch: e.target.value }))}
                    placeholder="main"
                    className="input"
                  />
                </div>

                <button
                  onClick={handleCreatePR}
                  disabled={createPRMutation.isLoading}
                  className="btn-primary w-full"
                >
                  {createPRMutation.isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Creating Pull Request...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Create Pull Request
                    </>
                  )}
                </button>
                </div>
                </div>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TestGenerator; 