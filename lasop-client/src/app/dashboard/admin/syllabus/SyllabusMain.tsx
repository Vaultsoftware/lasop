'use client';

import React from 'react';
import folder from '../../../../asset/dashIcon/folder.png';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

function SyllabusMain() {
    const syllabus = useSelector((state: RootState) => state.syllabus.syllabus);

    const handleViewSyllabus = (sylLink: string) => {
        if(sylLink) {
            window.open(sylLink, '_blank')
        }
    }
    return (
        <main className='w-full p-5'>
            <div className="syllabus grid md:grid-cols-4 gap-3">
                {
                    syllabus.map((syl) => (
                        <div onClick={() => handleViewSyllabus(syl.sylFile)} className="syl_list rounded-md border border-secondary transition-all duration-500 shadow-md hover:border-accent flex flex-col gap-3 overflow-hidden cursor-pointer">
                            <div className='flex items-center justify-between p-3'>
                                <div className="title font-semibold text-[25px] w-[60%]">
                                    {syl.sylTitle}
                                </div>
                                <div className="folder">
                                    <Image className='w-[30px] h-[30px]' src={folder} alt='' />
                                </div>
                            </div>
                            <div className='fold w-full text-[12px] flex items-center justify-center p-1 transition-all duration-500 hover:bg-secondary'>
                                <span>Click to open folder</span>
                            </div>
                        </div>
                    )
                    )
                }
            </div>
        </main>
    )
}

export default SyllabusMain