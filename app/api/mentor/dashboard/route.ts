import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/auth.config';
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'MENTOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const mentorId = session.user.id;

  try {
    const mentor = await prisma.user.findUnique({
      where: { id: mentorId },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        profileImage: true,
      },
    });

    const mentorships = await prisma.mentorship.findMany({
      where: { mentorId },
      include: {
        product: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                bio: true,
              },
            },
          },
        },
      },
    });

    const stats = {
      active: mentorships.filter((m) => m.status === 'ACTIVE').length,
      completed: mentorships.filter((m) => m.status === 'COMPLETED').length,
      total: mentorships.length,
    };

    return NextResponse.json({
      mentor,
      mentorships: mentorships.map((m) => ({
        id: m.id,
        product: {
          id: m.product.id,
          title: m.product.title,
          description: m.product.description,
          videoUrl: m.product.videoUrl,
          pitchDeck: m.product.pitchDeck,
          status: m.product.status,
        },
        entrepreneur: {
          id: m.product.user.id,
          name: m.product.user.name,
          email: m.product.user.email,
          bio: m.product.user.bio,
        },
        status: m.status,
        notes: m.notes,
        updatedAt: m.updatedAt.toISOString(),
      })),
      stats,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}