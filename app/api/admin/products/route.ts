import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, ProductStatus, Category } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth.config';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      );
    }
    
    // Parse query parameters
    const url = new URL(request.url);
    const status = url.searchParams.get('status') as ProductStatus | null;
    const category = url.searchParams.get('category') as Category | null;
    
    // Build query
    const where: any = {};
    if (status) where.status = status;
    if (category) where.category = category;
    
    // Fetch products with filters
    const products = await prisma.product.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}