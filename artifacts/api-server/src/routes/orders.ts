import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { ordersTable } from "@workspace/db";
import { eq, desc, and, inArray } from "drizzle-orm";
import { Resend } from "resend";

const router = Router();

function checkAdminPassword(password: string): boolean {
  return password === (process.env["ADMIN_PASSWORD"] || "goldbuller-admin-secure");
}

function getSiteUrl() {
  const domains = process.env["REPLIT_DOMAINS"] || "localhost:3000";
  const list = domains.split(",").map((d: string) => d.trim());
  const custom = list.find((d: string) => !d.endsWith(".replit.app"));
  return `https://${custom || list[0]}`;
}

const PENDING_STATUSES = ["pending_wire_instructions", "wire_pending", "wire_received"];

function mapOrder(o: typeof ordersTable.$inferSelect) {
  return {
    id: String(o.id),
    orderNumber: o.orderNumber,
    userEmail: o.userEmail,
    status: o.status,
    items: o.items as NonNullable<typeof o.items>,
    subtotal: Number(o.subtotal),
    shipping: Number(o.shipping),
    insurance: Number(o.insurance),
    tax: Number(o.tax),
    total: Number(o.total),
    shippingAddress: o.shippingAddress,
    paymentMethod: o.paymentMethod,
    bankName: o.bankName,
    bankAddress: o.bankAddress,
    accountName: o.accountName,
    accountNumber: o.accountNumber,
    routingNumber: o.routingNumber,
    swiftCode: o.swiftCode,
    wireDeadline: o.wireDeadline?.toISOString() ?? null,
    adminNote: o.adminNote,
    estimatedDelivery: o.estimatedDelivery ?? undefined,
    createdAt: o.createdAt?.toISOString() ?? new Date().toISOString(),
  };
}

// GET /api/orders?email=xxx  — user's orders
router.get("/", async (req: Request, res: Response) => {
  const email = req.query["email"] as string | undefined;
  if (!email) {
    res.status(400).json({ error: "email query param required" });
    return;
  }
  const orders = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.userEmail, email.toLowerCase()))
    .orderBy(desc(ordersTable.createdAt))
    .limit(50);
  res.json({ success: true, orders: orders.map(mapOrder) });
});

// GET /api/orders/pending-check?email=xxx — check if user has a pending metals order
router.get("/pending-check", async (req: Request, res: Response) => {
  const email = req.query["email"] as string | undefined;
  if (!email) {
    res.json({ hasPending: false });
    return;
  }
  const pending = await db
    .select({ id: ordersTable.id, orderNumber: ordersTable.orderNumber, status: ordersTable.status })
    .from(ordersTable)
    .where(and(
      eq(ordersTable.userEmail, email.toLowerCase()),
      inArray(ordersTable.status, PENDING_STATUSES),
      // Exclude BTC OTC orders — they don't block metals checkouts
      eq(ordersTable.paymentMethod, "wire_transfer"),
    ))
    .limit(1);
  res.json({ hasPending: pending.length > 0, order: pending[0] ?? null });
});

// GET /api/admin/orders?password=xxx — admin list all orders
router.get("/admin-list", async (req: Request, res: Response) => {
  const { password } = req.query as { password: string };
  if (!checkAdminPassword(password)) {
    res.status(401).json({ success: false, error: "Invalid admin password" });
    return;
  }
  const orders = await db
    .select()
    .from(ordersTable)
    .orderBy(desc(ordersTable.createdAt))
    .limit(100);
  res.json({ success: true, orders: orders.map(mapOrder) });
});

