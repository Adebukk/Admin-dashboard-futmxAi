import { NextRequest, NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { auth } from "@/lib/firebaseAdmin";
import { PDFParse } from "pdf-parse";

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const index = pc.index({ name: process.env.PINECONE_INDEX_NAME! });

function chunkText(
  text: string,
  chunkSize: number = 3000,
  overlap: number = 200,
): string[] {
  const chunks: string[] = [];
  if (!text || text.trim() === "") return chunks;
  if (chunkSize <= overlap) {
    chunkSize = 3000;
    overlap = 200;
  }
  let i = 0;
  while (i < text.length) {
    let end = i + chunkSize;
    if (end < text.length) {
      const lastSpace = text.lastIndexOf(" ", end);
      if (lastSpace > i) end = lastSpace;
    }
    chunks.push(text.slice(i, end));
    i = end - overlap;
  }
  return chunks as string[];
}
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
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Extract the real readable text using pdf-parse
    const pdfData = await new PDFParse(uint8Array);
    const textContent = (await pdfData.getText()).text;
    // Clean up the text (removes excess blank lines or weird spacing common in PDFs)
    const cleanTextContent = textContent.replace(/\n\s*\n/g, "\n");

    // const textContent = await file.text();
    // 1. SPLIT THE ENTIRE DOCUMENT INTO AN ARRAY OF CHUNKS
    const allChunks = chunkText(cleanTextContent);

    // 2. PROCESS IN BATCHES (So we don't overload Pinecone's API limits)
    const BATCH_SIZE = 50;
    let totalUpserted = 0;

    for (let i = 0; i < allChunks.length; i += BATCH_SIZE) {
      // Grab 50 chunks at a time
      const batchChunks = allChunks.slice(i, i + BATCH_SIZE);
      // const textChunk = textContent.slice(0, 2000);

      const embeddingResponse = await pc.inference.embed({
        model: "llama-text-embed-v2",
        inputs: batchChunks,
        parameters: { inputType: "passage", truncate: "END" },
      });

      // Extract the vector data array from Pinecone's response
      const embeddingsList = (embeddingResponse as any).data;

      // Prepare the array of vector records to save to the database
      const records = batchChunks.map((chunkText, indexInBatch) => {
        // Keep track of exactly which chunk we are on globally
        const globalChunkIndex = i + indexInBatch;

        return {
          // Give every single chunk a unique ID so they don't overwrite each other
          id: `${file.name.replace(/\.[^/.]+$/, "")}-chunk-${globalChunkIndex}-${crypto.randomUUID()}`,
          values: embeddingsList[indexInBatch].values,
          metadata: {
            source_document: file.name,
            uploadedBy: StaffID,
            chunk_text: chunkText, // The AI saves this specific piece of text
            chunkIndex: globalChunkIndex, // Saves the page/order number
            faculty: faculty,
            department: department,
          },
        };
      });
      //   const realVectorData = (embeddingResponse as any).data
      //     ? (embeddingResponse as any).data[0].values
      //     : (embeddingResponse as any)[0].values;
      //  console.log("Here ooo", realVectorData);
      // //  console.log("Another one", textChunk[0].slice(0,255))
      await index.namespace("student-handbook-namespace").upsert({
        records: records,
      });
      totalUpserted += records.length;
    }
    return NextResponse.json({
      success: true,
      message: `Document uploaded successfully ${totalUpserted}`,
    });
  } catch (error: any) {
    console.log("Ingestion Error ", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 },
    );
  }
}
