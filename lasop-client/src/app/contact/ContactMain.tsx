'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import outline from '../../asset/landPage/outline.png';
import outline2 from '../../asset/landPage/double.png';
import img3 from '../../asset/landPage/img3.png';
import Link from 'next/link';

function ContactMain() {
    const [windowWth, setWindowWth] = useState<number>(0);

    useEffect(() => {
        const handleResize = () => setWindowWth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <main className='overflow-hidden'>
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

export default ContactMain