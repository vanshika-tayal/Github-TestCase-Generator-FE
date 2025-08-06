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
  ExternalLink
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
  const [generatedTestCase, setGeneratedTestCase] = useState(null);
  const [showCode, setShowCode] = useState(true);
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
      setGeneratedSummaries(data.summaries);
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

  // Load files from navigation state
  useEffect(() => {
    if (location.state?.selectedFiles) {
      setSelectedFiles(location.state.selectedFiles);
    }
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
      content: file.content || '',
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
    <div className="w-full pt-0">
      {/* Mobile Progress Steps */}
      <div className="lg:hidden flex items-center justify-center mb-4">
        <div className="flex items-center space-x-2 sm:space-x-4">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={cn(
                "flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 font-semibold text-sm sm:text-base",
                step >= stepNumber 
                  ? "bg-blue-600 border-blue-600 text-white" 
                  : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"
              )}>
                {stepNumber}
              </div>
              {stepNumber < 3 && (
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
      <div className="lg:flex lg:space-x-8 lg:items-start">
        {/* Header Section - Left Side on Desktop */}
        <div className="lg:w-1/3 lg:sticky lg:top-0">
          <div className="text-center lg:text-left mb-4 lg:mb-0">
            <div className="flex items-center justify-center lg:justify-start space-x-2 sm:space-x-4 mb-2 sm:mb-3">
              <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg px-2 py-1 sm:px-3 sm:py-2">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300">AI-Powered</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">Test Generator</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto lg:mx-0 text-sm sm:text-base lg:text-lg">
              Generate AI-powered test cases for your code files
            </p>
          </div>

          {/* Desktop Progress Steps - Vertical Layout */}
          <div className="hidden lg:block">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Progress</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((stepNumber) => (
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
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Section - Right Side on Desktop */}
        <div className="lg:w-2/3 lg:flex-1">

      {/* Step 1: File Selection and Framework */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Step 1: Select Files & Framework</h2>
              
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
          </motion.div>
        )}

        {/* Step 2: Test Case Summaries */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Step 2: Select Test Case</h2>
                <button
                  onClick={() => setStep(1)}
                  className="btn-ghost"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generatedSummaries.map((summary, index) => (
                  <motion.div
                    key={summary.id}
                    whileHover={{ scale: 1.02 }}
                    className={cn(
                      "p-4 border-2 rounded-lg cursor-pointer transition-all duration-200",
                      selectedSummary?.id === summary.id
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                    onClick={() => setSelectedSummary(summary)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{summary.title}</h3>
                      <span className={cn(
                        "badge",
                        summary.type === 'unit' && "badge-success",
                        summary.type === 'integration' && "badge-warning",
                        summary.type === 'e2e' && "badge-primary",
                        summary.type === 'ui' && "badge-secondary"
                      )}>
                        {summary.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{summary.description}</p>
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
                ))}
              </div>

              <button
                onClick={handleGenerateTestCase}
                disabled={!selectedSummary || generateTestCaseMutation.isLoading}
                className="btn-primary w-full mt-6"
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
            className="space-y-6"
          >
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Step 3: Generated Test Case</h2>
                <button
                  onClick={() => setStep(2)}
                  className="btn-ghost"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </button>
              </div>

              {generatedTestCase && (
                <div className="space-y-6">
                  {/* Test Case Info */}
                  <div className="bg-gray-50 p-4 rounded-lg">
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
                    <div className="relative">
                      <div className="absolute top-2 right-2 z-10 flex space-x-2">
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
                      <SyntaxHighlighter
                        language={getLanguageForSyntax(generatedTestCase.language)}
                        style={tomorrow}
                        customStyle={{
                          margin: 0,
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                        }}
                        showLineNumbers
                      >
                        {generatedTestCase.content}
                      </SyntaxHighlighter>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleSaveTestCase}
                      disabled={saveTestCaseMutation.isLoading}
                      className="btn-success"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Test Case
                    </button>
                    
                    <button
                      onClick={() => setStep(4)}
                      className="btn-primary"
                    >
                      <Github className="w-4 h-4 mr-2" />
                      Create Pull Request
                    </button>
                  </div>
                </div>
              )}
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
            className="space-y-6"
          >
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Step 4: Create Pull Request</h2>
                <button
                  onClick={() => setStep(3)}
                  className="btn-ghost"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </button>
              </div>

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
          </motion.div>
        )}
      </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TestGenerator; 