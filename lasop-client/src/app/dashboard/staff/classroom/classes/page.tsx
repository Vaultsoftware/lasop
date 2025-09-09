'use client'

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

import DashHead from '@/components/dashHead/DashHead'
import React from 'react'
import ClassesHead from './ClassesHead'
import ClassesMain from './ClassesMain'

function page() {
  const staffDetail = useSelector((state: RootState) => state.staff.logDetails);

  return (
    <div className='w-full h-full overflow-y-scroll'>
      <DashHead props={{
        username: staffDetail?.firstName || 'staff',
        link: 'profile',
        acct: 'staff',
        img: ''
      }} />
      <ClassesHead />
      <ClassesMain />
    </div>
  )
}

export default page