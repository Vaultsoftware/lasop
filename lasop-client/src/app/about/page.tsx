'use client';

import Navbar from '@/components/navbar/Navbar'
import React, { useEffect } from 'react'
import AboutHead from './AboutHead'
import AboutMain from './AboutMain'
import Footer from '@/components/footer/Footer'
import AOS from 'aos';
import 'aos/dist/aos.css';

function AboutPage() {
    useEffect(() => {
        AOS.init({
          duration: 1200,
          once: true,
        });
      }, []);
    
    return (
        <>
            <Navbar />
            <AboutHead />
            <AboutMain />
            <Footer />
        </>
    )
}

export default AboutPage