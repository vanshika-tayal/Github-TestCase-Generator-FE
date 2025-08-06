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
  Sparkles,
  ArrowRight,
  Github,
  Code2,
  CheckCircle2,
  AlertCircle,
  Activity,
  BarChart3,
  Zap,
  Target,
  Users,
  GitBranch,
  Layers,
  Shield,
  Cpu,
  Globe,
  Package,
  Terminal
} from 'lucide-react';
import { testCasesAPI, healthCheck } from '../services/api';
import { cn, getRelativeTime, getFrameworkIcon } from '../utils/helpers';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const StatCard = ({ title, value, icon: Icon, color, trend, delay = 0 }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600',
    purple: 'from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600',
    green: 'from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600',
    amber: 'from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600',
  };

  const bgClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20',
    purple: 'bg-purple-50 dark:bg-purple-900/20',
    green: 'bg-green-50 dark:bg-green-900/20',
    amber: 'bg-amber-50 dark:bg-amber-900/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <div className="mt-2 flex items-baseline">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
              {trend !== undefined && (
                <div className="ml-3 flex items-center">
                  <TrendingUp className={cn(
                    "w-4 h-4",
                    trend > 0 ? "text-green-500" : "text-red-500 rotate-180"
                  )} />
                  <span className={cn(
                    "ml-1 text-sm font-medium",
                    trend > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  )}>
                    {Math.abs(trend)}%
                  </span>
                </div>
              )}
            </div>
            <div className="mt-4 h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "60%" }}
                transition={{ duration: 1, delay: delay + 0.3 }}
                className={cn("h-full bg-gradient-to-r", colorClasses[color])}
              />
            </div>
          </div>
          <div className={cn("p-3 rounded-xl", bgClasses[color])}>
            <Icon className={cn("w-6 h-6 bg-gradient-to-br bg-clip-text text-transparent", colorClasses[color])} 
                 style={{ WebkitTextStroke: '1.5px currentColor' }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const QuickActionCard = ({ title, description, icon: Icon, href, gradient, delay = 0 }) => (
  <Link to={href}>
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="relative group h-full"
    >
      <div className={cn(
        "absolute inset-0 bg-gradient-to-r rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300",
        gradient
      )} />
      <div className="relative h-full bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300">
        <div className="flex flex-col h-full">
          <div className={cn(
            "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4",
            gradient
          )}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 flex-1">
            {description}
          </p>
          <div className="mt-4 flex items-center text-sm font-medium">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Get Started
            </span>
            <ArrowRight className="ml-2 w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </motion.div>
  </Link>
);

const ActivityItem = ({ item, type, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    className="group flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200"
  >
    <div className={cn(
      "p-2 rounded-lg",
      type === 'testCase' 
        ? "bg-green-100 dark:bg-green-900/30" 
        : "bg-blue-100 dark:bg-blue-900/30"
    )}>
      {type === 'testCase' ? (
        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
      ) : (
        <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
      )}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
        {item.fileName || `${item.summaryCount} test summaries`}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-0.5">
        <Clock className="w-3 h-3 mr-1" />
        {getRelativeTime(item.createdAt)}
      </p>
    </div>
    <span className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300">
      {item.framework}
    </span>
  </motion.div>
);

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useQuery('stats', testCasesAPI.getStats, {
    refetchInterval: 30000,
  });

  const { data: health, isLoading: healthLoading } = useQuery('health', healthCheck, {
    refetchInterval: 60000,
  });

  const quickActions = [
    {
      title: 'Browse Repositories',
      description: 'Connect and explore your GitHub repositories with seamless integration',
      icon: FolderGit2,
      href: '/repositories',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Generate Tests',
      description: 'Create comprehensive test suites powered by advanced AI',
      icon: TestTube,
      href: '/generator',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Manage Test Cases',
      description: 'View, edit, and organize all your generated test cases',
      icon: FileText,
      href: '/test-cases',
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  const recentActivity = stats?.recentActivity || [];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full space-y-8"
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10 rounded-3xl" />
        <div className="relative p-8 lg:p-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200 dark:border-blue-800 mb-4"
              >
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                  AI-Powered Test Generation Platform
                </span>
              </motion.div>
              
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
                  Welcome back!
                </span>
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                Transform your development workflow with intelligent test case generation. 
                Create, manage, and deploy comprehensive test suites in seconds.
              </p>
            </div>

            {/* System Status Badge */}
            {!healthLoading && health && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className={cn(
                  "mt-6 lg:mt-0 inline-flex items-center px-6 py-3 rounded-2xl font-medium shadow-lg",
                  health.status === 'OK'
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                    : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                )}
              >
                {health.status === 'OK' ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    All Systems Operational
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 mr-2" />
                    System Maintenance
                  </>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Test Cases"
          value={statsLoading ? '—' : (stats?.totalTestCases || 0)}
          icon={TestTube}
          color="blue"
          trend={12}
          delay={0.1}
        />
        <StatCard
          title="Test Summaries"
          value={statsLoading ? '—' : (stats?.totalSummaries || 0)}
          icon={FileText}
          color="green"
          trend={8}
          delay={0.15}
        />
        <StatCard
          title="Frameworks"
          value={statsLoading ? '—' : Object.keys(stats?.frameworks || {}).length}
          icon={Code2}
          color="purple"
          delay={0.2}
        />
        <StatCard
          title="Success Rate"
          value="99.2%"
          icon={Target}
          color="amber"
          trend={3}
          delay={0.25}
        />
      </div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
          <Zap className="w-5 h-5 text-amber-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <QuickActionCard 
              key={index} 
              {...action} 
              delay={0.3 + index * 0.1}
            />
          ))}
        </div>
      </motion.div>

      {/* Activity and Insights */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h3>
            <Activity className="w-5 h-5 text-gray-400 dark:text-gray-600" />
          </div>
          
          <div className="space-y-2">
            {recentActivity.length > 0 ? (
              recentActivity.slice(0, 5).map((item, index) => (
                <ActivityItem
                  key={index}
                  item={item}
                  type={item.itemType}
                  delay={0.5 + index * 0.05}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-2xl mb-4">
                  <FileText className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                </div>
                <p className="text-gray-900 dark:text-white font-medium">No activity yet</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Start by generating your first test case
                </p>
                <Link
                  to="/generator"
                  className="inline-flex items-center mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  Get Started <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* Framework Distribution */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Framework Usage</h3>
            <BarChart3 className="w-5 h-5 text-gray-400 dark:text-gray-600" />
          </div>
          
          <div className="space-y-4">
            {stats?.frameworks && Object.entries(stats.frameworks).length > 0 ? (
              Object.entries(stats.frameworks).map(([framework, count], index) => {
                const percentage = stats.totalTestCases > 0
                  ? Math.round((count / stats.totalTestCases) * 100)
                  : 0;
                return (
                  <motion.div
                    key={framework}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getFrameworkIcon(framework)}</span>
                        <span className="font-medium text-gray-900 dark:text-white capitalize">
                          {framework}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                        {count} tests
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.7 + index * 0.1 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                      />
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-2xl mb-4">
                  <TestTube className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                </div>
                <p className="text-gray-900 dark:text-white font-medium">No frameworks used yet</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Generate tests to see framework usage
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Feature Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <Globe className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Active Projects</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
          <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-3" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">100%</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Secure</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
          <Cpu className="w-8 h-8 text-green-600 dark:text-green-400 mb-3" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">2.1s</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Avg Speed</p>
        </div>
        
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
          <Package className="w-8 h-8 text-amber-600 dark:text-amber-400 mb-3" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">247</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Dependencies</p>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 lg:p-12 shadow-2xl"
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">
              Ready to revolutionize your testing workflow?
            </h3>
            <p className="text-blue-100 text-lg">
              Connect your repositories and experience the power of AI-driven test generation.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/repositories"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:shadow-xl transition-all"
            >
              <Github className="w-5 h-5 mr-2" />
              Connect GitHub
            </Link>
            <Link
              to="/generator"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/20 backdrop-blur text-white font-semibold rounded-xl border border-white/30 hover:bg-white/30 transition-all"
            >
              <Terminal className="w-5 h-5 mr-2" />
              Try Demo
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;