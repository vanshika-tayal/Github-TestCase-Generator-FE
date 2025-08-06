import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FolderGit2, 
  TestTube, 
  FileText, 
  TrendingUp, 
  Clock, 
  Zap,
  Plus,
  ArrowRight,
  Github,
  Code,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { testCasesAPI, healthCheck } from '../services/api';
import { cn, getRelativeTime, getFrameworkIcon } from '../utils/helpers';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="card p-3 sm:p-4 lg:p-6 h-full"
  >
    <div className="flex items-start justify-between h-full">
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-medium text-gray-600">{title}</p>
        <p className="text-xl sm:text-2xl lg:text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {trend && (
          <p className={cn(
            "text-xs sm:text-sm mt-1 flex items-center",
            trend > 0 ? "text-success-600" : "text-error-600"
          )}>
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{trend > 0 ? '+' : ''}{trend}% from last week</span>
          </p>
        )}
      </div>
      <div className={cn(
        "p-2 sm:p-3 rounded-lg flex-shrink-0 ml-2 sm:ml-4",
        color === 'primary' && "bg-primary-100 text-primary-600",
        color === 'success' && "bg-success-100 text-success-600",
        color === 'warning' && "bg-warning-100 text-warning-600",
        color === 'secondary' && "bg-gray-100 text-gray-600"
      )}>
        <Icon className="w-4 h-4 sm:w-6 sm:h-6" />
      </div>
    </div>
  </motion.div>
);

const QuickActionCard = ({ title, description, icon: Icon, href, color }) => (
  <Link to={href}>
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="card p-3 sm:p-4 lg:p-6 hover:shadow-medium transition-all duration-200 cursor-pointer group h-full"
    >
      <div className="flex items-start space-x-2 sm:space-x-4 h-full">
        <div className={cn(
          "p-2 sm:p-3 rounded-lg flex-shrink-0",
          color === 'primary' && "bg-primary-100 text-primary-600 group-hover:bg-primary-200",
          color === 'success' && "bg-success-100 text-success-600 group-hover:bg-success-200",
          color === 'warning' && "bg-warning-100 text-warning-600 group-hover:bg-warning-200",
          color === 'secondary' && "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
        )}>
          <Icon className="w-4 h-4 sm:w-6 sm:h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>
        </div>
        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-primary-600 transition-colors flex-shrink-0" />
      </div>
    </motion.div>
  </Link>
);

const RecentActivityItem = ({ item, type }) => (
  <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-colors">
    <div className="flex-shrink-0">
      {type === 'testCase' ? (
        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-success-600" />
      ) : (
        <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
      )}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
        {item.fileName || `${item.summaryCount} test summaries`}
      </p>
      <p className="text-xs text-gray-500">
        {getRelativeTime(item.createdAt)}
      </p>
    </div>
    <div className="flex-shrink-0">
      <span className="badge-secondary">
        {getFrameworkIcon(item.framework)} {item.framework}
      </span>
    </div>
  </div>
);

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useQuery('stats', testCasesAPI.getStats, {
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: health, isLoading: healthLoading } = useQuery('health', healthCheck, {
    refetchInterval: 60000, // Refetch every minute
  });

  const quickActions = [
    {
      title: 'Browse Repositories',
      description: 'Connect to GitHub and explore your code repositories',
      icon: FolderGit2,
      href: '/repositories',
      color: 'primary'
    },
    {
      title: 'Generate Tests',
      description: 'Create AI-powered test cases for your code',
      icon: TestTube,
      href: '/generator',
      color: 'success'
    },
    {
      title: 'View Test Cases',
      description: 'Manage and review your generated test cases',
      icon: FileText,
      href: '/test-cases',
      color: 'warning'
    }
  ];

  const recentActivity = stats?.recentActivity || [];

  return (
    <div className="space-y-4 sm:space-y-6 w-full">
      {/* Header with AI-Powered Badge */}
      <div className="text-center lg:text-left">
        <div className="flex items-center justify-center lg:justify-start space-x-2 sm:space-x-4 mb-2 sm:mb-3">
          <div className="flex items-center space-x-2 bg-primary-50 border border-primary-200 rounded-lg px-2 py-1 sm:px-3 sm:py-2">
            <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-primary-600" />
            <span className="text-xs sm:text-sm font-medium text-primary-700">AI-Powered</span>
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto lg:mx-0 text-sm sm:text-base lg:text-lg">
          Welcome to TestGen - AI-powered test case generation with GitHub integration
        </p>
      </div>

      {/* Health Status */}
      {!healthLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "flex items-center space-x-2 p-4 rounded-lg",
            health?.status === 'OK' 
              ? "bg-success-50 border border-success-200" 
              : "bg-error-50 border border-error-200"
          )}
        >
          {health?.status === 'OK' ? (
            <CheckCircle className="w-5 h-5 text-success-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-error-600" />
          )}
          <span className={cn(
            "text-sm font-medium",
            health?.status === 'OK' ? "text-success-800" : "text-error-800"
          )}>
            Backend Status: {health?.status || 'Unknown'}
          </span>
        </motion.div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <StatCard
          title="Total Test Cases"
          value={statsLoading ? '...' : stats?.totalTestCases || 0}
          icon={TestTube}
          color="primary"
          trend={12}
        />
        <StatCard
          title="Test Summaries"
          value={statsLoading ? '...' : stats?.totalSummaries || 0}
          icon={FileText}
          color="success"
          trend={8}
        />
        <StatCard
          title="Frameworks Used"
          value={statsLoading ? '...' : Object.keys(stats?.frameworks || {}).length}
          icon={Code}
          color="warning"
        />
        <StatCard
          title="Repositories"
          value="Connected"
          icon={Github}
          color="secondary"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3 text-center lg:text-left">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {quickActions.map((action, index) => (
            <QuickActionCard key={index} {...action} />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-2">
            {recentActivity.length > 0 ? (
              recentActivity.slice(0, 5).map((item, index) => (
                <RecentActivityItem 
                  key={index} 
                  item={item} 
                  type={item.itemType} 
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No recent activity</p>
                <p className="text-sm">Start by generating your first test case</p>
              </div>
            )}
          </div>
          {recentActivity.length > 5 && (
            <Link 
              to="/test-cases" 
              className="block text-center mt-4 text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View all activity →
            </Link>
          )}
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Framework Usage</h3>
          <div className="space-y-3">
            {stats?.frameworks && Object.entries(stats.frameworks).length > 0 ? (
              Object.entries(stats.frameworks).map(([framework, count]) => (
                <div key={framework} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getFrameworkIcon(framework)}</span>
                    <span className="font-medium text-gray-900 capitalize">{framework}</span>
                  </div>
                  <span className="badge-primary">{count}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <TestTube className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No frameworks used yet</p>
                <p className="text-sm">Generate your first test case to see usage</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Getting Started */}
      <div className="card p-6 bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <Zap className="w-8 h-8 text-primary-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-primary-900">Getting Started</h3>
            <p className="text-primary-700 mt-1">
              Connect your GitHub repository and start generating AI-powered test cases in minutes.
            </p>
            <div className="mt-4 flex space-x-3">
              <Link 
                to="/repositories" 
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Connect Repository
              </Link>
              <Link 
                to="/generator" 
                className="btn-secondary"
              >
                Try Demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 