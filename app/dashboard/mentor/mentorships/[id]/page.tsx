import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth.config"
import { redirect } from "next/navigation"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CircleDollarSign,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Calendar,
  Tag,
  FileText,
  Video,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { MentorshipStatusForm } from "./status-form"

export default async function MentorshipDetailsPage({ params }: { params: any }) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/login")
  }

  // Verify user is a mentor
  if (session.user.role !== "MENTOR" && session.user.role !== "ADMIN") {
    redirect("/dashboard/user")
  }

  const mentorshipId = params.id

  // Get mentorship with product and user details
  const mentorship = await prisma.mentorship.findFirst({
    where: {
      id: mentorshipId,
      mentorId: session.user.id as string,
    },
    include: {
      product: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              profileImage: true,
            },
          },
        },
      },
    },
  })

  if (!mentorship) {
    redirect("/dashboard/mentor")
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-8">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/dashboard/mentor" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Mentorship Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="border border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">{mentorship.product.title}</CardTitle>
              <CardDescription>
                Product in {getCategoryIcon(mentorship.product.category)} {formatCategory(mentorship.product.category)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose max-w-none">
                <p className="text-gray-700">{mentorship.product.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>Started: {format(new Date(mentorship.createdAt), "MMM d, yyyy")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Tag className="h-4 w-4 text-gray-400" />
                  <span>Status: {getProductStatusBadge(mentorship.product.status)}</span>
                </div>
                {mentorship.product.fundingAmount && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CircleDollarSign className="h-4 w-4 text-gray-400" />
                    <span>Funding: ${mentorship.product.fundingAmount.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {mentorship.product.videoUrl && (
                <div className="pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Video className="h-4 w-4" /> Product Video
                  </h3>
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <iframe
                      src={mentorship.product.videoUrl}
                      className="w-full h-full"
                      allowFullScreen
                      title="Product Video"
                    ></iframe>
                  </div>
                </div>
              )}

              {mentorship.product.pitchDeck && (
                <div className="pt-2">
                  <a
                    href={mentorship.product.pitchDeck}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 text-sm font-medium"
                  >
                    <FileText className="h-4 w-4" />
                    View Pitch Deck
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="notes">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="notes">Mentorship Notes</TabsTrigger>
              <TabsTrigger value="status">Update Status</TabsTrigger>
            </TabsList>
            <TabsContent value="notes" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Mentorship Notes</CardTitle>
                  <CardDescription>Your private notes about this mentorship</CardDescription>
                </CardHeader>
                <CardContent>
                  {mentorship.notes ? (
                    <div className="prose max-w-none">
                      <p className="text-gray-700 whitespace-pre-line">{mentorship.notes}</p>
                    </div>
                  ) : (
                    <div className="text-gray-500 italic">No notes have been added yet.</div>
                  )}
                </CardContent>
                <CardFooter>
                  <form action="/api/mentorship/notes" method="POST" className="w-full">
                    <input type="hidden" name="mentorshipId" value={mentorship.id} />
                    <div className="space-y-4 w-full">
                      <textarea
                        name="notes"
                        className="w-full min-h-[150px] p-3 border border-gray-200 rounded-md text-sm"
                        placeholder="Add your mentorship notes here..."
                        defaultValue={mentorship.notes || ""}
                      ></textarea>
                      <Button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white">
                        Save Notes
                      </Button>
                    </div>
                  </form>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="status" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Update Mentorship Status</CardTitle>
                  <CardDescription>Change the current status of this mentorship</CardDescription>
                </CardHeader>
                <CardContent>
                  <MentorshipStatusForm mentorshipId={mentorship.id} currentStatus={mentorship.status} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="border border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Entrepreneur</CardTitle>
              <CardDescription>Product creator details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                {mentorship.product.user.profileImage ? (
                  <img
                    src={mentorship.product.user.profileImage || "/placeholder.svg"}
                    alt={mentorship.product.user.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-400" />
                  </div>
                )}
                <div>
                  <h3 className="font-medium text-gray-900">{mentorship.product.user.name}</h3>
                  <p className="text-sm text-gray-500">{mentorship.product.user.email}</p>
                </div>
              </div>

              <div className="pt-2">
                <Button variant="outline" className="w-full flex items-center gap-2 justify-center">
                  <Mail className="h-4 w-4" />
                  Contact Entrepreneur
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Mentorship Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div
                  className={`flex items-center p-3 rounded-lg ${
                    mentorship.status === "ACTIVE"
                      ? "bg-sky-50 border border-sky-100"
                      : mentorship.status === "COMPLETED"
                        ? "bg-emerald-50 border border-emerald-100"
                        : "bg-rose-50 border border-rose-100"
                  }`}
                >
                  <div className="mr-3">
                    {mentorship.status === "ACTIVE" && <Clock className="h-5 w-5 text-sky-500" />}
                    {mentorship.status === "COMPLETED" && <CheckCircle className="h-5 w-5 text-emerald-500" />}
                    {mentorship.status === "TERMINATED" && <XCircle className="h-5 w-5 text-rose-500" />}
                  </div>
                  <div>
                    <div
                      className={`text-sm font-medium ${
                        mentorship.status === "ACTIVE"
                          ? "text-sky-600"
                          : mentorship.status === "COMPLETED"
                            ? "text-emerald-600"
                            : "text-rose-600"
                      }`}
                    >
                      {mentorship.status.charAt(0) + mentorship.status.slice(1).toLowerCase()}
                    </div>
                    <div className="text-xs text-gray-500">
                      Last updated: {format(new Date(mentorship.updatedAt), "MMM d, yyyy")}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Timeline</h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="h-6 w-6 rounded-full bg-sky-100 border border-sky-200 flex items-center justify-center">
                          <Clock className="h-3 w-3 text-sky-500" />
                        </div>
                        <div className="w-0.5 h-full bg-gray-200"></div>
                      </div>
                      <div className="pb-4">
                        <p className="text-sm font-medium text-gray-900">Mentorship Started</p>
                        <p className="text-xs text-gray-500">{format(new Date(mentorship.createdAt), "MMM d, yyyy")}</p>
                      </div>
                    </div>

                    {mentorship.status !== "ACTIVE" && (
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div
                            className={`h-6 w-6 rounded-full ${
                              mentorship.status === "COMPLETED"
                                ? "bg-emerald-100 border border-emerald-200"
                                : "bg-rose-100 border border-rose-200"
                            } flex items-center justify-center`}
                          >
                            {mentorship.status === "COMPLETED" ? (
                              <CheckCircle className="h-3 w-3 text-emerald-500" />
                            ) : (
                              <XCircle className="h-3 w-3 text-rose-500" />
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Mentorship {mentorship.status === "COMPLETED" ? "Completed" : "Terminated"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(mentorship.updatedAt), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function getProductStatusBadge(status: string) {
  switch (status) {
    case "APPROVED":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
          Approved
        </span>
      )
    case "PENDING":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
          Pending
        </span>
      )
    case "REJECTED":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800 border border-rose-200">
          Rejected
        </span>
      )
    case "FUNDED":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800 border border-sky-200">
          Funded
        </span>
      )
    default:
      return status
  }
}

// Helper functions
function getCategoryIcon(category: string) {
  switch (category) {
    case "TECHNOLOGY":
      return "💻"
    case "HEALTH":
      return "🏥"
    case "EDUCATION":
      return "🎓"
    case "FINANCE":
      return "💰"
    case "FOOD":
      return "🍔"
    case "RETAIL":
      return "🛍️"
    case "ENTERTAINMENT":
      return "🎬"
    case "SUSTAINABILITY":
      return "♻️"
    case "OTHER":
      return "📦"
    default:
      return "📦"
  }
}

function formatCategory(category: string) {
  return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()
}

