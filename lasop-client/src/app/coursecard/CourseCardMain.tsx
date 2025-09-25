'use client';
import React from 'react';
import Link from 'next/link';
import { FaChevronRight } from 'react-icons/fa6';
import Image from 'next/image';

const CourseCardMain = () => {
  return (
    <section className='md:main py-[3rem] px-[30px]'>
      <div className="courses">
        <div className="courses_head mb-[2rem] flex flex-col items-center">
          <h1 className='font-bold text-[40px] mb-2'>Courses</h1>
          <div className="w-[150px] h-[4px] bg-gradient-to-r from-accent to-shadow rounded"></div>
        </div>

        <div className="courses_body grid md:grid-cols-3 xsm:grid-cols-2 gap-6">
          
          {/* Card 1: Product Design */}
          <div className="courses_list relative shadow-md hover:shadow-lg transition-shadow duration-300 p-[20px] rounded-md flex flex-col items-center bg-white border border-gray-100 hover:border-accent/20">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-shadow rounded-t-md"></div>
            <div className="course_icon mb-4 relative">
              <div className="bg-gray-50 p-3 rounded-lg">
                {/* Add Image if available */}
              </div>
            </div>
            <div className="course_info mt-auto text-center">
              <h3 className='head3 mb-3'>PRODUCT DESIGN</h3>
              <p className="mb-6">Learn to craft stunning, user-friendly product designs for web and mobile apps.</p>
              <Link className='nav_btn bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-white transition-colors duration-300 flex items-center gap-3 mt-6 mx-auto md:mx-0' href='/course/productdesign'>
                <span>Learn more</span>
                <FaChevronRight />
              </Link>
            </div>
          </div>

          {/* Card 2: Frontend Development */}
          <div className="courses_list relative shadow-md hover:shadow-lg transition-shadow duration-300 p-[20px] rounded-md flex flex-col items-center bg-white border border-gray-100 hover:border-accent/20">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-shadow rounded-t-md"></div>
            <div className="course_icon mb-4 relative">
              <div className="bg-gray-50 p-3 rounded-lg"></div>
            </div>
            <div className="course_info mt-auto text-center">
              <h3 className='head3 mb-3'>FRONTEND DEVELOPMENT</h3>
              <p className="mb-6">Build responsive and modern websites using React, Tailwind CSS, and best practices.</p>
              <Link className='nav_btn bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-white transition-colors duration-300 flex items-center gap-3 mt-6 mx-auto md:mx-0' href='/course/frontend'>
                <span>Learn more</span>
                <FaChevronRight />
              </Link>
            </div>
          </div>

          {/* Card 3: Fullstack Development */}
          <div className="courses_list relative shadow-md hover:shadow-lg transition-shadow duration-300 p-[20px] rounded-md flex flex-col items-center bg-white border border-gray-100 hover:border-accent/20">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-shadow rounded-t-md"></div>
            <div className="course_icon mb-4 relative">
              <div className="bg-gray-50 p-3 rounded-lg"></div>
            </div>
            <div className="course_info mt-auto text-center">
              <h3 className='head3 mb-3'>FULLSTACK DEVELOPMENT</h3>
              <p className="mb-6">Master both frontend and backend to build complete web applications from scratch.</p>
              <Link className='nav_btn bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-white transition-colors duration-300 flex items-center gap-3 mt-6 mx-auto md:mx-0' href='/course/fullstack'>
                <span>Learn more</span>
                <FaChevronRight />
              </Link>
            </div>
          </div>

          {/* Card 4: Cyber Security */}
          <div className="courses_list relative shadow-md hover:shadow-lg transition-shadow duration-300 p-[20px] rounded-md flex flex-col items-center bg-white border border-gray-100 hover:border-accent/20">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-shadow rounded-t-md"></div>
            <div className="course_icon mb-4 relative">
              <div className="bg-gray-50 p-3 rounded-lg"></div>
            </div>
            <div className="course_info mt-auto text-center">
              <h3 className='head3 mb-3'>CYBER SECURITY</h3>
              <p className="mb-6">Protect systems and networks by learning ethical hacking, encryption, and security protocols.</p>
              <Link className='nav_btn bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-white transition-colors duration-300 flex items-center gap-3 mt-6 mx-auto md:mx-0' href='/course/Backend'>
                <span>Learn more</span>
                <FaChevronRight />
              </Link>
            </div>
          </div>

          {/* Card 5: Mobile App Development */}
          <div className="courses_list relative shadow-md hover:shadow-lg transition-shadow duration-300 p-[20px] rounded-md flex flex-col items-center bg-white border border-gray-100 hover:border-accent/20">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-shadow rounded-t-md"></div>
            <div className="course_icon mb-4 relative">
              <div className="bg-gray-50 p-3 rounded-lg"></div>
            </div>
            <div className="course_info mt-auto text-center">
              <h3 className='head3 mb-3'>MOBILE APP DEVELOPMENT</h3>
              <p className="mb-6">Design and develop mobile applications for iOS and Android using React Native and Flutter.</p>
              <Link className='nav_btn bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-white transition-colors duration-300 flex items-center gap-3 mt-6 mx-auto md:mx-0' href='/course/mobileapp'>
                <span>Learn more</span>
                <FaChevronRight />
              </Link>
            </div>
          </div>

          {/* Card 6: Data Science & AI */}
          <div className="courses_list relative shadow-md hover:shadow-lg transition-shadow duration-300 p-[20px] rounded-md flex flex-col items-center bg-white border border-gray-100 hover:border-accent/20">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-shadow rounded-t-md"></div>
            <div className="course_icon mb-4 relative">
              <div className="bg-gray-50 p-3 rounded-lg"></div>
            </div>
            <div className="course_info mt-auto text-center">
              <h3 className='head3 mb-3'>DATA SCIENCE & AI</h3>
              <p className="mb-6">Analyze data, build predictive models, and leverage AI tools for business and research.</p>
              <Link className='nav_btn bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-white transition-colors duration-300 flex items-center gap-3 mt-6 mx-auto md:mx-0' href='/course/datascience'>
                <span>Learn more</span>
                <FaChevronRight />
              </Link>
            </div>
          </div>

          {/* Card 7: Data Analysis */}
          <div className="courses_list relative shadow-md hover:shadow-lg transition-shadow duration-300 p-[20px] rounded-md flex flex-col items-center bg-white border border-gray-100 hover:border-accent/20">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-shadow rounded-t-md"></div>
            <div className="course_icon mb-4 relative">
              <div className="bg-gray-50 p-3 rounded-lg"></div>
            </div>
            <div className="course_info mt-auto text-center">
              <h3 className='head3 mb-3'>DATA ANALYSIS</h3>
              <p className="mb-6">Learn to visualize, interpret, and extract insights from data using Python and SQL.</p>
              <Link className='nav_btn bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-white transition-colors duration-300 flex items-center gap-3 mt-6 mx-auto md:mx-0' href='/course/dataanalysis'>
                <span>Learn more</span>
                <FaChevronRight />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default CourseCardMain;
