'use client';
import { fetchCohort, postCohort } from '@/store/cohortSlice/cohortStore';
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { AppDispatch, RootState } from '@/store/store';
import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaArrowLeft } from "react-icons/fa";
import { handleCreate } from '@/store/dashMenu/dashStore';
import { mode } from '@/data/data';

interface CohortData {
    cohortName: string;
    courseId: string[];
    startDate: string;
    endDate: string;
    center: string[];
    mode: string[];
    courseTutors: {
        course: string;
        center: string;
        mode: string;
        tutors: string;
    }[];
    isActive?: boolean;
    status?: string;
}

interface Course {
    _id: string;
    title: string;
    code: string;
    price: string;
    exams: string[];
}

interface Error {
    cohortName?: string;
    courseId?: string;
    startDate?: string;
    endDate?: string;
    center?: string;
    mode?: string;
    courseTutors?: {
        course: string;
        center: string;
        mode: string;
        tutors: string;
    }[] | string;
    [key: string]: string | string[] | { course: string; center: string; mode: string; tutors: string; }[] | undefined;
}

interface Tutor {
    course: string;
    center: string;
    mode: string;
    tutors: string;
};

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

function CreateCohort() {
    // State management
    const [cohort, setCohort] = useState<CohortData>({
        cohortName: '',
        courseId: [],
        startDate: '',
        endDate: '',
        center: [],
        mode: [],
        courseTutors: []
    });

    const centerAvail = useSelector((state: RootState) => state.centers.centers);

    const [getCourses, setGetCourses] = useState<Course[]>([]);

    const [error, setError] = useState<Partial<Error>>({});
    const courses: Course[] = useSelector((state: RootState) => state.courses.courses)
    useEffect(() => {
        setGetCourses(courses)
    }, [courses])

    const dispatch = useDispatch<AppDispatch>();

    // Validating cohort
    const validateCohort = () => {
        const newError: Partial<Error> = {};

        // Validate the main fields
        if (!cohort.cohortName.trim()) {
            newError.cohortName = 'Cohort name is required';
        }
        if (cohort.courseId.length === 0) {
            newError.courseId = 'At least one course must be selected';
        }
        if (!cohort.startDate) {
            newError.startDate = 'Start date is required';
        }
        if (!cohort.endDate) {
            newError.endDate = 'End date is required';
        }
        if (!cohort.center) {
            newError.center = 'Center is required';
        }
        if (!cohort.mode) {
            newError.mode = 'Mode of study is required';
        }

        setError(newError);
        return Object.keys(newError).length === 0;
    };

    // Handling input change
    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            setCohort(prevState => {
                if (name === 'center' || name === 'mode') {
                    return {
                        ...prevState,
                        [name]: checked ? [...(prevState[name as keyof CohortData] as string[]), value] : (prevState[name as keyof CohortData] as string[]).filter((v) => v !== value)
                    };
                }
                return {
                    ...prevState,
                    courseId: checked ? [...prevState.courseId, value] : prevState.courseId.filter((id => id !== value))
                };
            })
        } else {
            setCohort(prevState => (
                {
                    ...prevState,
                    [name]: value
                }
            ))
        }
    }

    // State tutor management
    const staffs = useSelector((state: RootState) => state.staff.staffs);
    const [tutor, setTutor] = useState<Tutor>({
        course: '',
        center: '',
        mode: '',
        tutors: ''
    })
    const [assignments, setAssignments] = useState<any>([]);
    const [added, setAdded] = useState<boolean[]>(Array(assignments.length).fill(false));

    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const [tutErr, setTutErr] = useState<Partial<Tutor>>({});

    // Function for validating the tutor form
    const validateTutor = () => {
        const newError: Partial<Tutor> = {};

        if (!tutor.course.trim()) {
            newError.course = 'Course is required for tutor assignment';
        }
        if (!tutor.center.trim()) {
            newError.center = 'Center is required for tutor assignment';
        }
        if (!tutor.mode.trim()) {
            newError.mode = 'Mode of study is required for tutor assignment';
        }
        if (!tutor.tutors.trim()) {
            newError.tutors = 'Tutor(s) must be assigned for this course';
        }

        setTutErr(newError);
        return Object.keys(newError).length === 0;
    }

    // Fumction for handling change in the tutor form
    const handleTutorChange = (e: any) => {
        const { name, value } = e.target;

        setTutor(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const confirmTutor = (index: number) => {
        if (validateTutor()) {
            setCohort(prevState => {
                const updatedTutors = [...prevState.courseTutors];

                if (isEditing && editIndex !== null) {
                    updatedTutors[editIndex] = tutor;
                } else {
                    // Prevent duplicates
                    if (!updatedTutors.some((t) => t.course === tutor.course && t.center === tutor.center && t.mode === tutor.mode)) {
                        updatedTutors.push(tutor);
                    }
                }

                return {
                    ...prevState,
                    courseTutors: updatedTutors
                };
            });
            // setCohort(prevState => ({
            //     ...prevState,
            //     courseTutors: prevState.courseTutors.some(
            //         (t) => t.course === tutor.course && t.center === tutor.center && t.mode === tutor.mode
            //     )
            //         ? prevState.courseTutors
            //         : [...prevState.courseTutors, tutor]
            // }));

            setTutor({
                course: '',
                center: '',
                mode: '',
                tutors: ''
            })

            setTutErr({});

            setIsEditing(false);
            setEditIndex(null);

            setAdded((prev) => {
                const updated = [...prev];
                updated[index] = true;
                return updated;
            });
        }
    }

    const addStaff = () => {
        setAssignments([...assignments, {}]);
    }

    const removeTutor = (id: any, index: number) => {
        setCohort(prevState => ({
            ...prevState,
            courseTutors: prevState.courseTutors.filter((tutor, index) => index !== id)
        }))

        setAssignments((prevAssignments: any) =>
            prevAssignments.filter((_: any, index: any) => index !== id)
        );
    }

    const editTutor = (index: number) => {
        const selected = cohort.courseTutors[index];
        setTutor({ ...selected });

        setEditIndex(index);
        setIsEditing(true);

        setAdded((prev) => {
            const edited = [...prev];
            edited[index] = false;
            return edited;
        })
    }

    // const [courseStaff, setCourseStaff] = useState<StaffMain[]>([]);
    // useEffect(() => {
    //     if (tutor.course) {
    //         const staffCourse = staffs.filter((sta) => sta.enrol === tutor.course)

    //         setCourseStaff(staffCourse);
    //     }
    // }, [staffs, tutor.course])

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (validateCohort()) {
            try {
                const response = await dispatch(postCohort(cohort));
                if (postCohort.fulfilled.match(response)) {
                    const payload = response.payload;
                    toast.success(payload.message || 'Cohort created successfully');
                    dispatch(handleCreate());
                    dispatch(fetchCohort());

                    setCohort({
                        cohortName: '',
                        courseId: [],
                        startDate: '',
                        endDate: '',
                        center: [],
                        mode: [],
                        courseTutors: []
                    })
                }
                else {
                    toast.error(response.error?.message);
                }
                console.log(cohort)
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <main style={{ backgroundColor: 'rgb(0, 0, 0, 0.6)' }} className='w-full h-[100vh] fixed top-0 right-0 overflow-y-auto z-30'>
            <div className=' flex flex-col justify-center w-[80vw] lmd:w-[40vw] bg-white rounded-md ml-auto'>
                <div className='p-3 border-b flex items-center gap-2'>
                    <FaArrowLeft onClick={() => dispatch(handleCreate())} className='text-accent cursor-pointer' />
                    <h3 className='text-shadow font-semibold'>Create a new cohort</h3>
                </div>
                <div className='p-3'>
                    <form action="" className='w-full' onSubmit={handleSubmit}>
                        <div className='grid gap-3'>
                            <div className='grid gap-2'>
                                <label htmlFor="" className='text-[12px]'>Cohort name</label>
                                <input
                                    type="text"
                                    placeholder='eg. John'
                                    className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md'
                                    value={cohort.cohortName}
                                    name='cohortName'
                                    onChange={handleChange}
                                />
                                {error.cohortName && <span className="err_msg text-red-500 text-[10px]">{error.cohortName}</span>}
                            </div>
                            <div className='grid gap-2'>
                                <label htmlFor="" className='text-[12px]'>Select courses</label>
                                {
                                    getCourses.map((course) => (
                                        <div key={course._id} className='flex items-center gap-3'>
                                            <input
                                                type="checkbox"
                                                placeholder='eg. Doe'
                                                className='px-2 outline-none border border-shadow text-[12px] rounded-md'
                                                value={course._id}
                                                name='courseId'
                                                onChange={handleChange}
                                            />
                                            <label htmlFor="" className='text-[12px]'>{course.title}</label>
                                        </div>
                                    ))
                                }
                                {error.courseId && <span className="err_msg text-red-500 text-[10px]">{error.courseId}</span>}
                            </div>
                            <div className='grid gap-2'>
                                <label htmlFor="" className='text-[12px]'>Start date</label>
                                <input
                                    type="date"
                                    placeholder='eg. JohnDoe@gmail.com'
                                    className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md'
                                    value={cohort.startDate}
                                    name='startDate'
                                    onChange={handleChange}
                                />
                                {error.startDate && <span className="err_msg text-red-500 text-[10px]">{error.startDate}</span>}
                            </div>
                            <div className='grid gap-2'>
                                <label htmlFor="" className='text-[12px]'>End date</label>
                                <input
                                    type="date"
                                    placeholder='********'
                                    className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md'
                                    value={cohort.endDate}
                                    name='endDate'
                                    onChange={handleChange}
                                />
                                {error.endDate && <span className="err_msg text-red-500 text-[10px]">{error.endDate}</span>}
                            </div>
                            <div className='grid gap-2'>
                                <label htmlFor="" className='text-[12px]'>Center</label>
                                {
                                    centerAvail.map((mod) => (
                                        <div key={mod._id} className='flex items-center gap-3'>
                                            <input
                                                type="checkbox"
                                                className='px-2 outline-none border border-shadow text-[12px] rounded-md'
                                                value={mod._id}
                                                name='center'
                                                onChange={handleChange}
                                            />
                                            <label htmlFor="" className='text-[12px]'>{mod.title}</label>
                                        </div>
                                    ))
                                }
                                {error.center && <span className="err_msg text-red-500 text-[10px]">{error.center}</span>}
                            </div>
                            <div className='grid gap-2'>
                                <label htmlFor="" className='text-[12px]'>Mode of study</label>
                                {
                                    mode.map((mod) => (
                                        <div key={mod} className='flex items-center gap-3'>
                                            <input
                                                type="checkbox"
                                                className='px-2 outline-none border border-shadow text-[12px] rounded-md'
                                                value={mod}
                                                name='mode'
                                                onChange={handleChange}
                                            />
                                            <label htmlFor="" className='text-[12px]'>{mod}</label>
                                        </div>
                                    ))
                                }
                                {error.mode && <span className="err_msg text-red-500 text-[10px]">{error.mode}</span>}
                            </div>
                            <div>
                                <h3 className='text-shadow font-semibold'>Assign Staff</h3>
                                <div className='grid gap-3 mt-2'>
                                    {
                                        assignments.length > 0 ? assignments.map((_: any, index: number) => (
                                            added[index] ? <div className='flex items-center justify-between p-3 w-full border rounded'>
                                                <div className='font-semibold text-[14px]'>Staff {index + 1}</div>
                                                <div className='flex items-center gap-4'>
                                                    <AiOutlineEdit onClick={() => editTutor(index)} className='text-blue-400 text-[20px]' />
                                                    <AiOutlineDelete onClick={() => removeTutor(index, index)} className='text-red-400 text-[20px]' />
                                                </div>
                                            </div> : <div key={index} className='grid gap++-3 mb-4 border p-4 rounded-md shadow-md'>
                                                <div className='grid gap-2'>
                                                    <label className='text-[12px]' htmlFor={`course-select-${index}`}>Select a course to assign staff to</label>
                                                    <select
                                                        className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md'
                                                        id={`course-select-${index}`}
                                                        onChange={handleTutorChange}
                                                        name="course"
                                                        value={tutor.course}
                                                    >
                                                        <option value=""></option>
                                                        {
                                                            cohort.courseId.map((courseId) => {
                                                                const course = getCourses.find(course => course._id === courseId);
                                                                return course ? (
                                                                    <option key={course._id} value={course._id}>{course.title}</option>
                                                                ) : null;
                                                            })
                                                        }
                                                    </select>
                                                    {tutErr.course && <span className="err_msg text-red-500 text-[10px]">{tutErr.course}</span>}
                                                </div>
                                                <div className='grid gap-2'>
                                                    <label className='text-[12px]' htmlFor={`center-select-${index}`}>Select a center to assign staff to</label>
                                                    <select
                                                        className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md'
                                                        id={`center-select-${index}`}
                                                        onChange={handleTutorChange}
                                                        name="center"
                                                        value={tutor.center}
                                                    >
                                                        <option value=""></option>
                                                        {cohort.center.map((centerId) => {
                                                            const center = centerAvail.find(center => center._id === centerId);
                                                            return center ? (
                                                                <option key={center._id} value={center._id}>{center.title}</option>
                                                            ) : null;
                                                        })}
                                                    </select>
                                                    {tutErr.center && <span className="err_msg text-red-500 text-[10px]">{tutErr.center}</span>}
                                                </div>
                                                <div className='grid gap-2'>
                                                    <label className='text-[12px]' htmlFor={`mode-select-${index}`}>Select a mode to assign staff to</label>
                                                    <select
                                                        className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md'
                                                        id={`mode-select-${index}`}
                                                        onChange={handleTutorChange}
                                                        name="mode"
                                                        value={tutor.mode}
                                                    >
                                                        <option value=""></option>
                                                        {
                                                            cohort.mode.map((selectedMode) => (
                                                                <option key={selectedMode} value={selectedMode}>{selectedMode}</option>
                                                            ))
                                                        }
                                                    </select>
                                                    {tutErr.mode && <span className="err_msg text-red-500 text-[10px]">{tutErr.mode}</span>}
                                                </div>
                                                <div className='grid gap-2'>
                                                    <label className='text-[12px]' htmlFor={`staff-select-${index}`}>Select a staff</label>
                                                    <select
                                                        className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md'
                                                        id={`staff-select-${index}`}
                                                        onChange={handleTutorChange}
                                                        name="tutors"
                                                        value={tutor.tutors}
                                                    >
                                                        <option value=""></option>
                                                        {
                                                            staffs.map((couSta) => {
                                                                const couTitle = courses.find((cour) => cour._id === couSta.enrol)?.title || "Unknown Course";
                                                                return (
                                                                    <option className='grid gap-2' key={couSta._id} value={couSta._id}>
                                                                        <p className='font-semibold'>{couSta.firstName} {couSta.lastName} - </p>
                                                                        <span className='text-[8px]'>{couTitle}</span>
                                                                    </option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                    {tutErr.tutors && <span className="err_msg text-red-500 text-[10px]">{tutErr.tutors}</span>}
                                                </div>
                                                <div className='grid gap-2 mt-2'>
                                                    <div onClick={() => confirmTutor(index)} className='w-full h-[35px] flex items-center justify-center text-[14px] border bg-green-400 text-white rounded-md cursor-pointer'>
                                                        {isEditing && editIndex === index ? 'Update staff' : 'Confirm staff'}
                                                    </div>
                                                    <div onClick={() => removeTutor(index, index)} className='w-full h-[35px] flex items-center justify-center text-[14px] border bg-red-400 text-white rounded-md'>Remove staff</div>
                                                </div>
                                            </div>
                                        )) : <div>
                                            <h3 className='text-shadow text-[12px] font-semibold'>Click the button below to assign staff to cohort</h3>
                                        </div>
                                    }
                                </div>
                                <div className='mt-2'>
                                    {
                                        assignments.length > 0 ? <div onClick={addStaff} className='w-full h-[35px] flex items-center justify-center text-[14px] border border-accent text-shadow rounded-md' >create another staff</div> : <div onClick={addStaff} className='w-full h-[35px] flex items-center justify-center  text-[14px] border border-accent text-shadow rounded-md' >create a staff</div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='mt-6'>
                            <button type='submit' className='w-full h-[35px] bg-accent text-cyan-50 rounded-md text-[14px] font-semibold'>Create cohort</button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    )
}

export default CreateCohort