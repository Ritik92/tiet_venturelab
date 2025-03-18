"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  FaCalendarAlt,
  FaTrophy,
  FaUsers,
  FaLaptop,
  FaMapMarkerAlt,
  FaArrowRight,
  FaInfoCircle,
  FaCheckCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa"

// Define the Event type
interface Event {
  id: number
  title: string
  presentedBy: string
  collaboration: string
  overview: string
  timeline: { activity: string; date: string }[]
  domains: string[]
  prizes: { position: string; amount: string }[]
  phases: { name: string; description: string }[]
  criteria: { name: string; weight: string }[]
  contacts: { name: string; role: string; email: string; phone: string }[]
  status: "active" | "upcoming" | "past"
  registrationLink: string
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

export default function EventsPage() {
  // Mock data for events
  const eventsData: Event[] = [
    {
      id: 1,
      title: "Startup Ignite",
      presentedBy: "Mentor Labs",
      collaboration: "Computer Science Department, Thapar Institute",
      overview:
        "Startup Ignite is an inter-college event aimed at sparking entrepreneurial innovation among students. Participants will present startup ideas, evaluated on feasibility, creativity, and scalability, to compete for a ₹50,000 prize pool.",
      timeline: [
        { activity: "Registrations Open", date: "16th March 2025" },
        { activity: "Idea Submission Deadline", date: "21st March 2025" },
        { activity: "Shortlist Announcement", date: "26th March 2025" },
        { activity: "Semi-Final Presentation", date: "29th March 2025" },
        { activity: "Final Presentation", date: "3rd April 2025" },
      ],
      domains: ["Agritech", "Edtech", "Healthtech", "Fintech", "E-commerce", "AI/ML", "Cybersecurity", "Open Domain"],
      prizes: [
        { position: "1st Prize", amount: "₹20,000" },
        { position: "2nd Prize (2 teams)", amount: "₹10,000 each" },
        { position: "3rd Prize (2 teams)", amount: "₹5,000 each" },
      ],
      phases: [
        {
          name: "Idea Screening (Online)",
          description:
            "Judges select the top 45-50 teams based on innovation, feasibility, market potential, and scalability.",
        },
        {
          name: "Semi-Final Pitch (Online)",
          description: "Shortlisted teams present a 10-minute pitch. Judges advance the top 30 teams.",
        },
        {
          name: "Final Presentation (Offline)",
          description:
            "Finalists pitch their refined ideas at Thapar Institute. Judges evaluate feasibility, presentation quality, and execution potential.",
        },
      ],
      criteria: [
        { name: "Innovation", weight: "20%" },
        { name: "Feasibility", weight: "30%" },
        { name: "Market Potential", weight: "20%" },
        { name: "Scalability", weight: "20%" },
        { name: "Pitch Quality", weight: "10%" },
      ],
      contacts: [
        { name: "Tathagat", role: "Mentor Labs Convenor", email: "tathagat@mentorlabs.org", phone: "+91 9041095531" },
        {
          name: "Dr. Prashant Singh Rana",
          role: "Thapar Institute Coordinator",
          email: "prashant.singh@tiet.edu",
          phone: "+91 93138-89932",
        },
      ],
      status: "active", // active, upcoming, past
      registrationLink: "https://www.talkeys.xyz/event/67d85244889a3e9ccb3f5b52",
    },
  ]

  const router = useRouter()

  // State management with proper typing
  const [events, setEvents] = useState<Event[]>(eventsData)
  const [activeTab, setActiveTab] = useState("all")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  // Handle scroll for navbar transparency effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const currentDate = new Date()
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Filter events based on activeTab
  const filteredEvents = events.filter((event) => {
    if (activeTab === "all") return true
    return event.status === activeTab
  })

  // Simple empty state component
  const EmptyState = () => (
    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-8 text-center my-8">
      <FaCalendarAlt className="mx-auto text-indigo-500 text-4xl mb-4" />
      <h3 className="text-xl font-bold text-gray-800 mb-2">No Events Found</h3>
      <p className="text-gray-600 mb-4">There are no events matching your current filter.</p>
      <button
        onClick={() => setActiveTab("all")}
        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        View All Events
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Navigation Bar - Enhanced with gradient */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrollY > 50
            ? "bg-white/95 backdrop-blur-sm shadow-md"
            : "bg-gradient-to-r from-indigo-900 via-purple-800 to-indigo-900"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1
              className={`text-2xl font-bold transition-colors duration-300 ${scrollY > 50 ? "text-gray-900" : "text-white"}`}
            >
              Mentor <span className={`${scrollY > 50 ? "text-indigo-600" : "text-indigo-300"}`}>Labs</span>
            </h1>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 ${scrollY > 50 ? "text-gray-800" : "text-white"} focus:outline-none`}
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {["Home", "About", "People", "Research", "Programs", "Contact"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`relative font-medium transition-all duration-300 group ${
                  scrollY > 50 ? "text-gray-800" : "text-white"
                }`}
              >
                <span className={`group-hover:${scrollY > 50 ? "text-indigo-600" : "text-indigo-300"}`}>{item}</span>
                <span
                  className={`absolute bottom-0 left-0 w-0 h-0.5 ${scrollY > 50 ? "bg-indigo-600" : "bg-indigo-300"} group-hover:w-full transition-all duration-300`}
                ></span>
              </Link>
            ))}
            <Link
              href={`/dashboard/user/events`}
              className={`relative font-medium transition-all duration-300 group ${
                scrollY > 50 ? "text-gray-800" : "text-white"
              }`}
            >
              <span className={`group-hover:${scrollY > 50 ? "text-indigo-600" : "text-indigo-300"}`}>Events</span>
              <span
                className={`absolute bottom-0 left-0 w-0 h-0.5 ${scrollY > 50 ? "bg-indigo-600" : "bg-indigo-300"} group-hover:w-full transition-all duration-300`}
              ></span>
            </Link>
            <button
              onClick={() => router.push("/auth/signin")}
              className={`${
                scrollY > 50 ? "bg-indigo-600 hover:bg-indigo-700" : "bg-white text-indigo-900 hover:bg-indigo-100"
              } px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5`}
            >
              Log in
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white/95 backdrop-blur-sm shadow-lg border-t border-gray-100"
            >
              <div className="px-4 py-4 space-y-2">
                {["Home", "About", "People", "Research", "Programs", "Contact"].map((item) => (
                  <Link
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="block text-gray-800 hover:text-indigo-600 transition-colors py-3 px-2 rounded-md hover:bg-gray-100 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    router.push("/auth/signin")
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg mt-2"
                >
                  Log in
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="mb-10 mt-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Events & Competitions</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover and participate in our upcoming entrepreneurial events
          </p>
          <p className="text-sm text-gray-500 mt-2">{formattedDate}</p>
        </motion.div>

        {/* Event filters - Updated with indigo color scheme */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${activeTab === "all" ? "bg-indigo-600 text-white shadow-md" : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"}`}
            onClick={() => setActiveTab("all")}
          >
            All Events
          </button>
          <button
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${activeTab === "upcoming" ? "bg-indigo-600 text-white shadow-md" : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"}`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${activeTab === "active" ? "bg-indigo-600 text-white shadow-md" : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"}`}
            onClick={() => setActiveTab("active")}
          >
            Active
          </button>
          <button
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${activeTab === "past" ? "bg-indigo-600 text-white shadow-md" : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"}`}
            onClick={() => setActiveTab("past")}
          >
            Past
          </button>
        </div>

