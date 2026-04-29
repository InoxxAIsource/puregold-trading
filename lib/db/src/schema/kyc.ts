import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const kycApplications = pgTable("kyc_applications", {
  applicationId:   text("application_id").primaryKey(),
  userEmail:       text("user_email").notNull(),
  status:          text("status").notNull().default("pending_review"),
  approvalToken:   text("approval_token").notNull().unique(),
  submittedAt:     timestamp("submitted_at").defaultNow().notNull(),
  reviewedAt:      timestamp("reviewed_at"),
  personalData:    text("personal_data"),
  selfieSubmitted: text("selfie_submitted").default("no"),
  bankName:        text("bank_name"),
  bankAddress:     text("bank_address"),
  accountName:     text("account_name"),
  accountNumber:   text("account_number"),
  routingNumber:   text("routing_number"),
  swiftCode:       text("swift_code"),
  wireDeadline:    timestamp("wire_deadline"),
});
