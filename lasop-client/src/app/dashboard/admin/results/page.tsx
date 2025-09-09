import DashHead from '@/components/dashHead/DashHead'
import React from 'react'
import ResultHead from './ResultHead'
import ResultMain from './ResultMain'

function ResultPage() {
  return (
    <div className='w-full h-full'>
      <DashHead props={{
        username: 'Admin',
        link: 'profile',
        acct: 'admin',
        img: ''
      }} />
      <ResultHead />
      <ResultMain />
    </div>
  )
}

export default ResultPage