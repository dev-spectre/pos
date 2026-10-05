# POS

A Point of Sale system built with Next.js, Prisma, and Capacitor for mobile deployment.

## Overview

A full-featured POS system for retail businesses, deployable as a web app or mobile app via Capacitor. Handles transactions, products, expenses, and closing reports.

## Features

- **Transaction processing** — sales, returns, and payments
- **Product management** — inventory and pricing
- **Expense tracking** — daily expenses and reports
- **Closing reports** — end-of-day summaries
- **Mobile-ready** — Capacitor for iOS/Android
- **Prisma ORM** — type-safe database access

## Tech Stack

- **Framework:** Next.js
- **Language:** TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Mobile:** Capacitor
- **Styling:** TailwindCSS

## Getting Started

```bash
npm install
npm run dev
```

## Project Structure

```
├── app/                     # Next.js App Router
├── hooks/
│   ├── useTransactions.ts
│   ├── useProducts.ts
│   ├── useClosingReport.ts
│   └── useExpenses.ts
├── prisma/
│   └── schema.prisma        # Database schema
├── capacitor.config.ts      # Capacitor mobile config
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## License

MIT
