import DashHead from '@/components/dashHead/DashHead'
import React from 'react'
import FinanceHead from './FinanceHead'
import FinanceMain from './FinanceMain'

function FinancePage() {
    return (
        <div className='w-full h-full'>
            <DashHead props={{
                username: 'Admin',
                link: 'profile',
                acct: 'admin',
                img: ''
            }} />
            <FinanceHead />
            <FinanceMain />
        </div>
    )
}

export default FinancePage