import { StatsGrid } from './StatsGrid'
import { VisaAlertList } from './VisaAlertList'
import { RecentConsultations } from './RecentConsultations'
import { PipelineMini } from './PipelineMini'
import { usePageTitle } from '@/hooks/usePageTitle'

export function DashboardPage() {
  usePageTitle('Dashboard')
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <StatsGrid />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VisaAlertList />
        <RecentConsultations />
      </div>

      <PipelineMini />
    </div>
  )
}
