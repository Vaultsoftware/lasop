'use client';

import React from 'react';
import { IoFilter } from "react-icons/io5";
import { VscDiffAdded } from "react-icons/vsc";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { handleProject } from '@/store/dashMenu/dashStore';
import ProjectForm from '@/components/dashboardComp/staffComp/project/ProjectForm';

interface Props {
    title: string;
}

function ProjectDetHead({title}: Props) {
    const createProject = useSelector((state: RootState) => state.dashMenu.project);
    const dispatch = useDispatch<AppDispatch>();

    return (
        <header className='w-full h-[70px] flex items-center justify-between px-[30px] border-t-2 border-b-2 border-accent'>
            <div className="logo">
                <h3 className='font-bold text-[14px] md:text-xl'>Project / {title}</h3>
            </div>
            <div className="filter flex items-center gap-3">
                <div className="from flex items-center gap-2">
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

export default ProjectDetHead