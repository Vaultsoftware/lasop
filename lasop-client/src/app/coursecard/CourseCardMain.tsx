// File: app/coursecard/CourseCardMain.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaChevronRight } from 'react-icons/fa6';
import {
  Palette,
  PenTool,
  MonitorSmartphone,
  Layout,
  Layers,
  Server,
  ShieldCheck,
  Lock,
  Smartphone,
  AppWindow,
  Brain,
  LineChart,
  BarChart3,
  Table2,
  Clock,
  Gauge,
  Wifi,
  Building2,
} from 'lucide-react';

type CourseMode = 'Online' | 'On-campus' | 'Hybrid';

type Course = {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  accentFrom: string;
  accentTo: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Mixed';
  mode: CourseMode[];
};

const courses: Course[] = [
  {
    title: 'PRODUCT DESIGN',
    description: 'Learn to craft stunning, user-friendly product designs for web and mobile apps.',
    href: '/course/productdesign',
    icon: Palette,
    accentFrom: 'from-pink-500',
    accentTo: 'to-rose-500',
    duration: '10 weeks',
    level: 'Beginner',
    mode: ['Online', 'On-campus'],
  },
  {
    title: 'FRONTEND DEVELOPMENT',
    description: 'Build responsive and modern websites using React, Tailwind CSS, and best practices.',
    href: '/course/frontend',
    icon: MonitorSmartphone,
    accentFrom: 'from-sky-500',
    accentTo: 'to-blue-600',
    duration: '12 weeks',
    level: 'Intermediate',
    mode: ['Online', 'Hybrid'],
  },
  {
    title: 'FULLSTACK DEVELOPMENT',
    description: 'Master both frontend and backend to build complete web applications from scratch.',
    href: '/course/fullstack',
    icon: Layers,
    accentFrom: 'from-indigo-500',
    accentTo: 'to-violet-600',
    duration: '16 weeks',
    level: 'Mixed',
    mode: ['Online', 'On-campus'],
  },
  {
    title: 'CYBER SECURITY',
    description: 'Protect systems and networks with ethical hacking, encryption, and security protocols.',
    href: '/course/Backend',
    icon: ShieldCheck,
    accentFrom: 'from-emerald-500',
    accentTo: 'to-teal-600',
    duration: '12 weeks',
    level: 'Intermediate',
    mode: ['Online', 'Hybrid'],
  },
  {
    title: 'MOBILE APP DEVELOPMENT',
    description: 'Design and develop apps for iOS and Android with React Native and Flutter.',
    href: '/course/mobileapp',
    icon: Smartphone,
    accentFrom: 'from-amber-500',
    accentTo: 'to-orange-600',
    duration: '14 weeks',
    level: 'Mixed',
    mode: ['Online', 'On-campus'],
  },
  {
    title: 'DATA SCIENCE & AI',
    description: 'Analyze data, build predictive models, and leverage AI tools for impact.',
    href: '/course/datascience',
    icon: Brain,
    accentFrom: 'from-fuchsia-500',
    accentTo: 'to-purple-600',
    duration: '16 weeks',
    level: 'Advanced',
    mode: ['Online', 'Hybrid'],
  },
  {
    title: 'DATA ANALYSIS',
    description: 'Visualize, interpret, and extract insights using Python and SQL.',
    href: '/course/dataanalysis',
    icon: BarChart3,
    accentFrom: 'from-green-500',
    accentTo: 'to-lime-600',
    duration: '10 weeks',
    level: 'Beginner',
    mode: ['Online', 'On-campus'],
  },
];

const SkeletonCard: React.FC = () => (
  <div className="relative p-5 rounded-2xl bg-white/90 border border-gray-100 shadow-md">
    <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-gray-200 to-gray-100" />
    <div className="animate-pulse">
      <div className="h-16 w-16 rounded-xl bg-gray-100 mb-4" />
      <div className="h-4 w-40 bg-gray-100 rounded mb-2" />
      <div className="h-4 w-28 bg-gray-100 rounded mb-4" />
      <div className="h-3 w-full bg-gray-100 rounded mb-2" />
      <div className="h-3 w-10/12 bg-gray-100 rounded mb-6" />
      <div className="flex gap-2 mb-5">
        <div className="h-7 w-24 bg-gray-100 rounded-full" />
        <div className="h-7 w-24 bg-gray-100 rounded-full" />
        <div className="h-7 w-24 bg-gray-100 rounded-full" />
      </div>
      <div className="h-10 w-36 bg-gray-100 rounded-xl" />
    </div>
  </div>
);

