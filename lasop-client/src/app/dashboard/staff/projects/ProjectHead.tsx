'use client';

import { useState, useEffect } from 'react'
import { IoFilter } from "react-icons/io5";
import { VscDiffAdded } from "react-icons/vsc";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { handleProject } from '@/store/dashMenu/dashStore';
import ProjectForm from '@/components/dashboardComp/staffComp/project/ProjectForm';
import { setStaffProjectSelectedCohort } from '@/store/filterStore/staffFilStore';
import { CohortMain } from '@/interfaces/interface';

function ProjectHead() {
    const createProject = useSelector((state: RootState) => state.dashMenu.project);
    const dispatch = useDispatch<AppDispatch>();

    const staffAssignedCohort = useSelector((state: RootState) => state.staffFilter.staffAssignedCohort);
    const staffActiveCohort = useSelector((state: RootState) => state.staffFilter.staffProjectSelectedCohort);
    const cohort = useSelector((state: RootState) => state.cohort.cohort);

    const [convertCohort, setConvertCohort] = useState<CohortMain>();
    useEffect(() => {
        if (staffActiveCohort) {
            const findCohort = cohort.find((coh) => coh._id === staffActiveCohort)
            setConvertCohort(findCohort);
        }
    }, [staffActiveCohort])

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCohortId = event.target.value;
        dispatch(setStaffProjectSelectedCohort(selectedCohortId))
    }

    return (
        <header className='w-full h-[70px] flex items-center justify-between px-[30px] border-t-2 border-b-2 border-accent'>
            <div className="logo">
                <h3 className='font-bold text-xl'>Projects</h3>
            </div>
            <div className="filter flex items-center gap-3">
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
                    <div onClick={() => dispatch(handleProject())} className="from flex items-center gap-3 p-1 px-2 bg-accent text-cyan-50 rounded-md cursor-pointer">
                        <VscDiffAdded />
                        <span className='text-[14px]'>Create</span>
                    </div>
                </div>
            </div>
            {
                createProject && <ProjectForm />
            }
        </header>
    )
}

export default ProjectHead