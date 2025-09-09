'use client';

import React, { FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { MdClose } from "react-icons/md";
import { fetchCohort, updateCohortDet } from '@/store/cohortSlice/cohortStore';
import { toast } from 'react-toastify';
import { handleEdit } from '@/store/dashMenu/dashStore';

interface Props {
    _id: string;
    cohortName: string;
    startDate: string;
    endDate: string;
}

interface Data {
    cohortName: string;
    startDate: string;
    endDate: string;
}

function EditCoh({ _id, cohortName, startDate, endDate }: Props) {
    // Dispatch
    const dispatch = useDispatch<AppDispatch>();

    // Storing form data
    const [updateCohort, setUpdateCohort] = useState<Data>({
        cohortName: cohortName,
        startDate: startDate,
        endDate: endDate
    })

    // Storing error data
    const [error, setError] = useState<Partial<Data>>({})

    // Handling form data change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setUpdateCohort((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    // function for validating data
    const validateData = () => {
        const newErr: Partial<Data> = {};

        if (!updateCohort.cohortName.trim()) {
            newErr.cohortName = 'Cohortname is required'
        }
        if (!updateCohort.startDate.trim()) {
            newErr.startDate = 'Start date is required'
        }
        if (!updateCohort.endDate.trim()) {
            newErr.endDate = 'End date is required'
        }

        setError(newErr);
        return Object.keys(newErr).length === 0;
    }

    // Function for updating cohort
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            if (validateData()) {
                if (_id) {
                    const cohortIdDet = _id;
                    const response = await dispatch(updateCohortDet({ updateCohort, cohortIdDet }))
                    if (updateCohortDet.fulfilled.match(response)) {
                        toast.success('Cohort data updated successfully');
                        dispatch(fetchCohort())
                    }
                    else {
                        toast.error(response.error.message)
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='fixed left-0 top-0 w-full h-[100vh] flex justify-center items-center applicant'>
            <div className='w-[70vw] md:w-[40vw] h-[100vh] py-3 bg-white  ml-auto'>
                <div className='flex items-center gap-2 p-2'>
                    <div onClick={() => dispatch(handleEdit())} className='w-[25px] h-[25px] flex items-center justify-center text-cyan-100 bg-accent rounded-sm'>
                        <MdClose />
                    </div>
                    <h3 className='font-semibold'>Edit Calendar</h3>
                </div>

                <div>
                    <form className='p-3' action="" onSubmit={handleSubmit}>
                        <div className='grid gap-3'>
                            <div className='grid gap-2'>
                                <label htmlFor="" className='text-[12px]'>Cohort name</label>
                                <input
                                    className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md'
                                    value={updateCohort.cohortName}
                                    type="text"
                                    name="cohortName"
                                    onChange={handleChange}
                                    id=""
                                />
                                {error.cohortName && <span className='text-red-500 text-xs'>{error.cohortName}</span>}
                            </div>
                            <div className='grid gap-2'>
                                <label htmlFor="" className='text-[12px]'>Start date</label>
                                <input
                                    className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md'
                                    value={updateCohort.startDate}
                                    type="date"
                                    name="startDate"
                                    onChange={handleChange}
                                    id=""
                                />
                                {error.startDate && <span className='text-red-500 text-xs'>{error.startDate}</span>}
                            </div>
                            <div className='grid gap-2'>
                                <label htmlFor="" className='text-[12px]'>End date</label>
                                <input
                                    className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md'
                                    value={updateCohort.endDate}
                                    type="date"
                                    name="endDate"
                                    onChange={handleChange}
                                    id=""
                                />
                                {error.endDate && <span className='text-red-500 text-xs'>{error.endDate}</span>}
                            </div>
                        </div>
                        <div className='w-ful mt-6'>
                            <button type='submit' className='w-full h-[35px] bg-accent text-cyan-50 rounded-md'>Update Cohort</button>
                        </div>
                    </form>
                </div>
            </div>
        </div >
    )
}

export default EditCoh