const Badge: React.FC<{ children: React.ReactNode; title?: string }> = ({ children, title }) => (
  <span
    title={title}
    className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1 rounded-full bg-gray-50 text-gray-700 ring-1 ring-gray-200"
  >
    {children}
  </span>
);

const CourseCardMain: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // why: show skeleton until hydration completes (feel premium)
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="md:main py-[3rem] px-[30px]">
      <div className="courses">
        <div className="courses_head mb-[2rem] flex flex-col items-center">
          <h1 className="font-bold text-[40px] mb-2">Courses</h1>
          <div className="w-[150px] h-[4px] bg-gradient-to-r from-accent to-shadow rounded" />
        </div>

        <div className="courses_body grid md:grid-cols-3 xsm:grid-cols-2 gap-6">
          {loading
            ? Array.from({ length: courses.length }).map((_, i) => <SkeletonCard key={`sk-${i}`} />)
            : courses.map(({ title, description, href, icon: Icon, accentFrom, accentTo, duration, level, mode }) => (
                <div
                  key={title}
                  className="group relative p-5 rounded-2xl flex flex-col bg-white/90 border border-gray-100 shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-accent/30"
                >
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${accentFrom} ${accentTo} rounded-t-2xl`} />

                  <div className="mb-3">
                    <div className="relative w-fit">
                      <div className="absolute inset-0 blur-xl opacity-30 bg-gradient-to-r from-accent to-shadow rounded-xl" />
                      <div className="relative bg-gray-50 rounded-xl p-3 ring-1 ring-gray-100">
                        <Icon className="w-7 h-7 text-gray-700" />
                      </div>
                    </div>

                    <div className="mt-2 flex gap-2 text-gray-400">
                      {title.includes('DESIGN') && (
                        <>
                          <PenTool className="w-4 h-4" />
                          <Layout className="w-4 h-4" />
                        </>
                      )}
                      {title.includes('FRONTEND') && (
                        <>
                          <Layout className="w-4 h-4" />
                          <Server className="w-4 h-4 opacity-70" />
                        </>
                      )}
                      {title.includes('FULLSTACK') && (
                        <>
                          <Server className="w-4 h-4" />
                          <Layout className="w-4 h-4" />
                        </>
                      )}
                      {title.includes('CYBER') && <Lock className="w-4 h-4" />}
                      {title.includes('MOBILE') && <AppWindow className="w-4 h-4" />}
                      {title.includes('DATA SCIENCE') && <LineChart className="w-4 h-4" />}
                      {title.includes('DATA ANALYSIS') && <Table2 className="w-4 h-4" />}
                    </div>
                  </div>

                  <div className="mt-auto">
                    <h3 className="head3 mb-2 text-center md:text-left">{title}</h3>
                    <p className="mb-5 text-center md:text-left text-gray-600">{description}</p>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      <Badge title="Duration">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{duration}</span>
                      </Badge>
                      <Badge title="Level">
                        <Gauge className="w-3.5 h-3.5" />
                        <span>{level}</span>
                      </Badge>
                      {mode.map((m) => (
                        <Badge key={m} title="Mode">
                          {m === 'Online' && <Wifi className="w-3.5 h-3.5" />}
                          {m === 'On-campus' && <Building2 className="w-3.5 h-3.5" />}
                          {m === 'Hybrid' && (
                            <>
                              <Wifi className="w-3.5 h-3.5" />
                              <Building2 className="w-3.5 h-3.5 -ml-1" />
                            </>
                          )}
                          <span>{m}</span>
                        </Badge>
                      ))}
                    </div>

                    <Link
                      href={href}
                      aria-label={`Learn more about ${title}`}
                      className="nav_btn bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-white transition-colors duration-300 flex items-center gap-3 mt-2 mx-auto md:mx-0 w-fit px-4 py-2 rounded-xl"
                    >
                      <span>Learn more</span>
                      <FaChevronRight className="transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>

                  <div
                    className={`pointer-events-none absolute -bottom-4 left-6 right-6 h-8 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity bg-gradient-to-r ${accentFrom} ${accentTo} rounded-full`}
                  />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default CourseCardMain;
