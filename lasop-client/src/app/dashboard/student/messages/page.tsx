'use client';

import React, { useEffect, useState } from 'react';
import DashStudentPage from '../layout'
import DashHead from '@/components/dashHead/DashHead'
import MsgHead from './MsgHead'
import MsgMain from './MsgMain'
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { ProfileDataMain } from '@/interfaces/interface';

function MsgPage() {
    const studentDetail = useSelector((state: RootState) => state.student.logDetails)
    const profiles = useSelector((state: RootState) => state.profile.profiles);

    const dispatch = useDispatch<AppDispatch>();

    const [studentProfile, setStudentProfile] = useState<ProfileDataMain>();
    useEffect(() => {
        if (profiles) {
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
            <MsgHead />
            <MsgMain />
        </div>
    )
}

export default MsgPage