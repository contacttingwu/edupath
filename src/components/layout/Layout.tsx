import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { AddConsultationModal } from '@/features/students/AddConsultationModal'
import { useUIStore } from '@/store/ui'

export function Layout() {
  const addConsultationOpen = useUIStore((s) => s.addConsultationOpen)
  const addConsultationStudentId = useUIStore((s) => s.addConsultationStudentId)
  const closeAddConsultation = useUIStore((s) => s.closeAddConsultation)
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed)
  const location = useLocation()

  // Close mobile sidebar on route change (desktop sidebar state is preserved)
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarCollapsed(true)
    }
  }, [location.pathname, setSidebarCollapsed])

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6" id="main-content">
          <Outlet />
        </main>
      </div>

      {/* Global Add Consultation modal — triggered from Topbar CTA on any page */}
      {addConsultationOpen && (
        <AddConsultationModal
          studentId={addConsultationStudentId}
          onClose={closeAddConsultation}
        />
      )}
    </div>
  )
}
