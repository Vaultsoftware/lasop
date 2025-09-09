'use client';

import React, { useState, useEffect } from 'react';
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { MdClose } from "react-icons/md";
import { handleAttendance } from '@/store/dashMenu/dashStore';
import { fetchClassroom, postAttendance } from '@/store/classroomStore/classroomStore';
import { toast } from 'react-toastify';
import { ClassroomMain, StudentDataMain } from '@/interfaces/interface';

interface Props {
  _id: string;
}

interface UpdateAttendance {
  classId: string;
  attendance: string[];
}

interface ResponsePayload {
  message: string;
}

function AttendanceForm({ _id }: Props) {
  const staffDetail = useSelector((state: RootState) => state.staff.logDetails?._id);
  const staffActiveCohort = useSelector((state: RootState) => state.staffFilter.staffStudentsSelectedCohort);
  const classrooms = useSelector((state: RootState) => state.classroom.classroom);

  const students = useSelector((state: RootState) => state.student.student);

  const dispatch = useDispatch<AppDispatch>();

  // Filtering classes that has been completed for attendance
  const [completedClassForAttendance, setCompletedClassForAttendance] = useState<ClassroomMain>();

  useEffect(() => {
    if (staffActiveCohort && staffDetail) {
      const allNextClasses = classrooms.find((cls) => cls.cohortId._id === staffActiveCohort && cls._id === _id && cls.tutorId._id === staffDetail && cls.status === 'completed');
      setCompletedClassForAttendance(allNextClasses);
    }
  }, [staffActiveCohort, staffDetail])

  // Filtering students in selected/active cohort
  const [studentInCohort, setStudentInCohort] = useState<StudentDataMain[]>([]);
  useEffect(() => {
    if (staffDetail && staffActiveCohort && students?.length > 0 && completedClassForAttendance) {
      const cohortStudents = students.filter(
        (s) => s.program.cohortId._id === staffActiveCohort && s.program.tutorId._id === staffDetail && s.program.courseId._id === completedClassForAttendance?.courseId._id && (s.status === 'student' || s.status === 'graduate') && !completedClassForAttendance.attendance.some((att) => att._id === s._id)
      );
      setStudentInCohort(cohortStudents);
    }
  }, [staffDetail, staffActiveCohort, students, completedClassForAttendance]);

  // submitting attendance detail
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const handleCheckboxChange = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStudents.length === 0) {
      alert("Please select at least one student.");
      return;
    }
    const attendanceData: UpdateAttendance = {
      classId: _id,
      attendance: selectedStudents,
    };
    const response = await dispatch(postAttendance(attendanceData));

    if (postAttendance.fulfilled.match(response)) {
      const payload = response.payload as ResponsePayload;

      toast.success(payload.message);

      setSelectedStudents([]);
      dispatch(fetchClassroom())
      dispatch(handleAttendance());
    }
    else {
      toast.error(response.error?.message);
    }
  };

  return (
    <div className='fixed top-0 left-0 w-full h-[100vh] applicant'>
      {
        completedClassForAttendance && (completedClassForAttendance.attendance?.length === 0 && completedClassForAttendance.status === 'completed') ? (
          <div className='w-[70vw] md:w-[30vw] h-[100vh] overflow-y-auto bg-white ml-auto p-3'>
            <div onClick={() => dispatch(handleAttendance())} className='w-[25px] h-[25px] flex items-center justify-center text-cyan-100 bg-accent ml-auto rounded-sm mr-3'>
              <MdClose />
            </div>
            <form onSubmit={handleSubmit} className='w-full h-fit mt-3'>
              <div className='w-full h-[300px] overflow-y-auto p-2'>
                {
                  completedClassForAttendance ? studentInCohort.map((stu) => (
                    <div className='flex items-center gap-3'>
                      <input type="checkbox"
                        value={stu._id}
                        checked={selectedStudents.includes(stu._id)}
                        onChange={() => handleCheckboxChange(stu._id)}
                      />
                      <label htmlFor="">{stu.firstName} {stu.lastName}</label>
                    </div>
                  )) : <div>Class is yet to be completed</div>
                }
              </div>
              <div>
                {completedClassForAttendance && <button className=' py-1 w-full bg-accent text-cyan-50 rounded-md cursor-pointer mt-5'>Mark attendance</button>}
              </div>
            </form>
          </div>
        ) : <div className='w-[70vw] md:w-[30vw] h-full bg-white ml-auto p-3'>
          <div onClick={() => dispatch(handleAttendance())} className='w-[25px] h-[25px] flex items-center justify-center text-cyan-100 bg-accent ml-auto rounded-sm mr-3'>
            <MdClose />
          </div>
          <div className='flex items-center justify-center mt-4'>
            <p>Attendance has been marked for this class or it has a status of next / cancelled / missed / rescheduled</p>
          </div>
        </div>
      }
    </div>
  )
}

export default AttendanceForm