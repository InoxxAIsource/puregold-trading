import { Router } from "express";

const router = Router();

// ─── In-memory reply store ───────────────────────────────────────────────────
// sessionId (8-char uppercase) → [{text, ts}]
const replyStore = new Map<string, Array<{ text: string; ts: number }>>();

// Prune sessions older than 24 hours every 30 minutes
setInterval(() => {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  for (const [id, replies] of replyStore.entries()) {
    if (!replies.length || replies[replies.length - 1].ts < cutoff) {
      replyStore.delete(id);
    }
  }
}, 30 * 60 * 1000);

// ─── Webhook registration ────────────────────────────────────────────────────
function getSiteUrl(): string {
  const domains = process.env["REPLIT_DOMAINS"] || "";
  const list = domains.split(",").map((d) => d.trim()).filter(Boolean);
  const custom = list.find((d) => !d.endsWith(".replit.app"));
  return `https://${custom || list[0] || "localhost"}`;
}

async function registerWebhook(token: string) {
  const url = `${getSiteUrl()}/api/chat/webhook`;
  const r = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, drop_pending_updates: true }),
  });
  const d = (await r.json()) as { ok: boolean; description?: string };
  if (d.ok) {
    console.log(`[chat] Telegram webhook registered → ${url}`);
  } else {
    console.error("[chat] Webhook registration failed:", d.description);
  }
}

// Register on startup (non-blocking)
const _token = process.env["TELEGRAM_BOT_TOKEN"];
if (_token) registerWebhook(_token).catch(() => {});

// ─── POST /api/chat/webhook ──────────────────────────────────────────────────
// Receives messages admin sends to the bot in Telegram
// Admin format:  /r SESSIONID  reply text here
router.post("/chat/webhook", (req, res) => {
  // Acknowledge immediately
  res.json({ ok: true });

  const msg = req.body?.message;
  if (!msg?.text) return;

  const text: string = msg.text.trim();
  // Match: /r <8-char session id> <reply text>
  const m = text.match(/^\/r\s+([A-Z0-9]{8})\s+([\s\S]+)$/i);
  if (!m) return;

  const sessionId = m[1].toUpperCase();
  const replyText = m[2].trim();

  if (!replyStore.has(sessionId)) replyStore.set(sessionId, []);
  replyStore.get(sessionId)!.push({ text: replyText, ts: Date.now() });
});

// ─── GET /api/chat/replies ───────────────────────────────────────────────────
// Polled by frontend every 3s. Returns replies newer than ?after= timestamp.
router.get("/chat/replies", (req, res) => {
  const sessionId = ((req.query["sessionId"] as string) || "").toUpperCase();
  const after = Number(req.query["after"] || 0);

  if (!sessionId) {
    res.status(400).json({ success: false, error: "sessionId required" });
    return;
  }

  const replies = (replyStore.get(sessionId) || []).filter((r) => r.ts > after);
  res.json({ success: true, replies });
});

// ─── POST /api/chat/send ─────────────────────────────────────────────────────
router.post("/chat/send", async (req, res) => {
  try {
    const { message, name, email, page, sessionId } = req.body as {
      message?: string;
      name?: string;
      email?: string;
      page?: string;
      sessionId?: string;
    };

    if (!message?.trim()) {
      res.status(400).json({ success: false, error: "Message is required" });
      return;
    }

    const botToken = process.env["TELEGRAM_BOT_TOKEN"];
    const chatId = process.env["TELEGRAM_CHAT_ID"];

    if (!botToken || !chatId) {
      req.log.error("TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not configured");
      res.status(500).json({ success: false, error: "Chat service not configured" });
      return;
    }

    const sid = (sessionId || "").toUpperCase();
    // Ensure session exists in store so replies can be posted
    if (sid && !replyStore.has(sid)) replyStore.set(sid, []);

    const now = new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const visitorLine = name?.trim()
      ? `👤 *${name.trim()}*${email?.trim() ? ` — ${email.trim()}` : ""}`
      : `👤 Anonymous visitor${email?.trim() ? ` — ${email.trim()}` : ""}`;

    const lines = [
      `💬 *New GoldBuller Chat Message*`,
      ``,
      visitorLine,
      page ? `📍 Page: \`${page}\`` : null,
      `🕐 ${now} ET`,
      ``,
      `💬 "${message.trim()}"`,
      ``,
      sid ? `↩️ To reply, send:\n\`/r ${sid} your reply here\`` : null,
    ].filter((l) => l !== null);

    const tgRes = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: lines.join("\n"),
          parse_mode: "Markdown",
        }),
      }
    );

    const tgData = (await tgRes.json()) as { ok: boolean; description?: string };

    if (!tgData.ok) {
      req.log.error({ tgData }, "Telegram API error");
      res.status(500).json({ success: false, error: "Failed to deliver message" });
      return;
    }

    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Chat send error");
    res.status(500).json({ success: false, error: "Internal error" });
  }
});

export default router;
