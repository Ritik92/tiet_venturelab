'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, ExternalLink, ChevronRight, PieChart, FileText, Users } from 'lucide-react';
import Link from 'next/link';

// Types based on your schema
type ProductStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'FUNDED';
type Category = 'TECHNOLOGY' | 'HEALTH' | 'EDUCATION' | 'FINANCE' | 'FOOD' | 'RETAIL' | 'ENTERTAINMENT' | 'SUSTAINABILITY' | 'OTHER';

interface Product {
  id: string;
  title: string;
  description: string;
  status: ProductStatus;
  category: Category;
  fundingAmount?: number;
  createdAt: Date;
  mentorship?: Mentorship;
}

interface Mentorship {
  id: string;
  mentorId: string;
  mentor: {
    name: string;
    profileImage?: string;
  };
  status: 'ACTIVE' | 'COMPLETED' | 'TERMINATED';
}

interface UserDashboardProps {
  user: {
    id: string;
    name: string;
    email: string;
    profileImage?: string;
    bio?: string;
  };
  products: Product[];
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  FUNDED: 'bg-blue-100 text-blue-800',
};

const categoryIcons = {
  TECHNOLOGY: '💻',
  HEALTH: '🏥',
  EDUCATION: '🎓',
  FINANCE: '💰',
  FOOD: '🍔',
  RETAIL: '🛍️',
  ENTERTAINMENT: '🎬',
  SUSTAINABILITY: '♻️',
  OTHER: '📦',
};

export default function UserDashboard({ user, products: initialProducts }: UserDashboardProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'funded'>('all');
  
  // Filter products based on selected tab
  const filteredProducts = activeTab === 'all' 
    ? products 
    : products.filter(product => product.status === activeTab.toUpperCase());

  // Stats summary
  const stats = {
    total: products.length,
    pending: products.filter(p => p.status === 'PENDING').length,
    approved: products.filter(p => p.status === 'APPROVED').length,
    rejected: products.filter(p => p.status === 'REJECTED').length,
    funded: products.filter(p => p.status === 'FUNDED').length,
    withMentor: products.filter(p => p.mentorship).length,
  };

  async function handleDeleteProduct(productId: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setProducts(products.filter(p => p.id !== productId));
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
              {user.profileImage ? (
                <img src={user.profileImage} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
              ) : (
                user.name.charAt(0)
              )}
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-gray-900">{user.name}</h1>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <Link href="/profile/edit" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Edit Profile
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <PieChart className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stats.total}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm flex justify-between">
                <span className="font-medium text-indigo-600 hover:text-indigo-500">
                  {stats.pending} pending
                </span>
                <span className="font-medium text-green-600">
                  {stats.approved} approved
                </span>
                <span className="font-medium text-blue-600">
                  {stats.funded} funded
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Products with Mentors</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stats.withMentor}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <Link href="/mentors" className="font-medium text-indigo-600 hover:text-indigo-500 flex items-center">
                  Find mentors <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Resources</dt>
                    <dd className="flex items-baseline">
                      <div className="text-lg font-semibold text-gray-900">Pitch Templates, Guides</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <Link href="/resources" className="font-medium text-indigo-600 hover:text-indigo-500 flex items-center">
                  Browse resources <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Your Products</h2>
          <Link 
            href="/products/new" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" /> Add New Product
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {(['all', 'pending', 'approved', 'rejected', 'funded'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab 
                    ? 'border-indigo-500 text-indigo-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} 
                {tab !== 'all' && ` (${stats[tab]})`}
              </button>
            ))}
          </nav>
        </div>

        {/* Products List */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white shadow sm:rounded-lg p-6 text-center">
            <p className="text-gray-500">No products found. Add a new product to get started!</p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <li key={product.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center min-w-0">
                      <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-md bg-gray-100 text-lg">
                        <span>{categoryIcons[product.category]}</span>
                      </div>
                      <div className="ml-4 min-w-0">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-indigo-600 truncate">{product.title}</p>
                          <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[product.status]}`}>
                            {product.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{product.description.substring(0, 100)}...</p>
                        <div className="mt-1 flex items-center text-xs text-gray-500">
                          <span>Created: {new Date(product.createdAt).toLocaleDateString()}</span>
                          {product.fundingAmount && (
                            <span className="ml-3 font-semibold text-green-600">
                              Funding: ${product.fundingAmount.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {product.mentorship && (
                      <div className="mx-4 flex-shrink-0 flex items-center bg-indigo-50 rounded-full px-3 py-1">
                        <span className="text-xs text-indigo-700 mr-1">Mentor:</span>
                        <span className="text-xs font-medium">{product.mentorship.mentor.name}</span>
                      </div>
                    )}

                    <div className="ml-4 flex-shrink-0 flex">
                      <Link 
                        href={`/products/${product.id}`}
                        className="mr-2 bg-white rounded-full p-1 text-gray-400 hover:text-gray-500"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </Link>
                      <Link 
                        href={`/products/${product.id}/edit`}
                        className="mr-2 bg-white rounded-full p-1 text-gray-400 hover:text-gray-500"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="bg-white rounded-full p-1 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}