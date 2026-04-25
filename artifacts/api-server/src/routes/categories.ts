import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { productsTable } from "@workspace/db";
import { sql, eq } from "drizzle-orm";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const counts = await db
    .select({
      category: productsTable.category,
      metalType: productsTable.metalType,
      count: sql<number>`count(*)`,
    })
    .from(productsTable)
    .groupBy(productsTable.category, productsTable.metalType);

  const categories = counts.map((c, idx) => ({
    id: String(idx + 1),
    name: c.category,
    slug: c.category.toLowerCase().replace(/\s+/g, "-"),
    metal: c.metalType,
    productCount: Number(c.count),
    description: `Shop our selection of ${c.category} products`,
  }));

  res.json(categories);
});

export default router;
