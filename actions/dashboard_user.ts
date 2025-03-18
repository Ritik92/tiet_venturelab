'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { Role, ProductStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/auth.config';

// Define an interface for stats response
export interface DashboardStats {
  totalProducts: number;
  activeMentorships: number;
  totalFunding: number;
  statusCounts: Record<ProductStatus, number>;
}

export async function getStats(): Promise<DashboardStats> {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    throw new Error('Unauthorized');
  }
  
  const { user } = session;
  
  // Get status breakdown for the current user's products
  let statusCounts: Record<ProductStatus, number> = {
    PENDING: 0,
    APPROVED: 0,
    REJECTED: 0,
    FUNDED: 0
  };
  
  if (user.role === 'ENTREPRENEUR') {
    const productStatusCounts = await prisma.product.groupBy({
      by: ['status'],
      where: { userId: user.id },
      _count: true
    });
    
    statusCounts = productStatusCounts.reduce((acc, item) => {
      acc[item.status] = item._count;
      return acc;
    }, statusCounts);
  } else if (user.role === 'ADMIN') {
    const productStatusCounts = await prisma.product.groupBy({
      by: ['status'],
      _count: true
    });
    
    statusCounts = productStatusCounts.reduce((acc, item) => {
      acc[item.status] = item._count;
      return acc;
    }, statusCounts);
  } else if (user.role === 'MENTOR') {
    const mentorshipsWithProducts = await prisma.mentorship.findMany({
      where: { mentorId: user.id },
      include: { product: true }
    });
    
    statusCounts = mentorshipsWithProducts.reduce((acc, { product }) => {
      acc[product.status] = (acc[product.status] || 0) + 1;
      return acc;
    }, statusCounts);
  }
  
  // Get only the stats the user needs based on their role
  const totalProducts = user.role === 'ENTREPRENEUR' 
    ? await prisma.product.count({ where: { userId: user.id }})
    : await prisma.product.count();
    
  const activeMentorships = user.role === 'MENTOR'
    ? await prisma.mentorship.count({ where: { mentorId: user.id, status: 'ACTIVE' }})
    : await prisma.mentorship.count({ where: {  product: { userId: user.id },
      status: 'ACTIVE'  }});
  
  // Only calculate total funding if needed (mainly for admins)
  const totalFunding = user.role === 'ADMIN' 
    ? await prisma.product.aggregate({ _sum: { fundingAmount: true }})
    : { _sum: { fundingAmount: 0 }};
  
  return {
    totalProducts,
    activeMentorships,
    totalFunding: totalFunding._sum.fundingAmount || 0,
    statusCounts,
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
  
  revalidatePath('/dashboard/user');
  
  return { success: true };
}