'use client';
import React, { useEffect, useState } from 'react';
import { colleague, staffOver } from '@/data/data';
import Image from 'next/image';
import { LuListTodo } from "react-icons/lu";
import user from '../../../../asset/dashIcon/user.png';
import { FiUserCheck } from "react-icons/fi";
import { GrUserExpert } from "react-icons/gr";
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import graduate from '../../../../asset/dashIcon/graduate.png';
import student from '../../../../asset/dashIcon/student.png';
import staff from '../../../../asset/dashIcon/staff.png';
import complete from '../../../../asset/dashIcon/complete.png';
import AttendanceDoughnut from '@/charts/attendanceChart/AttendanceDoughnut';
import { CohortMain } from '@/interfaces/interface';

interface MyObject {
    id: number;
    title: string;
    numCol: number;
    icon: any;
}

interface Chart {
    labels: string[],
    datasets: any[]
}

function OverviewMain() {
    const [getCol, setGetCol] = useState<MyObject[]>([])
    const item: (MyObject | undefined)[] = []

    const staffAssignedCohort = useSelector((state: RootState) => state.staffFilter.staffAssignedCohort);
    const staffActiveCohort = useSelector((state: RootState) => state.staffFilter.staffOverviewSelectedCohort);
    const staffDetail = useSelector((state: RootState) => state.staff.logDetails?._id);

    const cohort = useSelector((state: RootState) => state.cohort.cohort);

    const students = useSelector((state: RootState) => state.student.student);
    const certificates = useSelector((state: RootState) => state.certificate.certificates);

    const classrooms = useSelector((state: RootState) => state.classroom.classroom);

    const dispatch = useDispatch<AppDispatch>()

    // Getting students and graduates under active cohort taken by tutor
    const [studentUnderActiveCoh, setStudentUnderActiveCoh] = useState<number>();
    const [graduatesUnderActiveCoh, setGraduatesUnderActiveCoh] = useState<number>();

    useEffect(() => {
        if (staffActiveCohort) {
            const studentInActiveCohort = students.filter((stu) => stu.program.cohortId._id === staffActiveCohort && stu.program.tutorId._id === staffDetail && (stu.status === 'student' || stu.status === 'graduate'))
            setStudentUnderActiveCoh(studentInActiveCohort.length)

            const graduatesUnderActiveCoh = studentInActiveCohort.filter((stu) => certificates.some((ct) => ct.studentId._id === stu._id));
            setGraduatesUnderActiveCoh(graduatesUnderActiveCoh.length)
        }
    }, [staffActiveCohort])

    // Getting completed cohort by staff
    const [completedCohort, setCompletedCohort] = useState<number>();

    useEffect(() => {
        if (staffAssignedCohort) {
            const getCompletedCoh = staffAssignedCohort.filter((coh) => coh.status === 'completed');
            setCompletedCohort(getCompletedCoh.length)
        }
    }, [staffAssignedCohort])

    // Setting chart data, based on last class attendance, absent student and completed class
    const [completedClassActiveCohort, setCompletedClassActiveCohort] = useState<number>();
    const [attendanceOnLastClass, setAttendanceOnLastClass] = useState<number>();
    const [absentOnLastClass, setAbsentOnLastClass] = useState<number>();

    useEffect(() => {
        if (staffActiveCohort && staffDetail) {
            const getCompletedClass = classrooms.filter((cls) => cls.cohortId._id === staffActiveCohort && cls.tutorId._id === staffDetail && cls.status === 'completed');
            setCompletedClassActiveCohort(getCompletedClass.length);

            const lastCompletedClass = getCompletedClass[getCompletedClass.length - 1];

            if (lastCompletedClass?.attendance) {
                setAttendanceOnLastClass(lastCompletedClass.attendance.length)

                const getAbsentee = students.filter(
                    (student) => !lastCompletedClass.attendance.some((att) => att._id === student._id)
                );

                setAbsentOnLastClass(getAbsentee.length);
            } else {
                setAttendanceOnLastClass(0);
                setAbsentOnLastClass(0);
            }
        }
    }, [staffActiveCohort, staffDetail])

    const attendanceChartData: Chart = {
        labels: [
            'Attended',
            'Completed class',
            'Absent'
        ],
        datasets: [
            {
                label: 'Attendance tracking',
                data: [
                    attendanceOnLastClass === 0 ? 50 : attendanceOnLastClass, 
                    completedClassActiveCohort === 0 ? 50 : completedClassActiveCohort, 
                    absentOnLastClass === 0 ? 50 : absentOnLastClass
                ],
                borderColor: "#5BBE97",
                backgroundColor: ['rgba(83, 187, 129, 1)', 'rgba(45, 69, 255, 1)', 'rgba(255, 0, 0, 1)'],
                borderWidth: 0,
                rotation: 180,
                weight: 50
            }
        ]
    }

    return (
        <main className='w-full p-5'>
            <div className="attend grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="staffs p-3 border border-secondary flex flex-col gap-2 rounded-md">
                    <div>
                        <span className='font-semibold'>No of students</span>
                    </div>
                    <div className='flex justify-between items-center'>
                        <div className="count">
                            <h3 className='font-bold text-[30px] text-shadow'>{studentUnderActiveCoh}</h3>
                        </div>
                        <div className="staff_icon">
                            <Image className='w-[30px] h-[30px]' src={student} alt='' />
                        </div>
                    </div>
                </div>
                <div className="staffs p-3 border border-secondary flex flex-col gap-2 rounded-md">
                    <div>
                        <span className='font-semibold'>Current cohorts</span>
                    </div>
                    <div className='flex justify-between items-center'>
                        <div className="count">
                            <h3 className='font-bold text-[30px] text-shadow'>{staffAssignedCohort.length}</h3>
                        </div>
                        <div className="staff_icon">
                            <Image className='w-[30px] h-[30px]' src={staff} alt='' />
                        </div>
                    </div>
                </div>
                <div className="staffs p-3 border border-secondary flex flex-col gap-2 rounded-md">
                    <div>
                        <span className='font-semibold'>Graduates</span>
                    </div>
                    <div className='flex justify-between items-center'>
                        <div className="count">
                            <h3 className='font-bold text-[30px] text-shadow'>{graduatesUnderActiveCoh}</h3>
                        </div>
                        <div className="staff_icon">
                            <Image className='w-[30px] h-[30px]' src={graduate} alt='' />
                        </div>
                    </div>
                </div>
                <div className="staffs p-3 border border-secondary flex flex-col gap-2 rounded-md">
                    <div>
                        <span className='font-semibold'>Completed cohorts</span>
                    </div>
                    <div className='flex justify-between items-center'>
                        <div className="count">
                            <h3 className='font-bold text-[30px] text-shadow'>{completedCohort}</h3>
                        </div>
                        <div className="staff_icon">
                            <Image className='w-[30px] h-[30px]' src={complete} alt='' />
                        </div>
                    </div>
                </div>
            </div>
            <div className="task grid md:grid-cols-2 gap-3 mt-10">
                <div className="rec p-3 border border-secondary rounded-md h-fit">
                    <div className="rec_head flex justify-between items-center">
                        <div className='flex gap-2 items-center'>
                            <LuListTodo />
                            <h3>Task management</h3>
                        </div>
                        <span className='text-shadow text-[12px]'>
                            See all
                        </span>
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
                <div className="track p-3 border border-secondary rounded-md">
                    <div className="track_head flex justify-between items-center">
                        <div className='flex gap-2 items-center'>
                            <GrUserExpert />
                            <h3>Attendance tracking</h3>
                        </div>
                        <form action="">
                            <select name="" id="">
                                <option value=""></option>
                            </select>
                        </form>
                    </div>
                    <div className="time w-full grid grid-cols-3 gap-2 p-2 bg-slate-400 rounded-[30px] mt-3">
                        <div className="today w-full py-1 shadow-md shadow-slate-800 bg-white text-shadow text-center font-semibold rounded-[30px]">
                            <span>Today</span>
                        </div>
                        <div className="week  w-full py-1 shadow-md shadow-slate-800 bg-white text-shadow text-center font-semibold rounded-[30px]">
                            <span>Week</span>
                        </div>
                        <div className="month  w-full py-1 shadow-md shadow-slate-800 bg-white text-shadow text-center font-semibold rounded-[30px]">
                            <span>Month</span>
                        </div>
                    </div>
                    <div className="chart h-[400px]">
                        <AttendanceDoughnut chartType={attendanceChartData} />
                    </div>
                </div>
            </div>
        </main>
    )
}

export default OverviewMain