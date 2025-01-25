import { Client, Storage, ID } from "appwrite";

if (!process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  throw new Error("NEXT_PUBLIC_APPWRITE_ENDPOINT is not defined");
if (!process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  throw new Error("NEXT_PUBLIC_APPWRITE_PROJECT_ID is not defined");
if (!process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID)
  throw new Error("NEXT_PUBLIC_APPWRITE_BUCKET_ID is not defined");

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

export const storage = new Storage(client);

// Helper function to upload files
export const uploadFile = async (file: File) => {
  try {
    const response = await storage.createFile(
      process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!,
      ID.unique(),
      file
    );

    // Get file view URL
    const fileUrl = storage.getFileView(
      process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!,
      response.$id
    );

    return fileUrl;
  } catch (error) {
    console.error("Appwrite upload error:", error);
    throw error;
  }
};
