// lib/r2UploadService.ts
import { v4 as uuidv4 } from 'uuid';

export interface UploadProgressCallback {
  (progress: number): void;
}

export interface UploadedFile {
  url: string;
  fileKey: string;
  fileName: string;
}

export async function uploadToR2(
  file: File,
  folder: 'videos' | 'images' | 'documents',
  onProgress?: UploadProgressCallback
): Promise<UploadedFile> {
  try {
    // Create FormData
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', folder);
    
    // Report initial progress
    if (onProgress) {
      onProgress(0);
    }
    
    // Create an XMLHttpRequest to track upload progress
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.open('POST', '/api/upload');
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          onProgress(percentComplete);
        }
      };
      
      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve({
            url: response.url,
            fileKey: response.fileKey,
            fileName: response.fileName
          });
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      };
      
      xhr.onerror = () => {
        reject(new Error('Upload failed'));
      };
      
      xhr.send(formData);
    });
  } catch (error) {
    console.error('Error uploading file to R2:', error);
    throw error;
  }
}

export const uploadVideo = (file: File, onProgress?: UploadProgressCallback) => 
  uploadToR2(file, 'videos', onProgress);

export const uploadImage = (file: File, onProgress?: UploadProgressCallback) => 
  uploadToR2(file, 'images', onProgress);

export const uploadDocument = (file: File, onProgress?: UploadProgressCallback) => 
  uploadToR2(file, 'documents', onProgress);

export function getFileTypeFromUrl(url: string): string {
  if (url.includes('/videos/')) return 'video';
  if (url.includes('/images/')) return 'image';
  if (url.includes('/documents/')) return 'document';
  return 'unknown';
}