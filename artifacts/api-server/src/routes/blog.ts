import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { blogPostsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

function mapPost(p: typeof blogPostsTable.$inferSelect) {
  return {
    id: String(p.id),
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    content: p.content ?? undefined,
    author: p.author ?? "PureGold Editorial Team",
    category: p.category ?? "Market Insights",
    tags: (p.tags as string[]) ?? [],
    publishedAt: p.publishedAt?.toISOString() ?? new Date().toISOString(),
    readTime: p.readTime ?? 5,
    image: p.image ?? undefined,
  };
}

router.get("/posts", async (req: Request, res: Response) => {
  const limit = Number(req.query.limit) || 10;
  const offset = Number(req.query.offset) || 0;
  const posts = await db
    .select()
    .from(blogPostsTable)
    .orderBy(desc(blogPostsTable.publishedAt))
    .limit(limit)
    .offset(offset);
  res.json(posts.map(mapPost));
});

router.get("/posts/:slug", async (req: Request, res: Response) => {
  const post = await db
    .select()
    .from(blogPostsTable)
    .where(eq(blogPostsTable.slug, req.params.slug))
    .limit(1);

  if (!post[0]) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  res.json(mapPost(post[0]));
});

export default router;
