'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProductStatus, Category } from '@prisma/client';

// Define types based on your Prisma schema
type Mentorship = {
  id: string;
  mentor: {
    name: string;
    profileImage: string | null;
  };
};

type Product = {
  id: string;
  title: string;
  description: string;
  status: ProductStatus;
  images: string[];
  category: Category;
  fundingAmount: number | null;
  mentorship: (Mentorship & {
    mentor: {
      name: string;
      profileImage: string | null;
    };
  }) | null;
};

type ProductWithUser = Product & {
  user: {
    name: string;
    profileImage: string | null;
  };
};

export default function UserProductsPage() {
  const [products, setProducts] = useState<ProductWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/product', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }
        
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Invalid response format');
        }
        
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProducts();
  }, []);

  const getStatusBadgeColor = (status: ProductStatus) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'FUNDED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: Category) => {
    switch (category) {
      case 'TECHNOLOGY': return '💻';
      case 'HEALTH': return '🏥';
      case 'EDUCATION': return '🎓';
      case 'FINANCE': return '💰';
      case 'FOOD': return '🍔';
      case 'RETAIL': return '🛍️';
      case 'ENTERTAINMENT': return '🎬';
      case 'SUSTAINABILITY': return '♻️';
      case 'OTHER': return '📦';
      default: return '📦';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Products</h1>
        <Link href="/dashboard/user/submit-product" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300">
          Add New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">You haven't added any products yet.</p>
          <Link href="/dashboard/user/submit-product" className="text-blue-600 hover:text-blue-800 font-medium">
            Create your first product
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition duration-300 hover:shadow-xl">
              <div className="relative h-48 bg-gray-200">
                {product.images && product.images.length > 0 ? (
                  <div 
                    className="w-full h-full bg-cover bg-center"
                    style={{ 
                      backgroundImage: `url(${product.images[0]})`
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-4xl">
                    {getCategoryIcon(product.category)}
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(product.status)}`}>
                    {product.status}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <span className="text-sm text-gray-600 mr-2">{getCategoryIcon(product.category)}</span>
                  <span className="text-sm text-gray-600">{product.category}</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{product.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                
                {product.fundingAmount && (
                  <div className="mb-4">
                    <p className="text-green-600 font-medium">
                      ${product.fundingAmount.toLocaleString()} funding requested
                    </p>
                  </div>
                )}
                
                {product.mentorship && (
                  <div className="mb-4 flex items-center">
                    <div className="flex-shrink-0 h-6 w-6 bg-gray-300 rounded-full mr-2 overflow-hidden">
                      {product.mentorship.mentor.profileImage ? (
                        <div 
                          className="h-full w-full bg-cover bg-center"
                          style={{ 
                            backgroundImage: `url(${product.mentorship.mentor.profileImage})` 
                          }}
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-blue-500 text-white text-xs">
                          {product.mentorship.mentor.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-gray-600">
                      Mentored by {product.mentorship.mentor.name}
                    </span>
                  </div>
                )}
                
                <Link href={`/dashboard/user/myproducts/${product.id}`} className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}