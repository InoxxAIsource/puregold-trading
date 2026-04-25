import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { productsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

// In-memory cart per session (keyed by session id from cookie or header)
const carts = new Map<string, Array<{ productId: string; quantity: number }>>();

function getSessionId(req: Request): string {
  const sid = req.cookies?.["session_id"] ?? req.headers["x-session-id"] ?? "default";
  return String(sid);
}

async function buildCartResponse(items: Array<{ productId: string; quantity: number }>) {
  if (items.length === 0) {
    return { items: [], subtotal: 0, totalItems: 0 };
  }

  const productDetails = await Promise.all(
    items.map(async (item) => {
      const products = await db
        .select()
        .from(productsTable)
        .where(eq(productsTable.slug, item.productId))
        .limit(1);
      const p = products[0];
      if (!p) return null;
      return {
        productId: item.productId,
        slug: p.slug,
        name: p.name,
        price: Number(p.price),
        quantity: item.quantity,
        image: ((p.images as string[]) ?? [])[0] ?? "",
        metalType: p.metalType,
        weight: Number(p.weight),
        weightUnit: p.weightUnit,
      };
    })
  );

  const validItems = productDetails.filter(Boolean) as NonNullable<typeof productDetails[0]>[];
  const subtotal = validItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = validItems.reduce((sum, item) => sum + item.quantity, 0);

  return { items: validItems, subtotal: Math.round(subtotal * 100) / 100, totalItems };
}

router.get("/", async (req: Request, res: Response) => {
  const sid = getSessionId(req);
  const items = carts.get(sid) ?? [];
  res.json(await buildCartResponse(items));
});

router.post("/", async (req: Request, res: Response) => {
  const sid = getSessionId(req);
  const { productId, quantity = 1 } = req.body as { productId: string; quantity?: number };
  const items = carts.get(sid) ?? [];
  const existing = items.find((i) => i.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({ productId, quantity });
  }
  carts.set(sid, items);
  res.json(await buildCartResponse(items));
});

router.put("/:productId", async (req: Request, res: Response) => {
  const sid = getSessionId(req);
  const { quantity } = req.body as { quantity: number };
  const items = carts.get(sid) ?? [];
  const idx = items.findIndex((i) => i.productId === req.params.productId);
  if (idx >= 0) {
    if (quantity <= 0) {
      items.splice(idx, 1);
    } else {
      items[idx].quantity = quantity;
    }
  }
  carts.set(sid, items);
  res.json(await buildCartResponse(items));
});

router.delete("/:productId", async (req: Request, res: Response) => {
  const sid = getSessionId(req);
  const items = (carts.get(sid) ?? []).filter((i) => i.productId !== req.params.productId);
  carts.set(sid, items);
  res.json(await buildCartResponse(items));
});

export default router;
