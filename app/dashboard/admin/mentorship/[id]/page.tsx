// app/dashboard/mentorships/[id]/page.tsx
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
  mentor: {
    id: string;
    name: string;
    email: string;
    bio: string | null;
  };
  product: {
    id: string;
    title: string;
    description: string;
    status: string;
    category: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
};

export default function MentorshipDetailPage({ params }: { params: { id: string } }) {
  const [mentorship, setMentorship] = useState<MentorshipDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<"ACTIVE" | "COMPLETED" | "TERMINATED">("ACTIVE");
  const [statusNotes, setStatusNotes] = useState("");
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchMentorship = async () => {
      try {
        const response = await fetch(`/api/admin/mentorships/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch mentorship details');
        }
        const data = await response.json();
        setMentorship(data);
        setNewStatus(data.status);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMentorship();
  }, [params.id]);

  const updateMentorshipStatus = async () => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/admin/mentorships/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          notes: statusNotes ? `${mentorship?.notes || ''}\n\n${new Date().toLocaleDateString()}: ${statusNotes}` : mentorship?.notes,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update mentorship status');
      }

      // Refresh the data
      const updatedData = await response.json();
      setMentorship(updatedData);
      setShowStatusModal(false);
      setStatusNotes("");
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading mentorship details...</div>;
  }

  if (error || !mentorship) {
    return (
      <div className="p-8 text-center text-red-500">
        Error: {error || "Mentorship not found"}
        <div className="mt-4">
          <Link href="/dashboard/admin/mentorship" className="text-blue-600 hover:underline">
            Back to Mentorships
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mentorship Details</h1>
        <div className="space-x-2">
          <button
            onClick={() => setShowStatusModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Update Status
          </button>
          <Link 
            href="/dashboard/mentorships" 
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Back to List
          </Link>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{mentorship.product.title}</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              mentorship.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
              mentorship.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
              'bg-red-100 text-red-800'
            }`}>
              {mentorship.status}
            </span>
          </div>
          <p className="text-gray-600 mt-2">{mentorship.product.description.substring(0, 150)}...</p>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Mentorship Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Created At</p>
                <p>{new Date(mentorship.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p>{new Date(mentorship.updatedAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Product Category</p>
                <p>{mentorship.product.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Product Status</p>
                <p>{mentorship.product.status}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">People</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Entrepreneur</p>
                <p>{mentorship.product.user.name} ({mentorship.product.user.email})</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Mentor</p>
                <p>{mentorship.mentor.name} ({mentorship.mentor.email})</p>
              </div>
            </div>
          </div>
        </div>

        {mentorship.notes && (
          <div className="p-6 border-t">
            <h3 className="text-lg font-medium mb-3">Notes</h3>
            <div className="bg-gray-50 p-4 rounded whitespace-pre-line">
              {mentorship.notes}
            </div>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Update Mentorship Status</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="TERMINATED">TERMINATED</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Notes about this update</label>
                <textarea
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  rows={4}
                  placeholder="Add notes about this status change..."
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={updateMentorshipStatus}
                disabled={updating}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
              >
                {updating ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}