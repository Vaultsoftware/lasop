'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import Validate from './emailVerification/Validate';
import UpdatePwd from './newPwd/UpdatePwd';
import Email from './email/Email';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

function page() {
    const page = useSelector((state: RootState) => state.forget.page);

    const OtherPages = () => {
        if(page === 2) {
            return <Validate />
        }
        else {
            return <UpdatePwd />
        }
    }
  return (
    <>
        {
            page === 1 ? <Email /> : <OtherPages />
        }
        <ToastContainer />
    </>
  )
}

export default page