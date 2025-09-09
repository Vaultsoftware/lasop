'use client';

import Image from 'next/image';
import React, { useState, ChangeEvent, FormEvent, useEffect, useRef } from 'react';
import { CgProfile } from "react-icons/cg";
import { LuPencilLine } from "react-icons/lu";
import { LuBookMarked } from "react-icons/lu";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import user from '../../../../asset/headBg/user.jpeg';
import { IoMdClose } from "react-icons/io";
import { MdPassword } from "react-icons/md";
import { fetchStudentLogDetails, updateStudent } from '@/store/studentStore/studentStore';
import { toast } from 'react-toastify';
import { ProfileData, ProfileDataMain } from '@/interfaces/interface';
import { fetchProfile, fetchProfileDet, postProfile } from '@/store/profile/profileStore';

interface StudentDataMain {
    otherName: string;
    email: string;
    contact: string;
    address: string;
    gender: string;
}

interface Password {
    oldPassword: string;
    password: string
}

interface StudentResponsePayload {
    message: string;
}

function ProfileMain() {
    const studentDetail = useSelector((state: RootState) => state.student.logDetails);
    const profiles = useSelector((state: RootState) => state.profile.profiles)

    const dispatch = useDispatch<AppDispatch>()
    const [upProfile, setUpProfile] = useState<boolean>(false);

    const [studentProfile, setStudentProfile] = useState<ProfileDataMain>();
    useEffect(() => {
        if (profiles) {
            const getData = profiles.find((pro) => pro.studentId?._id === studentDetail?._id)
            setStudentProfile(getData);
        }
    }, [profiles])

    const handleUpload = () => {
        setUpProfile(!upProfile)
    }

    const [profile, setProfile] = useState<File | null>(null);

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setProfile(e.target.files[0]);
        }
    };

    // Handle form submission
    const handleProfile = async (e: React.FormEvent) => {
        e.preventDefault();

        let studentId: string = studentDetail?._id as string

        if (profile) {
            const formData = new FormData();
            formData.append('proPic', profile);
            formData.append('studentId', studentId);

            const profileData: ProfileData = {
                studentId: formData.get('studentId') as string,
                proPic: formData.get('proPic') as File,
            }

            console.log(formData)

            // Dispatch the postCertificate action with form data
            const response = await dispatch(postProfile(profileData));
            if (postProfile.fulfilled.match(response)) {
                const payload = response.payload;
                toast.success(payload.message || 'Image uploaded successfully');
                if (studentDetail?._id) {
                    dispatch(fetchStudentLogDetails(studentDetail._id))
                }
                dispatch(fetchProfile())
                if (studentProfile) {
                    dispatch(fetchProfileDet(studentProfile._id))
                }
                setUpProfile(!upProfile)
            }
            else {
                toast.error(response.error?.message);
            }
        }
    };

    const [updateData, setUpdateData] = useState<StudentDataMain>({
        otherName: '',
        email: '',
        contact: '',
        address: '',
        gender: ''
    })

    const [error, setError] = useState<Partial<StudentDataMain>>({});

    const validateForm = () => {
        const newError: Partial<StudentDataMain> = {};

        // Other name
        if (!updateData.otherName.trim()) {
            newError.otherName = 'Last name is required';
        }
        else if (updateData.otherName.trim().length < 3) {
            newError.otherName = 'Last name cannot be less than 3 characters';
        }
        else if (updateData.otherName.trim().length > 15) {
            newError.otherName = `Last name cannot be greater than 15 characters`;
        };

        // Email
        const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!updateData.email.trim()) {
            newError.email = 'Email account is required';
        }
        else if (!emailRegEx.test(updateData.email.trim())) {
            newError.email = 'Invalid email address';
        };

        // Contact
        const contactPattern = /^[0-9]+$/
        if (!contactPattern.test(updateData.contact.trim())) {
            newError.contact = 'Invalid contact address'
        }

        // Address
        if (!updateData.address.trim()) {
            newError.address = 'Home address is required';
        }
        else if (updateData.address.trim().length < 3) {
            newError.address = 'Home address cannot be less than 3 characters';
        }

        // Gender
        if (!updateData.gender.trim()) {
            newError.gender = 'Gender is required';
        }

        setError(newError);
        return Object.keys(newError).length === 0;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setUpdateData({
            ...updateData,
            [name]: type === 'radio' ? (checked ? value : updateData.gender) : value,
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        let studentId: string = studentDetail?._id as string

        try {
            if (validateForm()) {
                const response = await dispatch(updateStudent({ updateData, studentId }))
                if (updateStudent.fulfilled.match(response)) {
                    const payload = response.payload as StudentResponsePayload;
                    toast.success(payload.message || 'Student data submitted successfully');
                    if (studentDetail?._id) {
                        dispatch(fetchStudentLogDetails(studentDetail?._id))
                    }

                    setUpdateData({
                        otherName: '',
                        email: '',
                        contact: '',
                        address: '',
                        gender: ''
                    });
                }
                else {
                    toast.error(response.error?.message);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const [changePwd, setChangePwd] = useState<Password>({
        oldPassword: '',
        password: ''
    })
    const [pwdErr, setPwdErr] = useState<Partial<Password>>({});

    const validatePwd = () => {
        const newErr: Partial<Password> = {};

        if (!changePwd.oldPassword.trim()) {
            newErr.oldPassword = 'This field is required'
        }
        else if (changePwd.oldPassword.trim() !== studentDetail?.password) {
            newErr.oldPassword = `Incorrect password`
        }

        if (!changePwd.password.trim()) {
            newErr.password = 'This field is required'
        }
        else if (changePwd.password.trim().length < 3) {
            newErr.password = 'Password should be at least 3 characters long'
        }
        else if (changePwd.password.trim().length > 15) {
            newErr.password = 'Password should not be more than 15 characters long'
        }

        setPwdErr(newErr);
        return Object.keys(newErr).length === 0;
    }

    const handlePwdChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setChangePwd({ ...changePwd, [name]: value });
    }

    const handlePwdSubmit = async (e: FormEvent) => {
        e.preventDefault();

        let studentId: string = studentDetail?._id as string;

        try {
            if (validatePwd()) {
                const updateData = {
                    password: changePwd.password
                };

                const response = await dispatch(updateStudent({ updateData, studentId }))
                if (updateStudent.fulfilled.match(response)) {
                    const payload = response.payload as StudentResponsePayload;
                    toast.success(payload.message || 'Password updated successfully');
                    setChangePwd({
                        oldPassword: '',
                        password: ''
                    });
                }
                else {
                    toast.error(response.error?.message);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Formatting date
    const formatDate = (dateString: string | any) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

        return formattedDate
    }

    return (
        <main className='w-full p-5'>
            <div className='grid gap-5'>
                <div className='grid gap-3'>
                    <div className='flex gap-1 items-center mb-3'>
                        <div className='flex items-center gap-2 w-fit'>
                            <CgProfile />
                            <h3 className='text-[14px] font-semibold'>PERSONAL INFORMATION</h3>
                        </div>
                        <div className='h-[1px] w-full bg-black'></div>
                    </div>
                    <div className='w-full'>
                        <div className='w-full md:w-[70%]'>
                            <div className="frm_inps w-full">
                                <div className="inp_ctrl grid gap-1 w-full">
                                    <div className='w-full relative'>
                                        <Image width={150} height={150} className='mx-auto w-[150px] h-[150px] rounded-full border-4 border-shadow object-cover' src={studentProfile?.proPic ? studentProfile.proPic : user} alt='' />
                                        <div onClick={handleUpload} className='absolute w-[30px] h-[30px] bg-accent text-white flex items-center justify-center rounded-full left-[53%]  bottom-[3%]'>
                                            <LuPencilLine />
                                        </div>
                                    </div>
                                    {
                                        upProfile && (
                                            <form onSubmit={handleProfile} className='fixed top-0 left-0 w-full h-[100vh] applicant flex items-center justify-center z-30'>
                                                <div className='bg-white w-[300px] p-3 rounded-md shadow-md'>
                                                    <div onClick={handleUpload} className='w-[25px] h-[25px] border border-slate-800 rounded-md flex items-center justify-center text-[14px] ml-auto mb-2 cursor-pointer'>
                                                        <IoMdClose />
                                                    </div>
                                                    <h3 className='text-[14px] font-semibold mb-3'>Upload profile picture</h3>
                                                    <input onChange={handleFileChange} type="file" id='profile' name='profile' />
                                                    <div className="frm_btn mt-6">
                                                        <button type='submit' className='w-full py-2 bg-shadow text-[12px] font-semibold text-white rounded-md'>Upload profile</button>
                                                    </div>
                                                </div>
                                            </form>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <form onSubmit={handleSubmit} action="" className='w-full md:w-[70%]'>
                            <div className="frm_inps grid gap-3">
                                <div className="inp_par grid md:grid-cols-2 gap-2">
                                    <div className="inp_ctrl grid gap-1">
                                        <label className='text-[14px]' htmlFor="">First name</label>
                                        <input
                                            className='w-full h-8 border text-[14px] outline-none px-2 border-shadow rounded-md'
                                            type="text"
                                            value={studentDetail?.firstName}
                                            name='firstName'
                                            disabled
                                        />
                                    </div>
                                    <div className="inp_ctrl grid gap-1">
                                        <label className='text-[14px]' htmlFor="">Last name</label>
                                        <input
                                            className='w-full h-8 border text-[14px] outline-none px-2 border-shadow rounded-md'
                                            type="text"
                                            value={studentDetail?.lastName}
                                            name='lastName'
                                            disabled
                                        />
                                    </div>
                                    <div className="inp_ctrl grid gap-1">
                                        <label className='text-[14px]' htmlFor="">Other name</label>
                                        <input
                                            className='w-full h-8 border text-[14px] outline-none px-2 border-shadow rounded-md'
                                            type="text"
                                            value={updateData.otherName}
                                            name='lastName'
                                            onChange={handleChange}
                                        />
                                        {error.otherName && <span className="err_msg text-red-500 text-[10px]">{error.otherName}</span>}
                                    </div>
                                </div>
                                <div className="inp_par grid md:grid-cols-2 gap-4">
                                    <div className="inp_ctrl grid gap-1">
                                        <label className='text-[14px]' htmlFor="">Email address</label>
                                        <input
                                            className='w-full h-8 border text-[14px] outline-none px-2 border-shadow rounded-md'
                                            type="email"
                                            value={updateData.email}
                                            name='email'
                                            onChange={handleChange}
                                            id='' />
                                        {error.email && <span className="err_msg text-red-500 text-[10px]">{error.email}</span>}
                                    </div>
                                    <div className="inp_ctrl grid gap-1">
                                        <label className='text-[14px]' htmlFor="">Phone number</label>
                                        <input
                                            className='w-full h-8 border text-[14px] outline-none px-2 border-shadow rounded-md'
                                            type="text"
                                            value={updateData.contact}
                                            name='contact'
                                            onChange={handleChange}
                                        />
                                        {error.contact && <span className="err_msg text-red-500 text-[10px]">{error.contact}</span>}
                                    </div>
                                </div>
                                <div className="inp_par grid md:grid-cols-2 gap-4">
                                    <div className="inp_ctrl grid gap-1">
                                        <label className='text-[14px]' htmlFor="">Home address</label>
                                        <input
                                            className='w-full h-8 border text-[14px] outline-none px-2 border-shadow rounded-md'
                                            type="text"
                                            value={updateData.address}
                                            name='address'
                                            onChange={handleChange}
                                        />
                                        {error.address && <span className="err_msg text-red-500 text-[10px]">{error.address}</span>}
                                    </div>
                                    <div className="inp_ctrl grid gap-1">
                                        <label className='text-[14px]' htmlFor="">Gender</label>
                                        <div className=' flex gap-3 items-center'>
                                            <div className='flex gap-1 items-center'>
                                                <input type="radio" onChange={handleChange} value='male' name="gender" id="" />
                                                <label className='text-[14px]' htmlFor="">Male</label>
                                            </div>
                                            <div className='flex gap-1 items-center'>
                                                <input type="radio" onChange={handleChange} value='female' name="gender" id="" />
                                                <label className='text-[14px]' htmlFor="">Female</label>
                                            </div>
                                        </div>
                                        {error.gender && <span className="err_msg text-red-500 text-[10px]">{error.gender}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="frm_btn mt-6">
                                <button type='submit' className='px-20 py-2 bg-shadow text-[12px] font-semibold text-white rounded-md'>Update profile</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className=' grid gap-3'>
                    <div className='flex gap-1 items-center mb-3'>
                        <div className='flex items-center gap-2 w-fit'>
                            <MdPassword />
                            <h3 className='text-[14px] font-semibold'>Change password</h3>
                        </div>
                        <div className='h-[1px] w-full bg-black'></div>
                    </div>
                    <div>
                        <form action="" onSubmit={handlePwdSubmit} className='w-full md:w-[70%]'>
                            <div className="frm_inps grid gap-3">
                                <div className="inp_par grid md:grid-cols-2 gap-2">
                                    <div className="inp_ctrl grid gap-1">
                                        <label className='text-[14px]' htmlFor="">Old password</label>
                                        <input
                                            className='w-full h-8 border text-[14px] outline-none px-2 border-shadow rounded-md'
                                            type="password"
                                            name='oldPassword'
                                            value={changePwd.oldPassword}
                                            onChange={handlePwdChange}
                                        />
                                        {pwdErr.oldPassword && <span className="err_msg text-red-500 text-[10px]">{pwdErr.oldPassword}</span>}
                                    </div>
                                    <div className="inp_ctrl grid gap-1">
                                        <label className='text-[14px]' htmlFor="">New password</label>
                                        <input
                                            className='w-full h-8 border text-[14px] outline-none px-2 border-shadow rounded-md'
                                            type="password"
                                            name='password'
                                            value={changePwd.password}
                                            onChange={handlePwdChange}
                                        />
                                        {pwdErr.password && <span className="err_msg text-red-500 text-[10px]">{pwdErr.password}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="frm_btn mt-6">
                                <button type='submit' className='px-20 py-2 bg-shadow text-[12px] font-semibold text-white rounded-md'>Change password</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div>
                    <div className='flex gap-1 items-center mb-3'>
                        <div className='flex items-center gap-2 w-fit'>
                            <LuBookMarked />
                            <h3 className='text-[14px] font-semibold'>COURSE INFORMATION</h3>
                        </div>
                        <div className='h-[1px] w-full bg-black'></div>
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                        <div className='grid gap-3 w-full'>
                            <div>
                                <h3 className='text-[12px] font-semibold'>Course of study</h3>
                                <p className='text-[14px] font-bold'>{studentDetail?.program.courseId.title}</p>
                            </div>
                            <div>
                                <h3 className='text-[12px] font-semibold'>Course duration</h3>
                                <p className='text-[14px] font-bold'>12 weeks</p>
                            </div>
                            <div>
                                <h3 className='text-[12px] font-semibold'>Started</h3>
                                <p className='text-[14px] font-bold'>{formatDate(studentDetail?.createdAt)}</p>
                            </div>
                        </div>
                        <div className='grid gap-3 w-full'>
                            <div>
                                <h3 className='text-[12px] font-semibold'>Tuition fee</h3>
                                <p className='text-[14px] font-bold'>{studentDetail?.program.courseId.price}</p>
                            </div>
                            <div>
                                <h3 className='text-[12px] font-semibold'>Fee balance</h3>
                                <p className='text-[14px] font-bold'>{studentDetail?.program.courseId.price}</p>
                            </div>
                            <div>
                                <h3 className='text-[12px] font-semibold'>Due date</h3>
                                <p className='text-[14px] font-bold'>{formatDate(studentDetail?.createdAt)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default ProfileMain