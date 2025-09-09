'use client'

import { setStaffStudentsSelectedCohort } from '@/store/filterStore/staffFilStore';
import { AppDispatch, RootState } from '@/store/store';
import React, { useEffect, useState } from 'react';
import { IoFilter } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { CohortMain } from '@/interfaces/interface';

function StudentsHead() {
    const staffAssignedCohort = useSelector((state: RootState) => state.staffFilter.staffAssignedCohort);
    const staffActiveCohort = useSelector((state: RootState) => state.staffFilter.staffStudentsSelectedCohort);
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
        dispatch(setStaffStudentsSelectedCohort(selectedCohortId))
    }

    return (
        <header className='w-full h-[70px] flex items-center justify-between px-[30px] border-t-2 border-b-2 border-accent'>
            <div className="logo">
                <h3 className='font-bold text-xl'>Students</h3>
            </div>
            <div className="filter flex items-center gap-3">
                {/* <div className="from flex items-center gap-2 ">
                    <span className='text-[12px]'>From:</span>
                    <form action="" className='p-[4px] border border-shadow rounded-md h-fit'>
                        <input type="date" className='w-[130px] h-[30px] text-[14px] outline-none' id="" />
                    </form>
                </div>
                <div className="from flex items-center gap-2 ">
                    <span className='text-[12px]'>To:</span>
                    <form action="" className='p-[4px] border border-shadow rounded-md h-fit'>
                        <input type="date" className='w-[130px] h-[30px] text-[14px] outline-none' id="" />
                    </form>
                </div> */}
                <div className="from flex items-center gap-2">
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
                </div>
            </div>
        </header>
    )
}

export default StudentsHead