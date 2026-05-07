import { Router } from "express";
import { Resend } from "resend";
import bcrypt from "bcryptjs";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

function getSiteUrl() {
  const domains = process.env["REPLIT_DOMAINS"] || "localhost:3000";
  const list = domains.split(",").map((d) => d.trim());
  const custom = list.find((d) => !d.endsWith(".replit.app"));
  return `https://${custom || list[0]}`;
}

// POST /api/auth/register
router.post("/auth/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body as {
      firstName?: string; lastName?: string; email?: string; password?: string;
    };

    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !password) {
      res.status(400).json({ success: false, error: "All fields are required." });
      return;
    }
    if (password.length < 8) {
      res.status(400).json({ success: false, error: "Password must be at least 8 characters." });
      return;
    }

    const normalEmail = email.trim().toLowerCase();

    const existing = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, normalEmail))
      .limit(1);

    if (existing.length > 0) {
      res.status(409).json({ success: false, error: "An account with this email already exists. Please sign in." });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const [user] = await db
      .insert(usersTable)
      .values({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: normalEmail,
        passwordHash,
      })
      .returning({ id: usersTable.id, firstName: usersTable.firstName, lastName: usersTable.lastName, email: usersTable.email });

    res.json({
      success: true,
      user: { email: user.email, name: `${user.firstName} ${user.lastName}` },
    });
  } catch (err) {
    req.log.error({ err }, "Registration error");
    res.status(500).json({ success: false, error: "Registration failed. Please try again." });
  }
});

// POST /api/auth/login
router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email?.trim() || !password) {
      res.status(400).json({ success: false, error: "Email and password are required." });
      return;
    }

    const normalEmail = email.trim().toLowerCase();

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, normalEmail))
      .limit(1);

    if (!user) {
      res.status(401).json({ success: false, error: "No account found with this email. Please create an account." });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ success: false, error: "Incorrect password. Please try again." });
      return;
    }

    res.json({
      success: true,
      user: { email: user.email, name: `${user.firstName} ${user.lastName}` },
    });
  } catch (err) {
    req.log.error({ err }, "Login error");
    res.status(500).json({ success: false, error: "Login failed. Please try again." });
  }
});

// POST /api/auth/update-profile
router.post("/auth/update-profile", async (req, res) => {
  try {
    const { email, firstName, lastName } = req.body as {
      email?: string; firstName?: string; lastName?: string;
    };

    if (!email?.trim()) {
      res.status(400).json({ success: false, error: "email is required." });
      return;
    }

    const normalEmail = email.trim().toLowerCase();
    const [user] = await db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.email, normalEmail)).limit(1);
    if (!user) {
      res.status(404).json({ success: false, error: "Account not found." });
      return;
    }

    const updates: Record<string, string> = {};
    if (firstName?.trim()) updates["firstName"] = firstName.trim();
    if (lastName?.trim()) updates["lastName"] = lastName.trim();

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ success: false, error: "Nothing to update." });
      return;
    }

    const [updated] = await db
      .update(usersTable)
      .set(updates)
      .where(eq(usersTable.email, normalEmail))
      .returning({ firstName: usersTable.firstName, lastName: usersTable.lastName, email: usersTable.email });

    res.json({
      success: true,
      user: { email: updated.email, name: `${updated.firstName} ${updated.lastName}` },
    });
  } catch (err) {
    req.log.error({ err }, "Update profile error");
    res.status(500).json({ success: false, error: "Failed to update profile." });
  }
});

// POST /api/auth/change-password
router.post("/auth/change-password", async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body as {
      email?: string; currentPassword?: string; newPassword?: string;
    };

    if (!email?.trim() || !currentPassword || !newPassword) {
      res.status(400).json({ success: false, error: "email, currentPassword, and newPassword are required." });
      return;
    }
    if (newPassword.length < 8) {
      res.status(400).json({ success: false, error: "New password must be at least 8 characters." });
      return;
    }

    const normalEmail = email.trim().toLowerCase();
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, normalEmail)).limit(1);
    if (!user) {
      res.status(404).json({ success: false, error: "Account not found." });
      return;
    }

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      res.status(401).json({ success: false, error: "Current password is incorrect." });
      return;
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    await db.update(usersTable).set({ passwordHash: newHash }).where(eq(usersTable.email, normalEmail));

    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Change password error");
    res.status(500).json({ success: false, error: "Failed to change password." });
  }
});

