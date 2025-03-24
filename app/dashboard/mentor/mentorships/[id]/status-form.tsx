"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { updateMentorshipStatus } from "@/actions/mentorships"
import type { MentorshipStatus } from "@prisma/client"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle, Clock, XCircle, ArrowRight } from 'lucide-react'
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface MentorshipStatusFormProps {
  mentorshipId: string
  currentStatus: MentorshipStatus
}

export function MentorshipStatusForm({ mentorshipId, currentStatus }: MentorshipStatusFormProps) {
  const [status, setStatus] = useState<MentorshipStatus>(currentStatus)
  const [notes, setNotes] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Trigger animation when component mounts
    setIsAnimating(true)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await updateMentorshipStatus(mentorshipId, status, notes)
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (statusValue: MentorshipStatus) => {
    switch (statusValue) {
      case "ACTIVE":
        return "text-blue-600 bg-blue-100 border-blue-300"
      case "COMPLETED":
        return "text-blue-900 bg-blue-100 border-blue-300"
      case "TERMINATED":
        return "text-purple-900 bg-blue-100 border-blue-300"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getStatusBgColor = (statusValue: MentorshipStatus) => {
    switch (statusValue) {
      case "ACTIVE":
        return "bg-gradient-to-r from-blue-500 to-blue-400"
      case "COMPLETED":
        return "bg-gradient-to-r from-blue-900 to-blue-700"
      case "TERMINATED":
        return "bg-gradient-to-r from-purple-900 to-blue-900"
      default:
        return "bg-gray-600"
    }
  }

  const getStatusIcon = (statusValue: MentorshipStatus) => {
    switch (statusValue) {
      case "ACTIVE":
        return <Clock className="h-5 w-5" />
      case "COMPLETED":
        return <CheckCircle className="h-5 w-5" />
      case "TERMINATED":
        return <XCircle className="h-5 w-5" />
      default:
        return null
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: i * 0.1,
        duration: 0.4,
        ease: "easeOut"
      }
    })
  }

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-8"
      initial="hidden"
      animate={isAnimating ? "visible" : "hidden"}
      variants={cardVariants}
    >
      <motion.div 
        className="space-y-4"
        variants={itemVariants}
        custom={0}
      >
        <Label htmlFor="status" className="text-sm font-medium text-gray-800">
          Mentorship Status
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["ACTIVE", "COMPLETED", "TERMINATED"].map((statusOption, index) => (
            <motion.div
              key={statusOption}
              variants={itemVariants}
              custom={index + 1}
              whileHover={{ 
                scale: 1.03, 
                boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)" 
              }}
              onClick={() => setStatus(statusOption as MentorshipStatus)}
              className={cn(
                "flex flex-col items-center justify-center p-6 rounded-xl border-2 cursor-pointer transition-all duration-300",
                status === statusOption
                  ? `${getStatusColor(statusOption as MentorshipStatus)} shadow-lg shadow-blue-100`
                  : "border-gray-100 bg-white hover:border-blue-200"
              )}
            >
              <div
                className={cn(
                  "rounded-full p-3 mb-3",
                  status === statusOption 
                    ? getStatusBgColor(statusOption as MentorshipStatus) + " text-white"
                    : "bg-gray-50 text-gray-400"
                )}
              >
                {getStatusIcon(statusOption as MentorshipStatus)}
              </div>
              <span className={cn(
                "text-base font-medium",
                status === statusOption 
                  ? "text-gray-900" 
                  : "text-gray-600"
              )}>
                {statusOption.charAt(0) + statusOption.slice(1).toLowerCase()}
              </span>
              {status === statusOption && (
                <motion.div 
                  className="w-16 h-0.5 bg-blue-500 mt-2"
                  initial={{ width: 0 }}
                  animate={{ width: 64 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div 
        className="space-y-3"
        variants={itemVariants}
        custom={4}
      >
        <Label htmlFor="notes" className="text-sm font-medium text-gray-800">
          Status Change Notes (Optional)
        </Label>
        <Textarea
          id="notes"
          placeholder="Add notes about this status change..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[120px] border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg resize-none transition-all duration-300 bg-white/95 backdrop-blur-sm"
        />
      </motion.div>

      <motion.div
        variants={itemVariants}
        custom={5}
        whileHover={{ scale: 1.02 }}
      >
        <Button
          type="submit"
          className={cn(
            "w-full py-6 rounded-xl font-medium transition-all duration-300 text-white flex items-center justify-center gap-2",
            status === "ACTIVE"
              ? "bg-gradient-to-r from-blue-500 to-blue-400 hover:shadow-lg hover:shadow-blue-200"
              : status === "COMPLETED"
              ? "bg-gradient-to-r from-blue-900 to-blue-700 hover:shadow-lg hover:shadow-blue-200"
              : "bg-gradient-to-r from-purple-900 to-blue-900 hover:shadow-lg hover:shadow-blue-200"
          )}
          disabled={isSubmitting || status === currentStatus}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Updating Status...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2 text-lg">
              {getStatusIcon(status)}
              Update to {status.charAt(0) + status.slice(1).toLowerCase()}
              <ArrowRight className="h-5 w-5 ml-1" />
            </span>
          )}
        </Button>
      </motion.div>
    </motion.form>
  )
}
