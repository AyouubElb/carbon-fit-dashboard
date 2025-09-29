// utils/images.ts (or inline in your component)
/*const SUPABASE_IMAGE_URL =
  "https://bnamvffvziulrvptnjax.supabase.co/storage/v1/object/public/";

const isDataUrl = (s?: string) =>
  typeof s === "string" && s.startsWith("data:");
const isFullSupabaseUrl = (s?: string) =>
  typeof s === "string" && s.startsWith(SUPABASE_IMAGE_URL);
const isHttpUrl = (s?: string) =>
  typeof s === "string" &&
  (s.startsWith("http://") || s.startsWith("https://"));

function slugifyBrand(brand?: string) {
  if (!brand) return "unknown";
  return (
    brand
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // replace non-alnum with hyphen
      .replace(/(^-|-$)/g, "") || // trim leading/trailing hyphens
    "unknown"
  );
}*/

// images.ts (client-side)
async function dataUrlToFile(dataUrl: string, filename = "image.png") {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type });
}

export async function uploadFileToServer(
  fileOrDataUrl: File | string,
  brand?: string
) {
  let file: File;
  if (typeof fileOrDataUrl === "string") {
    file = await dataUrlToFile(
      fileOrDataUrl,
      `img.${fileOrDataUrl.split(";")[0].split("/")[1] || "png"}`
    );
  } else {
    file = fileOrDataUrl;
  }

  const fd = new FormData();
  fd.append("file", file);
  if (brand) fd.append("brand", brand);
  fd.append("bucket", "products-images");

  const res = await fetch("/api/upload", { method: "POST", body: fd });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || "Upload failed");
  }
  return json.filename as string; // e.g. "products-images/audi/169...png"
}

export async function processImagesServerSide(
  images: (string | undefined)[],
  brand?: string
) {
  const cache = new Map<string, Promise<string>>();
  const results: Promise<string | null>[] = images.map(async (img) => {
    if (!img) return null;

    // already a storage filename
    if (img.startsWith("products-images/")) return img;

    // full public supabase url -> convert to filename by stripping base
    const SUPABASE_IMAGE_URL = process.env.NEXT_PUBLIC_SUPABASE_IMAGE_URL!;
    if (SUPABASE_IMAGE_URL && img.startsWith(SUPABASE_IMAGE_URL)) {
      return img.replace(SUPABASE_IMAGE_URL, "");
    }

    // external http url -> keep as-is
    if (/^https?:\/\//i.test(img)) return img;

    // data URL -> upload via server
    if (img.startsWith("data:")) {
      if (!cache.has(img)) cache.set(img, uploadFileToServer(img, brand));
      return cache.get(img)!;
    }

    return img;
  });

  const resolved = await Promise.all(results);
  return resolved.filter((r): r is string => typeof r === "string");
}
