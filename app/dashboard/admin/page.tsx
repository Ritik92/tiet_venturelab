import { Suspense } from 'react';
import { getDashboardStats } from '@/app/actions/dashboard-actions';
import StatsCard from '@/components/admin/StatsCard';
import { BarChart, Users, Package, Handshake } from 'lucide-react';
import RecentActivityFeed from '@/components/admin/RecentActivityFeed';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import DashboardSkeleton from '@/components/admin/DashboardSkelton';
import Link from 'next/link';
export const metadata = {
  title: 'Admin Dashboard',
  description: 'Overview of your platform statistics and recent activity',
};

export default async function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">Admin Dashboard</h1>
          <p className="text-lg text-gray-600">Monitor platform performance and recent activity</p>
        </header>

        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContent />
        </Suspense>
      </div>
    </div>
  );
}

async function DashboardContent() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Total Users"
          value={stats.totalUsers}
          description="Across all roles"
          icon={<Users className="h-6 w-6 text-blue-500" />}
          className="bg-white hover:shadow-md transition-shadow"
        />
        <Link href="/dashboard/admin/products">
        <StatsCard 
          title="Products"
          value={stats.totalProducts}
          description={`${stats.pendingProducts} pending approval`}
          icon={<Package className="h-6 w-6 text-blue-500" />}
          className="bg-white hover:shadow-md transition-shadow"
        />
        </Link>
        <Link href={`/dashboard/admin/mentorship`}>
        <StatsCard 
          title="Active Mentorships"
          value={stats.activeMentorships}
          description="Currently in progress"
          icon={<Handshake className="h-6 w-6 text-blue-500" />}
          className="bg-white hover:shadow-md transition-shadow"
        />
        </Link>
        <StatsCard 
          title="Funded Projects"
          value={stats.fundedProducts}
          description={`$${stats.totalFunding.toLocaleString()}`}
          icon={<BarChart className="h-6 w-6 text-blue-500" />}
          className="bg-white hover:shadow-md transition-shadow"
        />
      </div>

      {/* Recent Activity Section */}
      <Card className="bg-white border-none shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
              <CardDescription className="text-blue-100 mt-1">
                Latest platform updates and actions
              </CardDescription>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <RecentActivityFeed activities={stats.recentActivity} />
        </CardContent>
      </Card>
    </div>
  );
}