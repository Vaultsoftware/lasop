'use client';

import { fetchCohort, updateCohortDet } from '@/store/cohortSlice/cohortStore';
import { AppDispatch, RootState } from '@/store/store';
import React, { useEffect, useState } from 'react';
import { GoDot } from "react-icons/go";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { CohortResponsePayload, CohortMain } from '@/interfaces/interface';
import Link from 'next/link';
import { IoEyeOutline } from 'react-icons/io5';
import ReactPaginate from 'react-paginate';

function CalDashMain() {
    const [cohortId, setCohortId] = useState<string>('66cd6d560d14292ee2136134');
    const [cohortData, setCohortData] = useState<CohortMain[]>([]);

    const handleCohortId = (arg: string) => {
        setCohortId(arg);
    }

    const dispatch = useDispatch<AppDispatch>()

    // Getting courses and cohort
    const cohorts = useSelector((state: RootState) => state.cohort.cohort);
    const courses = useSelector((state: RootState) => state.courses.courses);

    useEffect(() => {
        const courseCohort = cohorts.filter((coh) => coh.courseId.some((cou) => cou._id === cohortId))
        setCohortData(courseCohort);
    }, [cohorts, cohortId])

    // Formatting date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

        return formattedDate
    }

    // Pagination
    const [pageNumber, setPageNumber] = useState<number>(0);

    const calPage = 10;
    const pageVisited = pageNumber * calPage;

    const displayPrvPage = cohortData.slice(pageVisited, pageVisited + calPage).slice().reverse().map((coh, ind) => {
        return (
            <tr key={coh._id} className='border-t border-shadow text-start block md:table-row mb-3 md:mb-0 relative'>
                <td className='py-3 block md:table-cell'>{coh.cohortName}</td>
                <td className='py-3 block md:table-cell'>{formatDate(coh.startDate)}</td>
                <td className='py-3 block md:table-cell'>{formatDate(coh.endDate)}</td>
                <td className='py-3 block md:table-cell'>{coh.isActive ? 'Active' : 'Inactive'}</td>
                <Link href={`/dashboard/admin/calendar/${coh._id}`} className='my-2 p-1 flex items-center gap-1 text-[12px] border border-accent text-accent h-fit w-fit rounded-md cursor-pointer'>
                    <IoEyeOutline />
                    <span>View</span>
                </Link>
            </tr>
        )
    })

    const changePage = ({ selected }: any) => {
        setPageNumber(selected);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return (
        <main className='w-full p-5'>
            <div className="academic">
                <div className="academics_list flex items-center gap-5 border-b w-full h-[60px] rounded-md overflow-x-scroll scrollbar-thin whitespace-nowrap">
                    {
                        courses.map((cal) => (
                            <div
                                key={cal._id}
                                className={`${cohortId === cal._id ? 'border-b-2 border-shadow text-shadow font-semibold' : ''}package text-shadow cursor-pointer h-full flex items-center gap-3`}
                                onClick={() => handleCohortId(cal._id)}
                            >
                                <span>{cal.title}</span>
                            </div>
                        ))
                    }
                </div>

                <div className="academic_cohort mt-4">
                    <table className='w-full border-b border-shadow block md:table'>
                        <thead className="hidden md:table-header-group">
                            <tr >
                                <th className='text-start py-3 block md:table-cell'>COHORTS</th>
                                <th className='text-start py-3 block md:table-cell'>STARTS</th>
                                <th className='text-start py-3 block md:table-cell'>ENDS</th>
                                <th className='text-start py-3 block md:table-cell'>STATUS</th>
                            </tr>
                        </thead>
                        <tbody className="block md:table-row-group">
                            {
                                cohortData.length > 0 ? displayPrvPage : <tr><td colSpan={4}>No Cohort available for selected course</td></tr>
                            }
                        </tbody>
                    </table>
                    <ReactPaginate
                        previousLabel='Previous'
                        nextLabel='Next'
                        breakLabel="..."
                        pageCount={Math.ceil(cohortData.length / calPage)}
                        onPageChange={changePage}
                        containerClassName='paginationBtn'
                        previousLinkClassName='prvBtn'
                        nextLinkClassName='nxtBtn'
                        disabledClassName='dsbBtn'
                        activeClassName='actBtn'
                    />
                </div>
            </div>
        </main>
    )
}

export default CalDashMain