// POST /api/auth/forgot-password
// Body: { email: string; code: string }
// Frontend generates the 6-digit code and stores it in localStorage.
// This endpoint just sends the email.
router.post("/auth/forgot-password", async (req, res) => {
  try {
    const { email, code } = req.body as { email?: string; code?: string };

    if (!email || !code) {
      res.status(400).json({ success: false, error: "email and code are required" });
      return;
    }

    const apiKey = process.env["RESEND_API_KEY"];
    if (!apiKey) {
      req.log.error("RESEND_API_KEY not configured");
      res.status(500).json({ success: false, error: "Email service not configured" });
      return;
    }

    const siteUrl = getSiteUrl();
    const resend = new Resend(apiKey);
    const resetUrl = `${siteUrl}/account/reset-password?email=${encodeURIComponent(email)}`;

    await resend.emails.send({
      from: "GoldBuller <support@goldbuller.com>",
      to: email,
      subject: "Your GoldBuller password reset code",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin:0;padding:0;background:#0A0A0A;font-family:Inter,Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;padding:40px 20px;">
            <tr><td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#111111;border:1px solid #222;border-radius:12px;overflow:hidden;">
                <tr>
                  <td style="background:#0A0A0A;padding:28px 40px;border-bottom:1px solid #222;">
                    <span style="font-family:Georgia,serif;font-size:22px;font-weight:bold;color:#C9A84C;">GoldBuller.</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:40px;">
                    <h1 style="margin:0 0 16px;font-size:24px;color:#fff;">Password Reset</h1>
                    <p style="margin:0 0 24px;color:#888;font-size:15px;line-height:1.6;">
                      We received a request to reset the password for your GoldBuller account associated with <strong style="color:#ccc;">${email}</strong>.
                    </p>
                    <p style="margin:0 0 12px;color:#888;font-size:14px;">Your 6-digit reset code is:</p>
                    <div style="text-align:center;margin:24px 0;">
                      <div style="display:inline-block;background:#1a1a1a;border:2px solid #C9A84C;border-radius:12px;padding:20px 40px;">
                        <span style="font-family:'Courier New',monospace;font-size:40px;font-weight:bold;color:#C9A84C;letter-spacing:12px;">${code}</span>
                      </div>
                    </div>
                    <p style="margin:0 0 8px;color:#888;font-size:14px;">This code expires in <strong style="color:#ccc;">15 minutes</strong>.</p>
                    <p style="margin:0 0 32px;color:#888;font-size:14px;">Or click the button below to go directly to the reset page:</p>
                    <div style="text-align:center;margin-bottom:32px;">
                      <a href="${resetUrl}" style="display:inline-block;background:#C9A84C;color:#000;font-weight:bold;font-size:15px;padding:14px 32px;border-radius:8px;text-decoration:none;">
                        Reset My Password →
                      </a>
                    </div>
                    <div style="background:#1a1a1a;border:1px solid #333;border-radius:8px;padding:16px;margin-top:16px;">
                      <p style="margin:0;color:#666;font-size:13px;">
                        ⚠️ If you didn't request this, you can safely ignore this email. Your password will not change.
                      </p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 40px;border-top:1px solid #222;background:#0A0A0A;">
                    <p style="margin:0;color:#444;font-size:12px;text-align:center;">
                      © ${new Date().getFullYear()} GoldBuller. All rights reserved.<br>
                      <a href="${siteUrl}" style="color:#C9A84C;text-decoration:none;">goldbuller.com</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>
        </body>
        </html>
      `,
    });

    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to send password reset email");
    res.status(500).json({ success: false, error: "Failed to send reset email" });
  }
});

export default router;
