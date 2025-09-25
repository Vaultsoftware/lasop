import React from 'react'
import Navbar from '@/components/navbar/Navbar'
import CourseCardHead from './CourseCardHead'
import CourseCardMain from './CourseCardMain'
import Footer from '@/components/footer/Footer'

function page() {
  return (
    <div>
        <Navbar/>
        {/* <CourseCardHead/> */}
        <CourseCardMain/>
        <Footer/>
    </div>
  )
}

export default page