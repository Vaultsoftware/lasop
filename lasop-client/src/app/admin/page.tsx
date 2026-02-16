'use client';

import { AdminData, createAsyncThunkAdmin } from '@/store/admin/adminSlice';
import { AppDispatch, RootState } from '@/store/store';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

function page() {
    const dispatch = useDispatch<AppDispatch>();
    const admin = useSelector((state: RootState) => state.admin.adminInfo);

    const router = useRouter();

    useEffect(() => {
        if (!admin) return;
        router.push('/dashboard/admin');

    }, [admin, router]);

    const [adminData, setAdminData] = useState<AdminData>({
        name: '',
        contact: '',
        role: '',
        email: '',
        password: ''
    })
    const [error, setError] = useState<Partial<AdminData>>({});

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setAdminData({
            ...adminData,
            [e.target.name]: e.target.value
        });
    }

    const validate = () => {
        const newErrors: Partial<AdminData> = {};
        if (!adminData.name) newErrors.name = 'Name is required';
        if (!adminData.contact) newErrors.contact = 'Contact is required';
        if (!adminData.role) newErrors.role = 'Role is required';
        if (!adminData.email) newErrors.email = 'Email is required';
        if (!adminData.password) newErrors.password = 'Password is required';

        setError(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (validate()) {
            try {
                const response = await dispatch(createAsyncThunkAdmin(adminData));
                if (createAsyncThunkAdmin.fulfilled.match(response)) {
                    const payload = response.payload;
                    toast.success(payload.message || 'Admin account created successfully');

                    setAdminData({
                        name: '',
                        contact: '',
                        role: '',
                        email: '',
                        password: ''
                    });
                    router.push('/dashboard/admin');

                } else {
                    toast.error(response.payload as string || 'Failed to create admin account');
                }
            } catch (error) {
                toast.error('An unexpected error occurred');
            }
        }
    }

    return (
        <main className='flex flex-col gap-12 items-center justify-center w-full h-[100vh]'>
            <div>
                <h3 className='font-semibold text-[20px]'>Create Account</h3>
            </div>

            <form action="" className='flex flex-col gap-10 p-4 w-[350px] rounded-3xl shadow-lg'>
                <div className='flex flex-col gap-6'>
                    {
                        !admin && <>
                            <div className='w-full flex flex-col'>
                                <input onChange={handleChange} name="name" type="text" className='w-full h-10 border border-gray-600 rounded-full p-2 text-[16px]' placeholder='Your name' />
                                {error.name && <span className='text-red-500 text-sm'>{error.name}</span>}
                            </div>
                            <div className='w-full flex flex-col'>
                                <input onChange={handleChange} name="contact" type="text" className='w-full h-10 border border-gray-600 rounded-full p-2 text-[16px]' placeholder='Your contact no' />
                                {error.contact && <span className='text-red-500 text-sm'>{error.contact}</span>}
                            </div>
                            <div className='w-full flex flex-col'>
                                <input onChange={handleChange} name="role" type="text" className='w-full h-10 border border-gray-600 rounded-full p-2 text-[16px]' placeholder='Your role' />
                                {error.role && <span className='text-red-500 text-sm'>{error.role}</span>}
                            </div>
                        </>
                    }
                    <div className='w-full flex flex-col'>
                        <input onChange={handleChange} name="email" type="text" className='w-full h-10 border border-gray-600 rounded-full p-2 text-[16px]' placeholder='Your email' />
                        {error.email && <span className='text-red-500 text-sm'>{error.email}</span>}
                    </div>
                    <div className='w-full flex flex-col'>
                        <input onChange={handleChange} name="password" type="password" className='w-full h-10 border border-gray-600 rounded-full p-2 text-[16px]' placeholder='Your password' />
                        {error.password && <span className='text-red-500 text-sm'>{error.password}</span>}
                    </div>
                </div>
                <div className='flex justify-center'>
                    <button onClick={handleSubmit} className='bg-blue-500 text-white px-6 py-2 rounded-full'>Create Account</button>
                </div>
            </form>
        </main>
    )
}

export default page