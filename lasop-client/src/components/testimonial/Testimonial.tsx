// File: src/components/sections/ProblemSection.tsx
'use client';

import React, { useEffect, useState } from 'react';

export default function ProblemSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Delay to allow initial paint before animating
    const t = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const problems = [
    { icon: '🌊', text: 'Lost in endless YouTube tutorials?' },
    { icon: '🏝️', text: 'No one to guide you?' },
    { icon: '📚', text: 'No real-world experience?' },
  ];

  const solutions = [
    { icon: '🎯', text: 'A structured, guided learning journey' },
    { icon: '🤝', text: 'Mentorship + expert support' },
    { icon: '💼', text: 'Real projects to build your portfolio' },
  ];

  return (
    <section
      className="
        relative overflow-hidden
        bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100
        dark:from-slate-900 dark:via-slate-950 dark:to-black
        px-4 sm:px-6 lg:px-10 xl:px-20
        py-16 sm:py-20 lg:py-28
      "
      aria-labelledby="problems-heading"
    >
      {/* Decorative fog/blur orbs (hidden on small for perf) */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div
          className="
            hidden sm:block absolute -top-40 -right-40 w-80 h-80
            bg-white/20 dark:bg-white/5 rounded-full blur-3xl
            animate-pulse will-change-transform
          "
          aria-hidden="true"
        />
        <div
          className="
            hidden md:block absolute -bottom-40 -left-40 w-96 h-96
            bg-gray-200/25 dark:bg-white/5 rounded-full blur-3xl
            animate-pulse [animation-delay:800ms] will-change-transform
          "
          aria-hidden="true"
        />
        <div
          className="
            hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            w-64 h-64 bg-slate-200/20 dark:bg-white/5 rounded-full blur-2xl
            animate-pulse [animation-delay:400ms] will-change-transform
          "
          aria-hidden="true"
        />
      </div>

      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-24 items-center">
        {/* Text side */}
        <div className="space-y-8 sm:space-y-10">
          <div className="relative">
            <h2
              id="problems-heading"
              className="
                font-extrabold tracking-tight
                text-[26px] sm:text-[32px] md:text-[40px] lg:text-[44px]
                leading-tight
                text-gray-900 dark:text-white
              "
            >
              <span
                className="
                  block text-gray-600 dark:text-gray-300
                  text-xl sm:text-2xl md:text-3xl mb-2 font-bold
                "
              >
                ❌ Learning Alone is Hard
              </span>
              <span className="block mt-3">
                <span className="text-emerald-600 dark:text-emerald-400">✅</span>{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-400 dark:to-sky-400">
                  LASOP Gives You a Clear Path
                </span>
              </span>
            </h2>
            <div
              className="
                absolute -inset-4 rounded-xl
                bg-white/30 dark:bg-white/5
                blur-xl -z-10
                hidden sm:block
              "
              aria-hidden="true"
            />
          </div>

          {/* Cards */}
          <div className="space-y-6">
            {/* Problems */}
            <div
              className="
                rounded-2xl p-5 sm:p-6
                bg-white/70 dark:bg-white/10
                backdrop-blur-md
                border border-white/60 dark:border-white/10
                shadow-[0_10px_40px_-10px_rgba(2,6,23,0.15)]
              "
            >
              <h3 className="font-semibold text-xl sm:text-2xl md:text-3xl text-gray-900 dark:text-white mb-4 flex items-center">
                <span className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center mr-3">
                  🚫
                </span>
                Common Learning Struggles
              </h3>
              <ul className="space-y-3 sm:space-y-4">
                {problems.map((p, i) => (
                  <li
                    key={i}
                    className={`
                      flex items-start gap-3 sm:gap-4
                      transition-all duration-700 will-change-transform
                      ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-6 sm:translate-x-8 opacity-0'}
                    `}
                    style={{ transitionDelay: `${i * 120}ms` }}
                  >
                    <span className="text-2xl sm:text-[26px]" aria-hidden="true">
                      {p.icon}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base">
                      {p.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Solutions */}
            <div
              className="
                rounded-2xl p-5 sm:p-6
                bg-white/75 dark:bg-white/10
                backdrop-blur-md
                border border-white/60 dark:border-white/10
                shadow-[0_10px_40px_-10px_rgba(2,6,23,0.15)]
              "
            >
              <h3 className="font-semibold text-xl sm:text-2xl md:text-3xl text-gray-900 dark:text-white mb-4 flex items-center">
                <span className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center mr-3">
                  ✅
                </span>
                LASOP Solution
              </h3>
              <ul className="space-y-3 sm:space-y-4">
                {solutions.map((s, i) => (
                  <li
                    key={i}
                    className={`
                      flex items-start gap-3 sm:gap-4
                      transition-all duration-700 will-change-transform
                      ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-6 sm:translate-x-8 opacity-0'}
                    `}
                    style={{ transitionDelay: `${(i + 3) * 120}ms` }}
                  >
                    <span className="text-2xl sm:text-[26px]" aria-hidden="true">
                      {s.icon}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base">
                      {s.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Visual side */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative group">
            {/* Animated rings */}
            <div
              className="
                absolute inset-0 -m-6 lg:-m-8
                pointer-events-none select-none
              "
              aria-hidden="true"
            >
              <div className="hidden sm:block absolute inset-0 rounded-full border-2 border-gray-300/30 dark:border-white/10 animate-spin-slow scale-110 will-change-transform" />
              <div className="hidden md:block absolute inset-0 rounded-full border border-gray-400/20 dark:border-white/10 animate-spin-reverse scale-125 will-change-transform" />
              <div className="hidden lg:block absolute inset-0 rounded-full border border-gray-200/40 dark:border-white/10 animate-pulse scale-[1.38] will-change-transform" />
            </div>

            {/* Circular image */}
            <div
              className="
                relative
                w-[70vw] max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg
                aspect-square rounded-full overflow-hidden
                shadow-2xl
                ring-1 ring-black/5 dark:ring-white/10
                transition-transform duration-500 group-hover:scale-[1.02]
              "
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-500/10 via-transparent to-gray-600/10 z-10 pointer-events-none" />
              <img
                src="https://t3.ftcdn.net/jpg/04/29/51/34/360_F_429513457_ERhtIk1aD60t7ivaz0QHAJrhcyJ6aPBe.jpg"
                alt="From frustrated learner to confident developer"
                className="
                  w-full h-full object-cover
                  transition-transform duration-700 group-hover:scale-105
                "
              />
              {/* Light sweep */}
              <div
                className="
                  absolute inset-0
                  bg-gradient-to-r from-transparent via-white/30 to-transparent
                  -skew-x-12 translate-x-full
                  transition-transform duration-[1200ms]
                  group-hover:-translate-x-1/2
                  z-20 pointer-events-none
                "
                aria-hidden="true"
              />
            </div>

            {/* Emojis bubbles */}
            <div
              className="
                hidden sm:flex absolute -top-5 -right-5 w-10 h-10
                bg-white/80 dark:bg-white/10 backdrop-blur-sm rounded-full
                items-center justify-center text-gray-700 dark:text-gray-200 font-bold
                shadow-lg border border-white/60 dark:border-white/10
              "
              aria-hidden="true"
            >
              💡
            </div>
            <div
              className="
                hidden sm:flex absolute -bottom-5 -left-5 w-9 h-9
                bg-white/80 dark:bg-white/10 backdrop-blur-sm rounded-full
                items-center justify-center text-gray-700 dark:text-gray-200 font-bold
                shadow-lg border border-white/60 dark:border-white/10
              "
              aria-hidden="true"
            >
              🚀
            </div>
          </div>
        </div>
      </div>

      {/* Local styles */}
      <style jsx>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-spin-reverse { animation: spin-reverse 15s linear infinite; }

        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .animate-spin-slow,
          .animate-spin-reverse,
          .animate-pulse {
            animation: none !important;
          }
          :global(.transition-all),
          :global(.transition-transform) {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
