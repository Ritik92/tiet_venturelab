"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth.config"
import { redirect } from "next/navigation"
import { MentorshipStatus, ProductStatus } from "@prisma/client"

export interface MentorDashboardStats {
  totalMentorships: number
  activeMentorships: number
  completedMentorships: number
  terminatedMentorships: number
  statusCounts: Record<MentorshipStatus, number>
  productStatusCounts: Record<ProductStatus, number>
  totalProductsFunded: number
  totalFundingAmount: number
}

export async function getMentorStats(): Promise<MentorDashboardStats> {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user) {
    redirect('/login')
  }
  
  const mentorId = session.user.id as string
  
  // Get all mentorships for this mentor
  const mentorships = await prisma.mentorship.findMany({
    where: {
      mentorId
    },
    include: {
      product: true
    }
  })
  
  // Initialize status counts
  const statusCounts: Record<MentorshipStatus, number> = {
    ACTIVE: 0,
    COMPLETED: 0,
    TERMINATED: 0
  }
  
  const productStatusCounts: Record<ProductStatus, number> = {
    PENDING: 0,
    APPROVED: 0,
    REJECTED: 0,
    FUNDED: 0
  }
  
  // Calculate stats
  let totalFundingAmount = 0
  
  mentorships.forEach(mentorship => {
    // Count mentorship statuses
    statusCounts[mentorship.status]++
    
    // Count product statuses
    productStatusCounts[mentorship.product.status]++
    
    // Calculate total funding
    if (mentorship.product.status === 'FUNDED' && mentorship.product.fundingAmount) {
      totalFundingAmount += mentorship.product.fundingAmount
    }
  })
  
  return {
    totalMentorships: mentorships.length,
    activeMentorships: statusCounts.ACTIVE,
    completedMentorships: statusCounts.COMPLETED,
    terminatedMentorships: statusCounts.TERMINATED,
    statusCounts,
    productStatusCounts,
    totalProductsFunded: productStatusCounts.FUNDED,
    totalFundingAmount
  }
}
