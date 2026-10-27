/**
 * @license
 * SPDX-License-Identifier: MIT
 */

import React from 'react';
import { ArrowDown } from 'lucide-react';
import { EventSapienMascot } from './EventSapienMascot';

interface HeroIntroProps {
  onExploreClick: () => void;
}

export const HeroIntro: React.FC<HeroIntroProps> = ({ onExploreClick }) => {
  return (
    <section className="bg-[#FFF8DC] min-h-[calc(100vh-5.5rem)] flex flex-col justify-center pb-12 pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 py-6">
          {/* Left: Wordings */}
          <div className="flex-1 max-w-2xl text-left">
            <div className="inline-block border-[2px] border-black bg-[#FFDE59] px-3 py-1 text-xs sm:text-sm font-mono font-black uppercase text-black mb-5 shadow-[2px_2px_0px_#000]">
              COLLEGE EVENT CALENDAR • TAMIL NADU
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-black tracking-tight leading-[1.05]">
              Namma ooru student events
            </h1>

            <p className="mt-5 text-base sm:text-lg text-black/85 font-medium leading-relaxed max-w-xl">
              Discover hackathons, workshops, and college symposiums happening across Tamil Nadu. Curated by student communities.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-4 mt-8">
              <button
                onClick={onExploreClick}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-black text-white hover:bg-neutral-800 text-sm font-black border-2 border-black shadow-[4px_4px_0px_#000] cursor-pointer transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#000]"
              >
                <span>Browse events</span>
                <ArrowDown className="w-4 h-4 stroke-[3]" />
              </button>

              <a
                href="https://github.com/CodeSapiens-in/EventSapiens"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#FFDE59] text-black hover:bg-[#FFE680] text-sm font-black border-2 border-black shadow-[4px_4px_0px_#000] cursor-pointer transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#000]"
              >
                <span>Contribute</span>
              </a>
            </div>
          </div>

          <div className="shrink-0 flex items-center justify-center p-4">
            <EventSapienMascot variant="hero" />
          </div>
        </div>

        {/* Subtle scroll indicator for desktop */}
        <div className="hidden lg:flex items-center justify-center pt-8">
          <button
            onClick={onExploreClick}
            className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-black/60 hover:text-black cursor-pointer transition-colors"
          >
            <span>Scroll down for events</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
};
