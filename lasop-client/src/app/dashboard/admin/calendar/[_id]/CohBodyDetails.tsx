'use client';

import React, { useEffect, useState } from 'react';
import StaffMain from '../../staffs/StaffMain';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { StudentDataMain } from '@/interfaces/interface';
import Link from 'next/link';
import { IoEyeOutline } from 'react-icons/io5';

interface Props {
    _id: string;
    courseTutors: {
        course: {
            _id: string;
            title: string;
            code: string;
            price: string;
            exams: string[];
        };
        center: {
            _id?: string;
            title: string;
        };
        mode: string;
        tutors: StaffMain;
    }[];
}

interface CourseTutors {
    course: {
        _id: string;
        title: string;
        code: string;
        price: string;
        exams: string[];
    };
    center: {
        _id?: string;
        title: string;
    };
    mode: string;
    tutors: StaffMain;
}

function CohBodyDetails({ _id, courseTutors }: Props) {
    const tab: string[] = ['student', 'staff'];

    const students = useSelector((state: RootState) => state.student.student);

    const [selectedChecklist, setSelectedChecklist] = useState<string>('student');
    const handleChecklistChange = (arg: string) => {
        if (arg) {
            setSelectedChecklist(arg);
        }
    };

    // Setting data to be displayed
    const [dataToDisplay, setDataToDisplay] = useState<StudentDataMain[] | CourseTutors[]>();

    const filterTabData = (studentInCohort: StudentDataMain[], checklist: string) => {
        if (checklist === 'student') {
            return studentInCohort.filter((stu) => stu.program.cohortId._id === _id);
        }
        else if (checklist === 'staff') {
            return courseTutors;
        }
    }

    useEffect(() => {
        if (students.length > 0) {
            const filteredStudents = filterTabData(students, selectedChecklist);
            setDataToDisplay(filteredStudents);
        };
    }, [students, selectedChecklist]);

    return (
        <main>
            <div className="academic">
                <div className="academics_list flex gap-5 w-full h-[60px] px-2 rounded-md overflow-x-scroll sm:overflow-hidden whitespace-nowrap sm:whitespace-normal">
                    {
                        tab.map((att, ind) => (
                            <div
                                key={ind}
                                className={`${selectedChecklist === att ? 'border-b-2 border-shadow text-shadow font-semibold' : ''} package text-shadow cursor-pointer h-full flex items-center gap-3`}
                                onClick={() => handleChecklistChange(att)}
                            >
                                <span>{att.toUpperCase()}</span>
                            </div>
                        ))
                    }
                </div>

                <div>
                    <table className='w-full border-b border-shadow'>
                        <thead>
                            <tr>
                                <th className='text-start py-3 block md:table-cell'>S/N</th>
                                <th className='text-start py-3 block md:table-cell'>NAME</th>
                                <th className='text-start py-3 block md:table-cell'>CENTER</th>
                                <th className='text-start py-3 block md:table-cell'>MODE</th>
                                <th className='text-start py-3 block md:table-cell'>COURSE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataToDisplay && dataToDisplay.length > 0 ? (
                                selectedChecklist === "student" ? (
                                    (dataToDisplay as StudentDataMain[]).map((item, index) => (
                                        <tr key={item._id} className='border-t border-shadow text-start'>
                                            <td className="py-3 block md:table-cell">{index + 1}</td>
                                            <td className="py-3 block md:table-cell">{item.firstName} {item.lastName}</td>
                                            <td className="py-3 block md:table-cell">{item.program?.center.title || "N/A"}</td>
                                            <td className="py-3 block md:table-cell">{item.program?.mode}</td>
                                            <td className="py-3 block md:table-cell">{item.program?.courseId?.title || "N/A"}</td>
                                            <td className="py-3 block md:table-cell">
                                                <Link href={`/dashboard/admin/students/${item._id}`} className='my-2 p-1 flex items-center gap-1 text-[12px] border border-accent text-accent h-fit w-fit rounded-md cursor-pointer'>
                                                    <IoEyeOutline />
                                                    <span>View</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    (dataToDisplay as CourseTutors[]).map((item, index) => (
                                        <tr key={index} className='border-t border-shadow text-start'>
                                            <td className="py-3 block md:table-cell">{index + 1}</td>
                                            <td className="py-3 block md:table-cell">{item.tutors?.firstName} {item.tutors?.lastName}</td>
                                            <td className="py-3 block md:table-cell">{item.center?.title || "N/A"}</td>
                                            <td className="py-3 block md:table-cell">{item?.mode}</td>
                                            <td className="py-3 block md:table-cell">{item.course?.title}</td>
                                            <td className="py-3 block md:table-cell">
                                                <Link href={`/dashboard/admin/staffs/${item.tutors?._id}`} className='my-2 p-1 flex items-center gap-1 text-[12px] border border-accent text-accent h-fit w-fit rounded-md cursor-pointer'>
                                                    <IoEyeOutline />
                                                    <span>View</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )
                            ) : (
                                <tr>
                                    <td colSpan={6} className="py-4 text-center text-gray-500">
                                        {selectedChecklist === "student" ? "No students found." : "No staff members found."}
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>
            </div>
        </main>
    )
}

export default CohBodyDetails