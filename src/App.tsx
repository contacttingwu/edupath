import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { StudentListPage } from '@/features/students/StudentListPage'
import { StudentDetailPage } from '@/features/students/StudentDetailPage'
import { StudentFormPage } from '@/features/students/StudentFormPage'
import { PipelinePage } from '@/features/pipeline/PipelinePage'
import { VisaTrackerPage } from '@/features/visas/VisaTrackerPage'
import { ConsultationsPage } from '@/features/consultations/ConsultationsPage'

export default function App() {
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
