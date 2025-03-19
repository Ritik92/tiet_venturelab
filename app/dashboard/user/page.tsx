// app/dashboard/user/page.tsx
import React from 'react';
import { getStats, DashboardStats } from '@/actions/dashboard_user';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  Package,
  TrendingUp,
  Award,
  Activity,
  CheckCircle,
  Clock,
  XCircle,
  CircleDollarSign,
  LineChart,
  PlusCircle,
  ArrowRight,
  ExternalLink,
  Search,
  Filter
} from 'lucide-react';
import { getDashboardProducts, DashboardProduct } from '@/actions/products_user';
import Link from 'next/link';
import { formatDistanceToNow, format } from 'date-fns';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth.config';
import { Session } from 'next-auth';
import { ProductStatus } from '@prisma/client';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions) as Session | null;
  
  if (!session) {
    redirect('/login');
  }
  
  const stats: DashboardStats = await getStats();
  const allProducts: DashboardProduct[] = await getDashboardProducts();

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b border-gray-100">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome, {session.user.name}</h1>
          <p className="text-gray-500 mt-1">
            Manage your products and track their progress
          </p>
        </div>
        <Link href="/dashboard/user/submit-product">
          <Button className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white shadow-sm">
            <PlusCircle className="h-4 w-4" />
            <span>New Product</span>
          </Button>
        </Link>
      </header>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Products"
          value={stats.totalProducts}
          description={`${stats.statusCounts.APPROVED || 0} approved, ${stats.statusCounts.PENDING || 0} pending`}
          icon={<Package className="h-5 w-5 text-sky-500" />}
          color="text-sky-500"
          bgColor="bg-sky-50"
          borderColor="border-sky-100"
        />
        <StatsCard
          title="Funded Products"
          value={stats.statusCounts.FUNDED || 0}
          description={`$${stats.totalFunding.toLocaleString()} total funding`}
          icon={<CircleDollarSign className="h-5 w-5 text-emerald-500" />}
          color="text-emerald-500"
          bgColor="bg-emerald-50"
          borderColor="border-emerald-100"
        />
        <StatsCard
          title="Active Mentorships"
          value={stats.activeMentorships}
          description="Ongoing product mentorships"
          icon={<Award className="h-5 w-5 text-amber-500" />}
          color="text-amber-500"
          bgColor="bg-amber-50"
          borderColor="border-amber-100"
        />
        <StatsCard
          title="Approval Rate"
          value={`${calculateApprovalRate(stats.statusCounts)}%`}
          description="Products approved vs. submitted"
          icon={<LineChart className="h-5 w-5 text-indigo-500" />}
          color="text-indigo-500"
          bgColor="bg-indigo-50"
          borderColor="border-indigo-100"
        />
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <StatusOverviewCard stats={stats} />
        <FundingProgressCard stats={stats} />
      </section>

      <section>
        <AllProductsCard products={allProducts} />
      </section>
    </div>
  );
}

