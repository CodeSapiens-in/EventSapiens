/**
 * @license
 * SPDX-License-Identifier: MIT
 */

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

import { EventSapienMascot } from './EventSapienMascot';

interface NavbarProps {
  currentView: 'home' | 'past-events';
  onNavigate: (view: 'home' | 'past-events') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (view: 'home' | 'past-events') => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full bg-[#FFF8DC] pt-5 pb-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-6">
        <a
          href={import.meta.env.BASE_URL}
          onClick={(e) => {
            e.preventDefault();
            handleNav('home');
          }}
          className="flex items-center gap-3.5 group cursor-pointer"
        >
          <div className="shrink-0">
            <EventSapienMascot variant="logo" />
          </div>

          <span className="font-black text-3xl sm:text-4xl md:text-[2.6rem] tracking-tight text-black leading-none">
            EventSapien
          </span>
        </a>

        <div className="hidden sm:flex items-center gap-5">
          <button
            onClick={() => handleNav(currentView === 'home' ? 'past-events' : 'home')}
            className="text-sm font-bold text-black/80 hover:text-black hover:underline underline-offset-4 cursor-pointer transition-colors"
          >
            {currentView === 'home' ? 'Past Events' : 'Active Events'}
          </button>

          <a
            href="https://github.com/CodeSapiens-in/EventSapiens"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-black text-white hover:bg-neutral-800 text-sm font-black border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_#000]"
          >
            <span>Contribute</span>
          </a>
        </div>

        {/* Mobile menu controls */}
        <div className="flex sm:hidden items-center gap-2">
          <a
            href="https://github.com/CodeSapiens-in/EventSapiens"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 bg-black text-white text-xs font-black border-2 border-black shadow-[2px_2px_0px_#000]"
          >
            Contribute
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 border-2 border-black bg-white"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-y-2 border-black bg-[#FFDE59] p-4 mt-3 space-y-2 text-sm font-bold">
          <button
            onClick={() => handleNav('home')}
            className={`block w-full text-left py-2 px-3 border-2 border-black ${
              currentView === 'home' ? 'bg-black text-white' : 'bg-white text-black'
            }`}
          >
            Active Events
          </button>
          <button
            onClick={() => handleNav('past-events')}
            className={`block w-full text-left py-2 px-3 border-2 border-black ${
              currentView === 'past-events' ? 'bg-black text-white' : 'bg-white text-black'
            }`}
          >
            Past Events
          </button>
        </div>
      )}
    </header>
  );
};
