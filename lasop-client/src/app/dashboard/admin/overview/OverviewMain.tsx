'use client';

import cohort from '../../../../asset/dashIcon/cohort.png';
import center from '../../../../asset/dashIcon/center.png';
import complete from '../../../../asset/dashIcon/complete.png';
import courses from '../../../../asset/dashIcon/course.png';
import graduate from '../../../../asset/dashIcon/graduate.png';
import newApp from '../../../../asset/dashIcon/new.png';
import student from '../../../../asset/dashIcon/student.png';
import staff from '../../../../asset/dashIcon/staff.png';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import user from '../../../../asset/dashIcon/user.png';
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { StudentDataMain, StaffMain, CohortMain } from '@/interfaces/interface';

interface Colleagues {
    id: number;
    title: string;
    numCol?: number;
    icon: any;
}

function OverviewMain() {
    const adminActiveCohort = useSelector((state: RootState) => state.adminFilter.adminOverviewSelectedCohort);
    const cohort = useSelector((state: RootState) => state.cohort.cohort);
    const studentAvail = useSelector((state: RootState) => state.student.student);

    // Converting selected cohort to a full data
    const [convertCohort, setConvertCohort] = useState<CohortMain>();
    useEffect(() => {
        if (adminActiveCohort) {
            const findCohort = cohort.find((coh) => coh._id === adminActiveCohort)
            setConvertCohort(findCohort);
        }
    }, [adminActiveCohort]);

    const [applicants, setApplicants] = useState<StudentDataMain[]>([]);
    const [studentData, setStudentData] = useState<StudentDataMain[]>([]);
    const [graduates, setGraduates] = useState<StudentDataMain[]>([]);

    useEffect(() => {
        if (!convertCohort || !studentAvail.length) return;

        const allStudentInSelectedCohort = studentAvail.filter(
            (stu) => stu.program?.cohortId?._id === convertCohort._id
        );

        setApplicants(allStudentInSelectedCohort.filter((stud) => stud.status === 'applicant'));
        setStudentData(allStudentInSelectedCohort.filter((stud) => stud.status === 'student'));
        setGraduates(allStudentInSelectedCohort.filter((stud) => stud.status === 'graduate'));
    }, [studentAvail, convertCohort]);


    const colleague: Colleagues[] = [
        {
            id: 1,
            title: 'No of students',
            numCol: studentData.length,
            icon: student
        },
        {
            id: 2,
            title: 'No of staffs',
            numCol: convertCohort?.courseTutors.length,
            icon: staff
        },
        {
            id: 3,
            title: 'No of centers',
            numCol: convertCohort?.center.length,
            icon: center
        },
        {
            id: 4,
            title: 'Courses',
            numCol: convertCohort?.courseId.length,
            icon: courses
        },
        {
            id: 5,
            title: 'Current cohorts',
            numCol: cohort.filter((coh) => {
                return coh.status === 'current';
            }).length,
            icon: cohort
        },
        {
            id: 6,
            title: 'Completed cohorts',
            numCol: cohort.filter((coh) => {
                return coh.status === 'completed';
            }).length,
            icon: complete
        },
        {
            id: 7,
            title: 'New applicants',
            numCol: applicants.length,
            icon: newApp
        },
        {
            id: 8,
            title: 'Graduates',
            numCol: graduates.length,
            icon: graduate
        }
    ];

    return (
        <main className='w-full p-5'>
            <div className="staff_info grid grid-cols-2 md:grid-cols-4 gap-3">
                {
                    colleague.map((col) => (
                        <div key={col.id} className="staffs p-3 border border-secondary flex flex-col gap-2 rounded-md">
                            <div>
                                <span className='font-semibold'>{col.title}</span>
                            </div>
                            <div className='flex justify-between items-center'>
                                <div className="count">
                                    <h3 className='font-bold text-[30px] text-shadow'>{col.numCol}</h3>
                                </div>
                                <div className="staff_icon">
                                    <Image className='w-[30px] h-[30px]' src={col.icon} alt='' />
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className="notification grid md:grid-cols-2 lmd:grid-cols-3 gap-3 mt-10">
                <div className="not_list p-3 border border-secondary rounded-md">
                    <div className='flex justify-between'>
                        <h3>Recent payment</h3>
                        <span>See all</span>
                    </div>
                    <div className="not_item flex flex-col gap-3 mt-3">
                        <div className="not flex items-center justify-between p-2 bg-secondary rounded-md">
                            <div className='flex items-center gap-2'>
                                <div>
                                    <Image className='w-[30px] h-[30px]' src={user} alt='' />
                                </div>
                                <div>
                                    <h3 className='font-semibold text-[14px]'>Nathan Kingsley</h3>
                                    <div className='flex items-center gap-2'>
                                        <span className='flex items-center gap-1 text-[10px]'>
                                            <Image className='w-[15px] h-[15px]' src={user} alt='' />
                                            <p>UI/UX</p>
                                        </span>
                                        <span className='flex items-center gap-1 text-[10px]'>
                                            <Image className='w-[15px] h-[15px]' src={user} alt='' />
                                            <p>UI/UX</p>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className='font-bold text-[14px] text-shadow'>N400, 000</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="not_list p-3 border border-secondary rounded-md">
                    <div className='flex justify-between'>
                        <h3>Latest applicants ({applicants.length})</h3>
                        <span>See all</span>
                    </div>
                    <div className="not_item flex flex-col gap-3 mt-3">
                        {
                            applicants.length > 0 ? applicants.slice().reverse().slice(0, 4).map((apply) => (
                                <div key={apply._id} className="not flex items-center justify-between p-2 bg-secondary rounded-md">
                                    <div className='flex items-center gap-2'>
                                        <div>
                                            <Image className='w-[30px] h-[30px]' src={user} alt='' />
                                        </div>
                                        <div>
                                            <h3 className='font-semibold text-[14px]'>{apply.firstName} {apply.lastName}</h3>
                                            <div className='flex items-center gap-2'>
                                                <span className='flex items-center gap-1 text-[10px]'>
                                                    <Image className='w-[15px] h-[15px]' src={user} alt='' />
                                                    <p>{apply.program.courseId.title}</p>
                                                </span>
                                                <span className='flex items-center gap-1 text-[10px]'>
                                                    <Image className='w-[15px] h-[15px]' src={user} alt='' />
                                                    <p>UI/UX</p>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className='font-bold text-[14px] text-shadow'>
                                            <p>{apply.program.courseId.price}</p>
                                        </h4>
                                    </div>
                                </div>
                            )) : (
                                <div>
                                    <p>No new applicants</p>
                                </div>
                            )
                        }
                    </div>
                </div>
                <div className="not_list p-3 border border-secondary rounded-md">
                    <div className='flex justify-between'>
                        <h3>Upcoming events</h3>
                        <span>See all</span>
                    </div>
                    <div className="not_item flex flex-col gap-3 mt-3">
                        <div className="not flex items-center justify-between p-2 bg-secondary rounded-md">
                            <div className='flex items-center gap-2'>
                                <div>
                                    <Image className='w-[30px] h-[30px]' src={user} alt='' />
                                </div>
                                <div>
                                    <h3 className='font-semibold text-[14px]'>Nathan Kingsley</h3>
                                    <div className='flex items-center gap-2'>
                                        <span className='flex items-center gap-1 text-[10px]'>
                                            <Image className='w-[15px] h-[15px]' src={user} alt='' />
                                            <p>UI/UX</p>
                                        </span>
                                        <span className='flex items-center gap-1 text-[10px]'>
                                            <Image className='w-[15px] h-[15px]' src={user} alt='' />
                                            <p>UI/UX</p>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className='font-bold text-[14px] text-shadow'>N400, 000</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default OverviewMain