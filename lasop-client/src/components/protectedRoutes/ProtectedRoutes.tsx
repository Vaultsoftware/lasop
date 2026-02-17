"use client"

import { ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"

interface ProtectedRoutesProps {
  children: ReactNode
  isAuthenticated: boolean
  redirectPath?: string
}

export default function ProtectedRoutes({
  children,
  isAuthenticated,
  redirectPath = "/login",
}: ProtectedRoutesProps) {
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(redirectPath)
    }
  }, [isAuthenticated, redirectPath, router])

  if (!isAuthenticated) {
    return null
  }

  return <div>{children}</div>
}
