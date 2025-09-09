'use client';

import React, { useState } from 'react';
import { VscDiffAdded } from "react-icons/vsc";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { handleCert } from '@/store/dashMenu/dashStore';
import CreateSyllabus from '@/components/dashboardComp/adminComp/syllabus/CreateSyllabus'


function SyllabusHead() {
    const openCert = useSelector((state: RootState) => state.dashMenu.openCert)

    const dispatch = useDispatch<AppDispatch>()
    return (
        <header className='w-full h-fit md:h-[70px] gap-2 flex items-center justify-between px-[30px] border-t-2 border-b-2 border-accent py-3 md:py-0'>
            <div className="logo">
                <h3 className='font-bold text-xl'>Syllabus</h3>
            </div>
            <div className="filter flex items-center gap-3">
                <div onClick={() => dispatch(handleCert())} className="from flex items-center gap-3 p-1 px-2 bg-accent text-cyan-50 rounded-md cursor-pointer">
                    <VscDiffAdded />
                    <span className='text-[14px]'>Create</span>
                </div>
            </div>
            {
                openCert && (
                    <CreateSyllabus />
                )
            }
        </header>
    )
}

export default SyllabusHead