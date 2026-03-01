import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { categories } = body as { categories: { id: string; name: string; isDefault?: boolean }[] };

    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json(
        { message: "No categories to sync" },
        { status: 400 }
      );
    }

    const results = await prisma.$transaction(
      categories.map((cat) =>
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

    return NextResponse.json({
      success: true,
      syncedCount: results.length,
      syncedIds: results.map((r: typeof results[0]) => r.id),
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
