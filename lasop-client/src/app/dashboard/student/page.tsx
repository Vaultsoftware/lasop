'use client';

import React, { useEffect, useState } from 'react';
import DashHead from '@/components/dashHead/DashHead';
import OverviewHead from './overview/OverviewHead';
import OverviewMain from './overview/OverviewMain';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { ProfileDataMain } from '@/interfaces/interface';

function OverviewPage() {
    const studentDetail = useSelector((state: RootState) => state.student.logDetails);
    const profiles = useSelector((state: RootState) => state.profile.profiles);

    const dispatch = useDispatch<AppDispatch>();

    const [studentProfile, setStudentProfile] = useState<ProfileDataMain>();
    useEffect(() => {
        if(profiles) {
            const getData = profiles.find((pro) => pro.studentId?._id === studentDetail?._id)
            if(getData) {
                setStudentProfile(getData);
            }
        }
    }, [profiles])

    return (
        <div className='w-full h-full overflow-y-scroll'>
            <DashHead props={{
                username: `${studentDetail?.firstName || ''} ${studentDetail?.lastName || ''}`,
                link: 'profile',
                acct: 'student',
                img: studentProfile?.proPic || ''
            }} />
            <OverviewHead />
            <OverviewMain />
        </div>
    )
}

export default OverviewPage