// app/api/mentorships/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth.config";

// GET /api/mentorships/[id] - Get a specific mentorship
export async function GET(
  req: NextRequest,
  { params }: { params: any }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const mentorship = await prisma.mentorship.findUnique({
      where: { id: params.id },
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            email: true,
            bio: true,
          },
        },
        product: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            category: true,
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
    
    if (!mentorship) {
      return NextResponse.json(
        { message: "Mentorship not found" },
        { status: 404 }
      );
    }
    
    // Check if the user has permission to view this mentorship
    const isAdmin = session.user.role === "ADMIN";
    const isMentor = session.user.id === mentorship.mentorId;
    const isEntrepreneur = session.user.id === mentorship.product.user.id;
    
    if (!isAdmin && !isMentor && !isEntrepreneur) {
      return NextResponse.json(
        { message: "You don't have permission to view this mentorship" },
        { status: 403 }
      );
    }
    
    return NextResponse.json(mentorship);
  } catch (error) {
    console.error("Error fetching mentorship:", error);
    return NextResponse.json(
      { message: "Error fetching mentorship" },
      { status: 500 }
    );
  }
}

// PATCH /api/mentorships/[id] - Update a mentorship status
export async function PATCH(
  request: NextRequest,
  { params }: { params: any }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const mentorshipId = params.id;
    const { status, mentorId, notes } = await request.json();

    // Validate input
    if (!mentorshipId) {
      return NextResponse.json({ message: "Mentorship ID is required" }, { status: 400 });
    }

    // Check if mentorship exists
    const existingMentorship = await prisma.mentorship.findUnique({
      where: { id: mentorshipId },
    });

    if (!existingMentorship) {
      return NextResponse.json({ message: "Mentorship not found" }, { status: 404 });
    }

    // If mentorId is provided, verify the mentor exists and has the MENTOR role
    if (mentorId) {
      const mentorExists = await prisma.user.findFirst({
        where: { 
          id: mentorId,
          role: "MENTOR"
        },
      });

      if (!mentorExists) {
        return NextResponse.json({ message: "Selected mentor not found or is not a mentor" }, { status: 400 });
      }
    }

    // Update the mentorship
    const updatedMentorship = await prisma.mentorship.update({
      where: { id: mentorshipId },
      data: {
        status: status,
        mentorId: mentorId,
        notes: notes,
        updatedAt: new Date(),
      },
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            email: true,
            bio: true,
          },
        },
        product: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            category: true,
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

    return NextResponse.json(updatedMentorship);
  } catch (error) {
    console.error("Error updating mentorship:", error);
    return NextResponse.json(
      { message: "Failed to update mentorship" },
      { status: 500 }
    );
  }
}

// DELETE /api/mentorships/[id] - Delete a mentorship (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: any }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Unauthorized - only admins can delete mentorships" },
        { status: 401 }
      );
    }
    
    const mentorship = await prisma.mentorship.findUnique({
      where: { id: params.id },
    });
    
    if (!mentorship) {
      return NextResponse.json(
        { message: "Mentorship not found" },
        { status: 404 }
      );
    }
    
    // Delete the mentorship
    await prisma.mentorship.delete({
      where: { id: params.id },
    });
    
    return NextResponse.json({ message: "Mentorship deleted successfully" });
  } catch (error) {
    console.error("Error deleting mentorship:", error);
    return NextResponse.json(
      { message: "Error deleting mentorship" },
      { status: 500 }
    );
  }
}