'use client';

import React, { useState, useEffect } from 'react';
import { IoEyeOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import ApplicantDetails from '@/components/dashboardComp/adminComp/applicants/ApplicantDetails';
import { fetchStudentDetails, updateStudent } from '@/store/studentStore/studentStore';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { StudentDataMain } from '@/interfaces/interface';
import Link from 'next/link';
import ReactPaginate from 'react-paginate';

interface StudentResponsePayload {
    message: string;
}

function StudentsMain() {
    // Displaying student on their courses
    const [courseId, setCourseId] = useState<string>('66cd6d560d14292ee2136134');
    const handleCourseId = (arg: string) => {
        setCourseId(arg);
    }

    // Fetching student and setting them on the course
    const courses = useSelector((state: RootState) => state.courses.courses)
    const studentAvail = useSelector((state: RootState) => state.student.student);

    const [courseRegistered, setCourseRegistered] = useState<StudentDataMain[]>([]);

    useEffect(() => {
        const studentData = studentAvail.filter((stud) => stud.status === 'student');

        const getStudent = studentData.filter((stud) => stud.program.courseId._id === courseId)
        setCourseRegistered(getStudent);
    }, [studentAvail, courseId]);

    // Formatting date
    const formatDate = (dateString: string | any) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

        return formattedDate
    }

    // Pagination
    const [pageNumber, setPageNumber] = useState<number>(0);

    const applPage = 10;
    const pageVisited = pageNumber * applPage;

    const displayPrvPage = courseRegistered.slice(pageVisited, pageVisited + applPage).map((coh, ind) => {
        return (
            <tr key={coh._id} className='border-t border-shadow text-start block md:table-row mb-3 md:mb-0'>
                <td className='py-3 block md:table-cell'>{coh.firstName} {coh.lastName}</td>
                <td className='py-3 block md:table-cell'>
                    <span>{coh.program.courseId.title}</span>
                </td>
                <td className='py-3 block md:table-cell'>
                    <span>{coh.program.mode}</span>
                </td>
                <td className='py-3 block md:table-cell'>
                    <span>{coh.program.center.title}</span>
                </td>
                <td className='py-3 block md:table-cell'>{formatDate(coh.createdAt)}</td>
                <Link href={`/dashboard/admin/students/${coh._id}`} className='my-2 p-1 flex items-center gap-1 text-[12px] border border-accent text-accent h-fit w-fit rounded-md cursor-pointer'>
                    <IoEyeOutline />
                    <span>View</span>
                </Link>
            </tr>
        )
    })

    const changePage = ({ selected }: any) => {
        setPageNumber(selected)
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return (
        <main className='w-full p-5'>
            <div className="academic">
                <div className="academics_list flex items-center gap-5 border-b w-full h-[60px] rounded-md overflow-x-scroll scrollbar-thin whitespace-nowrap">
                    {
                        courses.map((cal) => (
                            <div
                                key={cal._id}
                                className={`${courseId === cal._id ? 'border-b-2 border-shadow text-shadow font-semibold' : ''}package text-shadow cursor-pointer h-full flex items-center gap-3`}
                                onClick={() => handleCourseId(cal._id)}
                            >
                                <span>{cal.title}</span>
                            </div>
                        ))
                    }
                </div>

                <div className="academic_cohort mt-4">
                    <table className='w-full border-b border-shadow'>
                        <thead>
                            <tr className='border-t border-shadow text-start block md:table-row mb-3 md:mb-0'>
                                <th className='text-start py-3 block md:table-cell'>NAME</th>
                                <th className='text-start py-3 block md:table-cell'>COURSE</th>
                                <th className='text-start py-3 block md:table-cell'>MODE</th>
                                <th className='text-start py-3 block md:table-cell'>CENTER</th>
                                <th className='text-start py-3 block md:table-cell'>DATE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                courseRegistered.length > 0 ? displayPrvPage : <tr><td colSpan={4}>No Students available for selected course</td></tr>
                            }
                        </tbody>
                    </table>
                    <ReactPaginate
                        previousLabel='Previous'
                        nextLabel='Next'
                        breakLabel="..."
                        pageCount={Math.ceil(courseRegistered.length / applPage)}
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

export default StudentsMain