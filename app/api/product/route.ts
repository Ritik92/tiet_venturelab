// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { ProductStatus } from "@prisma/client";
import { authOptions } from "@/auth.config";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    // Get the authenticated user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Parse the request body
    const data = await req.json();
    const { title, description, videoUrl, category, pitchDeck, images } = data;

    // Validate required fields
    if (!title || !description || !videoUrl || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a new product
    const product = await prisma.product.create({
      data: {
        title,
        description,
        videoUrl,
        category,
        pitchDeck,
        images,
        status: ProductStatus.PENDING,
        userId: user.id
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    // Get the authenticated user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Determine which products to fetch based on user role
    let products;
    if (user.role === "ADMIN" || user.role === "MENTOR") {
      // Admins and mentors can see all products
      products = await prisma.product.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          mentorship: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } else {
      // Entrepreneurs can only see their own products
      products = await prisma.product.findMany({
        where: {
          userId: user.id
        },
        include: {
          mentorship: {
            include: {
              mentor: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}