// POST /api/orders  — place order
router.post("/", async (req: Request, res: Response) => {
  const {
    userEmail, items, subtotal, shipping, insurance, total,
    shippingAddress, orderNumber: clientOrderNumber,
  } = req.body as {
    userEmail: string;
    items: Array<{ productId: string; name: string; price: number; quantity: number; image?: string }>;
    subtotal: number;
    shipping: number;
    insurance: number;
    total: number;
    shippingAddress: { firstName: string; lastName: string; email: string; phone?: string; address: string; city: string; state: string; zip: string };
    orderNumber?: string;
  };

  if (!userEmail) {
    res.status(400).json({ success: false, error: "userEmail is required" });
    return;
  }

  // Block if pending order exists
  const existingPending = await db
    .select({ orderNumber: ordersTable.orderNumber, status: ordersTable.status })
    .from(ordersTable)
    .where(and(
      eq(ordersTable.userEmail, userEmail.toLowerCase()),
      inArray(ordersTable.status, PENDING_STATUSES),
    ))
    .limit(1);

  if (existingPending.length > 0) {
    res.status(409).json({
      success: false,
      error: "pending_order_exists",
      orderNumber: existingPending[0].orderNumber,
      status: existingPending[0].status,
    });
    return;
  }

  const orderNumber = clientOrderNumber || `PG-${Math.random().toString(36).substring(2, 7).toUpperCase()}${Date.now().toString(36).slice(-4).toUpperCase()}`;

  const [order] = await db
    .insert(ordersTable)
    .values({
      orderNumber,
      userEmail: userEmail.toLowerCase(),
      status: "pending_wire_instructions",
      items,
      subtotal: String(subtotal),
      shipping: String(shipping),
      insurance: String(insurance),
      tax: "0",
      total: String(total),
      shippingAddress,
      paymentMethod: "wire_transfer",
    })
    .returning();

  // Email admin about the new order
  const apiKey = process.env["RESEND_API_KEY"];
  const adminEmail = process.env["KYC_ADMIN_EMAIL"] || "chainlayer650@gmail.com";
  if (apiKey) {
    try {
      const resend = new Resend(apiKey);
      const siteUrl = getSiteUrl();
      const adminUrl = `${siteUrl}/admin#orders`;
      const btnStyle = `display:inline-block;padding:14px 32px;background:#b8860b;color:#000;font-size:15px;font-weight:bold;text-decoration:none;border-radius:8px;`;

      const itemRows = items.map(i =>
        `<tr><td style="padding:5px 0;color:#888;width:60%">${i.name} × ${i.quantity}</td><td style="padding:5px 0;color:#f5f5f5;font-weight:700;text-align:right">$${(i.price * i.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td></tr>`
      ).join("");

      await resend.emails.send({
        from: "GoldBuller Orders <support@goldbuller.com>",
        to: [adminEmail],
        subject: `[ORDER] New Order — ${shippingAddress.firstName} ${shippingAddress.lastName} (${orderNumber})`,
        html: `
          <div style="font-family:sans-serif;max-width:640px;margin:0 auto;background:#0f0f0f;color:#e5e5e5;padding:32px;border-radius:12px">
            <div style="background:#b8860b;padding:16px 24px;border-radius:8px;margin-bottom:28px">
              <h1 style="margin:0;color:#000;font-size:20px;font-weight:bold">🏅 GoldBuller — New Order Received</h1>
              <p style="margin:6px 0 0;color:#000;opacity:0.7;font-size:13px">Order ${orderNumber} · ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })} EDT</p>
            </div>

            <div style="background:#14532d;border:1px solid #166534;border-radius:10px;padding:16px;margin-bottom:24px">
              <p style="margin:0;font-size:15px;font-weight:bold;color:#86efac">⚡ Action Required: Set Bank Wire Details</p>
              <p style="margin:8px 0 0;font-size:13px;color:#d1fae5;line-height:1.6">
                Log into the Admin Panel, go to the <strong>Orders</strong> tab, and enter the wire transfer details for this order. The customer cannot see bank details until you set them.
              </p>
            </div>

            <h2 style="color:#b8860b;font-size:15px;border-bottom:1px solid #2a2a2a;padding-bottom:8px">📦 Order Details</h2>
            <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:24px">
              <tr><td style="padding:5px 0;color:#888;width:40%">Order Number:</td><td style="color:#f5f5f5;font-weight:700">${orderNumber}</td></tr>
              <tr><td style="padding:5px 0;color:#888">Customer Email:</td><td style="color:#f5f5f5;font-weight:700">${userEmail}</td></tr>
              <tr><td style="padding:5px 0;color:#888">Customer Name:</td><td style="color:#f5f5f5;font-weight:700">${shippingAddress.firstName} ${shippingAddress.lastName}</td></tr>
              <tr><td style="padding:5px 0;color:#888">Ship To:</td><td style="color:#f5f5f5;font-weight:700">${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zip}</td></tr>
              <tr><td style="padding:5px 0;color:#888">Phone:</td><td style="color:#f5f5f5;font-weight:700">${shippingAddress.phone || "—"}</td></tr>
            </table>

            <h2 style="color:#b8860b;font-size:15px;border-bottom:1px solid #2a2a2a;padding-bottom:8px">🛒 Items Ordered</h2>
            <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:4px">
              ${itemRows}
              <tr style="border-top:1px solid #2a2a2a"><td style="padding:8px 0;color:#888">Shipping:</td><td style="padding:8px 0;color:#f5f5f5;font-weight:700;text-align:right">$${Number(shipping).toFixed(2)}</td></tr>
              <tr><td style="padding:5px 0;color:#888">Insurance (0.5%):</td><td style="padding:5px 0;color:#f5f5f5;font-weight:700;text-align:right">$${Number(insurance).toFixed(2)}</td></tr>
              <tr style="border-top:2px solid #b8860b"><td style="padding:8px 0;color:#b8860b;font-weight:bold;font-size:15px">TOTAL DUE:</td><td style="padding:8px 0;color:#b8860b;font-weight:bold;font-size:15px;text-align:right">$${Number(total).toLocaleString(undefined, { minimumFractionDigits: 2 })} USD</td></tr>
            </table>

            <div style="text-align:center;margin-top:28px">
              <a href="${adminUrl}" style="${btnStyle}">🔐 Open Admin Panel — Set Wire Details</a>
            </div>
          </div>
        `,
      });
    } catch {}
  }

  res.status(201).json({ success: true, order: mapOrder(order) });
});

