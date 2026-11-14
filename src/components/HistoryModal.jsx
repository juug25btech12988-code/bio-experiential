import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * HistoryModal
 * Interactive drawer/modal to view, search, load, copy, and manage
 * previously saved input texts and their DNA encoding parameters.
 */
export default function HistoryModal({
  isOpen = false,
  onClose,
  history = [],
  onLoadItem,
  onDeleteItem,
  onClearHistory,
}) {
  const [copiedId, setCopiedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredHistory = history.filter((item) =>
    item.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopy = (item) => {
    navigator.clipboard.writeText(item.text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          aria-hidden="true"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[85vh]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="history-modal-title"
        >
          {/* Header */}
          <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">📜</span>
              <div>
                <h3
                  id="history-modal-title"
                  className="font-bold text-slate-800 text-base sm:text-lg flex items-center gap-2"
                >
                  Saved Input History
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                    {history.length} {history.length === 1 ? 'entry' : 'entries'}
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Review and reload previous simulation inputs.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {history.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear all saved input history?')) {
                      onClearHistory();
                    }
                  }}
                  className="text-xs font-medium text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  Clear All
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                aria-label="Close history modal"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Search bar (visible if > 2 items) */}
          {history.length > 2 && (
            <div className="px-6 pt-3 pb-1 border-b border-slate-100 bg-white">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search history by text..."
                className="w-full text-xs font-mono px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-400"
              />
            </div>
          )}

          {/* History List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {history.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <span className="text-4xl block">📭</span>
                <p className="text-sm font-semibold text-slate-600">
                  No saved history yet
                </p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Type any text in the simulator and click{' '}
                  <strong className="text-indigo-600 font-mono">💾 Save to History</strong> to store records here.
                </p>
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs font-mono">
                No history entries matching "{searchQuery}"
              </div>
            ) : (
              filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-indigo-200 transition-all space-y-2.5"
                >
                  {/* Meta row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-mono text-[11px]">
                        {item.dateString}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 font-mono text-[10px] font-semibold">
                        {item.mode === 'constraint-aware' ? 'Goldman Rotated' : 'Direct 2-Bit'}
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-slate-500">
                      <span>{item.charCount} chars</span> • <span>{item.byteCount} B</span> •{' '}
                      <span className="text-indigo-600 font-bold">{item.dnaLength} bases</span>
                    </div>
                  </div>

                  {/* Input Text Box */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 font-mono text-xs text-slate-800 break-all max-h-24 overflow-y-auto">
                    {item.text}
                  </div>

                  {/* DNA preview snippet if available */}
                  {item.dnaPreview && (
                    <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
                      <span className="text-slate-400">DNA:</span>
                      <span className="font-bold text-indigo-600 tracking-wider">
                        {item.dnaPreview}
                      </span>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleCopy(item)}
                      className="text-[11px] font-mono text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
                    >
                      <span>{copiedId === item.id ? '✓ Copied' : '📋 Copy Text'}</span>
                    </button>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onDeleteItem(item.id)}
                        className="text-[11px] font-mono text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded transition-colors"
                        title="Delete this entry"
                      >
                        Delete
                      </button>

                      <button
                        type="button"
                        onClick={() => onLoadItem(item, 'encode')}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors flex items-center gap-1"
                      >
                        <span>Load Text (Encoder)</span>
                      </button>

                      {item.dna && (
                        <button
                          type="button"
                          onClick={() => onLoadItem(item, 'decode')}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors flex items-center gap-1"
                        >
                          <span>Load DNA (Decoder)</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
            <span>Stored in browser local storage</span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
