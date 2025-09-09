"use client";

import DashHead from '@/components/dashHead/DashHead';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { ProfileDataMain } from '@/interfaces/interface';
import { useRouter } from 'next/navigation';
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
    const studentDetail = useSelector((state: RootState) => state.student.logDetails)
    const profiles = useSelector((state: RootState) => state.profile.profiles);

    const dispatch = useDispatch<AppDispatch>();

    const [studentProfile, setStudentProfile] = useState<ProfileDataMain>();
    useEffect(() => {
        if(profiles) {
            const getData = profiles.find((pro) => pro.studentId?._id === studentDetail?._id)
            setStudentProfile(getData);
        }
    }, [profiles])

    useEffect(() => {
        if (params._id === undefined) {
            router.push('/dashboard/student');
        } else {
            const data = project.find((pro) => pro._id === params._id);
            setPageData(data || null)
        }
    }, [params, project, router])

    return (
        <div className='w-full h-full overflow-y-scroll'>
            <DashHead props={{
                username: `${studentDetail?.firstName || ''} ${studentDetail?.lastName || ''}`,
                link: 'profile',
                acct: 'student',
                img: studentProfile?.proPic || ''
            }} />
            {
                pageData ? (
                    <>
                        <ProjectDetHead />
                        <ProjectDetMain
                            props={{
                                _id: pageData._id,
                                title: pageData.title,
                                duration: pageData.duration,
                                start: pageData.start,
                                overview: pageData.overview,
                                objectives: pageData.objectives,
                                deliverables: pageData.deliverables,
                                submission: pageData.submission,
                                createdAt: pageData.createdAt
                            }}
                        />
                    </>
                ) : (
                    <h1>Loading...</h1>
                )
            }
        </div>
    )
}

export default page