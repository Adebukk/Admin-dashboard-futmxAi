import { NextRequest, NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { auth } from "@/lib/firebaseAdmin";

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const index = pc.index({ name: process.env.PINECONE_INDEX_NAME! });

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized missing token" },
        { status: 401 },
      );
    }
    const token = authHeader.split("Bearer ")[1]?.trim();
    const decodedToken = await auth.verifyIdToken(token);
    const StaffID = decodedToken.uid;
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const faculty = formData.get("faculty") as string;
    const department = formData.get("department") as string;

    if (!file) {
      return NextResponse.json({ error: "NO FILE UPLOADED" }, { status: 400 });
    }
    const textContent = await file.text();
    const textChunk = textContent.slice(0, 500);
    const mockEmbedding: number[] = new Array(1024).fill(0.1);

    await index.upsert({
      records: [
        {
          id: `${file.name.replace(/\.[^/.]+$/, "")}`,
          values: mockEmbedding,
          metadata: {
            filename: file.name,
            uploadedBy: StaffID,
            content: textChunk,
            faculty: faculty,
            department: department,
          },
        },
      ],
    });
    return NextResponse.json({
      success: true,
      message: "Document uploaded successfully",
    });
  } catch (error: any) {
    console.log("Ingestion Error ", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 },
    );
  }
}