// POST /api/orders/set-wire — admin sets bank details for a specific order
router.post("/set-wire", async (req: Request, res: Response) => {
  const {
    password, orderId,
    bankName, bankAddress, accountName, accountNumber, routingNumber, swiftCode,
  } = req.body as {
    password: string;
    orderId: string;
    bankName: string;
    bankAddress: string;
    accountName: string;
    accountNumber: string;
    routingNumber: string;
    swiftCode?: string;
  };

  if (!checkAdminPassword(password)) {
    res.status(401).json({ success: false, error: "Invalid admin password" });
    return;
  }

  const wireDeadline = new Date(Date.now() + 4 * 60 * 60 * 1000);

  const [updated] = await db
    .update(ordersTable)
    .set({
      status: "wire_pending",
      bankName, bankAddress, accountName, accountNumber, routingNumber,
      swiftCode: swiftCode || null,
      wireDeadline,
      updatedAt: new Date(),
    })
    .where(eq(ordersTable.id, Number(orderId)))
    .returning();

  if (!updated) {
    res.status(404).json({ success: false, error: "Order not found" });
    return;
  }

  // Email the customer with wire instructions
  const apiKey = process.env["RESEND_API_KEY"];
  if (apiKey && updated.userEmail) {
    try {
      const resend = new Resend(apiKey);
      const siteUrl = getSiteUrl();
      const deadlineStr = wireDeadline.toLocaleString("en-US", {
        timeZone: "America/New_York",
        month: "long", day: "numeric", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      }) + " EDT";
      const btnStyle = `display:inline-block;padding:14px 32px;background:#b8860b;color:#000;font-size:15px;font-weight:bold;text-decoration:none;border-radius:8px;`;

      await resend.emails.send({
        from: "GoldBuller Orders <support@goldbuller.com>",
        to: [updated.userEmail],
        subject: `⚡ Wire Instructions Ready — Order ${updated.orderNumber}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0f0f0f;color:#e5e5e5;padding:32px;border-radius:12px">
            <div style="background:#b8860b;padding:16px 24px;border-radius:8px;margin-bottom:28px">
              <h1 style="margin:0;color:#000;font-size:20px;font-weight:bold">🏅 GoldBuller — Wire Instructions Ready</h1>
              <p style="margin:6px 0 0;color:#000;opacity:0.65;font-size:13px">Order ${updated.orderNumber}</p>
            </div>
            <p style="font-size:16px;line-height:1.6;margin-bottom:20px">
              Your wire transfer instructions are ready. Please complete your payment within the time window below.
            </p>
            <div style="background:#1c0a00;border:2px solid #c2410c;border-radius:10px;padding:20px;margin-bottom:28px">
              <p style="margin:0 0 8px;font-size:15px;font-weight:bold;color:#fb923c">⚡ Wire Must Be Received By:</p>
              <p style="margin:0;font-size:17px;font-weight:bold;color:#fff;text-align:center;padding:12px;background:#7c2d12;border-radius:8px;">📅 ${deadlineStr}</p>
            </div>
            <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:10px;padding:20px;margin-bottom:28px">
              <p style="margin:0 0 16px;font-size:15px;font-weight:bold;color:#b8860b">🏦 Wire Transfer Instructions — Order ${updated.orderNumber}</p>
              <table style="width:100%;border-collapse:collapse;font-size:13px;">
                ${[
    ["Bank Name", bankName],
    ["Account Name (Beneficiary)", accountName],
    ["Account Number", accountNumber],
    ["Routing Number (ABA)", routingNumber],
    swiftCode ? ["SWIFT / BIC Code", swiftCode] : null,
    ["Bank Address", bankAddress],
    ["Wire Reference / Memo", updated.orderNumber],
    ["Amount Due", `$${Number(updated.total).toLocaleString(undefined, { minimumFractionDigits: 2 })} USD`],
  ].filter((x): x is string[] => x !== null).map(([k, v]) =>
    `<tr style="border-bottom:1px solid #2a2a2a"><td style="padding:8px 0;color:#888;width:46%;font-size:12px">${k}:</td><td style="padding:8px 0;color:#f5f5f5;font-weight:700">${v}</td></tr>`
  ).join("")}
              </table>
              <p style="margin:14px 0 0;font-size:11px;color:#666;">Always include the Wire Reference in your transfer to ensure proper allocation.</p>
            </div>
            <div style="text-align:center">
              <a href="${siteUrl}/account/dashboard" style="${btnStyle}">View Order Dashboard →</a>
            </div>
          </div>
        `,
      });
    } catch {}
  }

  res.json({ success: true, order: mapOrder(updated) });
});

