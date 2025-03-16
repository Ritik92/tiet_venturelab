// app/dashboard/mentorships/page.tsx
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
    mentor: {
      id: string;
      name: string;
      email: string;
    };
    product: {
      id: string;
      title: string;
      user: {
        id: string;
        name: string;
      };
    };
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

  if (loading) {
    return <div className="p-8 text-center">Loading mentorships...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mentorship Management</h1>
        <Link 
          href="/dashboard/admin/mentorship/assign" 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Assign New Mentorship
        </Link>
      </div>

      {mentorships.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded">
          <p>No mentorships found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border text-left">Product</th>
                <th className="py-2 px-4 border text-left">Entrepreneur</th>
                <th className="py-2 px-4 border text-left">Mentor</th>
                <th className="py-2 px-4 border text-left">Status</th>
                <th className="py-2 px-4 border text-left">Created At</th>
                <th className="py-2 px-4 border text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mentorships.map((mentorship) => (
                <tr key={mentorship.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{mentorship.product.title}</td>
                  <td className="py-2 px-4 border">{mentorship.product.user.name}</td>
                  <td className="py-2 px-4 border">{mentorship.mentor.name}</td>
                  <td className="py-2 px-4 border">
                    <span className={`px-2 py-1 rounded text-sm ${
                      mentorship.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      mentorship.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {mentorship.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 border">
                    {new Date(mentorship.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border">
                    <Link 
                      href={`/dashboard/admin/mentorship/${mentorship.id}`}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                    >
                      View
                    </Link>
                    <Link 
                      href={`/dashboard/admin/mentorship/${mentorship.id}/edit`}
                      className="text-green-600 hover:text-green-800"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}