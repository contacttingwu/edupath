import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Layout } from '@/components/layout/Layout'
import { LoginPage } from '@/features/auth/LoginPage'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { StudentListPage } from '@/features/students/StudentListPage'
import { StudentDetailPage } from '@/features/students/StudentDetailPage'
import { StudentFormPage } from '@/features/students/StudentFormPage'
import { PipelinePage } from '@/features/pipeline/PipelinePage'
import { VisaTrackerPage } from '@/features/visas/VisaTrackerPage'
import { ConsultationsPage } from '@/features/consultations/ConsultationsPage'

export default function App() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)

  useEffect(() => {
    // Get initial session
    void supabase.auth.getSession().then(({ data }) => setSession(data.session))

    // Listen for sign-in / sign-out
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Still loading — show nothing to avoid flash
  if (session === undefined) return null

  // Not logged in — show login page for all routes
  if (!session) return <LoginPage />

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/students" element={<StudentListPage />} />
        <Route path="/students/new" element={<StudentFormPage />} />
        <Route path="/students/:id" element={<StudentDetailPage />} />
        <Route path="/students/:id/edit" element={<StudentFormPage />} />
        <Route path="/pipeline" element={<PipelinePage />} />
        <Route path="/visas" element={<VisaTrackerPage />} />
        <Route path="/consultations" element={<ConsultationsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