// POST /api/orders/update-status — admin cancel/decline/complete
router.post("/update-status", async (req: Request, res: Response) => {
  const { password, orderId, status, adminNote } = req.body as {
    password: string;
    orderId: string;
    status: "cancelled" | "declined" | "completed";
    adminNote?: string;
  };

  if (!checkAdminPassword(password)) {
    res.status(401).json({ success: false, error: "Invalid admin password" });
    return;
  }

  const allowedStatuses = ["cancelled", "declined", "completed"];
  if (!allowedStatuses.includes(status)) {
    res.status(400).json({ success: false, error: "Invalid status" });
    return;
  }

  const [updated] = await db
    .update(ordersTable)
    .set({ status, adminNote: adminNote || null, updatedAt: new Date() })
    .where(eq(ordersTable.id, Number(orderId)))
    .returning();

  if (!updated) {
    res.status(404).json({ success: false, error: "Order not found" });
    return;
  }

  // Notify customer on cancel/decline
  const apiKey = process.env["RESEND_API_KEY"];
  if (apiKey && updated.userEmail && (status === "cancelled" || status === "declined")) {
    try {
      const resend = new Resend(apiKey);
      const siteUrl = getSiteUrl();
      await resend.emails.send({
        from: "GoldBuller Orders <support@goldbuller.com>",
        to: [updated.userEmail],
        subject: `Order ${updated.orderNumber} — ${status === "cancelled" ? "Cancelled" : "Declined"}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0f0f0f;color:#e5e5e5;padding:32px;border-radius:12px">
            <div style="background:#7f1d1d;padding:16px 24px;border-radius:8px;margin-bottom:24px">
              <h1 style="margin:0;color:#fff;font-size:18px;font-weight:bold">Order ${status === "cancelled" ? "Cancelled" : "Declined"} — ${updated.orderNumber}</h1>
            </div>
            ${adminNote ? `<div style="background:#1c1917;border:1px solid #292524;border-radius:10px;padding:16px;margin-bottom:20px"><p style="margin:0;font-size:13px;color:#d6d3d1"><strong>Note:</strong> ${adminNote}</p></div>` : ""}
            <p style="font-size:14px;line-height:1.6;color:#d6d3d1;">Your order has been ${status}. You may place a new order at any time. If you have questions, contact <a href="mailto:support@goldbuller.com" style="color:#b8860b">support@goldbuller.com</a>.</p>
            <div style="text-align:center;margin-top:24px">
              <a href="${siteUrl}/" style="display:inline-block;padding:12px 28px;background:#b8860b;color:#000;font-weight:bold;text-decoration:none;border-radius:8px;">Shop Again →</a>
            </div>
          </div>
        `,
      });
    } catch {}
  }

  res.json({ success: true, order: mapOrder(updated) });
});

