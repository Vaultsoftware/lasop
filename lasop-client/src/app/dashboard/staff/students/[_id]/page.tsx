"use client";

import DashHead from '@/components/dashHead/DashHead';
import { RootState, AppDispatch } from '@/store/store';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import StudentIdHead from './StudentIdHead';
import StudentIdMain from './StudentIdMain';
import { StudentDataMain } from '@/interfaces/interface';

interface Params {
    _id: string;
}

interface Props {
    params: Params;
}

function Page({ params }: Props) {
    const [pageData, setPageData] = useState<StudentDataMain | null>(null);
    const router = useRouter();

    const student = useSelector((state: RootState) => state.student.student);
    const staffDetail = useSelector((state: RootState) => state.staff.logDetails);

    useEffect(() => {
        if (params._id === undefined) {
            router.push('/');
        } else {
            const data = student.find((stu) => stu._id === params._id)
            setPageData(data || null)
        }
    }, [params, student, router])

    // Function for converting date to string
    const formatDate = (dateString: string | any) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

        return formattedDate
    }

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
                    <>
                        <StudentIdHead />
                        <StudentIdMain props={{
                            firstName: pageData.firstName,
                            lName: pageData.lastName,
                            contact: pageData.contact,
                            address: pageData.address,
                            sex: pageData.gender ?? 'N/A',
                            status: pageData.status,
                            regDate: formatDate(pageData.createdAt),
                            cohort: pageData.program.cohortId.cohortName,
                            center: pageData.program.center.title,
                            mode: pageData.program.mode,
                            course: pageData.program.courseId.title,
                            courseDuration: `${Math.floor(
                                (new Date(pageData.program.cohortId.endDate).getFullYear() - new Date(pageData.program.cohortId.startDate).getFullYear()) * 12 +
                                (new Date(pageData.program.cohortId.endDate).getMonth() - new Date(pageData.program.cohortId.startDate).getMonth())
                              )} months`,
                            started: pageData.program?.cohortId?.startDate ? formatDate(pageData.program.cohortId.startDate) : 'N/A',
                            attendance: '32',
                            left: '24',
                            absent: '3',
                            assessment: '18%',
                            curPro: '100%',
                            comPro: '20',
                        }} />
                    </>
                ) : (
                    <h1>Loading...</h1>
                )
            }
        </div>
    )
}

export default Page