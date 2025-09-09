'use client';

import { RootState } from '@/store/store';
import React, { useState, useEffect } from 'react';
import { IoVideocamOutline } from "react-icons/io5";
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { CohortMain, ClassroomMain } from '@/interfaces/interface';
import ReactPaginate from 'react-paginate';

function ClassroomMainStu() {
    const [calendarData, setCalendarData] = useState<string>('next');

    const handleCalendarData = (arg: string) => {
        setCalendarData(arg);
    }

    const classStatus: string[] = ['next', 'completed', 'missed', 'rescheduled', 'cancelled'];

    // Displaying classroom based on Student instructor, Cohort and Course
    const [studentCohortData, setStudentCohortData] = useState<CohortMain | null>(null);
    const [getClassroomCoh, setGetClassroomCoh] = useState<ClassroomMain[]>([]);

    const classroom = useSelector((state: RootState) => state.classroom.classroom)
    const cohort = useSelector((state: RootState) => state.cohort.cohort);
    const student = useSelector((state: RootState) => state.student.logDetails);

    useEffect(() => {
        const studentCohort = cohort.find((coh) => coh._id === student?.program.cohortId._id && coh.courseTutors.some((ct) => ct.course._id === student?.program.courseId._id && ct.center._id === student?.program.center._id && ct.mode === student?.program.mode && ct.tutors._id === student?.program.tutorId._id));

        if (studentCohort) {
            setStudentCohortData(studentCohort);
        }
    }, [cohort, student])

    useEffect(() => {
        if (studentCohortData) {
            const classroomCohort = classroom.filter((cls) => cls.cohortId._id === studentCohortData?._id && student?.program.courseId._id === cls.courseId._id && student?.program.center._id === cls.center._id && student?.program.mode === cls.mode && student?.program.tutorId._id === cls.tutorId._id)

            if (classroomCohort) {
                setGetClassroomCoh(classroomCohort)
            }
        }
    }, [studentCohortData, classroom])

    // Setting classroom based on status
    const [classStatusDetail, setClassStatusDetail] = useState<ClassroomMain[]>([]);

    useEffect(() => {
        if (getClassroomCoh) {
            const classroomStatus = getClassroomCoh.filter((cls) => cls.status === calendarData);
            setClassStatusDetail(classroomStatus);
        }

    }, [getClassroomCoh, calendarData]);

    // Formatting date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

        return formattedDate
    }

    const getHour = (dateString: string) => {
        const date = new Date(dateString);

        const hours = date.getHours()

        return hours;
    }

    const getMin = (dateString: string) => {
        const date = new Date(dateString);

        const mins = date.getMinutes()

        return mins;
    }

    // Checking student status
    const [studentStatus, setStudentStatus] = useState<boolean>(false);

    useEffect(() => {
        if (student) {
            if (student.status === 'applicant' || student.status === 'rejected' || student.status === 'expelled') {
                setStudentStatus(false)
            }
            else if (student.status === 'student' || student.status === 'graduate') {
                setStudentStatus(true)
            }
        }
    }, [student])

    // Pagination
    const [pageNumber, setPageNumber] = useState<number>(0)

    const classPerPage = 10;
    const pageVisited = pageNumber * classPerPage;

    const displayPrvClass = classStatusDetail.slice(pageVisited, pageVisited + classPerPage).map((coh, ind) => {
        return (
            <tr key={ind} className='border-t border-shadow text-start'>
                <td className='py-3 block md:table-cell'>{ind + 1}</td>
                <td className='py-3 block md:table-cell'>{coh.title}</td>
                <td className='py-3 block md:table-cell'>{coh.cohortId.cohortName}</td>
                <td className='py-3 block md:table-cell'>{formatDate(coh.date)}</td>
                <td className='py-3 block md:table-cell'>{coh.time}
                </td>
                <td className='py-3 md:table-cell flex items-center justify-center gap-1 text-[12px]'>
                    {
                        (coh.startClass && (coh.status === 'rescheduled' || coh.status === 'next')) ? <Link href={coh.zoomLink} className='flex items-center justify-center gap-1 px-3 py-2 bg-shadow text-secondary rounded-md w-fit'>
                            <IoVideocamOutline />
                            <span>Join Classroom</span>
                        </Link> : ''
                    }
                </td>
            </tr>
        )
    })

    const changePage = ({ selected }: any) => {
        setPageNumber(selected)
    }

    return (
        <main className='w-full p-5'>
            {
                studentStatus ? <div className="academic">
                    <div className="academics_list flex gap-5 border-b w-full h-[60px] px-2 rounded-md overflow-x-scroll sm:overflow-hidden whitespace-nowrap sm:whitespace-normal">
                        {
                            classStatus.map((cal, ind) => (
                                <div
                                    key={ind}
                                    className={`${calendarData === cal ? 'border-b-2 border-shadow text-shadow font-semibold' : ''} 'package text-shadow cursor-pointer h-full flex items-center gap-3`}
                                    onClick={() => handleCalendarData(cal)}
                                >
                                    <span>{cal}</span>
                                </div>
                            ))
                        }
                    </div>

                    <div className="academic_cohort mt-4">
                        <table className='w-full border-b border-shadow'>
                            <thead>
                                <tr >
                                    <th className='text-start py-3 block md:table-cell'>S/N</th>
                                    <th className='text-start py-3 block md:table-cell'>CLASS TITLE</th>
                                    <th className='text-start py-3 block md:table-cell'>COHORT</th>
                                    <th className='text-start py-3 block md:table-cell'>DATE</th>
                                    <th className='text-start py-3 block md:table-cell'>TIME</th>
                                    <th className='text-start py-3 block md:table-cell'>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    classStatusDetail.length > 0 ? displayPrvClass : <tr><td className='' colSpan={4}>No {calendarData} class details available</td></tr>
                                }
                            </tbody>
                        </table>
                        <ReactPaginate
                            previousLabel='Previous'
                            nextLabel='Next'
                            breakLabel="..."
                            pageCount={Math.ceil(classStatusDetail.length / classPerPage)}
                            onPageChange={changePage}
                            containerClassName='paginationBtn'
                            previousLinkClassName='prvBtn'
                            nextLinkClassName='nxtBtn'
                            disabledClassName='dsbBtn'
                            activeClassName='actBtn'
                        />
                    </div>
                </div> : <div>
                    <h3>All details will display as soon as your application is approved</h3>
                </div>
            }
        </main>
    )
}

export default ClassroomMainStu