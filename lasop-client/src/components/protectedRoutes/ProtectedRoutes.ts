'use client'

import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { ReactNode, useEffect } from 'react'
import { toast } from 'react-toastify'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const token = useSelector((state: RootState) => state.student.token)
    const router = useRouter()

    useEffect(() => {
        if (!token || token.trim() === '' || token === null) {
            toast.warn('Session expired, please log in again.')
            router.push('/login')
        }
    }, [token, router])

    if (!token || token.trim() === '') return null;

    return <>{children}</>;
}
