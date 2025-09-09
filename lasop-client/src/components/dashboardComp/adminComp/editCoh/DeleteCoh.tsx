'use client';

import { useRouter } from 'next/navigation';
import { deleteCohort, fetchCohort } from '@/store/cohortSlice/cohortStore';
import { AppDispatch } from '@/store/store';
import React from 'react'
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { handleDelete } from '@/store/dashMenu/dashStore';

interface Props {
    _id: string;
    cohortName: string;
}

function DeleteCoh({ _id, cohortName }: Props) {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const deleteCoh = async () => {
        if (_id) {
            const response = await dispatch(deleteCohort(_id))

            if(deleteCohort.fulfilled.match(response)) {
                toast.success('Cohort deleted successfully');
                dispatch(fetchCohort());
                dispatch(handleDelete())
                router.push('/dashboard/admin/calendar')
            } else {
                toast.error(response.error.message)
            }
        }
    }
  return (
    <div className='fixed left-0 top-0 w-full h-[100vh] flex justify-center items-center applicant'>
        <div className='px-8 py-5 flex flex-col items-center justify-center gap-4 bg-white rounded-md'>
            <p className='font-semibold text-lg'>Are you sure want to delete {cohortName}</p>
            <div className='flex items-center gap-3'>
                <button onClick={() => dispatch(handleDelete())} className="from text-[12px] p-1 px-2 border border-red-300 rounded-md cursor-pointer">Cancel</button>
                <button onClick={deleteCoh} className="from text-[12px] p-1 px-2 bg-red-600 text-cyan-50 rounded-md cursor-pointer">Delete</button>
            </div>
        </div>
    </div>
  )
}

export default DeleteCoh