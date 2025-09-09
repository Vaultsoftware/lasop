import React from 'react';
import Image from 'next/image';
import outline from '../../asset/landPage/outline.png';
import img1 from '../../asset/landPage/img1.png'
import img2 from '../../asset/landPage/img2.png';
import img3 from '../../asset/landPage/img3.png';

function AboutHead() {
    return (
        <header className='about_head md:flex md:items-center grid gap-9 md:px-[3rem] p-[30px] w-full md:h-[100vh] h-auto head_bg overflow-hidden'>
            <div className="about_head_info w-full md:w-[50%]">
                <h3 data-aos='fade-right' className='font-[700] text-[45px] text-accent'>Our Mission</h3>
                <Image src={outline} alt="" />
                <p data-aos='fade-right' className='mt-3'>
                    Our mission is to provide every student with a platform to refine his or her skills and make a mark in the computer literate world. To sharpen their skills to master new technologies and establish themselves with the goal of Bringing People and Computers Together Successfully, and to meet the augmenting needs of the technology-driven global society.
                    <br />
                    <br />
                    LASOP looks forward to be a recognized Model Computer Programming Institute in the World in meeting the prevailing needs of technical manpower through qualitative, effective and resourceful training.
                </p>
            </div>
            <div data-aos='fade-left' className="online_img relative w-full md:w-[50%] grid gap-6">
                <Image className='h-[150px]'  src={img3} alt="" />
                <Image className='h-[170px]' src={img2} alt="" />
                <Image className='h-[230px]' src={img1} alt="" />
            </div>
        </header>
    )
}

export default AboutHead