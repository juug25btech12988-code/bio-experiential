import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Footer
 * Educational project footer with team member placeholders,
 * academic context, and quick navigation.
 */
export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-slate-800/80">
          {/* Col 1: Project Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🧬</span>
              <span className="font-bold text-white text-base">
                DNA Computing Project
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              "Exploring DNA-Based Data Storage and Information Processing" — an interactive educational project investigating molecular information density, biological synthesis pipelines, and biocomputing logic.
            </p>
            <div className="inline-block text-[11px] font-mono px-2.5 py-1 rounded bg-slate-800 text-indigo-300 border border-slate-700">
              Department of CSE (Cybersecurity)
            </div>
          </div>

          {/* Col 2: Quick Links & Sections */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wide">
              Navigation & Topics
            </h4>
            <ul className="text-xs space-y-2 text-slate-400">
              <li>
                <Link to="/" className="hover:text-indigo-300 transition-colors">
                  Theory: What is DNA & Structure
                </Link>
              </li>
              <li>
                <Link to="/#section-pipeline" className="hover:text-indigo-300 transition-colors">
                  The 7-Stage Digital-to-DNA Pipeline
                </Link>
              </li>
              <li>
                <Link to="/#section-real-world" className="hover:text-indigo-300 transition-colors">
                  Real-World Synthesis & Sequencing
                </Link>
              </li>
              <li>
                <Link to="/#section-computing" className="hover:text-indigo-300 transition-colors">
                  DNA Logic & Information Processing
                </Link>
              </li>
              <li>
                <Link to="/simulator" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
                  Hands-On Pipeline Simulator →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Team Members */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wide flex items-center gap-1.5">
              <span>👥</span> Group 1 (CSE – Cybersecurity)
            </h4>
            <p className="text-[11px] text-slate-400">
              Project Team Members:
            </p>
            <div className="grid grid-cols-1 gap-1.5 text-xs font-mono">
              <div className="px-2.5 py-1.5 rounded bg-slate-800/80 border border-slate-700/60 text-slate-200 flex items-center justify-between">
                <span>Adith Arya</span>
                <span className="text-[11px] text-indigo-300 font-semibold">25BTRCC059</span>
              </div>
              <div className="px-2.5 py-1.5 rounded bg-slate-800/80 border border-slate-700/60 text-slate-200 flex items-center justify-between">
                <span>Alby Thomas</span>
                <span className="text-[11px] text-indigo-300 font-semibold">25BTRCC008</span>
              </div>
              <div className="px-2.5 py-1.5 rounded bg-slate-800/80 border border-slate-700/60 text-slate-200 flex items-center justify-between">
                <span>Ananthu M K</span>
                <span className="text-[11px] text-indigo-300 font-semibold">25BTRCC010</span>
              </div>
              <div className="px-2.5 py-1.5 rounded bg-slate-800/80 border border-slate-700/60 text-slate-200 flex items-center justify-between">
                <span>Ansaff E C</span>
                <span className="text-[11px] text-indigo-300 font-semibold">25BTRCC012</span>
              </div>
              <div className="px-2.5 py-1.5 rounded bg-slate-800/80 border border-slate-700/60 text-slate-200 flex items-center justify-between">
                <span>Sabaresh V S B</span>
                <span className="text-[11px] text-indigo-300 font-semibold">25BTRCC046</span>
              </div>
              <div className="px-2.5 py-1.5 rounded bg-slate-800/80 border border-slate-700/60 text-slate-200 flex items-center justify-between">
                <span>Seyaan Ahmed T S</span>
                <span className="text-[11px] text-indigo-300 font-semibold">25BTRCC049</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & academic disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Group 1 (CSE – Cybersecurity). Interactive reference on DNA computing & molecular storage.
          </div>
          <div className="text-[11px] text-slate-400">
            Strictly educational • Client-side simulation • No API keys required
          </div>
        </div>
      </div>
    </footer>
  );
}
