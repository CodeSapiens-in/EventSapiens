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
  onOpenContributeModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenContributeModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (view: 'home' | 'past-events') => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  const handleScrollTo = (elementId: string) => {
    if (currentView !== 'home') {
      onNavigate('home');
      setTimeout(() => {
        const el = document.getElementById(elementId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(elementId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const handleContributeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onOpenContributeModal) {
      onOpenContributeModal();
    } else {
      window.open('https://github.com/CodeSapiens-in/EventSapiens', '_blank');
    }
  };

  return (
    <header className="w-full bg-[#FFF8DC] pt-5 pb-3 sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">
        {/* Left: Brand Logo */}
        <a
          href={import.meta.env.BASE_URL}
          onClick={(e) => {
            e.preventDefault();
            handleNav('home');
          }}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="shrink-0">
            <EventSapienMascot variant="logo" />
          </div>

          <span className="font-black text-2xl sm:text-3xl tracking-tight text-black leading-none">
            EventSapien
          </span>
        </a>

        {/* Center: Nav links (Mockup matching) */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-9 text-sm font-bold text-black">
          {/* Events with active indicator dot */}
          <button
            onClick={() => handleNav('home')}
            className="relative cursor-pointer transition-colors py-1 group flex flex-col items-center"
          >
            <span
              className={currentView === 'home' ? 'text-black font-extrabold' : 'text-black/70 hover:text-black'}
            >
              Events
            </span>
            {currentView === 'home' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFDE59] border border-black mt-1" />
            )}
          </button>

          <button
            onClick={() => handleScrollTo('tamilnadu-tech-section')}
            className="text-black/70 hover:text-black cursor-pointer transition-colors py-1"
          >
            Communities
          </button>

          <button
            onClick={handleContributeClick}
            className="text-black/70 hover:text-black cursor-pointer transition-colors py-1"
          >
            For Colleges
          </button>

          <button
            onClick={() => handleScrollTo('site-footer')}
            className="text-black/70 hover:text-black cursor-pointer transition-colors py-1"
          >
            About
          </button>
        </nav>

        {/* Right: Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => handleNav(currentView === 'home' ? 'past-events' : 'home')}
            className="border-2 border-black bg-white/70 hover:bg-white text-black px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-[2px_2px_0px_#000] cursor-pointer transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          >
            {currentView === 'home' ? 'Past Events' : 'Active Events'}
          </button>

          <button
            onClick={handleContributeClick}
            className="border-2 border-black bg-black text-white hover:bg-neutral-800 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-[2px_2px_0px_#000] cursor-pointer transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          >
            Contribute
          </button>
        </div>

        {/* Mobile menu hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={handleContributeClick}
            className="px-3 py-1.5 bg-black text-white text-xs font-bold rounded-lg border-2 border-black shadow-[2px_2px_0px_#000]"
          >
            Contribute
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 border-2 border-black bg-white rounded-lg shadow-[2px_2px_0px_#000]"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-y-2 border-black bg-[#FFDE59] p-4 mt-3 space-y-2 text-sm font-bold shadow-[0_4px_0_#000]">
          <button
            onClick={() => handleNav('home')}
            className={`block w-full text-left py-2 px-3 border-2 border-black rounded-lg ${
              currentView === 'home' ? 'bg-black text-white' : 'bg-white text-black'
            }`}
          >
            Events
          </button>
          <button
            onClick={() => handleScrollTo('tamilnadu-tech-section')}
            className="block w-full text-left py-2 px-3 border-2 border-black rounded-lg bg-white text-black"
          >
            Communities
          </button>
          <button
            onClick={handleContributeClick}
            className="block w-full text-left py-2 px-3 border-2 border-black rounded-lg bg-white text-black"
          >
            For Colleges
          </button>
          <button
            onClick={() => handleScrollTo('site-footer')}
            className="block w-full text-left py-2 px-3 border-2 border-black rounded-lg bg-white text-black"
          >
            About
          </button>
          <button
            onClick={() => handleNav(currentView === 'home' ? 'past-events' : 'home')}
            className={`block w-full text-left py-2 px-3 border-2 border-black rounded-lg ${
              currentView === 'past-events' ? 'bg-black text-white' : 'bg-white text-black'
            }`}
          >
            {currentView === 'home' ? 'Past Events' : 'Active Events'}
          </button>
        </div>
      )}
    </header>
  );
};
