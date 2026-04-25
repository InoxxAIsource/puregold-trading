import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { ordersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

const router = Router();

function mapOrder(o: typeof ordersTable.$inferSelect) {
  return {
    id: String(o.id),
    orderNumber: o.orderNumber,
    status: o.status,
    items: (o.items as NonNullable<typeof o.items>),
    subtotal: Number(o.subtotal),
    shipping: Number(o.shipping),
    tax: Number(o.tax),
    total: Number(o.total),
    shippingAddress: o.shippingAddress,
    createdAt: o.createdAt?.toISOString() ?? new Date().toISOString(),
    estimatedDelivery: o.estimatedDelivery ?? undefined,
  };
}

router.get("/", async (req: Request, res: Response) => {
  const orders = await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt)).limit(50);
  res.json(orders.map(mapOrder));
});

router.post("/", async (req: Request, res: Response) => {
  const { items, shippingAddress, paymentMethod } = req.body as {
    items: Array<{ productId: string; quantity: number }>;
    shippingAddress: { name: string; address1: string; city: string; state: string; zip: string; country?: string };
    paymentMethod: string;
  };

  const subtotal = 4967.32 * (items?.[0]?.quantity ?? 1);
  const shipping = subtotal >= 499 ? 0 : 9.95;
  const tax = 0;
  const total = subtotal + shipping + tax;
  const orderNumber = `PG-${Date.now().toString(36).toUpperCase()}-${randomUUID().slice(0, 6).toUpperCase()}`;

  const [order] = await db
    .insert(ordersTable)
    .values({
      orderNumber,
      status: "pending",
      items: items.map((i) => ({
        productId: i.productId,
        name: "Product",
        price: subtotal / (items.length * i.quantity),
        quantity: i.quantity,
      })),
      subtotal: String(Math.round(subtotal * 100) / 100),
      shipping: String(shipping),
      tax: String(tax),
      total: String(Math.round(total * 100) / 100),
      shippingAddress: { ...shippingAddress, country: shippingAddress.country ?? "US" },
      paymentMethod: paymentMethod ?? "credit_card",
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    })
    .returning();

  res.status(201).json(mapOrder(order));
});

router.get("/:id", async (req: Request, res: Response) => {
  const order = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.id, Number(req.params.id)))
    .limit(1);

  if (!order[0]) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json(mapOrder(order[0]));
});

export default router;
