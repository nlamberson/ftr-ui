import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { isAuthenticated } from '../auth'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}
