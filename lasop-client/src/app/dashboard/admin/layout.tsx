'use client';

import Link from 'next/link';
import React, { ReactNode, useEffect } from 'react';
import { LuSearch } from "react-icons/lu";
import { CiWarning, CiLogout } from "react-icons/ci";
import { FaRegCalendar, FaUserGraduate, FaUsers, FaChalkboardTeacher, FaRegFileAlt } from "react-icons/fa";
import { IoHomeOutline } from "react-icons/io5";
import { LuBook, LuClipboardCheck } from "react-icons/lu";
import { IoBriefcaseOutline } from "react-icons/io5";
import { PiMoneyWavy } from "react-icons/pi";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { FaXmark } from 'react-icons/fa6';
import { AppDispatch } from '@/store/store';
import { handleMenu } from '@/store/dashMenu/dashStore';
import { usePathname } from 'next/navigation';
import { fetchCourse } from '@/store/courseSlice/courseStore';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchCohort, updateCohortStatus } from '@/store/cohortSlice/cohortStore';
import { fetchCenter } from '@/store/centerStore/centerSlice';
import { fetchStudent } from '@/store/studentStore/studentStore';
import { fetchSyllabus } from '@/store/syllabus/syllabusSlice';
import Image from 'next/image';
import lasopLogo from '../../../asset/form/logo.png';
import { fetchCertificates } from '@/store/certificate/certificateStore';
import { fetchStaff } from '@/store/staffStore/staffSlice';
import { updateProjectStatus } from '@/store/projectStore/projectStore';
import { updateAssessmentStatus } from '@/store/assessmentStore/assessmentStore';
import { setActiveCohortAd, setAdminAssignedCohort } from '@/store/filterStore/adminFilStore';

interface DashLayout {
    children: ReactNode;
}

