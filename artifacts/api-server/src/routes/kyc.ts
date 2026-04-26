import { Router } from "express";
import nodemailer from "nodemailer";

const router = Router();

function base64ToBuffer(dataUrl: string): { buffer: Buffer; mimeType: string; ext: string } {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error("Invalid data URL");
  const mimeType = match[1];
  const buffer = Buffer.from(match[2], "base64");
  const extMap: Record<string, string> = {
    "image/jpeg": "jpg", "image/png": "png", "image/gif": "gif",
    "application/pdf": "pdf", "image/webp": "webp",
  };
  return { buffer, mimeType, ext: extMap[mimeType] || "bin" };
}

function createTransporter() {
  const user = process.env["SMTP_USER"];
  const pass = process.env["SMTP_PASS"];
  if (!user || !pass) throw new Error("SMTP_USER and SMTP_PASS environment variables are required");
  return nodemailer.createTransport({
    host: process.env["SMTP_HOST"] || "smtp.gmail.com",
    port: Number(process.env["SMTP_PORT"] || 587),
    secure: false,
    auth: { user, pass },
  });
}

router.post("/kyc/submit", async (req, res) => {
  try {
    const { personal, identity, address, applicationId } = req.body as {
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
    };

    const adminEmail = process.env["KYC_ADMIN_EMAIL"] || "inoxxprotocl@gmail.com";
    const fromEmail = process.env["SMTP_USER"] || "noreply@puregoldtrading.com";

    const attachments: nodemailer.Attachment[] = [];

    if (identity.frontFile) {
      try {
        const { buffer, ext } = base64ToBuffer(identity.frontFile);
        attachments.push({ filename: `id_front.${ext}`, content: buffer });
      } catch {}
    }
    if (identity.backFile) {
      try {
        const { buffer, ext } = base64ToBuffer(identity.backFile);
        attachments.push({ filename: `id_back.${ext}`, content: buffer });
      } catch {}
    }
    if (address.addressFile) {
      try {
        const { buffer, ext } = base64ToBuffer(address.addressFile);
        attachments.push({ filename: `utility_bill.${ext}`, content: buffer });
      } catch {}
    }

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#e5e5e5;padding:32px;border-radius:12px">
        <div style="background:#b8860b;padding:16px 24px;border-radius:8px;margin-bottom:24px">
          <h1 style="margin:0;color:#000;font-size:22px">🏅 PureGold Trading — New KYC Application</h1>
          <p style="margin:4px 0 0;color:#000;opacity:0.7;font-size:14px">Application #${applicationId} · Submitted ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })} EDT</p>
        </div>

        <h2 style="color:#b8860b;font-size:16px;border-bottom:1px solid #333;padding-bottom:8px">👤 Personal Information</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:24px">
          ${[
            ["Full Name", `${personal.firstName} ${personal.lastName}`],
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
              <td style="padding:6px 0;color:#888;width:40%">${k}:</td>
              <td style="padding:6px 0;color:#e5e5e5;font-weight:bold">${v}</td>
            </tr>
          `).join("")}
        </table>

        <h2 style="color:#b8860b;font-size:16px;border-bottom:1px solid #333;padding-bottom:8px">🪪 Identity Document</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:24px">
          ${[
            ["Document Type", identity.docType],
            ["Front of ID", identity.frontFile ? "✅ Attached" : "❌ Not provided"],
            ["Back of ID", identity.backFile ? "✅ Attached" : "Not required"],
          ].map(([k, v]) => `
            <tr>
              <td style="padding:6px 0;color:#888;width:40%">${k}:</td>
              <td style="padding:6px 0;color:#e5e5e5;font-weight:bold">${v}</td>
            </tr>
          `).join("")}
        </table>

        <h2 style="color:#b8860b;font-size:16px;border-bottom:1px solid #333;padding-bottom:8px">📋 Proof of Address</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:24px">
          ${[
            ["Document Type", address.docType],
            ["Street", address.street],
            ["City", address.city],
            ["State", address.state],
            ["ZIP", address.zip],
            ["Country", address.country],
            ["Address Document", address.addressFile ? "✅ Attached" : "❌ Not provided"],
          ].map(([k, v]) => `
            <tr>
              <td style="padding:6px 0;color:#888;width:40%">${k}:</td>
              <td style="padding:6px 0;color:#e5e5e5;font-weight:bold">${v}</td>
            </tr>
          `).join("")}
        </table>

        <div style="background:#1a1a1a;border:1px solid #333;border-radius:8px;padding:16px;margin-top:8px">
          <p style="margin:0;font-size:13px;color:#888">
            <strong style="color:#b8860b">Action required:</strong> Review the attached documents and approve or decline this application.
            Documents are attached to this email (ID front, ID back where applicable, and address document).
          </p>
        </div>
      </div>
    `;

    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"PureGold Trading KYC" <${fromEmail}>`,
      to: adminEmail,
      subject: `[KYC] New Application — ${personal.firstName} ${personal.lastName} (#${applicationId})`,
      html,
      attachments,
    });

    res.json({ success: true, applicationId });
  } catch (err: any) {
    console.error("KYC submit error:", err);
    res.status(500).json({ success: false, error: err.message || "Failed to submit KYC application" });
  }
});

export default router;
