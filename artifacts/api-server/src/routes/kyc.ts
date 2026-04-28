import { Router } from "express";
import { Resend } from "resend";
import { randomUUID } from "crypto";
import { db, kycApplications } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

function base64ToBuffer(dataUrl: string): { buffer: Buffer; ext: string } {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error("Invalid data URL");
  const ext: Record<string, string> = {
    "image/jpeg": "jpg", "image/png": "png",
    "application/pdf": "pdf", "image/webp": "webp",
  };
  return {
    buffer: Buffer.from(match[2], "base64"),
    ext: ext[match[1]] || "bin",
  };
}

function getSiteUrl() {
  const domain = process.env["REPLIT_DOMAINS"] || "localhost:3000";
  return `https://${domain}`;
}

// POST /api/kyc/submit
router.post("/kyc/submit", async (req, res) => {
  try {
    const { personal, identity, address, applicationId, userEmail } = req.body as {
      personal: {
        firstName: string; lastName: string; dob: string; nationality: string;
        country: string; phone: string; ssn4: string; occupation: string;
        sourceOfFunds: string; purpose: string; volume: string;
        usCitizen: string; pep: string;
      };
      identity: { docType: string; frontFile: string | null; backFile: string | null };
      address: {
        docType: string; addressFile: string | null;
        street: string; city: string; state: string; zip: string; country: string;
      };
      applicationId: string;
      userEmail: string;
    };

    const apiKey = process.env["RESEND_API_KEY"];
    if (!apiKey) throw new Error("RESEND_API_KEY is not configured");

    const adminEmail = process.env["KYC_ADMIN_EMAIL"] || "chainlayer650@gmail.com";
    const approvalToken = randomUUID();
    const siteUrl = getSiteUrl();

    // Save to database
    await db.insert(kycApplications).values({
      applicationId,
      userEmail: userEmail || "unknown",
      status: "pending_review",
      approvalToken,
    });

    // Build email attachments
    const attachments: { filename: string; content: Buffer }[] = [];
    if (identity.frontFile) {
      try { const { buffer, ext } = base64ToBuffer(identity.frontFile); attachments.push({ filename: `id_front_${applicationId}.${ext}`, content: buffer }); } catch {}
    }
    if (identity.backFile) {
      try { const { buffer, ext } = base64ToBuffer(identity.backFile); attachments.push({ filename: `id_back_${applicationId}.${ext}`, content: buffer }); } catch {}
    }
    if (address.addressFile) {
      try { const { buffer, ext } = base64ToBuffer(address.addressFile); attachments.push({ filename: `utility_bill_${applicationId}.${ext}`, content: buffer }); } catch {}
    }

    const approveUrl = `${siteUrl}/kyc/review?id=${applicationId}&token=${approvalToken}&action=approve`;
    const declineUrl = `${siteUrl}/kyc/review?id=${applicationId}&token=${approvalToken}&action=decline`;

    const btnStyle = (bg: string, color: string) =>
      `display:inline-block;padding:14px 32px;background:${bg};color:${color};font-size:16px;font-weight:bold;text-decoration:none;border-radius:8px;letter-spacing:0.5px;`;

    const html = `
      <div style="font-family:sans-serif;max-width:640px;margin:0 auto;background:#0f0f0f;color:#e5e5e5;padding:32px;border-radius:12px">
        <div style="background:#b8860b;padding:16px 24px;border-radius:8px;margin-bottom:28px">
          <h1 style="margin:0;color:#000;font-size:20px;font-weight:bold">🏅 GoldBuller — New KYC Application</h1>
          <p style="margin:6px 0 0;color:#000;opacity:0.65;font-size:13px">
            Application #${applicationId} &nbsp;·&nbsp; ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })} EDT
          </p>
        </div>

        <!-- Action buttons -->
        <div style="text-align:center;margin-bottom:32px;padding:24px;background:#1a1a1a;border-radius:12px;border:1px solid #2a2a2a">
          <p style="margin:0 0 20px;font-size:15px;color:#e5e5e5;font-weight:600">Review the documents below, then approve or decline:</p>
          <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap">
            <a href="${approveUrl}" style="${btnStyle("#22c55e", "#000")}">✅ &nbsp;APPROVE APPLICATION</a>
            <a href="${declineUrl}" style="${btnStyle("#ef4444", "#fff")}">❌ &nbsp;DECLINE APPLICATION</a>
          </div>
          <p style="margin:16px 0 0;font-size:11px;color:#666">Each link can only be used once. Tokens expire after use.</p>
        </div>

        <h2 style="color:#b8860b;font-size:15px;border-bottom:1px solid #2a2a2a;padding-bottom:8px;margin-top:0">👤 Personal Information</h2>
        <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:24px">
          ${[
            ["Full Name", `${personal.firstName} ${personal.lastName}`],
            ["Email", userEmail || "—"],
            ["Date of Birth", personal.dob],
            ["Phone", personal.phone],
            ["Nationality", personal.nationality],
            ["Country of Residence", personal.country],
            ["Occupation", personal.occupation],
            ["Source of Funds", personal.sourceOfFunds],
            ["Purpose of Purchase", personal.purpose],
            ["Expected Annual Volume", personal.volume],
            ["US Citizen/Resident", personal.usCitizen],
            ["Politically Exposed Person", personal.pep],
            ["SSN Last 4 (US only)", personal.ssn4 || "N/A"],
          ].map(([k, v]) => `
            <tr>
              <td style="padding:5px 0;color:#888;width:42%;vertical-align:top">${k}:</td>
              <td style="padding:5px 0;color:#e5e5e5;font-weight:600">${v}</td>
            </tr>
          `).join("")}
        </table>

        <h2 style="color:#b8860b;font-size:15px;border-bottom:1px solid #2a2a2a;padding-bottom:8px">🪪 National ID Card</h2>
        <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:24px">
          ${[
            ["Document Type", identity.docType],
            ["Front of ID", identity.frontFile ? "✅ Attached" : "❌ Not provided"],
            ["Back of ID", identity.backFile ? "✅ Attached" : "Not required / not provided"],
          ].map(([k, v]) => `
            <tr>
              <td style="padding:5px 0;color:#888;width:42%">${k}:</td>
              <td style="padding:5px 0;color:#e5e5e5;font-weight:600">${v}</td>
            </tr>
          `).join("")}
        </table>

        <h2 style="color:#b8860b;font-size:15px;border-bottom:1px solid #2a2a2a;padding-bottom:8px">📋 Proof of Address</h2>
        <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:24px">
          ${[
            ["Document Type", address.docType],
            ["Full Address", `${address.street}, ${address.city}, ${address.state} ${address.zip}, ${address.country}`],
            ["Address Document", address.addressFile ? "✅ Attached" : "❌ Not provided"],
          ].map(([k, v]) => `
            <tr>
              <td style="padding:5px 0;color:#888;width:42%;vertical-align:top">${k}:</td>
              <td style="padding:5px 0;color:#e5e5e5;font-weight:600">${v}</td>
            </tr>
          `).join("")}
        </table>

        <!-- Repeat action buttons at bottom -->
        <div style="text-align:center;margin-top:8px;padding:20px;background:#1a1a1a;border-radius:12px;border:1px solid #2a2a2a">
          <a href="${approveUrl}" style="${btnStyle("#22c55e", "#000")}">✅ &nbsp;APPROVE APPLICATION</a>
          &nbsp;&nbsp;
          <a href="${declineUrl}" style="${btnStyle("#ef4444", "#fff")}">❌ &nbsp;DECLINE APPLICATION</a>
        </div>
      </div>
    `;

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: "GoldBuller KYC <support@goldbuller.com>",
      to: [adminEmail],
      subject: `[KYC] New Application — ${personal.firstName} ${personal.lastName} (#${applicationId})`,
      html,
      attachments,
    });

    if (error) throw new Error(error.message);

    res.json({ success: true, applicationId });
  } catch (err: any) {
    console.error("KYC submit error:", err);
    res.status(500).json({ success: false, error: err.message || "Failed to submit" });
  }
});

