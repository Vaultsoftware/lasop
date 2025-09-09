"use client";

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { CgProfile } from 'react-icons/cg';
import { LuBookMarked } from 'react-icons/lu';
import logo from '../../../../../asset/form/form.jpeg';
import ClassroomInfo from '@/components/dashboardComp/adminComp/studInfo/ClassroomInfo';
import AssessInfo from '@/components/dashboardComp/adminComp/studInfo/AssessInfo';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchStudentDetails } from '@/store/studentStore/studentStore';
import ProjectInfo from '@/components/dashboardComp/adminComp/studInfo/ProjectInfo';

interface PropsData {
    _id: string;
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
    attendance: string | any;
    left: string | any;
    absent: string | any;
    assessment: string | any;
    curPro: string | any;
    comPro: string | any;
}

interface Props {
    props: PropsData;
}

function StudentIdMain({ props }: Props) {
    const statusTab: string[] = ['classroom', 'assessment', 'project'];

    // function to display student based on status
    const [status, setStatus] = useState<string>('classroom')
    const handleDisplayStatus = (arg: string) => {
        setStatus(arg)
    }

    // fetching student data
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        dispatch(fetchStudentDetails(props._id))
    }, [dispatch])

    const studentData = useSelector((state: RootState) => state.student.studentDetails)

    const displayInfo = () => {
        if(studentData) {
            if (status === 'classroom') {
                return <ClassroomInfo studentData={studentData} />
            }
            else if (status === 'assessment') {
                return <AssessInfo studentData={studentData} />
            }
            else {
                return <ProjectInfo studentData={studentData} />
            }
        }
    }

    return (
        <main className='w-full p-5'>
            <div className='grid gap-5'>
                <div>
                    <div className='flex gap-1 items-center mb-3'>
                        <div className='flex items-center gap-2 w-fit'>
                            <CgProfile />
                            <h3 className='text-[14px] font-semibold'>PERSONAL INFORMATION</h3>
                        </div>
                        <div className='h-[1px] w-full bg-black'></div>
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                        <div>
                            <Image className='w-[100px] h-[100px] rounded-md object-cover' src={logo} alt='' />
                        </div>
                        <div className='grid gap-3 w-full'>
                            <div>
                                <h3 className='text-[12px] font-semibold'>Name</h3>
                                <p className='text-[14px] font-bold'>{props.firstName} {props.lName}</p>
                            </div>
                            <div>
                                <h3 className='text-[12px] font-semibold'>Phone number</h3>
                                <p className='text-[14px] font-bold'>{props.contact}</p>
                            </div>
                            <div>
                                <h3 className='text-[12px] font-semibold'>Address</h3>
                                <p className='text-[14px] font-bold'>{props.address}</p>
                            </div>
                        </div>
                        <div className='grid gap-3 w-full'>
                            <div>
                                <h3 className='text-[12px] font-semibold'>Sex</h3>
                                <p className='text-[14px] font-bold'>{props.sex}</p>
                            </div>
                            <div>
                                <h3 className='text-[12px] font-semibold'>Status</h3>
                                <p className='text-[14px] font-bold'>{props.status}</p>
                            </div>
                            <div>
                                <h3 className='text-[12px] font-semibold'>Registration date</h3>
                                <p className='text-[14px] font-bold'>{props.regDate}</p>
                            </div>
                        </div>
                        <div className='grid gap-3 w-full'>
                            <div>
                                <h3 className='text-[12px] font-semibold'>Cohort</h3>
                                <p className='text-[14px] font-bold'>{props.cohort}</p>
                            </div>
                            <div>
                                <h3 className='text-[12px] font-semibold'>Center</h3>
                                <p className='text-[14px] font-bold'>{props.center}</p>
                            </div>
                            <div>
                                <h3 className='text-[12px] font-semibold'>Mode of study</h3>
                                <p className='text-[14px] font-bold'>{props.mode}</p>
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
                                <p className='text-[14px] font-bold'>{props.course}</p>
                            </div>
                            <div>
                                <h3 className='text-[12px] font-semibold'>Course duration</h3>
                                <p className='text-[14px] font-bold'>{props.courseDuration}</p>
                            </div>
                            <div>
                                <h3 className='text-[12px] font-semibold'>Started</h3>
                                <p className='text-[14px] font-bold'>{props.started}</p>
                            </div>
                        </div>
                        <div className='grid gap-3 w-full'>
                            <div>
                                <h3 className='text-[12px] font-semibold'>Class attended</h3>
                                <p className='text-[14px] font-bold'>{props.attendance}</p>
                            </div>
                            <div>
                                <h3 className='text-[12px] font-semibold'>Class left</h3>
                                <p className='text-[14px] font-bold'>{props.left}</p>
                            </div>
                            <div>
                                <h3 className='text-[12px] font-semibold'>Absent</h3>
                                <p className='text-[14px] font-bold'>{props.absent}</p>
                            </div>
                        </div>
                        <div className='grid gap-3 w-full'>
                            <div>
                                <h3 className='text-[12px] font-semibold'>Assessment</h3>
                                <p className='text-[14px] font-bold'>{props.assessment}</p>
                            </div>
                            <div>
                                <h3 className='text-[12px] font-semibold'>Current project</h3>
                                <p className='text-[14px] font-bold'>{props.curPro}</p>
                            </div>
                            <div>
                                <h3 className='text-[12px] font-semibold'>Completed project</h3>
                                <p className='text-[14px] font-bold'>{props.comPro}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className='flex gap-1 items-center mb-3'>
                        <div className='flex items-center gap-2 w-fit'>
                            <LuBookMarked />
                            <h3 className='text-[14px] font-semibold'>OTHER INFORMATION</h3>
                        </div>
                        <div className='h-[1px] w-full bg-black'></div>
                    </div>
                    <div>
                        <div className="academics_list flex gap-5 w-full h-[40px] px-2 rounded-md overflow-x-scroll sm:overflow-hidden whitespace-nowrap sm:whitespace-normal">
                            {
                                statusTab.map((stat, id) => (
                                    <div
                                        key={id}
                                        className={`${status === stat ? 'border-b-2 border-shadow font-semibold' : ''} package  cursor-pointer h-full flex items-center gap-3`}
                                        onClick={() => handleDisplayStatus(stat)}
                                    >
                                        <span>{stat.toUpperCase()}</span>
                                    </div>
                                ))
                            }
                        </div>
                        {
                            displayInfo()
                        }
                    </div>
                </div>
            </div>
        </main>
    )
}

export default StudentIdMain