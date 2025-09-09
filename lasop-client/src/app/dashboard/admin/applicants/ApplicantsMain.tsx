'use client';

import React, { useState, useEffect } from 'react';
import { IoEyeOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import ApplicantDetails from '@/components/dashboardComp/adminComp/applicants/ApplicantDetails';
import { fetchStudentDetails } from '@/store/studentStore/studentStore';
import { useRouter } from 'next/navigation';
import { handleAppDet } from '@/store/dashMenu/dashStore';
import { StudentDataMain } from '@/interfaces/interface';
import ReactPaginate from 'react-paginate';

function ApplicantsMain() {
    // Displaying student on their courses
    const [courseId, setCourseId] = useState<string>('66cd6d560d14292ee2136134');
    const handleCourseId = (arg: string) => {
        setCourseId(arg);
    }

    const router = useRouter();

    // Fetching student and setting them on the course
    const courses = useSelector((state: RootState) => state.courses.courses)
    const studentAvail = useSelector((state: RootState) => state.student.student);
    const appDisplay = useSelector((state: RootState) => state.dashMenu.appDet)

    const [courseRegistered, setCourseRegistered] = useState<StudentDataMain[]>([]);

    useEffect(() => {
        const applicantData = studentAvail.filter((stud) => stud.status === 'applicant');

        const getApplicant = applicantData.filter((stud) => stud.program.courseId._id === courseId)
        setCourseRegistered(getApplicant);
    }, [studentAvail, courseId]);

    // Formatting date
    const formatDate = (dateString: string | any) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

        return formattedDate
    }

    // Getting student ID to display their details
    const [applicantId, setApplicantId] = useState<string>('');

    const handleApplicantsId = (arg: string) => {
        if (arg) {
            setApplicantId(arg);
            dispatch(handleAppDet())
        }
    }

    // Fetching and storing applicant details
    const dispatch = useDispatch<AppDispatch>();
    const [applicantDetail, setApplicantDetail] = useState<StudentDataMain | null>(null);
    const applicantData = useSelector((state: RootState) => state.student.studentDetails);

    useEffect(() => {
        if (applicantId.length > 0) {
            dispatch(fetchStudentDetails(applicantId))
        }
    }, [applicantId, dispatch])

    useEffect(() => {
        if (applicantData) {
            setApplicantDetail(applicantData)
        }
    }, [applicantData])

    // Pagination
    const [pageNumber, setPageNumber] = useState<number>(0);

    const applPage = 10;
    const pageVisited = pageNumber * applPage;

    const displayPrvPage = courseRegistered.slice(pageVisited, pageVisited + applPage).map((appl, ind) => {
        return (
            <tr key={appl._id} className='border-t border-shadow text-start block md:table-row mb-3 md:mb-0'>
                <td className='py-3 block md:table-cell'>{appl.firstName} {appl.lastName}</td>
                <td className='py-3 block md:table-cell'>
                    <span>{appl.program.courseId.title}</span>
                </td>
                <td className='py-3 block md:table-cell'>
                    <span>{appl.program.mode}</span>
                </td>
                <td className='py-3 block md:table-cell'>
                    <span>{appl.program.center.title}</span>
                </td>
                <td className='py-3 block md:table-cell'>{formatDate(appl.createdAt)}</td>
                <td onClick={() => appl._id ? handleApplicantsId(appl._id) : ''} className='my-2 p-1 flex items-center gap-1 text-[12px] border border-accent text-accent h-fit w-fit rounded-md cursor-pointer'>
                    <IoEyeOutline />
                    <span>View</span>
                </td>
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
                                className={`${courseId === cal._id ? 'border-b-2 border-shadow text-shadow font-semibold' : ''} package text-shadow cursor-pointer h-full flex items-center gap-3`}
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
                                courseRegistered.length > 0 ? displayPrvPage : <tr><td colSpan={4}>No Applicants available for selected course</td></tr>
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
            {
                appDisplay && <ApplicantDetails
                    studentId={applicantDetail?._id}
                    firstName={applicantDetail?.firstName}
                    lName={applicantDetail?.lastName}
                    contact={applicantDetail?.contact}
                    address={applicantDetail?.address}
                    sex={applicantDetail?.gender ?? 'N/A'} status={applicantDetail?.status}
                    regDate={formatDate(applicantDetail?.createdAt)}
                    cohort={applicantDetail?.program?.cohortId?.cohortName ?? 'N/A'}
                    center={applicantDetail?.program?.center?.title ?? 'N/A'}
                    mode={applicantDetail?.program?.mode ?? 'N/A'}
                    course={applicantDetail?.program?.courseId?.title ?? 'N/A'}
                    courseDuration={`${Math.floor(
                        (new Date(applicantDetail?.program.cohortId.endDate).getTime() -
                         new Date(applicantDetail?.program.cohortId.startDate).getTime()
                        ) / (1000 * 60 * 60 * 24 * 7)
                      )} weeks`}
                    started={applicantDetail?.program?.cohortId?.startDate ? formatDate(applicantDetail.program.cohortId.startDate) : 'N/A'}
                    tuition={applicantDetail?.program?.courseId?.price ?? 'N/A'}
                    feeBal='None'
                    dueDate='None'
                    id={applicantId}
                />
            }
        </main>
    )
}

export default ApplicantsMain