'use client';

import React, { useEffect, useState, FormEvent } from 'react';
import { CiCircleInfo } from "react-icons/ci";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchClassroom, fetchClassroomDetail, updateClassroom } from '@/store/classroomStore/classroomStore';
import { MdClose } from "react-icons/md";
import { handleClassStatus } from '@/store/dashMenu/dashStore';
import { toast } from 'react-toastify';
import { ClassroomMain } from '@/interfaces/interface';

interface Props {
    classId: string;
    status: string;
}

interface ClassroomResponsePayload {
    message: string;
}

function UpdateClassStatus({ classId, status }: Props) {
    const dispatch = useDispatch<AppDispatch>();
    const classroom = useSelector((state: RootState) => state.classroom.classroom);

    const [classDetail, setClassDetail] = useState<ClassroomMain>()
    useEffect(() => {
        if(classId && classroom.length > 0) {
            const classDet = classroom.find((cls) => cls._id === classId)
            setClassDetail(classDet)
        }
    }, [classId, classroom]);
    console.log(classDetail);


    const next = ['completed', 'reschedule', 'cancelled'];
    const rescheduled = ['completed', 'next', 'cancelled'];

    const [statusArray, setStatusArray] = useState<string[]>([]);
    const [update, setUpdate] = useState<boolean>(true);

    useEffect(() => {
        if (status === 'next') {
            setStatusArray(next);
        } else if (status === 'rescheduled') {
            setStatusArray(rescheduled);
        } else {
            setStatusArray([]);
            setUpdate(false);
        }
    }, [status]);

    const [selectStatus, setSelectStatus] = useState<string>('completed');

    const handleSelectStatus = (arg: string) => {
        setSelectStatus(arg);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const classData = { status: selectStatus };

        try {
            if(classData.status === 'cancelled') {
                const response = await dispatch(updateClassroom({ classId, classData }));
                if (updateClassroom.fulfilled.match(response)) {
                    const payload = response.payload as ClassroomResponsePayload;
                    toast.success(payload.message || 'Classroom status updated successfully');
                    dispatch(fetchClassroom());
                    dispatch(handleClassStatus())
                } else {
                    toast.error(response.error?.message);
                }
            }
            else if(classData.status === 'completed') {
                if(classDetail?.startClass === true) {
                    const response = await dispatch(updateClassroom({ classId, classData }));
                    if (updateClassroom.fulfilled.match(response)) {
                        const payload = response.payload as ClassroomResponsePayload;
                        toast.success(payload.message || 'Classroom status updated successfully');
                        dispatch(fetchClassroom());
                        dispatch(handleClassStatus())
                    } else {
                        toast.error(response.error?.message);
                    }
                }
                else {
                    toast.error(`You can't mark class completed when it didn't start`)
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const [rescheduleData, setRescheduleData] = useState({
        date: '',
        time: '',
        status: 'rescheduled'
    });

    const validate = () => {
        if (!rescheduleData.date.trim()) {
            toast.error('Please enter date for rescheduling');
            return false;
        }
        if (!rescheduleData.time.trim()) {
            toast.error('Please enter time for rescheduling');
            return false;
        }
        return true;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRescheduleData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleRescheduleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (validate()) {
            try {
                const response = await dispatch(updateClassroom({ classId, classData: rescheduleData }));
                if (updateClassroom.fulfilled.match(response)) {
                    const payload = response.payload as ClassroomResponsePayload;
                    toast.success(payload.message || 'Classroom status updated successfully');
                    dispatch(fetchClassroom());
                } else {
                    toast.error(response.error?.message);
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <div className='applicant flex items-center justify-center w-full h-[100vh] fixed top-0 left-0 z-30'>
            {update ? (
                <div className='w-[300px] h-fit p-2 bg-white rounded-md'>
                    <div onClick={() => dispatch(handleClassStatus())} className='w-[25px] h-[25px] flex items-center justify-center text-cyan-100 bg-accent ml-auto rounded-sm mr-3 mb-2'>
                        <MdClose />
                    </div>
                    <div className='flex items-center justify-center gap-2'>
                        {statusArray.length > 0 &&
                            statusArray.map((item) => (
                                <div
                                    key={item}
                                    onClick={() => handleSelectStatus(item)}
                                    className={`w-fit p-2 text-[12px] border border-shadow text-center cursor-pointer ${selectStatus === item ? 'bg-accent text-cyan-50' : ''
                                        } rounded-md`}
                                >
                                    {item}
                                </div>
                            ))}
                    </div>
                    <div>
                        {['completed', 'next', 'cancelled'].includes(selectStatus) ? (
                            <form onSubmit={handleSubmit}>
                                <div className='w-full grid gap-3'>
                                    <div className='w-full flex items-center gap-2 mt-3'>
                                        <CiCircleInfo />
                                        <span>Update classroom status</span>
                                    </div>
                                    <div className='w-full pt-3'>
                                        <button type='submit' className='w-full h-[35px] bg-accent text-cyan-50 rounded-md'>
                                            Mark as {selectStatus}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <form className='mt-3' onSubmit={handleRescheduleSubmit}>
                                <div className='w-full grid gap-3'>
                                    <div className='w-full grid gap-2'>
                                        <label htmlFor='time' className='text-[12px]'>
                                            Time
                                        </label>
                                        <input
                                            name='time'
                                            value={rescheduleData.time}
                                            onChange={handleChange}
                                            className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md'
                                            type='time'
                                            id='time'
                                        />
                                    </div>
                                    <div className='w-full grid gap-2'>
                                        <label htmlFor='date' className='text-[12px]'>
                                            Select date
                                        </label>
                                        <input
                                            name='date'
                                            value={rescheduleData.date}
                                            onChange={handleChange}
                                            className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md'
                                            type='date'
                                            id='date'
                                        />
                                    </div>
                                </div>
                                <div className='w-full pt-3'>
                                    <button type='submit' className='w-full h-[35px] bg-accent text-cyan-50 rounded-md'>
                                        Reschedule
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            ) : (
                <div className='w-[300px] h-fit p-2 bg-white rounded-md'>
                    <div onClick={() => dispatch(handleClassStatus())} className='w-[25px] h-[25px] flex items-center justify-center text-cyan-100 bg-accent ml-auto rounded-sm mr-3'>
                        <MdClose />
                    </div>
                    <span className='mt-2 text-[14px] font-semibold text-center'>Class can't be updated because it has been marked completed or cancelled</span>
                </div>
            )}
        </div>
    );
}

export default UpdateClassStatus;