import { Router } from "express";
import { Resend } from "resend";

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

    const apiKey = process.env["RESEND_API_KEY"];
    if (!apiKey) throw new Error("RESEND_API_KEY is not configured");

    const adminEmail = process.env["KYC_ADMIN_EMAIL"] || "inoxxprotocl@gmail.com";
    const resend = new Resend(apiKey);

    const attachments: { filename: string; content: Buffer }[] = [];

    if (identity.frontFile) {
      try {
        const { buffer, ext } = base64ToBuffer(identity.frontFile);
        attachments.push({ filename: `id_front_${applicationId}.${ext}`, content: buffer });
      } catch {}
    }
    if (identity.backFile) {
      try {
        const { buffer, ext } = base64ToBuffer(identity.backFile);
        attachments.push({ filename: `id_back_${applicationId}.${ext}`, content: buffer });
      } catch {}
    }
    if (address.addressFile) {
      try {
        const { buffer, ext } = base64ToBuffer(address.addressFile);
        attachments.push({ filename: `utility_bill_${applicationId}.${ext}`, content: buffer });
      } catch {}
    }

    const html = `
      <div style="font-family:sans-serif;max-width:620px;margin:0 auto;background:#0f0f0f;color:#e5e5e5;padding:32px;border-radius:12px">
        <div style="background:#b8860b;padding:16px 24px;border-radius:8px;margin-bottom:24px">
          <h1 style="margin:0;color:#000;font-size:20px;font-weight:bold">🏅 PureGold Trading — New KYC Application</h1>
          <p style="margin:6px 0 0;color:#000;opacity:0.65;font-size:13px">Application #${applicationId} · Submitted ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })} EDT</p>
        </div>

        <h2 style="color:#b8860b;font-size:15px;border-bottom:1px solid #2a2a2a;padding-bottom:8px;margin-top:0">👤 Personal Information</h2>
        <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:24px">
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
            ["Politically Exposed Person (PEP)", personal.pep],
            ["SSN Last 4 (US only)", personal.ssn4 || "N/A"],
          ].map(([k, v]) => `
            <tr>
              <td style="padding:5px 0;color:#888;width:42%">${k}:</td>
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
            ["Street", address.street],
            ["City / State / ZIP", `${address.city}, ${address.state} ${address.zip}`],
            ["Country", address.country],
            ["Address Document", address.addressFile ? "✅ Attached" : "❌ Not provided"],
          ].map(([k, v]) => `
            <tr>
              <td style="padding:5px 0;color:#888;width:42%">${k}:</td>
              <td style="padding:5px 0;color:#e5e5e5;font-weight:600">${v}</td>
            </tr>
          `).join("")}
        </table>

        <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;padding:16px;margin-top:8px">
          <p style="margin:0;font-size:13px;color:#888">
            <strong style="color:#b8860b">Action required:</strong> Review the attached documents (ID front, ID back if applicable, address document) and approve or decline this application by updating the user's KYC status in the admin panel.
          </p>
        </div>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: "PureGold KYC <onboarding@resend.dev>",
      to: [adminEmail],
      subject: `[KYC] New Application — ${personal.firstName} ${personal.lastName} (#${applicationId})`,
      html,
      attachments,
    });

    if (error) throw new Error(error.message);

    res.json({ success: true, applicationId });
  } catch (err: any) {
    console.error("KYC submit error:", err);
    res.status(500).json({ success: false, error: err.message || "Failed to submit KYC application" });
  }
});

export default router;