function DashboardLayout({ children }: DashLayout) {
    const openMenu = useSelector((state: RootState) => state.dashMenu.openMenu);
    const cohorts = useSelector((state: RootState) => state.cohort.cohort);
    const adminAssignedCohort = useSelector((state: RootState) => state.adminFilter.adminAssignedCohort);
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchCourse());
        dispatch(fetchCohort());
        dispatch(fetchCenter());
        dispatch(fetchStudent());
        dispatch(fetchStaff());
        dispatch(fetchSyllabus());
        dispatch(fetchCertificates());
        dispatch(updateCohortStatus());
        dispatch(updateProjectStatus());
        dispatch(updateAssessmentStatus());

        dispatch(setAdminAssignedCohort(cohorts));
        dispatch(setActiveCohortAd(cohorts[cohorts.length - 1]))
    }, [])

    const currentPath = usePathname();
    const getLinkClass = (path: string) => {
        return currentPath === path ? `bg-primary text-shadow` : '';
    }

    return (
        <div className='flex'>
            <div className={`sidemenu flex flex-col w-[60vw] lmd:w-[14vw] h-[100%] lmd:h-[100vh] py-3 fixed lmd:left-0 z-10 top-0 transition-all duration-500 overflow-y-auto ${openMenu ? 'left-0' : 'left-[-100vw]'}`}>
                <div className='flex justify-between items-center'>
                    <h3 className='text-accent font-bold pl-3 text-[22px] mb-2'>
                        <Image className='w-[120px] h-[80px]' src={lasopLogo} alt='' />
                    </h3>
                    <FaXmark onClick={() => dispatch(handleMenu())} className='text-[25px] text-secondary flex items-center lmd:hidden mr-5' />
                </div>
                <div className="search block lmd:hidden px-5">
                    <form action="">
                        <div className="dash_inp">
                            <div className="dash_ctrl flex items-center p-2 bg-secondary rounded-md">
                                <LuSearch className='text-[20px] text-accent' />
                                <input type="search" placeholder='Search...' className='w-full h-[25px] outline-none bg-transparent p-1' id="" />
                            </div>
                        </div>
                    </form>
                </div>
                <div className='flex flex-col gap-1 py-5 px-2'>
                    <Link onClick={() => dispatch(handleMenu())} href='/dashboard/admin' className={`${getLinkClass('/dashboard/admin')} flex item-center gap-3 pl-3 leading-9 text-primary text-[14px] hover:bg-primary hover:text-shadow font-semibold rounded-md transition-all duration-500`}>
                        <div className="side_icon flex items-center">
                            <IoHomeOutline />
                        </div>
                        <span>Overview</span>
                    </Link>
                    <Link onClick={() => dispatch(handleMenu())} href='/dashboard/admin/calendar' className={`${getLinkClass('/dashboard/admin/calendar')} flex item-center gap-3 pl-3 leading-9 text-primary text-[14px] hover:bg-primary hover:text-shadow font-semibold rounded-md transition-all duration-500`}>
                        <div className="side_icon flex items-center">
                            <FaRegCalendar />
                        </div>
                        <span>Cohorts</span>
                    </Link>
                    <Link onClick={() => dispatch(handleMenu())} href='/dashboard/admin/applicants' className={`${getLinkClass('/dashboard/admin/applicants')} flex item-center gap-3 pl-3 leading-9 text-primary text-[14px] hover:bg-primary hover:text-shadow font-semibold rounded-md transition-all duration-500`}>
                        <div className="side_icon flex items-center">
                            <FaUserGraduate />
                        </div>
                        <span>Applicants</span>
                    </Link>
                    <Link onClick={() => dispatch(handleMenu())} href='/dashboard/admin/students' className={`${getLinkClass('/dashboard/admin/students')} flex item-center gap-3 pl-3 leading-9 text-primary text-[14px] hover:bg-primary hover:text-shadow font-semibold rounded-md transition-all duration-500`}>
                        <div className="side_icon flex items-center">
                            <FaUsers />
                        </div>
                        <span>Students</span>
                    </Link>
                    <Link onClick={() => dispatch(handleMenu())} href='/dashboard/admin/staffs' className={`${getLinkClass('/dashboard/admin/staffs')} flex item-center gap-3 pl-3 leading-9 text-primary text-[14px] hover:bg-primary hover:text-shadow font-semibold rounded-md transition-all duration-500`}>
                        <div className="side_icon flex items-center">
                            <FaChalkboardTeacher />
                        </div>
                        <span>Staffs</span>
                    </Link>
                    <Link onClick={() => dispatch(handleMenu())} href='/dashboard/admin/finances' className={`${getLinkClass('/dashboard/admin/finances')} flex item-center gap-3 pl-3 leading-9 text-primary text-[14px] hover:bg-primary hover:text-shadow font-semibold rounded-md transition-all duration-500`}>
                        <div className="side_icon flex items-center">
                            <PiMoneyWavy />
                        </div>
                        <span>Finances</span>
                    </Link>
                    <Link onClick={() => dispatch(handleMenu())} href='/dashboard/admin/syllabus' className={`${getLinkClass('/dashboard/admin/syllabus')} flex item-center gap-3 pl-3 leading-9 text-primary text-[14px] hover:bg-primary hover:text-shadow font-semibold rounded-md transition-all duration-500`}>
                        <div className="side_icon flex items-center">
                            <LuBook />
                        </div>
                        <span>Syllabus</span>
                    </Link>
                    <Link onClick={() => dispatch(handleMenu())} href='/dashboard/admin/exam' className={`${getLinkClass('/dashboard/admin/exam')} flex item-center gap-3 pl-3 leading-9 text-primary text-[14px] hover:bg-primary hover:text-shadow font-semibold rounded-md transition-all duration-500`}>
                        <div className="side_icon flex items-center">
                            <FaRegFileAlt />
                        </div>
                        <span>Exam</span>
                    </Link>
                    <Link onClick={() => dispatch(handleMenu())} href='/dashboard/admin/results' className={`${getLinkClass('/dashboard/admin/results')} flex item-center gap-3 pl-3 leading-9 text-primary text-[14px] hover:bg-primary hover:text-shadow font-semibold rounded-md transition-all duration-500`}>
                        <div className="side_icon flex items-center">
                            <LuClipboardCheck />
                        </div>
                        <span>Results</span>
                    </Link>
                    <Link onClick={() => dispatch(handleMenu())} href='/dashboard/admin/queries' className={`${getLinkClass('/dashboard/admin/queries')} flex item-center gap-3 pl-3 leading-9 text-primary text-[14px] hover:bg-primary hover:text-shadow font-semibold rounded-md transition-all duration-500`}>
                        <div className="side_icon flex items-center">
                            <CiWarning />
                        </div>
                        <span>Queries</span>
                    </Link>
                    <Link onClick={() => dispatch(handleMenu())} href='/dashboard/admin/postjob' className={`${getLinkClass('/dashboard/admin/postjob')} flex item-center gap-3 pl-3 leading-9 text-primary text-[14px] hover:bg-primary hover:text-shadow font-semibold rounded-md transition-all duration-500`}>
                        <div className="side_icon flex items-center">
                            <IoBriefcaseOutline />
                        </div>
                        <span>Post Job</span>
                    </Link>
                </div>
                <div className="log flex item-center gap-3 pl-3 leading-9 text-primary text-[14px] mt-auto">
                    <div className="side_icon flex items-center">
                        <CiLogout />
                    </div>
                    <span>Log out</span>
                </div>
            </div>
            <div className="outlet flex justify-center items-center w-full lmd:w-[86vw] h-fit lmd:ml-auto ml-0">
                {children}
            </div>
            <ToastContainer />
        </div>
    )
}

export default DashboardLayout;