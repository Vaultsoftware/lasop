'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { handleAssessment } from '@/store/dashMenu/dashStore';
import ProjectDet from '@/components/dashboardComp/studentComp/project/ProjectDet';
import { StudentDataMain } from '@/interfaces/interface';

interface PropsData {
    _id: string;
    title: string;
    duration: string;
    start: string;
    overview: string;
    objectives: string[];
    deliverables: string[];
    createdAt: string;
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
}[]

interface Props {
    props: PropsData;
}

function ProjectDetMain({ props }: Props) {
    const dispatch = useDispatch<AppDispatch>()

    // Formatting date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

        return formattedDate
    }

    const student = useSelector((state: RootState) => state.student.logDetails);
    const assDisplay = useSelector((state: RootState) => state.dashMenu.assessmentDet);

    const [studentSubmission, setStudentSubmission] = useState<Submission>();

    const fetchStudentSubmission = (data: Submission[]) => {
        if (data && student) {
            const dataSub = data.find((pro) => pro.studentId._id === student._id)

            setStudentSubmission(dataSub)
            dispatch(handleAssessment())
        }
    }

    return (
        <main className='w-full p-5'>
            <div className='p-2 border border-accent grid gap-2 rounded-md'>
                <div className='flex justify-between items-center'>
                    <div className='w-[70%]'>
                        <h3 className='text-shadow text-[12px] font-semibold'>Project title</h3>
                        <p className='text-[12px]'>{props.title}</p>
                    </div>
                    <div>
                        <button onClick={() => fetchStudentSubmission(props.submission)} className='px-2 py-1 bg-shadow text-secondary rounded-md w-fit text-[11px]'>Submit project</button>
                    </div>
                </div>
                <div className='flex gap-6 items-center'>
                    <div>
                        <h3 className='text-shadow text-[12px] font-semibold'>Project duration</h3>
                        <p className='text-[12px]'>{props.duration}</p>
                    </div>
                    <div>
                        <h3 className='text-shadow text-[12px] font-semibold'>Starts</h3>
                        <p className='text-[12px]'>{formatDate(props.start)}</p>
                    </div>
                </div>
                <div>
                    <h3 className='text-shadow text-[12px] font-semibold'>Project overview</h3>
                    <p className='text-[12px]'>{props.objectives}</p>
                </div>
                <div>
                    <h3 className='text-shadow text-[12px] font-semibold'>Key objectives:</h3>
                    <ol className='list-decimal pl-6'>
                        {
                            props.objectives.map((obj) => (
                                <li className='text-[12px]'>{obj}</li>
                            ))
                        }
                    </ol>
                </div>
                <div>
                    <h3 className='text-shadow text-[12px] font-semibold'>Deliverables:</h3>
                    <ol className='list-decimal pl-6'>
                        {
                            props.deliverables.map((del) => (
                                <li className='text-[12px]'>{del}</li>
                            ))
                        }
                    </ol>
                </div>
            </div>
            {assDisplay && <ProjectDet
                title={props.title}
                _id={props._id}
                instruction={props.overview}
                createdAt={props.createdAt}
                feedback={studentSubmission ? studentSubmission.feedback : ''}
                grade={studentSubmission ? studentSubmission.grade : ''}
                answer={studentSubmission ? studentSubmission.answer : ''}
            />}
        </main>
    )
}

export default ProjectDetMain