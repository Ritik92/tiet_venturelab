import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, ProductStatus } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth.config';

const prisma = new PrismaClient();

interface StatusUpdateRequest {
  status: ProductStatus;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: any }
) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      );
    }
    
    const productId = params.id;
    const body: StatusUpdateRequest = await request.json();
    
    if (!body.status || !Object.values(ProductStatus).includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }
    
    // Update product status
    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        status: body.status,
      },
    });
    
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product status:', error);
    return NextResponse.json(
      { error: 'Failed to update product status' },
      { status: 500 }
    );
  }
}