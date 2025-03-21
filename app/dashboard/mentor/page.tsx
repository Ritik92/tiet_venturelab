import React from 'react';
import { getMentorStats, MentorDashboardStats } from '@/actions/dashboard_mentor';
import { getMentorMentorships, DashboardMentorship } from '@/actions/mentorships';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Package, TrendingUp, Award, Activity, CheckCircle, Clock, XCircle, CircleDollarSign, LineChart, ArrowRight, ExternalLink, MessageCircle, UserCheck, Briefcase, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow, format } from 'date-fns';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth.config';
import { Session } from 'next-auth';
import { MentorshipStatus, ProductStatus } from '@prisma/client';

export default async function MentorDashboardPage() {
  const session = await getServerSession(authOptions) as Session | null;
  
  if (!session) {
    redirect('/login');
  }
  
  // Verify user is a mentor
  if (session.user.role !== 'MENTOR' && session.user.role !== 'ADMIN') {
    redirect('/dashboard/user');
  }
  
  const stats: MentorDashboardStats = await getMentorStats();
  const mentorships: DashboardMentorship[] = await getMentorMentorships();

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome, {session.user.name}</h1>
          <p className="text-gray-500 mt-1">
            Manage your mentorships and track entrepreneur progress
          </p>
        </div>
        <Link href="/dashboard/mentor/profile">
          <Button variant="outline" className="flex items-center gap-2 border-gray-200 text-gray-700 hover:bg-gray-50">
            <UserCheck className="h-4 w-4" />
            <span>Mentor Profile</span>
          </Button>
        </Link>
      </header>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Active Mentorships"
          value={stats.activeMentorships}
          description={`${stats.completedMentorships} completed, ${stats.terminatedMentorships} terminated`}
          icon={<Award className="h-5 w-5 text-sky-500" />}
          color="text-sky-500"
          bgColor="bg-sky-50"
          borderColor="border-sky-100"
        />
        <StatsCard
          title="Funded Products"
          value={stats.totalProductsFunded}
          description={`$${stats.totalFundingAmount.toLocaleString()} total funding`}
          icon={<CircleDollarSign className="h-5 w-5 text-emerald-500" />}
          color="text-emerald-500"
          bgColor="bg-emerald-50"
          borderColor="border-emerald-100"
        />
        <StatsCard
          title="Success Rate"
          value={`${calculateSuccessRate(stats)}%`}
          description="Products funded vs. mentored"
          icon={<TrendingUp className="h-5 w-5 text-amber-500" />}
          color="text-amber-500"
          bgColor="bg-amber-50"
          borderColor="border-amber-100"
        />
        <StatsCard
          title="Total Entrepreneurs"
          value={calculateUniqueEntrepreneurs(mentorships)}
          description="Unique entrepreneurs mentored"
          icon={<Users className="h-5 w-5 text-indigo-500" />}
          color="text-indigo-500"
          bgColor="bg-indigo-50"
          borderColor="border-indigo-100"
        />
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <MentorshipStatusCard stats={stats} />
        <ProductProgressCard stats={stats} />
      </section>

      <section>
        <AllMentorshipsCard mentorships={mentorships} />
      </section>
    </div>
  );
}

function calculateSuccessRate(stats: MentorDashboardStats): string {
  const totalMentorships = stats.totalMentorships;
  const fundedProducts = stats.totalProductsFunded;
  
  if (totalMentorships === 0) return '0';
  
  const rate = (fundedProducts / totalMentorships) * 100;
  return rate.toFixed(1);
}

function calculateUniqueEntrepreneurs(mentorships: DashboardMentorship[]): number {
  const uniqueEntrepreneurs = new Set();
  
  mentorships.forEach(mentorship => {
    uniqueEntrepreneurs.add(mentorship.product.user.id);
  });
  
  return uniqueEntrepreneurs.size;
}

interface StatsCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
}

