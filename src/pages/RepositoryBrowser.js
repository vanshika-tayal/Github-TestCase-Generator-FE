import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderGit2, 
  File, 
  Folder, 
  ChevronRight, 
  ChevronLeft, 
  Search, 
  Filter,
  ExternalLink,
  Code,
  Eye,
  Download,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  X,
  Zap
} from 'lucide-react';
import { githubAPI } from '../services/api';
import { cn, detectLanguage, getLanguageColor, formatFileSize, getRelativeTime } from '../utils/helpers';
import toast from 'react-hot-toast';

const RepositoryCard = ({ repo, onSelect }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-200"
    onClick={() => onSelect(repo)}
  >
    <div className="flex flex-col space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <FolderGit2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{repo.name}</h3>
            {repo.private && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 mt-1">
                Private
              </span>
            )}
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 min-h-[2.5rem]">
        {repo.description || 'No description available'}
      </p>
      
      <div className="flex items-center justify-between text-xs">
        {repo.language && (
          <div className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: getLanguageColor(repo.language) }}
            />
            <span className="text-gray-700 dark:text-gray-300 font-medium">{repo.language}</span>
          </div>
        )}
        <span className="text-gray-500 dark:text-gray-400">
          Updated {getRelativeTime(repo.updated_at)}
        </span>
      </div>
    </div>
  </motion.div>
);

