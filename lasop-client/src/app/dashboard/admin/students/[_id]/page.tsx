"use client";

import DashHead from '@/components/dashHead/DashHead';
import { RootState, AppDispatch } from '@/store/store';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import StudentIdHead from './StudentIdHead';
import StudentIdMain from './StudentIdMain';
import IssueCert from '@/components/dashboardComp/adminComp/IssueCert';
import { ClassroomMain, StudentDataMain } from '@/interfaces/interface';

interface Params {
    _id: string;
}

interface Props {
    params: Params;
}

function Page({ params }: Props) {
    const [pageData, setPageData] = useState<StudentDataMain | null>(null);
    const router = useRouter();

    const student = useSelector((state: RootState) => state.student.student);
    const certForm = useSelector((state: RootState) => state.dashMenu.openCert);
    const classrooms = useSelector((state: RootState) => state.classroom.classroom);
    const assessment = useSelector((state: RootState) => state.assessment.assessment);
    const project = useSelector((state: RootState) => state.project.project);

    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        if (params._id === undefined) {
            router.push('/');
        } else {
            const data = student.find((stu) => stu._id === params._id)
            setPageData(data || null)
        }
    }, [params, student, router])

    // Fetching classroom details base on student cohortId, courseId, mode, center and tutor
    const [studentClassroom, setStudentClassroom] = useState<ClassroomMain[]>([]);

    useEffect(() => {
        if (classrooms.length > 0 && pageData) {
            const getClassroom = classrooms.filter((cls) => cls.cohortId._id === pageData.program.cohortId._id && cls.courseId._id === pageData.program.courseId._id && cls.center._id === pageData.program.center._id && cls.mode === pageData.program.mode && cls.tutorId._id === pageData.program.tutorId._id)

            setStudentClassroom(getClassroom)
        }
    }, [classrooms, pageData])

    // Fetching completed and attended class by student
    const [completedAttendClass, setCompletedAttendClass] = useState<ClassroomMain[]>([]);
    useEffect(() => {
        if (studentClassroom.length > 0 && pageData) {
            const getCompletedAttendClass = studentClassroom.filter((stu) => stu.status === 'completed' && stu.attendance.find((att) => att._id === pageData._id));

            setCompletedAttendClass(getCompletedAttendClass)
        }
    }, [studentClassroom, pageData]);

    // Fetching next classes
    const [nextClass, setNextClass] = useState<ClassroomMain[]>([]);
    useEffect(() => {
        if (studentClassroom.length > 0 && pageData) {
            const getNextClass = studentClassroom.filter((stu) => stu.status === 'next');

            setNextClass(getNextClass)
        }
    }, [studentClassroom, pageData])

    // Fetching missed classes
    const [missClass, setMissClass] = useState<ClassroomMain[]>([]);
    useEffect(() => {
        if (studentClassroom.length > 0 && pageData) {
            const getMissClass = studentClassroom.filter((stu) => stu.status === 'completed' && !stu.attendance.find((att) => att._id === pageData._id));

            setMissClass(getMissClass)
        }
    }, [studentClassroom, pageData])

    // Function for converting date to string
    const formatDate = (dateString: string | any) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

        return formattedDate
    }

    return (
        <div className='w-full h-full overflow-y-scroll'>
            <DashHead props={{
                username: 'Admin',
                link: 'profile',
                acct: 'admin',
                img: ''
            }} />
            {
                pageData ? (
                    <>
                        <StudentIdHead />
                        <StudentIdMain props={{
                            _id: pageData._id,
                            firstName: pageData.firstName,
                            lName: pageData.lastName,
                            contact: pageData.contact,
                            address: pageData.address,
                            sex: pageData.gender ?? 'N/A',
                            status: pageData.status,
                            regDate: formatDate(pageData.createdAt),
                            cohort: pageData.program.cohortId.cohortName,
                            center: pageData.program.center.title,
                            mode: pageData.program.mode,
                            course: pageData.program.courseId.title,
                            courseDuration: `${Math.floor(
                                (new Date(pageData.program.cohortId.endDate).getFullYear() - new Date(pageData.program.cohortId.startDate).getFullYear()) * 12 +
                                (new Date(pageData.program.cohortId.endDate).getMonth() - new Date(pageData.program.cohortId.startDate).getMonth())
                            )} months`,
                            started: pageData.program?.cohortId?.startDate ? formatDate(pageData.program.cohortId.startDate) : 'N/A',
                            attendance: completedAttendClass.length,
                            left: nextClass.length,
                            absent: missClass.length,
                            assessment: '18%',
                            curPro: '100%',
                            comPro: '20',
                        }} />
                        {
                            certForm && (
                                <IssueCert props={{
                                    studentId: pageData._id || 'N/A',
                                    certTitle: pageData.program.courseId.title
                                }} />
                            )
                        }
                    </>
                ) : (
                    <h1>Loading...</h1>
                )
            }
        </div>
    )
}

export default Page