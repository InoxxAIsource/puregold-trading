import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { productsTable } from "@workspace/db";
import { eq, and, gte, lte, ilike, or, desc, asc, sql } from "drizzle-orm";

const router = Router();

function buildProductFilters(query: Record<string, unknown>) {
  const conditions = [];

  if (query.metal) {
    conditions.push(eq(productsTable.metalType, query.metal as string));
  }
  if (query.category) {
    conditions.push(ilike(productsTable.category, `%${query.category}%`));
  }
  if (query.mint) {
    conditions.push(ilike(productsTable.mint, `%${query.mint}%`));
  }
  if (query.minPrice) {
    conditions.push(gte(productsTable.price, String(query.minPrice)));
  }
  if (query.maxPrice) {
    conditions.push(lte(productsTable.price, String(query.maxPrice)));
  }
  if (query.inStock === "true" || query.inStock === true) {
    conditions.push(eq(productsTable.inStock, true));
  }
  if (query.isIRAEligible === "true" || query.isIRAEligible === true) {
    conditions.push(eq(productsTable.isIRAEligible, true));
  }
  if (query.isOnSale === "true" || query.isOnSale === true) {
    conditions.push(eq(productsTable.isOnSale, true));
  }
  if (query.isNew === "true" || query.isNew === true) {
    conditions.push(eq(productsTable.isNew, true));
  }
  if (query.isFeatured === "true" || query.isFeatured === true) {
    conditions.push(eq(productsTable.isFeatured, true));
  }

  return conditions;
}

function mapProduct(p: typeof productsTable.$inferSelect) {
  return {
    id: String(p.id),
    slug: p.slug,
    name: p.name,
    year: p.year ?? undefined,
    mint: p.mint ?? undefined,
    metalType: p.metalType,
    purity: p.purity ?? undefined,
    weight: Number(p.weight),
    weightUnit: p.weightUnit,
    spotPrice: p.spotPrice ? Number(p.spotPrice) : undefined,
    premiumPct: p.premiumPct ? Number(p.premiumPct) : undefined,
    premiumAmt: p.premiumAmt ? Number(p.premiumAmt) : undefined,
    price: Number(p.price),
    msrp: p.msrp ? Number(p.msrp) : undefined,
    inStock: p.inStock,
    stockQty: p.stockQty ?? undefined,
    isOnSale: p.isOnSale ?? false,
    saleLabel: p.saleLabel ?? undefined,
    isFeatured: p.isFeatured ?? false,
    isNew: p.isNew ?? false,
    isIRAEligible: p.isIRAEligible ?? false,
    isNumismatic: p.isNumismatic ?? false,
    isPreOrder: p.isPreOrder ?? false,
    images: (p.images as string[]) ?? [],
    shortDescription: p.shortDescription ?? undefined,
    category: p.category,
    rating: p.rating ? Number(p.rating) : undefined,
    reviewCount: p.reviewCount ?? 0,
  };
}

function mapProductDetail(p: typeof productsTable.$inferSelect) {
  return {
    ...mapProduct(p),
    description: p.description ?? undefined,
    specifications: p.specifications ?? undefined,
    grades: (p.grades as string[]) ?? undefined,
    mintCertification: p.mintCertification ?? undefined,
    assayCertificate: p.assayCertificate ?? false,
    shippingClass: p.shippingClass ?? "standard",
    relatedProductIds: (p.relatedProductIds as string[]) ?? [],
  };
}

router.get("/", async (req: Request, res: Response) => {
  const conditions = buildProductFilters(req.query);
  const limit = Math.min(Number(req.query.limit) || 40, 500);
  const offset = Number(req.query.offset) || 0;

  let orderBy;
  const sort = req.query.sortBy as string;
  if (sort === "price_asc") orderBy = asc(productsTable.price);
  else if (sort === "price_desc") orderBy = desc(productsTable.price);
  else if (sort === "newest") orderBy = desc(productsTable.createdAt);
  else if (sort === "highest_rated") orderBy = desc(productsTable.rating);
  else if (sort === "premium_asc") orderBy = asc(productsTable.premiumPct);
  else orderBy = desc(productsTable.isFeatured);

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [products, countResult] = await Promise.all([
    db.select().from(productsTable).where(whereClause).orderBy(orderBy).limit(limit).offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(productsTable).where(whereClause),
  ]);

  res.json({
    products: products.map(mapProduct),
    total: Number(countResult[0]?.count ?? 0),
    offset,
    limit,
  });
});

router.get("/featured", async (req: Request, res: Response) => {
  const products = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.isFeatured, true))
    .limit(12);
  res.json(products.map(mapProduct));
});

router.get("/best-sellers", async (req: Request, res: Response) => {
  const limit = Number(req.query.limit) || 12;
  const conditions = [];
  if (req.query.metal) {
    conditions.push(eq(productsTable.metalType, req.query.metal as string));
  }
  const products = await db
    .select()
    .from(productsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(productsTable.reviewCount))
    .limit(limit);
  res.json(products.map(mapProduct));
});

router.get("/on-sale", async (req: Request, res: Response) => {
  const products = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.isOnSale, true))
    .limit(24);
  res.json(products.map(mapProduct));
});

router.get("/new-arrivals", async (req: Request, res: Response) => {
  const products = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.isNew, true))
    .orderBy(desc(productsTable.createdAt))
    .limit(24);
  res.json(products.map(mapProduct));
});

router.get("/:slug/related", async (req: Request, res: Response) => {
  const product = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.slug, String(req.params.slug)))
    .limit(1);

  if (!product[0]) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const relatedIds = (product[0].relatedProductIds as string[]) ?? [];
  let related;
  if (relatedIds.length > 0) {
    related = await db
      .select()
      .from(productsTable)
      .where(
        or(...relatedIds.map((id) => eq(productsTable.slug, id)))
      )
      .limit(4);
  } else {
    related = await db
      .select()
      .from(productsTable)
      .where(
        and(
          eq(productsTable.metalType, product[0].metalType),
          sql`${productsTable.slug} != ${product[0].slug}`
        )
      )
      .limit(4);
  }
  res.json(related.map(mapProduct));
});

router.get("/:slug", async (req: Request, res: Response) => {
  const product = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.slug, String(req.params.slug)))
    .limit(1);

  if (!product[0]) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json(mapProductDetail(product[0]));
});

export default router;
