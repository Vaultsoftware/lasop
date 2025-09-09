'use client';

import React from 'react';
import { IoFilter } from "react-icons/io5";
import { VscDiffAdded } from "react-icons/vsc";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { handleAttendance } from '@/store/dashMenu/dashStore';
import AssessmentForm from '@/components/dashboardComp/staffComp/assessment/AssessmentForm';

interface Props {
    title: string;
}

function AssessmentDetHead({title}: Props) {
    const createAttendance = useSelector((state: RootState) => state.dashMenu.attendance);
    const dispatch = useDispatch<AppDispatch>();

    return (
        <header className='w-full h-[70px] flex items-center justify-between px-[30px] border-t-2 border-b-2 border-accent'>
            <div className="logo">
                <h3 className='font-bold text-[14px] md:text-xl'>Assessment / {title}</h3>
            </div>
            <div className="filter flex items-center gap-3">
                <div className="from flex items-center gap-2">
                    <div onClick={() => dispatch(handleAttendance())} className="from flex items-center gap-3 p-1 px-2 bg-accent text-cyan-50 rounded-md cursor-pointer">
                        <VscDiffAdded />
                        <span className='text-[14px]'>Create</span>
                    </div>
                </div>
            </div>
            {
                createAttendance && <AssessmentForm />
            }
        </header>
    )
}

export default AssessmentDetHead