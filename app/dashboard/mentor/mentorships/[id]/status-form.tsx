"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateMentorshipStatus } from "@/actions/mentorships"
import type { MentorshipStatus } from "@prisma/client"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"


interface MentorshipStatusFormProps {
  mentorshipId: string
  currentStatus: MentorshipStatus
}

export function MentorshipStatusForm({ mentorshipId, currentStatus }: MentorshipStatusFormProps) {
  const [status, setStatus] = useState<MentorshipStatus>(currentStatus)
  const [notes, setNotes] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await updateMentorshipStatus(mentorshipId, status, notes)
    //   toast({
    //     title: "Status updated",
    //     description: `Mentorship status has been updated to ${status.toLowerCase()}.`,
    //   })
      router.refresh()
    } catch (error) {
    //   toast({
    //     title: "Error",
    //     description: "Failed to update mentorship status. Please try again.",
    //     variant: "destructive",
    //   })
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="status">Mentorship Status</Label>
        <Select value={status} onValueChange={(value) => setStatus(value as MentorshipStatus)}>
          <SelectTrigger id="status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="TERMINATED">Terminated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Status Change Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Add notes about this status change..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[100px]"
        />
      </div>

      <Button
        type="submit"
        className="bg-sky-600 hover:bg-sky-700 text-white"
        disabled={isSubmitting || status === currentStatus}
      >
        {isSubmitting ? "Updating..." : "Update Status"}
      </Button>
    </form>
  )
}

