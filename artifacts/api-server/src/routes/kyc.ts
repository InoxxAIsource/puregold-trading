import { Router } from "express";
import { Resend } from "resend";
import { randomUUID } from "crypto";
import { db, kycApplications } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

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
  const domains = process.env["REPLIT_DOMAINS"] || "localhost:3000";
  const list = domains.split(",").map(d => d.trim());
  const custom = list.find(d => !d.endsWith(".replit.app"));
  return `https://${custom || list[0]}`;
}

function checkAdminPassword(password: string): boolean {
  const adminPw = process.env["ADMIN_PASSWORD"] || "goldbuller-admin-secure";
  return password === adminPw;
}

// POST /api/kyc/submit
router.post("/kyc/submit", async (req, res) => {
  try {
    const { personal, identity, address, selfie, applicationId, userEmail } = req.body as {
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
      selfie: { selfieFile: string | null };
      applicationId: string;
      userEmail: string;
    };

    if (!personal || !identity || !address || !applicationId || !userEmail) {
      res.status(400).json({ success: false, error: "Missing required fields: personal, identity, address, applicationId, userEmail" });
      return;
    }
    if (!personal.firstName || !personal.lastName) {
      res.status(400).json({ success: false, error: "Personal information is incomplete." });
      return;
    }
    if (!identity.docType || !identity.frontFile) {
      res.status(400).json({ success: false, error: "Identity document type and front image are required." });
      return;
    }
    if (!address.street || !address.city || !address.country) {
      res.status(400).json({ success: false, error: "Address information is incomplete." });
      return;
    }

    const apiKey = process.env["RESEND_API_KEY"];
    if (!apiKey) throw new Error("RESEND_API_KEY is not configured");

    const adminEmail = process.env["KYC_ADMIN_EMAIL"] || "chainlayer650@gmail.com";
    const approvalToken = randomUUID();
    const siteUrl = getSiteUrl();
    const selfieSubmitted = selfie?.selfieFile ? "yes" : "no";

    const personalData = JSON.stringify({
      ...personal,
      identityDocType: identity.docType,
      identityFront: identity.frontFile ? "attached" : "none",
      identityBack: identity.backFile ? "attached" : "none",
      addressDocType: address.docType,
      addressStreet: address.street,
      addressCity: address.city,
      addressState: address.state,
      addressZip: address.zip,
      addressCountry: address.country,
      addressFile: address.addressFile ? "attached" : "none",
    });

    await db.insert(kycApplications).values({
      applicationId,
      userEmail: userEmail || "unknown",
      status: "pending_review",
      approvalToken,
      personalData,
      selfieSubmitted,
    });

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
    if (selfie?.selfieFile) {
      try { const { buffer, ext } = base64ToBuffer(selfie.selfieFile); attachments.push({ filename: `selfie_${applicationId}.${ext}`, content: buffer }); } catch {}
    }

    const adminPanelUrl = `${siteUrl}/admin?id=${applicationId}&token=${approvalToken}`;

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

        <div style="text-align:center;margin-bottom:32px;padding:24px;background:#1a1a1a;border-radius:12px;border:1px solid #2a2a2a">
          <p style="margin:0 0 20px;font-size:15px;color:#e5e5e5;font-weight:600">Review documents, then open the Admin Panel to approve with bank wire details:</p>
          <a href="${adminPanelUrl}" style="${btnStyle("#b8860b", "#000")}">🔐 &nbsp;Open Admin Review Panel</a>
          <p style="margin:16px 0 0;font-size:11px;color:#666">Enter your admin password and fill in bank wire details before approving.</p>
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

        <h2 style="color:#b8860b;font-size:15px;border-bottom:1px solid #2a2a2a;padding-bottom:8px">🪪 Identity Documents</h2>
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

        <h2 style="color:#b8860b;font-size:15px;border-bottom:1px solid #2a2a2a;padding-bottom:8px">🤳 Selfie</h2>
        <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:24px">
          <tr>
            <td style="padding:5px 0;color:#888;width:42%">Selfie Photo:</td>
            <td style="padding:5px 0;color:#e5e5e5;font-weight:600">${selfieSubmitted === "yes" ? "✅ Attached" : "❌ Not provided"}</td>
          </tr>
        </table>

        <div style="text-align:center;margin-top:8px;padding:20px;background:#1a1a1a;border-radius:12px;border:1px solid #2a2a2a">
          <a href="${adminPanelUrl}" style="${btnStyle("#b8860b", "#000")}">🔐 &nbsp;Open Admin Panel to Approve/Decline</a>
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
    res.status(500).json({ success: false, error: err.message || "Failed to submit" });
  }
});

