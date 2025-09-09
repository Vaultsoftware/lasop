'use client';

import { RootState } from '@/store/store';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { CohortMain, ClassroomMain, StudentDataMain } from '@/interfaces/interface';
import ReactPaginate from 'react-paginate'

interface Props {
    studentData: StudentDataMain
}
function ClassroomInfo({ studentData }: Props) {
    // Toggling status function
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

    useEffect(() => {
        const studentCohort = cohort.find((coh) => coh._id === studentData.program.cohortId._id && coh.courseTutors.some((ct) => ct.course._id === studentData.program.courseId._id && ct.center._id === studentData.program.center._id && ct.mode === studentData.program.mode && ct.tutors._id === studentData.program.tutorId._id));

        if (studentCohort) {
            setStudentCohortData(studentCohort);
        }
    }, [cohort, studentData])

    useEffect(() => {
        if (studentCohortData) {
            const classroomCohort = classroom.filter((cls) => cls.cohortId._id === studentCohortData?._id && studentData.program.courseId._id === cls.courseId._id && studentData.program.center._id === cls.center._id && studentData.program.mode === cls.mode && studentData.program.tutorId._id === cls.tutorId._id)

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
            </tr>
        )
    })

    const changePage = ({ selected }: any) => {
        setPageNumber(selected)
    }
    return (
        <div className="academic">
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
        </div>
    )
}

export default ClassroomInfo