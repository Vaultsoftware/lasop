// src/app/dashboard/admin/calendar/[_id]/CohBodyDetails.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { IoEyeOutline } from 'react-icons/io5';
import { RootState } from '@/store/store';
import { StudentDataMain } from '@/interfaces/interface';

/**
 * Why: original code imported a React component `StaffMain` as a type, which is unsafe at runtime.
 * Keep a minimal shape consumed by this table to decouple view from component code.
 */
type StaffLite = {
  _id: string;
  firstName?: string;
  lastName?: string;
};

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
  tutors: StaffLite;
}

interface Props {
  _id: string;
  courseTutors: CourseTutors[];
}

type DisplayData = StudentDataMain[] | CourseTutors[];

// Accepts either populated ref { _id }, raw id string, null or undefined
function normalizeCohortId(
  ref: unknown
): string | null {
  if (!ref) return null;
  if (typeof ref === 'string') return ref;
  if (typeof ref === 'object' && ref !== null && '_id' in ref) {
    const val = (ref as { _id?: unknown })._id;
    return typeof val === 'string' ? val : null;
  }
  return null;
}

export default function CohBodyDetails({ _id, courseTutors }: Props) {
  const tab: Array<'student' | 'staff'> = ['student', 'staff'];

  const studentsFromStore = useSelector(
    (state: RootState) => state.student.student
  ) as unknown;

  const students: StudentDataMain[] = Array.isArray(studentsFromStore)
    ? (studentsFromStore as StudentDataMain[])
    : [];

  const [selectedChecklist, setSelectedChecklist] =
    useState<'student' | 'staff'>('student');

  const [dataToDisplay, setDataToDisplay] = useState<DisplayData>([]);

  const handleChecklistChange = (arg: 'student' | 'staff') => {
    setSelectedChecklist(arg);
  };

  const filterStudentsByCohort = (
    studentInCohort: StudentDataMain[],
    cohortId: string
  ): StudentDataMain[] => {
    return studentInCohort.filter((stu) => {
      const normalized = normalizeCohortId(stu.program?.cohortId);
      return normalized === cohortId;
    });
  };

  useEffect(() => {
    if (selectedChecklist === 'student') {
      const filtered = filterStudentsByCohort(students, _id);
      setDataToDisplay(filtered);
    } else {
      setDataToDisplay(Array.isArray(courseTutors) ? courseTutors : []);
    }
  }, [students, selectedChecklist, courseTutors, _id]);

  return (
    <main>
      <div className="academic">
        <div className="academics_list flex gap-5 w-full h-[60px] px-2 rounded-md overflow-x-scroll sm:overflow-hidden whitespace-nowrap sm:whitespace-normal">
          {tab.map((att) => (
            <div
              key={att}
              className={`${
                selectedChecklist === att
                  ? 'border-b-2 border-shadow text-shadow font-semibold'
                  : ''
              } package text-shadow cursor-pointer h-full flex items-center gap-3`}
              onClick={() => handleChecklistChange(att)}
            >
              <span>{att.toUpperCase()}</span>
            </div>
          ))}
        </div>

        <div>
          <table className="w-full border-b border-shadow">
            <thead>
              <tr>
                <th className="text-start py-3 block md:table-cell">S/N</th>
                <th className="text-start py-3 block md:table-cell">NAME</th>
                <th className="text-start py-3 block md:table-cell">CENTER</th>
                <th className="text-start py-3 block md:table-cell">MODE</th>
                <th className="text-start py-3 block md:table-cell">COURSE</th>
              </tr>
            </thead>
            <tbody>
              {dataToDisplay && dataToDisplay.length > 0 ? (
                selectedChecklist === 'student' ? (
                  (dataToDisplay as StudentDataMain[]).map((item, index) => (
                    <tr key={item._id} className="border-t border-shadow text-start">
                      <td className="py-3 block md:table-cell">{index + 1}</td>
                      <td className="py-3 block md:table-cell">
                        {item.firstName} {item.lastName}
                      </td>
                      <td className="py-3 block md:table-cell">
                        {item.program?.center?.title || 'N/A'}
                      </td>
                      <td className="py-3 block md:table-cell">{item.program?.mode || 'N/A'}</td>
                      <td className="py-3 block md:table-cell">
                        {item.program?.courseId?.title || 'N/A'}
                      </td>
                      <td className="py-3 block md:table-cell">
                        <Link
                          href={`/dashboard/admin/students/${item._id}`}
                          className="my-2 p-1 flex items-center gap-1 text-[12px] border border-accent text-accent h-fit w-fit rounded-md cursor-pointer"
                        >
                          <IoEyeOutline />
                          <span>View</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  (dataToDisplay as CourseTutors[]).map((item, index) => (
                    <tr key={`${item.tutors?._id}-${index}`} className="border-t border-shadow text-start">
                      <td className="py-3 block md:table-cell">{index + 1}</td>
                      <td className="py-3 block md:table-cell">
                        {item.tutors?.firstName} {item.tutors?.lastName}
                      </td>
                      <td className="py-3 block md:table-cell">
                        {item.center?.title || 'N/A'}
                      </td>
                      <td className="py-3 block md:table-cell">{item?.mode || 'N/A'}</td>
                      <td className="py-3 block md:table-cell">{item.course?.title || 'N/A'}</td>
                      <td className="py-3 block md:table-cell">
                        <Link
                          href={`/dashboard/admin/staffs/${item.tutors?._id}`}
                          className="my-2 p-1 flex items-center gap-1 text-[12px] border border-accent text-accent h-fit w-fit rounded-md cursor-pointer"
                        >
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
                    {selectedChecklist === 'student'
                      ? 'No students found.'
                      : 'No staff members found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
