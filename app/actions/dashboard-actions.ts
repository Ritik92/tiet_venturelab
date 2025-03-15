'use server'

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Role, ProductStatus, MentorshipStatus } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth.config';

type DashboardStats = {
  totalUsers: number;
  totalProducts: number;
  pendingProducts: number;
  fundedProducts: number;
  activeMentorships: number;
  totalFunding: number;
  recentActivity: Array<{
    id: string;
    type: 'user' | 'product' | 'mentorship';
    title: string;
    description: string;
    timestamp: Date;
  }>;
  categoryDistribution: Array<{
    category: string;
    count: number;
  }>;
}

export async function getDashboardStats(): Promise<DashboardStats> {
    const session = await getServerSession(authOptions);
  console.log('This is session',session)
    // Check if user is authenticated and has admin role
    if (!session || session.user.role !== 'ADMIN') {
        console.log('This is session',session)
    }
  
  // Get total users count
  const totalUsers = await prisma.user.count();
  
  // Get product stats
  const totalProducts = await prisma.product.count();
  const pendingProducts = await prisma.product.count({
    where: { status: ProductStatus.PENDING }
  });
  const fundedProducts = await prisma.product.count({
    where: { status: ProductStatus.FUNDED }
  });
  
  // Calculate total funding amount
  const fundingResult = await prisma.product.aggregate({
    where: { 
      status: ProductStatus.FUNDED,
      fundingAmount: { not: null }
    },
    _sum: {
      fundingAmount: true
    }
  });
  const totalFunding = fundingResult._sum.fundingAmount || 0;
  
  // Get active mentorships count
  const activeMentorships = await prisma.mentorship.count({
    where: { status: MentorshipStatus.ACTIVE }
  });
  
  // Get category distribution
  const categoryDistribution = await prisma.$queryRaw<Array<{category: string, count: number}>>`
    SELECT "category"::text as category, COUNT(*) as count 
    FROM "Product" 
    GROUP BY "category" 
    ORDER BY count DESC
  `;
  
  // Get recent activity
  const recentUsers = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      createdAt: true,
      role: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });
  
  const recentProducts = await prisma.product.findMany({
    select: {
      id: true,
      title: true,
      status: true,
      createdAt: true,
      user: {
        select: { name: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });
  
  const recentMentorships = await prisma.mentorship.findMany({
    select: {
      id: true,
      createdAt: true,
      status: true,
      mentor: {
        select: { name: true }
      },
      product: {
        select: { title: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });
  
  // Format recent activity
  const recentActivity = [
    ...recentUsers.map(user => ({
      id: user.id,
      type: 'user' as const,
      title: `New ${user.role.toLowerCase()}`,
      description: `${user.name} joined the platform`,
      timestamp: user.createdAt,
    })),
    ...recentProducts.map(product => ({
      id: product.id,
      type: 'product' as const,
      title: `Product ${product.status.toLowerCase()}`,
      description: `"${product.title}" by ${product.user.name}`,
      timestamp: product.createdAt,
    })),
    ...recentMentorships.map(mentorship => ({
      id: mentorship.id,
      type: 'mentorship' as const,
      title: 'New mentorship',
      description: `${mentorship.mentor.name} mentoring "${mentorship.product.title}"`,
      timestamp: mentorship.createdAt,
    }))
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10);
  
  return {
    totalUsers,
    totalProducts,
    pendingProducts,
    fundedProducts,
    activeMentorships,
    totalFunding,
    recentActivity,
    categoryDistribution,
  };
}