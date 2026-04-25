import { pgTable, text, serial, numeric, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  year: integer("year"),
  mint: text("mint"),
  metalType: text("metal_type").notNull(),
  purity: text("purity"),
  weight: numeric("weight", { precision: 10, scale: 4 }).notNull(),
  weightUnit: text("weight_unit").notNull().default("oz"),
  spotPrice: numeric("spot_price", { precision: 10, scale: 2 }),
  premiumPct: numeric("premium_pct", { precision: 6, scale: 2 }),
  premiumAmt: numeric("premium_amt", { precision: 10, scale: 2 }),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  msrp: numeric("msrp", { precision: 10, scale: 2 }),
  inStock: boolean("in_stock").notNull().default(true),
  stockQty: integer("stock_qty").default(100),
  lowStockThreshold: integer("low_stock_threshold").default(10),
  isOnSale: boolean("is_on_sale").default(false),
  saleLabel: text("sale_label"),
  isFeatured: boolean("is_featured").default(false),
  isNew: boolean("is_new").default(false),
  isIRAEligible: boolean("is_ira_eligible").default(false),
  isNumismatic: boolean("is_numismatic").default(false),
  isPreOrder: boolean("is_pre_order").default(false),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  shortDescription: text("short_description"),
  description: text("description"),
  category: text("category").notNull(),
  rating: numeric("rating", { precision: 3, scale: 2 }).default("4.8"),
  reviewCount: integer("review_count").default(0),
  specifications: jsonb("specifications").$type<{
    diameter?: string;
    thickness?: string;
    edgeType?: string;
    designer?: string;
    obverse?: string;
    reverse?: string;
  }>(),
  grades: jsonb("grades").$type<string[]>(),
  mintCertification: text("mint_certification"),
  assayCertificate: boolean("assay_certificate").default(false),
  shippingClass: text("shipping_class").default("standard"),
  relatedProductIds: jsonb("related_product_ids").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
