import { Router } from "express";

const router = Router();

// POST /api/chat/send
router.post("/chat/send", async (req, res) => {
  try {
    const { message, name, email, page } = req.body as {
      message?: string;
      name?: string;
      email?: string;
      page?: string;
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

    const text = [
      `💬 *New GoldBuller Chat Message*`,
      ``,
      visitorLine,
      page ? `📍 Page: ${page}` : null,
      `🕐 ${now} ET`,
      ``,
      `💬 "${message.trim()}"`,
    ]
      .filter((l) => l !== null)
      .join("\n");

    const tgRes = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
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
