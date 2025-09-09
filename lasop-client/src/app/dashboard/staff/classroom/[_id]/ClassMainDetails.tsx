'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { StudentDataMain } from '@/interfaces/interface';
import ReactPaginate from 'react-paginate';

interface Props {
    attendance: StudentDataMain[];
    course: {
        _id: string;
        title: string;
        code: string;
        price: string;
        exams: string[];
    };
}

function ClassMainDetails({ attendance, course }: Props) {
    const attendanceList: string[] = ['attended', 'absent'];

    const staffDetail = useSelector((state: RootState) => state.staff.logDetails?._id);
    const staffActiveCohort = useSelector((state: RootState) => state.staffFilter.staffStudentsSelectedCohort);
    const students = useSelector((state: RootState) => state.student.student);

    const [selectedChecklist, setSelectedChecklist] = useState<string>('attended');
    const [studentInCohort, setStudentInCohort] = useState<StudentDataMain[]>([]);
    const [attendanceStudent, setAttendanceStudent] = useState<StudentDataMain[]>([]);

    const filterStudentsByChecklist = (studentsInCohort: StudentDataMain[], checklist: string): StudentDataMain[] => {
        if (checklist === 'attended') {
            return studentsInCohort.filter((stu) => attendance.some((attStu) => attStu._id === stu._id));
        } else {
            return studentsInCohort.filter((stu) => !attendance.some((attStu) => attStu._id === stu._id));
        }
    };

    useEffect(() => {
        if (staffDetail && staffActiveCohort && students?.length > 0) {
            const cohortStudents = students.filter(
                (s) => s.program.cohortId._id === staffActiveCohort && s.program.tutorId._id === staffDetail && s.program.courseId._id === course._id
            );
            setStudentInCohort(cohortStudents);
        }
    }, [staffDetail, staffActiveCohort, students]);

    useEffect(() => {
        if (studentInCohort.length > 0) {
            const filteredStudents = filterStudentsByChecklist(studentInCohort, selectedChecklist);
            setAttendanceStudent(filteredStudents);
        }
    }, [studentInCohort, selectedChecklist, attendance]);

    const handleChecklistChange = (arg: string) => {
        if (arg) {
            setSelectedChecklist(arg);
        }
    };

    // Pagination
    const [pageNumber, setPageNumber] = useState<number>(0)

    const studentPerPage = 10;
    const pageVisited = pageNumber * studentPerPage;

    const displayPrvClass = attendanceStudent.slice(pageVisited, pageVisited + studentPerPage).map((coh) => {
        return (
            <tr key={coh._id} className='border-t border-shadow text-start block md:table-row mb-3 md:mb-0'>
                <td className='py-3 block md:table-cell'>{coh.firstName} {coh.lastName}</td>
            </tr>
        )
    })

    const changePage = ({ selected }: any) => {
        setPageNumber(selected)
    }

    return (
        <main>
            <div className="academic">
                <div className="academics_list flex gap-5 w-full h-[60px] px-2 rounded-md overflow-x-scroll sm:overflow-hidden whitespace-nowrap sm:whitespace-normal">
                    {
                        attendanceList.map((att, ind) => (
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

                <div className="academic_cohort mt-4">
                    <table className='w-full border-b border-shadow'>
                        <thead>
                            <tr>
                                <th className='text-start py-3 block md:table-cell'>NAME</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                attendanceStudent.length > 0 ? displayPrvClass : <div>No attendance details yet</div>
                            }
                        </tbody>
                    </table>
                    <ReactPaginate
                        previousLabel='Previous'
                        nextLabel='Next'
                        breakLabel="..."
                        pageCount={Math.ceil(attendanceStudent.length / studentPerPage)}
                        onPageChange={changePage}
                        containerClassName='paginationBtn'
                        previousLinkClassName='prvBtn'
                        nextLinkClassName='nxtBtn'
                        disabledClassName='dsbBtn'
                        activeClassName='actBtn'
                    />
                </div>
            </div>
        </main>
    )
}

export default ClassMainDetails