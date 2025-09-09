import DashHead from '@/components/dashHead/DashHead'
import React from 'react'
import StaffHead from './StaffHead'
import StaffMain from './StaffMain'

function StaffPage() {
  return (
    <div className='w-full h-full'>
      <DashHead props={{
        username: 'Admin',
        link: 'profile',
        acct: 'admin',
        img: ''
      }} />
      <StaffHead />
      <StaffMain />
    </div>
  )
}

export default StaffPage