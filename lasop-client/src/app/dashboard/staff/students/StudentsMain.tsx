'use client';

import React, { useState, useEffect } from 'react';
import { setStaffStudentsSelectedCohort } from '@/store/filterStore/staffFilStore';
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { IoEyeOutline } from 'react-icons/io5';
import { StudentDataMain, CohortMain } from '@/interfaces/interface';
import ReactPaginate from 'react-paginate'

interface OtherInfo {
    fName: string;
    lName: string;
    contact: string;
    address: string;
}

interface OtherInfoData {
    id?: string;
    staffId: string;
    kin: OtherInfo;
    guarantor1: OtherInfo;
    guarantor2: OtherInfo;
}

interface CourseTutors {
    course: {
        _id: string;
        title: string;
        code: string;
        price: string;
        exams: string[];
    };
    center: {
        _id?: string;
        title: string;
    };
    mode: string;
    tutors: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        contact: string;
        address: string;
        dateOfEmploy: string;
        salary: string;
        password: string;
        otherInfo: OtherInfoData[];
        role: string;
        enrol: string;
        status: string;
        createdAt: string;
    };
}[];

function StudentsMain() {
    const staffDetail = useSelector((state: RootState) => state.staff.logDetails?._id);
    const staffActiveCohort = useSelector((state: RootState) => state.staffFilter.staffStudentsSelectedCohort);
    const cohort = useSelector((state: RootState) => state.cohort.cohort);
    const studentAvail = useSelector((state: RootState) => state.student.student);

    const dispatch = useDispatch<AppDispatch>()

    // Function for converting date to string
    const formatDate = (dateString: string | any) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

        return formattedDate
    }

    // Converting active cohort to get it full details
    const [convertCohort, setConvertCohort] = useState<CohortMain>();

    useEffect(() => {
        if (staffActiveCohort) {
            const findCohort = cohort.find((coh) => coh._id === staffActiveCohort)
            setConvertCohort(findCohort);
        }
    }, [staffActiveCohort])

    // Finding and storing tutor courses from active cohort
    const [staffActiveCohortCourses, setStaffActiveCohortCourses] = useState<CourseTutors[]>([])

    useEffect(() => {
        if (convertCohort && staffDetail) {
            const getRoom = convertCohort.courseTutors.filter((room) => room.tutors._id === staffDetail);
            setStaffActiveCohortCourses(getRoom);
        }
    }, [convertCohort, staffDetail])

    // Setting courses to be displayed
    const [selectedCourse, setSelectedCourse] = useState<string>('');

    const handleToDisplay = (arg: string) => {
        if (arg) {
            setSelectedCourse(arg)
        }
    }

    // Setting a default course
    useEffect(() => {
        if (staffActiveCohortCourses.length > 0 && staffActiveCohortCourses[0].course._id) {
            const getAcourse = staffActiveCohortCourses[0].course._id
            setSelectedCourse(getAcourse)
        }
    }, [staffActiveCohortCourses])

    // Getting students under active cohort taken by staff
    const [studentInActiveCohort, setStudentInActiveCohort] = useState<StudentDataMain[]>([]);

    useEffect(() => {
        if (staffActiveCohort) {
            const getStudent = studentAvail.filter((stu) => stu.program?.cohortId?._id === staffActiveCohort && stu.program.tutorId._id === staffDetail && (stu.status === 'student' || stu.status === 'graduate'));
            setStudentInActiveCohort(getStudent);
        }
    }, [staffActiveCohort])

    // Filtering students to their courses
    const [studentCourseRoom, setStudentCourseRoom] = useState<StudentDataMain[]>([]);

    useEffect(() => {
        if (studentInActiveCohort.length > 0) {
            const getStudent = studentInActiveCohort.filter((stu) => stu.program.courseId._id === selectedCourse)
            setStudentCourseRoom(getStudent)
        }
    }, [studentInActiveCohort, selectedCourse])

    // Pagination
    const [pageNumber, setPageNumber] = useState(0);

    const studentsPerPage = 10;
    const pageVisited = pageNumber * studentsPerPage;

    const displayStudent = studentCourseRoom.slice(pageVisited, pageVisited + studentsPerPage).map((coh, ind) => {
        return (
            <tr key={ind} className='border-t border-shadow text-start'>
                <td className='py-3 block md:table-cell'>{ind + 1}</td>
                <td className='py-3 block md:table-cell'>{coh.firstName} {coh.lastName}</td>
                <td className='py-3 block md:table-cell'>{coh.program.cohortId.cohortName}</td>
                <td className='py-3 block md:table-cell'>{formatDate(coh.createdAt)}</td>
                <Link href={`/dashboard/staff/students/${coh._id}`} className='my-2 p-1 flex items-center gap-1 text-[12px] border border-accent text-accent h-fit w-fit rounded-md cursor-pointer'>
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
                        Array.from(new Set(staffActiveCohortCourses.map((cal) => cal.course._id))).map((cour) => {
                            const course = staffActiveCohortCourses.find((cal) => cal.course._id === cour);
                            return course ? (
                                <div
                                    key={cour}
                                    className={`${selectedCourse === cour ? 'border-b-2 border-shadow text-shadow font-semibold' : ''} package text-shadow cursor-pointer h-full flex items-center gap-3`}
                                    onClick={() => handleToDisplay(cour)}
                                >
                                    <span>{course.course.title}</span>
                                </div>
                            ) : null
                        })
                    }
                </div>

                <div className="academic_cohort mt-4">
                    <table className='w-full border-b border-shadow'>
                        <thead>
                            <tr >
                                <th className='text-start py-3 block md:table-cell'>S/N</th>
                                <th className='text-start py-3 block md:table-cell'>NAME</th>
                                <th className='text-start py-3 block md:table-cell'>COHORT</th>
                                <th className='text-start py-3 block md:table-cell'>STARTED</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                studentCourseRoom.length > 0 ? displayStudent : <tr><td colSpan={4}>No students available</td></tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            <ReactPaginate
                previousLabel='Previous'
                nextLabel='Next'
                breakLabel="..."
                pageCount={Math.ceil(studentCourseRoom.length / studentsPerPage)}
                onPageChange={changePage}
                containerClassName='paginationBtn'
                previousLinkClassName='prvBtn'
                nextLinkClassName='nxtBtn'
                disabledClassName='dsbBtn'
                activeClassName='actBtn'
            />
        </main>
    )
}

export default StudentsMain