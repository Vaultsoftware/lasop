'use client';

import { calendar } from '@/data/data';
import React, { useState } from 'react';
import { GoDot } from "react-icons/go";


function ResultMain() {
    const [calendarData, setCalendarData] = useState<number>(0);

    const handleCalendarData = (arg: number) => {
        setCalendarData(arg);
    }

    return (
        <main className='w-full p-5'>
            <div className="academic">
                <div className="academics_list flex gap-2 border-b w-full p-2 rounded-md overflow-x-scroll sm:overflow-hidden whitespace-nowrap sm:whitespace-normal">
                    {
                        calendar.map((cal, ind) => (
                            <div
                                key={cal.id}
                                className={calendarData === ind ? 'bg-shadow text-cyan-50 package p-2 cursor-pointer' : 'package p-2 text-shadow cursor-pointer'}
                                onClick={() => handleCalendarData(ind)}
                            >
                                <span>{cal.course}</span>
                            </div>
                        ))
                    }
                </div>

                <div className="academic_cohort mt-4">
                    <table className='w-full border-b border-shadow'>
                        <thead>
                            <tr >
                                <th className='text-start py-3 block md:table-cell'>COHORTS</th>
                                <th className='text-start py-3 block md:table-cell'>CODE</th>
                                <th className='text-start py-3 block md:table-cell'>STARTS</th>
                                <th className='text-start py-3 block md:table-cell'>ENDS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                calendar[calendarData].cohort.map((coh, ind) => (
                                    <tr key={ind} className='border-t border-shadow text-start'>
                                        <td className='py-3 block md:table-cell'>{coh.days}</td>
                                        <td className='py-3 block md:table-cell'>{coh.code}</td>
                                        <td className='py-3 block md:table-cell'>{coh.start}</td>
                                        <td className='py-3 block md:table-cell'>{coh.end}</td>
                                        <td className='py-3 md:table-cell flex items-center gap-1 text-[12px]'>
                                            <GoDot />
                                            <GoDot />
                                            <GoDot />
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    )
}

export default ResultMain