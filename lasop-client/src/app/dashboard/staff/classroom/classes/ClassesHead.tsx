'use client';

import { useState, useEffect } from 'react'
import ClassroomForm from '@/components/dashboardComp/staffComp/classroom/ClassroomForm';
import { handleClass } from '@/store/dashMenu/dashStore';
import { AppDispatch, RootState } from '@/store/store';
import React from 'react';
import { IoFilter } from "react-icons/io5";
import { VscDiffAdded } from "react-icons/vsc";
import { useDispatch, useSelector } from 'react-redux';
import { setStaffClassroomSelectedCohort } from '@/store/filterStore/staffFilStore';
import { CohortMain } from '@/interfaces/interface';

function ClassesHead() {
    const createClassroom = useSelector((state: RootState) => state.dashMenu.createClass);

    const staffAssignedCohort = useSelector((state: RootState) => state.staffFilter.staffAssignedCohort);
    const staffActiveCohort = useSelector((state: RootState) => state.staffFilter.staffClassroomSelectedCohort);
    const cohort = useSelector((state: RootState) => state.cohort.cohort);

    const [convertCohort, setConvertCohort] = useState<CohortMain>();

    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        if (staffActiveCohort) {
            const findCohort = cohort.find((coh) => coh._id === staffActiveCohort)
            setConvertCohort(findCohort);
        }
    }, [staffActiveCohort])

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCohortId = event.target.value;
        dispatch(setStaffClassroomSelectedCohort(selectedCohortId))
    }

    return (
        <header className='w-full h-[70px] flex items-center justify-between px-[30px] border-t-2 border-b-2 border-accent'>
            <div className="logo">
                <h3 className='font-bold text-[12px] md:text-xl'>Classroom / Classes</h3>
            </div>
            <div className="filter flex items-center gap-3">
                <div className="from flex items-center gap-2">
                    <h3 className='text-[12px] font-semibold'>Cohort:</h3>
                    <form action="" className='p-[4px] border border-shadow rounded-md h-fit'>
                        <div className="select_ctrl w-[100px] flex items-center justify-between">
                            <IoFilter className='text-accent' />
                            <select value={staffActiveCohort} onChange={handleChange} className='w-full h-[25px] px-2 outline-none border-none text-[12px] rounded-md' id="">
                                <option disabled value={staffActiveCohort}>{convertCohort?.cohortName}</option>
                                {
                                    staffAssignedCohort.map((coh) => (
                                        <option key={coh._id} value={coh._id}>{coh.cohortName}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </form>
                    <div onClick={() => dispatch(handleClass())} className="from flex items-center gap-3 p-1 px-2 bg-accent text-cyan-50 rounded-md cursor-pointer">
                        <VscDiffAdded />
                        <span className='text-[14px]'>Create</span>
                    </div>
                </div>
            </div>
            {
                createClassroom && <ClassroomForm />
            }
        </header>
    )
}

export default ClassesHead