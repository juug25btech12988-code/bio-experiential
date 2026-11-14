import React from 'react';
import { motion } from 'framer-motion';

/**
 * PipelineStep
 * Reusable stage card for the 7-stage DNA data storage pipeline.
 */
export default function PipelineStep({
  stageNum = 1,
  title = '',
  label = '',
  meta = '',
  description = '',
  isActive = false,
  isComplete = false,
  children,
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`relative p-5 rounded-2xl bg-white border transition-all duration-300 shadow-sm ${
        isActive
          ? 'border-indigo-400 ring-2 ring-indigo-200/60 shadow-md scale-[1.01]'
          : 'border-slate-200/80 hover:border-slate-300'
      } ${className}`}
      aria-label={`Stage ${stageNum}: ${title}`}
    >
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          {/* Stage Number Badge */}
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors ${
              isComplete
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                : isActive
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            {isComplete ? '✓' : stageNum}
          </div>

          <div>
            <h3 className="font-semibold text-slate-800 text-sm md:text-base leading-tight">
              {title}
            </h3>
            {label && (
              <span className="text-xs font-mono text-slate-600">
                {label}
              </span>
            )}
          </div>
        </div>

        {meta && (
          <span className="text-xs font-mono px-2.5 py-1 bg-slate-50 border border-slate-200/60 rounded-full text-slate-600">
            {meta}
          </span>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="text-xs text-slate-500 mb-3.5 leading-relaxed">
          {description}
        </p>
      )}

      {/* Stage Content */}
      <div className="mt-2">{children}</div>
    </motion.div>
  );
}
