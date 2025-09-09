'use client';

import { calendar } from '@/data/data';
import React, { useEffect, useState } from 'react';
import { GoDot } from "react-icons/go";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Link from 'next/link';
import { IoEyeOutline } from "react-icons/io5";
import { ClassroomMain } from '@/interfaces/interface';
import ReactPaginate from 'react-paginate';

function ClassesMain() {
    const statusTab: string[] = ['next', 'completed', 'missed', 'rescheduled', 'cancelled']
    const staffDetail = useSelector((state: RootState) => state.staff.logDetails);
    const staffActiveCohort = useSelector((state: RootState) => state.staffFilter.staffClassroomSelectedCohort);
    const classroom = useSelector((state: RootState) => state.classroom.classroom);

    const classTab = useSelector((state: RootState) => state.pageData.classroomTab);

    // Functionality for displaying class based on status
    const [status, setStatus] = useState<string>('next')
    const handleDisplayStatus = (arg: string) => {
        setStatus(arg)
    }

    // rendering classroom based on tab from another page
    useEffect(() => {
        if (classTab === '') {
            setStatus('next')
        } else {
            setStatus(classTab)
        }
    }, [classTab])

    // Formatting date
    const formatDate = (dateString: string | any) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

        return formattedDate
    }

    // Filtering classes based on active cohort
    const [classActiveCohort, setClassActiveCohort] = useState<ClassroomMain[]>([]);
    useEffect(() => {
        if (staffActiveCohort && staffDetail) {
            const allClasses = classroom.filter((cls) => cls.cohortId._id === staffActiveCohort && cls.tutorId._id === staffDetail._id);
            setClassActiveCohort(allClasses);
        }
    }, [staffActiveCohort, staffDetail])

    // Displaying classes based on selected course
    const [selectedCourse, setSelectedCourse] = useState<string>('')
    const handleToDisplay = (arg: string) => {
        if (arg) {
            setSelectedCourse(arg)
        }
    }

    useEffect(() => {
        if (classActiveCohort.length > 0) {
            const getAcourse = classActiveCohort[0].courseId._id;
            setSelectedCourse(getAcourse);
        }
    }, [classActiveCohort]);

    // Setting classes to be displayed based on selected course and status
    const [classroomCourse, setClassroomCourse] = useState<ClassroomMain[]>([]);
    useEffect(() => {
        const classCourse = classActiveCohort.filter((classes) => classes.courseId._id === selectedCourse);

        if (classCourse.length > 0) {
            const classStatusDisplay = classCourse.filter((classes) => classes.status === status);
            setClassroomCourse(classStatusDisplay);
        }
    }, [classActiveCohort, selectedCourse, status]);

    // Pagination
    const [pageNumber, setPageNumber] = useState<number>(0)

    const classPerPage = 10;
    const pageVisited = pageNumber * classPerPage;

    const displayPrvClass = classroomCourse.slice(pageVisited, pageVisited + classPerPage).map((classes, ind) => {
        return (
            <tr key={classes._id} className='border-t border-shadow text-start'>
                <td className='py-3 block md:table-cell'>{classes.title}</td>
                <td className='py-3 block md:table-cell'>{classes.cohortId.cohortName}</td>
                <td className='py-3 block md:table-cell'>{formatDate(classes.date)}</td>
                <td className='py-3 block md:table-cell'>{classes.time}</td>
                <td className='py-3 block md:table-cell'>{classes.attendance.length}</td>
                <td className='py-3 block md:table-cell'>{classes.duration}</td>
                <Link href={`/dashboard/staff/classroom/classes/${classes._id}`} className='my-2 p-1 flex items-center gap-1 text-[12px] border border-accent text-accent h-fit w-fit rounded-md cursor-pointer'>
                    <IoEyeOutline />
                    <span>View</span>
                </Link>
            </tr>
        )
    })

    const changePage = ({ selected }: any) => {
        setPageNumber(selected)
    }

    return (
        <main className='w-full p-5'>
            <div className="academic">
                <div className="academics_list flex gap-5 w-full h-[60px] px-2 rounded-md overflow-x-scroll sm:overflow-hidden whitespace-nowrap sm:whitespace-normal">
                    {
                        Array.from(new Set(classActiveCohort.map((cal) => cal.courseId._id))).map((courseId) => {
                            const course = classActiveCohort.find((cal) => cal.courseId._id === courseId);

                            return course ? (
                                <div
                                    key={courseId}
                                    className={`${selectedCourse === courseId ? 'border-b-2 border-shadow text-shadow font-semibold' : ''} package text-shadow cursor-pointer h-full flex items-center gap-3`}
                                    onClick={() => handleToDisplay(courseId)}
                                >
                                    <span>{course.courseId.title}</span>
                                </div>
                            ) : null
                        })
                    }
                </div>
                <div className="academics_list flex gap-5 w-full h-[60px] px-2 rounded-md overflow-x-scroll sm:overflow-hidden whitespace-nowrap sm:whitespace-normal bg-lightSec">
                    {
                        statusTab.map((cal, ind) => (
                            <div
                                key={ind}
                                className={`${status === cal ? 'border-b-2 border-shadow text-shadow font-semibold' : ''} package text-shadow cursor-pointer h-full flex items-center gap-3`}
                                onClick={() => handleDisplayStatus(cal)}
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
                                <th className='text-start py-3 block md:table-cell'>Class title</th>
                                <th className='text-start py-3 block md:table-cell'>Cohort</th>
                                <th className='text-start py-3 block md:table-cell'>Date</th>
                                <th className='text-start py-3 block md:table-cell'>Time</th>
                                <th className='text-start py-3 block md:table-cell'>Attendance</th>
                                <th className='text-start py-3 block md:table-cell'>Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                classroomCourse.length > 0 ? displayPrvClass : <tr><td className='' colSpan={4}>No {status} class yet</td></tr>
                            }
                        </tbody>
                    </table>
                    <ReactPaginate
                        previousLabel='Previous'
                        nextLabel='Next'
                        breakLabel="..."
                        pageCount={Math.ceil(classroomCourse.length / classPerPage)}
                        onPageChange={changePage}
                        containerClassName='paginationBtn'
                        previousLinkClassName='prvBtn'
                        nextLinkClassName='nxtBtn'
                        disabledClassName='dsbBtn'
                        activeClassName='actBtn'
                    />
                </div>
            </div>
        </main>
    )
}

export default ClassesMain