'use client';

import { calendar } from '@/data/data';
import { RootState } from '@/store/store';
import React, { useEffect, useState } from 'react';
import { LuPenLine } from "react-icons/lu";
import { useSelector } from 'react-redux';
import { CohortMain, CohortExam, ExamData } from '@/interfaces/interface';

function ExamMain() {
    const [calendarData, setCalendarData] = useState<number>(0);

    const handleCalendarData = (arg: number) => {
        setCalendarData(arg);
    }

    const [examData, setExamData] = useState<ExamData[]>([]);
    const [studentCohortData, setStudentCohortData] = useState<CohortMain | null>(null);
    const [getCohortExam, setGetCohortExam] = useState<CohortExam[]>([])
    const [studentExam, setStudentExam] = useState<ExamData[]>([])

    const cohort = useSelector((state: RootState) => state.cohort.cohort);
    const student = useSelector((state: RootState) => state.student.logDetails);
    const cohortExam = useSelector((state: RootState) => state.exam.cohortExam);
    const exam = useSelector((state: RootState) => state.exam.exam);

    useEffect(() => {
        const studentCohort = cohort.find((coh) => coh._id === student?.program.cohortId._id && coh.courseTutors.some((ct) => ct.course._id === student?.program.courseId._id && ct.center._id === student?.program.center._id && ct.mode === student?.program.mode && ct.tutors._id === student?.program.tutorId._id));

        if (studentCohort) {
            setStudentCohortData(studentCohort);
        }
    }, [cohort, student])

    useEffect(() => {
        if (studentCohortData) {
            const availCohortExam = cohortExam.filter((cls) => cls.cohortId === studentCohortData?._id)
            setGetCohortExam(availCohortExam)
        }
    }, [studentCohortData, cohortExam])

    useEffect(() => {
        if (getCohortExam) {
            const examAvail = exam.filter((e) => getCohortExam.some((getCoh) => getCoh.examId === e._id))
            setExamData(examAvail)
        }
    }, [getCohortExam, exam])

    useEffect(() => {
        if (examData) {
            const exams = examData.filter((ed) => student?.program.courseId === ed.courseId)
            setStudentExam(exams);
        }
    }, [examData, student])

    return (
        <main className='w-full p-5'>
            <div className="academic">
                <div className="academic_cohort mt-4">
                    <table className='w-full border-b border-shadow'>
                        <thead>
                            <tr >
                                <th className='text-start py-3 block md:table-cell'>S/N</th>
                                <th className='text-start py-3 block md:table-cell'>TITLE</th>
                                <th className='text-start py-3 block md:table-cell'>CODE</th>
                                <th className='text-start py-3 block md:table-cell'>STATUS</th>
                                <th className='text-start py-3 block md:table-cell'>DURATION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                studentExam.map((coh, ind) => (
                                    <tr key={ind} className='border-t border-shadow text-start'>
                                        <td className='py-3 block md:table-cell'>{ind + 1}</td>
                                        <td className='py-3 block md:table-cell'>{coh.title}</td>
                                        <td className='py-3 block md:table-cell'>{coh.code}</td>
                                        <td className='py-3 block md:table-cell'>{coh.status}</td>
                                        <td className='py-3 block md:table-cell'>{coh.duration}</td>
                                        <td className='py-3 md:table-cell flex items-center gap-1 text-[12px]'>
                                            <div className='flex items-center justify-center gap-1 px-3 py-1 bg-shadow text-secondary'>
                                                <LuPenLine />
                                                <span>Start exam</span>
                                            </div>
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

export default ExamMain