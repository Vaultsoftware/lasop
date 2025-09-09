'use client';

import React, { useEffect, useRef, useState } from 'react';
import { LuListTodo } from "react-icons/lu";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { FaUserLarge } from "react-icons/fa6";
import { MdClose } from "react-icons/md";
import { toast } from 'react-toastify';
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { handleAssessment } from '@/store/dashMenu/dashStore';
import { fetchProject, fetchProjectDetail, postSubmissionPro } from '@/store/projectStore/projectStore';

interface Props {
    _id: string;
    title: string;
    instruction: string;
    createdAt: string;
    grade: string;
    answer: string;
    feedback: string;
}

interface Answer {
    projectId: string;
    studentId: string;
    answer: string;
}

interface ResponsePayload {
    message: string;
}

function ProjectDet({ _id, title, instruction, createdAt, feedback, grade, answer }: Props) {
    const student = useSelector((state: RootState) => state.student.logDetails?._id);
    const projectDetail = useSelector((state: RootState) => state.project.projectDetail)
    const dispatch = useDispatch<AppDispatch>()

    const studentSubmission = projectDetail?.submission.find((sub) => sub.studentId._id === student)

    const hasFetched = useRef(false);

    useEffect(() => {
        if (!hasFetched.current) {
            dispatch(fetchProjectDetail(_id));
            hasFetched.current = true;
        }
    }, [dispatch, _id]);

    // Formatting date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

        return formattedDate
    }

    const [projectAnswer, setProjectAnswer] = useState<Answer>({
        projectId: _id,
        studentId: student || '',
        answer: ''
    });

    const validate = () => {
        if (!projectAnswer.answer.trim()) {
            toast.error('Answer is required')

            return false;
        }

        return true;
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setProjectAnswer((prevData) => ({
            ...prevData, [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            if(studentSubmission?.status !== 'inactive') {
                const response = await dispatch(postSubmissionPro(projectAnswer))
                if (postSubmissionPro.fulfilled.match(response)) {
    
                    const payload = response.payload as ResponsePayload;
                    toast.success(payload.message);
    
                    setProjectAnswer({
                        projectId: _id,
                        studentId: student || '',
                        answer: ''
                    });
                    dispatch(fetchProject());
                    dispatch(fetchProjectDetail(_id));
                }
                else {
                    toast.error(response.error?.message);
                }
            } else {
                toast.info('Project is overdue and submission is no longer accepted')
            }
        };
    };

    return (
        <div className='applicant w-full h-[100vh] fixed top-0 left-0 z-30'>
            <div className='flex flex-col gap-3 w-[80vw] md:w-[30vw] h-full overflow-y-auto ml-auto bg-white'>
                <div onClick={() => dispatch(handleAssessment())} className='text-white w-[25px] h-[25px] flex items-center justify-center bg-shadow rounded-md mt-1 ml-auto mr-2'>
                    <MdClose />
                </div>
                <div className='flex items-center gap-2 p-2 border-b'>
                    <div className='text-accent w-[25px] h-[25px] flex items-center justify-center bg-lightSec rounded-lg'>
                        <LuListTodo />
                    </div>
                    <h3 className='font-semibold text-[12px]'>{title}</h3>
                </div>
                <div className='grid gap-3 px-2'>
                    <div>
                        <div className='border border-shadow p-1 text-[12px] rounded-md'>
                            <h3 className='font-semibold'>Question</h3>
                            <p>
                                {instruction}
                            </p>
                        </div>
                        <div className='text-[8px]'>{formatDate(createdAt)} </div>
                    </div>
                    {
                        studentSubmission?.answer === undefined || studentSubmission?.feedback === '' ? <div>No message yet</div> : <>
                            <div className="receiver flex flex-row-reverse items-center gap-2 relative right-0">
                                <div className="icon w-[30px] h-[30px] rounded-full bg-slate-700 flex items-center justify-center text-[10px]">
                                    <FaUserLarge />
                                </div>
                                <div className="msg px-3 py-2 bg-shadow text-white rounded-md h-fit">
                                    <p className='text-[10px]'>{studentSubmission.answer}</p>
                                </div>
                            </div>
                        </>
                    }
                    {
                        studentSubmission?.feedback === undefined || studentSubmission?.feedback === '' ? <div></div> : <>
                            <div className="sender flex items-center gap-2 relative left-0">
                                <div className="icon w-[30px] h-[30px] rounded-full bg-slate-700 flex items-center justify-center text-[10px]">
                                    <FaUserLarge />
                                </div>
                                <div className='grid gap-1'>
                                    <div className="msg px-3 py-2 bg-secondary text-shadow rounded-md h-fit">
                                        <p className='text-[14px] font-semibold'>{studentSubmission.grade}%</p>
                                    </div>
                                    <div className="msg px-3 py-2 bg-secondary text-shadow rounded-md h-fit">
                                        <p className='text-[10px]'>{studentSubmission.feedback}</p>
                                    </div>
                                </div>
                            </div>
                        </>

                    }
                </div>
                <div className='mt-auto px-2 pb-2'>
                    {
                        answer === undefined || answer === '' ? <>
                            <form onSubmit={handleSubmit} className='w-full'>
                                <div className='w-full'>
                                    <textarea
                                        className='w-full text-[12px] h-20 p-1 bg-lightSec rounded-md outline-none'
                                        name="answer"
                                        placeholder='Your answer'
                                        value={projectAnswer.answer}
                                        onChange={handleChange}
                                    ></textarea>
                                </div>
                                <button type="submit" className="h-[35px] flex items-center justify-center gap-3 bg-accent text-white rounded-md w-full">
                                    <IoPaperPlaneOutline />
                                    <span className='text-[14px]'>Submit Assignment</span>
                                </button>
                            </form>
                        </> : <button disabled className="h-[35px] w-full flex items-center justify-center gap-3 bg-gray-300 text-gray-500 rounded-md">
                            <IoPaperPlaneOutline />
                            <span className='text-[14px]'>Assignment submitted</span>
                        </button>
                    }
                </div>
            </div>
        </div>
    )
}

export default ProjectDet