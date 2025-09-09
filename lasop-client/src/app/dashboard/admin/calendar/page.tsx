import DashHead from '@/components/dashHead/DashHead';
import React from 'react';
import CalDashHead from './CalDashHead';
import CalDashMain from './CalDashMain';

function CalendarPage() {
    return (
        <div className='w-full h-full'>
            <DashHead props={{
                username: 'Admin',
                link: 'profile',
                acct: 'admin',
                img: ''
            }} />
            <CalDashHead />
            <CalDashMain />
        </div>
    )
}

export default CalendarPage