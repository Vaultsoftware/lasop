// File: app/components/StudentSuccessStories.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Heart,
  Star,
  Trophy,
  Lightbulb,
  TrendingUp,
  Clock,
  DollarSign,
  Briefcase,
  MapPin,
  User,
} from 'lucide-react';
import Link from 'next/link';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';

/* =================== Slider (compact/student cards) =================== */
interface SliderStudent {
  name: string;
  course: string;
  image: string; // public/
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
  { name: 'Victoria Nwogo ', course: 'Backend', image: '/10.jpg', achievement: 'Node.js,Express.js,Sql', duration: '3 months', progress: 91, rating: 4.9 },
];

const SwiperStudentSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const apply = () => setReducedMotion(Boolean(mq?.matches));
    apply();
    mq?.addEventListener?.('change', apply);
    return () => mq?.removeEventListener?.('change', apply);
  }, []);

  const handleSlideChange = (swiper: SwiperType) => setCurrentSlide(swiper.realIndex);

  return (
    <section className="bg-white py-14 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* global slider cosmetics */}
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

      {/* subtle background */}
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

        <div className="relative">
          <Swiper
            modules={[Pagination, Autoplay]}
            className="student-slider rounded-2xl"
            slidesPerView={1}
            spaceBetween={16}
            loop
            centeredSlides={false}
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
            onSlideChange={handleSlideChange}
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

                    {/* image with fixed aspect to avoid CLS */}
                  <div className="relative mb-5 overflow-hidden rounded-lg shadow-md transition-shadow group-hover:shadow-xl">
  <div className="w-full" style={{ aspectRatio: '3 / 4' }}>
    <img
      src={student.image}
      alt={student.name}
      className={`w-full h-full object-cover ${reducedMotion ? '' : 'will-change-transform transition-transform duration-500 md:duration-700 ease-out group-hover:scale-105 md:group-hover:scale-110'}`}
      loading="lazy"
      decoding="async"
      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 23vw"
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
                            aria-label={`Progress: ${student.progress}%`}
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
      </div>
    </section>
  );
};

