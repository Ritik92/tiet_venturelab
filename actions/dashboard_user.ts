// app/actions/dashboard.ts
'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { Role } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/auth.config';

export async function getStats() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    throw new Error('Unauthorized');
  }
  
  const { user } = session;
  
  // Get base stats
  const totalUsers = await prisma.user.count();
  const totalProducts = await prisma.product.count();
  const activeMentorships = await prisma.mentorship.count({
    where: { status: 'ACTIVE' }
  });
  const totalFunding = await prisma.product.aggregate({
    _sum: { fundingAmount: true }
  });
  
  // Get status breakdown for the current user's products
  let statusCounts = {};
  if (user.role === 'ENTREPRENEUR') {
    const productStatusCounts = await prisma.product.groupBy({
      by: ['status'],
      where: { userId: user.id },
      _count: true
    });
    
    statusCounts = productStatusCounts.reduce((acc, item) => {
      acc[item.status] = item._count;
      return acc;
    }, {});
  } else if (user.role === 'ADMIN') {
    const productStatusCounts = await prisma.product.groupBy({
      by: ['status'],
      _count: true
    });
    
    statusCounts = productStatusCounts.reduce((acc, item) => {
      acc[item.status] = item._count;
      return acc;
    }, {});
  } else if (user.role === 'MENTOR') {
    // For mentors, count products they're mentoring by status
    const mentorshipsWithProducts = await prisma.mentorship.findMany({
      where: { mentorId: user.id },
      include: { product: true }
    });
    
    statusCounts = mentorshipsWithProducts.reduce((acc, { product }) => {
      acc[product.status] = (acc[product.status] || 0) + 1;
      return acc;
    }, {});
  }
  
  // Mock recent activities (in a real app, you'd have an activity log table)
  const recentActivities = [
    {
      title: 'You updated your profile',
      time: '2 hours ago'
    },
    {
      title: 'Product "Smart Home IoT" was approved',
      time: '1 day ago'
    },
    {
      title: 'New mentor assigned to your product',
      time: '3 days ago'
    }
  ];
  
  return {
    totalUsers,
    totalProducts,
    activeMentorships,
    totalFunding: totalFunding._sum.fundingAmount || 0,
    statusCounts,
    recentActivities
  };
}

export async function updateUserProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    throw new Error('Unauthorized');
  }
  
  const name = formData.get('name') as string;
  const bio = formData.get('bio') as string;
  
  if (!name) {
    throw new Error('Name is required');
  }
  
  await prisma.user.update({
    where: { id: session.user.id },
    data: { name, bio }
  });
  
  revalidatePath('/profile');
  revalidatePath('/dashboard');
  
  return { success: true };
}