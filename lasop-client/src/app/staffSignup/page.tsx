'use client';

import React from 'react';
import Started1 from './1/Started1';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import Started2 from './2/Started2';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

function page() {
  const page = useSelector((state: RootState) => state.staffData.page);

  const OtherPages = () => {
    if (page === 2) {
      return <Started2 />
    }
  };

  return (
    <>
      {
        page === 1 ? <Started1 /> : <OtherPages />
      }
      <ToastContainer />
    </>
  )
}

export default page