function calculateApprovalRate(statusCounts: Record<ProductStatus, number>): string {
  const approved = statusCounts.APPROVED || 0;
  const rejected = statusCounts.REJECTED || 0;
  const total = approved + rejected + (statusCounts.PENDING || 0) + (statusCounts.FUNDED || 0);
  
  if (total === 0) return '0';
  
  const approvedAndFunded = approved + (statusCounts.FUNDED || 0);
  const rate = (approvedAndFunded / total) * 100;
  return rate.toFixed(1);
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

interface StatusOverviewCardProps {
  stats: DashboardStats;
}

function StatusOverviewCard({ stats }: StatusOverviewCardProps) {
  return (
    <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-900">Product Status Overview</CardTitle>
        <CardDescription>Status distribution of your products</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <StatusCard 
            title="Approved" 
            value={stats.statusCounts.APPROVED || 0} 
            icon={<CheckCircle className="h-4 w-4 text-emerald-500" />} 
            bgColor="bg-emerald-50"
            borderColor="border-emerald-100"
            textColor="text-emerald-600" 
          />
          <StatusCard 
            title="Pending" 
            value={stats.statusCounts.PENDING || 0} 
            icon={<Clock className="h-4 w-4 text-amber-500" />} 
            bgColor="bg-amber-50"
            borderColor="border-amber-100"
            textColor="text-amber-600" 
          />
          <StatusCard 
            title="Funded" 
            value={stats.statusCounts.FUNDED || 0} 
            icon={<TrendingUp className="h-4 w-4 text-sky-500" />} 
            bgColor="bg-sky-50"
            borderColor="border-sky-100"
            textColor="text-sky-600" 
          />
          <StatusCard 
            title="Rejected" 
            value={stats.statusCounts.REJECTED || 0} 
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

interface FundingProgressCardProps {
  stats: DashboardStats;
}

function FundingProgressCard({ stats }: FundingProgressCardProps) {
  const fundedCount = stats.statusCounts.FUNDED || 0;
  const approvedCount = stats.statusCounts.APPROVED || 0;
  const pendingCount = stats.statusCounts.PENDING || 0;
  const total = fundedCount + approvedCount + pendingCount + (stats.statusCounts.REJECTED || 0);
  
  const fundedPercentage = total > 0 ? (fundedCount / total) * 100 : 0;
  const approvedPercentage = total > 0 ? (approvedCount / total) * 100 : 0;
  const pendingPercentage = total > 0 ? (pendingCount / total) * 100 : 0;
  
  return (
    <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-900">Funding Progress</CardTitle>
        <CardDescription>Track your products' journey to funding</CardDescription>
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

interface AllProductsCardProps {
  products: DashboardProduct[];
}

function AllProductsCard({ products }: AllProductsCardProps) {
  return (
    <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">My Products</CardTitle>
            <CardDescription>All your products</CardDescription>
          </div>
          <Link href="/dashboard/user/submit-product">
            <Button className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white shadow-sm">
              <PlusCircle className="h-4 w-4" />
              <span>New Product</span>
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-12 p-4 text-sm font-medium text-gray-500 bg-gray-50">
            <div className="col-span-5">Title</div>
            <div className="col-span-3">Category</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Created</div>
          </div>
          <div className="divide-y divide-gray-100">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product.id} className="grid grid-cols-12 p-4 text-sm items-center hover:bg-gray-50 transition-colors">
                  <div className="col-span-5 font-medium truncate">
                    <Link href={`/dashboard/user/myproducts/${product.id}`} className="hover:text-sky-600 text-gray-900 transition-colors flex items-center gap-1.5 group">
                      {product.title}
                      <ExternalLink className="h-3.5 w-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </div>
                  <div className="col-span-3 text-gray-600 flex items-center gap-1.5">
                    <span>{getCategoryIcon(product.category)}</span>
                    <span>{formatCategory(product.category.toLowerCase())}</span>
                  </div>
                  <div className="col-span-2">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                      ${product.status === 'APPROVED' && 'bg-emerald-100 text-emerald-800 border border-emerald-200'}
                      ${product.status === 'PENDING' && 'bg-amber-100 text-amber-800 border border-amber-200'}
                      ${product.status === 'REJECTED' && 'bg-rose-100 text-rose-800 border border-rose-200'}
                      ${product.status === 'FUNDED' && 'bg-sky-100 text-sky-800 border border-sky-200'}
                    `}>
                      {product.status.charAt(0) + product.status.slice(1).toLowerCase()}
                    </span>
                  </div>
                  <div className="col-span-2 text-gray-500">
                    {formatDistanceToNow(new Date(product.createdAt), { addSuffix: true })}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 bg-gray-50 rounded-full">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600">No products found</p>
                  <Link href="/dashboard/user/submit-product">
                    <Button variant="outline" size="sm" className="mt-2 hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200 transition-colors">
                      Create your first product
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

// Helper functions
function getCategoryIcon(category: string) {
  switch (category) {
    case 'TECHNOLOGY': return '💻';
    case 'HEALTH': return '🏥';
    case 'EDUCATION': return '🎓';
    case 'FINANCE': return '💰';
    case 'FOOD': return '🍔';
    case 'RETAIL': return '🛍️';
    case 'ENTERTAINMENT': return '🎬';
    case 'SUSTAINABILITY': return '♻️';
    case 'OTHER': return '📦';
    default: return '📦';
  }
}

function formatCategory(category: string) {
  return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
}