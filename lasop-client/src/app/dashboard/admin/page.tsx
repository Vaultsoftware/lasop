import DashHead from '@/components/dashHead/DashHead';
import React from 'react';
import OverviewHead from './overview/OverviewHead';
import OverviewMain from './overview/OverviewMain';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

function OverviewPage() {

    return (
        <div className='w-full h-full'>
            <DashHead props={{
                username: 'Admin',
                link: 'profile',
                acct: 'admin',
                img: ''
            }} />
            <OverviewHead />
            <OverviewMain />
        </div>
    )
}

export default OverviewPage