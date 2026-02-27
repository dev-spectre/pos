import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Transaction } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { transactions } = body as { transactions: Transaction[] };

    if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
      return NextResponse.json(
        { message: "No transactions to sync" },
        { status: 400 }
      );
    }

    const results = await prisma.$transaction(
      transactions.map((tx) =>
        prisma.transaction.upsert({
          where: { id: tx.id },
          create: {
            id: tx.id,
            date: tx.date,
            timestamp: tx.timestamp,
            total: tx.total,
            paymentMode: tx.paymentMode,
            items: {
              create: tx.items.map((item) => ({
                id: crypto.randomUUID(), 
                productName: item.productName,
                price: item.price,
                quantity: item.quantity,
                subtotal: item.subtotal,
                product: {
                  connectOrCreate: {
                    where: { id: item.productId },
                    create: {
                      id: item.productId,
                      name: item.productName,
                      price: item.price,
                      active: true,
                      orderFrequency: 0,
                      category: {
                        connectOrCreate: {
                          where: { id: "uncategorized" },
                          create: {
                            id: "uncategorized",
                            name: "Uncategorized",
                            isDefault: true,
                          }
                        }
                      }
                    }
                  }
                }
              })),
            },
          },
          update: {
            // Usually we wouldn't update existing transactions,
            // but upsert prevents errors on accidental double-submissions
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
    console.error("Failed to sync transactions:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
