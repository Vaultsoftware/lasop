import React, { useState, useEffect, FormEvent } from 'react';
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { FaCheck } from "react-icons/fa6";
import { MdClose, MdAssignmentAdd, MdDelete } from "react-icons/md";
import { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { handleProject } from '@/store/dashMenu/dashStore';
import { fetchProject, postProject } from '@/store/projectStore/projectStore';

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

interface CohortMain {
    _id: string;
    cohortName: string;
    courseId: {
        _id: string;
        title: string;
        code: string;
        price: string;
        exams: string[];
    }[];
    startDate: string;
    endDate: string;
    center: {
        _id?: string;
        title: string;
    }[];
    mode: string[];
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
    }[];
    isActive: boolean;
    status: string;
};

interface Project {
    title: string;
    duration: string;
    start: string;
    overview: string;
    objectives: string[];
    deliverables: string[];
    dueDate: string;
    cohortId: string;
    courseId: string;
    center: string;
    mode: string;
    tutorId: string;
}

interface ProjectErr {
    title: string;
    duration: string;
    start: string;
    overview: string;
    objectives: string[] | string;
    deliverables: string[] | string;
    dueDate: string;
    cohortId: string;
    courseId: string;
    center: string;
    mode: string;
    tutorId: string;
}

function ProjectForm() {
    const dispatch = useDispatch<AppDispatch>();
    const staffDetail = useSelector((state: RootState) => state.staff.logDetails)
    const cohort = useSelector((state: RootState) => state.cohort.cohort);

    const [assignedCohort, setAssignedCohort] = useState<CohortMain[]>([]);
    const [selectedCohort, setSelectedCohort] = useState<CohortMain | undefined>(undefined);
    const [staffMode, setStaffMode] = useState<CourseTutor[]>([]);

    // State to manage project data
    const [projectData, setProjectData] = useState<Project>({
        title: '',
        duration: '',
        start: '',
        overview: '',
        objectives: [],
        deliverables: [],
        dueDate: '',
        cohortId: '',
        courseId: '',
        center: '',
        mode: '',
        tutorId: staffDetail?._id as string
    })

    // State to manage error messages
    const [error, setError] = useState<Partial<ProjectErr>>({});

    // Function for validating and handling error messages
    const validate = () => {
        const newErrors: Partial<ProjectErr> = {};

        if (!projectData.title) {
            newErrors.title = 'Title is required';
        }
        if (!projectData.duration) {
            newErrors.duration = 'Duration is required';
        }
        if (!projectData.start) {
            newErrors.start = 'Start date is required';
        }
        if (!projectData.overview) {
            newErrors.overview = 'Overview is required';
        }
        if (!projectData.objectives.length) {
            newErrors.objectives = 'At least one objective is required';
        }
        if (!projectData.deliverables.length) {
            newErrors.deliverables = 'At least one deliverable is required';
        }
        if (!projectData.dueDate) {
            newErrors.dueDate = 'Due date is required';
        }
        if (!projectData.cohortId) {
            newErrors.cohortId = 'Cohort is required';
        }
        if (!projectData.courseId) {
            newErrors.courseId = 'Course is required';
        }
        if (!projectData.center) {
            newErrors.center = 'Center is required';
        }
        if (!projectData.mode) {
            newErrors.mode = 'Mode is required';
        }

        setError(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    // handle change for string/single form
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setProjectData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // state for creating more elements for objectives and deliverables
    const [objectives, setObjectives] = useState<string>('');
    const [deliverables, setDeliverables] = useState<string>('');

    const [addObj, setAddObj] = useState<any>([]);
    const [addDel, setAddDel] = useState<any>([]);

    const [addedObj, setAddedObj] = useState<boolean[]>(Array(addObj.length).fill(false));
    const [addedDel, setAddedDel] = useState<boolean[]>(Array(addDel.length).fill(false));

    const handleObjChanges = (e: any) => {
        setObjectives(e.target.value)
    }
    const handleDelChanges = (e: any) => {
        setDeliverables(e.target.value)
    }

    // Creating new objective and deliverables
    const addObjective = () => {
        setAddObj([...addObj, {}])
    }
    const addDeliverable = () => {
        setAddDel([...addDel, {}])
    }

    // Validating objective
    const [errObj, setErrObj] = useState<string>('')
    const validateObj = () => {
        if (!objectives.trim()) {
            setErrObj('Objective cannot be empty.');
            return false;
        }
        return true;
    }

    // Validating deliverables
    const [errDel, setErrDel] = useState<string>('')
    const validateDel = () => {
        if (!deliverables.trim()) {
            setErrDel('Deliverables cannot be empty.');
            return false;
        }
        return true;
    }

    // Function for validating objectives and deliverables
    const confirmObj = (index: number) => {
        if (validateObj()) {
            if (!projectData.objectives.includes(objectives.trim())) {
                setProjectData((prevState) => ({
                    ...prevState, objectives: [...prevState.objectives, objectives.trim()]
                }))

                setObjectives('');
                setErrObj('');

                setAddedObj((prev) => {
                    const updated = [...prev];
                    updated[index] = true;
                    return updated;
                })
            }
            else {
                setErrObj('This objective already exists.');
            }
        }
    }

    const confirmDel = (index: number) => {
        if (validateDel()) {
            if (!projectData.deliverables.includes(deliverables.trim())) {
                setProjectData((prevState) => ({
                    ...prevState, deliverables: [...prevState.deliverables, deliverables.trim()]
                }))

                setDeliverables('');
                setErrDel('');

                setAddedDel((prev) => {
                    const updated = [...prev];
                    updated[index] = true;
                    return updated;
                })
            }
            else {
                setErrDel('This deliverables already exists.');
            }
        }
    }

    // Deleting a created objectives and deliverables
    const removeObj = (index: number) => {
        setProjectData(prevState => ({
            ...prevState, objectives: prevState.objectives.filter((obj, ind) => ind !== index)
        }))

        setAddObj((prevState: any) => prevState.filter((obj: any, ind: any) => ind !== index))
    }

    const removeDel = (index: number) => {
        setProjectData(prevState => ({
            ...prevState, deliverables: prevState.deliverables.filter((obj, ind) => ind !== index)
        }))

        setAddDel((prevState: any) => prevState.filter((obj: any, ind: any) => ind !== index))
    }

    // Submitting form data
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        console.log("Submit function triggered");

        try {
            if (validate()) {
                const response = await dispatch(postProject(projectData))
                if (postProject.fulfilled.match(response)) {
                    const payload = response.payload;
                    toast.success(payload.message || 'Project created successfully')

                    dispatch(handleProject())
                    dispatch(fetchProject())

                    setProjectData({
                        title: '',
                        duration: '',
                        start: '',
                        overview: '',
                        objectives: [],
                        deliverables: [],
                        dueDate: '',
                        cohortId: '',
                        courseId: '',
                        center: '',
                        mode: '',
                        tutorId: staffDetail?._id as string
                    })
                }
                else {
                    toast.error(response.error?.message);
                }
            } else {
                console.log("Validation failed");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Effect to filter and assign cohorts based on the logged-in staff's ID
    useEffect(() => {
        if (cohort.length > 0 && staffDetail) {
            const getCohort = cohort.filter((coh) => coh.courseTutors.some((ct) => ct.tutors._id === staffDetail._id)
            );
            setAssignedCohort(getCohort);
        }
    }, [cohort, staffDetail])

    // Effect to find and set the selected cohort based on the cohortId in the project data
    useEffect(() => {
        const getCohort = assignedCohort.find((ascho) => ascho._id === projectData.cohortId)
        setSelectedCohort(getCohort);

    }, [assignedCohort, projectData.cohortId])

    // Effect to determine the logged-in staff's assigned mode in the selected cohort
    useEffect(() => {
        const getStaffAssigned = selectedCohort?.courseTutors.filter((ct) => ct.tutors._id === staffDetail?._id) || [];
        setStaffMode(getStaffAssigned)
    }, [selectedCohort, staffDetail])

    return (
        <div className='fixed left-0 top-0 w-full h-[100vh] px-3 flex justify-center items-center applicant'>
            <div className=' w-full md:w-[400px] h-[400px] overflow-y-scroll py-3 bg-white rounded-lg'>
                <div onClick={() => dispatch(handleProject())} className='w-[25px] h-[25px] flex items-center justify-center text-cyan-100 bg-accent ml-auto rounded-sm mr-3'>
                    <MdClose />
                </div>
                <div className='w-full flex gap-2 items-center text-accent px-3 pb-3 border-b border-accent'>
                    <MdAssignmentAdd />
                    <span>Create Assignment</span>
                </div>
                <form onSubmit={handleSubmit} action="" className='w-full px-3 pt-3'>
                    <div className='w-full grid gap-3'>
                        <div className='w-full grid gap-2'>
                            <label htmlFor="" className='text-[12px]'>Project title</label>
                            <input onChange={handleChange} value={projectData.title} className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md' name='title' type="text" />
                            {error.title && <span className='text-red-500 text-[10px]'>{error.title}</span>}
                        </div>
                        <div className='w-full grid gap-2'>
                            <label htmlFor="" className='text-[12px]'>Duration</label>
                            <input onChange={handleChange} value={projectData.duration} className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md' name='duration' type="text" />
                            {error.duration && <span className='text-red-500 text-[10px]'>{error.duration}</span>}
                        </div>
                        <div className='w-full grid gap-2'>
                            <label htmlFor="" className='text-[12px]'>Starts</label>
                            <input onChange={handleChange} value={projectData.start} className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md' name='start' type="date" />
                            {error.start && <span className='text-red-500 text-[10px]'>{error.start}</span>}
                        </div>
                        <div className='w-full grid gap-2'>
                            <label htmlFor="" className='text-[12px]'>Due date</label>
                            <input onChange={handleChange} value={projectData.dueDate} className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md' name='dueDate' type="date" />
                            {error.dueDate && <span className='text-red-500 text-[10px]'>{error.dueDate}</span>}
                        </div>
                        <div>
                            <label className='text-[12px]' htmlFor="">Cohort</label>
                            <select className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md' onChange={handleChange} value={projectData.cohortId} name="cohortId" id="">
                                {
                                    assignedCohort.map((coh) => (
                                        <option key={coh._id} value={coh._id}>{coh.cohortName}</option>
                                    ))
                                }
                                <option value="">Select Cohort</option>
                            </select>
                            {error.cohortId && <span className='text-red-500 text-[10px]'>{error.cohortId}</span>}
                        </div>
                        <div>
                            <label className='text-[12px]' htmlFor="">Course</label>
                            <select className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md' onChange={handleChange} value={projectData.courseId} name="courseId" id="">
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
                            <select className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md' name='center' value={projectData.center} onChange={handleChange} id="">
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
                        <div>
                            <label className='text-[12px]' htmlFor="">Mode</label>
                            <select className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md' onChange={handleChange} name="mode" id="">
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
                            <label htmlFor="" className='text-[12px]'>Project overview</label>
                            <input
                                className='w-full h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md'
                                name='overview'
                                value={projectData.overview}
                                onChange={handleChange}
                                type="text"
                            />
                            {error.overview && <span className='text-red-500 text-[10px]'>{error.overview}</span>}
                        </div>
                        <div>
                            <h3 className='text-shadow text-[12px] font-semibold'>Key objectives:</h3>
                            <div className='grid gap-3'>
                                {
                                    addObj.length > 0 ? addObj.map((obj: any, ind: number) => (
                                        addedObj[ind] ? <div key={ind} className='flex items-center justify-between p-3 w-full border rounded'>
                                            <div className='font-semibold text-[14px]'>Objective {ind + 1}</div>
                                            <div className='flex items-center gap-4'>
                                                {/* <AiOutlineEdit onClick={() => editTutor(index)} className='text-blue-400 text-[20px]' /> */}
                                                <AiOutlineDelete onClick={() => removeObj(ind)} className='text-red-400 text-[20px]' />
                                            </div>
                                        </div> : <div className='mb-1 border p-4 rounded-md shadow-md' key={ind}>
                                            <div className='flex items-center justify-between gap-2'>
                                                <label className='text-[12px]' htmlFor="">{ind + 1}</label>
                                                <input
                                                    className='w-[90%] h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md'
                                                    type="text"
                                                    onChange={handleObjChanges}
                                                />
                                                <FaCheck onClick={() => confirmObj(ind)} className='text-green-400 text-[18px]' />
                                                <MdDelete className='text-red-400 text-[18px]' onClick={() => removeObj(ind)} />
                                            </div>
                                        </div>
                                    )) : <div>
                                        <h3 className='text-shadow text-[8px] font-semibold'>Click the button below to add objectives</h3>
                                    </div>
                                }
                            </div>
                            {errObj && <span className='text-red-500 text-[10px]'>{errObj}</span>}
                            <div>
                                <div onClick={addObjective} className='w-full h-[35px] flex items-center justify-center text-[12px] border border-accent text-shadow rounded-md mt-2 cursor-pointer'>Add a key objective</div>
                            </div>
                        </div>
                        <div>
                            <h3 className='text-shadow text-[12px] font-semibold'>Deliverables:</h3>
                            <div className='grid gap-3'>
                                {
                                    addDel.length > 0 ? addDel.map((del: any, ind: number) => (
                                        addedDel[ind] ? <div key={ind} className='flex items-center justify-between p-3 w-full border rounded'>
                                            <div className='font-semibold text-[14px]'>Deliverable {ind + 1}</div>
                                            <div className='flex items-center gap-4'>
                                                {/* <AiOutlineEdit onClick={() => editTutor(index)} className='text-blue-400 text-[20px]' /> */}
                                                <AiOutlineDelete onClick={() => removeDel(ind)} className='text-red-400 text-[20px]' />
                                            </div>
                                        </div> : <div className='mb-1 border p-4 rounded-md shadow-md' key={ind}>
                                            <div className='flex items-center justify-between gap-2'>
                                                <label className='text-[12px]' htmlFor="">{ind + 1}</label>
                                                <input
                                                    className='w-[90%] h-[35px] px-2 outline-none border border-shadow text-[12px] rounded-md'
                                                    type="text"
                                                    onChange={handleDelChanges}
                                                />
                                                <FaCheck onClick={() => confirmDel(ind)} className='text-green-400 text-[18px]' />
                                                <MdDelete className='text-red-400 text-[18px]' onClick={() => removeDel(ind)} />
                                            </div>
                                        </div>
                                    )) : <div>
                                        <h3 className='text-shadow text-[8px] font-semibold'>Click the button below to add deliverables</h3>
                                    </div>
                                }
                            </div>
                            {errDel as string && <span className='text-red-500 text-[10px]'>{errDel}</span>}
                            <div>
                                <div onClick={addDeliverable} className='w-full h-[35px] flex items-center justify-center text-[12px] border border-accent text-shadow rounded-md mt-2 cursor-pointer'>Add a deliverable</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button type='submit' className='w-full h-[35px] bg-accent text-cyan-50 rounded-md mt-6'>Create Project</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ProjectForm