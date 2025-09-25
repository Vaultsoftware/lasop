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
        <main className="calendar_main w-full px-6 md:px-12 py-10 bg-[#DAE2FF]">
            <div className="max-w-6xl mx-auto overflow-x-auto shadow-lg rounded-lg border border-gray-200">
                <table className="min-w-full bg-[white] rounded-lg overflow-hidden">
                    <thead className="bg-accent text-[white]">
                        <tr>
                            <th className="px-6 py-4 text-left text-base font-bold border-r border-white/20">Cohorts</th>
                            <th className="px-6 py-4 text-left text-base font-bold border-r border-white/20">Start Date</th>
                            <th className="px-6 py-4 text-left text-base font-bold">End Date</th>
                        </tr>
                    </thead>

                    <tbody className="text-gray-700 divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 font-medium border-r border-gray-200">Front-end Development</td>
                            <td className="px-6 py-4 border-r border-gray-200">Jan 15, 2025</td>
                            <td className="px-6 py-4">Apr 30, 2025</td>
                        </tr>

                        <tr className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 font-medium border-r border-gray-200">Fullstack Development</td>
                            <td className="px-6 py-4 border-r border-gray-200">Feb 1, 2025</td>
                            <td className="px-6 py-4">May 15, 2025</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 font-medium border-r border-gray-200">Cyber Security</td>
                            <td className="px-6 py-4 border-r border-gray-200">Feb 10, 2025</td>
                            <td className="px-6 py-4">May 25, 2025</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 font-medium border-r border-gray-200">Data Science</td>
                            <td className="px-6 py-4 border-r border-gray-200">Mar 1, 2025</td>
                            <td className="px-6 py-4">Jun 10, 2025</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 font-medium border-r border-gray-200">Data Analysis</td>
                            <td className="px-6 py-4 border-r border-gray-200">Mar 15, 2025</td>
                            <td className="px-6 py-4">Jun 30, 2025</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 font-medium border-r border-gray-200">Product Design</td>
                            <td className="px-6 py-4 border-r border-gray-200">Apr 5, 2025</td>
                            <td className="px-6 py-4">Jul 20, 2025</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 font-medium border-r border-gray-200">Mobile App Development</td>
                            <td className="px-6 py-4 border-r border-gray-200">Apr 20, 2025</td>
                            <td className="px-6 py-4">Aug 1, 2025</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 font-medium border-r border-gray-200">Weekends Cohort</td>
                            <td className="px-6 py-4 border-r border-gray-200">May 3, 2025</td>
                            <td className="px-6 py-4">Aug 15, 2025</td>
                        </tr>
                        <tr className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 font-medium border-r border-gray-200">Weekdays</td>
                            <td className="px-6 py-4 border-r border-gray-200">May 10, 2025</td>
                            <td className="px-6 py-4">Aug 25, 2025</td>
                        </tr>

                        <tr className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 font-medium border-r border-gray-200">Online</td>
                            <td className="px-6 py-4 border-r border-gray-200">May 10, 2025</td>
                            <td className="px-6 py-4">Aug 25, 2025</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </main>
    )
}

export default CalendarMain