// GET /api/kyc/review?id=xxx&token=yyy&action=approve|decline
router.get("/kyc/review", async (req, res) => {
  const { id, token, action } = req.query as { id: string; token: string; action: string };

  if (!id || !token || !["approve", "decline"].includes(action)) {
    return res.status(400).json({ success: false, error: "Invalid parameters" });
  }

  try {
    const [app] = await db
      .select()
      .from(kycApplications)
      .where(eq(kycApplications.applicationId, id));

    if (!app) return res.status(404).json({ success: false, error: "Application not found" });
    if (app.approvalToken !== token) return res.status(403).json({ success: false, error: "Invalid token" });
    if (app.status !== "pending_review") {
      return res.json({ success: true, message: `Application was already ${app.status}.` });
    }

    const newStatus = action === "approve" ? "approved" : "declined";
    await db
      .update(kycApplications)
      .set({ status: newStatus, reviewedAt: new Date() })
      .where(eq(kycApplications.applicationId, id));

    const msg = action === "approve"
      ? `Application #${id} approved. The user can now purchase metals and Bitcoin OTC.`
      : `Application #${id} declined. The user will not be able to purchase until they reapply.`;

    res.json({ success: true, message: msg });
  } catch (err: any) {
    console.error("KYC review error:", err);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

// GET /api/kyc/status?email=xxx
router.get("/kyc/status", async (req, res) => {
  const { email } = req.query as { email: string };
  if (!email) return res.status(400).json({ success: false, error: "Missing email" });

  try {
    const apps = await db
      .select()
      .from(kycApplications)
      .where(eq(kycApplications.userEmail, email));

    // Return the most recent application status
    if (apps.length === 0) return res.json({ success: true, status: "not_started" });

    const latest = apps.sort((a, b) =>
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    )[0];

    res.json({ success: true, status: latest.status, applicationId: latest.applicationId });
  } catch (err: any) {
    console.error("KYC status error:", err);
    res.status(500).json({ success: false, error: "Database error" });
  }
});

export default router;
