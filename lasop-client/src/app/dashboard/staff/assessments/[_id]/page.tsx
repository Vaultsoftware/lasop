"use client";

import DashHead from '@/components/dashHead/DashHead';
import { RootState, AppDispatch } from '@/store/store';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AssessmentDetHead from './AssessmentDetHead';
import AssessmentDetMain from './AssessmentDetMain';
import { AssessmentMain } from '@/interfaces/interface';

interface Params {
    _id: string;
}

interface Props {
    params: Params;
}

function page({ params }: Props) {
    const [pageData, setPageData] = useState<AssessmentMain | null>(null);
    const router = useRouter();

    const assessment = useSelector((state: RootState) => state.assessment.assessment);
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
            const data = assessment.find((asses) => asses._id === params._id)
            setPageData(data || null)
        }
    }, [params, assessment, router])

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
                    <div>
                        <AssessmentDetHead title={pageData.title} />
                        <AssessmentDetMain
                            assessmentId={pageData._id}
                            submission={pageData.submission}
                            cohortName={pageData.cohortId.cohortName}
                            instruction={pageData.instruction}
                            title={pageData.title}
                        />
                    </div>
                ) : (
                    <h1>Loading...</h1>
                )
            }
        </div>
    )
}

export default page