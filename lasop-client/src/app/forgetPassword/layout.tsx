'use client';

import Image from 'next/image';
import React, { ReactNode, useEffect } from 'react';
import form from '../../asset/form/form.jpeg';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { fetchStudent } from '@/store/studentStore/studentStore';

interface Form {
  children: ReactNode;
}

function layout({ children }: Form) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchStudent())
  }, [dispatch]);

  return (
    <main className='w-full h-fit flex items-center'>
      <>
        {children}
      </>
      <div className='w-[55vw] h-[100vh] hidden md:flex fixed right-0 top-0'>
        <Image className='w-full h-full object-cover' src={form} alt='' />
      </div>
    </main>
  )
}

export default layout