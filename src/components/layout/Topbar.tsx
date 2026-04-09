import { useLocation, useNavigate, Link } from 'react-router-dom'
import { Search, Plus, Menu } from 'lucide-react'
import { useUIStore } from '@/store/ui'

interface CtaButton {
  label: string
  action: () => void
  variant?: 'primary' | 'secondary'
}

interface TopbarConfig {
  title: string
  breadcrumbs: { label: string; path?: string }[]
  ctas?: CtaButton[]
}

function useTopbarConfig(): TopbarConfig {
  const location = useLocation()
  const navigate = useNavigate()
  const openAddConsultation = useUIStore((s) => s.openAddConsultation)

  const path = location.pathname

  if (path === '/students/new') {
    return {
      title: 'Add Student',
      breadcrumbs: [{ label: 'Students', path: '/students' }, { label: 'Add Student' }],
    }
  }
  if (path.match(/^\/students\/[^/]+\/edit$/)) {
    return {
      title: 'Edit Student',
      breadcrumbs: [{ label: 'Students', path: '/students' }, { label: 'Edit Student' }],
    }
  }
  if (path.match(/^\/students\/[^/]+$/)) {
    return {
      title: 'Student Profile',
      breadcrumbs: [{ label: 'Students', path: '/students' }, { label: 'Profile' }],
    }
  }
  if (path === '/students') {
    return {
      title: 'Students',
      breadcrumbs: [{ label: 'Students' }],
      ctas: [{ label: 'Add Student', action: () => navigate('/students/new'), variant: 'primary' }],
    }
  }
  if (path === '/dashboard') {
    return {
      title: 'Dashboard',
      breadcrumbs: [{ label: 'Dashboard' }],
      ctas: [
        { label: 'Add Student', action: () => navigate('/students/new'), variant: 'primary' },
        { label: 'Log Consultation', action: () => openAddConsultation(), variant: 'secondary' },
      ],
    }
  }
  if (path === '/pipeline') {
    return {
      title: 'Pipeline',
      breadcrumbs: [{ label: 'Pipeline' }],
      ctas: [{ label: 'Log Consultation', action: () => openAddConsultation(), variant: 'primary' }],
    }
  }
  if (path === '/visas') {
    return {
      title: 'Visa Tracker',
      breadcrumbs: [{ label: 'Visa Tracker' }],
      ctas: [{ label: 'Log Consultation', action: () => openAddConsultation(), variant: 'primary' }],
    }
  }
  if (path === '/consultations') {
    return {
      title: 'Consultations',
      breadcrumbs: [{ label: 'Consultations' }],
      ctas: [{ label: 'Log Consultation', action: () => openAddConsultation(), variant: 'primary' }],
    }
  }

  return { title: 'EduPath', breadcrumbs: [] }
}

export function Topbar() {
  const config = useTopbarConfig()
  const searchQuery = useUIStore((s) => s.searchQuery)
  const setSearchQuery = useUIStore((s) => s.setSearchQuery)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const location = useLocation()

  const showSearch = location.pathname === '/students'

  return (
    <header className="flex items-center gap-3 h-16 px-4 sm:px-6 bg-white border-b border-slate-200 shrink-0">
      {/* Mobile menu toggle */}
      <button
        onClick={toggleSidebar}
        className="md:hidden p-1.5 rounded-md hover:bg-slate-100 text-slate-500"
        aria-label="Toggle sidebar"
      >
        <Menu size={20} />
      </button>

      {/* Breadcrumbs + title */}
      <div className="flex-1 min-w-0">
        {config.breadcrumbs.length > 1 && (
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-0.5">
            {config.breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span>/</span>}
                {crumb.path ? (
                  <Link to={crumb.path} className="hover:text-slate-600 transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span>{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-lg font-semibold text-slate-900 leading-tight truncate">
          {config.title}
        </h1>
      </div>

      {/* Search */}
      {showSearch && (
        <div className="relative hidden sm:block">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="search"
            placeholder="Search students…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-56 pl-9 pr-3 h-9 rounded-lg border border-slate-200 bg-slate-50 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
          />
        </div>
      )}

      {/* CTAs */}
      {config.ctas && config.ctas.length > 0 && (
        <div className="flex items-center gap-2 shrink-0">
          {config.ctas.map((cta) => (
            <button
              key={cta.label}
              onClick={cta.action}
              className={
                'flex items-center gap-1.5 px-4 h-9 rounded-lg text-sm font-medium transition-colors ' +
                (cta.variant === 'secondary'
                  ? 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                  : 'bg-violet-600 text-white hover:bg-violet-700')
              }
            >
              <Plus size={15} />
              <span className="hidden sm:inline">{cta.label}</span>
            </button>
          ))}
        </div>
      )}
    </header>
  )
}
