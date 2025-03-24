import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth.config"
import { redirect } from "next/navigation"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  Edit3,
  ExternalLink,
  ChevronRight,
  Award,
  BarChart3,
  Briefcase,
  Lightbulb,
} from "lucide-react"
import Link from "next/link"
import { MentorshipStatusForm } from "./status-form"
import { cn } from "@/lib/utils"

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-blue-100 border-blue-200 text-blue-600"
      case "COMPLETED":
        return "bg-blue-100 border-blue-200 text-blue-900"
      case "TERMINATED":
        return "bg-blue-100 border-blue-200 text-purple-900"
      default:
        return "bg-gray-50 border-gray-100 text-gray-700"
    }
  }

  const getStatusIconColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "text-blue-500"
      case "COMPLETED":
        return "text-blue-900"
      case "TERMINATED":
        return "text-purple-900"
      default:
        return "text-gray-500"
    }
  }

  const getStatusGradient = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "from-blue-500 to-blue-400"
      case "COMPLETED":
        return "from-blue-900 to-blue-700"
      case "TERMINATED":
        return "from-purple-900 to-blue-900"
      default:
        return "from-gray-700 to-gray-600"
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/mentor"
            className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 hover:bg-blue-200 transition-all duration-300 group"
          >
            <ArrowLeft className="h-5 w-5 text-blue-600 group-hover:text-blue-700" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Mentorship Details</h1>
            <p className="text-gray-500 text-sm mt-1">Managing your mentorship with {mentorship.product.user.name}</p>
          </div>
        </div>
        <div
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2",
            getStatusColor(mentorship.status),
          )}
        >
          {mentorship.status === "ACTIVE" && <Clock className={cn("h-4 w-4", getStatusIconColor(mentorship.status))} />}
          {mentorship.status === "COMPLETED" && (
            <CheckCircle className={cn("h-4 w-4", getStatusIconColor(mentorship.status))} />
          )}
          {mentorship.status === "TERMINATED" && (
            <XCircle className={cn("h-4 w-4", getStatusIconColor(mentorship.status))} />
          )}
          {mentorship.status.charAt(0) + mentorship.status.slice(1).toLowerCase()}
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
          <Card className="border border-gray-100 shadow-xl rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
            <div className={`h-2 bg-gradient-to-r ${getStatusGradient(mentorship.status)}`}></div>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-blue-500 text-sm font-medium uppercase tracking-wider mb-1">Product</div>
                  <CardTitle className="text-2xl flex items-center gap-2 text-gray-900">
                    {mentorship.product.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1.5 mt-1">
                    <span className="text-lg">{getCategoryIcon(mentorship.product.category)}</span>
                    {formatCategory(mentorship.product.category)}
                  </CardDescription>
                </div>
                <div>{getProductStatusBadge(mentorship.product.status)}</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose max-w-none">
                <p className="text-gray-700 text-lg">{mentorship.product.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50 p-4 rounded-xl">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Started</div>
                    <div>{format(new Date(mentorship.createdAt), "MMM d, yyyy")}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50 p-4 rounded-xl">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Tag className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Status</div>
                    <div>{mentorship.product.status}</div>
                  </div>
                </div>
                {mentorship.product.fundingAmount && (
                  <div className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50 p-4 rounded-xl">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <CircleDollarSign className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Funding</div>
                      <div>${mentorship.product.fundingAmount.toLocaleString()}</div>
                    </div>
                  </div>
                )}
              </div>

              {mentorship.product.videoUrl && (
                <div className="pt-4">
                  <h3 className="text-sm font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <Video className="h-4 w-4 text-blue-500" /> Product Video
                  </h3>
                  <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden shadow-lg">
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
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium bg-blue-50 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-blue-100"
                  >
                    <FileText className="h-4 w-4" />
                    View Pitch Deck
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="status" className="w-full">
            {/* <TabsList className="grid w-full grid-cols-2 p-1 bg-gray-50 rounded-xl">
              <TabsTrigger
                value="notes"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md rounded-lg py-3"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Mentorship Notes
              </TabsTrigger>
              <TabsTrigger
                value="status"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md rounded-lg py-3 col-span-2"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Update Status
              </TabsTrigger>
            </TabsList> */}
            {/* <TabsContent value="notes" className="mt-6">
              <Card className="border border-gray-100 shadow-lg rounded-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-blue-500" />
                    Mentorship Notes
                  </CardTitle>
                  <CardDescription>Your private notes about this mentorship</CardDescription>
                </CardHeader>
                <CardContent>
                  {mentorship.notes ? (
                    <div className="prose max-w-none bg-gray-50 p-5 rounded-xl">
                      <p className="text-gray-700 whitespace-pre-line">{mentorship.notes}</p>
                    </div>
                  ) : (
                    <div className="text-gray-500 italic bg-gray-50 p-5 rounded-xl text-center">
                      No notes have been added yet.
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-4 border-t border-gray-100">
                  <form action="/api/mentorship/notes" method="POST" className="w-full">
                    <input type="hidden" name="mentorshipId" value={mentorship.id} />
                    <div className="space-y-4 w-full">
                      <textarea
                        name="notes"
                        className="w-full min-h-[150px] p-4 border border-gray-200 rounded-xl text-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                        placeholder="Add your mentorship notes here..."
                        defaultValue={mentorship.notes || ""}
                      ></textarea>
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 text-white flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl py-6"
                      >
                        <Edit3 className="h-4 w-4" />
                        Save Notes
                      </Button>
                    </div>
                  </form>
                </CardFooter>
              </Card>
            </TabsContent> */}
            <TabsContent value="status" className="mt-6">
              <Card className="border border-gray-100 shadow-lg rounded-xl overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300"></div>
                <CardHeader className="pb-3">
                  <div className="text-blue-500 text-sm font-medium uppercase tracking-wider mb-1">
                    Status Management
                  </div>
                  <CardTitle className="text-xl flex items-center gap-2 text-gray-900">
                    <Edit3 className="h-5 w-5 text-blue-500" />
                    Update Mentorship Status
                  </CardTitle>
                  <CardDescription>Change the current status of this mentorship</CardDescription>
                </CardHeader>
                <CardContent>
                  <MentorshipStatusForm mentorshipId={mentorship.id} currentStatus={mentorship.status} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-8">
          <Card className="border border-gray-100 shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="h-2 bg-gradient-to-r from-blue-900 to-purple-900"></div>
            <CardHeader className="pb-3">
              <div className="text-blue-500 text-sm font-medium uppercase tracking-wider mb-1">Entrepreneur</div>
              <CardTitle className="text-xl flex items-center gap-2 text-gray-900">
                <User className="h-5 w-5 text-blue-500" />
                Product Creator
              </CardTitle>
              <CardDescription>Details about the entrepreneur</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
                {mentorship.product.user.profileImage ? (
                  <img
                    src={mentorship.product.user.profileImage || "/placeholder.svg"}
                    alt={mentorship.product.user.name}
                    className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-md"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-900 flex items-center justify-center shadow-md">
                    <User className="h-8 w-8 text-white" />
                  </div>
                )}
                <div>
                  <h3 className="font-medium text-gray-900 text-lg">{mentorship.product.user.name}</h3>
                  <p className="text-sm text-gray-500">{mentorship.product.user.email}</p>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2 justify-center border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 rounded-xl py-6"
                >
                  <Mail className="h-5 w-5" />
                  Contact Entrepreneur
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-100 shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-300"></div>
            <CardHeader className="pb-3">
              <div className="text-blue-500 text-sm font-medium uppercase tracking-wider mb-1">Timeline</div>
              <CardTitle className="text-xl flex items-center gap-2 text-gray-900">
                <Clock className="h-5 w-5 text-blue-500" />
                Mentorship Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div
                  className={cn(
                    "flex items-center p-5 rounded-xl border",
                    mentorship.status === "ACTIVE"
                      ? "bg-blue-50 border-blue-100"
                      : mentorship.status === "COMPLETED"
                        ? "bg-blue-50 border-blue-100"
                        : "bg-blue-50 border-blue-100",
                  )}
                >
                  <div className={`mr-4 p-3 rounded-full bg-gradient-to-r ${getStatusGradient(mentorship.status)}`}>
                    {mentorship.status === "ACTIVE" && <Clock className="h-6 w-6 text-white" />}
                    {mentorship.status === "COMPLETED" && <CheckCircle className="h-6 w-6 text-white" />}
                    {mentorship.status === "TERMINATED" && <XCircle className="h-6 w-6 text-white" />}
                  </div>
                  <div>
                    <div
                      className={cn(
                        "text-base font-medium",
                        mentorship.status === "ACTIVE"
                          ? "text-blue-700"
                          : mentorship.status === "COMPLETED"
                            ? "text-blue-900"
                            : "text-purple-900",
                      )}
                    >
                      {mentorship.status.charAt(0) + mentorship.status.slice(1).toLowerCase()}
                    </div>
                    <div className="text-sm text-gray-500">
                      Last updated: {format(new Date(mentorship.updatedAt), "MMM d, yyyy")}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Timeline</h3>
                  <div className="space-y-0">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 border-2 border-blue-200 flex items-center justify-center z-10">
                          <Clock className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="w-0.5 h-20 bg-gradient-to-b from-blue-200 to-gray-200 -mt-1"></div>
                      </div>
                      <div className="pb-8">
                        <p className="text-base font-medium text-gray-900">Mentorship Started</p>
                        <p className="text-sm text-gray-500">{format(new Date(mentorship.createdAt), "MMM d, yyyy")}</p>
                        <p className="text-sm text-gray-500 mt-2 italic">
                          Began working with {mentorship.product.user.name} on {mentorship.product.title}
                        </p>
                      </div>
                    </div>

                    {mentorship.status !== "ACTIVE" && (
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={cn(
                              "h-10 w-10 rounded-full border-2 flex items-center justify-center",
                              mentorship.status === "COMPLETED"
                                ? "bg-blue-100 border-blue-200"
                                : "bg-blue-100 border-blue-200",
                            )}
                          >
                            {mentorship.status === "COMPLETED" ? (
                              <CheckCircle className="h-5 w-5 text-blue-900" />
                            ) : (
                              <XCircle className="h-5 w-5 text-purple-900" />
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-base font-medium text-gray-900">
                            Mentorship {mentorship.status === "COMPLETED" ? "Completed" : "Terminated"}
                          </p>
                          <p className="text-sm text-gray-500">
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

          <Card className="border border-gray-100 shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="h-2 bg-gradient-to-r from-blue-900 to-blue-700"></div>
            <CardHeader className="pb-3">
              <div className="text-blue-500 text-sm font-medium uppercase tracking-wider mb-1">Resources</div>
              <CardTitle className="text-xl flex items-center gap-2 text-gray-900">
                <Briefcase className="h-5 w-5 text-blue-500" />
                Mentorship Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full flex items-center gap-3 justify-start border-blue-100 text-blue-700 hover:bg-blue-50 transition-all duration-300 rounded-xl py-5 px-4"
              >
                <div className="bg-blue-100 p-2 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Progress Tracker</div>
                  <div className="text-xs text-gray-500">Track mentorship milestones</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full flex items-center gap-3 justify-start border-blue-100 text-blue-700 hover:bg-blue-50 transition-all duration-300 rounded-xl py-5 px-4"
              >
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Award className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Certification</div>
                  <div className="text-xs text-gray-500">Issue completion certificate</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full flex items-center gap-3 justify-start border-blue-100 text-blue-700 hover:bg-blue-50 transition-all duration-300 rounded-xl py-5 px-4"
              >
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Lightbulb className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Resource Library</div>
                  <div className="text-xs text-gray-500">Access mentorship materials</div>
                </div>
              </Button>
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
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
          Approved
        </span>
      )
    case "PENDING":
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
          Pending
        </span>
      )
    case "REJECTED":
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800 border border-rose-200">
          Rejected
        </span>
      )
    case "FUNDED":
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
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

