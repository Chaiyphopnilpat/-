import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  category: text("category").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  active: integer("active").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").references(() => products.id).notNull(),
  amount: real("amount").notNull(),
  promptpayId: text("promptpay_id").notNull(),
  qrCode: text("qr_code").notNull(),
  status: text("status").default("pending").notNull(), // pending, completed, failed
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Feature catalog system
export const featureCategories = pgTable("feature_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  active: integer("active").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const features = pgTable("features", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  categoryId: varchar("category_id").references(() => featureCategories.id).notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  codeExample: text("code_example"),
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced, expert
  estimatedHours: integer("estimated_hours").default(1).notNull(),
  technologies: text("technologies").array(),
  price: real("price").default(0).notNull(),
  status: text("status").default("planned").notNull(), // planned, in_progress, completed, archived
  priority: text("priority").default("medium").notNull(), // low, medium, high, critical
  tags: text("tags").array(),
  active: integer("active").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const featureRequests = pgTable("feature_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  featureId: varchar("feature_id").references(() => features.id),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email").notNull(),
  customRequirements: text("custom_requirements"),
  budget: real("budget"),
  deadline: timestamp("deadline"),
  status: text("status").default("pending").notNull(), // pending, approved, rejected, completed
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// AI Tools system
export const aiTools = pgTable("ai_tools", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  toolId: integer("tool_id").notNull(), // Original ID from Excel
  toolName: text("tool_name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  url: text("url"),
  priceUSD: real("price_usd").default(0).notNull(),
  priceTHB: real("price_thb").default(0).notNull(),
  licenseType: text("license_type").notNull(),
  tags: text("tags").array(),
  rating: real("rating").default(0),
  reviewCount: integer("review_count").default(0),
  isPopular: integer("is_popular").default(0).notNull(),
  isFeatured: integer("is_featured").default(0).notNull(),
  active: integer("active").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Insert schemas
export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFeatureCategorySchema = createInsertSchema(featureCategories).omit({
  id: true,
  createdAt: true,
});

export const insertFeatureSchema = createInsertSchema(features).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFeatureRequestSchema = createInsertSchema(featureRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAIToolSchema = createInsertSchema(aiTools).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertFeatureCategory = z.infer<typeof insertFeatureCategorySchema>;
export type FeatureCategory = typeof featureCategories.$inferSelect;
export type InsertFeature = z.infer<typeof insertFeatureSchema>;
export type Feature = typeof features.$inferSelect;
export type InsertFeatureRequest = z.infer<typeof insertFeatureRequestSchema>;
export type FeatureRequest = typeof featureRequests.$inferSelect;
export type InsertAITool = z.infer<typeof insertAIToolSchema>;
export type AITool = typeof aiTools.$inferSelect;
