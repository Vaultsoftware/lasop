import React from 'react';
import Link from 'next/link';
import { FaCheck } from "react-icons/fa6";

interface PropsData {
    head: string;
    head2: string;
    desc: string;
    bannerBtn: {
        text: string;
    }[];
}

interface Props {
    props: PropsData;
}

function CourseHead({ props }: Props) {
    return (
        <header className='p-[30px] md:px-[5rem] w-full h-fit md:h-[100vh] head_bg overflow-hidden'>
            <div className="course_head h-full grid md:flex md:items-center md:justify-between gap-6">
                <div className="course_info w-full md:w-[60%]">
                    <div className="course_details">
                        <h3 data-aos="fade-right" className='font-bold text-accent text-[40px] mb-[20px]'>{props.head} {props.head2}</h3>
                        <p data-aos="fade-right" className='text-[14px]'>{props.desc}</p>
                    </div>
                    <div className="course_location grid grid-cols-3 gap-2 mt-[20px]">
                        {
                            props.bannerBtn.map((btn, ind) => (
                                <div data-aos="fade-up" key={ind} className="detail px-3 py-2 border-2 border-shadow flex items-center justify-center text-shadow rounded-md">
                                    <span>{btn.text}</span>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div data-aos="fade-left" className="course_started p-[30px] w-fit h-fit rounded-lg shadow-accent text-cyan-50 bg-shadow mx-auto md:mx-0">
                    <h3 className='head3 mb-6'>Get Started Today</h3>
                    <div className="enrich grid gap-3">
                        <div className="enrich_list">
                            <div className="check">
                                <FaCheck />
                            </div>
                            <span className='text-[14px]'>Enrich Your Skillset</span>
                        </div>
                        <div className="enrich_list">
                            <div className="check">
                                <FaCheck />
                            </div>
                            <span className='text-[14px]'>Stay relevant and Future ready</span>
                        </div>
                        <div className="enrich_list">
                            <div className="check">
                                <FaCheck />
                            </div>
                            <span className='text-[14px]'>Get better job opportunies</span>
                        </div>
                    </div>
                    <div className="course_btn nav_btn bg-primary text-shadow mx-auto flex items-center justify-center mt-9 font-semibold">
                        <Link href='/getStarted'>Enroll Now</Link>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default CourseHead