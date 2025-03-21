"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth.config"
import { redirect } from "next/navigation"
import { MentorshipStatus } from "@prisma/client"

export interface DashboardMentorship {
  id: string
  createdAt: Date
  updatedAt: Date
  status: MentorshipStatus
  notes: string | null
  product: {
    id: string
    title: string
    status: string
    category: string
    fundingAmount: number | null
    user: {
      id: string
      name: string
      email: string
    }
  }
}

export async function getMentorMentorships(): Promise<DashboardMentorship[]> {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user) {
    redirect('/login')
  }
  
  const mentorId = session.user.id as string
  
  const mentorships = await prisma.mentorship.findMany({
    where: {
      mentorId
    },
    include: {
      product: {
        include: {
          user: {
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
      updatedAt: 'desc'
    }
  })
  
  return mentorships
}

export async function updateMentorshipStatus(mentorshipId: string, status: MentorshipStatus, notes?: string) {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user) {
    throw new Error("Unauthorized")
  }
  
  const mentorId = session.user.id as string
  
  // Verify this mentorship belongs to the mentor
  const mentorship = await prisma.mentorship.findFirst({
    where: {
      id: mentorshipId,
      mentorId
    }
  })
  
  if (!mentorship) {
    throw new Error("Mentorship not found or not authorized")
  }
  
  // Update the mentorship
  return prisma.mentorship.update({
    where: {
      id: mentorshipId
    },
    data: {
      status,
      notes: notes || mentorship.notes
    }
  })
}