// GET /api/admin/kyc/list?password=xxx
router.get("/admin/kyc/list", async (req, res) => {
  const { password } = req.query as { password: string };
  if (!checkAdminPassword(password)) {
    return res.status(401).json({ success: false, error: "Invalid admin password" });
  }
  try {
    const apps = await db
      .select()
      .from(kycApplications)
      .orderBy(desc(kycApplications.submittedAt));
    return res.json({ success: true, applications: apps });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: "Database error" });
  }
});

// POST /api/admin/kyc/approve
router.post("/admin/kyc/approve", async (req, res) => {
  const {
    applicationId, token, password,
    bankName, bankAddress, accountName, accountNumber, routingNumber, swiftCode,
  } = req.body as {
    applicationId: string; token: string; password: string;
    bankName: string; bankAddress: string; accountName: string;
    accountNumber: string; routingNumber: string; swiftCode: string;
  };

  if (!checkAdminPassword(password)) {
    return res.status(401).json({ success: false, error: "Invalid admin password" });
  }
  if (!applicationId || !token) {
    return res.status(400).json({ success: false, error: "Missing applicationId or token" });
  }

  try {
    const [app] = await db
      .select()
      .from(kycApplications)
      .where(eq(kycApplications.applicationId, applicationId));

    if (!app) return res.status(404).json({ success: false, error: "Application not found" });
    if (app.approvalToken !== token) return res.status(403).json({ success: false, error: "Invalid token" });
    if (app.status !== "pending_review") {
      return res.json({ success: true, message: `Application was already ${app.status}.` });
    }

    const wireDeadline = new Date(Date.now() + 4 * 60 * 60 * 1000);

    await db
      .update(kycApplications)
      .set({
        status: "approved",
        reviewedAt: new Date(),
        bankName, bankAddress, accountName, accountNumber, routingNumber, swiftCode,
        wireDeadline,
      })
      .where(eq(kycApplications.applicationId, applicationId));

    const apiKey = process.env["RESEND_API_KEY"];
    if (apiKey && app.userEmail && app.userEmail !== "unknown") {
      try {
        const resend = new Resend(apiKey);
        const siteUrl = getSiteUrl();
        const deadlineStr = wireDeadline.toLocaleString("en-US", {
          timeZone: "America/New_York",
          month: "long", day: "numeric", year: "numeric",
          hour: "2-digit", minute: "2-digit",
        }) + " EDT";

        const btnStyle = (bg: string, color: string) =>
          `display:inline-block;padding:14px 32px;background:${bg};color:${color};font-size:15px;font-weight:bold;text-decoration:none;border-radius:8px;letter-spacing:0.5px;`;

        const userHtml = `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0f0f0f;color:#e5e5e5;padding:32px;border-radius:12px">
            <div style="background:#b8860b;padding:16px 24px;border-radius:8px;margin-bottom:28px">
              <h1 style="margin:0;color:#000;font-size:20px;font-weight:bold">🏅 GoldBuller — KYC Approved</h1>
              <p style="margin:6px 0 0;color:#000;opacity:0.65;font-size:13px">Application #${applicationId}</p>
            </div>

            <p style="font-size:16px;line-height:1.6;margin-bottom:20px">
              Congratulations! Your identity has been verified and your GoldBuller account is now fully activated.
            </p>

            <div style="background:#14532d;border:1px solid #166534;border-radius:10px;padding:20px;margin-bottom:28px">
              <p style="margin:0;font-size:15px;font-weight:bold;color:#86efac">✅ You are now approved for:</p>
              <ul style="margin:12px 0 0;padding-left:20px;color:#d1fae5;line-height:2">
                <li>Physical gold, silver, platinum &amp; copper purchases</li>
                <li>Bitcoin OTC desk — 0.20 to 10 BTC per transaction</li>
                <li>IRA-eligible bullion orders</li>
                <li>Wire transfer settlement</li>
              </ul>
            </div>

            <div style="background:#1c0a00;border:2px solid #c2410c;border-radius:10px;padding:20px;margin-bottom:28px">
              <p style="margin:0 0 8px;font-size:16px;font-weight:bold;color:#fb923c">⚡ TIME-SENSITIVE: Wire Must Be Received Within 4 Hours</p>
              <p style="margin:0 0 16px;font-size:13px;color:#fed7aa;line-height:1.6">
                Due to precious metals and Bitcoin price volatility, your wire transfer must be confirmed by our team before:
              </p>
              <p style="margin:0 0 16px;font-size:17px;font-weight:bold;color:#fff;text-align:center;padding:12px;background:#7c2d12;border-radius:8px;">
                📅 ${deadlineStr}
              </p>
              <p style="margin:0;font-size:12px;color:#fb923c;">
                ⚠️ Wires received after this deadline may require a new quote at current market prices.
              </p>
            </div>

            <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:10px;padding:20px;margin-bottom:28px">
              <p style="margin:0 0 16px;font-size:15px;font-weight:bold;color:#b8860b">🏦 Bank Wire Instructions</p>
              <table style="width:100%;border-collapse:collapse;font-size:13px;">
                ${[
                  ["Bank Name", bankName],
                  ["Account Name (Beneficiary)", accountName],
                  ["Account Number", accountNumber],
                  ["Routing Number (ABA)", routingNumber],
                  ["SWIFT / BIC Code", swiftCode || "N/A"],
                  ["Bank Address", bankAddress],
                  ["Wire Reference / Memo", applicationId],
                ].map(([k, v]) => `
                  <tr style="border-bottom:1px solid #2a2a2a">
                    <td style="padding:8px 0;color:#888;width:46%;vertical-align:top;font-size:12px">${k}:</td>
                    <td style="padding:8px 0;color:#f5f5f5;font-weight:700;font-size:13px">${v}</td>
                  </tr>
                `).join("")}
              </table>
              <p style="margin:14px 0 0;font-size:11px;color:#666;line-height:1.5">
                Always include the Wire Reference in your transfer to ensure proper allocation.
              </p>
            </div>

            <div style="text-align:center;margin-bottom:28px">
              <a href="${siteUrl}/bitcoin-otc/apply" style="${btnStyle("#b8860b", "#000")}">Start a Bitcoin OTC Order →</a>
            </div>

            <p style="font-size:13px;color:#888;line-height:1.6">
              Questions? Contact us at
              <a href="mailto:support@goldbuller.com" style="color:#b8860b">support@goldbuller.com</a>.
            </p>

            <p style="font-size:11px;color:#555;margin-top:24px;border-top:1px solid #1f1f1f;padding-top:16px">
              GoldBuller LLC · 1400 Precious Metals Way, Suite 400 · Dallas, TX 75201<br/>
              Bitcoin OTC services are subject to AML/KYC regulations. Transactions over $10,000 are reported as required by the Bank Secrecy Act.
            </p>
          </div>`;

        await resend.emails.send({
          from: "GoldBuller KYC <support@goldbuller.com>",
          to: [app.userEmail],
          subject: "✅ Your GoldBuller account is approved — Wire Instructions Enclosed",
          html: userHtml,
        });
      } catch {}
    }

    return res.json({ success: true, message: `Application #${applicationId} approved. Wire instructions sent to the user.` });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: "Database error" });
  }
});

