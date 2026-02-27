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

    const results = await prisma.$transaction(
      expenses.map((exp) =>
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
          update: {
            // Usually we wouldn't update existing expenses unless edited,
            // upsert handles accidental double-submissions gracefully.
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
    console.error("Failed to sync expenses:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
