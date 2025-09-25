'use client';

import React, { useEffect, useState } from 'react';

export default function ProblemSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    
    setTimeout(() => setIsVisible(true), 100);
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
    <section className="relative bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 py-24 px-6 md:px-24 overflow-hidden">
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gray-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-slate-200/15 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
        {/* Text Side */}
        <div className="space-y-8">
          <div className="relative">
            <h3 className="font-bold text-[28px] md:text-[40px] text-gray-800 mb-8 leading-tight">
              <span className="block text-gray-600 text-2xl md:text-3xl mb-2 font-bold">
                ❌ Learning Alone is Hard
              </span>
              <span className="block mt-4">
                <span className="text-gray-700">✅</span> LASOP Gives You a Clear Path
              </span>
            </h3>
            <div className="absolute -inset-4 bg-white/30 blur-xl rounded-lg -z-10"></div>
          </div>

          {/* Problems List */}
          <div className="space-y-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/60">
              <h5 className="font-semibold text-2xl md:text-3xl text-gray-800 mb-4 flex items-center">
                <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">🚫</span>
                Common Learning Struggles
              </h5>
              <ul className="space-y-4">
                {problems.map((problem, index) => (
                  <li
                    key={index}
                    className={`flex items-start transform transition-all duration-700 ${
                      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                    }`}
                    style={{ transitionDelay: `${index * 200}ms` }}
                  >
                    <span className="text-2xl mr-4">
                      {problem.icon}
                    </span>
                    <span className="text-gray-700 font-medium">{problem.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Solutions List */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/60">
              <h5 className="font-semibold text-2xl md:text-3xl text-gray-800 mb-4 flex items-center">
                <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">✅</span>
                LASOP Solution
              </h5>
              <ul className="space-y-4">
                {solutions.map((solution, index) => (
                  <li
                    key={index}
                    className={`flex items-start transform transition-all duration-700 ${
                      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                    }`}
                    style={{ transitionDelay: `${(index + 3) * 200}ms` }}
                  >
                    <span className="text-2xl mr-4">
                      {solution.icon}
                    </span>
                    <span className="text-gray-700 font-medium">{solution.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

       
        <div className="flex justify-center relative">
          <div className="relative group">
           
            <div className="absolute inset-0 rounded-full border-2 border-gray-300/30 animate-spin-slow scale-110"></div>
            <div className="absolute inset-0 rounded-full border border-gray-400/20 animate-spin-reverse scale-125"></div>
            <div className="absolute inset-0 rounded-full border border-gray-200/40 animate-pulse scale-140"></div>

           
            <div className="relative w-[400px] h-[400px] rounded-full overflow-hidden shadow-2xl transform group-hover:scale-105 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-500/10 via-transparent to-gray-600/10 z-10"></div>
              <img
                src="https://t3.ftcdn.net/jpg/04/29/51/34/360_F_429513457_ERhtIk1aD60t7ivaz0QHAJrhcyJ6aPBe.jpg"
                alt="Frustrated learner transformed into confident developer"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000 z-20"></div>
            </div>

          
            <div className="absolute -top-6 -right-6 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 font-bold shadow-lg border border-white/60">
              💡
            </div>
            <div className="absolute -bottom-6 -left-6 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 font-bold shadow-lg border border-white/60">
              🚀
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      {/* <div className="text-center mt-16">
        <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-white/50">
          <span className="text-2xl animate-pulse">⬇️</span>
          <span className="text-gray-700 font-medium">
            Apply Now
          </span>
          <span className="text-2xl animate-pulse">⬇️</span>
        </div>
      </div> */}

      <style jsx>{`
        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes spin-reverse {
          0% {
            transform: rotate(360deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 15s linear infinite;
        }
      `}</style>
    </section>
  );
}