/* =================== Stories (long format) =================== */
export default function StudentSuccessStories() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const apply = () => setReducedMotion(Boolean(mq?.matches));
    apply();
    mq?.addEventListener?.('change', apply);
    return () => mq?.removeEventListener?.('change', apply);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    // Enter animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-16');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = containerRef.current.querySelectorAll('.fade-in-element');
    elements.forEach((el, index) => {
      (el as HTMLElement).style.transitionDelay = `${reducedMotion ? 0 : index * 150}ms`;
      observer.observe(el);
    });

    // Lightbox (with scroll lock)
    const handleImageClick = (src: string, alt: string) => {
      const overlay = document.createElement('div');
      overlay.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 cursor-pointer';
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden'; // why: prevent background scroll

      const lightboxImg = document.createElement('img');
      lightboxImg.src = src;
      lightboxImg.alt = alt;
      lightboxImg.className = 'max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl transform scale-95 transition-transform duration-300 ease-out';
      setTimeout(() => lightboxImg.classList.replace('scale-95', 'scale-100'), 20);
      overlay.appendChild(lightboxImg);
      document.body.appendChild(overlay);

      const closeHandler = () => {
        lightboxImg.classList.replace('scale-100', 'scale-95');
        setTimeout(() => {
          if (document.body.contains(overlay)) document.body.removeChild(overlay);
          document.body.style.overflow = prevOverflow || '';
        }, 200);
      };
      overlay.addEventListener('click', closeHandler);
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeHandler();
          document.removeEventListener('keydown', handleEscape);
        }
      };
      document.addEventListener('keydown', handleEscape);
    };

    const lightboxImages = containerRef.current.querySelectorAll('.lightbox-image');
    const clickHandlers: Array<() => void> = [];
    lightboxImages.forEach((img) => {
      const el = img as HTMLImageElement;
      const h = () => handleImageClick(el.src, el.alt);
      clickHandlers.push(h);
      el.addEventListener('click', h);
    });

    return () => {
      observer.disconnect();
      lightboxImages.forEach((img, i) => (img as HTMLImageElement).removeEventListener('click', clickHandlers[i]));
    };
  }, [reducedMotion]);

  interface StoryStudent {
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

  const students: StoryStudent[] = [
    {
      name: 'Olajumoke Adebayo',
      age: 34,
      location: 'Lagos, Nigeria',
      role: 'Mathematics Teacher → Full-Stack Developer',
      quote: 'At 34, with two kids and bills to pay, everyone said I was too old to start over. They were wrong.',
      timeline: '6 months transformation',
      currentIncome: '₦450,000/month',
      previousIncome: '₦65,000/month',
      multiplier: '7x',
      projects: [
        'NaijaEats - A food blog generating ₦80,000/month in ad revenue',
        'E-commerce platform for Abuja fashion designer - ₦150,000 project',
        'School management system for 3 private schools',
        'Wedding planning website with booking system',
      ],
      projectImages: [
        'https://www.blogtyrant.com/wp-content/uploads/2022/05/rsz_ambitious-kitchen-food-blog-example.png',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjoawfh48w03qCIAG3fdpr6xMkNJPvtyMTHw&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjwsPfiHLbMC620Z-lzdyognEJdahV5Pncrw&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUZoZnGI_kBZ8aSg9slyL7IWj1UKwn5sXo5Q&s',
      ],
      icon: Heart,
      color: 'rose',
    },
    {
      name: 'Samuel Okonkwo',
      age: 28,
      location: 'Port Harcourt, Nigeria',
      role: 'Factory Worker → Freelance Developer',
      quote: 'My hands were stained with machine oil, but my dreams were bigger than that factory floor.',
      timeline: '6 months transformation',
      currentIncome: '₦380,000/month',
      previousIncome: '₦45,000/month',
      multiplier: '8.4x',
      projects: [
        'GroceryRun - Full-featured delivery app earning ₦120,000/month',
        'School management system for 3 Port Harcourt schools',
        'Restaurant ordering platform with payment integration',
        'Church management system with member portal',
      ],
      projectImages: [
        'https://wrapmarketusercontent.com/assets/items/thumb/0ebdf5eaecbcab493384f45b09fda87b0b20900173ce05c6a05f9dc4a3004c16.webp?v=1710580878',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaUEQzV_MP10HM4BWRNkBGflNdR0mjSB7ZOw&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjbOihuKj9nP85KfbAqYznWjef7FpNC4kTyQ&s',
        'https://s3.envato.com/files/519893740/01_wp_church_preview.jpg',
      ],
      icon: Trophy,
      color: 'amber',
    },
    {
      name: 'Blessing Okoro',
      age: 26,
      location: 'Abuja, Nigeria',
      role: 'Job Seeker → Tech Entrepreneur',
      quote: "After 300+ rejection emails, I realized the job I was looking for didn't exist - so I created it myself.",
      timeline: '6 months transformation',
      currentIncome: '₦520,000/month',
      previousIncome: '₦0 (unemployed)',
      multiplier: '∞',
      projects: [
        'BlessCode Studios - Her agency generating ₦400,000+ monthly',
        'JobTracker - App helping graduates track applications (2000+ users)',
        'E-learning platform for skill acquisition programs',
        'Portfolio websites for 20+ professionals',
      ],
      projectImages: [
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaBNKnjvlV3IdgWSBEVfqViHMLtMfSkHeWRw&s',
        'https://www.figma.com/community/resource/07dfb082-ac0e-4d86-b901-ee1f6eacb1af/thumbnail',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuQUDI_9Zi0L0Sk09ts00p9fYOx7vywEXspA&s',
        'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop',
      ],
      icon: Lightbulb,
      color: 'purple',
    },
  ];

  const colorClasses: Record<string, string> = {
    rose: 'from-blue-500 to-red-500',
    amber: 'from-blue-500 to-blue-600',
    purple: 'from-red-500 to-blue-500',
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
      {/* Hero */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className={`absolute top-20 left-6 sm:left-20 w-56 sm:w-72 h-56 sm:h-72 bg-gradient-to-r from-blue-200/40 to-blue-300/40 rounded-full blur-3xl ${reducedMotion ? '' : 'animate-pulse'}`} />
          <div className={`absolute bottom-20 right-6 sm:right-20 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-r from-red-200/30 to-red-300/30 rounded-full blur-3xl ${reducedMotion ? '' : 'animate-pulse'} delay-1000`} />
          <div className={`absolute top-1/2 left-1/2 w-64 sm:w-80 h-64 sm:h-80 bg-gradient-to-r from-blue-300/40 to-white/40 rounded-full blur-3xl ${reducedMotion ? '' : 'animate-pulse'} delay-500`} />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="fade-in-element opacity-0 translate-y-16 transition-all duration-700 ease-out">
            <div className="inline-flex items-center gap-3 bg-white/95 backdrop-blur-sm px-4 sm:px-6 py-3 rounded-full text-sm font-bold mb-6 sm:mb-8 shadow-xl border border-blue-200/50">
              <Star className="w-4 h-4 text-red-500" />
              <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent text-2xl sm:text-3xl">Real Transformations</span>
              <Heart className="w-4 h-4 text-red-500" />
            </div>
          </div>

          <div className="fade-in-element opacity-0 translate-y-16 transition-all duration-700 ease-out">
            <h1 className="font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-blue-600 via-blue-700 to-red-600 bg-clip-text text-transparent mb-4 sm:mb-6">
              Success Stories
            </h1>
          </div>

          <div className="fade-in-element opacity-0 translate-y-16 transition-all duration-700 ease-out max-w-3xl mx-auto text-blue-700 text-lg sm:text-xl font-medium mb-8 sm:mb-12">
            Real people. Real transformations. Real income growth.
          </div>
        </div>
      </section>

      {/* Stories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 sm:pb-16 md:pb-20 space-y-16 sm:space-y-18 md:space-y-20">
        {students.map((student, i) => {
          const { name, age, location, role, quote, timeline, currentIncome, previousIncome, multiplier, projects, projectImages, icon: Icon, color } = student;

          return (
            <div key={i} className="fade-in-element opacity-0 translate-y-16 transition-all duration-700 ease-out">
              {/* Profile */}
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 mb-6 sm:mb-8 shadow-2xl border border-white/50 overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${colorClasses[color]}`} />
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                  <div className="flex-1">
                    <div className="flex items-start gap-4 sm:gap-6 mb-5 sm:mb-6">
                      <div className={`p-3 sm:p-4 rounded-2xl bg-gradient-to-br ${colorClasses[color]} shadow-lg`}>
                        <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                      <div className="flex-1">
                        <h2 className="font-black text-3xl sm:text-4xl text-blue-800 mb-2">{name}</h2>
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                          <div className="flex items-center gap-2 text-blue-600">
                            <User className="w-4 h-4" />
                            <span className="font-semibold">{age} years old</span>
                          </div>
                          <div className="flex items-center gap-2 text-blue-600">
                            <MapPin className="w-4 h-4" />
                            <span className="font-semibold">{location}</span>
                          </div>
                        </div>
                        <div className={`inline-block px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r ${colorClasses[color]} text-white font-bold text-base sm:text-lg shadow-lg`}>
                          {role}
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-red-400 rounded-full" />
                      <blockquote className="italic text-blue-700 text-lg sm:text-xl font-medium pl-6 sm:pl-8 leading-relaxed">
                        “{quote}”
                      </blockquote>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-6 sm:mb-8">
                <div className="group bg-white/95 backdrop-blur-sm rounded-2xl p-5 sm:p-6 shadow-xl border border-blue-200/50 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-blue-800 text-lg">Timeline</h3>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-1.5 sm:mb-2">{timeline}</p>
                  <p className="text-blue-600 font-medium">Complete transformation</p>
                </div>

                <div className="group bg-white/95 backdrop-blur-sm rounded-2xl p-5 sm:p-6 shadow-xl border border-blue-200/50 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-red-500 shadow-lg">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-blue-800 text-lg">Growth</h3>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent mb-1.5 sm:mb-2">{multiplier}</p>
                  <p className="text-blue-600 font-medium text-sm">{previousIncome} → {currentIncome}</p>
                </div>

                <div className="group bg-white/95 backdrop-blur-sm rounded-2xl p-5 sm:p-6 shadow-xl border border-blue-200/50 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-blue-500 shadow-lg">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-blue-800 text-lg">Income</h3>
                  </div>
                  <p className="text-xl sm:text-2xl font-black bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent mb-1.5 sm:mb-2">{currentIncome}</p>
                  <p className="text-blue-600 font-medium">Monthly earnings</p>
                </div>

                <div className="group bg-white/95 backdrop-blur-sm rounded-2xl p-5 sm:p-6 shadow-xl border border-blue-200/50 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-red-500 shadow-lg">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-blue-800 text-lg">Career</h3>
                  </div>
                  <p className="text-xl sm:text-2xl font-black bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent mb-1.5 sm:mb-2">Transformed</p>
                  <p className="text-blue-600 font-medium">New trajectory</p>
                </div>
              </div>

              {/* Projects */}
              <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl border border-blue-200/50">
                  <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-red-500 shadow-lg">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-black text-xl sm:text-2xl text-blue-800">Key Projects</h3>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    {projects.map((project, idx) => (
                      <div key={idx} className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-blue-50/80 hover:bg-blue-100/80 transition-all duration-300">
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-blue-500 to-red-500 mt-1.5 sm:mt-2 flex-shrink-0" />
                        <p className="text-blue-700 font-medium leading-relaxed">{project}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl border border-blue-200/50">
                  <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-red-500 shadow-lg">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-black text-xl sm:text-2xl text-blue-800">Portfolio</h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    {projectImages.map((src, idx) => (
                      <div key={idx} className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
                        <div className="w-full" style={{ aspectRatio: '4 / 3' }}>
                          <img
                            src={src}
                            alt={`Project ${idx + 1} by ${name}`}
                            className={`lightbox-image w-full h-full object-cover cursor-pointer ${reducedMotion ? '' : 'group-hover:scale-110 transition-transform duration-500'}`}
                            loading="lazy"
                            decoding="async"
                            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
                          />
                        </div>
                        <div className={`absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent opacity-0 ${reducedMotion ? '' : 'group-hover:opacity-100 transition-opacity duration-300'}`} />
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

      {/* Slider */}
      <SwiperStudentSlider />

      {/* CTA */}
      <section className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-red-600 py-16 sm:py-20 md:py-24 text-center text-white px-4 overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/10" />
        <div className="absolute inset-0">
          <div className={`absolute top-10 left-6 sm:left-10 w-48 sm:w-64 h-48 sm:h-64 bg-white/10 rounded-full blur-3xl ${reducedMotion ? '' : 'animate-pulse'}`} />
          <div className={`absolute bottom-10 right-6 sm:right-10 w-64 sm:w-80 h-64 sm:h-80 bg-red-300/20 rounded-full blur-3xl ${reducedMotion ? '' : 'animate-pulse'} delay-1000`} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="font-black text-4xl sm:text-5xl md:text-6xl mb-6 sm:mb-8">Your Success Story Awaits</h2>
          <p className="max-w-3xl mx-auto mb-8 sm:mb-12 text-lg sm:text-xl font-medium opacity-90 leading-relaxed">
            Join thousands who transformed their careers and multiplied their income. Your journey to financial freedom starts with a single decision.
          </p>
          <Link
            className="group inline-flex items-center gap-3 sm:gap-4 bg-white text-blue-700 font-black py-4 sm:py-5 md:py-6 px-7 sm:px-9 md:px-10 rounded-2xl text-lg sm:text-xl hover:bg-blue-50 transition-all duration-300 shadow-2xl hover:scale-105 hover:shadow-3xl"
            href="/getStarted"
          >
            Start Your Transformation
            <ArrowRight className={`w-5 h-5 sm:w-6 sm:h-6 ${reducedMotion ? '' : 'group-hover:translate-x-1 transition-transform duration-300'}`} />
          </Link>
        </div>
      </section>
    </div>
  );
}
