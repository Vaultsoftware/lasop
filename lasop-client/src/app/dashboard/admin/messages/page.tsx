'use client'

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

import DashHead from '@/components/dashHead/DashHead'
import React from 'react'
import MsgHead from './MsgHead'
import MsgMain from './MsgMain'

function MsgPage() {
    const staffDetail = useSelector((state: RootState) => state.staff.logDetails);

    return (
        <div className='w-full h-full overflow-y-scroll'>
            <DashHead props={{
                username: staffDetail?.firstName || 'staff',
                link: 'profile',
                acct: 'staff',
                img: ''
            }} />
            <MsgHead />
            <MsgMain />
        </div>
    )
}

export default MsgPage