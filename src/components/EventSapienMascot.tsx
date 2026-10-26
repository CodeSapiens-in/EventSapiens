/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

interface EventSapienMascotProps {
  variant?: 'logo' | 'hero' | 'compact';
  className?: string;
  showSpeechBubble?: boolean;
}

const MASCOT_QUOTES = [
  "Namma ooru student events! 📍",
  "Hackathons, symposiums & workshops across TN ⚡",
  "Built by students, for students 💡",
  "Ready to submit your college event? 🚀",
  "Code. Build. Win. ✨",
  "Check out tamilnadu.tech for community meetups! 🌴"
];

export const EventSapienMascot: React.FC<EventSapienMascotProps> = ({
  variant = 'hero',
  className = '',
  showSpeechBubble = true
}) => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isBouncing, setIsBouncing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMascotClick = () => {
    setIsBouncing(true);
    setQuoteIndex((prev) => (prev + 1) % MASCOT_QUOTES.length);
    setTimeout(() => setIsBouncing(false), 500);
  };

  const isLogo = variant === 'logo';
  const isCompact = variant === 'compact';

  // Base container dimensions
  const containerClasses = isLogo
    ? 'w-11 h-11 sm:w-13 sm:h-13'
    : isCompact
    ? 'w-24 h-24 sm:w-28 sm:h-28'
    : 'w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96';

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${containerClasses} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={!isLogo ? handleMascotClick : undefined}
      role={!isLogo ? 'button' : undefined}
      tabIndex={!isLogo ? 0 : undefined}
      title={!isLogo ? "Click me!" : "EventSapien Logo"}
      aria-label="EventSapien Mascot"
      style={{ cursor: !isLogo ? 'pointer' : 'default' }}
    >
      <style>{`
        @keyframes mascotFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .animate-mascot-float {
          animation: mascotFloat 3.8s ease-in-out infinite;
        }
      `}</style>

      {/* Interactive Speech Bubble for Hero variant */}
      {!isLogo && showSpeechBubble && (
        <div
          className={`absolute -top-10 sm:-top-12 z-20 transition-all duration-300 pointer-events-none ${
            isHovered ? 'scale-105 opacity-100' : 'opacity-90'
          }`}
        >
          <div className="bg-[#FFDE59] text-black border-2 border-black px-3 py-1.5 shadow-[3px_3px_0px_#000] text-xs font-mono font-black rounded-sm whitespace-nowrap flex items-center gap-1.5">
            <span>{MASCOT_QUOTES[quoteIndex]}</span>
          </div>
          {/* Arrow pointing down */}
          <div className="w-0 h-0 border-x-6 border-x-transparent border-t-6 border-t-black mx-auto mt-[-1px]" />
        </div>
      )}

      {/* Exact User Monkey Image with Transparent Background */}
      <div
        className={`w-full h-full flex items-center justify-center transition-transform duration-200 ${
          !isLogo ? 'animate-mascot-float' : 'hover:scale-105'
        } ${isBouncing ? 'scale-90 !transition-none' : ''}`}
      >
        <img
          src="/assets/images/monkey_logo.png"
          alt="EventSapien Mascot"
          className="w-full h-full object-contain pointer-events-none select-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
          loading="eager"
        />
      </div>
    </div>
  );
};
