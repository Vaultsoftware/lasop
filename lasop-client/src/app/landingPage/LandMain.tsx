// File: app/landingPage/LandMain.tsx
'use client';

import {
  ChevronDown,
  Users,
  Clock,
  Award,
  Code,
  DollarSign,
  BookOpen,
  Zap,
  MessageCircle,
} from 'lucide-react';
import { blog as localBlog, learn, programs, testimony } from '@/data/data';
import { FaRegCalendarAlt, FaRegClock } from 'react-icons/fa';
import StudentSuccessStories from '@/components/successstories/Success';
import Testimonial from '../../components/testimonial/Testimonial';
import outline from '../../asset/landPage/outline.png';
import outline2 from '../../asset/landPage/double.png';
import { CohortMain } from '@/interfaces/interface';
import React, { useEffect, useState } from 'react';
import img3 from '../../asset/landPage/img3.png';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import Image from 'next/image';
import Link from 'next/link';

/* Chat API helper to avoid lint on non-camelCase global */
type TawkApi = { maximize: () => void; minimize?: () => void; toggle?: () => void };
const getTawkApi = (): TawkApi | undefined =>
  typeof window !== 'undefined'
    ? ((window as any)['Tawk_API'] as TawkApi | undefined)
    : undefined;

/* ---- Blog backend types ---- */
type Blog = {
  _id: string;
  title: string;
  content: string;
  images: { url: string; filename: string }[];
  createdAt: string;
};

const API = process.env.NEXT_PUBLIC_API_URL || '' ;

/** Excerpt helper: returns truncated text and if it needs "continue". */
function makeExcerpt(text: string | undefined, words = 100) {
  const clean = (text ?? '').replace(/\s+/g, ' ').trim();
  if (!clean) return { excerpt: '', needsMore: false };
  const tokens = clean.split(' ');
  const needsMore = tokens.length > words;
  const excerpt = needsMore ? tokens.slice(0, words).join(' ') + '…' : clean;
  return { excerpt, needsMore };
}

/** Premium section heading (gradient text, soft glow, underline). */
function SectionHeading({
  title,
  subtitle,
  kbd,
}: {
  title: string;
  subtitle?: string;
  kbd?: string;
}) {
  return (
    <div className="relative mx-auto max-w-5xl text-center py-10">
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-56 w-[42rem] rounded-full bg-gradient-to-r from-indigo-200/70 via-sky-200/70 to-cyan-200/70 blur-3xl" />
      {kbd && (
        <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/60 px-3 py-1 text-xs font-semibold text-indigo-700 backdrop-blur">
          {kbd}
        </span>
      )}
      <h1 className="mt-3 px-3 font-black tracking-tight text-3xl sm:text-4xl md:text-5xl leading-tight">
        <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          {title}
        </span>
      </h1>
      {subtitle && (
        <p className="mt-3 px-3 text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
          {subtitle}
        </p>
      )}
      <div className="mt-6 h-1 w-28 mx-auto rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500" />
    </div>
  );
}

