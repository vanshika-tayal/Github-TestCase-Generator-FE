import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FolderGit2, 
  File, 
  Folder, 
  ChevronRight, 
  Search, 
  ExternalLink,
  Code,
  Eye,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  X
} from 'lucide-react';
import { githubAPI } from '../services/api';
import { detectLanguage, getLanguageColor, formatFileSize, getRelativeTime } from '../utils/helpers';
import toast from 'react-hot-toast';

const RepositoryCard = ({ repo, onSelect }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-200"
    onClick={() => onSelect(repo)}
  >
    <div className="flex flex-col space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start space-x-2 flex-1 min-w-0">
          <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex-shrink-0">
            <FolderGit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate leading-tight">
              {repo.name}
            </h3>
            {repo.private && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 mt-1">
                Private
              </span>
            )}
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5" />
      </div>
      
      {repo.description && (
        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
          {repo.description}
        </p>
      )}
      
      <div className="flex items-center justify-between gap-2 pt-1">
        {repo.language ? (
          <div className="flex items-center space-x-1.5 min-w-0">
            <div 
              className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
              style={{ backgroundColor: getLanguageColor(repo.language) }}
            />
            <span className="text-xs text-gray-700 dark:text-gray-300 font-medium truncate">
              {repo.language}
            </span>
          </div>
        ) : (
          <div></div>
        )}
        <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
          {getRelativeTime(repo.updated_at)}
        </span>
      </div>
    </div>
  </motion.div>
);

const FileItem = ({ file, onSelect, onViewContent, isSelected }) => {
  const isDirectory = file.type === 'dir';
  const language = detectLanguage(file.name);
  
  return (
    <motion.div
      whileHover={{ backgroundColor: 'rgba(249, 250, 251, 0.5)' }}
      className={`flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
        isSelected ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500' : ''
      }`}
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
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              isSelected 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {isSelected ? 'Selected' : 'Select'}
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
  const [lastToastTime, setLastToastTime] = useState(0);

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
      // Toggle file selection with max 5 files limit
      setSelectedFiles(prev => {
        const isSelected = prev.some(f => f.path === file.path);
        if (isSelected) {
          return prev.filter(f => f.path !== file.path);
        } else {
          if (prev.length >= 5) {
            const now = Date.now();
            if (now - lastToastTime > 2000) {
              toast.error('Maximum 5 files can be selected at once', {
                icon: '⚠️',
                duration: 2000
              });
              setLastToastTime(now);
            }
            return prev;
          }
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
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden flex flex-col gap-4 mb-4 flex-shrink-0">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Repository Browser</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Browse repositories and select files for test generation
          </p>
        </div>
        {selectedFiles.length > 0 && (
          <div className="flex flex-col items-center gap-2">
            <div className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium">
              <span>{selectedFiles.length}/5 files selected</span>
            </div>
            <button onClick={handleGenerateTests} className="btn-primary w-full">
              <Code className="w-4 h-4 mr-2" />
              Generate Tests ({selectedFiles.length})
            </button>
          </div>
        )}
      </div>

      {/* Desktop Layout - Header and Content Side by Side */}
      <div className="lg:flex lg:gap-6 flex-1 min-h-0 h-full">
        {/* Header Section - Left Side on Desktop */}
        <div className="hidden lg:block lg:w-1/4 flex-shrink-0 lg:h-full">
          <div className="text-left">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">Repository Browser</h1>
            <p className="text-gray-600 dark:text-gray-400 text-base lg:text-lg">
              Browse your GitHub repositories and select files for test generation
            </p>
            
            {/* Selection Status */}
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Selection Status</h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Files Selected</span>
                  <span className={`text-lg font-bold ${
                    selectedFiles.length >= 5 
                      ? 'text-red-600 dark:text-red-400' 
                      : selectedFiles.length >= 3
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-green-600 dark:text-green-400'
                  }`}>{selectedFiles.length}/5</span>
                </div>
                <div className="mb-3">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        selectedFiles.length >= 5 
                          ? 'bg-red-500 dark:bg-red-400' 
                          : selectedFiles.length >= 3
                          ? 'bg-yellow-500 dark:bg-yellow-400'
                          : 'bg-green-500 dark:bg-green-400'
                      }`}
                      style={{ width: `${(selectedFiles.length / 5) * 100}%` }}
                    />
                  </div>
                </div>
                
                {/* Selected Files List */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-2 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                    <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Selected Files:</h4>
                    {selectedFiles.map((file, index) => (
                      <div key={file.path} className="flex items-center justify-between text-xs p-2 bg-white dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <span className="w-4 h-4 bg-blue-100 dark:bg-blue-900/30 rounded text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </span>
                          <span className="text-gray-700 dark:text-gray-300 truncate font-medium">{file.name}</span>
                        </div>
                        <button
                          onClick={() => handleFileSelect(file)}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 ml-2 flex-shrink-0"
                          title="Remove file"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {selectedFiles.length > 0 && (
                <button onClick={handleGenerateTests} className="btn-primary w-full">
                  <Code className="w-4 h-4 mr-2" />
                  Generate Tests ({selectedFiles.length})
                </button>
              )}
              
              {selectedRepo && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Current Repository</h3>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedRepo.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{selectedRepo.full_name}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Section - Right Side on Desktop */}
        <div className="lg:flex-1 min-h-0 lg:h-full">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Repositories List */}
            <div className="xl:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 lg:p-6 h-[600px] flex flex-col">
                <h2 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-4 flex-shrink-0">Repositories</h2>
                {reposLoading ? (
                  <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                    <div className="space-y-3">
                      {repos?.repositories?.map((repo) => (
                        <RepositoryCard
                          key={repo.id}
                          repo={repo}
                          onSelect={handleRepoSelect}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Files Browser */}
            <div className="xl:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 lg:p-6 h-[600px] flex flex-col">
                {!selectedRepo ? (
                  <div className="flex-1 flex items-center justify-center text-center text-gray-500 dark:text-gray-400">
                    <div>
                      <FolderGit2 className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Select a Repository</h3>
                      <p>Choose a repository from the list to browse its files</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Repository Header */}
                    <div className="flex items-center justify-between mb-4 flex-shrink-0">
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
                      <div className="flex items-center space-x-2 mb-3 text-sm flex-shrink-0 overflow-x-auto">
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
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4 flex-shrink-0">
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
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg flex-1 min-h-0 overflow-hidden">
                      <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
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
                              isSelected={selectedFiles.some(f => f.path === file.path)}
                            />
                          ))}
                        </div>
                      )}
                      </div>
                    </div>

                  </>
                )}
              </div>
            </div>
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