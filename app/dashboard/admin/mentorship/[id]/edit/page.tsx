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
        if (!mentorshipResponse.ok) {
          throw new Error('Failed to fetch mentorship details');
        }
        const mentorshipData = await mentorshipResponse.json();
        setMentorship(mentorshipData);
        
        // Set form values
        setStatus(mentorshipData.status);
        setMentorId(mentorshipData.mentorId);
        setNotes(mentorshipData.notes || "");
        
        // Fetch available mentors
        const mentorsResponse = await fetch('/api/users?role=MENTOR');
        if (!mentorsResponse.ok) {
          throw new Error('Failed to fetch mentors');
        }
        const mentorsData = await mentorsResponse.json();
        setAvailableMentors(mentorsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
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
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          mentorId,
          notes,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update mentorship');
      }

      setSuccessMessage("Mentorship updated successfully");
      
      // Wait a moment before redirecting
      setTimeout(() => {
        router.push(`/dashboard/admin/mentorship/${params.id}`);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading mentorship details...</div>;
  }

  if (error && !mentorship) {
    return (
      <div className="p-8 text-center text-red-500">
        Error: {error || "Mentorship not found"}
        <div className="mt-4">
          <Link href="/dashboard/mentorships" className="text-blue-600 hover:underline">
            Back to Mentorships
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Mentorship</h1>
        <Link 
          href={`/dashboard/admin/mentorship/${params.id}`}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
        >
          Cancel and View Details
        </Link>
      </div>

      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-800 rounded">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        {mentorship && (
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">{mentorship.product.title}</h2>
            <p className="text-gray-600 mt-2">
              <span className="font-medium">Entrepreneur: </span> 
              {mentorship.product.user.name}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Current Mentor: </span> 
              {mentorship.mentor.name}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as "ACTIVE" | "COMPLETED" | "TERMINATED")}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="TERMINATED">TERMINATED</option>
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
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="" disabled>Select a mentor</option>
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
                rows={6}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter any notes about this mentorship..."
              ></textarea>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <Link
              href={`/dashboard/admin/mentorship/${params.id}`}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={updating}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
            >
              {updating ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}