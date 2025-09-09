import DashHead from '@/components/dashHead/DashHead'
import React from 'react'
import StudentsHead from './StudentsHead'
import StudentsMain from './StudentsMain'

function StudentPage() {
  return (
    <div className='w-full h-full'>
      <DashHead props={{
        username: 'Admin',
        link: 'profile',
        acct: 'admin',
        img: ''
      }} />
      <StudentsHead />
      <StudentsMain />
    </div>
  )
}

export default StudentPage