'use client';
import React, { useEffect, useRef } from 'react';
import { ArrowRight, Heart, Star, Trophy, Lightbulb, TrendingUp, Clock, DollarSign, Briefcase, MapPin, User } from 'lucide-react';
import Link from 'next/link';

export default function StudentSuccessStories() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Intersection Observer for fade-in animations
    const observerOptions: IntersectionObserverInit = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-16');
        }
      });
    }, observerOptions);

    const elements = containerRef.current.querySelectorAll('.fade-in-element');
    elements.forEach((el, index) => {
      const htmlElement = el as HTMLElement;
      htmlElement.style.transitionDelay = `${index * 150}ms`;
      observer.observe(el);
    });

    // Lightbox functionality
    const handleImageClick = (src: string, alt: string) => {
      // Create overlay
      const overlay = document.createElement('div');
      overlay.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 cursor-pointer';

      // Create enlarged image with scale animation
      const lightboxImg = document.createElement('img');
      lightboxImg.src = src;
      lightboxImg.alt = alt;
      lightboxImg.className = 'max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl transform scale-90 transition-transform duration-300 ease-out';

      // Animate pop-up scale after adding to DOM
      setTimeout(() => {
        lightboxImg.classList.replace('scale-90', 'scale-100');
      }, 20);

      overlay.appendChild(lightboxImg);
      document.body.appendChild(overlay);

      // Close lightbox on overlay click
      const closeHandler = () => {
        lightboxImg.classList.replace('scale-100', 'scale-90');
        setTimeout(() => {
          if (document.body.contains(overlay)) {
            document.body.removeChild(overlay);
          }
        }, 200);
      };

      overlay.addEventListener('click', closeHandler);

      // Close on Escape key press
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeHandler();
          document.removeEventListener('keydown', handleEscape);
        }
      };

      document.addEventListener('keydown', handleEscape);
    };

    // Add click listeners to lightbox images
    const lightboxImages = containerRef.current.querySelectorAll('.lightbox-image');
    const clickHandlers: Array<() => void> = [];

    lightboxImages.forEach((img) => {
      const imgElement = img as HTMLImageElement;
      const clickHandler = () => handleImageClick(imgElement.src, imgElement.alt);
      clickHandlers.push(clickHandler);
      imgElement.addEventListener('click', clickHandler);
    });

    // Cleanup function
    return () => {
      observer.disconnect();
      
      // Remove event listeners
      lightboxImages.forEach((img, index) => {
        const imgElement = img as HTMLImageElement;
        imgElement.removeEventListener('click', clickHandlers[index]);
      });
    };
  }, []);

  interface Student {
    name: string;
    age: number;
    location: string;
    role: string;
    quote: string;
    timeline: string;
    currentIncome: string;
    previousIncome: string;
    multiplier: string;
    projects: string[];
    projectImages: string[];
    icon: React.ComponentType<{ className?: string }>;
    color: 'rose' | 'amber' | 'purple';
  }

  const students: Student[] = [
    {
      name: "Olajumoke Adebayo",
      age: 34,
      location: "Lagos, Nigeria",
      role: "Mathematics Teacher → Full-Stack Developer",
      quote: "At 34, with two kids and bills to pay, everyone said I was too old to start over. They were wrong.",
      timeline: "6 months transformation",
      currentIncome: "₦450,000/month",
      previousIncome: "₦65,000/month",
      multiplier: "7x",
      projects: [
        "NaijaEats - A food blog generating ₦80,000/month in ad revenue",
        "E-commerce platform for Abuja fashion designer - ₦150,000 project",
        "School management system for 3 private schools",
        "Wedding planning website with booking system"
      ],
      projectImages: [
        "https://www.blogtyrant.com/wp-content/uploads/2022/05/rsz_ambitious-kitchen-food-blog-example.png",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjoawfh48w03qCIAG3fdpr6xMkNJPvtyMTHw&s",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjwsPfiHLbMC620Z-lzdyognEJdahV5Pncrw&s",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUZoZnGI_kBZ8aSg9slyL7IWj1UKwn5sXo5Q&s"
      ],
      icon: Heart,
      color: "rose"
    },
    {
      name: "Samuel Okonkwo",
      age: 28,
      location: "Port Harcourt, Nigeria",
      role: "Factory Worker → Freelance Developer",
      quote: "My hands were stained with machine oil, but my dreams were bigger than that factory floor.",
      timeline: "6 months transformation",
      currentIncome: "₦380,000/month",
      previousIncome: "₦45,000/month",
      multiplier: "8.4x",
      projects: [
        "GroceryRun - Full-featured delivery app earning ₦120,000/month",
        "School management system for 3 Port Harcourt schools",
        "Restaurant ordering platform with payment integration",
        "Church management system with member portal"
      ],
      projectImages: [
        "https://wrapmarketusercontent.com/assets/items/thumb/0ebdf5eaecbcab493384f45b09fda87b0b20900173ce05c6a05f9dc4a3004c16.webp?v=1710580878",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaUEQzV_MP10HM4BWRNkBGflNdR0mjSB7ZOw&s",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjbOihuKj9nP85KfbAqYznWjef7FpNC4kTyQ&s",
        "https://s3.envato.com/files/519893740/01_wp_church_preview.jpg"
      ],
      icon: Trophy,
      color: "amber"
    },
    {
      name: "Blessing Okoro",
      age: 26,
      location: "Abuja, Nigeria",
      role: "Job Seeker → Tech Entrepreneur",
      quote: "After 300+ rejection emails, I realized the job I was looking for didn't exist - so I created it myself.",
      timeline: "6 months transformation",
      currentIncome: "₦520,000/month",
      previousIncome: "₦0 (unemployed)",
      multiplier: "∞",
      projects: [
        "BlessCode Studios - Her agency generating ₦400,000+ monthly",
        "JobTracker - App helping graduates track applications (2000+ users)",
        "E-learning platform for skill acquisition programs",
        "Portfolio websites for 20+ professionals"
      ],
      projectImages: [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaBNKnjvlV3IdgWSBEVfqViHMLtMfSkHeWRw&s",
        "https://www.figma.com/community/resource/07dfb082-ac0e-4d86-b901-ee1f6eacb1af/thumbnail",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuQUDI_9Zi0L0Sk09ts00p9fYOx7vywEXspA&s",
        "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop"
      ],
      icon: Lightbulb,
      color: "purple"
    }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
      {/* Hero Section */}
      <section className="relative px-4 py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-200/40 to-blue-300/40 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-red-200/30 to-red-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-gradient-to-r from-blue-300/40 to-white/40 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="fade-in-element opacity-0 translate-y-16 transition-all duration-700 ease-out">
            <div className="inline-flex items-center gap-3 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-bold mb-8 shadow-xl border border-blue-200/50">
              <Star className="w-4 h-4 text-red-500" />
              <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">Real Transformations</span>
              <Heart className="w-4 h-4 text-red-500" />
            </div>
          </div>

          <div className="fade-in-element opacity-0 translate-y-16 transition-all duration-700 ease-out">
            <h1 className="font-black text-5xl md:text-7xl bg-gradient-to-r from-blue-600 via-blue-700 to-red-600 bg-clip-text text-transparent mb-6">
              Success Stories
            </h1>
          </div>

          <div className="fade-in-element opacity-0 translate-y-16 transition-all duration-700 ease-out max-w-3xl mx-auto text-blue-700 text-xl font-medium mb-12">
            Real people. Real transformations. Real income growth.
          </div>
        </div>
      </section>

      {/* Student Stories */}
      <section className="max-w-7xl mx-auto px-4 pb-16 space-y-20">
        {students.map((student, i) => {
          const { name, age, location, role, quote, timeline, currentIncome, previousIncome, multiplier, projects, projectImages, icon: Icon, color } = student;
          
          const colorClasses: Record<string, string> = {
            rose: 'from-blue-500 to-red-500',
            amber: 'from-blue-500 to-blue-600', 
            purple: 'from-red-500 to-blue-500'
          };
          
          return (
            <div key={i} className="fade-in-element opacity-0 translate-y-16 transition-all duration-700 ease-out">
              
              {/* Profile Card */}
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-2xl border border-white/50 overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${colorClasses[color]}`}></div>
                
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-1">
                    <div className="flex items-start gap-6 mb-6">
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${colorClasses[color]} shadow-lg`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      <div className="flex-1">
                        <h2 className="font-black text-4xl text-blue-800 mb-2">{name}</h2>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-2 text-blue-600">
                            <User className="w-4 h-4" />
                            <span className="font-semibold">{age} years old</span>
                          </div>
                          <div className="flex items-center gap-2 text-blue-600">
                            <MapPin className="w-4 h-4" />
                            <span className="font-semibold">{location}</span>
                          </div>
                        </div>
                        <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${colorClasses[color]} text-white font-bold text-lg shadow-lg`}>
                          {role}
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-red-400 rounded-full"></div>
                      <blockquote className="italic text-blue-700 text-xl font-medium pl-8 leading-relaxed">
                        "{quote}"
                      </blockquote>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                
                {/* Timeline Card */}
                <div className="group bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-blue-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-blue-800 text-lg">Timeline</h3>
                  </div>
                  <p className="text-3xl font-black bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2">{timeline}</p>
                  <p className="text-blue-600 font-medium">Complete transformation</p>
                </div>

                {/* Income Growth Card */}
                <div className="group bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-blue-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-red-500 shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-blue-800 text-lg">Growth</h3>
                  </div>
                  <p className="text-3xl font-black bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent mb-2">{multiplier}</p>
                  <p className="text-blue-600 font-medium text-sm">{previousIncome} → {currentIncome}</p>
                </div>

                {/* Current Income Card */}
                <div className="group bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-blue-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-blue-500 shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-blue-800 text-lg">Income</h3>
                  </div>
                  <p className="text-2xl font-black bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent mb-2">{currentIncome}</p>
                  <p className="text-blue-600 font-medium">Monthly earnings</p>
                </div>

                {/* Career Status Card */}
                <div className="group bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-blue-200/50 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-red-500 shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-blue-800 text-lg">Career</h3>
                  </div>
                  <p className="text-2xl font-black bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent mb-2">Transformed</p>
                  <p className="text-blue-600 font-medium">New trajectory</p>
                </div>
              </div>

              {/* Projects & Images Grid */}
              <div className="grid lg:grid-cols-2 gap-8">
                
                {/* Projects Card */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-blue-200/50">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg`}>
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-black text-2xl text-blue-800">Key Projects</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {projects.map((project, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-blue-50/80 hover:bg-blue-100/80 transition-all duration-300">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${colorClasses[color]} mt-2 flex-shrink-0`}></div>
                        <p className="text-blue-700 font-medium leading-relaxed">{project}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Project Images Card */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-blue-200/50">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg`}>
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-black text-2xl text-blue-800">Portfolio</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {projectImages.map((src, idx) => (
                      <div key={idx} className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
                        <img
                          src={src}
                          alt={`Project ${idx + 1} by ${name}`}
                          className="lightbox-image w-full h-32 object-cover cursor-pointer group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute bottom-2 left-2 right-2">
                          <div className="bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <p className="text-xs font-bold text-blue-800 truncate">Project {idx + 1}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-red-600 py-24 text-center text-white px-4 overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-red-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="font-black text-5xl md:text-6xl mb-8">Your Success Story Awaits</h2>
          <p className="max-w-3xl mx-auto mb-12 text-xl font-medium opacity-90 leading-relaxed">
            Join thousands who transformed their careers and multiplied their income. Your journey to financial freedom starts with a single decision.
          </p>
          <Link className="group inline-flex items-center gap-4 bg-white text-blue-700 font-black py-6 px-10 rounded-2xl text-xl hover:bg-blue-50 transition-all duration-300 shadow-2xl hover:scale-105 hover:shadow-3xl" href='/getStarted'>
            Start Your Transformation 
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </section>
    </div>
  );
}