'use client';

import Navbar from "@/components/navbar/Navbar";
import LandHead from "./landingPage/LandHead";
import LandMain from "./landingPage/LandMain";
import Footer from "@/components/footer/Footer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { useEffect } from "react";
import { fetchCohort } from "@/store/cohortSlice/cohortStore";
import { fetchCourse } from "@/store/courseSlice/courseStore";
import AOS from 'aos';
import 'aos/dist/aos.css';
import TawkWidget from "@/components/Tawk/TawkWidget"; // show only on home

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchCohort());
    dispatch(fetchCourse());
  }, [dispatch]);

  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
  }, []);
  
  return (
    <>
      <Navbar />
      <LandHead />
      <LandMain />
      <Footer />
      <TawkWidget /> {/* Now only renders on the home page */}
    </>
  );
}