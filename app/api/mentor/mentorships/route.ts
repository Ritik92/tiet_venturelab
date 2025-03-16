// src/app/api/mentorships/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth.config";

// GET /api/mentorships - Fetch all mentorships for the logged-in mentor
export async function GET(request: NextRequest) {
  try {
    // Get the current user from the session
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || session.user.role !== "MENTOR") {
      return NextResponse.json(
        { error: "Unauthorized: Only mentors can access this endpoint" },
        { status: 403 }
      );
    }

    const userId = session.user.id;
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "newest";
    
    // Build filter conditions
    const filter: any = {
      mentorId: userId,
    };
    
    if (status && status !== "ALL") {
      filter.status = status;
    }
    
    if (category && category !== "ALL") {
      filter.product = {
        category: category,
      };
    }
    
    if (search) {
      filter.OR = [
        {
          product: {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          product: {
            description: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          product: {
            user: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
      ];
    }
    
    // Determine sort order
    let orderBy: any = {};
    if (sort === "newest") {
      orderBy = { createdAt: "desc" };
    } else if (sort === "oldest") {
      orderBy = { createdAt: "asc" };
    } else if (sort === "alphabetical") {
      orderBy = { product: { title: "asc" } };
    }
    
    // Fetch mentorships with filters and sorting
    const mentorships = await prisma.mentorship.findMany({
      where: filter,
      orderBy,
      include: {
        product: {
          include: {
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
    
    return NextResponse.json(mentorships);
  } catch (error) {
    console.error("Error fetching mentorships:", error);
    return NextResponse.json(
      { error: "Failed to fetch mentorships" },
      { status: 500 }
    );
  }
}
