import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Kanban,
  CreditCard,
  MessageSquare,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useUIStore } from '@/store/ui'
import { useVisaAlerts } from '@/hooks/useVisaAlerts'

interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
  badge?: number
}

function NavItemLink({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ' +
        (isActive
          ? 'bg-violet-100 text-violet-700'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900')
      }
      title={collapsed ? item.label : undefined}
      aria-label={item.label}
    >
      <span className="shrink-0 w-5 h-5">{item.icon}</span>
      {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
      {!collapsed && item.badge != null && item.badge > 0 && (
        <span
          className="ml-auto min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full bg-rose-500 text-white text-xs font-semibold"
          aria-label={item.badge + ' alerts'}
        >
          {item.badge > 99 ? '99+' : item.badge}
        </span>
      )}
      {collapsed && item.badge != null && item.badge > 0 && (
        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" aria-hidden="true" />
      )}
    </NavLink>
  )
}

export function Sidebar() {
  const collapsed = useUIStore((s) => s.sidebarCollapsed)
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const { summary } = useVisaAlerts()

  const navItems: NavItem[] = [
    { label: 'Dashboard',     path: '/dashboard',     icon: <LayoutDashboard size={20} /> },
    { label: 'Students',      path: '/students',      icon: <Users size={20} /> },
    { label: 'Pipeline',      path: '/pipeline',      icon: <Kanban size={20} /> },
    { label: 'Visa Tracker',  path: '/visas',         icon: <CreditCard size={20} />, badge: summary.alertCount },
    { label: 'Consultations', path: '/consultations', icon: <MessageSquare size={20} /> },
  ]

  return (
    <>
      {/* Mobile backdrop — closes sidebar on tap */}
      {!collapsed && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40"
          aria-hidden="true"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      <aside
        className={
          // Mobile: fixed slide-over
          'fixed inset-y-0 left-0 z-50 flex flex-col h-full bg-white border-r border-slate-200 transition-all duration-200 ' +
          // Desktop: in-flow
          'md:relative md:z-auto ' +
          (collapsed
            ? '-translate-x-full md:translate-x-0 md:w-16'
            : 'translate-x-0 w-60')
        }
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 h-16 border-b border-slate-200 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shrink-0">
            <GraduationCap size={18} className="text-white" aria-hidden="true" />
          </div>
          {!collapsed && (
            <span className="font-semibold text-slate-900 text-base tracking-tight">EduPath</span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {navItems.map((item) => (
            <div key={item.path} className="relative">
              <NavItemLink
                item={item}
                collapsed={collapsed}
              />
            </div>
          ))}
        </nav>

        {/* Collapse toggle — desktop only */}
        <button
          onClick={toggleSidebar}
          className="hidden md:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-slate-200 items-center justify-center shadow-sm hover:bg-slate-50 transition-colors z-10"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>
    </>
  )
}
