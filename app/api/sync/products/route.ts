import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { products } = body as { 
      products: { 
        id: string; 
        name: string; 
        categoryId: string; 
        price: number; 
        active: boolean; 
        orderFrequency: number; 
        deleted?: boolean;
      }[] 
    };

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { message: "No products to sync" },
        { status: 400 }
      );
    }

    const toDelete = products.filter((p) => p.deleted);
    const toUpsert = products.filter((p) => !p.deleted);

    const deleteIds = toDelete.map((p) => p.id);
    
    // Delete products marked as deleted (ignore if not found)
    if (deleteIds.length > 0) {
      await prisma.billItemRecord.deleteMany({
        where: { productId: { in: deleteIds } },
      });
      await prisma.product.deleteMany({
        where: { id: { in: deleteIds } },
      });
    }

    // Upsert remaining products
    let syncedIds: string[] = [];
    if (toUpsert.length > 0) {
      const results = await prisma.$transaction(
        toUpsert.map((prod) =>
          prisma.product.upsert({
            where: { id: prod.id },
            create: {
              id: prod.id,
              name: prod.name,
              categoryId: prod.categoryId,
              price: prod.price,
              active: prod.active,
              orderFrequency: prod.orderFrequency,
            },
            update: {
              name: prod.name,
              categoryId: prod.categoryId,
              price: prod.price,
              active: prod.active,
              orderFrequency: prod.orderFrequency,
            },
          })
        )
      );
      syncedIds = results.map((r: typeof results[0]) => r.id);
    }

    return NextResponse.json({
      success: true,
      syncedCount: syncedIds.length,
      syncedIds,
      deletedIds: deleteIds,
    });
  } catch (error) {
    console.error("Failed to sync products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany();

    const formattedProducts = products.map(p => ({
      ...p,
      syncStatus: "synced"
    }));

    return NextResponse.json({ success: true, products: formattedProducts });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
