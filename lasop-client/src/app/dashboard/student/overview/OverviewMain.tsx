'use client';

import React, { useEffect, useState } from 'react';
import { FaChartLine } from 'react-icons/fa6';
import { MdOutlineSpaceDashboard } from "react-icons/md";
import user from '../../../../asset/dashIcon/user.png';
import Image from 'next/image';
import { TbSquarePercentage } from "react-icons/tb";
import { RiDashboardHorizontalLine } from "react-icons/ri";
import { FaChevronRight } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchCenter } from '@/store/centerStore/centerSlice';
import { ClassroomMain, AssessmentMain, ProjectMain } from '@/interfaces/interface';

interface Course {
    _id: string;
    title: string;
    code: string;
    price: string;
    exams: string[];
}

interface Syllabus {
    sylTitle: string;
    sylFile: any;
}

function OverviewMain() {
    const studentDetail = useSelector((state: RootState) => state.student.logDetails);
    const syllabus = useSelector((state: RootState) => state.syllabus.syllabus);

    const classrooms = useSelector((state: RootState) => state.classroom.classroom);

    const assessment = useSelector((state: RootState) => state.assessment.assessment);
    const project = useSelector((state: RootState) => state.project.project);

    const [syllabusFile, setSyllabusFile] = useState<Syllabus | null>(null)

    // Fetching classroom details base on student cohortId, courseId, mode, center and tutor
    const [studentClassroom, setStudentClassroom] = useState<ClassroomMain[]>([]);

    useEffect(() => {
        if (classrooms.length > 0 && studentDetail) {
            const getClassroom = classrooms.filter((cls) => cls.cohortId._id === studentDetail.program.cohortId._id && cls.courseId._id === studentDetail.program.courseId._id && cls.center._id === studentDetail.program.center._id && cls.mode === studentDetail.program.mode && cls.tutorId._id === studentDetail.program.tutorId._id)

            setStudentClassroom(getClassroom)
        }
    }, [classrooms, studentDetail])

    // Fetching completed classes
    const [completedClass, setCompletedClass] = useState<ClassroomMain[]>([]);
    useEffect(() => {
        if (studentClassroom.length > 0 && studentDetail) {
            const getCompletedClass = studentClassroom.filter((stu) => stu.status === 'completed');

            setCompletedClass(getCompletedClass)
        }
    }, [studentClassroom, studentDetail])

    // Fetching completed and attended class by student
    const [completedAttendClass, setCompletedAttendClass] = useState<ClassroomMain[]>([]);
    useEffect(() => {
        if (studentClassroom.length > 0 && studentDetail) {
            const getCompletedAttendClass = studentClassroom.filter((stu) => stu.status === 'completed' && stu.attendance.find((att) => att._id === studentDetail._id));

            setCompletedAttendClass(getCompletedAttendClass)
        }
    }, [studentClassroom, studentDetail])

    // Fetching next classes
    const [nextClass, setNextClass] = useState<ClassroomMain[]>([]);
    useEffect(() => {
        if (studentClassroom.length > 0 && studentDetail) {
            const getNextClass = studentClassroom.filter((stu) => stu.status === 'next');

            setNextClass(getNextClass)
        }
    }, [studentClassroom, studentDetail])

    // Fetching missed classes
    const [missClass, setMissClass] = useState<ClassroomMain[]>([]);
    useEffect(() => {
        if (studentClassroom.length > 0 && studentDetail) {
            const getMissClass = studentClassroom.filter((stu) => stu.status === 'completed' && !stu.attendance.find((att) => att._id === studentDetail._id));

            setMissClass(getMissClass)
        }
    }, [studentClassroom, studentDetail])

    // Filtering assessment under student program
    const [studentAssessment, setStudentAssessment] = useState<AssessmentMain[]>([]);

    useEffect(() => {
        if (assessment.length > 0 && studentDetail) {
            const getAssessment = assessment.filter((cls) => cls.cohortId._id === studentDetail.program.cohortId._id && cls.courseId._id === studentDetail.program.courseId._id && cls.center._id === studentDetail.program.center._id && cls.mode === studentDetail.program.mode && cls.tutorId._id === studentDetail.program.tutorId._id)

            setStudentAssessment(getAssessment)
        }
    }, [assessment, studentDetail]);

    // Fetching completed assessment by student
    const [completedAssessment, setCompletedAssessment] = useState<AssessmentMain[]>([]);

    useEffect(() => {
        if (studentAssessment.length > 0 && studentDetail) {
            const getCompletedAssessment = studentAssessment.filter((cls) => cls.submission.find((sub) => sub.studentId._id === studentDetail._id && sub.submitted === 'true'))

            setCompletedAssessment(getCompletedAssessment)
        }
    }, [studentAssessment, studentDetail]);

    // Filtering project under student program
    const [studentProject, setStudentProject] = useState<ProjectMain[]>([]);

    useEffect(() => {
        if (project.length > 0 && studentDetail) {
            const getProject = project.filter((cls) => cls.cohortId._id === studentDetail.program.cohortId._id && cls.courseId._id === studentDetail.program.courseId._id && cls.center._id === studentDetail.program.center._id && cls.mode === studentDetail.program.mode && cls.tutorId._id === studentDetail.program.tutorId._id)

            setStudentProject(getProject);
        }
    }, [project, studentDetail]);

    // Fetching completed project by student
    const [completedProject, setCompletedProject] = useState<ProjectMain[]>([]);

    useEffect(() => {
        if (studentProject.length > 0 && studentDetail) {
            const getCompletedProject = studentProject.filter((cls) => cls.submission.find((sub) => sub.studentId._id === studentDetail._id && sub.submitted === 'true'))

            setCompletedProject(getCompletedProject)
        }
    }, [studentProject, studentDetail]);

    useEffect(() => {
        const sylData = syllabus.find((syl) => syl.sylTitle === studentDetail?.program.courseId.title)

        if (sylData) {
            setSyllabusFile(sylData)
        }
    }, [syllabus, studentDetail])

    const handleViewSyllabus = (sylLink: string) => {
        if (sylLink) {
            window.open(sylLink, '_blank')
        }
    }

    return (
        <main className='w-full p-5'>
            <div className="progress grid md:grid-cols-2 gap-3">
                <div className="course_over border border-secondary rounded-md p-3 h-fit">
                    <div className="over_head flex items-center gap-1">
                        <MdOutlineSpaceDashboard className='text-[22px]' />
                        <h3 className='font-semibold '>Course overview</h3>
                    </div>
                    <div className="over_detail grid bg-lightSec border border-secondary rounded-md mt-3">
                        <div className='grid grid-cols-2 gap-3 p-2'>
                            <div className='text-[14px]'>
                                <span>Course of study</span>
                                <h3 className='text-shadow font-semibold'>{studentDetail?.program.courseId.title}</h3>
                            </div>
                            {
                                syllabusFile ? <div onClick={() => handleViewSyllabus(syllabusFile?.sylFile)} className='text-[14px] cursor-pointer'>
                                    <span>Syllabus</span>
                                    <h3 className='text-shadow font-semibold'>click to view syllabus</h3>
                                </div> :
                                    <div className='text-[14px] cursor-pointer'>
                                        <span>Syllabus</span>
                                        <h3 className='text-shadow font-semibold'>No syllabus availble for course yet</h3>
                                    </div>
                            }
                            <div className='text-[14px]'>
                                <span>Course instructor</span>
                                <h3 className='text-shadow font-semibold'>{studentDetail?.program.tutorId.firstName} {studentDetail?.program.tutorId.lastName}</h3>
                            </div>
                            <div className='text-[14px]'>
                                <span>Mode of study</span>
                                <h3 className='text-shadow font-semibold'>{studentDetail?.program.mode}</h3>
                            </div>
                        </div>
                        {/* <div className='p-2 border-t border-secondary grid gap-2'>
                            <div className="pro_head flex items-center justify-between text-[14px] font-semibold">
                                <h3>Course progress</h3>
                                <span>0%</span>
                            </div>
                            <div className="pro_bar">
                                <input className='w-full' value={0} type="range" min={0} max={100} name="" id="" />
                            </div>
                        </div> */}
                    </div>
                </div>
                <div className="tracking border border-secondary rounded-md p-3 h-fit">
                    <div className="track_head flex items-center gap-1">
                        <FaChartLine />
                        <h3 className='font-semibold '>Progress tracking</h3>
                    </div>
                    <div className="track_detail grid grid-cols-2 bg-lightSec border border-secondary rounded-md mt-3">
                        <ul className='grid gap-3 p-2 border-r border-secondary'>
                            <li className='flex justify-between items-center'>
                                <span>Classes attended</span>
                                <span className='text-shadow'>{completedAttendClass.length}</span>
                            </li>
                            <li className='flex justify-between items-center'>
                                <span>Classes completed</span>
                                <span className='text-shadow'>{completedClass.length}</span>
                            </li>
                            <li className='flex justify-between items-center'>
                                <span>Classes missed</span>
                                <span className='text-shadow'>{missClass.length}</span>
                            </li>
                            <li className='flex justify-between items-center'>
                                <span>Classes left</span>
                                <span className='text-shadow'>{nextClass.length}</span>
                            </li>
                        </ul>
                        <ul className='grid gap-3 p-2'>
                            <li className='flex justify-between items-center'>
                                <span>Assessments</span>
                                <span className='text-shadow'>{studentAssessment.length}</span>
                            </li>
                            <li className='flex justify-between items-center'>
                                <span>Assessments completed</span>
                                <span className='text-shadow'>{completedAssessment.length}</span>
                            </li>
                            <li className='flex justify-between items-center'>
                                <span>Projects</span>
                                <span className='text-shadow'>{studentProject.length}</span>
                            </li>
                            <li className='flex justify-between items-center'>
                                <span>Completed projects</span>
                                <span className='text-shadow'>{completedProject.length}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="grades grid md:grid-cols-2 gap-3 mt-3">
                <div className="not_list p-3 border border-secondary rounded-md">
                    <div className='flex items-center gap-1'>
                        <TbSquarePercentage className='text-[22px]' />
                        <h3 className='font-semibold '>Recent grades (This session is under development)</h3>
                    </div>
                    <div className="not_item flex flex-col gap-3 mt-3">
                        <div className="not flex items-center justify-between p-2 bg-secondary rounded-md">
                            <div className='flex items-center gap-2'>
                                <div>
                                    <h3 className='font-semibold text-[14px]'>Nathan Kingsley</h3>
                                    <div className='flex items-center gap-2'>
                                        <span className='flex items-center gap-1 text-[10px]'>
                                            <Image className='w-[15px] h-[15px]' src={user} alt='' />
                                            <p>UI/UX</p>
                                        </span>
                                        <span className='flex items-center gap-1 text-[10px]'>
                                            <Image className='w-[15px] h-[15px]' src={user} alt='' />
                                            <p>UI/UX</p>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className='font-bold text-[14px] text-shadow'>N400, 000</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="not_list p-3 border border-secondary rounded-md">
                    <div className='flex items-center gap-1'>
                        <RiDashboardHorizontalLine />
                        <h3 className='font-semibold '>Upcoming events (This session is under development)</h3>
                    </div>
                    <div className="not_item flex flex-col gap-3 mt-3">
                        <div className="not flex items-center justify-between p-2 bg-secondary rounded-md">
                            <div className='flex items-center gap-2'>
                                <div>
                                    <Image className='w-[30px] h-[30px]' src={user} alt='' />
                                </div>
                                <div>
                                    <h3 className='font-semibold text-[14px]'>Nathan Kingsley</h3>
                                    <div className='flex items-center gap-2'>
                                        <span className='flex items-center gap-1 text-[10px]'>
                                            <Image className='w-[15px] h-[15px]' src={user} alt='' />
                                            <p>UI/UX</p>
                                        </span>
                                        <span className='flex items-center gap-1 text-[10px]'>
                                            <Image className='w-[15px] h-[15px]' src={user} alt='' />
                                            <p>UI/UX</p>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <FaChevronRight />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default OverviewMain