import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { productsTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";

const router = Router();

router.get("/summary", async (req: Request, res: Response) => {
  const [inStockCount, onSaleCount] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)` })
      .from(productsTable)
      .where(eq(productsTable.inStock, true)),
    db
      .select({ count: sql<number>`count(*)` })
      .from(productsTable)
      .where(eq(productsTable.isOnSale, true)),
  ]);

  res.json({
    totalProductsSold: "1,847,293",
    totalRevenue: "$8B+",
    totalCustomers: "320,000+",
    totalReviews: "200,000+",
    averageRating: 4.9,
    goldPrice: 4735.48,
    silverPrice: 76.42,
    productsInStock: Number(inStockCount[0]?.count ?? 0),
    onSaleCount: Number(onSaleCount[0]?.count ?? 0),
  });
});

export default router;
