'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { CiMenuKebab } from "react-icons/ci";
import logo from '../../../../../asset/form/form.jpeg';
import { fetchCohort, updateCohortDet } from '@/store/cohortSlice/cohortStore';
import { CohortResponsePayload } from '@/interfaces/interface';
import { toast } from 'react-toastify';
import { handleDelete, handleEdit, handleShare } from '@/store/dashMenu/dashStore';
import EditCoh from '@/components/dashboardComp/adminComp/editCoh/EditCoh';
import DeleteCoh from '@/components/dashboardComp/adminComp/editCoh/DeleteCoh';

interface Props {
    _id: string;
    cohortName: string;
    startDate: string;
    endDate: string;
    mode: string[];
    center: {
        _id?: string;
        title: string;
    }[];
    status: string;
    isActive: boolean;
}

function CohHeadDetails({ _id, cohortName, startDate, endDate, mode, center, status, isActive }: Props) {
    const deleteBool = useSelector((state: RootState) => state.dashMenu.delete);
    const editBool = useSelector((state: RootState) => state.dashMenu.edit);
    const shareBool = useSelector((state: RootState) => state.dashMenu.share);

    const dispatch = useDispatch<AppDispatch>();
    // Formatting date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

        return formattedDate
    }

    const activateCohort = async () => {
        const updateCohort = { isActive: true, status: 'current' };
        const cohortIdDet = _id
        try {
            if (cohortIdDet && isActive === false) {
                const response = await dispatch(updateCohortDet({ updateCohort, cohortIdDet }))

                if (updateCohortDet.fulfilled.match(response)) {
                    const payload = response.payload as CohortResponsePayload;
                    toast.success(payload.message || 'Cohort activated');
                    dispatch(fetchCohort());
                }
                else {
                    toast.error(response.error?.message);
                }
            }
            else if (isActive) {
                toast.info('Cohort is already active');
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    // Displaying edit menu
    const [displayEditMenu, setDisplayEditMenu] = useState<boolean>(false);

    const handleDisplayEdit = () => {
        setDisplayEditMenu(!displayEditMenu)
    }

    return (
        <header className='w-full h-fit py-5 block md:flex items-center gap-8'>
            <div>
                <Image className='w-[100px] h-[100px] rounded-md object-cover' src={logo} alt='' />
            </div>
            <div>
                <div>
                    <h3 className=''>{cohortName}</h3>
                    <div className='flex flex-col md:flex-row md:items-center gap-1 md:gap-3 mt-2'>
                        <div>
                            <p className='text-[12px] font-semibold'>Start date: {formatDate(startDate)}</p>
                        </div>
                        <div>
                            <p className='text-[12px] font-semibold'>End date: {formatDate(endDate)}</p>
                        </div>
                        <div>
                            <p className='text-[12px] font-semibold'>Status: {status}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-3 mt-2'>
                        <div>
                            <p className='text-[12px] font-semibold'>Mode: {
                                mode.map((mod, ind) => (
                                    <React.Fragment key={ind}>
                                        {mod}
                                        {ind < mode.length - 1 && ' | '}
                                    </React.Fragment>
                                ))
                            }
                            </p>
                        </div>
                        <div>
                            <p className='text-[12px] font-semibold'>Center: {
                                center.map((mod, ind) => (
                                    <React.Fragment key={mod._id}>
                                        {mod.title}
                                        {ind < mode.length - 1 && ' | '}
                                    </React.Fragment>
                                ))
                            }
                            </p>
                        </div>
                    </div>
                    <div className='mt-3 flex items-center gap-3'>
                        <button onClick={activateCohort} className={`from text-[12px] p-1 px-2 ${isActive ? 'bg-slate-400 text-cyan-50' : 'bg-green-400 text-cyan-50'} rounded-md cursor-pointer`}>Activate</button>
                        <button className="from text-[12px] p-1 px-2 bg-accent text-cyan-50 rounded-md cursor-pointer">Update status</button>
                        <div className='relative'>
                            <div onClick={handleDisplayEdit} className='w-[25px] h-[25px] flex items-center justify-center border border-accent rounded-md'>
                                <CiMenuKebab />
                            </div>
                            {displayEditMenu && <div className='p-2 bg-white shadow-md rounded-md grid gap-1 text-[12px] absolute top-[30px]'>
                                <div onClick={() => dispatch(handleEdit())} className='cursor-pointer'>
                                    <span>Edit</span>
                                </div>
                                <div onClick={() => dispatch(handleShare())} className='cursor-pointer'>
                                    <span>Share</span>
                                </div>
                                <div onClick={() => dispatch(handleDelete())} className='cursor-pointer'>
                                    <span>Delete</span>
                                </div>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
            {
                editBool && <EditCoh
                    _id={_id}
                    cohortName={cohortName}
                    startDate={startDate}
                    endDate={endDate}
                />
            }
            {
                deleteBool && <DeleteCoh
                    _id={_id}
                    cohortName={cohortName}
                />
            }
        </header >
    )
}

export default CohHeadDetails