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
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse delay-150"></div>
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse delay-300"></div>
          <span className="text-gray-600 font-medium ml-2">Loading data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h1 className="text-2xl font-medium text-gray-900">Assign New Mentorship</h1>
          </div>
          
          <div className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg flex items-start">
                <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label htmlFor="product" className="block text-sm font-medium text-gray-700">
                  Select Product
                </label>
                <div className="mt-1">
                  <select
                    id="product"
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  >
                    <option value="">-- Select a product --</option>
                    {availableProducts.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.title} (by {product.user.name})
                      </option>
                    ))}
                  </select>
                </div>
                {availableProducts.length === 0 && (
                  <p className="mt-2 text-sm text-gray-500">No available products for mentorship.</p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="mentor" className="block text-sm font-medium text-gray-700">
                  Select Mentor
                </label>
                <div className="mt-1">
                  <select
                    id="mentor"
                    value={selectedMentor}
                    onChange={(e) => setSelectedMentor(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  >
                    <option value="">-- Select a mentor --</option>
                    {mentors.map((mentor) => (
                      <option key={mentor.id} value={mentor.id}>
                        {mentor.name} ({mentor.email})
                      </option>
                    ))}
                  </select>
                </div>
                {mentors.length === 0 && (
                  <p className="mt-2 text-sm text-gray-500">No mentors available.</p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notes (Optional)
                </label>
                <div className="mt-1">
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    rows={4}
                    placeholder="Enter any additional notes about this mentorship..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !selectedMentor || !selectedProduct}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Assigning...
                    </span>
                  ) : (
                    "Assign Mentorship"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}