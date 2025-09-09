'use client';
import { AppDispatch, RootState } from '@/store/store';
import React, { useEffect, useState } from 'react';
import { IoEyeOutline } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { handleAssessment } from '@/store/dashMenu/dashStore';
import { fetchAssessmentDetail } from '@/store/assessmentStore/assessmentStore';
import { CohortMain, AssessmentMain, StudentDataMain } from '@/interfaces/interface';
import ReactPaginate from 'react-paginate';
import AssessmentDet from '../../studentComp/assessment/AssessmentDet'
import ViewAssessInfo from './ViewAssessInfo';

interface Submission {
    studentId: StudentDataMain;
    submitted: string;
    submissionDate: string;
    grade: string;
    answer: string;
    feedback: string;
    status: string
}

interface Props {
    studentData: StudentDataMain
}

function AssessInfo({ studentData }: Props) {
    const statusTab: string[] = ['graded', 'ungraded', 'current'];

    // function to display student based on status
    const [status, setStatus] = useState<string>('current')
    const handleDisplayStatus = (arg: string) => {
        setStatus(arg)
    }

    // Dispatch functionality
    const dispatch = useDispatch<AppDispatch>()

    const [studentCohortData, setStudentCohortData] = useState<CohortMain | null>(null);
    const [getAssessmentCoh, setAssessmentCoh] = useState<AssessmentMain[]>([]);
    const [studentAssessment, setStudentAssessment] = useState<AssessmentMain[]>([]);

    const assessment = useSelector((state: RootState) => state.assessment.assessment)
    const cohort = useSelector((state: RootState) => state.cohort.cohort);
    const student = useSelector((state: RootState) => state.student.logDetails);

    useEffect(() => {
        const studentCohort = cohort.find((coh) => coh._id === studentData.program.cohortId._id && coh.courseTutors.some((ct) => ct.course._id === studentData.program.courseId._id && ct.center._id === studentData.program.center._id && ct.mode === studentData.program.mode && ct.tutors._id === studentData.program.tutorId._id));

        if (studentCohort) {
            setStudentCohortData(studentCohort);
        }
    }, [cohort, student])

    useEffect(() => {
        if (studentCohortData) {
            const assessmentCohort = assessment.filter((cls) => cls.cohortId._id === studentCohortData?._id && studentData.program.courseId._id === cls.courseId._id && studentData.program.center._id === cls.center._id && studentData.program.mode === cls.mode && studentData.program.tutorId._id === cls.tutorId._id)

            if (assessmentCohort) {
                setAssessmentCoh(assessmentCohort)
            }
        }
    }, [studentCohortData, assessment])

    // Fetching assessment data based on selected status
    useEffect(() => {
        if (getAssessmentCoh.length > 0) {
            if (status === 'current') {
                setStudentAssessment(getAssessmentCoh);
            } else if (status === 'graded') {
                const asses = getAssessmentCoh.filter((ass) => ass.submission.some((sub) => sub.status === 'graded' && sub.studentId._id === studentData._id))
                setStudentAssessment(asses);
            }
            else {
                const asses = getAssessmentCoh.filter((ass) => ass.submission.some((sub) => sub.status === 'ungraded' && sub.studentId._id === studentData._id))
                setStudentAssessment(asses);
            }
        }
    }, [status, getAssessmentCoh])

    // Formatting date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

        return formattedDate
    }

    // Fetching and storing assessment details
    const [assessmentId, setAssessmentId] = useState<string>('');
    const [assessmentDetail, setAssessmentDetail] = useState<AssessmentMain | null>(null)

    const assessmentData = useSelector((state: RootState) => state.assessment.assessmentDetail)
    const assDisplay = useSelector((state: RootState) => state.dashMenu.assessmentDet)

    const handleAssessmentId = (arg: string) => {
        if (arg) {
            setAssessmentId(arg);
            dispatch(handleAssessment())
        }
    }

    useEffect(() => {
        if (assessmentId.length > 0) {
            dispatch(fetchAssessmentDetail(assessmentId))
        }
    }, [assessmentId, dispatch])

    useEffect(() => {
        if (assessmentData) {
            setAssessmentDetail(assessmentData)
        }
    }, [assessmentData])

    // Storing and fetching student submission data
    const [studentSubmission, setStudentSubmission] = useState<Submission>();

    const fetchStudentSubmission = (data: any, arg: string) => {
        if (data && arg) {
            const dataSub = data.find((coh: any) => coh.studentId._id === student?._id)
            setStudentSubmission(dataSub);
            handleAssessmentId(arg)
        }
    }

    // Pagination
    const [pageNumber, setPageNumber] = useState<number>(0);

    const assPage = 10;
    const pageVisited = pageNumber * assPage;

    const displayPrvPage = studentAssessment.slice(pageVisited, pageVisited + assPage).map((coh, ind) => {
        return (
            <tr key={ind} className='border-t border-shadow text-start'>
                <td className='py-3 block md:table-cell'>{ind + 1}</td>
                <td className='py-3 block md:table-cell'>{coh.title}</td>
                <td className='py-3 block md:table-cell'>{formatDate(coh.createdAt)}</td>
                <td className='py-3 block md:table-cell'>{formatDate(coh.dueDate)}</td>
                <td onClick={() => fetchStudentSubmission(coh.submission, coh._id)} className='my-2 p-1 flex items-center gap-1 text-[12px] border border-accent text-accent h-fit w-fit rounded-md cursor-pointer'>
                    <IoEyeOutline />
                    <span>View</span>
                </td>
            </tr>
        )
    })

    const changePage = ({ selected }: any) => {
        setPageNumber(selected)
    }

    return (
        <div className="academic">
            <div className="academics_list flex gap-5 w-full h-[60px] px-2 rounded-md overflow-x-scroll sm:overflow-hidden whitespace-nowrap sm:whitespace-normal">
                {
                    statusTab.map((stat, id) => (
                        <div
                            key={id}
                            className={`${status === stat ? 'border-b-2 border-shadow text-shadow font-semibold' : ''} package text-shadow cursor-pointer h-full flex items-center gap-3`}
                            onClick={() => handleDisplayStatus(stat)}
                        >
                            <span>{stat}</span>
                        </div>
                    ))
                }
            </div>

            <div className="academic_cohort mt-4">
                <table className='w-full border-b border-shadow'>
                    <thead>
                        <tr >
                            <th className='text-start py-3 block md:table-cell'>S/N</th>
                            <th className='text-start py-3 block md:table-cell'>TITLE</th>
                            <th className='text-start py-3 block md:table-cell'>CREATED</th>
                            <th className='text-start py-3 block md:table-cell'>DUE DATE</th>
                            <th className='text-start py-3 block md:table-cell'>STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            studentAssessment.length > 0 ? displayPrvPage : <tr><td colSpan={4}>No {status}  assessment at the moment</td></tr>
                        }
                    </tbody>
                </table>
                <ReactPaginate
                    previousLabel='Previous'
                    nextLabel='Next'
                    breakLabel="..."
                    pageCount={Math.ceil(studentAssessment.length / assPage)}
                    onPageChange={changePage}
                    containerClassName='paginationBtn'
                    previousLinkClassName='prvBtn'
                    nextLinkClassName='nxtBtn'
                    disabledClassName='dsbBtn'
                    activeClassName='actBtn'
                />
            </div>
            {
                assDisplay && <ViewAssessInfo
                    _id={assessmentDetail?._id as string}
                    title={assessmentDetail?.title as string}
                    instruction={assessmentDetail?.instruction as string}
                    createdAt={assessmentDetail?.createdAt as string}
                    grade={studentSubmission?.grade as string}
                    feedback={studentSubmission?.feedback as string}
                    answer={studentSubmission?.answer as string}
                />
            }
        </div>
    )
}

export default AssessInfo