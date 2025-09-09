'use client';

import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const steps = [
  {
    number: "01",
    title: 'Choose Your Path',
    subtitle: 'Pick Your Dream Track',
    description: 'Frontend, Backend, Fullstack, or Mobile - we have the perfect learning path waiting for you!',
    color: '#3360FF',
    bgColor: '#E6EDFF',
    icon: '🎯',
    features: ['Multiple tracks available', 'Beginner to advanced', 'Industry-focused curriculum']
  },
  {
    number: "02", 
    title: 'Learn & Build',
    subtitle: 'Hands-On Experience',
    description: 'Work on real projects with expert mentors guiding you every step of the way. No more tutorial hell!',
    color: '#3360FF',
    bgColor: '#E6EDFF',
    icon: '🚀',
    features: ['Real-world projects', 'Expert mentorship', 'Portfolio building']
  },
  {
    number: "03",
    title: 'Get Hired',
    subtitle: 'Land Your Dream Job',
    description: 'From interview prep to salary negotiation - we help you secure that tech job you\'ve always wanted!',
    color: '#3360FF',
    bgColor: '#E6EDFF',
    icon: '💼',
    features: ['Interview preparation', 'Resume optimization', 'Job placement support']
  },
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true, easing: 'ease-out-cubic' });
    setTimeout(() => setIsVisible(true), 200);
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-[#E6EDFF] py-24 px-6 md:px-12 overflow-hidden">
  
      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20" data-aos="fade-down">
          <h2 className="font-bold text-[28px] md:text-[40px] text-accent mb-6 leading-tight">
            How LASOP Works
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Your journey from beginner to <span className="text-[#3360FF] font-bold">hired developer</span> in 3 simple steps
          </p>

          {/* Progress indicator */}
          <div className="flex justify-center mt-8 space-x-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-500 cursor-pointer ${
                  index === activeStep 
                    ? 'bg-[#3360FF] scale-125' 
                    : 'bg-gray-400 hover:bg-gray-500'
                }`}
                onClick={() => setActiveStep(index)}
                role="button"
                tabIndex={0}
              ></div>
            ))}
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {steps.map((step, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 200}
              className={`relative group cursor-pointer transition-all duration-700 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
              onMouseEnter={() => setActiveStep(index)}
            >
              {/* Card */}
              <div className={`relative p-8 rounded-3xl transition-all duration-500 transform ${
                activeStep === index 
                  ? 'scale-105 shadow-2xl shadow-[#3360FF]/25' 
                  : 'hover:scale-102 shadow-xl'
              } bg-white`}>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Step number and icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-6xl font-black text-[#3360FF] opacity-80">
                      {step.number}
                    </div>
                    <div className="text-5xl animate-bounce" style={{ animationDelay: `${index * 200}ms` }}>
                      {step.icon}
                    </div>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold text-[#3360FF] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-lg font-semibold text-gray-700 mb-4">
                    {step.subtitle}
                  </p>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {step.description}
                  </p>

                  <ul className="space-y-2">
                    {step.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 rounded-full bg-[#3360FF] mr-3 animate-pulse"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Hover effect overlay */}
                <div className={`absolute inset-0 rounded-3xl transition-opacity duration-300 ${
                  activeStep === index ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                } bg-[#3360FF] opacity-5`}></div>
              </div>

              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-[#3360FF] transform -translate-y-1/2 z-20">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-[#3360FF] border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div data-aos="fade-up" data-aos-delay="800" className="text-center">
          <div className="inline-flex flex-col items-center space-y-6 bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
            <h3 className="text-3xl font-bold text-[#3360FF] mb-4">
              Ready to Start Your Tech Journey? 🚀
            </h3>
            <p className="text-gray-700 text-lg mb-6 max-w-md">
              Join thousands of successful graduates who landed their dream jobs through LASOP
            </p>

            <button className="group relative overflow-hidden bg-[#3360FF] text-white px-12 py-5 rounded-full font-bold text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50">
              <span className="relative z-10">Start Your Journey Today</span>
              <div className="absolute inset-0 bg-[#264dc4] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                No experience needed!
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
