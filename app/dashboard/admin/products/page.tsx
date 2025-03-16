'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ProductStatus, Category } from '@prisma/client';

interface User {
  id: string;
  name: string;
  email: string;
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
}

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || '');
  const [categoryFilter, setCategoryFilter] = useState<string>(searchParams.get('category') || '');
  
  // Fetch products with filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Build query string from filters
        const queryParams = new URLSearchParams();
        if (statusFilter) queryParams.append('status', statusFilter);
        if (categoryFilter) queryParams.append('category', categoryFilter);
        
        const response = await fetch(`/api/admin/products?${queryParams.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [statusFilter, categoryFilter]);
  
  // Apply filters and update URL
  const applyFilters = () => {
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    if (categoryFilter) params.set('category', categoryFilter);
    router.push(`/admin/products?${params.toString()}`);
  };
  
  // Handle status change
  const handleStatusChange = async (productId: string, newStatus: ProductStatus) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update product status');
      }
      
      // Update the product status in the local state
      setProducts(products.map(product => 
        product.id === productId ? { ...product, status: newStatus as ProductStatus } : product
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };
  
  // Status options based on your schema
  const statusOptions: ProductStatus[] = ['PENDING', 'APPROVED', 'REJECTED', 'FUNDED'];
  const categoryOptions: Category[] = [
    'TECHNOLOGY', 'HEALTH', 'EDUCATION', 'FINANCE', 
    'FOOD', 'RETAIL', 'ENTERTAINMENT', 'SUSTAINABILITY', 'OTHER'
  ];
  
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
      <div className="animate-pulse text-gray-500">Loading products...</div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-rose-500 bg-rose-50 p-4 rounded-lg shadow-sm">
        Error: {error}
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-medium text-gray-900">Product Management</h1>
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-8">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {categoryOptions.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={applyFilters}
          >
            Apply Filters
          </button>
        </div>
        
        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entrepreneur</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 bg-white">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="font-medium">No products found</p>
                        <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{product.title}</div>
                        <div className="text-sm text-gray-500 mt-1 line-clamp-1">{product.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {product.category}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{product.user.name}</div>
                        <div className="text-sm text-gray-500 mt-1">{product.user.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center space-x-3">
                          <Link href={`/dashboard/admin/products/${product.id}`} className="text-blue-600 hover:text-blue-900 font-medium">
                            View
                          </Link>
                          
                          <select
                            className="border border-gray-300 rounded-md text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            value={product.status}
                            onChange={(e) => handleStatusChange(product.id, e.target.value as ProductStatus)}
                          >
                            {statusOptions.map(status => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}