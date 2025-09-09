import React from 'react';
import Image from 'next/image';
import { CiSearch } from "react-icons/ci";
import { blog } from '@/data/data';
import { FaRegCalendarAlt, FaRegClock } from "react-icons/fa";

function BlogMain() {
    return (
        <main>
            <section className='md:main py-[3rem] px-[30px]'>
                <div className="latest_search grid md:flex md:items-center gap-3 justify-between">
                    <h3 className='font-bold text-[30px] text-shadow'>LATEST BLOG POSTS</h3>
                    <form action="">
                        <div className="latest_inp flex items-center w-[300px] h-[40px] border-2 border-shadow rounded-md">
                            <input type="search" placeholder='Search...' className='w-[90%] h-full rounded-md p-2 outline-0' />
                            <CiSearch className='font-bold text-shadow text-[20px]' />
                        </div>
                    </form>
                </div>
            </section>

            <section className='md:main py-[3rem] px-[30px]'>
                <div className="events_body grid md:grid-cols-3 xsm:grid-cols-2 gap-6">
                    {
                        blog.map((blog) => (
                            <div key={blog.id} className="events_list w-full p-3 rounded-md flex flex-col gap-2 shadow-md shadow-slate-800">
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
            </section>

            <section className='md:main py-[3rem] px-[30px] bg-secondary'>
                <div className="subscribe grid md:flex md:items-center gap-3 md:justify-between">
                    <h3 className='font-bold text-[40px] text-shadow'>
                        Subscribe to our Newsletter
                    </h3>
                    <form action="" className='grid sm:flex sm:items-center gap-3'>
                        <div className="sub_inp">
                            <input type="email" id="" className='w-[300px] h-[40px] rounded-md p-2 outline-0 bg-white' placeholder='Email Address' />
                        </div>
                        <div className="sub_btn">
                            <button className='nav_btn bg-accent text-cyan-50'>Subscribe</button>
                        </div>
                    </form>
                </div>
            </section>
        </main>
    )
}

export default BlogMain