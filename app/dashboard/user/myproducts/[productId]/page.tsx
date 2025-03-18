'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product, ProductStatus, Category, Mentorship } from '@prisma/client';
import { useParams } from 'next/navigation';

type ProductWithDetails = Product & {
  user: {
    id: string;
    name: string;
    profileImage: string | null;
    email: string;
  };
  mentorship: (Mentorship & {
    mentor: {
      id: string;
      name: string;
      profileImage: string | null;
    };
  }) | null;
};

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.productId as string;
  const [product, setProduct] = useState<ProductWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/product/${productId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch product details');
        }
        
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  const getStatusBadgeColor = (status: ProductStatus) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'APPROVED': return 'bg-green-100 text-green-800 border-green-300';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-300';
      case 'FUNDED': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
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

  const getCategoryColor = (category: Category) => {
    switch (category) {
      case 'TECHNOLOGY': return 'from-blue-800 to-indigo-600';
      case 'HEALTH': return 'from-green-800 to-emerald-600';
      case 'EDUCATION': return 'from-purple-800 to-violet-600';
      case 'FINANCE': return 'from-emerald-800 to-teal-600';
      case 'FOOD': return 'from-orange-800 to-amber-600';
      case 'RETAIL': return 'from-pink-800 to-rose-600';
      case 'ENTERTAINMENT': return 'from-red-800 to-pink-600';
      case 'SUSTAINABILITY': return 'from-teal-800 to-cyan-600';
      case 'OTHER': return 'from-gray-800 to-slate-600';
      default: return 'from-blue-800 to-indigo-600';
    }
  };

  const nextImage = () => {
    if (product?.images && product.images.length > 0) {
      setCurrentImageIndex((currentImageIndex + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product?.images && product.images.length > 0) {
      setCurrentImageIndex((currentImageIndex - 1 + product.images.length) % product.images.length);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-blue-600 font-medium text-lg">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-white">
        <div className="bg-white shadow-lg border-l-4 border-red-500 rounded-lg p-6 max-w-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'We couldn\'t find the product you\'re looking for. It might have been removed or you may have followed an invalid link.'}</p>
          <Link 
            href="/dashboard/user/myproducts" 
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to My Products
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <div className="pt-6 pb-24">
        {/* Page header with breadcrumb navigation */}
        <div className="container mx-auto px-4 mb-8">
          <Link 
            href="/dashboard/user/myproducts" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to My Products
          </Link>
        </div>

        {/* Hero section with product title and status */}
        <div className={`bg-gradient-to-r ${getCategoryColor(product.category)} text-white mb-12`}>
          <div className="container mx-auto px-4 py-20">
            <div className="flex flex-col items-start max-w-4xl mx-auto">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-3xl">{getCategoryIcon(product.category)}</span>
                <span className="text-white/80 font-medium text-lg uppercase tracking-wider">{product.category}</span>
                <span className={`inline-flex items-center px-4 py-1 rounded-full text-sm font-medium border ${getStatusBadgeColor(product.status)}`}>
                  {product.status}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{product.title}</h1>
              <p className="text-white/80 text-lg">Created on {formatDate(product.createdAt)}</p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100 backdrop-blur-sm">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Media section - takes up 3/5 on larger screens */}
              <div className="lg:col-span-3 p-8">
                {/* Main image gallery */}
                <div className="mb-8">
                  <div className="relative h-72 md:h-96 bg-gray-100 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
                    {product.images && product.images.length > 0 ? (
                      <>
                        <Image 
                          src={product.images[currentImageIndex]} 
                          alt={`${product.title} - Image ${currentImageIndex + 1}`}
                          layout="fill"
                          objectFit="cover"
                          className="transition-opacity duration-500"
                        />
                        {product.images.length > 1 && (
                          <>
                            <button 
                              onClick={prevImage}
                              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-all duration-300 backdrop-blur-sm"
                              aria-label="Previous image"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </button>
                            <button 
                              onClick={nextImage}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-all duration-300 backdrop-blur-sm"
                              aria-label="Next image"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              </svg>
                            </button>
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                              {product.images.map((_, index) => (
                                <button
                                  key={index}
                                  onClick={() => setCurrentImageIndex(index)}
                                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                    currentImageIndex === index ? 'bg-white scale-125' : 'bg-white/50'
                                  }`}
                                  aria-label={`Go to image ${index + 1}`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gradient-to-r from-blue-50 to-indigo-50 text-6xl">
                        {getCategoryIcon(product.category)}
                      </div>
                    )}
                  </div>

                  {/* Thumbnail navigation */}
                  {product.images && product.images.length > 1 && (
                    <div className="flex mt-4 space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                      {product.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`h-16 w-16 flex-shrink-0 rounded-xl overflow-hidden transition-all duration-300 ${
                            currentImageIndex === index 
                              ? 'ring-2 ring-blue-500 ring-offset-2 scale-105' 
                              : 'opacity-70 hover:opacity-100'
                          }`}
                        >
                          <Image 
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            width={100}
                            height={100}
                            objectFit="cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Video section */}
                {product.videoUrl && (
                  <div className="mt-12">
                    <div className="flex items-center mb-4">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">Product Video</h3>
                    </div>
                    <div className="rounded-2xl overflow-hidden shadow-lg bg-gray-900">
                      <div className="aspect-w-16 aspect-h-9">
                        {product.videoUrl.includes('youtube.com') || product.videoUrl.includes('youtu.be') ? (
                          <iframe
                            src={product.videoUrl.replace('watch?v=', 'embed/')}
                            title="Product Video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          ></iframe>
                        ) : product.videoUrl.includes('vimeo.com') ? (
                          <iframe
                            src={`https://player.vimeo.com/video/${product.videoUrl.split('/').pop()}`}
                            title="Product Video"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          ></iframe>
                        ) : (
                          <video
                            src={product.videoUrl}
                            controls
                            className="w-full h-full object-cover"
                          >
                            Your browser does not support the video tag.
                          </video>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Product details section - takes up 2/5 on larger screens */}
              <div className="lg:col-span-2 p-8 bg-gray-50 rounded-bl-3xl rounded-br-3xl lg:rounded-bl-none lg:rounded-tr-3xl">
                {/* Funding information */}
                {product.fundingAmount && (
                  <div className="mb-8">
                    <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-blue-100 shadow-md">
                      <div className="flex items-center mb-2">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Funding Request</h2>
                      </div>
                      <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ml-11">
                        ${product.fundingAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {/* About This Product section */}
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">About This Product</h2>
                  </div>
                  <div className="prose max-w-none text-gray-600 ml-11">
                    <p className="whitespace-pre-line">{product.description}</p>
                  </div>
                </div>

                {/* Creator info */}
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Creator</h2>
                  </div>
                  <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 ml-11">
                    <div className="flex items-center">
                      <div className="h-14 w-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-4 overflow-hidden shadow-md flex-shrink-0">
                        {product.user.profileImage ? (
                          <Image 
                            src={product.user.profileImage}
                            alt={product.user.name}
                            width={56}
                            height={56}
                            objectFit="cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-white text-xl font-bold">
                            {product.user.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{product.user.name}</p>
                        <p className="text-sm text-gray-600">{product.user.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mentorship info if available */}
                {product.mentorship && (
                  <div className="mb-8">
                    <div className="flex items-center mb-4">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                      </div>
                      <h2 className="text-xl font-bold text-gray-800">Mentorship</h2>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 shadow-md ml-11">
                      <div className="flex items-center mb-4">
                        <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mr-4 overflow-hidden shadow-md flex-shrink-0">
                          {product.mentorship.mentor.profileImage ? (
                            <Image 
                              src={product.mentorship.mentor.profileImage}
                              alt={product.mentorship.mentor.name}
                              width={48}
                              height={48}
                              objectFit="cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-white font-bold">
                              {product.mentorship.mentor.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{product.mentorship.mentor.name}</p>
                          <div className="flex items-center">
                            <span className="text-sm text-gray-600 mr-2">Mentor</span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              product.mentorship.status === 'ACTIVE' 
                                ? 'bg-green-100 text-green-800 border border-green-300' 
                                : 'bg-blue-100 text-blue-800 border border-blue-300'
                            }`}>
                              {product.mentorship.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      {product.mentorship.notes && (
                        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg border border-blue-100">
                          <p className="font-medium text-blue-800 mb-2">Mentor Notes:</p>
                          <p className="whitespace-pre-line text-sm text-gray-700">{product.mentorship.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Pitch deck download */}
                {product.pitchDeck && (
                  <div className="mt-10">
                    <a 
                      href={product.pitchDeck} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Download Pitch Deck
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}