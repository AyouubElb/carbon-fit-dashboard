import { createProduct, updateProduct } from "@/lib/services/product";
import { ProductPayload } from "@/lib/types";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const payload = (await request.json()) as ProductPayload;
    if (!payload?.id) {
      return new Response(
        JSON.stringify({ error: "Missing product id for update" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    const result = await updateProduct(payload.id as string, payload);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    let message = "An unexpected error occurred";
    if (err instanceof Error) {
      message = err.message;
    }
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as ProductPayload;
    const result = await createProduct(payload);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    let message = "An unexpected error occurred";
    if (err instanceof Error) {
      message = err.message;
    }
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
