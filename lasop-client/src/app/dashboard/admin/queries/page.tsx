import React from 'react'
import QueryHead from './QueryHead'
import QueryMain from './QueryMain'
import DashHead from '@/components/dashHead/DashHead'

function Queriespage() {
  return (
    <div className='w-full h-full'>
      <DashHead props={{
        username: 'Admin',
        link: 'profile',
        acct: 'admin',
        img: ''
      }} />
      <QueryHead />
      <QueryMain />
    </div>
  )
}

export default Queriespage