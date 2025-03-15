// app/api/mentorships/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth.config";

// GET /api/mentorships - Get all mentorships
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    // Only ADMIN users can view all mentorships
    // MENTOR users can only see their own mentorships
    // ENTREPRENEUR users can only see mentorships for their products
    let mentorships;
    
    if (session.user.role === "ADMIN") {
      mentorships = await prisma.mentorship.findMany({
        include: {
          mentor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          product: {
            select: {
              id: true,
              title: true,
              status: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else if (session.user.role === "MENTOR") {
      mentorships = await prisma.mentorship.findMany({
        where: {
          mentorId: session.user.id,
        },
        include: {
          mentor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          product: {
            select: {
              id: true,
              title: true,
              status: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      // Entrepreneur - find mentorships for their products
      mentorships = await prisma.mentorship.findMany({
        where: {
          product: {
            userId: session.user.id,
          },
        },
        include: {
          mentor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          product: {
            select: {
              id: true,
              title: true,
              status: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }
    
    return NextResponse.json(mentorships);
  } catch (error) {
    console.error("Error fetching mentorships:", error);
    return NextResponse.json(
      { message: "Error fetching mentorships" },
      { status: 500 }
    );
  }
}

// POST /api/mentorships - Create a new mentorship
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Unauthorized - only admins can create mentorships" },
        { status: 401 }
      );
    }
    
    const { mentorId, productId, notes } = await req.json();
    
    // Check if the mentor exists and is a MENTOR
    const mentor = await prisma.user.findUnique({
      where: { id: mentorId },
    });
    
    if (!mentor || mentor.role !== "MENTOR") {
      return NextResponse.json(
        { message: "Invalid mentor ID or user is not a mentor" },
        { status: 400 }
      );
    }
    
    // Check if the product exists and doesn't already have a mentorship
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { mentorship: true },
    });
    
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
    
    if (product.mentorship) {
      return NextResponse.json(
        { message: "Product already has an assigned mentor" },
        { status: 400 }
      );
    }
    
    // Create the mentorship
    const mentorship = await prisma.mentorship.create({
      data: {
        mentorId,
        productId,
        notes,
        status: "ACTIVE",
      },
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        product: {
          select: {
            id: true,
            title: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
    
    return NextResponse.json(mentorship, { status: 201 });
  } catch (error) {
    console.error("Error creating mentorship:", error);
    return NextResponse.json(
      { message: "Error creating mentorship" },
      { status: 500 }
    );
  }
}