'use client'

import FilterStudForm from '@/components/dashboardComp/studentComp/filterForm/FilterStudForm';
import { handleApplicants } from '@/store/dashMenu/dashStore';
import { AppDispatch, RootState } from '@/store/store';
import React, { useState } from 'react';
import { MdManageSearch } from "react-icons/md";
import { TbCalendarSearch } from "react-icons/tb";
import { useDispatch, useSelector } from 'react-redux';

function ApplicantsHead() {
    const filterMenu = useSelector((state: RootState) => state.dashMenu.applicants)
    const dispatch = useDispatch<AppDispatch>()
    // Displaying different form base on tab
    const [tabStatus, setTabStatus] = useState<string>('')

    const handleTabStatus = (tab: string) => {
        setTabStatus(tab);
        dispatch(handleApplicants());
    }

    return (
        <header className='w-full h-[70px] flex items-center justify-between px-[30px] border-t-2 border-b-2 border-accent'>
            <div className="logo">
                <h3 className='font-bold text-xl'>Applicants</h3>
            </div>
            <div className="filter flex items-center gap-3">
                <div className="to flex w-[100px] h-[30px] border border-accent rounded-md overflow-x-hidden">
                    <div onClick={() => handleTabStatus('calendar')} className={`w-[50%] h-full flex items-center justify-center ${tabStatus === 'calendar' ? 'text-cyan-100 bg-accent' : 'text-accent'}`}>
                        <TbCalendarSearch />
                    </div>
                    <div onClick={() => handleTabStatus('search')} className={`w-[50%] h-full flex items-center justify-center ${tabStatus === 'search' ? 'text-cyan-100 bg-accent' : 'text-accent'}`}>
                        <MdManageSearch />
                    </div>
                </div>
            </div>

            {
                filterMenu && <FilterStudForm tabData={tabStatus} filterData='applicant' />
            }
        </header>
    )
}

export default ApplicantsHead