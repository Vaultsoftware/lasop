'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import outline from '../../asset/landPage/outline.png';
import outline2 from '../../asset/landPage/double.png';
import img1 from '../../asset/landPage/img1.png'
import img2 from '../../asset/landPage/img2.png';
import img3 from '../../asset/landPage/img3.png';
import { team, blog } from '@/data/data';
import { FaRegCalendarAlt, FaRegClock } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";
import Link from 'next/link';

function AboutMain() {
    const [windowWth, setWindowWth] = useState<number>(0);

    useEffect(() => {
        const handleResize = () => setWindowWth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return (
        <main className='overflow-hidden'>
            <section className='md:main py-[3rem] px-[30px]'>
                <div className="philosophy grid md:flex md:items-center md:gap-3 gap-6">
                    <div data-aos='fade-right' className="online_img w-full md:w-[50%]">
                        <Image className='w-full h-[350px] object-cover rounded-md' src={img3} alt="" />
                    </div>
                    <Image src={outline2} className='md:block hidden mx-auto my-2 md:mx-0 md:my-0' alt='' />
                    <Image src={outline} className='md:hidden block mx-auto my-2 md:mx-0 md:my-0' alt='' />
                    <div data-aos='fade-left' className="philposophy_info w-full md:w-[50%]">
                        <h3 className='font-bold text-[35px] text-shadow'>Our Philosophy</h3>
                        <p>
                            Our mission is to provide every student with a platform to refine his or her skills and make a mark in the computer literate world. To sharpen their skills to master new technologies and establish themselves with the goal of Bringing People and Computers Together Successfully, and to meet the augmenting needs of the technology-driven global society.
                            <br />
                            <br />
                            LASOP looks forward to be a recognized Model Computer Programming Institute in the World in meeting the prevailing needs of technical manpower through qualitative, effective and resourceful training.
                        </p>
                    </div>
                </div>
            </section>
            {/* meet our team should be commented on  */}
            {/* <section className='md:main py-[3rem] px-[30px] bg-lightSec'>
                <div className="team">
                    <div data-aos='fade-down' className="team_head mb-[2rem] flex flex-col items-center">
                        <h1 className='font-bold text-[30px] text-center'>Meet Our Team</h1>
                        <Image src={outline} alt="" />
                    </div>
                    <div className="team_info grid md:grid-cols-3 sm:grid-cols-2 items-center justify-center gap-3">
                        {
                            team.map((mem) => (
                                <div data-aos='fade-up' key={mem.id} className="team_detail text-shadow grid items-center justify-center text-center">
                                    <Image className='rounded-full w-[200px] h-[200px] border-2 border-shadow object-cover' src={mem.img} alt="" />
                                    <h3 className='head3'>{mem.role}</h3>
                                    <p>{mem.name}</p>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </section> */}

            <section className='md:main py-[3rem] px-[30px] bg-lightSec'>
                <div className="events">
                    <div data-aos="fade-down" className="events_head flex flex-col items-center mb-[2rem]">
                        <h1 className='font-bold text-[40px] text-center'>Upcoming Events, News & Blogs</h1>
                        <Image src={outline} alt="" />
                    </div>
                    <div className="events_body grid md:grid-cols-3 xsm:grid-cols-2 gap-6">
                        {
                            blog.map((blog) => (
                                <div data-aos="fade-left" key={blog.id} className="events_list w-full p-3 rounded-md flex flex-col gap-2">
                                    <div className="events_img w-full">
                                        <Image className='w-full h-[250px] object-cover rounded-md' src={blog.img} alt="" />
                                    </div>
                                    <div className="events_info mt-auto">
                                        <h3 className='head3 text-shadow'>{blog.title}</h3>
                                        <div className="events_publish flex items-center gap-4">
                                            <div className="event_month flex items-center gap-2 text-[12px]">
                                                <FaRegCalendarAlt className='text-shadow' />
                                                <span>{blog.date}</span>
                                            </div>
                                            <div className="event_time flex items-center gap-2 text-[12px]">
                                                <FaRegClock className='text-shadow' />
                                                <span>{blog.time}</span>
                                            </div>
                                        </div>
                                        <p className='mt-3'>{blog.content}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <Link href='/blog' className="event_all flex items-center gap-2 mx-auto w-fit py-3 px-5 rounded-[30px] mt-6 bg-primary">
                        <span>View all blogs</span>
                        <FaArrowRight />
                    </Link>
                </div>
            </section>
        </main>
    )
}

export default AboutMain