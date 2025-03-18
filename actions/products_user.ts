// app/actions/products.ts
'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ProductStatus, Category } from '@prisma/client';
import { authOptions } from '@/auth.config';

interface GetProductsOptions {
  status?: ProductStatus;
  category?: Category;
  limit?: number;
  page?: number;
  search?: string;
}

export async function getDashboardProducts(options: GetProductsOptions = {}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    throw new Error('Unauthorized');
  }
  
  const { limit = 10, status, category, search } = options;
  const userId = session.user.id;
  const userRole = session.user.role;
  
  // Define base query filters
  let where: any = {};
  
  // Filter by role
  if (userRole === 'ENTREPRENEUR') {
    where.userId = userId;
  } else if (userRole === 'MENTOR') {
    where.mentorship = {
      mentorId: userId
    };
  }
  
  // Apply additional filters
  if (status) {
    where.status = status;
  }
  
  if (category) {
    where.category = category;
  }
  
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }
  
  const products = await prisma.product.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    take: limit,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          profileImage: true
        }
      },
      mentorship: {
        include: {
          mentor: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImage: true
            }
          }
        }
      }
    }
  });
  
  return products;
}

export async function createProduct(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    throw new Error('Unauthorized');
  }
  
  if (session.user.role !== 'ENTREPRENEUR') {
    throw new Error('Only entrepreneurs can create products');
  }
  
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const videoUrl = formData.get('videoUrl') as string;
  const category = formData.get('category') as Category;
  const pitchDeck = formData.get('pitchDeck') as string;
  
  if (!title || !description || !videoUrl || !category) {
    throw new Error('Missing required fields');
  }
  
  const product = await prisma.product.create({
    data: {
      title,
      description,
      videoUrl,
      category,
      pitchDeck,
      userId: session.user.id,
      images: [] // Initialize with empty array
    }
  });
  
  revalidatePath('/products');
  revalidatePath('/dashboard');
  
  return redirect(`/products/${product.id}`);
}

export async function updateProductStatus(productId: string, status: ProductStatus) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    throw new Error('Unauthorized');
  }
  
  if (session.user.role !== 'ADMIN' && status !== 'PENDING') {
    throw new Error('Only admins can change product status');
  }
  
  await prisma.product.update({
    where: { id: productId },
    data: { status }
  });
  
  revalidatePath(`/products/${productId}`);
  revalidatePath('/products');
  revalidatePath('/dashboard');
  
  return { success: true };
}