import DashHead from '@/components/dashHead/DashHead'
import React from 'react'
import ExamHead from './ExamHead'
import ExamMain from './ExamMain'

function ExamPage() {
    return (
        <div className='w-full h-full'>
            <DashHead props={{
                username: 'Admin',
                link: 'profile',
                acct: 'admin',
                img: ''
            }} />
            <ExamHead />
            <ExamMain />
        </div>
    )
}

export default ExamPage