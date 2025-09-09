'use client';

import { fetchClassroom, postClassroom } from '@/store/classroomStore/classroomStore';
import { handleClass } from '@/store/dashMenu/dashStore';
import { AppDispatch, RootState } from '@/store/store';
import React, { useState, useEffect, FormEvent } from 'react';
import { MdListAlt } from "react-icons/md";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
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

interface Classroom {
    title: string;
    cohortId: string;
    courseId: string;
    center: string;
    tutorId: string;
    mode: string;
    date: string;
    time: string;
    zoomLink: string;
    duration: string;
    status: string;
}

interface ResponsePayload {
    message: string;
}

function ClassroomForm() {
    const dispatch = useDispatch<AppDispatch>();
    const staffDetail = useSelector((state: RootState) => state.staff.logDetails)
    const cohort = useSelector((state: RootState) => state.cohort.cohort);

    const [assignedCohort, setAssignedCohort] = useState<CohortMain[]>([]);
    const [selectedCohort, setSelectedCohort] = useState<CohortMain | undefined>(undefined);
    const [staffMode, setStaffMode] = useState<CourseTutor[]>([]);

    const [classroomData, setClassroomData] = useState<Classroom>({
        title: '',
        cohortId: '',
        courseId: '',
        center: '',
        tutorId: staffDetail?._id as string,
        mode: '',
        date: '',
        time: '',
        zoomLink: '',
        duration: '',
        status: 'next'
    });
    const [error, setError] = useState<Partial<Classroom>>({});

    const validate = () => {
        const newError: Partial<Classroom> = {};

        if (!classroomData.title) {
            newError.title = 'Title is required';
        }
        if (!classroomData.time) {
            newError.time = 'Time is required';
        }
        if (!classroomData.date) {
            newError.date = 'Date is required';
        }
        if (!classroomData.cohortId) {
            newError.cohortId = 'Cohort is required';
        }
        if (!classroomData.zoomLink) {
            newError.zoomLink = 'Url is required';
        }
        if (!classroomData.center) {
            newError.center = 'Center is required';
        }
        if (!classroomData.courseId) {
            newError.courseId = 'Course is required';
        }
        if (!classroomData.mode) {
            newError.mode = 'Mode is required';
        }

        setError(newError);
        return Object.keys(newError).length === 0;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setClassroomData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            if (validate()) {
                const response = await dispatch(postClassroom(classroomData));

                if (postClassroom.fulfilled.match(response)) {
                    const payload = response.payload as ResponsePayload;
                    toast.success(payload.message);
                    dispatch(handleClass())
                    dispatch(fetchClassroom());
                    setClassroomData({
                        title: '',
                        cohortId: '',
                        courseId: '',
                        center: '',
                        tutorId: '',
                        mode: '',
                        date: '',
                        time: '',
                        zoomLink: '',
                        duration: '',
                        status: ''
                    })
                }
                else {
                    toast.error(response.error?.message);
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (cohort.length > 0 && staffDetail) {
            const getCohort = cohort.filter((coh) => coh.courseTutors.some((ct) => ct.tutors._id === staffDetail._id)
            );
            setAssignedCohort(getCohort);
        }
    }, [cohort, staffDetail])

    useEffect(() => {
        const getCohort = assignedCohort.find((ascho) => ascho._id === classroomData.cohortId)
        setSelectedCohort(getCohort);

    }, [assignedCohort, classroomData.cohortId])

    useEffect(() => {
        const getStaffAssigned = selectedCohort?.courseTutors.filter((ct) => ct.tutors._id === staffDetail?._id) || [];
        setStaffMode(getStaffAssigned)
    }, [selectedCohort, staffDetail])

    console.log(staffMode)

    return (
        <div className='fixed left-0 top-0 w-full h-[100vh] px-3 flex justify-center items-center applicant'>
            <div className=' w-full md:w-[400px] h-[400px] overflow-y-scroll py-3 bg-white rounded-lg'>
                <div onClick={() => dispatch(handleClass())} className='w-[25px] h-[25px] flex items-center justify-center text-cyan-100 bg-accent ml-auto rounded-sm mr-3'>
                    <MdClose />
                </div>
                <div className='w-full flex gap-2 items-center text-accent px-3 pb-3 border-b border-accent'>
                    <MdListAlt />
                    <span>Schedule Class</span>
                </div>
                <form onSubmit={handleSubmit} action="" className='w-full px-3 pt-3'>
                    <div className='w-full grid gap-3'>
                        <div className='w-full grid gap-2'>
                            <label htmlFor="" className='text-[12px]'>Class title</label>
                            <input name='title' value={classroomData.title} onChange={handleChange} className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md' type="text" />
                            {error.title && <span className='text-red-500 text-[10px]'>{error.title}</span>}
                        </div>
                        <div className='w-full grid gap-2'>
                            <label htmlFor="" className='text-[12px]'>Time</label>
                            <input name='time' value={classroomData.time} onChange={handleChange} className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md' type='time' id="" />
                            {error.time && <span className='text-red-500 text-[10px]'>{error.time}</span>}
                        </div>
                        <div className='w-full grid gap-2'>
                            <label htmlFor="" className='text-[12px]'>Select date</label>
                            <input name='date' value={classroomData.date} onChange={handleChange} className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md' type="date" id="" />
                            {error.date && <span className='text-red-500 text-[10px]'>{error.date}</span>}
                        </div>
                        <div className='w-full grid gap-2'>
                            <label htmlFor="" className='text-[12px]'>Cohort</label>
                            <select name='cohortId' value={classroomData.cohortId} onChange={handleChange} className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md' id="">
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
                            <select name='courseId' value={classroomData.courseId} onChange={handleChange} className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md' id="">
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
                            <select name='center' value={classroomData.center} onChange={handleChange} className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md' id="">
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
                            <select name='mode' value={classroomData.mode} onChange={handleChange} className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md' id="">
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
                            <label htmlFor="" className='text-[12px]'>Meeting url</label>
                            <input name='zoomLink' value={classroomData.zoomLink} onChange={handleChange} className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md' type='text' />
                            {error.zoomLink && <span className='text-red-500 text-[10px]'>{error.zoomLink}</span>}
                        </div>
                    </div>
                    <div className='w-ful pt-3'>
                        <button type='submit' className='w-full h-[35px] bg-accent text-cyan-50 rounded-md'>Create class schedule</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ClassroomForm