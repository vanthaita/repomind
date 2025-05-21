import DashboardProjectHeader from '@/app/(protected)/dashboard/[id]/DashboardHeader'
import React from 'react'

const DashboardProvider = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <div className=''>
            <DashboardProjectHeader />          
            <div className='p-6'>
                {children}
            </div>
        </div>
    )
}

export default DashboardProvider