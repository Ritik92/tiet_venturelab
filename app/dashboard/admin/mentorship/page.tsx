"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type MentorshipStatus = 'ACTIVE' | 'COMPLETED' | 'TERMINATED';
type Mentorship = {
    id: string;
    createdAt: string;
    updatedAt: string;
    mentorId: string;
    productId: string;
    status: MentorshipStatus;
    notes: string | null;
};

type MentorshipWithDetails = Mentorship & {
    mentor: { id: string; name: string; email: string };
    product: { id: string; title: string; user: { id: string; name: string } };
};

export default function MentorshipsPage() {
  const [mentorships, setMentorships] = useState<MentorshipWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMentorships = async () => {
      try {
        const response = await fetch('/api/admin/mentorships');
        if (!response.ok) {
          throw new Error('Failed to fetch mentorships');
        }
        const data = await response.json();
        setMentorships(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMentorships();
  }, []);

  const getStatusStyles = (status: MentorshipStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'TERMINATED':
        return 'bg-red-100 text-red-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mentorships</h1>
          <Link
            href="/dashboard/admin/mentorship/assign"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Mentorship
          </Link>
        </div>

        {mentorships.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500 text-lg">No mentorships found</p>
            <Link
              href="/dashboard/admin/mentorship/assign"
              className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium"
            >
              Start by assigning a mentorship →
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entrepreneur</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mentor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mentorships.map((mentorship) => (
                    <tr key={mentorship.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{mentorship.product.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{mentorship.product.user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{mentorship.mentor.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusStyles(mentorship.status)}`}>
                          {mentorship.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(mentorship.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-4">
                          <Link href={`/dashboard/admin/mentorship/${mentorship.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                            View
                          </Link>
                          <Link href={`/dashboard/admin/mentorship/${mentorship.id}/edit`} className="text-gray-600 hover:text-gray-800 font-medium">
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}