'use client';

import Navbar from '@/components/navbar/Navbar'
import React from 'react'
import Footer from '@/components/footer/Footer'
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { useEffect } from "react";
import { fetchCohort } from "@/store/cohortSlice/cohortStore";
import { fetchCourse } from "@/store/courseSlice/courseStore";

function CoursePage() {
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
      dispatch(fetchCohort());
      dispatch(fetchCourse());
    }, [dispatch])
    
    return (
        <>
            <Navbar />
            <Footer />
        </>
    )
}

export default CoursePage