function StatsCard({ title, value, description, icon, color, bgColor, borderColor }: StatsCardProps) {
  return (
    <Card className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5">
        <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
        <div className={`p-2 rounded-full ${bgColor} ${borderColor}`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${color}`}>{value}</div>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

interface MentorshipStatusCardProps {
  stats: MentorDashboardStats;
}

function MentorshipStatusCard({ stats }: MentorshipStatusCardProps) {
  return (
    <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-900">Mentorship Status</CardTitle>
        <CardDescription>Status distribution of your mentorships</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <StatusCard 
            title="Active" 
            value={stats.statusCounts.ACTIVE || 0} 
            icon={<Activity className="h-4 w-4 text-sky-500" />} 
            bgColor="bg-sky-50"
            borderColor="border-sky-100"
            textColor="text-sky-600" 
          />
          <StatusCard 
            title="Completed" 
            value={stats.statusCounts.COMPLETED || 0} 
            icon={<CheckCircle className="h-4 w-4 text-emerald-500" />} 
            bgColor="bg-emerald-50"
            borderColor="border-emerald-100"
            textColor="text-emerald-600" 
          />
          <StatusCard 
            title="Funded Products" 
            value={stats.productStatusCounts.FUNDED || 0} 
            icon={<CircleDollarSign className="h-4 w-4 text-amber-500" />} 
            bgColor="bg-amber-50"
            borderColor="border-amber-100"
            textColor="text-amber-600" 
          />
          <StatusCard 
            title="Terminated" 
            value={stats.statusCounts.TERMINATED || 0} 
            icon={<XCircle className="h-4 w-4 text-rose-500" />} 
            bgColor="bg-rose-50"
            borderColor="border-rose-100"
            textColor="text-rose-600" 
          />
        </div>
      </CardContent>
    </Card>
  );
}

interface StatusCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
  textColor: string;
}

function StatusCard({ title, value, icon, bgColor, borderColor, textColor }: StatusCardProps) {
  return (
    <div className={`flex items-center p-4 rounded-lg ${bgColor} border ${borderColor} transition-all hover:shadow-sm`}>
      <div className="mr-3">{icon}</div>
      <div>
        <div className={`text-sm font-medium ${textColor}`}>{title}</div>
        <div className="text-lg font-bold text-gray-900">{value}</div>
      </div>
    </div>
  );
}

interface ProductProgressCardProps {
  stats: MentorDashboardStats;
}

function ProductProgressCard({ stats }: ProductProgressCardProps) {
  const fundedCount = stats.productStatusCounts.FUNDED || 0;
  const approvedCount = stats.productStatusCounts.APPROVED || 0;
  const pendingCount = stats.productStatusCounts.PENDING || 0;
  const total = fundedCount + approvedCount + pendingCount + (stats.productStatusCounts.REJECTED || 0);
  
  const fundedPercentage = total > 0 ? (fundedCount / total) * 100 : 0;
  const approvedPercentage = total > 0 ? (approvedCount / total) * 100 : 0;
  const pendingPercentage = total > 0 ? (pendingCount / total) * 100 : 0;
  
  return (
    <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-900">Product Progress</CardTitle>
        <CardDescription>Track your mentees' products journey</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-emerald-600 flex items-center gap-1.5">
              <CircleDollarSign className="h-4 w-4" /> Funded
            </span>
            <span className="text-gray-600">{fundedCount} of {total} ({fundedPercentage.toFixed(1)}%)</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${fundedPercentage}%` }}></div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-sky-600 flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4" /> Approved
            </span>
            <span className="text-gray-600">{approvedCount} of {total} ({approvedPercentage.toFixed(1)}%)</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div className="bg-sky-500 h-2.5 rounded-full" style={{ width: `${approvedPercentage}%` }}></div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-amber-600 flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> Pending
            </span>
            <span className="text-gray-600">{pendingCount} of {total} ({pendingPercentage.toFixed(1)}%)</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: `${pendingPercentage}%` }}></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface AllMentorshipsCardProps {
  mentorships: DashboardMentorship[];
}

function AllMentorshipsCard({ mentorships }: AllMentorshipsCardProps) {
  return (
    <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">My Mentorships</CardTitle>
            <CardDescription>All your active mentorships</CardDescription>
          </div>
          <Link href="/dashboard/mentor/available-products">
            <Button className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white shadow-sm">
              <BookOpen className="h-4 w-4" />
              <span>Available Products</span>
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-12 p-4 text-sm font-medium text-gray-500 bg-gray-50">
            <div className="col-span-4">Product</div>
            <div className="col-span-3">Entrepreneur</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Updated</div>
            <div className="col-span-1">Actions</div>
          </div>
          <div className="divide-y divide-gray-100">
            {mentorships.length > 0 ? (
              mentorships.map((mentorship) => (
                <div key={mentorship.id} className="grid grid-cols-12 p-4 text-sm items-center hover:bg-gray-50 transition-colors">
                  <div className="col-span-4 font-medium truncate">
                    <Link href={`/dashboard/mentor/mentorships/${mentorship.id}`} className="hover:text-sky-600 text-gray-900 transition-colors flex items-center gap-1.5 group">
                      {mentorship.product.title}
                      <ExternalLink className="h-3.5 w-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </div>
                  <div className="col-span-3 text-gray-600 flex items-center gap-1.5">
                    <span>{mentorship.product.user.name}</span>
                  </div>
                  <div className="col-span-2">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                      ${mentorship.status === 'ACTIVE' && 'bg-sky-100 text-sky-800 border border-sky-200'}
                      ${mentorship.status === 'COMPLETED' && 'bg-emerald-100 text-emerald-800 border border-emerald-200'}
                      ${mentorship.status === 'TERMINATED' && 'bg-rose-100 text-rose-800 border border-rose-200'}
                    `}>
                      {mentorship.status.charAt(0) + mentorship.status.slice(1).toLowerCase()}
                    </span>
                  </div>
                  <div className="col-span-2 text-gray-500">
                    {formatDistanceToNow(new Date(mentorship.updatedAt), { addSuffix: true })}
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <Link href={`/dashboard/mentor/mentorships/${mentorship.id}`}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MessageCircle className="h-4 w-4" />
                        <span className="sr-only">View Details</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 bg-gray-50 rounded-full">
                    <Briefcase className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600">No mentorships found</p>
                  <Link href="/dashboard/mentor/available-products">
                    <Button variant="outline" size="sm" className="mt-2 hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200 transition-colors">
                      Browse available products
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
