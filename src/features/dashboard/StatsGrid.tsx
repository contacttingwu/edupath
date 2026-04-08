import { useQuery } from '@tanstack/react-query'
import { Users, CreditCard, FileText, Gift } from 'lucide-react'
import { getAllStudents } from '@/lib/api/students'
import { getPendingApplicationsCount } from '@/lib/api/applications'
import { useVisaAlerts } from '@/hooks/useVisaAlerts'
import { SkeletonCard } from '@/components/ui/Skeleton'

interface StatCardProps {
  label: string
  value: number | string
  icon: React.ReactNode
  iconBg: string
  iconColor: string
  sub?: string
  isLoading?: boolean
}

function StatCard({ label, value, icon, iconBg, iconColor, sub, isLoading }: StatCardProps) {
  if (isLoading) return <SkeletonCard />

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">{label}</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
        <div className={'p-2.5 rounded-lg ' + iconBg}>
          <span className={iconColor}>{icon}</span>
        </div>
      </div>
    </div>
  )
}

export function StatsGrid() {
  const studentsQuery = useQuery({
    queryKey: ['students'],
    queryFn: getAllStudents,
    refetchInterval: 1000 * 60 * 5,
  })

  const pendingQuery = useQuery({
    queryKey: ['applications', 'pending-count'],
    queryFn: getPendingApplicationsCount,
    refetchInterval: 1000 * 60 * 5,
  })

  const { summary, isLoading: visaLoading } = useVisaAlerts()

  const offersReceived = studentsQuery.data?.filter(
    (s) => s.status === 'Offer Received'
  ).length ?? 0

  const isLoading = studentsQuery.isLoading || pendingQuery.isLoading || visaLoading

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Students"
        value={studentsQuery.data?.length ?? 0}
        icon={<Users size={20} />}
        iconBg="bg-violet-50"
        iconColor="text-violet-600"
        sub="active cases"
        isLoading={isLoading}
      />
      <StatCard
        label="Visa Expiring"
        value={summary.alertCount}
        icon={<CreditCard size={20} />}
        iconBg="bg-rose-50"
        iconColor="text-rose-600"
        sub="within 30 days"
        isLoading={isLoading}
      />
      <StatCard
        label="Applications Pending"
        value={pendingQuery.data ?? 0}
        icon={<FileText size={20} />}
        iconBg="bg-amber-50"
        iconColor="text-amber-600"
        sub="awaiting decision"
        isLoading={isLoading}
      />
      <StatCard
        label="Offers Received"
        value={offersReceived}
        icon={<Gift size={20} />}
        iconBg="bg-emerald-50"
        iconColor="text-emerald-600"
        sub="pending enrolment"
        isLoading={isLoading}
      />
    </div>
  )
}
