"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type MentorshipDetail = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: "ACTIVE" | "COMPLETED" | "TERMINATED";
  notes: string | null;
  mentorId: string;
  productId: string;
  mentor: { id: string; name: string; email: string; bio: string | null };
  product: { id: string; title: string; description: string; status: string; category: string; user: { id: string; name: string; email: string } };
};

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function EditMentorshipPage({ params }: { params: any}) {
  const [mentorship, setMentorship] = useState<MentorshipDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [availableMentors, setAvailableMentors] = useState<User[]>([]);
  const router = useRouter();

  // Form fields
  const [status, setStatus] = useState<"ACTIVE" | "COMPLETED" | "TERMINATED">("ACTIVE");
  const [mentorId, setMentorId] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch mentorship details
        const mentorshipResponse = await fetch(`/api/admin/mentorships/${params.id}`);
        if (!mentorshipResponse.ok) throw new Error("Failed to fetch mentorship details");
        const mentorshipData: MentorshipDetail = await mentorshipResponse.json();
        setMentorship(mentorshipData);

        // Set initial form values
        setStatus(mentorshipData.status);
        setMentorId(mentorshipData.mentorId);
        setNotes(mentorshipData.notes || "");

        // Fetch available mentors
        const mentorsResponse = await fetch("/api/users?role=MENTOR");
        if (!mentorsResponse.ok) throw new Error("Failed to fetch mentors");
        const mentorsData: User[] = await mentorsResponse.json();
        setAvailableMentors(mentorsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`/api/admin/mentorships/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, mentorId, notes }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update mentorship");
      }

      setSuccessMessage("Mentorship updated successfully");
      setTimeout(() => router.push(`/dashboard/admin/mentorship/${params.id}`), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-6">
          <div className="h-8 w-1/3 bg-gray-200 rounded"></div>
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            <div className="h-6 w-1/2 bg-gray-200 rounded"></div>
            <div className="space-y-6">
              <div className="h-10 w-full bg-gray-200 rounded"></div>
              <div className="h-10 w-full bg-gray-200 rounded"></div>
              <div className="h-32 w-full bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !mentorship) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 rounded-lg shadow-sm text-center max-w-md w-full">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href="/dashboard/admin/mentorship"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Mentorships
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Edit Mentorship</h1>
          <Link
            href={`/dashboard/admin/mentorship/${params.id}`}
            className="text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel & View
          </Link>
        </div>

        {/* Alerts */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {successMessage}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {mentorship && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">{mentorship.product.title}</h2>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">Entrepreneur:</span> {mentorship.product.user.name}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Current Mentor:</span> {mentorship.mentor.name}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as "ACTIVE" | "COMPLETED" | "TERMINATED")}
                className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                required
              >
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="TERMINATED">Terminated</option>
              </select>
            </div>

            <div>
              <label htmlFor="mentor" className="block text-sm font-medium text-gray-700 mb-1">
                Assigned Mentor
              </label>
              <select
                id="mentor"
                value={mentorId}
                onChange={(e) => setMentorId(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                required
              >
                <option value="" disabled>
                  Select a mentor
                </option>
                {availableMentors.map((mentor) => (
                  <option key={mentor.id} value={mentor.id}>
                    {mentor.name} ({mentor.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-y"
                placeholder="Add notes about this mentorship..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Link
                href={`/dashboard/admin/mentorship/${params.id}`}
                className="px-4 py-2 text-gray-600 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={updating}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors text-sm font-medium"
              >
                {updating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}