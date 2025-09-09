'use client';

import { calendar } from '@/data/data';
import React, { useState, useEffect } from 'react';
import { IoEyeOutline } from "react-icons/io5";
import { GoDot } from "react-icons/go";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Link from 'next/link';
import { CohortMain, ProjectMain } from '@/interfaces/interface';
import ReactPaginate from 'react-paginate';

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

function ProjectMainPage() {
    const staffDetail = useSelector((state: RootState) => state.staff.logDetails);
    const project = useSelector((state: RootState) => state.project.project);

    const staffActiveCohort = useSelector((state: RootState) => state.staffFilter.staffProjectSelectedCohort);
    const cohort = useSelector((state: RootState) => state.cohort.cohort);

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
            const getRoom = convertCohort.courseTutors.filter((room) => room.tutors._id === staffDetail._id);
            setStaffActiveCohortCourses(getRoom);
        }
    }, [convertCohort, staffDetail])

    // Function for displaying selected course project data
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

    // Filtering project data based on active cohort
    const [projectInActiveCohort, setProjectInActiveCohort] = useState<ProjectMain[]>([]);

    useEffect(() => {
        if (staffActiveCohort && project.length > 0) {
            const getproject = project.filter((ass) => ass.cohortId._id === staffActiveCohort && ass.tutorId._id === staffDetail?._id);
            setProjectInActiveCohort(getproject);
        }
    }, [staffActiveCohort, project, staffDetail]);

    // Setting project to their courses
    const [projectCourseRoom, setProjectCourseRoom] = useState<ProjectMain[]>([]);

    useEffect(() => {
        if (projectInActiveCohort.length > 0) {
            const getprojectCourse = projectInActiveCohort.filter((ass) => ass.courseId._id === selectedCourse);
            setProjectCourseRoom(getprojectCourse);
        }
    }, [projectInActiveCohort, selectedCourse])

    // Pagination
    const [pageNumber, setPageNumber] = useState<number>(0);

    const assPage = 10;
    const pageVisited = pageNumber * assPage;

    const displayPrvPage = projectCourseRoom.slice(pageVisited, pageVisited + assPage).map((coh, ind) => {
        return (
            <tr key={ind} className='border-t border-shadow text-start'>
                <td className='py-3 block md:table-cell'>{ind + 1}</td>
                <td className='py-3 block md:table-cell'>{coh.title}</td>
                <td className='py-3 block md:table-cell'>{coh.cohortId.cohortName}</td>
                <td className='py-3 block md:table-cell'>{coh.submission.length}</td>
                <td className='py-3 block md:table-cell'>{formatDate(coh.createdAt)}</td>
                <td className='py-3 block md:table-cell'>{formatDate(coh.dueDate)}</td>
                <Link href={`/dashboard/staff/projects/${coh._id}`} className='my-2 p-1 flex items-center gap-1 text-[12px] border border-accent text-accent h-fit w-fit rounded-md cursor-pointer'>
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
                                <th className='text-start py-3 block md:table-cell'>TITLE</th>
                                <th className='text-start py-3 block md:table-cell'>COHORT</th>
                                <th className='text-start py-3 block md:table-cell'>SUBMISSION</th>
                                <th className='text-start py-3 block md:table-cell'>CREATED</th>
                                <th className='text-start py-3 block md:table-cell'>DUE DATE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                projectCourseRoom.length > 0 ? displayPrvPage : <tr><td colSpan={4}>No Project available</td></tr>
                            }
                        </tbody>
                    </table>
                    <ReactPaginate
                        previousLabel='Previous'
                        nextLabel='Next'
                        breakLabel="..."
                        pageCount={Math.ceil(projectCourseRoom.length / assPage)}
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

export default ProjectMainPage