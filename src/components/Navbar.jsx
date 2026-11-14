import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Navbar
 * Responsive navigation bar with active route highlight,
 * section jumping, glassmorphism backdrop, and direct CTA to the DNA simulator.
 */
export default function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isCurrentPage = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/90 border-b border-slate-200/80 shadow-xs transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group focus:outline-hidden focus:ring-2 focus:ring-indigo-400 rounded-lg p-1"
          aria-label="DNA Computing Home"
        >
          {/* Animated mini helix icon */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M4 4 Q8 12 12 12 T20 20" stroke="#F4A5A5" strokeWidth="2.5" />
              <path d="M4 20 Q8 12 12 12 T20 4" stroke="#A5D4F4" strokeWidth="2.5" />
              <line x1="6" y1="8" x2="18" y2="16" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.8" />
              <line x1="6" y1="16" x2="18" y2="8" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.8" />
            </svg>
          </div>

          <div className="flex flex-col">
            <span className="font-bold text-slate-800 text-base tracking-tight leading-none group-hover:text-indigo-600 transition-colors">
              DNA Computing
            </span>
            <span className="text-[10px] font-mono text-slate-500 font-medium tracking-wide">
              Molecular Data Storage & Computing
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium" aria-label="Main Navigation">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-lg transition-all ${
              isCurrentPage('/') && !location.hash
                ? 'text-indigo-700 bg-indigo-50 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            Theory
          </Link>

          <Link
            to="/#section-what-is-dna"
            className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-all text-xs lg:text-sm"
          >
            What is DNA
          </Link>

          <Link
            to="/#section-pipeline"
            className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-all text-xs lg:text-sm"
          >
            7-Stage Pipeline
          </Link>

          <Link
            to="/#section-real-world"
            className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-all text-xs lg:text-sm"
          >
            Real Storage
          </Link>

          <Link
            to="/#section-computing"
            className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 transition-all text-xs lg:text-sm"
          >
            Biocomputing
          </Link>

          <div className="h-5 w-px bg-slate-200 mx-1" />

          <Link
            to="/simulator"
            className={`px-3.5 py-1.5 rounded-lg transition-all font-semibold ${
              isCurrentPage('/simulator')
                ? 'text-indigo-700 bg-indigo-50'
                : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-100/70'
            }`}
          >
            Simulator
          </Link>

          <Link
            to="/simulator"
            className="ml-2 px-4 py-2 rounded-xl text-xs lg:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 shadow-sm hover:shadow transition-all flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Try Simulator</span>
            <span aria-hidden="true">→</span>
          </Link>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-400"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 py-3 flex flex-col gap-2 shadow-lg">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`px-3 py-2 rounded-lg text-sm font-medium ${
              isCurrentPage('/') && !location.hash ? 'text-indigo-700 bg-indigo-50 font-semibold' : 'text-slate-700'
            }`}
          >
            Theory Overview
          </Link>
          <Link
            to="/#section-what-is-dna"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
          >
            What is DNA
          </Link>
          <Link
            to="/#section-pipeline"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
          >
            7-Stage Pipeline
          </Link>
          <Link
            to="/#section-real-world"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
          >
            Real Storage & Synthesis
          </Link>
          <Link
            to="/#section-computing"
            onClick={() => setMobileMenuOpen(false)}
            className="px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
          >
            Biocomputing & Molecular Logic
          </Link>
          <Link
            to="/simulator"
            onClick={() => setMobileMenuOpen(false)}
            className={`px-3 py-2 rounded-lg text-sm font-medium ${
              isCurrentPage('/simulator') ? 'text-indigo-700 bg-indigo-50 font-semibold' : 'text-slate-700'
            }`}
          >
            Interactive Simulator
          </Link>
          <Link
            to="/simulator"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-center px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs mt-1"
          >
            Try the Simulator →
          </Link>
        </div>
      )}
    </header>
  );
}
