'use client';

import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { LuListTodo } from "react-icons/lu";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { FaUserLarge } from "react-icons/fa6";
import { MdClose } from "react-icons/md";
import { toast } from 'react-toastify';
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAssessment, fetchAssessmentDetail, postGrade } from '@/store/assessmentStore/assessmentStore';
import { handleGrade } from '@/store/dashMenu/dashStore';

interface Grade {
    assessmentId: string;
    studentId: string;
    grade: string;
    feedback: string;
}

interface ResponsePayload {
    message: string;
}

interface Props {
    assessmentId: string;
    studentId: string;
    instruction: string;
    answer: string;
    feedback: string;
    title: string;
    grade: string;
}

function GradeAssessment({ title, grade, assessmentId, studentId, instruction, answer, feedback }: Props) {
    const dispatch = useDispatch<AppDispatch>();
    const assessmentDetail = useSelector((state: RootState) => state.assessment.assessmentDetail)

    const studentSubmission = assessmentDetail?.submission.find((sub) => sub.studentId._id === studentId)

    const hasFetched = useRef(false)

    useEffect(() => {
        if(hasFetched.current) {
            dispatch(fetchAssessmentDetail(assessmentId))
            hasFetched.current = true;
        }
    }, [dispatch, assessmentId]);

    const [gradeBool, setGradeBool] = useState<boolean>(false);

    const handleGrading = () => {
        setGradeBool(!gradeBool);
    };

    const [gradeData, setGradeData] = useState<Grade>({
        assessmentId: assessmentId,
        studentId: studentId,
        grade: '',
        feedback: ''
    });

    const [error, setError] = useState<Partial<Grade>>({})

    const validate = () => {
        const newError: Partial<Grade> = {};

        if (!gradeData.grade) {
            newError.grade = 'Grade is required'
        }

        if (!gradeData.feedback) {
            newError.feedback = 'Feedback is required'
        }

        setError(newError);
        return Object.keys(newError).length === 0;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setGradeData((prevData) => ({
            ...prevData, [name]: value
        }))
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (validate()) {
            const response = await dispatch(postGrade(gradeData));

            if (postGrade.fulfilled.match(response)) {
                const payload = response.payload as ResponsePayload;
                toast.success(payload.message);

                setGradeData({
                    assessmentId: assessmentId,
                    studentId: studentId,
                    grade: '',
                    feedback: ''
                });
                dispatch(fetchAssessment())
                dispatch(fetchAssessmentDetail(assessmentId));
                setGradeBool(!gradeBool);
            }
            else {
                toast.error(response.error?.message);
            }
        }
    }

    return (
        <div className='applicant w-full h-[100vh] fixed top-0 left-0 z-30'>
            <div className='flex flex-col gap-3 w-[80vw] md:w-[30vw] h-full overflow-y-auto ml-auto bg-white relative'>
                <div onClick={() => dispatch(handleGrade())} className='text-white w-[25px] h-[25px] flex items-center justify-center bg-shadow rounded-md mt-1 ml-auto mr-2'>
                    <MdClose />
                </div>
                <div className='flex items-center gap-2 p-2 border-b'>
                    <div className='text-accent w-[25px] h-[25px] flex items-center justify-center bg-lightSec rounded-lg'>
                        <LuListTodo />
                    </div>
                    <h3 className='font-semibold text-[12px]'></h3>
                </div>
                <div className='grid gap-3 px-2'>
                    <div>
                        <div className='border border-shadow p-1 text-[12px] rounded-md'>
                            <h3 className='font-semibold'>{title}</h3>
                            <p>
                                {instruction}
                            </p>
                        </div>
                        <div className='text-[8px]'></div>
                    </div>
                    {
                        studentSubmission?.answer && (
                            <div className="receiver flex flex-row-reverse items-center gap-2 relative right-0">
                                <div className="icon w-[30px] h-[30px] rounded-full bg-slate-700 flex items-center justify-center text-[10px]">
                                    <FaUserLarge />
                                </div>
                                <div className="msg px-3 py-2 bg-shadow text-white rounded-md h-fit">
                                    <p className='text-[10px]'>{studentSubmission.answer}</p>
                                </div>
                            </div>
                        )
                    }
                    {
                        studentSubmission?.feedback.length && (
                            <div className="sender flex items-center gap-2 relative left-0">
                                <div className="icon w-[30px] h-[30px] rounded-full bg-slate-700 flex items-center justify-center text-[10px]">
                                    <FaUserLarge />
                                </div>
                                <div className='grid gap-1'>
                                    <div className="msg px-3 py-2 bg-secondary text-shadow rounded-md h-fit">
                                        <p className='text-[10px]'>Grade</p>
                                        <p className='text-[14px]'>{studentSubmission.grade}%</p>
                                    </div>
                                    <div className="msg px-3 py-2 bg-secondary text-shadow rounded-md h-fit">
                                        <p className='text-[10px]'>{studentSubmission.feedback}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
                <div onClick={handleGrading} className='mt-auto px-2 pb-2'>
                    <button className="h-[35px] w-full text-[14px] bg-accent text-white  rounded-md">Grade Assignment</button>
                </div>
                {
                    gradeBool && <div className='absolute w-full h-full left-0 top-0 flex items-center justify-center applicants px-6'>
                        <form onSubmit={handleSubmit} action="" className='w-full h-fit p-3 bg-white rounded-md'>
                            <div onClick={handleGrading} className='text-white w-[25px] h-[25px] flex items-center justify-center bg-shadow rounded-md mt-1 ml-auto'>
                                <MdClose />
                            </div>
                            <div className='w-full grid gap-3'>
                                <div className='w-full grid gap-2'>
                                    <label htmlFor="" className='text-[12px]'>Rate (0 - 100)</label>
                                    <input className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md' type="number" value={gradeData.grade} onChange={handleChange} name="grade" id="" />
                                </div>
                                <div className='w-full grid gap-2'>
                                    <label htmlFor="" className='text-[12px]'>Feedback</label>
                                    <textarea className='w-full h-[50px] px-2 outline-none border border-shadow text-[12px] rounded-md' value={gradeData.feedback} onChange={handleChange} name="feedback" id="" />
                                </div>
                            </div>
                            <div className='w-full pt-3'>
                                <button type='submit' className='w-full h-[35px] bg-accent text-cyan-50 rounded-md'>Grade</button>
                            </div>
                        </form>
                    </div>
                }
            </div>
        </div>
    )
}

export default GradeAssessment