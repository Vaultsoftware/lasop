'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { MdClose } from "react-icons/md";
import { MdAssignmentAdd } from "react-icons/md";
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchAssessment, postAssessment } from '@/store/assessmentStore/assessmentStore';
import { handleAttendance } from '@/store/dashMenu/dashStore';
import { CohortMain } from '@/interfaces/interface';

interface OtherInfo {
    fName: string;
    lName: string;
    contact: string;
    address: string;
}

interface OtherInfoData {
    id?: string;
    staffId: string;
    kin: OtherInfo;
    guarantor1: OtherInfo;
    guarantor2: OtherInfo;
}

interface CourseTutor {
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
    tutors: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        contact: string;
        address: string;
        dateOfEmploy: string;
        salary: string;
        password: string;
        otherInfo: OtherInfoData[];
        role: string;
        enrol: string;
        status: string;
        createdAt: string;
    };
};

interface Assessment {
    title: string;
    instruction: string;
    dueDate: string;
    cohortId: string;
    courseId: string;
    center: string;
    mode: string;
    tutorId: string;
}

interface ResponsePayload {
    message: string;
}

function AssessmentForm() {
    const dispatch = useDispatch<AppDispatch>();
    const staffDetail = useSelector((state: RootState) => state.staff.logDetails)
    const cohort = useSelector((state: RootState) => state.cohort.cohort);

    const [assignedCohort, setAssignedCohort] = useState<CohortMain[]>([]);
    const [selectedCohort, setSelectedCohort] = useState<CohortMain | undefined>(undefined);
    const [staffMode, setStaffMode] = useState<CourseTutor[]>([]);

    const [assessmentData, setAssessmentData] = useState<Assessment>({
        title: '',
        instruction: '',
        dueDate: '',
        cohortId: '',
        courseId: '',
        center: '',
        mode: '',
        tutorId: staffDetail?._id as string
    })
    const [error, setError] = useState<Partial<Assessment>>({});

    const validate = () => {
        const newError: Partial<Assessment> = {};

        if (!assessmentData.title) {
            newError.title = 'Title is required';
        }
        if (!assessmentData.instruction) {
            newError.instruction = 'Instruction is required';
        }
        if (!assessmentData.dueDate) {
            newError.dueDate = 'Due date is required';
        }
        if (!assessmentData.cohortId) {
            newError.cohortId = 'Cohort is required';
        }
        if (!assessmentData.courseId) {
            newError.courseId = 'Course is required';
        }
        if (!assessmentData.center) {
            newError.center = 'Center is required';
        }
        if (!assessmentData.mode) {
            newError.mode = 'Mode is required';
        }

        setError(newError);
        return Object.keys(newError).length === 0;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setAssessmentData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            if (validate()) {
                const response = await dispatch(postAssessment(assessmentData))

                if (postAssessment.fulfilled.match(response)) {
                    const payload = response.payload as ResponsePayload;
                    toast.success(payload.message);
                    dispatch(fetchAssessment());
                    dispatch(handleAttendance())

                    setAssessmentData({
                        title: '',
                        instruction: '',
                        dueDate: '',
                        cohortId: '',
                        courseId: '',
                        center: '',
                        mode: '',
                        tutorId: ''
                    });
                }
                else {
                    toast.error(response.error?.message);
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    // Effect to filter and assign cohorts based on the logged-in staff's ID
    useEffect(() => {
        if (cohort.length > 0 && staffDetail) {
            const getCohort = cohort.filter((coh) => coh.courseTutors.some((ct) => ct.tutors._id === staffDetail._id)
            );
            setAssignedCohort(getCohort);
        }
    }, [cohort, staffDetail])

    // Effect to find and set the selected cohort based on the cohortId in the assessment data
    useEffect(() => {
        const getCohort = assignedCohort.find((ascho) => ascho._id === assessmentData.cohortId)
        setSelectedCohort(getCohort);

    }, [assignedCohort, assessmentData.cohortId])

    // Effect to determine the logged-in staff's assigned mode in the selected cohort
    useEffect(() => {
        const getStaffAssigned = selectedCohort?.courseTutors.filter((ct) => ct.tutors._id === staffDetail?._id) || [];
        setStaffMode(getStaffAssigned)
    }, [selectedCohort, staffDetail])

    return (
        <div className='fixed left-0 top-0 w-full h-[100vh] px-3 flex justify-center items-center applicant'>
            <div className=' w-full md:w-[400px] h-[400px] overflow-y-scroll py-3 bg-white rounded-lg'>
                <div onClick={() => dispatch(handleAttendance())} className='w-[25px] h-[25px] flex items-center justify-center text-cyan-100 bg-accent ml-auto rounded-sm mr-3'>
                    <MdClose />
                </div>
                <div className='w-full flex gap-2 items-center text-accent px-3 pb-3 border-b border-accent'>
                    <MdAssignmentAdd />
                    <span>Create Assignment</span>
                </div>
                <form onSubmit={handleSubmit} action="" className='w-full px-3 pt-3'>
                    <div className='w-full grid gap-3'>
                        <div className='w-full grid gap-2'>
                            <label htmlFor="" className='text-[12px]'>Assignment title</label>
                            <input onChange={handleChange} value={assessmentData.title} className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md' name='title' type="text" />
                        </div>
                        <div className='w-full grid gap-2'>
                            <label htmlFor="" className='text-[12px]'>Due date</label>
                            <input onChange={handleChange} value={assessmentData.dueDate} className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md' name='dueDate' type="date" />
                        </div>
                        <div className='w-full grid gap-2'>
                            <label htmlFor="" className='text-[12px]'>Cohort</label>
                            <select name='cohortId' value={assessmentData.cohortId} onChange={handleChange} className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md' id="">
                                {
                                    assignedCohort.map((coh) => (
                                        <option key={coh._id} value={coh._id}>{coh.cohortName}</option>
                                    ))
                                }
                                <option value="">Select Cohort</option>
                            </select>
                            {error.cohortId && <span className='text-red-500 text-[10px]'>{error.cohortId}</span>}
                        </div>
                        <div className='w-full grid gap-2'>
                            <label htmlFor="" className='text-[12px]'>Course</label>
                            <select className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md' name='courseId' value={assessmentData.courseId} onChange={handleChange} id="">
                                {
                                    Array.from(new Set(staffMode.map((coh) => coh.course._id))).map((courseId) => {
                                        const course = staffMode.find((coh) => coh.course._id === courseId);
                                        return course ? (
                                            <option key={courseId} value={courseId}>
                                                {course.course.title}
                                            </option>
                                        ) : null;
                                    })
                                }
                                <option value="">Select course</option>
                            </select>
                            {error.courseId && <span className='text-red-500 text-[10px]'>{error.courseId}</span>}
                        </div>
                        <div className='w-full grid gap-2'>
                            <label htmlFor="" className='text-[12px]'>Center</label>
                            <select className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md' name='center' value={assessmentData.center} onChange={handleChange} id="">
                                {
                                    Array.from(new Set(staffMode.map((coh) => coh.center._id))).map((centerId) => {
                                        const center = staffMode.find((coh) => coh.center._id === centerId);
                                        return center ? (
                                            <option key={centerId} value={centerId}>
                                                {center.center.title}
                                            </option>
                                        ) : null;
                                    })
                                }
                                <option value="">Select center</option>
                            </select>
                            {error.center && <span className='text-red-500 text-[10px]'>{error.center}</span>}
                        </div>
                        <div className='w-full grid gap-2'>
                            <label htmlFor="" className='text-[12px]'>Mode</label>
                            <select className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md' name='mode' value={assessmentData.mode} onChange={handleChange} id="">
                                {
                                    Array.from(new Set(staffMode.flatMap((coh) => coh.mode))).map((modeId) => {
                                        return (
                                            <option key={modeId} value={modeId}>
                                                {modeId}
                                            </option>
                                        );
                                    })
                                }
                                <option value="">Select mode</option>
                            </select>
                            {error.mode && <span className='text-red-500 text-[10px]'>{error.mode}</span>}
                        </div>
                        <div className='w-full grid gap-2'>
                            <label htmlFor="" className='text-[12px]'>Instructions</label>
                            <textarea value={assessmentData.instruction} onChange={handleChange} className='w-full h-[100px] px-2 outline-none border border-shadow text-[12px] rounded-md' name="instruction" id=""></textarea>
                        </div>
                    </div>
                    <div className='w-full pt-3'>
                        <button type='submit' className='w-full h-[35px] bg-accent text-cyan-50 rounded-md'>Create Assignment</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AssessmentForm