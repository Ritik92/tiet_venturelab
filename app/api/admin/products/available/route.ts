// app/api/products/available/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from     "@/auth.config";

// GET /api/products/available - Get products available for mentorship
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Unauthorized - only admins can view available products" },
        { status: 401 }
      );
    }
    
    // Get approved products that don't have mentorships
    const availableProducts = await prisma.product.findMany({
      where: {
      
        mentorship: null, // No existing mentorship
      },
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
        createdAt: "desc",
      },
    });
    
    return NextResponse.json(availableProducts);
  } catch (error) {
    console.error("Error fetching available products:", error);
    return NextResponse.json(
      { message: "Error fetching available products" },
      { status: 500 }
    );
  }
}