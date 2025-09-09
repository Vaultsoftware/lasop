'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight } from "react-icons/fa6";
import { FaRegCalendarAlt } from 'react-icons/fa';
import outline2 from '../../../asset/landPage/double.png';
import outline from '../../../asset/landPage/outline.png';
import { CohortMain } from '@/interfaces/interface';
import img3 from '../../../asset/landPage/img3.png';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface PropsData {
    courseInfo: {
        curr: string;
        text: string;
    }[];
    packBtn: {
        title: string;
        info: string[];
    }[];
}

interface Props {
    props: PropsData;
}

function CourseMain({ props }: Props) {
    // State management
    const [modules, setModules] = useState<number>(0);
    const [program, setProgram] = useState<number>(0);

    const handleModule = (arg: number) => {
        setModules(arg);
    }

    const handleProgram = (arg: number) => {
        setProgram(arg);
    }

    // Displaying random cohorts starting in one month
    const [cohortAd, setCohortAd] = useState<CohortMain[]>([])
    const cohorts = useSelector((state: RootState) => state.cohort.cohort)

    useEffect(() => {
        const now = new Date();
        const oneMonthLater = new Date();
        oneMonthLater.setMonth(now.getMonth() + 1);

        const activeCohort = cohorts.filter((coh) => {
            if (coh.isActive) {
                const startDate = new Date(coh.startDate);

                return startDate >= now && startDate <= oneMonthLater
            }
        }).sort((a, b) => new Date(b.startDate).getMonth() - new Date(a.startDate).getMonth());

        const adDisplay: CohortMain[] = [];
        while (adDisplay.length < 3 && activeCohort.length > 0) {
            const randomIndex = Math.floor(Math.random() * activeCohort.length);
            const selectedCohort = activeCohort.splice(randomIndex, 1)[0];

            adDisplay.push(selectedCohort);
        }

        setCohortAd(adDisplay);
    }, [cohorts])

    // Formatting date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

        return formattedDate
    }

    return (
        <main className='overflow-hidden'>
            <section data-aos="fade-right" className='md:main py-[3rem] px-[30px]'>
                <div className='grid gap-5'>
                    {
                        cohortAd.slice(0, 3).map((coh, ind) => (
                            <div key={ind} className="next_cohort grid md:grid-cols-2 items-center px-[20px] py-[30px] rounded-[5px] border border-accent w-fit mx-auto shadow-lg shadow-shadow bg-secondary">
                                <div className="cohort_cont grid w-[100%] md:pr-[16px] p-6 md:border-r-2 md:border-b-0 border-b-2 border-shadow md:flex md:justify-between md:items-center gap-6">
                                    <div className="cohort_date w-full md:w-[70%]">
                                        <div className="cohort_head flex items-center gap-2">
                                            <FaRegCalendarAlt />
                                            <h3>Next Cohort starts</h3>
                                        </div>
                                        <div className="cohort_body">
                                            <div className="cohort_start w-full">
                                                <h1 className='font-bold text-[30px]'>{formatDate(coh.startDate)}</h1>
                                                <span className='font-semibold text-[12px]'>9:30 AM - 2:30 PM WAT</span>
                                            </div>
                                        </div>
                                        <div className='flex gap-1 text-[14px] mt-2 font-bold'>
                                            {
                                                coh.mode.map((mod, ind) => (
                                                    <React.Fragment key={ind}>
                                                        <span>{mod}</span>
                                                        {ind < coh.mode.length - 1 && <span>|</span>}
                                                    </React.Fragment>
                                                ))
                                            }
                                        </div>
                                    </div>
                                    <div className="cohort_time">
                                        <Link href='/getStarted' className='flex w-[130px] h-[40px] bg-accent text-cyan-50 items-center justify-center rounded-md'>Get Started</Link>
                                    </div>
                                </div>
                                <div className="next_cohort grid md:flex md:justify-between md:gap-2 gap-6 items-center w-[100%] md:pl-[16px] p-6">
                                    <h4 className='font-semibold text-[22px] md:w-[60%] w-full'>
                                        Find another cohort that fits your schedule
                                    </h4>
                                    <Link href='calendar' className='flex items-center justify-center rounded-md w-fit h-[40px] bg-transparent border-2 border-accent text-accent px-3'>
                                        See All Cohorts
                                    </Link>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </section>

            <section data-aos="fade-left" className='md:main py-[3rem] px-[30px]'>
                <div className="courses">
                    <div className="courses_head mb-[2rem] flex flex-col items-center">
                        <h1 className='font-bold text-[30px] text-center'>Course Outline</h1>
                        <Image src={outline} alt="" />
                    </div>
                    <div className="courses_body border-x border-b border-slate-600 grid md:flex gap-3 md:gap-0 w-full">
                        <div className="course_module w-full md:w-[40%] grid">
                            <div className="module_head border-2 border-accent p-3 text-center md:text-start">
                                <h3 className='head3'>Modules</h3>
                            </div>
                            <div className="module_list flex overflow-x-scroll whitespace-nowrap md:grid md:overflow-hidden md:whitespace-normal">
                                {
                                    props.courseInfo.map((mod, ind) => (
                                        <div
                                            key={ind}
                                            className={`${modules === ind && "font-bold text-accent border-2 border-accent"} module flex items-center gap-2 p-3 justify-between border cursor-pointer`}
                                            onClick={() => handleModule(ind)}
                                        >
                                            <span className='w-[90%]'>{mod.curr}</span>
                                            <FaArrowRight />
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="course_outline w-full md:w-[60%] border border-accent">
                            <div className="outline_head border-2 border-accent p-3 text-center md:text-start">
                                <h3 className='head3'>Outlines</h3>
                            </div>
                            <div className="outline_info p-3">
                                <p>{props.courseInfo[modules].text}</p>
                            </div>
                        </div>
                    </div>
                    <div className="enroll_cs mt-[2rem] w-fit mx-auto">
                    <Link href='/getStarted' className='flex w-[130px] h-[40px] bg-accent text-cyan-50 items-center justify-center rounded-md'>Get Started</Link>
                    </div>
                </div>
            </section>

            <section className='md:main py-[3rem] px-[30px] bg-secondary'>
                <div className="program">
                    <div data-aos="fade-down" className="program_head mb-[2rem] flex flex-col items-center">
                        <h1 className='font-bold text-[30px] text-center text-shadow'>Program Packages</h1>
                        <Image src={outline} alt="" />
                    </div>
                    <div className="program_body">
                        <div data-aos="fade-right" className="package_list flex overflow-x-scroll whitespace-nowrap md:overflow-hidden md:whitespace-normal gap-2 border-2 border-shadow w-full sm:w-fit p-2 mx-auto rounded-md">
                            {
                                props.packBtn.map((btn, ind) => (
                                    <div
                                        key={ind}
                                        className={program === ind ? 'bg-shadow text-cyan-50 package p-2 cursor-pointer' : 'package p-2 border-2 border-shadow text-shadow cursor-pointer'}
                                        onClick={() => handleProgram(ind)}
                                    >
                                        <span>{btn.title}</span>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="package_details grid md:flex md:items-center md:justify-between gap-3 mt-[2rem] w-full md:w-[80%] mx-auto">
                            <div className="package_info w-full md:w-[60%]">
                                <h3 className='head3 text-shadow border-b-2 border-shadow w-fit mb-6'>{props.packBtn[program].title}</h3>
                                <div className="dis_package grid gap-3">
                                    {
                                        props.packBtn[program].info.map((text, ind) => (
                                            <div data-aos="fade-right" key={ind} className="package_desc font-semibold text-shadow">
                                                {
                                                    <p>{text}</p>
                                                }
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            <div data-aos="fade-left" className="package_image">
                                <Image className='w-[330px] h-[270px] object-cover rounded-md' src={img3} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='md:main py-[3rem] px-[30px]'>
                <div className="online grid md:flex md:items-center md:gap-3 gap-6">
                    <div data-aos="fade-right" className="w-full md:w-[50%]">
                        <Image className='w-full h-[350px] object-cover rounded-md shadow-shadow shadow-lg' src={img3} alt="" />
                    </div>
                    <Image src={outline2} className='md:block hidden mx-auto my-2 md:mx-0 md:my-0' alt='' />
                    <Image src={outline} className='md:hidden block mx-auto my-2 md:mx-0 md:my-0' alt='' />
                    <div className="online_info grid gap-9 w-full md:w-[50%]">
                        <h3 data-aos="fade-left" className='font-bold text-[45px]'>
                            Learn Online or On Campus, Weekdays or Weekends
                        </h3>
                        <p data-aos="fade-left" className='font-semibold text-[20px]'>
                            Take an online coding bootcamp or learn in-person at one of our state-of-the-art campuses, which are designed to provide dynamic, accelerated learning experiences.
                        </p>
                        <Link data-aos="fade-up" href='/getStarted' className='flex w-[130px] h-[40px] bg-shadow text-cyan-50 items-center justify-center rounded-md'>Get Started</Link>
                    </div>
                </div>
            </section>

            <section className='md:main py-[3rem] px-[30px] bg-secondary'>
                <div className="sample_video flex items-center justify-center">
                    <video className='w-full md:w-[500px] h-[300px] md:h-[350px] object-cover rounded-3xl' controls>
                        <source src='' type="video/mp4" />
                    </video>
                </div>
            </section>

            <section className='md:main py-[3rem] px-[30px] bg-lightSec'>
                <div className="know grid md:flex md:items-center md:gap-3 gap-6">
                    <div data-aos="fade-right"  className="know_title w-full md:w-[50%]">
                        <h3 className='font-bold text-[45px] text-shadow'>Everything You Need To Know To Get Started</h3>
                    </div>
                    <div className="know_img mx-auto my-2 md:mx-0 md:my-0">
                        <Image src={outline2} className='md:block hidden mx-auto my-2 md:mx-0 md:my-0' alt='' />
                        <Image src={outline} className='md:hidden block mx-auto my-2 md:mx-0 md:my-0' alt='' />
                    </div>
                    <div className="know_info w-full md:w-[50%] font-semibold text-[18px] ml-6">
                        <ul data-aos="fade-left" className='grid gap-3 text-shadow'>
                            <li>
                                <p>
                                    Applying to LASOP
                                    Register by filling
                                    the application form
                                    on our website
                                </p>
                            </li>
                            <li>
                                <p>
                                    Have a laptop
                                    ready with spec of a
                                    minimum of 4gig ram
                                    and 500gb(hdd)/256gb(ssd)
                                </p>
                            </li>
                            <li>
                                <p>
                                    Have Internet connection
                                    in place( if you are an online
                                    student but you will not need
                                    this if you study physically).
                                </p>
                            </li>
                            <li>
                                <p>
                                    Pay your fees and
                                    start attending
                                    classes
                                </p>
                            </li>
                        </ul>
                        <Link data-aos="fade-up" href='/contact' className='flex w-[130px] h-[40px] bg-shadow text-cyan-50 items-center justify-center rounded-md mt-3'>Contact us</Link>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default CourseMain