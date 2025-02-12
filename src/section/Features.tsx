'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaRobot, FaUsers } from 'react-icons/fa';
import { Brain } from 'lucide-react';

const Features = () => {
  return (
    <motion.div
      className="text-white py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      id='features'
    >
      <div className="container mx-auto px-4">
      <motion.h2
        className="text-4xl font-bold text-center mb-8 text-green-500"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        DISCOVER OUR CAPABILITIES
      </motion.h2>
        <motion.p
          className="text-xl text-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Powerful Features for Modern Development
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature Card 1 */}
          <div
            className="relative group rounded-2xl sm:rounded-3xl border border-border/50 bg-neutral-900 p-6 sm:p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            style={{ opacity: 1, transform: 'none' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div
                  className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-primary/10 text-primary relative overflow-hidden group-hover:bg-primary/20 transition-colors duration-500"
                  style={{ transform: 'none' }}
                >
                  <div className="absolute inset-0 bg-primary/20 blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <FaCode className="text-2xl sm:text-3xl text-white" />
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-medium text-white flex items-center gap-1">
                  Repository Analysis
                </span>
              </div>
              <h3 className="text-lg text-white sm:text-xl font-semibold mb-3 sm:mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Deep Repository Insights
              </h3>
              <p className="text-sm sm:text-base text-white mb-4 sm:mb-6">
                Comprehensive analysis of your codebase, commit patterns, and development workflows
              </p>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-center gap-2 sm:gap-3" style={{ opacity: 1, transform: 'none' }}>
                  <div className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-green-500/70"></div>
                  <span className="text-xs sm:text-sm text-white">
                    Code quality metrics and trends
                  </span>
                </li>
                <li className="flex items-center gap-2 sm:gap-3" style={{ opacity: 1, transform: 'none' }}>
                  <div className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-green-500/70"></div>
                  <span className="text-xs sm:text-sm text-white">
                    Commit pattern analysis
                  </span>
                </li>
                <li className="flex items-center gap-2 sm:gap-3" style={{ opacity: 1, transform: 'none' }}>
                  <div className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-green-500/70"></div>
                  <span className="text-xs sm:text-sm text-white">
                    Branch management insights
                  </span>
                </li>
                <li className="flex items-center gap-2 sm:gap-3" style={{ opacity: 1, transform: 'none' }}>
                  <div className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-green-500/70"></div>
                  <span className="text-xs sm:text-sm text-white">
                    Development workflow optimization
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Feature Card 2 */}
          <div
            className="relative group rounded-2xl sm:rounded-3xl border border-border/50 bg-neutral-900 p-6 sm:p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            style={{ opacity: 1, transform: 'none' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex gap-3 sm:gap-4 mb-4 sm:mb-6"> 
                <div
                  className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-primary/10 text-primary relative overflow-hidden group-hover:bg-primary/20 transition-colors duration-500"
                  style={{ transform: 'none' }}
                >
                  <div className="absolute inset-0 bg-primary/20 blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <Brain className="text-2xl sm:text-3xl text-white" />
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-medium text-white flex items-center gap-1">
  
                  AI Intelligence
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Advanced AI Insights
              </h3>
              <p className="text-sm sm:text-base text-white mb-4 sm:mb-6">
                Leverage AI to gain deeper insights into your development process
              </p>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-center gap-2 sm:gap-3" style={{ opacity: 1, transform: 'none' }}>
                  <div className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-green-500/70"></div>
                  <span className="text-xs sm:text-sm text-white">
                    Advanced AI algorithms analyze your repository data
                  </span>
                </li>
                <li className="flex items-center gap-2 sm:gap-3" style={{ opacity: 1, transform: 'none' }}>
                  <div className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-green-500/70"></div>
                  <span className="text-xs sm:text-sm text-white">
                    Automated code review suggestions
                  </span>
                </li>
                <li className="flex items-center gap-2 sm:gap-3" style={{ opacity: 1, transform: 'none' }}>
                  <div className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-green-500/70"></div>
                  <span className="text-xs sm:text-sm text-white">
                    Performance bottleneck detection
                  </span>
                </li>
                <li className="flex items-center gap-2 sm:gap-3" style={{ opacity: 1, transform: 'none' }}>
                  <div className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-green-500/70"></div>
                  <span className="text-xs sm:text-sm text-white">
                    Development trend predictions
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Feature Card 3 */}
          <div
            className="relative group rounded-2xl sm:rounded-3xl border border-border/50 bg-neutral-900 p-6 sm:p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            style={{ opacity: 1, transform: 'none' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex gap-3 sm:gap-4 mb-4 sm:mb-6"> 
                <div
                  className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-primary/10 text-primary relative overflow-hidden group-hover:bg-primary/20 transition-colors duration-500"
                  style={{ transform: 'none' }}
                >
                  <div className="absolute inset-0 bg-primary/20 blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10 text-white">
                    <FaUsers className="text-2xl sm:text-3xl" />
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-medium text-white flex items-center gap-1">
                  Team Analytics
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Team Performance Insights
              </h3>
              <p className="text-sm sm:text-base text-white mb-4 sm:mb-6">
                Optimize your team's development efficiency with detailed analytics
              </p>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-center gap-2 sm:gap-3" style={{ opacity: 1, transform: 'none' }}>
                  <div className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-green-500/70"></div>
                  <span className="text-xs sm:text-sm text-white">
                    Track and optimize your team's development efficiency
                  </span>
                </li>
                <li className="flex items-center gap-2 sm:gap-3" style={{ opacity: 1, transform: 'none' }}>
                  <div className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-green-500/70"></div>
                  <span className="text-xs sm:text-sm text-white">
                    Developer productivity metrics
                  </span>
                </li>
                <li className="flex items-center gap-2 sm:gap-3" style={{ opacity: 1, transform: 'none' }}>
                  <div className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-green-500/70"></div>
                  <span className="text-xs sm:text-sm text-white">
                    Collaboration patterns
                  </span>
                </li>
                <li className="flex items-center gap-2 sm:gap-3" style={{ opacity: 1, transform: 'none' }}>
                  <div className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-green-500/70"></div>
                  <span className="text-xs sm:text-sm text-white">
                    Knowledge distribution maps
                  </span>
                </li>
                <li className="flex items-center gap-2 sm:gap-3" style={{ opacity: 1, transform: 'none' }}>
                  <div className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-green-500/70"></div>
                  <span className="text-xs sm:text-sm text-white">
                    Team velocity tracking
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Features;