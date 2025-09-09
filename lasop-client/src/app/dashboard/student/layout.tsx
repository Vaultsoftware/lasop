'use client';
import Link from 'next/link';
import React, { ReactNode, useEffect } from 'react';
import { LuSearch } from "react-icons/lu";
import { CiLogout } from "react-icons/ci";
import { FaUsers, FaChalkboardTeacher, FaRegFileAlt } from "react-icons/fa";
import { IoHomeOutline } from "react-icons/io5";
import { LuBook } from "react-icons/lu";
import { IoBriefcaseOutline } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { FaXmark } from 'react-icons/fa6';
import { AppDispatch } from '@/store/store';
import { handleMenu } from '@/store/dashMenu/dashStore';
import { usePathname, useRouter } from 'next/navigation';
import { MdOutlineMessage } from 'react-icons/md';
import { fetchStudent, fetchStudentLogDetails, logOut } from '@/store/studentStore/studentStore';
import { fetchClassroom } from '@/store/classroomStore/classroomStore';
import { fetchAssessment, updateAssessmentStatus } from '@/store/assessmentStore/assessmentStore';
import { fetchProject, fetchProjectDetail, updateProjectStatus } from '@/store/projectStore/projectStore';
import { fetchJob } from '@/store/jobStore/jobStore';
import { fetchExam } from '@/store/examStore/examStore';
import { fetchCohort, updateCohortStatus } from '@/store/cohortSlice/cohortStore';
import { fetchCourse } from '@/store/courseSlice/courseStore';
import { fetchSyllabus } from '@/store/syllabus/syllabusSlice';
import { fetchMessages } from '@/store/messageStore/msgStore';
import { fetchCertificates } from '@/store/certificate/certificateStore';
import Image from 'next/image';
import lasopLogo from '../../../asset/form/logo.png';
import { fetchCenter } from '@/store/centerStore/centerSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchProfile } from '@/store/profile/profileStore';

interface DashLayout {
    children: ReactNode;
}

function DashStudentPage({ children }: DashLayout) {
    const openMenu = useSelector((state: RootState) => state.dashMenu.openMenu);
    const studentId = useSelector((state: RootState) => state.student.logDetails?._id);
    const token = useSelector((state: RootState) => state.student.token);

    const router = useRouter();

    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        if (token === null || !token) {
            router.push('/login');
        }
        else if (studentId) {
            dispatch(fetchStudentLogDetails(studentId))
            dispatch(fetchClassroom());
            dispatch(fetchAssessment());
            dispatch(fetchProject());
            dispatch(fetchMessages());
            dispatch(fetchExam())
            dispatch(fetchJob());
            dispatch(fetchCohort());
            dispatch(fetchCenter());
            dispatch(fetchCourse());
            dispatch(fetchCertificates());
            dispatch(fetchSyllabus());
            dispatch(fetchProfile());
            dispatch(updateCohortStatus());
            dispatch(updateAssessmentStatus());
            dispatch(updateProjectStatus());
        }
    }, [token, studentId, dispatch, router])

    const currentPath = usePathname();
    const getLinkClass = (path: string) => {
        return currentPath === path ? `bg-primary text-shadow` : '';
    }

    const logUserOut = () => {
        dispatch(logOut())
        toast.success('You are logged out')
        router.push('/login')
    }

    return (
        <div className='flex'>
            <div className={`sidemenu flex flex-col w-[60vw] lmd:w-[14vw] h-[100%] lmd:h-[100vh] py-3 fixed z-10 lmd:static top-0 transition-all duration-500 ${openMenu ? 'left-0' : 'left-[-100vw]'}`}>
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
                    <Link onClick={() => dispatch(handleMenu())} href='/dashboard/student' className={`${getLinkClass('/dashboard/student')} flex item-center gap-3 pl-3 leading-9 text-primary text-[14px] hover:bg-primary hover:text-shadow font-semibold rounded-md transition-all duration-500`}>
                        <div className="side_icon flex items-center">
                            <IoHomeOutline />
                        </div>
                        <span>Overview</span>
                    </Link>
                    <Link onClick={() => dispatch(handleMenu())} href='/dashboard/student/classroom' className={`${getLinkClass('/dashboard/student/classroom')} flex item-center gap-3 pl-3 leading-9 text-primary text-[14px] hover:bg-primary hover:text-shadow font-semibold rounded-md transition-all duration-500`}>
                        <div className="side_icon flex items-center">
                            <FaUsers />
                        </div>
                        <span>Classroom</span>
                    </Link>
                    <Link onClick={() => dispatch(handleMenu())} href='/dashboard/student/assessments' className={`${getLinkClass('/dashboard/student/assessments')} flex item-center gap-3 pl-3 leading-9 text-primary text-[14px] hover:bg-primary hover:text-shadow font-semibold rounded-md transition-all duration-500`}>
                        <div className="side_icon flex items-center">
                            <FaChalkboardTeacher />
                        </div>
                        <span>Assessments</span>
                    </Link>
                    <Link onClick={() => dispatch(handleMenu())} href='/dashboard/student/messages' className={`${getLinkClass('/dashboard/student/messages')} flex item-center gap-3 pl-3 leading-9 text-primary text-[14px] hover:bg-primary hover:text-shadow font-semibold rounded-md transition-all duration-500`}>
                        <div className="side_icon flex items-center">
                            <MdOutlineMessage />
                        </div>
                        <span>Messages</span>
                    </Link>
                    <Link onClick={() => dispatch(handleMenu())} href='/dashboard/student/projects' className={`${getLinkClass('/dashboard/student/projects')} flex item-center gap-3 pl-3 leading-9 text-primary text-[14px] hover:bg-primary hover:text-shadow font-semibold rounded-md transition-all duration-500`}>
                        <div className="side_icon flex items-center">
                            <LuBook />
                        </div>
                        <span>Projects</span>
                    </Link>
                    <Link onClick={() => dispatch(handleMenu())} href='/dashboard/student/exams' className={`${getLinkClass('/dashboard/student/exams')} flex item-center gap-3 pl-3 leading-9 text-primary text-[14px] hover:bg-primary hover:text-shadow font-semibold rounded-md transition-all duration-500`}>
                        <div className="side_icon flex items-center">
                            <FaRegFileAlt />
                        </div>
                        <span>Exams</span>
                    </Link>
                    <Link onClick={() => dispatch(handleMenu())} href='/dashboard/student/Jobbank' className={`${getLinkClass('/dashboard/student/Jobbank')} flex item-center gap-3 pl-3 leading-9 text-primary text-[14px] hover:bg-primary hover:text-shadow font-semibold rounded-md transition-all duration-500`}>
                        <div className="side_icon flex items-center">
                            <IoBriefcaseOutline />
                        </div>
                        <span>Job Bank</span>
                    </Link>
                </div>
                <div onClick={logUserOut} className="log flex item-center gap-3 pl-3 leading-9 text-primary text-[14px] mt-auto cursor-pointer">
                    <div className="side_icon flex items-center">
                        <CiLogout />
                    </div>
                    <span>Log out</span>
                </div>
            </div>
            <div className="outlet flex justify-center items-center w-full lmd:w-[86vw] h-full lmd:h-[100vh]">
                {children}
            </div>
            <ToastContainer />
        </div>
    )
}

export default DashStudentPage