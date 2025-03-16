'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProductStatus, Category, MentorshipStatus } from '@prisma/client';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Mentor {
  id: string;
  name: string;
}

interface Mentorship {
  id: string;
  mentorId: string;
  status: MentorshipStatus;
  notes: string | null;
  mentor: Mentor;
}

interface Product {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  status: ProductStatus;
  userId: string;
  fundingAmount: number | null;
  pitchDeck: string | null;
  images: string[];
  category: Category;
  user: User;
  mentorship: Mentorship | null;
}

export default function ProductDetail({ params }: { params: any }) {
  const { id } = params;
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Status options based on your schema
  const statusOptions: ProductStatus[] = ['PENDING', 'APPROVED', 'REJECTED', 'FUNDED'];
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/admin/products/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product details');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  const handleStatusChange = async (newStatus: ProductStatus) => {
    try {
      const response = await fetch(`/api/admin/products/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update product status');
      }
      
      if (product) {
        setProduct({ ...product, status: newStatus });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };
  
  // Color coding for status badges
  const getStatusColor = (status: ProductStatus): string => {
    switch (status) {
      case 'PENDING': return 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20';
      case 'APPROVED': return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20';
      case 'REJECTED': return 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20';
      case 'FUNDED': return 'bg-sky-50 text-sky-700 ring-1 ring-sky-600/20';
      default: return 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20';
    }
  };
  
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-pulse text-gray-500">Loading product details...</div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-rose-500 bg-rose-50 p-4 rounded-lg shadow-sm">
        Error: {error}
      </div>
    </div>
  );
  
  if (!product) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 className="text-xl font-medium text-gray-700">Product not found</h2>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-medium text-gray-900">Product Details</h1>
          <button
            onClick={() => router.push('/dashboard/admin/products')}
            className="flex items-center px-4 py-2 rounded-md bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Products
          </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Product Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{product.title}</h2>
                <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {product.category}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                  {product.status}
                </span>
                <select
                  className="border border-gray-300 rounded-md text-sm px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={product.status}
                  onChange={(e) => handleStatusChange(e.target.value as ProductStatus)}
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Product Content */}
          <div className="divide-y divide-gray-100">
            {/* Entrepreneur */}
            <div className="p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Entrepreneur</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 font-medium text-sm">
                        {product.user.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">{product.user.name}</p>
                    <p className="text-sm text-gray-500">{product.user.email}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div className="p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
            </div>
            
            {/* Video */}
            {product.videoUrl && (
              <div className="p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-3">Video</h3>
                <div className="relative w-full rounded-lg overflow-hidden shadow-sm" style={{ paddingBottom: '56.25%' }}>
                  <video 
                    src={product.videoUrl} 
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    controls
                    controlsList="nodownload"
                    preload="metadata"
                    playsInline
                  ></video>
                </div>
              </div>
            )}
            
            {/* Images */}
            {product.images && product.images.length > 0 && (
              <div className="p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-3">Images</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {product.images.map((image, index) => (
                    <div key={index} className="rounded-lg overflow-hidden h-48 shadow-sm">
                      <img 
                        src={image} 
                        alt={`Product image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Pitch Deck */}
            {product.pitchDeck && (
              <div className="p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-3">Pitch Deck</h3>
                <a 
                  href={product.pitchDeck} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  View Pitch Deck
                </a>
              </div>
            )}
            
            {/* Funding Amount */}
            {product.fundingAmount && (
              <div className="p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-3">Funding Amount</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-2xl font-bold text-gray-900">${product.fundingAmount.toLocaleString()}</span>
                </div>
              </div>
            )}
            
            {/* Mentorship information */}
            {product.mentorship && (
              <div className="p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-3">Mentorship</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center">
                      <span className="text-gray-500 text-sm font-medium w-20">Mentor:</span>
                      <span className="text-gray-900 font-medium">{product.mentorship.mentor.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 text-sm font-medium w-20">Status:</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.mentorship.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.mentorship.status}
                      </span>
                    </div>
                    {product.mentorship.notes && (
                      <div className="mt-2">
                        <span className="text-gray-500 text-sm font-medium">Notes:</span>
                        <p className="mt-1 text-gray-700 whitespace-pre-line bg-white p-3 rounded border border-gray-200">
                          {product.mentorship.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}