function LandMain() {
  // Faqs functionality
  const [openFaq, setOpenFaq] = useState<number[]>([]);
  const handleFaq = (index: number) => {
    setOpenFaq((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
  };

  const modernFaqData = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      question: 'What programming languages and technologies will I learn at LASOP?',
      answer:
        "At LASOP, you'll master modern web development technologies including HTML5, CSS3, JavaScript (ES6+), React, Node.js, Python, databases (MongoDB, PostgreSQL), Git version control, and cloud deployment. Our curriculum is constantly updated to match industry demands and includes hands-on projects with real-world applications.",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      question: 'How long does the LASOP program take to complete?',
      answer:
        'Our comprehensive program is designed to be completed in 6-12 months, depending on your chosen track and schedule. We offer full-time intensive courses (3-4 months), part-time evening classes (6-8 months), and flexible weekend programs (8-12 months) to accommodate working professionals and students.',
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      question: 'What are the tuition fees and payment options?',
      answer:
        'LASOP offers competitive pricing with multiple payment plans. Full program tuition ranges from ₦150,000 - ₦500,000 depending on the track. We provide flexible payment options including monthly installments, early bird discounts, and scholarship opportunities for exceptional candidates. Financial aid and payment plans are available.',
    },
    {
      icon: <Users className="w-6 h-6" />,
      question: 'Do I need prior programming experience to join LASOP?',
      answer:
        'No prior programming experience is required! LASOP welcomes complete beginners. Our curriculum starts with fundamentals and progressively builds advanced skills. We have beginner-friendly tracks designed specifically for career switchers and newcomers to tech. Our instructors provide personalized support to ensure everyone succeeds.',
    },
    {
      icon: <Award className="w-6 h-6" />,
      question: 'What kind of job support and career services do you provide?',
      answer:
        'LASOP provides comprehensive career support including resume building, portfolio development, interview preparation, soft skills training, and direct connections with our hiring partners. We maintain relationships with 100+ tech companies and have a 85% job placement rate within 6 months of graduation. Lifetime career support is included.',
    },
    {
      icon: <Code className="w-6 h-6" />,
      question: 'Are the classes online, in-person, or hybrid?',
      answer:
        'We offer all three formats! Choose from fully online live classes, in-person sessions at our Lagos campus, or hybrid learning that combines both. All formats include the same curriculum, instructor interaction, and project-based learning. Online students get recorded sessions and 24/7 access to learning materials.',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      question: 'What makes LASOP different from other programming schools?',
      answer:
        'LASOP focuses on practical, project-based learning with real industry mentors. We emphasize soft skills alongside technical skills, provide personalized mentorship, maintain small class sizes (max 15 students), and offer lifetime access to course materials and community. Our graduates work at top tech companies across Nigeria and globally.',
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      question: 'What support is available during and after the program?',
      answer:
        "Students receive 24/7 access to instructors via Slack, weekly one-on-one mentorship sessions, peer study groups, career counseling, and technical support. After graduation, you join our alumni network with continued access to job opportunities, advanced workshops, and community events. We're committed to your long-term success.",
    },
  ];

  const [cohortAd, setCohortAd] = useState<CohortMain[]>([]);
  const cohorts = useSelector((state: RootState) => state.cohort.cohort);

  /* ---- Backend blogs state ---- */
  const [blogs, setBlogs] = useState<Blog[] | null>(null);
  const [blogsErr, setBlogsErr] = useState<string | null>(null);

  useEffect(() => {
    const now = new Date();
    const oneMonthLater = new Date();
    oneMonthLater.setMonth(now.getMonth() + 1);

    const activeCohort = cohorts
      .filter((coh) => {
        if (coh.isActive) {
          const startDate = new Date(coh.startDate);
          return startDate >= now && startDate <= oneMonthLater;
        }
        return false;
      })
      .sort((a, b) => new Date(b.startDate).getMonth() - new Date(a.startDate).getMonth());

    const adDisplay: CohortMain[] = [];
    const pool = [...activeCohort];
    while (adDisplay.length < 3 && pool.length > 0) {
      const randomIndex = Math.floor(Math.random() * pool.length);
      const selectedCohort = pool.splice(randomIndex, 1)[0];
      adDisplay.push(selectedCohort);
    }

    setCohortAd(adDisplay);
  }, [cohorts]);

  /* Fetch latest blogs for the "Upcoming Events, News & Blogs" section */
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setBlogsErr(null);
        const res = await fetch(`${API}/blog`, { cache: 'no-store' });
        if (!res.ok) throw new Error(await res.text());
        const json: Blog[] = await res.json();

        // sort newest first and take first 3
        const sorted = (Array.isArray(json) ? json : [])
          .slice()
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3);

        if (alive) setBlogs(sorted);
      } catch (e: any) {
        if (alive) {
          setBlogsErr(e?.message || 'Failed to load blogs');
          setBlogs(null);
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Open chat if available; otherwise follow the link.
  const openLiveChat = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const api = getTawkApi();
    if (api?.maximize) {
      e.preventDefault(); // why: keep user on page and open chat
      api.maximize();
    }
  };

  return (
    <main className="overflow-hidden">
      <section data-aos="fade-right" className="md:main py-[3rem] px-4 sm:px-6 md:px-[30px]">
        <div className="grid gap-5">
          {cohortAd.slice(0, 3).map((coh, ind) => (
            <div
              key={ind}
              className="next_cohort grid md:grid-cols-2 items-center px-4 sm:px-5 py-[30px] rounded-[5px] border border-accent w-full max-w-5xl mx-auto shadow-lg shadow-shadow"
            >
              <div className="cohort_cont grid w-full md:pr-[16px] p-6 md:border-r-2 md:border-b-0 border-b-2 border-shadow md:flex md:justify-between md:items-center gap-6">
                <div className="cohort_date w-full md:w-[70%]">
                  <div className="cohort_head flex items-center gap-2">
                    <FaRegCalendarAlt />
                    <h3 className="text-base sm:text-lg">Next Cohort starts</h3>
                  </div>
                  <div className="cohort_body">
                    <div className="cohort_start w-full">
                      <h1 className="font-bold text-2xl sm:text-3xl md:text-[30px]">{formatDate(coh.startDate)}</h1>
                      <span className="font-semibold text-[12px]">9:30 AM - 2:30 PM WAT</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 text-[14px] mt-2 font-bold">
                    {coh.mode.map((mod, i) => (
                      <React.Fragment key={i}>
                        <span>{mod}</span>
                        {i < coh.mode.length - 1 && <span>|</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <div className="cohort_time">
                  <Link
                    href="/getStarted"
                    className="flex w-[130px] h-[40px] bg-accent text-cyan-50 items-center justify-center rounded-md"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
              <div className="next_cohort grid md:flex md:justify-between md:gap-2 gap-6 items-center w-full md:pl-[16px] p-6">
                <h4 className="font-semibold text-lg sm:text-xl md:text-[22px] md:w-[60%] w-full">
                  Find another cohort that fits your schedule
                </h4>
                <Link
                  href="calendar"
                  className="flex items-center justify-center rounded-md w-fit h-[40px] bg-transparent border-2 border-accent text-accent px-3"
                >
                  See All Cohorts
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* courses */}
      <section className="">
        <StudentSuccessStories />
      </section>

      {/* Learn and Earn */}
      <section className="md:main py-[3rem] px-4 sm:px-6 md:px-[30px] bg-accent text-cyan-50 mt-10">
        <div className="learn">
          <div data-aos="fade-down" className="learn_head mb-[2rem] flex flex-col items-center">
            <h1 className="font-bold text-3xl sm:text-4xl md:text-[60px] text-center">Learn & Earn</h1>
            <Image src={outline} alt="" className="w-auto h-auto max-w-full" />
          </div>
          <div className="learn_body grid xsm:gap-6 gap-9">
            {learn.map((earn) => (
              <div key={earn.order} className="learn_list grid xsm:flex xsm:items-center gap-6">
                <div data-aos="fade-right" className="learn_img w-full xsm:w-[40%]">
                  <Image
                    className="w-full h-auto max-h-[360px] rounded-md object-cover"
                    src={earn.img}
                    alt=""
                  />
                </div>
                <div data-aos="fade-left" className="learn_info w-full xsm:w-[60%]">
                  <Image src={earn.icon} alt="" className="mb-3 w-10 h-10" />
                  <h3 className="head3 text-xl sm:text-2xl md:text-3xl">{earn.title}</h3>
                  <p className="break-words">{earn.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="md:main py-[3rem] px-4 sm:px-6 md:px-[30px]">
        <div className="online grid md:flex md:items-center md:gap-3 gap-6">
          <div data-aos="fade-right" className="w-full md:w-[50%]">
            <Image
              className="w-full h-auto max-h-[400px] object-cover rounded-md shadow-shadow shadow-lg"
              src={img3}
              alt=""
              priority
            />
          </div>
          <Image src={outline2} className="md:block hidden mx-auto" alt="" />
          <Image src={outline} className="md:hidden block mx-auto" alt="" />
          <div className="online_info grid gap-6 sm:gap-9 w-full md:w-[50%]">
            <h3 data-aos="fade-left" className="font-bold text-2xl sm:text-3xl md:text-[45px]">
              Learn Online or On Campus, Weekdays or Weekends
            </h3>
            <p data-aos="fade-left" className="font-semibold text-base sm:text-lg md:text-[20px]">
              Take an online coding bootcamp or learn in-person at one of our state-of-the-art campuses, which are designed
              to provide dynamic, accelerated learning experiences.
            </p>
            <Link
              data-aos="fade-up"
              href="/getStarted"
              className="flex w-[130px] h-[40px] bg-shadow text-cyan-50 items-center justify-center rounded-md"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      <section className="md:main py-[3rem] px-4 sm:px-6 md:px-[30px] bg-secondary">
        <div className="testimonial">
          <div className="testimonial_head mb-[2rem] flex flex-col items-center">
            <h1 data-aos="fade-down" className="font-bold text-2xl sm:text-3xl md:text-[40px] text-center text-shadow">
              What Our Students Say
            </h1>
            <Image src={outline} alt="" className="w-auto h-auto max-w-full" />
          </div>
          <div className="testimonial_body grid md:grid-cols-3 xsm:grid-cols-2 gap-6">
            {testimony.map((test) => (
              <div
                data-aos="fade-left"
                key={test.id}
                className="testimonial_list p-6 rounded-md bg-primary"
                style={{ boxShadow: `6px 6px 0 ${test.color}` }}
              >
                <div className="testimonial_author mb-3">
                  <h3 className="head3 text-xl sm:text-2xl" style={{ borderBottom: `2px solid ${test.color}`, width: 'fit-content' }}>
                    {test.name}
                  </h3>
                </div>
                <div className="testimonial_msg">
                  <p className="break-words">{test.body}</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            data-aos="fade-up"
            className="flex px-3 w-fit h-[40px] bg-shadow text-cyan-50 items-center justify-center rounded-md mt-5 ml-auto"
            href="https://www.google.com/search?sca_esv=3f080a3bfc790179&hl=en-CA&sxsrf=AE3TifOO33Gx8Q995uhUSfiwlucakw7-Ew:1758827943233&si=AMgyJEtREmoPL4P1I5IDCfuA8gybfVI2d5Uj7QMwYCZHKDZ-E9I0UjbeQh2PooW1uSNCuJDMZJXtOLF_JvSqspv3X0p4FopweGBjAriEveXoMsLzMhkDa5Ci-umN3vv0DucIAqlBuR3sKLdiF05Wbr3L9JAnU8YWcnnQGxgxZcIXmexvUCvAqCA%3D&q=Lagos+School+of+Programming+%28LASOP%29+Reviews&sa=X&ved=2ahUKEwir8JvW0PSPAxXlQkEAHVvAADUQ0bkNegQIJhAE&cshid=1758827964122899&biw=1358&bih=642&dpr=1"
          >
            View More Reviews
          </Link>
        </div>
      </section>

      <section>
        <Testimonial />
      </section>

      {/* Modern FAQ Section */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-16 sm:py-20 px-4 sm:px-8 md:px-16">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-10 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-[#3360FF]/10 px-3 sm:px-4 py-2 rounded-full mb-4 sm:mb-6">
              <MessageCircle className="w-5 h-5 text-[#3360FF]" />
              <span className="text-[#3360FF] font-semibold text-xs sm:text-sm">FREQUENTLY ASKED</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4 sm:mb-6 leading-tight">
              Got Questions About
              <span className="bg-gradient-to-r from-[#3360FF] to-[#4a6bff] bg-clip-text text-transparent block md:inline">
                {' '}
                LASOP?
              </span>
            </h2>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
              We've compiled answers to the most common questions about our programming bootcamp. Can't find what you're
              looking for? <span className="text-[#3360FF] font-semibold">Reach out to us!</span>
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {modernFaqData.map((item, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#3360FF]/20"
              >
                <button
                  onClick={() => handleFaq(index)}
                  className="w-full px-5 sm:px-8 py-5 sm:py-6 text-left flex items-center justify-between hover:bg-gray-50/50 transition-colors duration-200"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div
                      className={`p-3 rounded-xl transition-all duration-300 ${
                        openFaq.includes(index)
                          ? 'bg-[#3360FF] text-white shadow-lg'
                          : 'bg-[#3360FF]/10 text-[#3360FF] group-hover:bg-[#3360FF]/20'
                      }`}
                    >
                      {item.icon}
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 min-w-0 break-words">
                      {item.question}
                    </h3>
                  </div>

                  <ChevronDown
                    className={`w-6 h-6 text-[#3360FF] transition-transform duration-300 flex-shrink-0 ${
                      openFaq.includes(index) ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Answer Content */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq.includes(index) ? 'max-h-[1000px] sm:max-h-none opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-5 sm:px-8 pb-5 sm:pb-6">
                    <div className="sm:pl-16">
                      <div className="bg-gradient-to-r from-[#3360FF]/5 to-transparent p-4 sm:p-6 rounded-xl border-l-4 border-[#3360FF] overflow-visible">
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg break-words">{item.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-10 sm:mt-12 text-center">
            <div className="bg-gradient-to-r from-[#3360FF] to-[#4a6bff] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 text-white shadow-2xl">
              <h3 className="text-lg sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">Still have questions? 🤔</h3>
              <p className="text-sm sm:text-lg opacity-90 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
                Our admissions team is here to help! Get personalized answers and learn more about how LASOP can accelerate
                your tech career.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link
                  href="tel:+234 702 571 3326"
                  className="bg-white text-[#3360FF] px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  📞 +234 7025713326
                </Link>
                {/* Live Chat → open Tawk chat on Home; fallback navigates to /contact */}
                <Link
                  href="/contact"
                  onClick={openLiveChat}
                  className="border-2 border-white/30 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                >
                  💬 Live Chat
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-8 sm:mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {[{ number: '2,500+', label: 'Graduates', icon: '🎓' }, { number: '85%', label: 'Job Placement', icon: '💼' }, { number: '100+', label: 'Hiring Partners', icon: '🤝' }, { number: '24/7', label: 'Support', icon: '🛟' }].map((stat, index) => (
              <div
                key={index}
                className="text-center p-3 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="text-xl sm:text-3xl mb-2">{stat.icon}</div>
                <div className="text-base sm:text-xl lg:text-2xl font-bold text-[#3360FF] mb-1">{stat.number}</div>
                <div className="text-gray-600 font-medium text-xs sm:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="md:main py-[3rem] px-4 sm:px-6 md:px-[30px] bg-secondary">
        <div className="know grid md:flex md:items-center md:gap-3 gap-6">
          <div data-aos="fade-right" className="know_title w-full md:w-[50%]">
            <h3 className="font-bold text-2xl sm:text-3xl md:text-[45px] text-shadow">
              Everything You Need To Know To Get Started
            </h3>
          </div>
          <div className="know_img mx-auto">
            <Image src={outline2} className="md:block hidden mx-auto" alt="" />
            <Image src={outline} className="md:hidden block mx-auto" alt="" />
          </div>
          <div className="know_info w-full md:w-[50%] font-semibold text-[16px] sm:text-[18px] ml-0 sm:ml-6">
            <ul data-aos="fade-left" className="grid gap-3 text-shadow">
              <li>
                <p>
                  Applying to LASOP Register by filling the application form on our website
                </p>
              </li>
              <li>
                <p>Have a laptop ready with spec of a minimum of 8gig RAM and 256GB(SSD)</p>
              </li>
              <li>
                <p>
                  Have Internet connection in place( if you are an online student but you will not need this if you study
                  physically).
                </p>
              </li>
              <li>
                <p>Pay your fees and start attending classes</p>
              </li>
            </ul>
            {/* Contact us → also open chat, fallback to /contact */}
            <Link
              data-aos="fade-up"
              href="/contact"
              onClick={openLiveChat}
              className="flex w-[130px] h-[40px] bg-shadow text-cyan-50 items-center justify-center rounded-md mt-3"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>

      {/* upcoming event and blog  */}
      <section className="md:main py-[3rem] px-4 sm:px-6 md:px-[30px] bg-lightSec">
        <div className="events">
          <div data-aos="fade-down" className="events_head flex flex-col items-center mb-[2rem]">
            <h1 className="font-bold text-2xl sm:text-3xl md:text-[40px] text-center">Upcoming Events, News & Blogs</h1>
            <Image src={outline} alt="" className="w-auto h-auto max-w-full" />
          </div>
        </div>

        {/* UI unchanged: same grid/classes; data from backend or fallback */}
        <div className="events_body grid md:grid-cols-3 xsm:grid-cols-2 gap-6">
          {(blogs ?? []).length > 0
            ? (blogs as Blog[]).map((b) => {
                // ====== ONLY CHANGE: robust absolute URL for blog image ======
                const raw = b.images?.[0]?.url || '';
                const base =
                  (process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '').replace(/\/+$/, '') ||
                  (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '');
                const img = raw
                  ? (/^https?:\/\//i.test(raw) ? raw : `${base}${raw.startsWith('/') ? '' : '/'}${raw}`)
                  : null;
                // =============================================================

                const created = new Date(b.createdAt);
                const date = created.toLocaleDateString();
                const time = created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const { excerpt, needsMore } = makeExcerpt(b.content, 100);

                return (
                  <div
                    data-aos="fade-left"
                    key={b._id}
                    className="events_list w-full p-3 rounded-md flex flex-col gap-2 relative"
                  >
                    {/* Full-card clickable overlay */}
                    <Link
                      href={`/blog/${b._id}`}
                      aria-label={`Open blog: ${b.title}`}
                      className="absolute inset-0 z-10"
                    />

                    <div className="events_img w-full">
                      {img ? (
                        <img
                          className="w-full h-auto max-h-[260px] object-cover rounded-md"
                          src={img}
                          alt={b.title}
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-[260px] rounded-md bg-gray-100 grid place-items-center text-gray-400">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="events_info mt-auto">
                      <h3 className="head3 text-shadow text-lg sm:text-xl">{b.title}</h3>
                      <div className="events_publish flex items-center gap-4 flex-wrap">
                        <div className="event_month flex items-center gap-2 text-[12px]">
                          <FaRegCalendarAlt className="text-shadow" />
                          <span>{date}</span>
                        </div>
                        <div className="event_time flex items-center gap-2 text-[12px]">
                          <FaRegClock className="text-shadow" />
                          <span>{time}</span>
                        </div>
                      </div>
                      <p className="mt-3 break-words">
                        {excerpt}{' '}
                        {needsMore && (
                          <Link
                            href={`/blog/${b._id}`}
                            className="font-semibold underline z-20 relative"
                            aria-label={`Continue reading ${b.title}`}
                          >
                            Continue reading →
                          </Link>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })
            : localBlog.slice(0, 3).map((b) => (
                <div data-aos="fade-left" key={b.id} className="events_list w-full p-3 rounded-md flex flex-col gap-2">
                  <div className="events_img w-full">
                    <Image className="w-full h-auto max-h-[260px] object-cover rounded-md" src={b.img} alt="" />
                  </div>
                  <div className="events_info mt-auto">
                    <h3 className="head3 text-shadow text-lg sm:text-xl">{b.title}</h3>
                    <div className="events_publish flex items-center gap-4 flex-wrap">
                      <div className="event_month flex items-center gap-2 text-[12px]">
                        <FaRegCalendarAlt className="text-shadow" />
                        <span>{b.date}</span>
                      </div>
                      <div className="event_time flex items-center gap-2 text-[12px]">
                        <FaRegClock className="text-shadow" />
                        <span>{b.time}</span>
                      </div>
                    </div>
                    <p className="mt-3 break-words">{b.content}</p>
                  </div>
                </div>
              ))}
        </div>

        <Link
          href="/blog"
          className="event_all flex items-center gap-2 mx-auto w-fit py-3 px-5 rounded-[30px] mt-6 bg-primary"
        >
          <span>View all blogs</span>
        </Link>
      </section>

      {/* Our Programs Are designed — PREMIUM HEADER APPLIED */}
      <section className="md:main py-[3rem] px-4 sm:px-6 md:px-[30px] bg-secondary">
        <div className="programs">
          <div className="program_head mb-[2rem]">
            <SectionHeading
              // kbd="OUR PROGRAMS"
              title="Launch your career in the world’s fastest-growing industries"
              subtitle="Industry-driven curriculum, real projects, and the support you need to go from learner to job-ready."
            />
          </div>

          <div className="program_info grid md:gap-12 gap-6">
            {programs.map((pro, ind) => (
              <div
                data-aos="fade-right"
                key={pro.order}
                className={`program_list grid md:flex ${ind % 2 === 0 ? '' : 'flex-row-reverse'} md:w-[70vw] w-full md:mx-auto`}
              >
                <div className="program_img relative z-10 md:block hidden w-full max-w-[450px]">
                  <Image src={pro.img} alt="Icon" className="w-full h-auto object-cover rounded" />
                </div>
                <div
                  className={`${ind % 2 === 0 ? 'md:left-[-3rem]' : 'md:left-[3rem]'} program_info border-2 border-shadow grid md:flex items-center gap-5 py-[20px] md:px-[60px] px-5 md:relative md:top-[1rem] w-full md:w-[70%]`}
                >
                  <div className="pro_icon w-auto md:w-[10%] h-auto">
                    <Image src={pro.icon} alt="Icon" className="w-10 h-10 md:w-auto md:h-auto" />
                  </div>
                  <div className="pro_txt w-fit md:w-[90%]">
                    <h3 className="head3 text-shadow text-lg sm:text-xl md:text-2xl">{pro.title}</h3>
                    <p className="break-words">{pro.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default LandMain;
