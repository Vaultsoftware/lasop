import DashHead from '@/components/dashHead/DashHead'
import React from 'react'
import SyllabusHead from './SyllabusHead'
import SyllabusMain from './SyllabusMain'

function SyllabusPage() {
    return (
        <div className='w-full h-full'>
            <DashHead props={{
                username: 'Admin',
                link: 'profile',
                acct: 'admin',
                img: ''
            }} />
            <SyllabusHead />
            <SyllabusMain />
        </div>
    )
}

export default SyllabusPage