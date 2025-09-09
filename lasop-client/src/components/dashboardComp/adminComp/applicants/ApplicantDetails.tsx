import React from 'react';
import { CiSquareCheck } from "react-icons/ci";
import { AiOutlineCloseSquare } from "react-icons/ai";
import { TbClockPause } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import { LuBookMarked } from "react-icons/lu";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch } from "react-redux";
import { fetchStudent, updateStudent } from '@/store/studentStore/studentStore';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { IoMdClose } from "react-icons/io";
import { handleAppDet } from '@/store/dashMenu/dashStore';

interface Props {
    studentId: string | any
    firstName: string | any;
    lName: string | any;
    contact: string | any;
    address: string | any;
    sex: string | any;
    status: string | any;
    regDate: string | any;
    cohort: string | any;
    center: string | any;
    mode: string | any;
    course: string | any;
    courseDuration: string | any;
    started: string | any;
    tuition: string | any;
    feeBal: string | any;
    dueDate: string | any;
    id: string | any;
}

interface StudentResponsePayload {
    message: string;
}

function ApplicantDetails({ studentId, firstName, lName, contact, address, sex, status, regDate, cohort, center, mode, course, courseDuration, started, tuition, feeBal, dueDate, id }: Props) {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    // Accepting student
    const acceptStudent = async () => {
        const updateData = { status: 'student' }

        try {
            const response = await dispatch(updateStudent({ updateData, studentId }))
            if (updateStudent.fulfilled.match(response)) {
                const payload = response.payload as StudentResponsePayload;
                toast.success(payload.message || 'Student data submitted successfully');
                dispatch(fetchStudent());
                dispatch(handleAppDet());
            }
            else {
                toast.error(response.error?.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Deny student
    const denyStudent = async () => {
        const updateData = { status: 'rejected' }

        try {
            const response = await dispatch(updateStudent({ updateData, studentId }))
            if (updateStudent.fulfilled.match(response)) {
                const payload = response.payload as StudentResponsePayload;
                toast.success('Applicant rejected successfully');
                dispatch(fetchStudent());
                dispatch(handleAppDet());
            }
            else {
                toast.error(response.error?.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='applicant flex items-center justify-center w-full h-[100vh] fixed top-0 left-0 z-30'>
            <div className='p-3 rounded-md bg-white w-[90%] md:w-[80%] lg:w-[60%] max-w-[800px] h-[600px] md:h-fit overflow-y-scroll md:overflow-y-visible'>
                <div onClick={() => dispatch(handleAppDet())} className='w-[30px] h-[30px] border border-slate-800 rounded-md flex items-center justify-center text-[14px] ml-auto mb-2 cursor-pointer'>
                    <IoMdClose />
                </div>
                <div className='flex flex-col md:flex-row justify-between gap-5 pb-3 border-b border-secondary'>
                    <h3 className='font-bold text-[16px] md:text-[18px]'>Applicant Information</h3>
                    <div className='flex gap-3 items-center'>
                        <div onClick={acceptStudent} className='cursor-pointer flex items-center gap-1 text-[12px] px-3 py-1 bg-accent text-lightSec rounded-md'>
                            <CiSquareCheck />
                            <span>Accept</span>
                        </div>
                        {/* <div className='cursor-pointer flex items-center gap-1 text-[12px] px-3 py-1 border border-accent text-accent rounded-md'>
                            <TbClockPause />
                            <span>Defer</span>
                        </div> */}
                        <div onClick={denyStudent} className='cursor-pointer flex items-center gap-1 text-[12px] px-3 py-1 border border-red-600 text-red-600 rounded-md'>
                            <AiOutlineCloseSquare />
                            <span>Deny</span>
                        </div>
                    </div>
                </div>

                <div className='grid gap-5'>
                    <div>
                        <div className='flex gap-1 items-center mb-3'>
                            <div className='flex items-center gap-2 w-fit'>
                                <CgProfile />
                                <h3 className='text-[14px] font-semibold'>PERSONAL INFORMATION</h3>
                            </div>
                            <div className='h-[1px] w-full bg-black'></div>
                        </div>
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                            <div className='grid gap-3 w-full'>
                                <div>
                                    <h3 className='text-[12px] font-semibold'>Name</h3>
                                    <p className='text-[14px] font-bold'>{firstName} {lName}</p>
                                </div>
                                <div>
                                    <h3 className='text-[12px] font-semibold'>Phone number</h3>
                                    <p className='text-[14px] font-bold'>{contact}</p>
                                </div>
                                <div>
                                    <h3 className='text-[12px] font-semibold'>Address</h3>
                                    <p className='text-[14px] font-bold'>{address}</p>
                                </div>
                            </div>
                            <div className='grid gap-3 w-full'>
                                <div>
                                    <h3 className='text-[12px] font-semibold'>Sex</h3>
                                    <p className='text-[14px] font-bold'>{sex}</p>
                                </div>
                                <div>
                                    <h3 className='text-[12px] font-semibold'>Status</h3>
                                    <p className='text-[14px] font-bold'>{status}</p>
                                </div>
                                <div>
                                    <h3 className='text-[12px] font-semibold'>Registration date</h3>
                                    <p className='text-[14px] font-bold'>{regDate}</p>
                                </div>
                            </div>
                            <div className='grid gap-3 w-full'>
                                <div>
                                    <h3 className='text-[12px] font-semibold'>Cohort</h3>
                                    <p className='text-[14px] font-bold'>{cohort}</p>
                                </div>
                                <div>
                                    <h3 className='text-[12px] font-semibold'>Center</h3>
                                    <p className='text-[14px] font-bold'>{center}</p>
                                </div>
                                <div>
                                    <h3 className='text-[12px] font-semibold'>Mode of study</h3>
                                    <p className='text-[14px] font-bold'>{mode}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='flex gap-1 items-center mb-3'>
                            <div className='flex items-center gap-2 w-fit'>
                                <LuBookMarked />
                                <h3 className='text-[14px] font-semibold'>COURSE INFORMATION</h3>
                            </div>
                            <div className='h-[1px] w-full bg-black'></div>
                        </div>
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                            <div className='grid gap-3 w-full'>
                                <div>
                                    <h3 className='text-[12px] font-semibold'>Course of study</h3>
                                    <p className='text-[14px] font-bold'>{course}</p>
                                </div>
                                <div>
                                    <h3 className='text-[12px] font-semibold'>Course duration</h3>
                                    <p className='text-[14px] font-bold'>{courseDuration}</p>
                                </div>
                                <div>
                                    <h3 className='text-[12px] font-semibold'>Started</h3>
                                    <p className='text-[14px] font-bold'>{started}</p>
                                </div>
                            </div>
                            <div className='grid gap-3 w-full'>
                                <div>
                                    <h3 className='text-[12px] font-semibold'>Tuition fee</h3>
                                    <p className='text-[14px] font-bold'>{tuition}</p>
                                </div>
                                <div>
                                    <h3 className='text-[12px] font-semibold'>Fee balance</h3>
                                    <p className='text-[14px] font-bold'>{feeBal}</p>
                                </div>
                                <div>
                                    <h3 className='text-[12px] font-semibold'>Due date</h3>
                                    <p className='text-[14px] font-bold'>{dueDate}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ApplicantDetails