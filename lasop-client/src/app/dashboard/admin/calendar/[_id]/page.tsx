'use client';

import DashHead from '@/components/dashHead/DashHead';
import { CohortMain } from '@/interfaces/interface';
import { AppDispatch, RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CohHeadDetails from './CohHeadDetails';
import CohBodyDetails from './CohBodyDetails';

interface Params {
    _id: string;
}

interface Props {
    params: Params;
}

function page({ params }: Props) {
    const [pageData, setPageData] = useState<CohortMain | null>(null);
    const router = useRouter();

    const cohort = useSelector((state: RootState) => state.cohort.cohort);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (params._id === undefined) {
            router.push('/dashboard/admin/calendar/');
        } else {
            const data = cohort.find((coh) => coh._id === params._id);
            setPageData(data || null);
        }
    }, [params, cohort, router]);

    return (
        <div className='w-full h-[100vh] overflow-y-scroll'>
            <DashHead props={{
                username: 'Admin',
                link: 'profile',
                acct: 'admin',
                img: ''
            }} />
            {
                pageData ? (
                    <div className='px-5'>
                        <CohHeadDetails
                            _id={pageData._id}
                            cohortName={pageData.cohortName}
                            startDate={pageData.startDate}
                            endDate={pageData.endDate}
                            mode={pageData.mode}
                            center={pageData.center}
                            status={pageData.status}
                            isActive={pageData.isActive}
                        />
                        <CohBodyDetails
                            _id={pageData._id}
                            courseTutors={pageData.courseTutors}
                         />
                    </div>
                ) : <h1>Loading...</h1>
            }
        </div>
    )
}

export default page