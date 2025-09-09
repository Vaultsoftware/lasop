'use client';

import React, { useEffect, useState } from 'react';
import folder from '../../../../asset/dashIcon/folder.png';
import Image from 'next/image';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { CohortMain, ProjectMain, StudentDataMain } from '@/interfaces/interface';

interface Props {
    studentData: StudentDataMain
}

function ProjectInfo({ studentData }: Props) {
    const statusTab: string[] = ['graded', 'ungraded', 'current'];

    // function to display student based on status
    const [status, setStatus] = useState<string>('current')
    const handleDisplayStatus = (arg: string) => {
        setStatus(arg)
    }

    const [studentCohortData, setStudentCohortData] = useState<CohortMain | null>(null);
    const [getProjectCoh, setGetProjectCoh] = useState<ProjectMain[]>([]);
    const [studentProject, setStudentProject] = useState<ProjectMain[]>([]);

    const project = useSelector((state: RootState) => state.project.project);
    const cohort = useSelector((state: RootState) => state.cohort.cohort);

    useEffect(() => {
        const studentCohort = cohort.find((coh) => coh._id === studentData.program.cohortId._id && coh.courseTutors.some((ct) => ct.course._id === studentData.program.courseId._id && ct.center._id === studentData.program.center._id && ct.mode === studentData.program.mode && ct.tutors._id === studentData.program.tutorId._id));

        if (studentCohort) {
            setStudentCohortData(studentCohort);
        }
    }, [cohort, studentData])

    useEffect(() => {
        if (studentCohortData) {
            const projectCohort = project.filter((proCoh) => proCoh.cohortId._id === studentCohortData?._id && studentData.program.courseId._id === proCoh.courseId._id && studentData.program.center._id === proCoh.center._id && studentData.program.mode === proCoh.mode && studentData.program.tutorId._id === proCoh.tutorId._id)

            if (projectCohort) {
                setGetProjectCoh(projectCohort)
            }
            console.log('Project: ', project)
            console.log('ProjectCohort: ', getProjectCoh)
        }
    }, [studentCohortData, project])

    // Fetching assessment data based on selected status
    useEffect(() => {
        if (getProjectCoh.length > 0) {
            if (status === 'current') {
                setStudentProject(getProjectCoh);
            } else if (status === 'graded') {
                const asses = getProjectCoh.filter((ass) => ass.submission.some((sub) => sub.status === 'graded' && sub.studentId._id === studentData._id))
                setStudentProject(asses);
            }
            else {
                const asses = getProjectCoh.filter((ass) => ass.submission.some((sub) => sub.status === 'ungraded' && sub.studentId._id === studentData._id))
                setStudentProject(asses);
            }
        }
    }, [getProjectCoh, status])
    
    return (
        <div>
            <div className="academics_list flex gap-5 w-full h-[60px] px-2 rounded-md overflow-x-scroll sm:overflow-hidden whitespace-nowrap sm:whitespace-normal">
                {
                    statusTab.map((stat, id) => (
                        <div
                            key={id}
                            className={`${status === stat ? 'border-b-2 border-shadow text-shadow font-semibold' : ''} package text-shadow cursor-pointer h-full flex items-center gap-3`}
                            onClick={() => handleDisplayStatus(stat)}
                        >
                            <span>{stat}</span>
                        </div>
                    ))
                }
            </div>
            <div className="syllabus grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                {
                    studentProject.length > 0 ? studentProject.map((pro) => (
                        <div key={pro._id} className="syl_list rounded-md border border-secondary transition-all duration-500 shadow-md hover:border-accent flex flex-col gap-3 overflow-hidden cursor-pointer">
                            <div className='flex items-center justify-between p-3'>
                                <div className="title font-semibold text-[16px] w-[80%]">
                                    {pro.title}
                                </div>
                                <div className="folder">
                                    <Image className='w-[30px] h-[30px]' src={folder} alt='' />
                                </div>
                            </div>
                            <div className='fold w-full text-[12px] flex items-center justify-center p-1 transition-all duration-500 hover:bg-secondary mt-auto'>
                                <span>Click to open folder</span>
                            </div>
                        </div>
                    )) : <div>No {status} project available yet</div>
                }
            </div>
        </div>
    )
}

export default ProjectInfo