// POST /api/admin/kyc/decline
router.post("/admin/kyc/decline", async (req, res) => {
  const { applicationId, token, password, declineReason } = req.body as {
    applicationId: string; token: string; password: string; declineReason?: string;
  };

  if (!checkAdminPassword(password)) {
    return res.status(401).json({ success: false, error: "Invalid admin password" });
  }
  if (!applicationId || !token) {
    return res.status(400).json({ success: false, error: "Missing applicationId or token" });
  }

  try {
    const [app] = await db
      .select()
      .from(kycApplications)
      .where(eq(kycApplications.applicationId, applicationId));

    if (!app) return res.status(404).json({ success: false, error: "Application not found" });
    if (app.approvalToken !== token) return res.status(403).json({ success: false, error: "Invalid token" });
    if (app.status !== "pending_review") {
      return res.json({ success: true, message: `Application was already ${app.status}.` });
    }

    await db
      .update(kycApplications)
      .set({ status: "declined", reviewedAt: new Date() })
      .where(eq(kycApplications.applicationId, applicationId));

    const apiKey = process.env["RESEND_API_KEY"];
    if (apiKey && app.userEmail && app.userEmail !== "unknown") {
      try {
        const resend = new Resend(apiKey);
        const siteUrl = getSiteUrl();
        const btnStyle = (bg: string, color: string) =>
          `display:inline-block;padding:14px 32px;background:${bg};color:${color};font-size:15px;font-weight:bold;text-decoration:none;border-radius:8px;letter-spacing:0.5px;`;

        await resend.emails.send({
          from: "GoldBuller KYC <support@goldbuller.com>",
          to: [app.userEmail],
          subject: "GoldBuller KYC Application Update",
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0f0f0f;color:#e5e5e5;padding:32px;border-radius:12px">
              <div style="background:#7f1d1d;padding:16px 24px;border-radius:8px;margin-bottom:28px">
                <h1 style="margin:0;color:#fff;font-size:20px;font-weight:bold">GoldBuller — KYC Application Update</h1>
                <p style="margin:6px 0 0;color:#fca5a5;font-size:13px">Application #${applicationId}</p>
              </div>
              <p style="font-size:16px;line-height:1.6;margin-bottom:20px">
                We were unable to verify your identity at this time. Your application has not been approved.
              </p>
              ${declineReason ? `<div style="background:#1c1917;border:1px solid #292524;border-radius:10px;padding:16px;margin-bottom:20px"><p style="margin:0;font-size:13px;color:#d6d3d1"><strong>Reason:</strong> ${declineReason}</p></div>` : ""}
              <div style="background:#1c1917;border:1px solid #292524;border-radius:10px;padding:20px;margin-bottom:28px">
                <p style="margin:0 0 10px;font-size:14px;color:#d6d3d1;font-weight:600">Common reasons for decline:</p>
                <ul style="margin:0;padding-left:20px;color:#a8a29e;line-height:2;font-size:13px">
                  <li>Documents were blurry or incomplete</li>
                  <li>Name or address did not match across documents</li>
                  <li>Expired government-issued ID</li>
                  <li>Unable to verify proof of address</li>
                  <li>Selfie did not match the ID document</li>
                </ul>
              </div>
              <div style="text-align:center;margin-bottom:28px">
                <a href="${siteUrl}/account/kyc" style="${btnStyle("#b8860b", "#000")}">Reapply Now →</a>
              </div>
              <p style="font-size:13px;color:#888;line-height:1.6">
                Questions? Contact us at <a href="mailto:support@goldbuller.com" style="color:#b8860b">support@goldbuller.com</a>.
              </p>
              <p style="font-size:11px;color:#555;margin-top:24px;border-top:1px solid #1f1f1f;padding-top:16px">
                GoldBuller LLC · 1400 Precious Metals Way, Suite 400 · Dallas, TX 75201
              </p>
            </div>`,
        });
      } catch {}
    }

    return res.json({ success: true, message: `Application #${applicationId} declined.` });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: "Database error" });
  }
});

// POST /api/kyc/receipt — user submits wire payment receipt
router.post("/kyc/receipt", async (req, res) => {
  const { applicationId, userEmail, receiptFile } = req.body as {
    applicationId: string | null;
    userEmail: string;
    receiptFile: string;
  };

  try {
    const apiKey = process.env["RESEND_API_KEY"];
    if (!apiKey) return res.json({ success: true }); // Silently succeed if email not configured

    const adminEmail = process.env["KYC_ADMIN_EMAIL"] || "chainlayer650@gmail.com";
    const attachments: { filename: string; content: Buffer }[] = [];

    if (receiptFile) {
      try {
        const { buffer, ext } = base64ToBuffer(receiptFile);
        attachments.push({ filename: `wire_receipt_${applicationId || userEmail}.${ext}`, content: buffer });
      } catch {}
    }

    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: "GoldBuller KYC <support@goldbuller.com>",
      to: [adminEmail],
      subject: `[KYC] Wire Receipt Submitted — ${userEmail}${applicationId ? ` (#${applicationId})` : ""}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0f0f0f;color:#e5e5e5;padding:32px;border-radius:12px">
          <div style="background:#166534;padding:16px 24px;border-radius:8px;margin-bottom:24px">
            <h1 style="margin:0;color:#fff;font-size:18px;font-weight:bold">💸 Wire Receipt Submitted</h1>
            <p style="margin:6px 0 0;color:#86efac;font-size:13px">User has confirmed payment and uploaded receipt</p>
          </div>
          <table style="width:100%;font-size:13px;border-collapse:collapse">
            <tr><td style="padding:6px 0;color:#888;width:40%">User Email:</td><td style="color:#e5e5e5;font-weight:600">${userEmail}</td></tr>
            ${applicationId ? `<tr><td style="padding:6px 0;color:#888">Application ID:</td><td style="color:#e5e5e5;font-weight:600">#${applicationId}</td></tr>` : ""}
            <tr><td style="padding:6px 0;color:#888">Submitted At:</td><td style="color:#e5e5e5;font-weight:600">${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })} EDT</td></tr>
          </table>
          <p style="margin-top:20px;font-size:13px;color:#a3a3a3">Receipt image is attached. Please verify and confirm the wire on your end.</p>
        </div>`,
      attachments,
    });

    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Legacy GET review — still works for old email links (no bank wire, direct approve)
router.get("/kyc/review", async (req, res) => {
  const { id, token, action } = req.query as { id: string; token: string; action: string };
  if (!id || !token || !["approve", "decline"].includes(action)) {
    return res.status(400).json({ success: false, error: "Invalid parameters" });
  }
  try {
    const [app] = await db.select().from(kycApplications).where(eq(kycApplications.applicationId, id));
    if (!app) return res.status(404).json({ success: false, error: "Application not found" });
    if (app.approvalToken !== token) return res.status(403).json({ success: false, error: "Invalid token" });
    if (app.status !== "pending_review") {
      return res.json({ success: true, message: `Application was already ${app.status}.` });
    }
    const siteUrl = getSiteUrl();
    return res.redirect(`${siteUrl}/admin?id=${id}&token=${token}`);
  } catch (err: any) {
    return res.status(500).json({ success: false, error: "Database error" });
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

    if (apps.length === 0) return res.json({ success: true, status: "not_started" });

    const latest = apps.sort((a, b) =>
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    )[0];

    const wireInfo = latest.status === "approved" ? {
      wireDeadline: latest.wireDeadline,
      bankName: latest.bankName,
      bankAddress: latest.bankAddress,
      accountName: latest.accountName,
      accountNumber: latest.accountNumber,
      routingNumber: latest.routingNumber,
      swiftCode: latest.swiftCode,
    } : undefined;

    return res.json({
      success: true,
      status: latest.status,
      applicationId: latest.applicationId,
      ...(wireInfo || {}),
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: "Database error" });
  }
});

export default router;
