'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { features } from '@/constants/features';

const splitFeatures = () => {
  const mid = Math.ceil(features.length / 2);
  return [features.slice(0, mid), features.slice(mid)];
};

const Features = () => {
  const [col1, col2] = splitFeatures();
  const columns = [col1 || [], col2 || []];
  return (
    <motion.div
      className="py-12 flex justify-center bg-gradient-to-b from-neutral-950/80 via-neutral-900/80 to-neutral-950/80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      id='features'
    >
      <div className="w-full max-w-5xl px-0 py-0 flex flex-col items-center">
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
          Powerful features for every role: BA, QA, Technical Writer, Security Analyst, Auditor, Developer.
        </motion.p>
        <hr className="mb-12 w-full border-neutral-800" />
        <div className="overflow-x-auto w-full">
          <table className="min-w-full border-collapse">
            <tbody>
              <tr>
                {columns.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    className={`align-top px-6 py-0 border-neutral-800 ${colIdx !== 0 ? 'border-l' : ''}`}
                    style={{width: '50%'}}
                  >
                    {(col || []).map((feature, idx) => (
                      <div key={idx} className={`py-8 ${idx !== 0 ? 'border-t border-neutral-800' : ''}`}>
                        <h3 className="text-lg text-white font-semibold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-white mb-4">
                          {feature.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {feature.roles && feature.roles.map((role, i) => (
                            <span key={i} className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default Features;