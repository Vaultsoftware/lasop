import DashHead from '@/components/dashHead/DashHead'
import React from 'react'
import ApplicantsHead from './ApplicantsHead'
import ApplicantsMain from './ApplicantsMain'

function ApplicantPage() {
    return (
        <div className='w-full h-full'>
            <DashHead props={{
                username: 'Admin',
                link: 'profile',
                acct: 'admin',
                img: ''
            }} />
            <ApplicantsHead />
            <ApplicantsMain />
        </div>
    )
}

export default ApplicantPage