import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Expense } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { expenses } = body as { expenses: Expense[] };

    if (!expenses || !Array.isArray(expenses) || expenses.length === 0) {
      return NextResponse.json(
        { message: "No expenses to sync" },
        { status: 400 }
      );
    }

    const toDelete = expenses.filter((e) => e.deleted);
    const toUpsert = expenses.filter((e) => !e.deleted);

    const deleteIds = toDelete.map((e) => e.id);

    // Delete expenses marked as deleted
    if (deleteIds.length > 0) {
      await prisma.expense.deleteMany({
        where: { id: { in: deleteIds } },
      });
    }

    // Upsert remaining expenses
    let syncedIds: string[] = [];
    if (toUpsert.length > 0) {
      const results = await prisma.$transaction(
        toUpsert.map((exp) =>
          prisma.expense.upsert({
            where: { id: exp.id },
            create: {
              id: exp.id,
              title: exp.title,
              category: exp.category,
              amount: exp.amount,
              date: exp.date,
              notes: exp.notes || "",
              createdAt: exp.createdAt,
            },
            update: {},
          })
        )
      );
      syncedIds = results.map((r: { id: string }) => r.id);
    }

    return NextResponse.json({
      success: true,
      syncedCount: syncedIds.length,
      syncedIds,
      deletedIds: deleteIds,
    });
  } catch (error) {
    console.error("Failed to sync expenses:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200
    });
    
    const formattedExpenses = expenses.map(e => ({
      ...e,
      syncStatus: "synced"
    }));

    return NextResponse.json({ success: true, expenses: formattedExpenses });
  } catch (error) {
    console.error("Failed to fetch expenses:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
