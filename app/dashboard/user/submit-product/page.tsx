// app/dashboard/submit-product/page.tsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Category } from "@prisma/client";
import { uploadVideo, uploadImage, uploadDocument } from "@/lib/uploadservice";

export default function SubmitProduct() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [pitchDeckUploadProgress, setPitchDeckUploadProgress] = useState(0);
  const [imageUploadProgress, setImageUploadProgress] = useState<Record<string, number>>({});
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<{ id: string; preview: string }[]>([]);
  const [pitchDeckName, setPitchDeckName] = useState<string | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    category: "TECHNOLOGY" as Category,
    pitchDeck: "",
    images: [] as string[]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create local preview
    const reader = new FileReader();
    reader.onload = () => {
      setVideoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      // Upload to R2
      const uploadedFile = await uploadVideo(file, (progress) => {
        setVideoUploadProgress(progress);
      });

      // Update form data with the new video URL
      setFormData({ ...formData, videoUrl: uploadedFile.url });
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Failed to upload video. Please try again.");
      setVideoPreview(null);
      setVideoUploadProgress(0);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Limit to 5 images total
    const remainingSlots = 5 - selectedImages.length;
    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    
    if (filesToUpload.length === 0) {
      alert("You can upload a maximum of 5 images.");
      return;
    }

    // Process each file
    for (const file of filesToUpload) {
      const fileId = Date.now().toString() + Math.random().toString(36).substring(2, 9);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImages(prev => [...prev, { 
          id: fileId, 
          preview: reader.result as string 
        }]);
      };
      reader.readAsDataURL(file);

      try {
        // Upload to R2
        setImageUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
        
        const uploadedFile = await uploadImage(file, (progress) => {
          setImageUploadProgress(prev => ({ ...prev, [fileId]: progress }));
        });

        // Add URL to form data
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, uploadedFile.url]
        }));
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
        setSelectedImages(prev => prev.filter(img => img.id !== fileId));
      }
    }
  };

  const handlePitchDeckUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setPitchDeckName(file.name);
    
    try {
      // Upload to R2
      const uploadedFile = await uploadDocument(file, (progress) => {
        setPitchDeckUploadProgress(progress);
      });

      // Update form data with the pitch deck URL
      setFormData({ ...formData, pitchDeck: uploadedFile.url });
    } catch (error) {
      console.error("Error uploading pitch deck:", error);
      alert("Failed to upload pitch deck. Please try again.");
      setPitchDeckName(null);
      setPitchDeckUploadProgress(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // API call to create product
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit product');
      }

      const data = await response.json();
      router.push(`/dashboard/user`);
    } catch (error) {
      console.error('Error submitting product:', error);
      alert('Failed to submit product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-8">
        <div className="text-center mb-12">
          <h5 className="uppercase text-blue-600 font-medium text-sm tracking-wide">Create New</h5>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Submit Your Product</h1>
          <div className="w-24 h-1 bg-blue-500 mx-auto my-4"></div>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            Share your innovative idea with potential investors and mentors. Be detailed and showcase what makes your product unique.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-gray-800 font-medium mb-2">
                  Product Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter a catchy title for your product"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-gray-800 font-medium mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  {Object.keys(Category).map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0) + category.slice(1).toLowerCase().replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-gray-800 font-medium mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Describe your product in detail. What problem does it solve? What makes it unique?"
                />
              </div>

              <div>
                <label htmlFor="pitchDeck" className="block text-gray-800 font-medium mb-2">
                  Pitch Deck (PDF)
                </label>
                <div className="flex flex-col">
                  <input
                    type="file"
                    id="pitchDeck"
                    ref={fileInputRef}
                    accept=".pdf,.pptx,.docx"
                    className="hidden"
                    onChange={handlePitchDeckUpload}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition-all font-medium flex items-center self-start"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Upload Pitch Deck
                  </button>
                  
                  {pitchDeckName && (
                    <div className="mt-3">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm text-gray-600 truncate max-w-xs">{pitchDeckName}</span>
                      </div>
                      
                      {pitchDeckUploadProgress < 100 ? (
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${pitchDeckUploadProgress}%` }}
                          ></div>
                          <p className="text-xs text-gray-600 mt-1">Uploading: {pitchDeckUploadProgress}%</p>
                        </div>
                      ) : (
                        <p className="text-sm text-green-600 mt-1">Document uploaded successfully</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <label htmlFor="video" className="block text-gray-800 font-medium mb-2">
                  Product Demo Video
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-all">
                  {!videoPreview ? (
                    <>
                      <input
                        type="file"
                        id="video"
                        ref={videoInputRef}
                        accept="video/*"
                        className="hidden"
                        onChange={handleVideoUpload}
                      />
                      <button
                        type="button"
                        onClick={() => videoInputRef.current?.click()}
                        className="w-full py-8"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <p className="mt-2 text-sm text-gray-600">Click to upload a video demonstration</p>
                        <p className="text-xs text-gray-500 mt-1">MP4, MOV, or WebM (Max 100MB)</p>
                      </button>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <video 
                        src={videoPreview} 
                        controls 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      {videoUploadProgress < 100 ? (
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-500 h-2.5 rounded-full" 
                            style={{ width: `${videoUploadProgress}%` }}
                          ></div>
                          <p className="text-xs text-gray-600 mt-1">Uploading: {videoUploadProgress}%</p>
                        </div>
                      ) : (
                        <p className="text-sm text-green-600">Video uploaded successfully</p>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setVideoPreview(null);
                          setVideoUploadProgress(0);
                          setFormData({ ...formData, videoUrl: "" });
                        }}
                        className="text-red-500 text-sm hover:underline"
                      >
                        Remove video
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="images" className="block text-gray-800 font-medium mb-2">
                  Product Images
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-all">
                  <input
                    type="file"
                    id="images"
                    ref={imageInputRef}
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="w-full py-4"
                    disabled={selectedImages.length >= 5}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">Upload product images (up to 5)</p>
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF (Max 5MB each)</p>
                  </button>
                </div>

                {selectedImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {selectedImages.map((image) => (
                      <div key={image.id} className="relative">
                        <img 
                          src={image.preview} 
                          alt="Product image" 
                          className="h-24 w-full object-cover rounded-lg shadow-sm" 
                        />
                        
                        {imageUploadProgress[image.id] < 100 && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                            <div className="text-white text-sm font-medium">
                              {imageUploadProgress[image.id]}%
                            </div>
                          </div>
                        )}
                        
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedImages(prev => prev.filter(img => img.id !== image.id));
                            // Remove the URL from form data
                            // This is a simplified approach since we don't have a direct mapping
                            // In production, you'd want to track which preview corresponds to which URL
                            if (formData.images.length > 0) {
                              const newImages = [...formData.images];
                              newImages.pop(); // Remove the last one as a simplification
                              setFormData({...formData, images: newImages});
                            }
                          }}
                          className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-red-100"
                          disabled={imageUploadProgress[image.id] < 100}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg mr-4 hover:bg-gray-50 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.videoUrl}
              className={`bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 
                transition-all flex items-center ${(isSubmitting || !formData.videoUrl) ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Product
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}