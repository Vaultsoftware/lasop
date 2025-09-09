'use client';
import CreateCohort from '@/components/dashboardComp/adminComp/CreateCohort';
import { handleCreate, handleMenu } from '@/store/dashMenu/dashStore';
import { AppDispatch, RootState } from '@/store/store';
import React, { useEffect, useState } from 'react';
import { IoFilter } from "react-icons/io5";
import FilterDateForm from '@/components/dashboardComp/adminComp/filterForm/FilterDateForm';
import { handleClassStatus } from '@/store/dashMenu/dashStore';
import { MdManageSearch } from "react-icons/md";
import { TbCalendarSearch } from "react-icons/tb";
import { CohortMain } from '@/interfaces/interface';
import { setAdminCohortSelectedCohort, setAdminOverviewSelectedCohort } from '@/store/filterStore/adminFilStore';
import { VscDiffAdded } from "react-icons/vsc";
import { useDispatch, useSelector } from 'react-redux';
import FilterDateCohForm from '@/components/dashboardComp/adminComp/filterForm/FilterDateCohForm';

function CalDashHead() {
    const openCreate = useSelector((state: RootState) => state.dashMenu.openCreate);
    const openMenu = useSelector((state: RootState) => state.dashMenu.openMenu)
    const classStatus = useSelector((state: RootState) => state.dashMenu.classStatus);
    const cohort = useSelector((state: RootState) => state.cohort.cohort);
    const adminActiveCohort = useSelector((state: RootState) => state.adminFilter.adminCohortSelectedCohort);
    const adminAssignedCohort = useSelector((state: RootState) => state.adminFilter.adminAssignedCohort);
    const dispatch = useDispatch<AppDispatch>();

    // Displaying different form base on tab
    const [tabStatus, setTabStatus] = useState<string>('')

    const handleTabStatus = (tab: string) => {
        setTabStatus(tab);
        dispatch(handleClassStatus())
    }

    const [convertCohort, setConvertCohort] = useState<CohortMain>();
    useEffect(() => {
        if (adminActiveCohort) {
            const findCohort = cohort.find((coh) => coh._id === adminActiveCohort)
            setConvertCohort(findCohort);
        }
    }, [adminActiveCohort]);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCohortId = event.target.value;
        dispatch(setAdminCohortSelectedCohort(selectedCohortId))
    }

    const handleCreateCoh = () => {
        if (openMenu) {
            dispatch(handleMenu());
        }
        dispatch(handleCreate());
    };

    return (
        <header className='w-full h-fit md:h-[70px] items-center flex justify-between px-[30px] border-t-2 border-b-2 border-accent py-3 md:py-0'>
            <div className="logo">
                <h3 className='font-bold text-xl'>Cohorts</h3>
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
                <div onClick={handleCreateCoh} className="from flex items-center gap-3 p-1 px-2 bg-accent text-cyan-50 rounded-md cursor-pointer">
                    <VscDiffAdded />
                    <span className='text-[14px]'>Create</span>
                </div>
            </div>
            {
                classStatus && <FilterDateCohForm tabData={tabStatus} />
            }
            {
                openCreate && <CreateCohort />
            }
        </header>
    )
}

export default CalDashHead