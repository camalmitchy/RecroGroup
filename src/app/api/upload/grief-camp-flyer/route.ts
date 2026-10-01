import "server-only";

import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

import { getRequiredSession } from "@/features/portal/lib/portal-guard";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // Check authentication and admin role
    const session = await getRequiredSession();

    if (session.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type (images and PDFs only)
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only images (JPEG, PNG, WebP) and PDF files are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    // Generate a unique filename
    const timestamp = Date.now();
    const extension = file.name.split(".").pop();
    const filename = `grief-camp-flyer-${timestamp}.${extension}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: false,
    });

    // Update the site setting with the new URL
    await prisma.siteSetting.upsert({
      where: { key: "grief_camp_flyer_url" },
      update: { value: blob.url },
      create: {
        key: "grief_camp_flyer_url",
        value: blob.url,
      },
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
      filename: filename,
    });
  } catch (error) {
    console.error("Error uploading flyer:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: "grief_camp_flyer_url" },
    });

    return NextResponse.json({
      url: setting?.value || null,
    });
  } catch (error) {
    console.error("Error fetching flyer URL:", error);
    return NextResponse.json(
      { error: "Failed to fetch flyer URL" },
      { status: 500 }
    );
  }
}
