'use client';

import GradeAssessment from '@/components/dashboardComp/staffComp/assessment/GradeAssessment';
import React, { useState, useEffect } from 'react';
import { IoEyeOutline } from "react-icons/io5";
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { handleGrade } from '@/store/dashMenu/dashStore';
import GradeProject from '@/components/dashboardComp/staffComp/project/GradeProject';
import ReactPaginate from 'react-paginate';
import { StudentDataMain } from '@/interfaces/interface';

interface Props {
    projectId: string;
    cohortName: string;
    instruction: string;
    title: string;
    submission: {
        studentId: StudentDataMain;
        submitted: string;
        submissionDate: string;
        grade: string;
        answer: string;
        feedback: string;
        status: string
    }[];
}

interface Submission {
    studentId: StudentDataMain;
    submitted: string;
    submissionDate: string;
    grade: string;
    answer: string;
    feedback: string;
    status: string
}

function ProjectDetMain({ submission, cohortName, projectId, instruction, title }: Props) {
    const statusTab: string[] = ['graded', 'ungraded', 'current']

    const [status, setStatus] = useState<string>('ungraded')
    const [projectStudent, setProjectStudent] = useState<Submission[]>([]);

    const dispatch = useDispatch<AppDispatch>();
    const grading = useSelector((state: RootState) => state.dashMenu.openGrade);

    // function to display student based on status
    const handleDisplayStatus = (arg: string) => {
        setStatus(arg)
    }

    // Function for converting date to string
    const formatDate = (dateString: string | any) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

        return formattedDate
    }

    // Fetching projectment data based on selected status
    useEffect(() => {
        if (status === 'current') {
            setProjectStudent(submission)
        } else if (status === 'graded') {
            const student = submission.filter((sub) => sub.status === 'graded');
            setProjectStudent(student);
        }
        else {
            const student = submission.filter((sub) => sub.status === 'ungraded');
            setProjectStudent(student);
        }
    }, [status, submission])

    // Storing and fetching student submission data
    const [studentSubmission, setStudentSubmission] = useState<Submission>();

    const fetchStudentSubmission = (data: Submission) => {
        if (data) {
            setStudentSubmission(data);
            dispatch(handleGrade());
        }
    }

    // Pagination
    const [pageNumber, setPageNumber] = useState<number>(0);

    const assPage = 10;
    const pageVisited = pageNumber * assPage;

    const displayPrvPage = projectStudent.slice(pageVisited, pageVisited + assPage).map((coh, ind) => {
        return (
            <tr key={ind} className='border-t border-shadow text-start'>
                <td className='py-3 block md:table-cell'>{ind + 1}</td>
                <td className='py-3 block md:table-cell'>{coh.studentId.firstName} {coh.studentId.lastName}</td>
                <td className='py-3 block md:table-cell'>{cohortName}</td>
                <td className='py-3 block md:table-cell'>{coh.status}</td>
                <td className='py-3 block md:table-cell'>{formatDate(coh.submissionDate)}</td>
                <div onClick={() => fetchStudentSubmission(coh)} className='my-2 p-1 flex items-center gap-1 text-[12px] border border-accent text-accent h-fit w-fit rounded-md cursor-pointer'>
                    <IoEyeOutline />
                    <span>View</span>
                </div>
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
                                <th className='text-start py-3 block md:table-cell'>STUDENT NAME</th>
                                <th className='text-start py-3 block md:table-cell'>COHORT</th>
                                <th className='text-start py-3 block md:table-cell'>STATUS</th>
                                <th className='text-start py-3 block md:table-cell'>SUBMITTED</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                projectStudent.length > 0 ? displayPrvPage : <tr><td colSpan={4}>No {status} info available</td></tr>
                            }
                        </tbody>
                    </table>
                    <ReactPaginate
                        previousLabel='Previous'
                        nextLabel='Next'
                        breakLabel="..."
                        pageCount={Math.ceil(projectStudent.length / assPage)}
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
                grading && <GradeProject
                    assessmentId={projectId}
                    studentId={studentSubmission?.studentId._id || ''}
                    instruction={instruction} answer={studentSubmission?.answer || ''}
                    feedback={studentSubmission?.feedback || ''}
                    grade={studentSubmission?.grade || ''}
                    title={title}
                />
            }
        </main>
    )
}

export default ProjectDetMain