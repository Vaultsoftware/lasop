"use client";

import DashHead from '@/components/dashHead/DashHead';
import { RootState, AppDispatch } from '@/store/store';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ProjectDetHead from './ProjectDetHead';
import ProjectDetMain from './ProjectDetMain';
import { ProjectMain } from '@/interfaces/interface';

interface Params {
    _id: string;
}

interface Props {
    params: Params;
}

function page({ params }: Props) {
    const [pageData, setPageData] = useState<ProjectMain | null>(null);
    const router = useRouter();

    const project = useSelector((state: RootState) => state.project.project);
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
            const data = project.find((asses) => asses._id === params._id)
            setPageData(data || null)
        }
    }, [params, project, router])

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
                        <ProjectDetHead title={pageData.title} />
                        <ProjectDetMain
                            projectId={pageData._id}
                            submission={pageData.submission}
                            cohortName={pageData.cohortId.cohortName}
                            instruction={pageData.overview}
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