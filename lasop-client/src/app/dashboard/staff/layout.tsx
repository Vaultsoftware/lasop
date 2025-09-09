'use client';
import Link from 'next/link';
import React, { ReactNode, useEffect } from 'react';
import { LuSearch } from "react-icons/lu";
import { CiWarning, CiLogout } from "react-icons/ci";
import { FaUsers, FaChalkboardTeacher } from "react-icons/fa";
import { IoHomeOutline } from "react-icons/io5";
import { LuBook } from "react-icons/lu";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { FaXmark } from 'react-icons/fa6';
import { AppDispatch } from '@/store/store';
import { handleMenu } from '@/store/dashMenu/dashStore';
import { usePathname, useRouter } from 'next/navigation';
import { MdOutlineMessage } from 'react-icons/md';
import { fetchClassroom } from '@/store/classroomStore/classroomStore';
import { fetchAssessment, updateAssessmentStatus } from '@/store/assessmentStore/assessmentStore';
import { fetchCohort, updateCohortStatus } from '@/store/cohortSlice/cohortStore';
import { setActiveCohort, setStaffAssignedCohort } from '@/store/filterStore/staffFilStore';
import { fetchStudent } from '@/store/studentStore/studentStore';
import { fetchCertificates } from '@/store/certificate/certificateStore';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchProject, updateProjectStatus } from '@/store/projectStore/projectStore';
import BackArrow from '@/components/backArrow/BackArrow';
import NotificationStaff from '@/components/dashboardComp/staffComp/notification/NotificationStaff';

interface DashLayout {
    children: ReactNode;
}

function DashStaffLayout({ children }: DashLayout) {
    const openMenu = useSelector((state: RootState) => state.dashMenu.openMenu);
    const token = useSelector((state: RootState) => state.staff.token);
    const staffDetail = useSelector((state: RootState) => state.staff.logDetails?._id);
    const cohort = useSelector((state: RootState) => state.cohort.cohort)

    const notification = useSelector((state: RootState) => state.dashMenu.notification)

    const dispatch: AppDispatch = useDispatch();

    const router = useRouter();

    useEffect(() => {
        if (token === null || !token) {
            router.push('/login');
        }
        else if (staffDetail) {
            const getStaffAssignedCohort = cohort.filter((coh) => coh.courseTutors.some((ct) => ct.tutors._id === staffDetail));
            if (getStaffAssignedCohort.length > 0) {
                dispatch(setStaffAssignedCohort(getStaffAssignedCohort))
            };

            if (getStaffAssignedCohort.length > 0) {
                const getActiveCohort = getStaffAssignedCohort.filter((assCoh) => assCoh.isActive === true);
                if (getActiveCohort.length > 0) {
                    dispatch(setActiveCohort(getActiveCohort[0]))
                }
            };

            dispatch(fetchProject());
            dispatch(fetchClassroom());
            dispatch(fetchAssessment());
            dispatch(fetchCohort());
            dispatch(fetchStudent());
            dispatch(fetchCertificates());
            dispatch(updateAssessmentStatus());
            dispatch(updateCohortStatus());
            dispatch(updateProjectStatus());
        }
    }, [token])

    const currentPath = usePathname();
    const getLinkClass = (path: string) => {
        return currentPath === path ? `bg-primary text-shadow` : '';
    }

    return (
        <div className='flex'>
            <div className={`sidemenu flex flex-col w-[60vw] lmd:w-[14vw] h-[100%] lmd:h-[100vh] py-3 fixed z-10 lmd:static top-0 transition-all duration-500 ${openMenu ? 'left-0' : 'left-[-100vw]'}`}>
                <div className='flex justify-between items-center'>
                    <h3 className='text-accent font-bold pl-3 text-[22px] mb-2'>LASOP</h3>
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
                <div className='w-fit h-fit hidden lmd:block fixed left-[13vw] top-[16vh]'>
                    <BackArrow />
                </div>
                <div className='flex flex-col gap-1 py-5 px-2'>
                    <Link onClick={() => dispatch(handleMenu())} href='/dashboard/staff' className={`${getLinkClass('/dashboard/staff')} flex item-center gap-3 pl-3 leading-9 text-primary text-[14px] hover:bg-primary hover:text-shadow font-semibold rounded-md transition-all duration-500`}>
                        <div className="side_icon flex items-center">
                            <IoHomeOutline />
                        </div>
                        <span>Overview</span>
                    </Link>
                    <Link onClick={() => dispatch(handleMenu())} href='/dashboard/staff/students' className={`${getLinkClass('/dashboard/staff/students')} flex item-center gap-3 pl-3 leading-9 text-primary text-[14px] hover:bg-primary hover:text-shadow font-semibold rounded-md transition-all duration-500`}>
                        <div className="side_icon flex items-center">
                            <FaUsers />
                        </div>
                        <span>Students</span>
                    </Link>
                    <Link onClick={() => dispatch(handleMenu())} href='/dashboard/staff/classroom' className={`${getLinkClass('/dashboard/staff/classroom')} flex item-center gap-3 pl-3 leading-9 text-primary text-[14px] hover:bg-primary hover:text-shadow font-semibold rounded-md transition-all duration-500`}>
                        <div className="side_icon flex items-center">
                            <FaUsers />
                        </div>
                        <span>Classroom</span>
                    </Link>
                    <Link onClick={() => dispatch(handleMenu())} href='/dashboard/staff/assessments' className={`${getLinkClass('/dashboard/staff/assessments')} flex item-center gap-3 pl-3 leading-9 text-primary text-[14px] hover:bg-primary hover:text-shadow font-semibold rounded-md transition-all duration-500`}>
                        <div className="side_icon flex items-center">
                            <FaChalkboardTeacher />
                        </div>
                        <span>Assessments</span>
                    </Link>
                    <Link onClick={() => dispatch(handleMenu())} href='/dashboard/staff/projects' className={`${getLinkClass('/dashboard/staff/projects')} flex item-center gap-3 pl-3 leading-9 text-primary text-[14px] hover:bg-primary hover:text-shadow font-semibold rounded-md transition-all duration-500`}>
                        <div className="side_icon flex items-center">
                            <LuBook />
                        </div>
                        <span>Projects</span>
                    </Link>
                    <Link onClick={() => dispatch(handleMenu())} href='/dashboard/staff/messages' className={`${getLinkClass('/dashboard/staff/messages')} flex item-center gap-3 pl-3 leading-9 text-primary text-[14px] hover:bg-primary hover:text-shadow font-semibold rounded-md transition-all duration-500`}>
                        <div className="side_icon flex items-center">
                            <MdOutlineMessage />
                        </div>
                        <span>Messages</span>
                    </Link>
                    <Link onClick={() => dispatch(handleMenu())} href='/dashboard/staff/queries' className={`${getLinkClass('/dashboard/staff/queries')} flex item-center gap-3 pl-3 leading-9 text-primary text-[14px] hover:bg-primary hover:text-shadow font-semibold rounded-md transition-all duration-500`}>
                        <div className="side_icon flex items-center">
                            <CiWarning />
                        </div>
                        <span>Queries</span>
                    </Link>
                </div>
                <div className="log flex item-center gap-3 pl-3 leading-9 text-primary text-[14px] mt-auto">
                    <div className="side_icon flex items-center">
                        <CiLogout />
                    </div>
                    <span>Log out</span>
                </div>
            </div>
            <div className="outlet flex justify-center items-center w-full lmd:w-[86vw] h-full lmd:h-[100vh]">
                {children}
            </div>
            {
                notification && <NotificationStaff />
            }
            <ToastContainer />
        </div>
    )
}

export default DashStaffLayout;