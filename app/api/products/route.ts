import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Product } from "@/types";

export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { products } = body as { products: Product[] };

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { message: "No products to sync" },
        { status: 400 }
      );
    }

    const results = await prisma.$transaction(
      products.map((prod) =>
        prisma.product.upsert({
          where: { id: prod.id },
          create: {
            id: prod.id,
            name: prod.name,
            price: prod.price,
            active: prod.active,
            orderFrequency: prod.orderFrequency,
            categoryId: prod.categoryId,
          },
          update: {
            name: prod.name,
            price: prod.price,
            active: prod.active,
            orderFrequency: prod.orderFrequency,
            categoryId: prod.categoryId,
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      syncedCount: results.length,
      syncedIds: results.map((r: { id: string }) => r.id),
    });
  } catch (error) {
    console.error("Failed to sync products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
