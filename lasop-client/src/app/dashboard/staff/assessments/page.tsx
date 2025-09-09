'use client'

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import DashHead from '@/components/dashHead/DashHead'
import React from 'react'
import AssessHead from './AssessHead'
import AssessMain from './AssessMain'

function AssessPage() {
    const staffDetail = useSelector((state: RootState) => state.staff.logDetails);
    return (
        <div className='w-full h-full overflow-y-scroll'>
            <DashHead props={{
                username: staffDetail?.firstName || 'staff',
                link: 'profile',
                acct: 'staff',
                img: ''
            }} />
            <AssessHead />
            <AssessMain />
        </div>
    )
}

export default AssessPage