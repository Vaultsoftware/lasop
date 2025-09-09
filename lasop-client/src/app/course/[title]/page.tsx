"use client";

import { useRouter } from 'next/navigation';
import { course } from '@/data/data';
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import CourseHead from './CourseHead';
import CourseMain from './CourseMain';
import AOS from 'aos';
import 'aos/dist/aos.css';

type PageProps = {
    params: {
        title: string;
    };
};

interface CourseData {
    id: number;
    dpt1: string;
    title: string;
    dpt2: string;
    bannerText: string;
    bannerBtn: { text: string }[];
    courseInfo: { curr: string; text: string }[];
    packageBtn: { title: string; info: string[] }[];
}

function Page({ params }: PageProps) {
    const [pageData, setPageData] = useState<CourseData | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (!params.title) {
            router.push('/');
        } else {
            const data = course.find((value) => value.title.toLowerCase() === params.title.toLowerCase());
            setPageData(data || null);
        }
    }, [params.title, router]);
    
    useEffect(() => {
        AOS.init({
          duration: 1200,
          once: true,
        });
      }, []);
    return (
        <>
            <Navbar />
            {
                pageData ? (
                    <>
                        <CourseHead props={{
                            head: pageData?.dpt1,
                            head2: pageData?.dpt2,
                            desc: pageData?.bannerText,
                            bannerBtn: pageData?.bannerBtn
                        }} />
                        <CourseMain props={{
                            courseInfo: pageData?.courseInfo,
                            packBtn: pageData?.packageBtn
                        }}/>
                    </>
                ) : (
                    <h1>Loading...</h1>
                )
            }
            <Footer />
        </>
    );
}

export default Page;