        {/* Conditional rendering - simplified */}
        {filteredEvents.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div variants={staggerChildren} initial="hidden" animate="visible" className="grid grid-cols-1 gap-8">
            {filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                variants={fadeInUp}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
              >
                {/* Event Header with Gradient - Updated with indigo/purple gradient */}
                <div className="bg-gradient-to-r from-indigo-700 via-purple-600 to-indigo-600 text-white p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                      <h2 className="text-3xl font-bold">{event.title}</h2>
                      <p className="text-indigo-100 mt-2">Presented by: {event.presentedBy}</p>
                      <p className="text-indigo-100">In Collaboration with: {event.collaboration}</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-white text-indigo-600">
                        <FaCheckCircle className="mr-2" /> Registration Open
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  {/* Overview Section with Error Handling - Updated with indigo color scheme */}
                  <div className="mb-8 bg-indigo-50 p-6 rounded-xl border-l-4 border-indigo-500">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                      <FaInfoCircle className="mr-2 text-indigo-600" /> Overview
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {event.overview || "No overview available for this event."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Timeline Section - Updated with indigo color scheme */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div className="bg-indigo-600 text-white py-3 px-4">
                        <h3 className="text-lg font-semibold flex items-center">
                          <FaCalendarAlt className="mr-2" /> Timeline
                        </h3>
                      </div>
                      <div className="p-4">
                        {event.timeline && event.timeline.length > 0 ? (
                          <table className="min-w-full">
                            <thead>
                              <tr>
                                <th className="text-left text-sm font-medium text-gray-500 pb-3">Activity</th>
                                <th className="text-left text-sm font-medium text-gray-500 pb-3">Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {event.timeline.map((item, index) => (
                                <tr key={index} className={index > 0 ? "border-t border-gray-100" : ""}>
                                  <td className="py-3 text-sm text-gray-700 font-medium">{item.activity}</td>
                                  <td className="py-3 text-sm text-gray-700">{item.date}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p className="text-gray-500 py-4 text-center">Timeline details not available</p>
                        )}
                      </div>
                    </div>

                    {/* Prizes Section - Updated with indigo color scheme */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div className="bg-indigo-600 text-white py-3 px-4">
                        <h3 className="text-lg font-semibold flex items-center">
                          <FaTrophy className="mr-2" /> Prizes
                        </h3>
                      </div>
                      <div className="p-4">
                        {event.prizes && event.prizes.length > 0 ? (
                          <table className="min-w-full">
                            <thead>
                              <tr>
                                <th className="text-left text-sm font-medium text-gray-500 pb-3">Position</th>
                                <th className="text-left text-sm font-medium text-gray-500 pb-3">Prize</th>
                              </tr>
                            </thead>
                            <tbody>
                              {event.prizes.map((prize, index) => (
                                <tr key={index} className={index > 0 ? "border-t border-gray-100" : ""}>
                                  <td className="py-3 text-sm text-gray-700 font-medium">{prize.position}</td>
                                  <td className="py-3 text-sm text-gray-700">{prize.amount}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p className="text-gray-500 py-4 text-center">Prize details not available</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Domains Section - Updated with indigo color scheme */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <FaUsers className="mr-2 text-indigo-600" /> Domains
                    </h3>
                    {event.domains && event.domains.length > 0 ? (
                      <div className="flex flex-wrap gap-3">
                        {event.domains.map((domain, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium hover:bg-indigo-200 transition-colors duration-200 cursor-pointer"
                          >
                            {domain}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No specific domains mentioned for this event.</p>
                    )}
                  </div>

                  {/* Event Phases Section - Updated with indigo color scheme */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <FaLaptop className="mr-2 text-indigo-600" /> Event Phases
                    </h3>
                    {event.phases && event.phases.length > 0 ? (
                      <div className="space-y-4">
                        {event.phases.map((phase, index) => (
                          <div key={index} className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                            <h4 className="font-semibold text-gray-800 text-lg mb-2">{phase.name}</h4>
                            <p className="text-gray-600">{phase.description}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 p-4 bg-gray-50 rounded-xl">Event phase details not available.</p>
                    )}
                  </div>

                  {/* Judging Criteria Section */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Judging Criteria</h3>
                    {event.criteria && event.criteria.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {event.criteria.map((criterion, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-xl p-4 text-center border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                          >
                            <p className="text-gray-800 font-medium mb-2">{criterion.name}</p>
                            <p className="text-indigo-600 font-bold text-xl">{criterion.weight}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 p-4 bg-gray-50 rounded-xl">Judging criteria not specified.</p>
                    )}
                  </div>

                  {/* Contact Information Section */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-indigo-600" /> Contact Information
                    </h3>
                    {event.contacts && event.contacts.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {event.contacts.map((contact, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                          >
                            <h4 className="font-semibold text-gray-800 text-lg">{contact.name}</h4>
                            <p className="text-gray-600">{contact.role}</p>
                            <div className="mt-3 space-y-1">
                              <p className="text-gray-700">
                                <span className="font-medium">Email:</span> {contact.email}
                              </p>
                              <p className="text-gray-700">
                                <span className="font-medium">Phone:</span> {contact.phone}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 p-4 bg-gray-50 rounded-xl">Contact information not available.</p>
                    )}
                  </div>

                  {/* Registration Button - Updated with indigo color scheme */}
                  <div className="flex justify-center mt-10">
                    {event.registrationLink ? (
                      <a
                        href={event.registrationLink}
                        className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-full shadow-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                      >
                        Register Now <FaArrowRight className="ml-2" />
                      </a>
                    ) : (
                      <button
                        disabled
                        className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-full shadow-md text-white bg-gray-400 cursor-not-allowed"
                      >
                        Registration Unavailable
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Footer - Enhanced with gradient */}
      <footer className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h1 className="text-2xl font-bold">
                Mentor <span className="text-indigo-300">Labs</span>
              </h1>
              <p className="text-indigo-200 mt-2">Pioneering the future through AI and Data Science</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {["Home", "About", "People", "Research", "Programs", "Contact"].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-indigo-200 hover:text-white transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
          <hr className="border-indigo-800 my-8" />
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-indigo-300">© 2025 MENTOR LABS. All rights reserved.</p>
            <p className="text-indigo-300 mt-4 md:mt-0">
              <Link href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>{" "}
              |
              <Link href="#" className="hover:text-white transition-colors ml-2">
                Terms of Service
              </Link>
            </p>
          </div>
        </div>
      </footer>

      {/* Global error boundary */}
      <ErrorBoundary />
    </div>
  )
}

// Simple error boundary component
function ErrorBoundary() {
  if (typeof window !== "undefined") {
    window.addEventListener("error", (event) => {
      console.error("Caught in error boundary:", event.error)
    })
  }

  return null
}

