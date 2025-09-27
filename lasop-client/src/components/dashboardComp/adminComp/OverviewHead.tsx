// File: lasop-client/src/components/dashboardComp/adminComp/OverviewHead.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { IoFilter } from "react-icons/io5";
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import FilterDateForm from '@/components/dashboardComp/adminComp/filterForm/FilterDateForm';
import { handleClassStatus } from '@/store/dashMenu/dashStore';
import { MdManageSearch } from "react-icons/md";
import { TbCalendarSearch } from "react-icons/tb";
import { CohortMain } from '@/interfaces/interface';
import { setAdminOverviewSelectedCohort } from '@/store/filterStore/adminFilStore';
import BlogManagerModal from '@/components/blog/BlogManagerModal';

function OverviewHead() {
  const classStatus = useSelector((state: RootState) => state.dashMenu.classStatus);
  const cohort = useSelector((state: RootState) => state.cohort.cohort);
  const adminActiveCohort = useSelector((state: RootState) => state.adminFilter.adminOverviewSelectedCohort);
  const adminAssignedCohort = useSelector((state: RootState) => state.adminFilter.adminAssignedCohort);
  const dispatch = useDispatch<AppDispatch>();

  const [tabStatus, setTabStatus] = useState<string>('');
  const [convertCohort, setConvertCohort] = useState<CohortMain>();
  const [openBlog, setOpenBlog] = useState(false);

  const handleTabStatus = (tab: string) => { setTabStatus(tab); dispatch(handleClassStatus()); };

  useEffect(() => {
    if (adminActiveCohort) {
      const findCohort = cohort.find((coh) => coh._id === adminActiveCohort);
      setConvertCohort(findCohort);
    }
  }, [adminActiveCohort, cohort]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCohortId = event.target.value;
    dispatch(setAdminOverviewSelectedCohort(selectedCohortId));
  };

  return (
    <>
      <header className='w-full h-fit md:h-[70px] flex items-center justify-between px-[30px] border-t-2 border-b-2 border-accent py-3 md:py-0'>
        <div className="logo">
          <h3 className='font-bold text-xl'>Overview</h3>
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
          <div className="from flex items-center gap-2">
            <form className='p-[4px] border border-shadow rounded-md h-fit'>
              <div className="select_ctrl w-[160px] flex items-center justify-between gap-2">
                <IoFilter className='text-accent' />
                <select value={adminActiveCohort} onChange={handleChange} className='w-full h-[25px] px-2 outline-none border-none text-[12px] rounded-md'>
                  <option disabled value={adminActiveCohort}>{convertCohort?.cohortName}</option>
                  {adminAssignedCohort.map((coh) => (
                    <option className={`${coh.isActive ? 'border-l-green-400 border-l-2' : 'border-l-red-400 border-l-2'}`} key={coh._id} value={coh._id}>
                      {coh.cohortName}
                    </option>
                  ))}
                </select>
              </div>
            </form>
            <button type="button" onClick={() => setOpenBlog(true)} className="h-[30px] px-3 rounded-md border border-accent text-accent text-[12px] hover:bg-accent hover:text-white transition">
              Blog
            </button>
          </div>
        </div>
        {classStatus && <FilterDateForm tabData={tabStatus} />}
      </header>

      {openBlog && (
        <BlogManagerModal
          apiBase={process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}
          onClose={() => setOpenBlog(false)}
        />
      )}
    </>
  );
}

export default OverviewHead;