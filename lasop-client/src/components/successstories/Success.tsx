'use client';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, TrendingUp, Clock, Briefcase, MapPin, User, Check, ExternalLink, Star, BadgeCheck } from 'lucide-react';
import FaceOfStudents from './../faceOfstudents/faceOfStudents';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

/* =================== Slider =================== */
interface SliderStudent {
  name: string;
  course: string;
  image: string;
  achievement?: string;
  duration?: string;
  progress?: number;
  rating?: number;
}

const sliderStudents: SliderStudent[] = [
  { name: 'Sholuade Victoria Oyindamola', course: 'Fullstack software development', image: '/1.jpg', achievement: 'Built 5 React Apps', duration: '6 months', progress: 85, rating: 4.9 },
  { name: 'Oyinloye Oluwatobilola', course: 'Fullstack software development', image: '/2.jpg', achievement: 'API Master', duration: '6 months', progress: 92, rating: 4.8 },
  { name: 'Momoh John', course: 'Data-Science', image: '/3.jpg', achievement: 'AI Pro', duration: '5 months', progress: 95, rating: 5.0 },
  { name: 'Adedara Ademola', course: 'Data-Science', image: '/4.jpg', achievement: 'Python Expert', duration: '5 months', progress: 78, rating: 4.7 },
  { name: 'Peter Moradeyo', course: 'Fullstack software development', image: '/5.jpg', achievement: 'React Specialist', duration: '6 months', progress: 88, rating: 4.9 },
  { name: 'Justice Adiele', course: 'Fullstack software development', image: '/6.jpg', achievement: 'ML Engineer', duration: '6 months', progress: 90, rating: 4.8 },
  { name: 'Ridwan Ojikutu', course: 'Fullstack software development', image: '/7.jpg', achievement: 'Published 2 Apps', duration: '6 months', progress: 83, rating: 4.7 },
  { name: 'Marvelous Emamurho', course: 'Fullstack software development', image: '/8.jpg', achievement: 'React and Django expert', duration: '6 months', progress: 89, rating: 4.8 },
  { name: 'Idoga Ene', course: 'Cyber-Security', image: '/9.jpg', achievement: 'SOC Analyst Intern → Junior', duration: '6 months', progress: 87, rating: 4.7 },
  { name: 'Victoria Nwogo', course: 'Backend', image: '/10.jpg', achievement: 'Node.js, Express.js, SQL', duration: '3 months', progress: 91, rating: 4.9 },
];

