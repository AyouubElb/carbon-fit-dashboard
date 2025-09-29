// app/api/upload/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function slugifyBrand(brand?: string) {
  if (!brand) return "unknown";
  return (
    brand
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "unknown"
  );
}

export async function POST(req: Request) {
  try {
    // require service role key (server-only env)
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "Server not configured" },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const form = await req.formData();
    const file = form.get("file") as unknown as File | null;
    const brand = (form.get("brand") as string) ?? "unknown";
    const bucket = (form.get("bucket") as string) ?? "products-images";

    if (!file)
      return NextResponse.json({ error: "Missing file" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const ext = (file.name.split(".").pop() || "png").replace("jpeg", "jpg");
    const safeBrand = slugifyBrand(brand);
    const pathInsideBucket = `${safeBrand}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${ext}`;

    const { error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(pathInsideBucket, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const filename = `${bucket}/${pathInsideBucket}`; // store this in DB
    return NextResponse.json({ filename });
  } catch (err: unknown) {
    console.error("Upload route error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 }
    );
  }
}
