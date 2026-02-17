'use client';

import Link from 'next/link';
import React, { ReactNode, useEffect } from 'react';
import { LuSearch } from "react-icons/lu";
import { CiLogout } from "react-icons/ci";
import { FaUsers, FaChalkboardTeacher, FaRegFileAlt } from "react-icons/fa";
import { IoHomeOutline, IoBriefcaseOutline } from "react-icons/io5";
import { LuBook } from "react-icons/lu";
import { MdOutlineMessage } from 'react-icons/md';
import { FaXmark } from 'react-icons/fa6';

import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { handleMenu } from '@/store/dashMenu/dashStore';

import { usePathname, useRouter } from 'next/navigation';

import {
  fetchStudentLogDetails,
  logOut
} from '@/store/studentStore/studentStore';

import { fetchClassroom } from '@/store/classroomStore/classroomStore';
import { fetchAssessment, updateAssessmentStatus } from '@/store/assessmentStore/assessmentStore';
import { fetchProject, updateProjectStatus } from '@/store/projectStore/projectStore';
import { fetchJob } from '@/store/jobStore/jobStore';
import { fetchExam } from '@/store/examStore/examStore';
import { fetchCohort, updateCohortStatus } from '@/store/cohortSlice/cohortStore';
import { fetchCourse } from '@/store/courseSlice/courseStore';
import { fetchSyllabus } from '@/store/syllabus/syllabusSlice';
import { fetchCertificates } from '@/store/certificate/certificateStore';
import { fetchCenter } from '@/store/centerStore/centerSlice';
import { fetchProfile } from '@/store/profile/profileStore';

import Image from 'next/image';
import lasopLogo from '../../../asset/form/logo.png';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface DashLayout {
  children: ReactNode;
}

function DashStudentPage({ children }: DashLayout) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const currentPath = usePathname();

  const openMenu = useSelector((state: RootState) => state.dashMenu.openMenu);
  const studentId = useSelector((state: RootState) => state.student.logDetails?._id);
  const token = useSelector((state: RootState) => state.student.token);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    if (studentId) {
      dispatch(fetchStudentLogDetails(studentId));
      dispatch(fetchClassroom());
      dispatch(fetchAssessment());
      dispatch(fetchProject());
      dispatch(fetchExam());
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
  }, [token, studentId, dispatch, router]);

  const getLinkClass = (path: string) =>
    currentPath === path ? 'bg-primary text-shadow' : '';

  const logUserOut = () => {
    dispatch(logOut());
    toast.success('You are logged out');
    router.push('/login');
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`sidemenu flex flex-col w-[60vw] lmd:w-[14vw] h-[100%] lmd:h-[100vh] py-3 fixed z-10 lmd:static top-0 transition-all duration-500 ${
          openMenu ? 'left-0' : 'left-[-100vw]'
        }`}
      >
        <div className="flex justify-between items-center">
          <Image
            className="w-[120px] h-[80px]"
            src={lasopLogo}
            alt="Lasop Logo"
            priority
          />
          <FaXmark
            onClick={() => dispatch(handleMenu())}
            className="text-[25px] text-secondary lmd:hidden mr-5 cursor-pointer"
          />
        </div>

        {/* Mobile Search */}
        <div className="search block lmd:hidden px-5 mt-4">
          <div className="dash_ctrl flex items-center p-2 bg-secondary rounded-md">
            <LuSearch className="text-[20px] text-accent" />
            <input
              type="search"
              placeholder="Search..."
              className="w-full h-[25px] outline-none bg-transparent p-1"
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-1 py-5 px-2">
          <Link href="/dashboard/student" onClick={() => dispatch(handleMenu())}
            className={`${getLinkClass('/dashboard/student')} flex gap-3 pl-3 leading-9 text-primary text-[14px] hover:bg-primary hover:text-shadow font-semibold rounded-md transition-all`}>
            <IoHomeOutline />
            <span>Overview</span>
          </Link>

          <Link href="/dashboard/student/classroom" onClick={() => dispatch(handleMenu())}
            className={`${getLinkClass('/dashboard/student/classroom')} flex gap-3 pl-3 leading-9 text-primary text-[14px] hover:bg-primary hover:text-shadow font-semibold rounded-md transition-all`}>
            <FaUsers />
            <span>Classroom</span>
          </Link>

          <Link href="/dashboard/student/assessments" onClick={() => dispatch(handleMenu())}
            className={`${getLinkClass('/dashboard/student/assessments')} flex gap-3 pl-3 leading-9 text-primary text-[14px] hover:bg-primary hover:text-shadow font-semibold rounded-md transition-all`}>
            <FaChalkboardTeacher />
            <span>Assessments</span>
          </Link>

          <Link href="/dashboard/student/messages" onClick={() => dispatch(handleMenu())}
            className={`${getLinkClass('/dashboard/student/messages')} flex gap-3 pl-3 leading-9 text-primary text-[14px] hover:bg-primary hover:text-shadow font-semibold rounded-md transition-all`}>
            <MdOutlineMessage />
            <span>Messages</span>
          </Link>

          <Link href="/dashboard/student/projects" onClick={() => dispatch(handleMenu())}
            className={`${getLinkClass('/dashboard/student/projects')} flex gap-3 pl-3 leading-9 text-primary text-[14px] hover:bg-primary hover:text-shadow font-semibold rounded-md transition-all`}>
            <LuBook />
            <span>Projects</span>
          </Link>

          <Link href="/dashboard/student/exams" onClick={() => dispatch(handleMenu())}
            className={`${getLinkClass('/dashboard/student/exams')} flex gap-3 pl-3 leading-9 text-primary text-[14px] hover:bg-primary hover:text-shadow font-semibold rounded-md transition-all`}>
            <FaRegFileAlt />
            <span>Exams</span>
          </Link>

          <Link href="/dashboard/student/Jobbank" onClick={() => dispatch(handleMenu())}
            className={`${getLinkClass('/dashboard/student/Jobbank')} flex gap-3 pl-3 leading-9 text-primary text-[14px] hover:bg-primary hover:text-shadow font-semibold rounded-md transition-all`}>
            <IoBriefcaseOutline />
            <span>Job Bank</span>
          </Link>
        </div>

        {/* Logout */}
        <div
          onClick={logUserOut}
          className="flex gap-3 pl-3 leading-9 text-primary text-[14px] mt-auto cursor-pointer"
        >
          <CiLogout />
          <span>Log out</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex justify-center items-center w-full lmd:w-[86vw] h-full lmd:h-[100vh]">
        {children}
      </div>

      <ToastContainer />
    </div>
  );
}

export default DashStudentPage;
