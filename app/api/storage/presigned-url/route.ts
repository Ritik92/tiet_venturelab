// app/api/storage/presigned-url/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import { authOptions } from "@/auth.config";

// Configure the S3 client to use Cloudflare R2
const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

// Maximum file sizes
const MAX_FILE_SIZES = {
  videos: 100 * 1024 * 1024, // 100MB
  images: 5 * 1024 * 1024,   // 5MB
  documents: 10 * 1024 * 1024 // 10MB
};

export async function POST(req: NextRequest) {
  try {
    // Verify user is authenticated
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get request data
    const { fileType, extension } = await req.json();
    
    if (!fileType || !['videos', 'images', 'documents'].includes(fileType)) {
      return NextResponse.json(
        { error: "Invalid file type" },
        { status: 400 }
      );
    }

    // Generate a unique file key
    const fileId = uuidv4();
    const fileKey = `${fileType}/${fileId}.${extension.replace(/^\./, '')}`;
    
    // Set the bucket name from environment variable
    const bucketName = process.env.R2_BUCKET_NAME;
    
    if (!bucketName) {
      return NextResponse.json(
        { error: "Storage configuration error" },
        { status: 500 }
      );
    }

    // Create the put command
    const putObjectCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
      ContentType: getContentType(extension),
      // Set maximum allowed size
      ContentLength: MAX_FILE_SIZES[fileType as keyof typeof MAX_FILE_SIZES],
    });

    // Generate a presigned URL
    const uploadUrl = await getSignedUrl(
      s3Client,
      putObjectCommand,
      { expiresIn: 3600 } // URL expires in 1 hour
    );

    return NextResponse.json({
      uploadUrl,
      fileKey,
    });
  } catch (error) {
    console.error("Error creating presigned URL:", error);
    return NextResponse.json(
      { error: "Failed to create upload URL" },
      { status: 500 }
    );
  }
}

// Helper function to determine content type
function getContentType(extension: string): string {
  const ext = extension.toLowerCase().replace(/^\./, '');
  
  // Common content types
  const contentTypes: Record<string, string> = {
    // Videos
    mp4: 'video/mp4',
    mov: 'video/quicktime',
    webm: 'video/webm',
    
    // Images
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    
    // Documents
    pdf: 'application/pdf',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  };
  
  return contentTypes[ext] || 'application/octet-stream';
}