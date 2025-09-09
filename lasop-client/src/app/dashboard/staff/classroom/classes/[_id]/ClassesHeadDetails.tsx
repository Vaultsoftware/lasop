'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import AttendanceForm from '@/components/dashboardComp/staffComp/classroom/AttendanceForm';
import { handleAttendance, handleClassStatus, handleStartClass } from '@/store/dashMenu/dashStore';
import StartActivateClass from '@/components/dashboardComp/staffComp/classroom/StartActivateClass';
import UpdateClassStatus from '@/components/dashboardComp/staffComp/classroom/UpdateClassStatus';
import { ClassroomMain } from '@/interfaces/interface';
import { fetchClassroomDetail } from '@/store/classroomStore/classroomStore';
import logo from '../../../../../../asset/form/form.jpeg';

interface Props {
    _id: string;
    title: string;
    cohort: string;
    course: string;
    createdAt: string;
    status: string;
    startClassBool: boolean;
}

function ClassesHeadDetails({ _id, title, cohort, course, createdAt, status, startClassBool }: Props) {
    const attendance = useSelector((state: RootState) => state.dashMenu.attendance);
    const startClass = useSelector((state: RootState) => state.dashMenu.startClass);
    const classStatus = useSelector((state: RootState) => state.dashMenu.classStatus);

    const dispatch = useDispatch<AppDispatch>();

    // storing data from server
    const [classroom, setClassroom] = useState<ClassroomMain>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await dispatch(fetchClassroomDetail(_id));
                if (fetchClassroomDetail.fulfilled.match(response)) {
                    setClassroom(response.payload);
                    console.log(classroom)
                }
            } catch (error) {
                console.error("Error fetching classroom details:", error);
            }
        };

        fetchData();
    }, [_id, dispatch])

    return (
        <header className='w-full h-fit py-5 block md:flex items-center gap-8'>
            <div>
                <Image className='w-[100px] h-[100px] rounded-md object-cover' src={logo} alt='' />
            </div>
            <div>
                <div className=''>
                    <p className='text-[12px] text-shadow font-semibold'>{cohort}</p>
                    <h3 className='text-[30px] font-bold'>{title}</h3>
                    <p className='text-[12px]'>{course}</p>
                    <div className='flex items-center gap-3 mt-2'>
                        <div>
                            <p className='text-[12px] font-semibold'>Created at: {createdAt}</p>
                        </div>
                        <div>
                            <p className='text-[12px] font-semibold'>Status: {status}</p>
                        </div>
                    </div>
                </div>
                <div className='mt-4 flex items-center gap-3'>
                    <button onClick={() => dispatch(handleAttendance())} className="from text-[12px] p-1 px-2 border-2 border-accent text-shadow rounded-md cursor-pointer">Mark attendance</button>
                    <button onClick={() => dispatch(handleClassStatus())} className="from text-[12px] p-1 px-2 bg-accent text-cyan-50 rounded-md cursor-pointer">Update class</button>
                    {
                        startClassBool ? <></> : <button className="from text-[12px] p-1 px-2 bg-green-400 text-cyan-50 rounded-md cursor-pointer" onClick={() => dispatch(handleStartClass())}>Start class</button>
                    }
                </div>
            </div>
            
            {
                attendance && <AttendanceForm _id={classroom ? classroom._id : _id} />
            }
            {
                startClass && <StartActivateClass _id={classroom ? classroom._id : _id} />
            }
            {classStatus && <UpdateClassStatus classId={classroom ? classroom._id : _id} status={classroom ? classroom.status : status} />}
        </header>
    )
}

export default ClassesHeadDetails