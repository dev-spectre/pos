import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { categories } = body as { categories: { id: string; name: string; isDefault?: boolean; deleted?: boolean }[] };

    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json(
        { message: "No categories to sync" },
        { status: 400 }
      );
    }

    const toDelete = categories.filter((c) => c.deleted);
    const toUpsert = categories.filter((c) => !c.deleted);

    const deleteIds = toDelete.map((c) => c.id);

    // Delete categories marked as deleted (cascade: delete products first)
    if (deleteIds.length > 0) {
      // Delete bill item records referencing products in these categories
      const productsInCategories = await prisma.product.findMany({
        where: { categoryId: { in: deleteIds } },
        select: { id: true },
      });
      const productIds = productsInCategories.map((p) => p.id);
      if (productIds.length > 0) {
        await prisma.billItemRecord.deleteMany({
          where: { productId: { in: productIds } },
        });
        await prisma.product.deleteMany({
          where: { id: { in: productIds } },
        });
      }
      await prisma.category.deleteMany({
        where: { id: { in: deleteIds } },
      });
    }

    // Upsert remaining categories
    let syncedIds: string[] = [];
    if (toUpsert.length > 0) {
      const results = await prisma.$transaction(
        toUpsert.map((cat) =>
          prisma.category.upsert({
            where: { id: cat.id },
            create: {
              id: cat.id,
              name: cat.name,
              isDefault: cat.isDefault ?? false,
            },
            update: {
              name: cat.name,
              isDefault: cat.isDefault ?? false,
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
    console.error("Failed to sync categories:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany();
    
    const formattedCategories = categories.map(c => ({
      ...c,
      syncStatus: "synced"
    }));

    return NextResponse.json({ success: true, categories: formattedCategories });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
