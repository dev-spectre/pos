import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reports } = body as { 
      reports: { 
        id: string; 
        date: string; 
        archivedAt: number;
        openingCash: number;
        totalExpenses: number;
        netProfit: number;
        transactionCount: number;
        summary: {
          totalSales: number;
          cashSales: number;
          upiSales: number;
          cardSales: number;
          totalItems: number;
        }
      }[] 
    };

    if (!reports || !Array.isArray(reports) || reports.length === 0) {
      return NextResponse.json(
        { message: "No reports to sync" },
        { status: 400 }
      );
    }

    const results = await prisma.$transaction(
      reports.map((report) =>
        prisma.dailyReport.upsert({
          where: { id: report.id },
          create: {
            id: report.id,
            date: report.date,
            archivedAt: report.archivedAt,
            openingCash: report.openingCash,
            totalSales: report.summary.totalSales,
            cashSales: report.summary.cashSales,
            upiSales: report.summary.upiSales,
            cardSales: report.summary.cardSales,
            totalItems: report.summary.totalItems,
            totalExpenses: report.totalExpenses,
            netProfit: report.netProfit,
            transactionCount: report.transactionCount,
          },
          update: {
            date: report.date,
            archivedAt: report.archivedAt,
            openingCash: report.openingCash,
            totalSales: report.summary.totalSales,
            cashSales: report.summary.cashSales,
            upiSales: report.summary.upiSales,
            cardSales: report.summary.cardSales,
            totalItems: report.summary.totalItems,
            totalExpenses: report.totalExpenses,
            netProfit: report.netProfit,
            transactionCount: report.transactionCount,
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
    console.error("Failed to sync reports:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const reports = await prisma.dailyReport.findMany({
      orderBy: { archivedAt: 'desc' },
      take: 100
    });
    
    const formattedReports = reports.map(r => ({
      id: r.id,
      date: r.date,
      archivedAt: r.archivedAt,
      openingCash: r.openingCash,
      totalExpenses: r.totalExpenses,
      netProfit: r.netProfit,
      transactionCount: r.transactionCount,
      summary: {
        totalSales: r.totalSales,
        cashSales: r.cashSales,
        upiSales: r.upiSales,
        cardSales: r.cardSales,
        totalItems: r.totalItems,
      },
      syncStatus: "synced"
    }));

    return NextResponse.json({ success: true, reports: formattedReports });
  } catch (error) {
    console.error("Failed to fetch reports:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
