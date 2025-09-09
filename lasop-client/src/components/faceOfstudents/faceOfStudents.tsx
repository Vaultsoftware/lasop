'use client';

import React, { useState } from 'react';
import { Clock, Star } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

// Import Swiper styles as instructed by Mr.Ola, the package installed
import 'swiper/css';
import 'swiper/css/pagination';

interface Student {
  name: string;
  course: string;
  image: string;
  achievement?: string;
  duration?: string;
  progress?: number;
  rating?: number;
}

const students: Student[] = [
  {
    name: 'Aisha Bello',
    course: 'Frontend Development',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b619?w=400&h=300&fit=crop&crop=face',
    achievement: 'Built 5 React Apps',
    duration: '6 months',
    progress: 85,
    rating: 4.9
  },
  {
    name: 'John Adewale',
    course: 'Backend Development',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face',
    achievement: 'API Master',
    duration: '8 months',
    progress: 92,
    rating: 4.8
  },
  {
    name: 'Chioma Okoro',
    course: 'Fullstack Bootcamp',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=300&fit=crop&crop=face',
    achievement: 'Full-Stack Pro',
    duration: '12 months',
    progress: 95,
    rating: 5.0
  },
  {
    name: 'Tunde Ogun',
    course: 'Python & Django',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop&crop=face',
    achievement: 'Django Expert',
    duration: '7 months',
    progress: 78,
    rating: 4.7
  },
  {
    name: 'Blessing Daniels',
    course: 'Product Design',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop&crop=face',
    achievement: 'UI/UX Specialist',
    duration: '5 months',
    progress: 88,
    rating: 4.9
  },
  {
    name: 'Kemi Adebayo',
    course: 'Data Science',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop&crop=face',
    achievement: 'ML Engineer',
    duration: '10 months',
    progress: 90,
    rating: 4.8
  },
];

const SwiperStudentSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleSlideChange = (swiper: SwiperType) => {
    setCurrentSlide(swiper.realIndex);
  };

  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Custom Swiper Style */}
      <style jsx global>{`
        .student-slider {
          width: 100%;
          height: 100%;
          padding-bottom: 50px !important;
        }
        
        .student-slider .swiper-slide {
          display: flex;
          justify-content: center;
          align-items: stretch;
        }
        
        .student-slider .swiper-pagination {
          bottom: 20px !important;
        }
        
        .student-slider .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #d1d5db;
          border-radius: 50%;
          margin: 0 4px;
          transition: all 0.3s ease;
        }
        
        .student-slider .swiper-pagination-bullet-active {
          background: #3b82f6;
          width: 32px;
          border-radius: 4px;
        }
        
        .student-slider .swiper-pagination-bullet:hover {
          background: #93c5fd;
        }
        
        @media (max-width: 768px) {
          .student-slider .swiper-pagination-bullet {
            width: 6px;
            height: 6px;
          }
          
          .student-slider .swiper-pagination-bullet-active {
            width: 24px;
          }
        }
      `}</style>

      {/* Subtle blue accent decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-50 rounded-full opacity-50"></div>
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-blue-50 rounded-full opacity-30"></div>
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-blue-200 rounded-full"></div>
        <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-blue-300 rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-blue-100">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            Student Success Stories
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Meet Our <span className="text-blue-600">Amazing Students</span>
          </h2>
          
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover how our students are transforming their careers through dedicated learning
          </p>
        </div>

        {/* Swiper Container */}
        <div className="relative">
          <Swiper
            modules={[Pagination, Autoplay]}
            className="student-slider rounded-2xl shadow-sm"
            slidesPerView={1}
            spaceBetween={20}
            loop={true}
            centeredSlides={false}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            speed={800}
            grabCursor={true}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 28,
              },
              1280: {
                slidesPerView: 4,
                spaceBetween: 32,
              },
            }}
            pagination={{
              clickable: true,
            }}
            onSlideChange={handleSlideChange}
          >
            {students.map((student, index) => (
              <SwiperSlide key={index}>
                <div className="w-full px-3">
                  <div className="bg-white rounded-xl p-6 h-full border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                    {/* Rating Badge */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium border border-blue-100">
                        {student.course}
                      </div>
                      <div className="bg-white border border-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 group-hover:border-blue-200 transition-colors">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {student.rating}
                      </div>
                    </div>
                    
                    {/* Image */}
                    <div className="relative mb-6 overflow-hidden rounded-lg">
                      <img
                        src={student.image}
                        alt={student.name}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {student.name}
                        </h3>
                        
                        {student.achievement && (
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
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

                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">Progress</span>
                          <span className="text-xs font-medium text-blue-600">{student.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-1000 shadow-sm"
                            style={{width: `${student.progress}%`}}
                          ></div>
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

export default SwiperStudentSlider;