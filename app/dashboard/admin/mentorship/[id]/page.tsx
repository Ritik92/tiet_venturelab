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
  product: {
    id: string;
    title: string;
    description: string;
    status: string;
    category: string;
    user: { id: string; name: string; email: string };
  };
};

export default function MentorshipDetailPage({ params }: { params: any }) {
  const [mentorship, setMentorship] = useState<MentorshipDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notesOpen, setNotesOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchMentorship = async () => {
      try {
        const response = await fetch(`/api/admin/mentorships/${params.id}`);
        if (!response.ok) throw new Error("Failed to fetch mentorship details");
        const data = await response.json();
        setMentorship(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchMentorship();
  }, [params.id]);

  const getStatusStyles = (status: MentorshipDetail["status"]) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      case "TERMINATED":
        return "bg-red-100 text-red-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full space-y-6">
          <div className="h-8 w-1/3 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
              <div className="h-6 w-1/4 bg-gray-200 rounded"></div>
              <div className="space-y-3">
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-full bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
              <div className="h-6 w-1/4 bg-gray-200 rounded"></div>
              <div className="space-y-3">
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-full bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !mentorship) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 rounded-lg shadow-sm text-center max-w-md w-full">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error || "Mentorship not found"}</p>
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">{mentorship.product.title}</h1>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyles(mentorship.status)}`}
            >
              {mentorship.status}
            </span>
          </div>
          <div className="flex space-x-3">
            <Link
              href={`/dashboard/admin/mentorship/${mentorship.id}/edit`}
              className="px-4 py-2 border border-gray-200 text-gray-700 rounded-md hover:bg-gray-100 transition-colors text-sm font-medium"
            >
              Edit
            </Link>
            <Link
              href="/dashboard/admin/mentorship"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Back to List
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 mb-8">{mentorship.product.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mentorship Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Mentorship Information</h2>
              <dl className="space-y-4">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <dt className="text-sm text-gray-500">Created</dt>
                    <dd className="text-gray-900">{new Date(mentorship.createdAt).toLocaleDateString()}</dd>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <dt className="text-sm text-gray-500">Updated</dt>
                    <dd className="text-gray-900">{new Date(mentorship.updatedAt).toLocaleDateString()}</dd>
                  </div>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Category</dt>
                  <dd className="text-gray-900">{mentorship.product.category}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Product Status</dt>
                  <dd className="text-gray-900">{mentorship.product.status}</dd>
                </div>
              </dl>
            </div>

            {/* People */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">People</h2>
              <dl className="space-y-4">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div>
                    <dt className="text-sm text-gray-500">Entrepreneur</dt>
                    <dd className="text-gray-900">
                      {mentorship.product.user.name} <span className="text-gray-500">({mentorship.product.user.email})</span>
                    </dd>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div>
                    <dt className="text-sm text-gray-500">Mentor</dt>
                    <dd className="text-gray-900">
                      {mentorship.mentor.name} <span className="text-gray-500">({mentorship.mentor.email})</span>
                    </dd>
                  </div>
                </div>
              </dl>
            </div>
          </div>

          {/* Notes Section */}
          {mentorship.notes && (
            <div className="mt-8 border-t border-gray-200 pt-6">
              <button
                onClick={() => setNotesOpen(!notesOpen)}
                className="w-full text-left text-lg font-semibold text-gray-900 flex justify-between items-center"
              >
                Notes
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${notesOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {notesOpen && (
                <div className="mt-4 bg-gray-50 p-4 rounded-md text-gray-700 whitespace-pre-wrap">
                  {mentorship.notes}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}