'use client';

import Navbar from '@/components/navbar/Navbar'
import React, { useEffect } from 'react'
import ContactHead from './ContactHead'
import ContactMain from './ContactMain'
import Footer from '@/components/footer/Footer'
import AOS from 'aos';
import 'aos/dist/aos.css';

function page() {
    useEffect(() => {
        AOS.init({
          duration: 1200,
          once: true,
        });
      }, []);

    return (
        <>
            <Navbar />
            <ContactHead />
            <ContactMain />
            <Footer />
        </>
    )
}

export default page