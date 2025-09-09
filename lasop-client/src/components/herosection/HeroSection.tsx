'use client';
import { ArrowRight, Play, ChevronRight, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function LasopLandingPage() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const courses = [
    {
      id: 'fullstack',
      emoji: '⚛️',
      title: 'Fullstack Development',
      subtitle: 'Modern Web Development',
      borderColor: 'border-blue-500',
      details: {
        description: 'Master modern web development with React, Node.js, and databases. Build complete applications from frontend to backend.',
        topics: ['React & Component Architecture', 'Node.js & Express', 'Database Design (SQL & NoSQL)', 'API Development', 'Authentication & Security', 'Deployment & DevOps'],
        duration: '16 weeks',
        level: 'Intermediate to Advanced'
      }
    },
    {
      id: 'python',
      emoji: '🐍',
      title: 'Python & Backend',
      subtitle: 'Server-side programming',
      borderColor: 'border-red-500',
      details: {
        description: 'Dive deep into Python programming and backend development. Learn to build robust server applications and APIs.',
        topics: ['Python Fundamentals & OOP', 'Django/Flask Frameworks', 'Database Integration', 'RESTful API Design', 'Testing & Debugging', 'Performance Optimization'],
        duration: '12 weeks',
        level: 'Beginner to Intermediate'
      }
    },
    {
      id: 'cloud',
      emoji: '☁️',
      title: 'Cloud & Deployment',
      subtitle: 'Take your apps live',
      borderColor: 'border-blue-500',
      details: {
        description: 'Learn to deploy and scale applications using modern cloud platforms. Master DevOps practices and infrastructure.',
        topics: ['AWS/Azure/GCP Basics', 'Docker & Containerization', 'CI/CD Pipelines', 'Monitoring & Logging', 'Security Best Practices', 'Cost Optimization'],
        duration: '8 weeks',
        level: 'Intermediate'
      }
    }
  ];

  const handleCourseClick = (courseId: string) => {
    setSelectedCourse(selectedCourse === courseId ? null : courseId);
  };

  const handleViewAllCourses = () => {
    // Navigate to full courses page
    window.location.href = '/course'; 
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 overflow-hidden">
      
      {/* ⭐ Floating Stars */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-40 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="w-full h-full px-[30px] md:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-screen py-12">
          
          {/* Left Content */}
          <div className="space-y-8 text-white">
            <div className="inline-block px-4 py-2 bg-blue-500/20 rounded-full text-blue-300 text-sm border border-blue-400/30">
              Premium Programming Education
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              <span className="block">Master</span>
              <span className="block text-blue-400">Programming</span>
              <span className="block">at LASOP</span>
            </h1>
            
            <p className="text-xl text-slate-300 leading-relaxed">
              Transform your career with industry-leading programming courses. 
              Join Nigeria's most trusted coding school.
            </p>
            
            <div className="flex gap-6 flex-wrap">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold flex items-center transition-all shadow-lg shadow-blue-800/30 group">
                Start Learning Today
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="border-2 border-blue-400/50 hover:border-blue-400 text-blue-300 hover:text-white px-8 py-4 rounded-lg font-semibold flex items-center transition-all">
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </button>
            </div>
          </div>
          
          {/* Right Content - Interactive Course Cards */}
          <div className="relative">
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-blue-500/30 shadow-xl animate-fadeInUp">
              
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-blue-400">What You'll Learn</h3>
                <button 
                  onClick={handleViewAllCourses}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1 transition-colors group"
                >
                  View All
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
              
              <div className="space-y-3 mb-8">
                {courses.map((course) => (
                  <div key={course.id} className="transition-all duration-300">
                    {/* Course Card */}
                    <div 
                      className={`flex items-center p-4 bg-slate-700/50 rounded-lg border-l-4 ${course.borderColor} cursor-pointer hover:bg-slate-700/70 transition-all duration-200 group`}
                      onClick={() => handleCourseClick(course.id)}
                    >
                      <span className="text-2xl mr-4">{course.emoji}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                          {course.title}
                        </div>
                        <div className="text-sm text-slate-400">{course.subtitle}</div>
                      </div>
                      <div className="text-slate-400 ml-4 transition-transform group-hover:scale-110">
                        {selectedCourse === course.id ? (
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {selectedCourse === course.id && (
                      <div className="mt-3 p-4 bg-slate-800/80 rounded-lg border border-slate-600/50 animate-in slide-in-from-top-2 duration-300">
                        <div className="space-y-4">
                          <p className="text-slate-300 text-sm leading-relaxed">
                            {course.details.description}
                          </p>
                          
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="bg-slate-700/50 p-2 rounded">
                              <span className="text-slate-400">Duration:</span>
                              <div className="text-white font-medium">{course.details.duration}</div>
                            </div>
                            <div className="bg-slate-700/50 p-2 rounded">
                              <span className="text-slate-400">Level:</span>
                              <div className="text-white font-medium">{course.details.level}</div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-semibold text-white mb-2">Key Topics:</h4>
                            <div className="flex flex-wrap gap-1">
                              {course.details.topics.slice(0, 3).map((topic, index) => (
                                <span key={index} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                                  {topic}
                                </span>
                              ))}
                              {course.details.topics.length > 3 && (
                                <span className="text-xs text-slate-400 px-2 py-1">
                                  +{course.details.topics.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="text-center bg-gradient-to-r from-blue-500/20 to-red-500/20 border border-blue-400/50 rounded-xl p-4">
                <div className="text-2xl font-bold text-blue-400">6 Months</div>
                <div className="text-sm text-slate-300">From Zero to Hired</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}