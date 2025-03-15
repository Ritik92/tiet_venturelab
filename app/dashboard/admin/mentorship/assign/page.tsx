// app/dashboard/mentorships/assign/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Mentor = {
  id: string;
  name: string;
  email: string;
  bio?: string | null;
};

type Product = {
  id: string;
  title: string;
  description: string;
  userId: string;
  user: {
    name: string;
    email: string;
  };
  status: string;
  category: string;
};

export default function AssignMentorshipPage() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch mentors
        const mentorsResponse = await fetch('/api/users?role=MENTOR');
        if (!mentorsResponse.ok) {
          throw new Error('Failed to fetch mentors');
        }
        const mentorsData = await mentorsResponse.json();
        setMentors(mentorsData);

        // Fetch available products (approved products without mentorship)
        const productsResponse = await fetch('/api/admin/products/available');
        if (!productsResponse.ok) {
          throw new Error('Failed to fetch available products');
        }
        const productsData = await productsResponse.json();
        setAvailableProducts(productsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMentor || !selectedProduct) {
      setError("Please select both a mentor and a product");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/mentorships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mentorId: selectedMentor,
          productId: selectedProduct,
          notes: notes,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create mentorship');
      }

      // Redirect to mentorships list
      router.push('/dashboard/admin/mentorship');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading data...</div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Assign New Mentorship</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="product" className="block font-medium">
            Select Product
          </label>
          <select
            id="product"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="">-- Select a product --</option>
            {availableProducts.map((product) => (
              <option key={product.id} value={product.id}>
                {product.title} (by {product.user.name})
              </option>
            ))}
          </select>
          {availableProducts.length === 0 && (
            <p className="text-sm text-gray-500">No available products for mentorship.</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="mentor" className="block font-medium">
            Select Mentor
          </label>
          <select
            id="mentor"
            value={selectedMentor}
            onChange={(e) => setSelectedMentor(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="">-- Select a mentor --</option>
            {mentors.map((mentor) => (
              <option key={mentor.id} value={mentor.id}>
                {mentor.name} ({mentor.email})
              </option>
            ))}
          </select>
          {mentors.length === 0 && (
            <p className="text-sm text-gray-500">No mentors available.</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="notes" className="block font-medium">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            rows={4}
            placeholder="Enter any additional notes about this mentorship..."
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || !selectedMentor || !selectedProduct}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {submitting ? "Assigning..." : "Assign Mentorship"}
          </button>
        </div>
      </form>
    </div>
  );
}