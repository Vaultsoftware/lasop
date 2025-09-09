'use client';

import React, { useEffect, useState } from 'react';
import DashStudentPage from '../layout'
import DashHead from '@/components/dashHead/DashHead'
import AssessHead from './AssessHead'
import AssessMain from './AssessMain'
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { ProfileDataMain } from '@/interfaces/interface';

function AssessmentPage() {
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

    return (
        <div className='w-full h-full overflow-y-scroll'>
            <DashHead props={{
                username: `${studentDetail?.firstName || ''} ${studentDetail?.lastName || ''}`,
                link: 'profile',
                acct: 'student',
                img: studentProfile?.proPic || ''
            }} />
            <AssessHead />
            <AssessMain />
        </div>
    )
}

export default AssessmentPage