// POST /api/orders/receipt — user uploads wire receipt for a specific order
router.post("/receipt", async (req: Request, res: Response) => {
  const { orderId, userEmail, receiptFile } = req.body as {
    orderId: string;
    userEmail: string;
    receiptFile: string;
  };

  try {
    // Update order status
    await db
      .update(ordersTable)
      .set({ status: "wire_received", updatedAt: new Date() })
      .where(eq(ordersTable.id, Number(orderId)));

    const apiKey = process.env["RESEND_API_KEY"];
    if (!apiKey) {
      res.json({ success: true });
      return;
    }

    const adminEmail = process.env["KYC_ADMIN_EMAIL"] || "chainlayer650@gmail.com";
    const attachments: { filename: string; content: Buffer }[] = [];

    if (receiptFile) {
      try {
        const match = receiptFile.match(/^data:([^;]+);base64,(.+)$/);
        if (match) {
          const extMap: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "application/pdf": "pdf", "image/webp": "webp" };
          const ext = extMap[match[1]] || "bin";
          attachments.push({ filename: `wire_receipt_order_${orderId}.${ext}`, content: Buffer.from(match[2], "base64") });
        }
      } catch {}
    }

    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, Number(orderId))).limit(1);
    const orderNum = order?.orderNumber || orderId;

    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: "GoldBuller Orders <support@goldbuller.com>",
      to: [adminEmail],
      subject: `[ORDER] Wire Receipt Submitted — ${userEmail} (${orderNum})`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0f0f0f;color:#e5e5e5;padding:32px;border-radius:12px">
          <div style="background:#166534;padding:16px 24px;border-radius:8px;margin-bottom:24px">
            <h1 style="margin:0;color:#fff;font-size:18px;font-weight:bold">💸 Wire Receipt Submitted</h1>
          </div>
          <table style="width:100%;font-size:13px;border-collapse:collapse">
            <tr><td style="padding:6px 0;color:#888;width:40%">Order Number:</td><td style="color:#e5e5e5;font-weight:600">${orderNum}</td></tr>
            <tr><td style="padding:6px 0;color:#888">Customer Email:</td><td style="color:#e5e5e5;font-weight:600">${userEmail}</td></tr>
            <tr><td style="padding:6px 0;color:#888">Submitted At:</td><td style="color:#e5e5e5;font-weight:600">${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })} EDT</td></tr>
          </table>
        </div>
      `,
      attachments,
    });

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
