'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { CohortMain } from '@/interfaces/interface';

function CalendarMain() {
    const [cohortId, setCohortId] = useState<string>('66cd6d560d14292ee2136134');
    const [cohortData, setCohortData] = useState<CohortMain[]>([]);

    const handleCohortId = (arg: string) => {
        setCohortId(arg);
    }

    // Getting courses and cohort
    const cohorts = useSelector((state: RootState) => state.cohort.cohort);
    const courses = useSelector((state: RootState) => state.courses.courses);

    useEffect(() => {
        const now = new Date();
        const oneMonthLater = new Date();
        oneMonthLater.setMonth(now.getMonth() + 1);

        const activeCohort = cohorts.filter((coh) => {
            if (coh.isActive) {
                const startDate = new Date(coh.startDate);

                return startDate >= now && startDate <= oneMonthLater
            }
        }).sort((a, b) => new Date(b.startDate).getMonth() - new Date(a.startDate).getMonth());

        const courseCohort = activeCohort.filter((coh) => coh.courseId.some((cou) => cou._id === cohortId))
        setCohortData(courseCohort);
    }, [cohorts, cohortId])

    // Formatting date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

        return formattedDate
    }

    return (
        <main>
            <section className='md:main py-[3rem] px-[30px]'>
                <div>
                    <h1 className='font-bold text-[40px] text-shadow'>Understanding our COHORT code names</h1>
                </div>
                <div>
                    <p>Each COHORT code name is a unique identifier for our course and mode. We use them to help you remember which course is being taught and mode availble for each cohort. Some examples are:</p>
                    <br />
                    <ul className='grid gap-1 text-[14px]'>
                        <li><b className='font-bold'>JAN25FEON</b>: The cohort code for 'Front-end Development (FE)' and mode of studying is online (ON) and (JAN25) stands for the month and year</li>
                        <li><b className='font-bold'>JAN25CSWE</b>: The cohort code for 'Cyber Security (CS)' and mode of studying is Weekend (WE) and (JAN25) stands for the month and year</li>
                        <li><b className='font-bold'>JAN25FEONCSWE</b>: The cohort code for 'Front-end Development (FE)' and mode of studying is online (ON), Cyber Security (CS) and Weekend (WE) and (JAN25) stands for the month and year</li>
                    </ul>
                </div>
                <div className='mt-2'>
                    <p>Below is a table descirbing our code names and their definition</p>
                    <table className='w-full border-b-2 border-shadow'>
                        <thead>
                            <tr>
                                <th className='text-start py-3 block md:table-cell'>CODE NAME</th>
                                <th className='text-start py-3 block md:table-cell'>CODE DESCRIPTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className='border-t border-shadow'>
                                <td className='text-start py-3'>FE</td>
                                <td className='text-start py-3'>Front-end Development</td>
                            </tr>
                            <tr className='border-t border-shadow'>
                                <td className='text-start py-3'>FS</td>
                                <td className='text-start py-3'>Fullstack Development</td>
                            </tr>
                            <tr className='border-t border-shadow'>
                                <td className='text-start py-3'>CS</td>
                                <td className='text-start py-3'>Cyber Security</td>
                            </tr>
                            <tr className='border-t border-shadow'>
                                <td className='text-start py-3'>DS</td>
                                <td className='text-start py-3'>Data Science</td>
                            </tr>
                            <tr className='border-t border-shadow'>
                                <td className='text-start py-3'>DA</td>
                                <td className='text-start py-3'>Data Analysis</td>
                            </tr>
                            <tr className='border-t border-shadow'>
                                <td className='text-start py-3'>PD</td>
                                <td className='text-start py-3'>Product Design</td>
                            </tr>
                            <tr className='border-t border-shadow'>
                                <td className='text-start py-3'>MA</td>
                                <td className='text-start py-3'>Mobile App</td>
                            </tr>
                            <tr className='border-t border-shadow'>
                                <td className='text-start py-3'>WE</td>
                                <td className='text-start py-3'>Weekends</td>
                            </tr>
                            <tr className='border-t border-shadow'>
                                <td className='text-start py-3'>WD</td>
                                <td className='text-start py-3'>Weekdays</td>
                            </tr>
                            <tr className='border-t border-shadow'>
                                <td className='text-start py-3'>ON</td>
                                <td className='text-start py-3'>Online</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
            <section className='md:main py-[3rem] px-[30px]'>
                <div className="academic">
                    <div className="academics_list flex gap-2 border-2 border-shadow w-full sm:w-fit p-2 mx-auto rounded-md overflow-x-scroll sm:overflow-hidden whitespace-nowrap sm:whitespace-normal">
                        {
                            courses.map((cal, ind) => (
                                <div
                                    key={cal._id}
                                    className={cohortId === cal._id ? 'bg-shadow text-cyan-50 package p-2 cursor-pointer' : 'package p-2 border-2 border-shadow text-shadow cursor-pointer'}
                                    onClick={() => handleCohortId(cal._id)}
                                >
                                    <span>{cal.title}</span>
                                </div>
                            ))
                        }
                    </div>

                    <div className="academic_cohort mt-6">
                        <table className='w-full border-b-2 border-shadow'>
                            <thead>
                                <tr >
                                    <th className='text-start py-3 block md:table-cell'>COHORTS</th>
                                    <th className='text-start py-3 block md:table-cell'>STARTS</th>
                                    <th className='text-start py-3 block md:table-cell'>ENDS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    cohortData.map((coh, ind) => (
                                        <tr key={coh._id} className='border-t border-shadow text-start block md:table-row mb-3 md:mb-0'>
                                            <td className='py-3 block md:table-cell'>{coh.cohortName}</td>
                                            <td className='py-3 block md:table-cell'>{formatDate(coh.startDate)}</td>
                                            <td className='py-3 block md:table-cell'>{formatDate(coh.endDate)}</td>
                                            <td className='py-3 flex items-center gap-1 text-[14px]'>
                                                {
                                                    coh.isActive && <Link href='/getStarted' className='flex w-fit h-[40px] bg-shadow text-cyan-50 items-center justify-center rounded-md px-3'>Apply now</Link>
                                                }
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default CalendarMain