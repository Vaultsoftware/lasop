'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { GiHamburgerMenu } from "react-icons/gi";
import { FaAngleDown } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";
import { course } from '@/data/data';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { fetchCohort } from '@/store/cohortSlice/cohortStore';
import { fetchCourse } from '@/store/courseSlice/courseStore';
import Image from 'next/image';
import lasopLogo from '../../asset/form/logo.png';

function Navbar() {
    const [dropDown, setDropDown] = useState<boolean>(false);
    const handleDropdown = () => {
        setDropDown(!dropDown);
    };

    const [sidebar, setSidebar] = useState<boolean>(false);
    const handleSidebar = () => {
        setSidebar(!sidebar);
    };

    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
        dispatch(fetchCohort());
    }, [])

    return (
        <nav className='w-full h-[100px] bg-secondary'>
            <div className="navbar flex items-center justify-between h-full md:px-12 px-[30px]">
                <Link href='/' className="nav_logo font-bold text-2xl text-accent">
                    <Image className='w-[120px] h-[80px]' src={lasopLogo} alt='Lasop logo' />
                </Link>
                <div className={`md:nav_item grid gap-6 md:static fixed top-0 z-30 h-[100vh] md:w-fit w-[70vw] md:bg-transparent bg-shadow md:p-0 p-3 md:text-slate-900 text-primary transition-all duration-700 ${sidebar ? 'left-0' : 'left-[-100%]'}`}>
                    <ul className='md:flex md:items-center md:flex-row flex-col h-full gap-3'>
                        <div onClick={handleSidebar} className="close md:hidden flex items-center justify-center w-10 h-10 ml-auto text-[25px] text-accent">
                            <IoCloseSharp />
                        </div>
                        <li className='md:nav_item grid gap-2 relative'>
                            <div onClick={handleDropdown} className="drop font-[600] flex items-center gap-2 cursor-pointer" >
                                <span>Courses</span>
                                <FaAngleDown />
                            </div>
                            <div className={`drop_courses md:absolute static left-[-3rem] top-[80px] md:w-[200px] w-full rounded-lg bg-secondary grid gap-3 font-semibold transition-all duration-700 text-shadow ${dropDown ? ' opacity-100 h-fit max-h-fit overflow-visible p-2' : 'opacity-0 max-h-0 overflow-hidden p-0'}`}>
                                {
                                    course.map((link, ind) => (
                                        <Link key={ind} href={`/course/${link.title}`}>{link.dpt1}</Link>
                                    ))
                                }
                            </div>
                        </li>
                        <li className='md:nav_item leading-9 font-semibold'>
                            <Link href='/calendar'>Calendar</Link>
                        </li>
                        <li className='md:nav_item leading-9 font-semibold'>
                            <Link href='/about'>About</Link>
                        </li>
                        <li className='md:nav_item leading-9 font-semibold'>
                            <Link href='/faq'>FAQS</Link>
                        </li>
                        <li className='md:nav_item leading-9 font-semibold'>
                            <Link href='/blog'>Blog</Link>
                        </li>
                    </ul>
                    <div className="started md:flex grid gap-3 md:mt-0 mt-auto">
                        <Link href='/getStarted' className='md:nav_btn w-full h-[40px] bg-accent flex items-center text-cyan-50'>Get started</Link>
                    </div>
                </div>
                <div onClick={handleSidebar} className="burger md:hidden flex items-center text-[25px] text-accent">
                    <GiHamburgerMenu />
                </div>
            </div>
        </nav>
    )
}

export default Navbar