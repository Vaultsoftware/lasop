'use client';

import React, { useState, useEffect } from 'react';
import { CiClock2 } from 'react-icons/ci';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { handleStartClass } from '@/store/dashMenu/dashStore';
import { fetchClassroom, updateClassroom } from '@/store/classroomStore/classroomStore';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ClassroomMain } from '@/interfaces/interface';

interface Props {
    _id: string;
}

interface ClassroomResponsePayload {
    message?: string;
    data?: ClassroomMain;
}

function StartActivateClass({ _id }: Props) {
    const classrooms = useSelector((state: RootState) => state.classroom.classroom);
    const staffDetail = useSelector((state: RootState) => state.staff.logDetails?._id);
    const staffActiveCohort = useSelector((state: RootState) => state.staffFilter.staffStudentsSelectedCohort);

    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    // Function for converting date to string
    const formatDate = (dateString: string | any) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

        return formattedDate
    }

    // Fetching classroom details by ID
    const [classroomDetail, setClassroomDetail] = useState<ClassroomMain>()

    useEffect(() => {
        if (classrooms.length > 0 && staffDetail && staffActiveCohort) {
            const classroom = classrooms.find((c) => c._id === _id && c.cohortId._id === staffActiveCohort && c.tutorId._id === staffDetail)
            setClassroomDetail(classroom)
        }
    }, [classrooms, staffActiveCohort, staffDetail])

    const startActivateClass = async () => {
        const classData = {
            startClass: true
        };

        try {
            if (_id) {
                const response = await dispatch(updateClassroom({ classId: _id, classData }));

                if (updateClassroom.fulfilled.match(response)) {
                    const payload = response.payload as ClassroomResponsePayload;
                    toast.success(payload.message || 'Class started');

                    dispatch(fetchClassroom());

                    // Open Zoom meeting in the browser
                    // if (classroomDetail?.zoomLink) {
                    //     router.push(classroomDetail.zoomLink);
                    // } else {
                    //     toast.info('Zoom link not found in classroomDetail');
                    // }
                }
                else {
                    toast.error(response.error.message)
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='fixed top-0 left-0 w-full h-[100vh] applicant flex items-center justify-center'>
            {
                classroomDetail && (classroomDetail?.startClass === false && classroomDetail.status === 'next') ? (
                    <div className='w-[300px] h-fit p-2 bg-white rounded-md'>
                        <div className='flex flex-col justify-center items-center gap-1'>
                            <h3 className='font-semibold text-[14px]'>{classroomDetail?.title}</h3>
                            <div className='flex items-center gap-2'>
                                <div className='flex items-center gap-1 text-[10px]'>
                                    <FaRegCalendarAlt />
                                    <span>{formatDate(classroomDetail?.date)}</span>
                                </div>
                                <div className='flex items-center gap-1 text-[10px]'>
                                    <CiClock2 />
                                    <span>{classroomDetail?.time}</span>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col items-center justify-center gap-2 mt-5 text-center'>
                            <h3 className='font-semibold text-shadow text-[14px]'>Ready to join</h3>
                            <div className='flex items-center gap-4'>
                                <button className='p-2 border border-shadow rounded-md text-[12px] font-semibold' onClick={() => dispatch(handleStartClass())}>Cancel</button>
                                {
                                    classroomDetail?.zoomLink && <Link href={classroomDetail.zoomLink} onClick={startActivateClass} className='p-2 bg-shadow rounded-md text-[12px] font-semibold text-white'>Start/Activate class</Link>
                                }
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='w-[300px] h-fit p-2 bg-white rounded-md'>
                        <div className='flex flex-col justify-center items-center gap-1'>
                            <h3 className='font-semibold text-[14px]'>{classroomDetail?.title}</h3>
                            <div className='flex items-center gap-2'>
                                <div className='flex items-center gap-1 text-[10px]'>
                                    <FaRegCalendarAlt />
                                    <span>{formatDate(classroomDetail?.date)}</span>
                                </div>
                                <div className='flex items-center gap-1 text-[10px]'>
                                    <CiClock2 />
                                    <span>{classroomDetail?.time}</span>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col items-center justify-center gap-2 mt-5 text-center'>
                            <h3 className='font-semibold text-shadow text-[14px]'>Class already ended or has a status of missed / cancelled</h3>
                            <div className='flex items-center gap-4'>
                                <button className='p-2 border border-shadow rounded-md text-[12px] font-semibold' onClick={() => dispatch(handleStartClass())}>Close</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default StartActivateClass