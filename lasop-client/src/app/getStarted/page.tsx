'use client';

import React from 'react';
import Started1 from './1/Started1';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import Started2 from './2/Started2';
import Started3 from './3/Started3';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import Validate from './emailVailid/Validate';

function page() {
  const page = useSelector((state: RootState) => state.pageData.page);

  const OtherPages = () => {
    if (page === 2) {
      return <Started1 />
    }
    else if (page === 3) {
      return <Validate />
    }
    else {
      return <Started3 />
    }
  };

  return (
    <>
      {
        page === 1 ? <Started2 /> : <OtherPages />
      }
      <ToastContainer />
    </>
  )
}

export default page