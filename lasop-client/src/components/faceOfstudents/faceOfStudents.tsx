'use client';

import React, { useEffect, useState } from 'react';
import { Clock, Star } from 'lucide-react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

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

export default function FaceOfStudents() {
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
    </section>
  );
}