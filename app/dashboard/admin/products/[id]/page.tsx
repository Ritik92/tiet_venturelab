// app/admin/products/[id]/page.tsx
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
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'FUNDED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (loading) return <div className="p-4">Loading product details...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!product) return <div className="p-4">Product not found</div>;
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Details</h1>
        <button
          onClick={() => router.push('/dashboard/admin/products')}
          className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200"
        >
          Back to Products
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold">{product.title}</h2>
              <p className="text-gray-500">{product.category}</p>
            </div>
            <div className="flex items-center">
              <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getStatusColor(product.status)} mr-4`}>
                {product.status}
              </span>
              <select
                className="border rounded p-2"
                value={product.status}
                onChange={(e) => handleStatusChange(e.target.value as ProductStatus)}
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-medium mb-2">Entrepreneur</h3>
            <p><span className="font-medium">Name:</span> {product.user.name}</p>
            <p><span className="font-medium">Email:</span> {product.user.email}</p>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <p className="whitespace-pre-line">{product.description}</p>
          </div>
          
          {product.videoUrl && (
            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-medium mb-2">Video</h3>
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
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
          
          {product.images && product.images.length > 0 && (
            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-medium mb-2">Images</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                {product.images.map((image, index) => (
                  <div key={index} className="rounded overflow-hidden h-48">
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
          
          {product.pitchDeck && (
            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-medium mb-2">Pitch Deck</h3>
              <a 
                href={product.pitchDeck} 
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                View Pitch Deck
              </a>
            </div>
          )}
          
          {product.fundingAmount && (
            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-medium mb-2">Funding Amount</h3>
              <p>${product.fundingAmount.toLocaleString()}</p>
            </div>
          )}
          
          {/* Mentorship information (if available) */}
          {product.mentorship && (
            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-medium mb-2">Mentorship</h3>
              <p><span className="font-medium">Mentor:</span> {product.mentorship.mentor.name}</p>
              <p><span className="font-medium">Status:</span> {product.mentorship.status}</p>
              {product.mentorship.notes && (
                <div className="mt-2">
                  <p className="font-medium">Notes:</p>
                  <p className="whitespace-pre-line">{product.mentorship.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}