const FileItem = ({ file, onSelect, onViewContent }) => {
  const isDirectory = file.type === 'dir';
  const language = detectLanguage(file.name);
  
  return (
    <motion.div
      whileHover={{ backgroundColor: 'rgba(249, 250, 251, 0.5)' }}
      className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        {isDirectory ? (
          <Folder className="w-5 h-5 text-blue-500 dark:text-blue-400" />
        ) : (
          <File className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
          <div className="flex items-center space-x-2 mt-1">
            {!isDirectory && (
              <span className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</span>
            )}
            {language !== 'Unknown' && (
              <span className="text-xs text-gray-500 dark:text-gray-400">{language}</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {!isDirectory && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewContent(file);
            }}
            className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            title="View content"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}
        {isDirectory ? (
          <button
            onClick={() => onSelect(file)}
            className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => onSelect(file)}
            className="btn-ghost text-xs"
          >
            Select
          </button>
        )}
      </div>
    </motion.div>
  );
};

const FileContentModal = ({ file, isOpen, onClose }) => {
  const { data: content, isLoading } = useQuery(
    ['file-content', file?.path],
    () => githubAPI.getFileContent(file.owner, file.repo, file.path),
    {
      enabled: isOpen && !!file,
    }
  );

  if (!isOpen || !file) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{file.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{file.path}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600 dark:text-blue-400" />
            </div>
          ) : content?.file ? (
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{content.file.content}</code>
            </pre>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p>Failed to load file content</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const RepositoryBrowser = () => {
  const navigate = useNavigate();
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [currentPath, setCurrentPath] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFileModal, setShowFileModal] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);

  // Fetch repositories
  const { data: repos, isLoading: reposLoading, error: reposError } = useQuery(
    'repositories',
    githubAPI.getRepositories,
    {
      retry: 2,
    }
  );

  // Fetch files for selected repository
  const { data: files, isLoading: filesLoading, error: filesError } = useQuery(
    ['files', selectedRepo?.owner, selectedRepo?.name, currentPath],
    () => githubAPI.getFiles(selectedRepo.owner, selectedRepo.name, currentPath),
    {
      enabled: !!selectedRepo,
      retry: 2,
    }
  );

  const handleRepoSelect = (repo) => {
    setSelectedRepo(repo);
    setCurrentPath('');
    setSelectedFiles([]);
  };

  const handleFileSelect = (file) => {
    if (file.type === 'dir') {
      setCurrentPath(file.path);
    } else {
      // Toggle file selection
      setSelectedFiles(prev => {
        const isSelected = prev.some(f => f.path === file.path);
        if (isSelected) {
          return prev.filter(f => f.path !== file.path);
        } else {
          return [...prev, { ...file, owner: selectedRepo.owner, repo: selectedRepo.name }];
        }
      });
    }
  };

  const handleViewContent = (file) => {
    setCurrentFile({ ...file, owner: selectedRepo.owner, repo: selectedRepo.name });
    setShowFileModal(true);
  };

  const handleGenerateTests = () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one file');
      return;
    }
    
    // Navigate to test generator with selected files
    navigate('/generator', { 
      state: { 
        selectedFiles,
        repository: selectedRepo 
      } 
    });
  };

  const filteredFiles = files?.files?.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const breadcrumbs = currentPath.split('/').filter(Boolean);

  if (reposError) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500 dark:text-red-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Failed to load repositories</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{reposError.message}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn-primary"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header with AI-Powered Badge */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start space-x-4 mb-4">
            <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-2">
              <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">AI-Powered</span>
            </div>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">Repository Browser</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto lg:mx-0 lg:text-lg">
            Browse your GitHub repositories and select files for test generation
          </p>
        </div>
        {selectedFiles.length > 0 && (
          <button onClick={handleGenerateTests} className="btn-primary w-full lg:w-auto">
            <Code className="w-4 h-4 mr-2" />
            Generate Tests ({selectedFiles.length})
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Repositories List */}
        <div className="xl:col-span-1">
          <div className="card p-6">
            <h2 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-4">Repositories</h2>
            {reposLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {repos?.repositories?.map((repo) => (
                  <RepositoryCard
                    key={repo.id}
                    repo={repo}
                    onSelect={handleRepoSelect}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Files Browser */}
        <div className="xl:col-span-4">
          <div className="card p-6">
            {!selectedRepo ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <FolderGit2 className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Select a Repository</h3>
                <p>Choose a repository from the list to browse its files</p>
              </div>
            ) : (
              <>
                {/* Repository Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedRepo.name}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{selectedRepo.full_name}</p>
                  </div>
                  <a
                    href={selectedRepo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on GitHub
                  </a>
                </div>

                {/* Breadcrumbs */}
                {currentPath && (
                  <div className="flex items-center space-x-2 mb-4 text-sm">
                    <button
                      onClick={() => setCurrentPath('')}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      {selectedRepo.name}
                    </button>
                    {breadcrumbs.map((crumb, index) => (
                      <React.Fragment key={index}>
                        <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        <button
                          onClick={() => setCurrentPath(breadcrumbs.slice(0, index + 1).join('/'))}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        >
                          {crumb}
                        </button>
                      </React.Fragment>
                    ))}
                  </div>
                )}

                {/* Search and Filters */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search files..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input pl-10"
                    />
                  </div>
                  <button
                    onClick={() => setCurrentPath('')}
                    className="btn-ghost"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Root
                  </button>
                </div>

                {/* Files List */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  {filesLoading ? (
                    <div className="p-8 text-center">
                      <RefreshCw className="w-6 h-6 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                      <p className="text-gray-500 dark:text-gray-400">Loading files...</p>
                    </div>
                  ) : filesError ? (
                    <div className="p-8 text-center">
                      <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500 dark:text-red-400" />
                      <p className="text-gray-600 dark:text-gray-400">Failed to load files</p>
                    </div>
                  ) : filteredFiles.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                      <File className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                      <p>No files found</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                      {filteredFiles.map((file) => (
                        <FileItem
                          key={file.sha}
                          file={file}
                          onSelect={handleFileSelect}
                          onViewContent={handleViewContent}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected Files */}
                {selectedFiles.length > 0 && (
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                      Selected Files ({selectedFiles.length})
                    </h3>
                    <div className="space-y-1">
                      {selectedFiles.map((file) => (
                        <div key={file.path} className="flex items-center justify-between text-sm">
                          <span className="text-blue-800 dark:text-blue-200">{file.name}</span>
                          <button
                            onClick={() => handleFileSelect(file)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* File Content Modal */}
      <FileContentModal
        file={currentFile}
        isOpen={showFileModal}
        onClose={() => {
          setShowFileModal(false);
          setCurrentFile(null);
        }}
      />
    </div>
  );
};

export default RepositoryBrowser; 