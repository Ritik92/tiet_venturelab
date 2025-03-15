import { Suspense } from 'react';
import { getDashboardStats } from '@/app/actions/dashboard-actions';
import StatsCard from '@/components/admin/StatsCard';
import { BarChart, Users, Package, Handshake } from 'lucide-react';
import RecentActivityFeed from '@/components/admin/RecentActivityFeed';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardSkeleton from '@/components/admin/DashboardSkelton';

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Overview of your platform statistics and recent activity',
};

export default async function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your platform statistics and recent activity.
        </p>
      </div>
      
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}

async function DashboardContent() {
  const stats = await getDashboardStats();
  
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Total Users"
          value={stats.totalUsers}
          description="Across all roles"
          icon={<Users className="h-5 w-5 text-blue-600" />}
        />
        <StatsCard 
          title="Products"
          value={stats.totalProducts}
          description={`${stats.pendingProducts} pending approval`}
          icon={<Package className="h-5 w-5 text-green-600" />}
        />
        <StatsCard 
          title="Active Mentorships"
          value={stats.activeMentorships}
          description="Currently in progress"
          icon={<Handshake className="h-5 w-5 text-amber-600" />}
        />
        <StatsCard 
          title="Funded Projects"
          value={stats.fundedProducts}
          description={`$${stats.totalFunding.toLocaleString()}`}
          icon={<BarChart className="h-5 w-5 text-purple-600" />}
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivityFeed activities={stats.recentActivity} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>Products by category</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <div className="h-full w-full flex items-center justify-center">
              {/* We'll replace this with an actual chart component when we implement it */}
              <p className="text-muted-foreground text-sm">Category chart will be displayed here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}