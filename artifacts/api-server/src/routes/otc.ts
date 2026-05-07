import { Router } from "express";
import { Resend } from "resend";

const router = Router();

function getSiteUrl() {
  const domains = process.env["REPLIT_DOMAINS"] || "localhost:3000";
  const list = domains.split(",").map((d: string) => d.trim());
  const custom = list.find((d: string) => !d.endsWith(".replit.app"));
  return `https://${custom || list[0]}`;
}

// POST /api/otc/submit — notify admin of a new BTC OTC order
router.post("/otc/submit", async (req, res) => {
  try {
    const {
      id, userEmail, userName,
      btcAmount, usdTotal, spotPrice, spread,
      walletAddress, settlementType, settlementTimeline,
      bankName, bankAccountLast4, bankCountry,
      purpose, notes, submittedAt,
    } = req.body as {
      id: string;
      userEmail: string;
      userName?: string;
      btcAmount: number;
      usdTotal: number;
      spotPrice: number;
      spread: number;
      walletAddress: string;
      settlementType: string;
      settlementTimeline: string;
      bankName: string;
      bankAccountLast4: string;
      bankCountry: string;
      purpose: string;
      notes?: string;
      submittedAt: string;
    };

    if (!id || !userEmail || !btcAmount || !usdTotal || !walletAddress) {
      res.status(400).json({ success: false, error: "Missing required fields." });
      return;
    }

    const apiKey = process.env["RESEND_API_KEY"];
    if (!apiKey) {
      // Email not configured — still return success so the order is saved locally
      res.json({ success: true, message: "Order received (email not configured)." });
      return;
    }

    const adminEmail = process.env["KYC_ADMIN_EMAIL"] || "chainlayer650@gmail.com";
    const siteUrl = getSiteUrl();
    const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const submittedDate = new Date(submittedAt).toLocaleString("en-US", {
      timeZone: "America/New_York",
      month: "long", day: "numeric", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    }) + " EDT";

    const timelineLabel = settlementTimeline === "priority"
      ? "Priority — within 4 hrs of wire clearance (+0.25%)"
      : "Standard — within 24 hrs of wire clearance";

    const adminPanelUrl = `${siteUrl}/admin`;
    const btnStyle = `display:inline-block;padding:14px 32px;background:#b8860b;color:#000;font-size:15px;font-weight:bold;text-decoration:none;border-radius:8px;letter-spacing:0.5px;`;

    const rows = (pairs: [string, string][]) =>
      pairs.map(([k, v]) => `
        <tr style="border-bottom:1px solid #1f1f1f">
          <td style="padding:8px 0;color:#888;width:46%;font-size:12px;vertical-align:top">${k}:</td>
          <td style="padding:8px 0;color:#f5f5f5;font-weight:700;font-size:13px">${v}</td>
        </tr>
      `).join("");

    const html = `
      <div style="font-family:sans-serif;max-width:640px;margin:0 auto;background:#0f0f0f;color:#e5e5e5;padding:32px;border-radius:12px">

        <div style="background:#b8860b;padding:16px 24px;border-radius:8px;margin-bottom:28px">
          <h1 style="margin:0;color:#000;font-size:20px;font-weight:bold">₿ GoldBuller — New BTC OTC Order</h1>
          <p style="margin:6px 0 0;color:#000;opacity:0.65;font-size:13px">
            Order ${id} &nbsp;·&nbsp; ${submittedDate}
          </p>
        </div>

        <div style="background:#1c0a00;border:2px solid #c2410c;border-radius:10px;padding:20px;margin-bottom:28px">
          <p style="margin:0;font-size:16px;font-weight:bold;color:#fb923c">⚡ Action Required — Send Wire Instructions to Customer</p>
          <p style="margin:8px 0 0;font-size:13px;color:#fed7aa;line-height:1.6">
            A verified customer has submitted a Bitcoin OTC purchase application.
            Please send personalised wire instructions to <strong style="color:#fff">${userEmail}</strong> as soon as possible.
          </p>
        </div>

        <h2 style="color:#b8860b;font-size:15px;border-bottom:1px solid #2a2a2a;padding-bottom:8px;margin-top:0">₿ Order Details</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
          ${rows([
            ["Order ID", id],
            ["BTC Amount", `${Number(btcAmount).toFixed(4)} BTC`],
            ["USD Total", `$${fmt(usdTotal)} USD`],
            ["Spot Price at Submission", `$${fmt(spotPrice)}`],
            ["Desk Spread", `+${(Number(spread) * 100).toFixed(2)}%`],
            ["Settlement Type", settlementType],
            ["Settlement Timeline", timelineLabel],
            ["Purpose", purpose],
          ])}
        </table>

        <h2 style="color:#b8860b;font-size:15px;border-bottom:1px solid #2a2a2a;padding-bottom:8px">👤 Customer</h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
          ${rows([
            ["Name", userName || "—"],
            ["Email", userEmail],
            ["BTC Wallet", walletAddress],
            ["Customer's Bank", bankName],
            ["Bank Account Last 4", bankAccountLast4 || "—"],
            ["Bank Country", bankCountry],
          ])}
        </table>

        ${notes ? `
        <h2 style="color:#b8860b;font-size:15px;border-bottom:1px solid #2a2a2a;padding-bottom:8px">📝 Notes from Customer</h2>
        <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;padding:16px;margin-bottom:24px;font-size:13px;color:#d5d5d5;line-height:1.6">
          ${notes}
        </div>` : ""}

        <div style="text-align:center;margin-bottom:28px;padding:20px;background:#1a1a1a;border-radius:12px;border:1px solid #2a2a2a">
          <p style="margin:0 0 16px;font-size:14px;color:#e5e5e5;font-weight:600">
            Reply to <strong>${userEmail}</strong> with wire instructions, or open the admin panel:
          </p>
          <a href="${adminPanelUrl}" style="${btnStyle}">🔐 Open Admin Panel →</a>
        </div>

        <p style="font-size:11px;color:#555;margin-top:24px;border-top:1px solid #1f1f1f;padding-top:16px">
          GoldBuller LLC · Bitcoin OTC Desk · This notification was generated automatically when the customer submitted their OTC application.
        </p>
      </div>
    `;

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: "GoldBuller OTC <support@goldbuller.com>",
      to: [adminEmail],
      replyTo: userEmail,
      subject: `[OTC] New Bitcoin Order — ${Number(btcAmount).toFixed(2)} BTC ($${fmt(usdTotal)}) — ${id}`,
      html,
    });

    if (error) throw new Error(error.message);

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || "Failed to notify admin." });
  }
});

export default router;