const SwiperStudentSlider: React.FC = () => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const apply = () => setReducedMotion(Boolean(mq?.matches));
    apply();
    mq?.addEventListener?.('change', apply);
    return () => mq?.removeEventListener?.('change', apply);
  }, []);

  return (
    <section className="bg-white py-14 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <style jsx global>{`
        .student-slider { width: 100%; height: 100%; padding-bottom: 50px !important; }
        .student-slider .swiper-slide { display: flex; justify-content: center; align-items: stretch; }
        .student-slider .swiper-pagination { bottom: 14px !important; }
        .student-slider .swiper-pagination-bullet { width: 8px; height: 8px; background: #d1d5db; border-radius: 9999px; margin: 0 4px; transition: all .25s ease; }
        .student-slider .swiper-pagination-bullet-active { background: #2563eb; width: 28px; }
        @media (max-width: 768px) {
          .student-slider .swiper-pagination-bullet { width: 6px; height: 6px; }
          .student-slider .swiper-pagination-bullet-active { width: 20px; }
        }
      `}</style>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-56 h-56 bg-blue-50 rounded-full opacity-60" />
        <div className="absolute -bottom-24 -right-24 w-56 h-56 bg-blue-50 rounded-full opacity-40" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-5 sm:mb-6 border border-blue-100">
            <div className={`w-2 h-2 bg-blue-500 rounded-full ${reducedMotion ? '' : 'animate-pulse'}`} />
            Student Success Stories
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Meet Our <span className="text-blue-600">Amazing Students</span>
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Discover how our students are transforming their careers through dedicated learning
          </p>
        </div>

        <Swiper
          modules={[Pagination, Autoplay]}
          className="student-slider rounded-2xl"
          slidesPerView={1}
          spaceBetween={16}
          loop
          autoplay={reducedMotion ? false : { delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
          speed={reducedMotion ? 0 : 700}
          grabCursor
          breakpoints={{
            480:  { slidesPerView: 1, spaceBetween: 18 },
            640:  { slidesPerView: 1, spaceBetween: 20 },
            768:  { slidesPerView: 2, spaceBetween: 22 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
            1280: { slidesPerView: 4, spaceBetween: 28 },
          }}
          pagination={{ clickable: true }}
        >
          {sliderStudents.map((student, index) => (
            <SwiperSlide key={index} aria-label={`${student.name} – ${student.course}`}>
              <div className="w-full px-2 sm:px-3">
                <div className="bg-white rounded-xl p-5 sm:p-6 h-full border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium border border-blue-100">
                      {student.course}
                    </div>
                    <div className="bg-white border border-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 group-hover:border-blue-200 transition-colors">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {student.rating}
                    </div>
                  </div>

                  <div className="relative mb-5 overflow-hidden rounded-lg shadow-md transition-shadow group-hover:shadow-xl">
                    <div className="w-full" style={{ aspectRatio: '3 / 4' }}>
                      <img
                        src={student.image}
                        alt={student.name}
                        className={`w-full h-full object-cover ${reducedMotion ? '' : 'will-change-transform transition-transform duration-500 md:duration-700 ease-out group-hover:scale-105 md:group-hover:scale-110'}`}
                        loading="lazy"
                        decoding="async"
                        style={{ objectPosition: 'top' }}
                      />
                    </div>
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 ${reducedMotion ? '' : 'group-hover:opacity-100 transition-opacity duration-300'}`} />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {student.name}
                      </h3>
                      {student.achievement && (
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                          <span className="text-sm font-medium text-gray-700">{student.achievement}</span>
                        </div>
                      )}
                      {student.duration && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4 text-blue-400" />
                          <span>{student.duration} journey</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Progress</span>
                        <span className="text-xs font-medium text-blue-600">{student.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className={`bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full shadow-sm ${reducedMotion ? '' : 'transition-all duration-1000'}`}
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

/* =================== Student Profile Card (small & clean) =================== */
interface StudentProfile {
  name: string;
  title: string;
  initials: string;
  skills: string[];
  accentColor: 'blue' | 'emerald' | 'violet';
  contactLink?: string;
}

const StudentProfileCard: React.FC<{ profile: StudentProfile }> = ({ profile }) => {
  const colorMap = {
    blue:    { gradient: 'from-blue-600 to-cyan-500',     text: 'text-blue-600',    pill: 'bg-blue-50 text-blue-700 border-blue-100',    btn: 'bg-blue-600 hover:bg-blue-700' },
    emerald: { gradient: 'from-emerald-600 to-teal-500',  text: 'text-emerald-600', pill: 'bg-emerald-50 text-emerald-700 border-emerald-100', btn: 'bg-emerald-600 hover:bg-emerald-700' },
    violet:  { gradient: 'from-violet-600 to-purple-500', text: 'text-violet-600',  pill: 'bg-violet-50 text-violet-700 border-violet-100',   btn: 'bg-violet-600 hover:bg-violet-700' },
  };
  const c = colorMap[profile.accentColor];

  return (
    <div className="mt-6 bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Avatar + Name block */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${c.gradient} flex items-center justify-center flex-shrink-0`}>
            <span className="text-sm font-bold text-white">{profile.initials}</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
              <p className="text-sm font-bold text-slate-900 truncate">{profile.name}</p>
              <BadgeCheck className={`w-4 h-4 flex-shrink-0 ${c.text}`} />
            </div>
            <p className={`text-xs ${c.text} font-medium`}>{profile.title}</p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            Open to opportunities
          </div>
          {profile.contactLink && (
            <Link
              href={profile.contactLink}
              className={`inline-flex items-center gap-1.5 ${c.btn} text-white text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap transition-colors duration-200`}
            >
              <ArrowRight className="w-3 h-3" />
              Message Admin
            </Link>
          )}
        </div>
      </div>

      {/* Skills — always full width below */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {profile.skills.map((skill, idx) => (
          <span key={idx} className={`text-xs px-2 py-0.5 rounded-full border ${c.pill}`}>{skill}</span>
        ))}
      </div>
    </div>
  );
};

/* =================== Main Page =================== */
export default function StudentSuccessStories() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const observerOptions: IntersectionObserverInit = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-12');
        }
      });
    }, observerOptions);

    const elements = containerRef.current.querySelectorAll('.fade-in-element');
    elements.forEach((el, index) => {
      const htmlElement = el as HTMLElement;
      htmlElement.style.transitionDelay = `${index * 80}ms`;
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  interface Student {
    name: string;
    duration?: string;
    location: string;
    previousRole: string;
    currentRole: string;
    quote: string;
    timeline: string;
    currentIncome: string;
    previousIncome: string;
    multiplier: string;
    projects: string[];
    projectItems: { image: string; url: string }[];
    accentColor: 'blue' | 'emerald' | 'violet';
    showExperience?: boolean;
    profile: StudentProfile;
  }

  const students: Student[] = [
    {
      name: "R. Olajumoke Kaothar",
      duration: "10 months+ in Tech ",
      location: "Ogun State, Nigeria",
      previousRole: "Primary School Teacher",
      currentRole: "Tech Entrepreneur & Founder",
      quote: "Building AgroStack was just the beginning — soon after, I landed an interview in Riyadh, Saudi Arabia. From there, I scaled enterprise websites, created Kanban task management systems, and discovered that coding could unlock a world of endless possibilities.",
      timeline: "6 months",
      currentIncome: "Building AgroStack",
      previousIncome: "Teacher's Salary",
      multiplier: "∞ Potential",
      projects: [
        "AgroStack - A full-scale agri-tech platform built with React, Django, and PostgreSQL, solving critical pain points for Nigerian farmers across the entire agricultural value chain — from produce listing and buyer connections to real-time market pricing and logistics tracking",
        "Enterprise Website Scalability — Selected for a technical interview in Riyadh, Saudi Arabia to work on high-traffic enterprise websites, demonstrating her ability to architect scalable, production-grade solutions that handle thousands of concurrent users",
        "Kanban Task Management System - A sleek, drag-and-drop project management tool built with React and Node.js, designed for teams and businesses to streamline workflow, assign tasks, track progress, and meet deadlines with clarity",
        "Multiple Full-Stack Web Applications — Delivered several client-facing web apps using the MERN stack combined with Django backends and Tailwind CSS, serving thousands of users with clean UIs and robust APIs"
      ],
      projectItems: [
        { image: "/lasopProject.jfif ", url: "https://agritech-woad.vercel.app/" },
        { image: "/Kanban.jfif", url: "https://kanban-task-management-dusky.vercel.app/" },
        { image: "/Agrro.jfif", url: "https://agritech-woad.vercel.app/" },
        { image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop", url: "https://your-third-project.vercel.app" },
      ],
      accentColor: "blue",
      showExperience: true,
      profile: {
        name: "R. Olajumoke Kaothar",
        initials: "OK",
        title: "MERN Stack Developer · Django · Tailwind CSS · Tech Entrepreneur",
        skills: ["MongoDB", "Express.js", "React", "Node.js", "Next.js", "Django", "PostgreSQL", "Tailwind CSS", "REST APIs", "Python"],
        accentColor: "blue",
        contactLink: "/contact",
      }
    },
    {
      name: "Bwirdimma Lot Sunday",
      duration: "1 year+ in Tech",
      location: "Lagos State, Nigeria",
      previousRole: "Factory Worker",
      currentRole: "Freelance Developer",
      quote: "My hands were stained with machine oil, but my dreams were bigger than that factory floor.",
      timeline: "6 months",
      currentIncome: "₦380,000",
      previousIncome: "₦45,000",
      multiplier: "8.4x increase",
      projects: [
        "EventLot - A dynamic event discovery and ticketing platform that connects event organizers with attendees across Port Harcourt, featuring real-time seat booking and payment integration",
        "Luxury Homes Properties - A premium real estate listing website showcasing high-end properties with advanced search filters, virtual tour support, and agent contact management",
        "Shoprite Clone - A fully functional e-commerce grocery platform with product categories, cart management, and seamless checkout — built to mirror real-world retail shopping experiences",
        "Kaye Foundation - A non-profit organization website built to amplify the foundation's mission, featuring donation portals, volunteer sign-up, and impactful storytelling pages"
      ],
      projectItems: [
        { image: "/eventLot.jfif", url: "https://groceryrun-project.vercel.app" },
        { image: "/luxuryhomes.jfif", url: "https://school-management-project.vercel.app" },
        { image: "/shoprite.jfif", url: "https://restaurant-ordering-project.vercel.app" },
        { image: "/kaye.jfif", url: "https://church-management-project.vercel.app" }
      ],
      accentColor: "emerald",
      showExperience: true,
      profile: {
        name: "Bwirdimma Lot Sunday",
        initials: "BL",
        title: "Fullstack Developer & Freelance Engineer",
        skills: ["MongoDB", "Express.js", "React", "Node.js", "MySQL", "Payment APIs", "REST APIs", "JavaScript"],
        accentColor: "emerald",
        contactLink: "/contact",
      }
    },
  ];

  const getAccentClasses = (color: 'blue' | 'emerald' | 'violet') => {
    const classes = {
      blue: {
        gradient: 'from-blue-600 to-cyan-600',
        text: 'text-blue-600',
        bg: 'bg-blue-600',
        bgLight: 'bg-blue-50',
        border: 'border-blue-600',
        ring: 'ring-blue-100'
      },
      emerald: {
        gradient: 'from-emerald-600 to-teal-600',
        text: 'text-emerald-600',
        bg: 'bg-emerald-600',
        bgLight: 'bg-emerald-50',
        border: 'border-emerald-600',
        ring: 'ring-emerald-100'
      },
      violet: {
        gradient: 'from-violet-600 to-purple-600',
        text: 'text-violet-600',
        bg: 'bg-violet-600',
        bgLight: 'bg-violet-50',
        border: 'border-violet-600',
        ring: 'ring-violet-100'
      }
    };
    return classes[color as keyof typeof classes] ?? classes.blue;
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative px-6 py-8 md:py-12 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="max-w-7xl mx-auto text-center">
          <div className="fade-in-element opacity-0 translate-y-12 transition-all duration-700 ease-out">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 tracking-tight leading-tight">
              Former Student's Testimonies
            </h1>
          </div>

          <div className="fade-in-element opacity-0 translate-y-12 transition-all duration-700 ease-out">
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Discover how our students transformed their lives in just 6 months
            </p>
          </div>
        </div>
      </section>

      {/* Student Stories */}
      <section className="max-w-7xl mx-auto px-6 py-8 space-y-12">
        {students.map((student, i) => {
          const accent = getAccentClasses(student.accentColor);

          return (
            <article key={i} className="fade-in-element opacity-0 translate-y-12 transition-all duration-700 ease-out">
              <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">

                {/* Left Column - Profile & Story */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Profile Card */}
                  <div className={`bg-gradient-to-br ${accent.gradient} p-8 rounded-2xl text-white shadow-xl`}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold mb-1">{student.name}</h2>
                        <div className="flex items-center gap-2 text-white/90">
                          <MapPin className="w-4 h-4" />
                          <span>{student.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {student.showExperience && student.duration && (
                        <div className="flex items-center justify-between py-3 border-t border-white/20">
                          <span className="text-white/80">Experience</span>
                          <span className="font-semibold">{student.duration}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between py-3 border-t border-white/20">
                        <span className="text-white/80">Timeline</span>
                        <span className="font-semibold">{student.timeline}</span>
                      </div>
                    </div>
                  </div>

                  {/* Transformation Card */}
                  <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Career Transformation</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-slate-500 mb-1">From</p>
                        <p className="text-lg font-semibold text-slate-700">{student.previousRole}</p>
                      </div>
                      <div className="flex items-center justify-center">
                        <ArrowRight className={`w-6 h-6 ${accent.text}`} />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">To</p>
                        <p className={`text-lg font-semibold ${accent.text}`}>{student.currentRole}</p>
                      </div>
                    </div>
                  </div>

                  {/* Income Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <p className="text-xs font-medium text-slate-500 uppercase">Before</p>
                      </div>
                      <p className="text-xl font-bold text-slate-700">{student.previousIncome}</p>
                      <p className="text-xs text-slate-500 mt-1">per month</p>
                    </div>
                    <div className={`${accent.bgLight} rounded-xl p-5 border-2 ${accent.border}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className={`w-4 h-4 ${accent.text}`} />
                        <p className={`text-xs font-medium ${accent.text} uppercase`}>Now</p>
                      </div>
                      <p className={`text-xl font-bold ${accent.text}`}>{student.currentIncome}</p>
                      <p className={`text-xs ${accent.text} mt-1 font-medium`}>{student.multiplier}</p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Quote, Projects & Portfolio */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Quote */}
                  <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl">
                    <div className="text-6xl font-serif text-white/20 mb-4">"</div>
                    <blockquote className="text-xl md:text-2xl font-medium leading-relaxed italic">
                      {student.quote}
                    </blockquote>
                  </div>

                  {/* Projects */}
                  <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <Briefcase className={`w-6 h-6 ${accent.text}`} />
                      <h3 className="text-2xl font-bold text-slate-900">Key Projects</h3>
                    </div>
                    <div className="space-y-3">
                      {student.projects.map((project, idx) => (
                        <div key={idx} className="flex items-start gap-3 group">
                          <div className={`w-6 h-6 rounded-full ${accent.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                            <Check className="w-4 h-4 text-white" />
                          </div>
                          <p className="text-slate-700 leading-relaxed flex-1">{project}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Portfolio Grid */}
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Portfolio Showcase</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {student.projectItems.map((item, idx) => (
                        <a
                          key={idx}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative overflow-hidden rounded-xl aspect-video shadow-md hover:shadow-xl transition-all duration-300 block"
                        >
                          <img
                            src={item.image}
                            alt={`Project ${idx + 1} by ${student.name}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="flex items-center gap-2 text-white font-semibold">
                              <span>View Project</span>
                              <ExternalLink className="w-4 h-4" />
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* ===== STUDENT PROFILE CARD (below each story) ===== */}
              <StudentProfileCard profile={student.profile} />

            </article>
          );
        })}
      </section>

      {/* Meet Our Amazing Students Slider */}
      <SwiperStudentSlider />

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 md:py-32 px-6 mt-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-100 mb-4 tracking-tight leading-tight">
            your success stories start here
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Join thousands who've transformed their careers. Start your journey today.
          </p>
          <Link href="/contact">
            <button className="group inline-flex items-center gap-3 bg-white text-slate-900 font-bold py-5 px-10 rounded-xl hover:bg-slate-100 transition-all duration-300 shadow-2xl hover:shadow-white/20 hover:scale-105">
              Get Started Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}