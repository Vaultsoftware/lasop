'use client';

import Footer from '@/components/footer/Footer'
import Navbar from '@/components/navbar/Navbar'
import React from 'react'
import CalendarHead from './CalendarHead'
import CalendarMain from './CalendarMain'
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { useEffect } from "react";
import { fetchCohort } from "@/store/cohortSlice/cohortStore";
import { fetchCourse } from "@/store/courseSlice/courseStore";

function CalendarPage() {
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
      dispatch(fetchCohort());
      dispatch(fetchCourse());
    }, [dispatch])
    
    return (
        <>
            <Navbar />
            <CalendarHead />
            <CalendarMain />
            <Footer />
        </>
    )
}

export default CalendarPage