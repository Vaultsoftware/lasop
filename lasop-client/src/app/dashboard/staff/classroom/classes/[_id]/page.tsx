"use client";

import DashHead from '@/components/dashHead/DashHead';
import { RootState, AppDispatch } from '@/store/store';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ClassesHeadDetails from './ClassesHeadDetails';
import ClassesMainDetails from './ClassesMainDetails';
import { ClassroomMain } from '@/interfaces/interface';

interface Params {
    _id: string;
}

interface Props {
    params: Params;
}

function Page({ params }: Props) {
    const [pageData, setPageData] = useState<ClassroomMain | null>(null);
    const router = useRouter();

    const classroom = useSelector((state: RootState) => state.classroom.classroom);
    const staffDetail = useSelector((state: RootState) => state.staff.logDetails);

    const formatDate = (dateString: string | any) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

        return formattedDate
    }

    useEffect(() => {
        if (params._id === undefined) {
            router.push('/');
        } else {
            const data = classroom.find((cla) => cla._id === params._id)
            setPageData(data || null)
        }
    }, [params, classroom, router])
    
    return (
        <div className='w-full h-full overflow-y-scroll'>
            <DashHead props={{
                username: staffDetail?.firstName || 'staff',
                link: 'profile',
                acct: 'staff',
                img: ''
            }} />
            {
                pageData ? (
                    <div className='px-5'>
                        <ClassesHeadDetails
                            _id={pageData._id}
                            title={pageData.title}
                            cohort={pageData.cohortId.cohortName}
                            course={pageData.courseId.title}
                            createdAt={formatDate(pageData.date)}
                            status={pageData.status}
                            startClassBool={pageData.startClass}
                        />
                        <ClassesMainDetails
                            attendance={pageData.attendance}
                            course={pageData.courseId}
                            status={pageData.status}
                            _id={pageData._id}
                         />
                    </div>
                ) : (
                    <h1>Loading...</h1>
                )
            }
        </div>
    )
}

export default Page