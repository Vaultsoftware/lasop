'use client'

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import DashHead from '@/components/dashHead/DashHead'
import React from 'react'
import ClassHead from './ClassHead'
import ClassMain from './ClassMain'

function ClassPage() {
    const staffDetail = useSelector((state: RootState) => state.staff.logDetails);
    return (
        <div className='w-full h-full overflow-y-scroll'>
            <DashHead props={{
                username: staffDetail?.firstName || 'staff',
                link: 'profile',
                acct: 'staff',
                img: ''
            }} />
            <ClassHead />
            <ClassMain />
        </div>
    )
}

export default ClassPage