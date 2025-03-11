// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { authOptions } from "@/auth.config";

// Configure the S3 client
const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

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

    // Parse the multipart form data
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const fileType = formData.get("fileType") as string;
    
    if (!file || !fileType || !['videos', 'images', 'documents'].includes(fileType)) {
      return NextResponse.json(
        { error: "Invalid file data" },
        { status: 400 }
      );
    }

    // Get file details
    const fileExtension = file.name.split('.').pop() || '';
    const fileId = uuidv4();
    const fileKey = `${fileType}/${fileId}.${fileExtension}`;
    const bucketName = process.env.R2_BUCKET_NAME;
    
    if (!bucketName) {
      return NextResponse.json(
        { error: "Storage configuration error" },
        { status: 500 }
      );
    }

    // Convert the file to buffer
    const buffer = await file.arrayBuffer();
    
    // Upload to R2
    const putCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
      Body: Buffer.from(buffer),
      ContentType: file.type,
    });
    
    await s3Client.send(putCommand);
    
    // Construct the public URL for the file
    const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${fileKey}`;
    
    return NextResponse.json({
      url: publicUrl,
      fileKey,
      fileName: file.name
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}   