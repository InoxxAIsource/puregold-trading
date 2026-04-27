import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const kycApplications = pgTable("kyc_applications", {
  applicationId: text("application_id").primaryKey(),
  userEmail:     text("user_email").notNull(),
  status:        text("status").notNull().default("pending_review"),
  approvalToken: text("approval_token").notNull().unique(),
  submittedAt:   timestamp("submitted_at").defaultNow().notNull(),
  reviewedAt:    timestamp("reviewed_at"),
});
