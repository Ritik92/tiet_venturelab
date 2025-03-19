'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ProductStatus, Category } from '@prisma/client';
import { authOptions } from '@/auth.config';

export interface GetProductsOptions {
  status?: ProductStatus;
  category?: Category;
  limit?: number;
  page?: number;
  search?: string;
}

export interface DashboardProduct {
  id: string;
  title: string;
  category: Category;
  status: ProductStatus;
  createdAt: Date;
  user: {
    name: string;
  };
}

export async function getDashboardProducts(options: GetProductsOptions = {}): Promise<DashboardProduct[]> {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    throw new Error('Unauthorized');
  }
  
  const { limit, status, category, search, page = 1 } = options;
  const userId = session.user.id;
  
  // Define base query filters - always filter by current user
  const where: any = {
    userId: userId
  };
  
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
  
  // Calculate pagination
  const skip = limit ? (page - 1) * limit : undefined;
  const take = limit;
  
  // Only select the fields we need
  const products = await prisma.product.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    skip,
    take,
    select: {
      id: true,
      title: true,
      category: true,
      status: true,
      createdAt: true,
      user: {
        select: {
          name: true
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
  
  revalidatePath(`/dashboard/user/myproducts/${productId}`);
  revalidatePath('/dashboard/user');
  
  return { success: true };
}