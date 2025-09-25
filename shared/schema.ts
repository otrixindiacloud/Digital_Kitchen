import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("cashier"), // cashier, manager, admin
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email"),
  phone: text("phone"),
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const stores = pgTable("stores", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: jsonb("name").notNull(), // {en: string, ar: string}
  address: text("address"),
  phone: text("phone"),
  settings: jsonb("settings").default('{}'),
});

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: jsonb("name").notNull(), // {en: string, ar: string}
  icon: text("icon"),
  sortOrder: integer("sort_order").default(0),
  active: boolean("active").default(true),
});

export const items = pgTable("items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  categoryId: varchar("category_id").notNull().references(() => categories.id),
  name: jsonb("name").notNull(), // {en: string, ar: string}
  description: jsonb("description"), // {en: string, ar: string}
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  image: text("image"),
  hasSizes: boolean("has_sizes").default(false),
  hasModifiers: boolean("has_modifiers").default(false),
  active: boolean("active").default(true),
  sortOrder: integer("sort_order").default(0),
});

export const itemSizes = pgTable("item_sizes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  itemId: varchar("item_id").notNull().references(() => items.id),
  name: jsonb("name").notNull(), // {en: string, ar: string}
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  sortOrder: integer("sort_order").default(0),
});

export const modifiers = pgTable("modifiers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: jsonb("name").notNull(), // {en: string, ar: string}
  price: decimal("price", { precision: 10, scale: 2 }).default('0'),
  active: boolean("active").default(true),
});

export const itemModifiers = pgTable("item_modifiers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  itemId: varchar("item_id").notNull().references(() => items.id),
  modifierId: varchar("modifier_id").notNull().references(() => modifiers.id),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderNumber: integer("order_number").notNull(),
  type: text("type").notNull(), // dine-in, takeaway, delivery
  source: text("source").notNull(), // pos, talabat, snoonu
  status: text("status").notNull().default("pending"), // pending, confirmed, preparing, ready, completed, cancelled
  tableNumber: integer("table_number"),
  customerName: text("customer_name"),
  customerPhone: text("customer_phone"),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  serviceCharge: decimal("service_charge", { precision: 10, scale: 2 }).default('0'),
  discount: decimal("discount", { precision: 10, scale: 2 }).default('0'),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  completedAt: timestamp("completed_at"),
});

export const orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull().references(() => orders.id),
  itemId: varchar("item_id").notNull().references(() => items.id),
  itemName: jsonb("item_name").notNull(), // {en: string, ar: string}
  sizeId: varchar("size_id").references(() => itemSizes.id),
  sizeName: jsonb("size_name"), // {en: string, ar: string}
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
});

export const orderItemModifiers = pgTable("order_item_modifiers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderItemId: varchar("order_item_id").notNull().references(() => orderItems.id),
  modifierId: varchar("modifier_id").notNull().references(() => modifiers.id),
  modifierName: jsonb("modifier_name").notNull(), // {en: string, ar: string}
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
});

export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull().references(() => orders.id),
  method: text("method").notNull(), // cash, card, credit
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  reference: text("reference"), // card transaction reference
  status: text("status").notNull().default("completed"), // pending, completed, failed
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Tables for restaurant management
export const tables = pgTable("tables", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  number: integer("number").notNull().unique(),
  capacity: integer("capacity").notNull(),
  status: text("status").notNull().default("available"), // available, occupied, reserved, cleaning
  section: text("section"), // main, outdoor, vip
  isActive: boolean("is_active").default(true),
});

export const customers = pgTable("customers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone").unique(),
  email: text("email"),
  address: text("address"),
  totalOrders: integer("total_orders").default(0),
  totalSpent: decimal("total_spent", { precision: 10, scale: 2 }).default('0'),
  lastOrderAt: timestamp("last_order_at"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const inventory = pgTable("inventory", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: jsonb("name").notNull(), // {en: string, ar: string}
  unit: text("unit").notNull(), // kg, liter, piece
  currentStock: decimal("current_stock", { precision: 10, scale: 3 }).notNull(),
  minStock: decimal("min_stock", { precision: 10, scale: 3 }).notNull(),
  cost: decimal("cost", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true),
  lastUpdated: timestamp("last_updated").default(sql`CURRENT_TIMESTAMP`),
});

export const itemIngredients = pgTable("item_ingredients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  itemId: varchar("item_id").notNull().references(() => items.id),
  inventoryId: varchar("inventory_id").notNull().references(() => inventory.id),
  quantity: decimal("quantity", { precision: 10, scale: 3 }).notNull(),
});

export const shifts = pgTable("shifts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  openingCash: decimal("opening_cash", { precision: 10, scale: 2 }).notNull(),
  closingCash: decimal("closing_cash", { precision: 10, scale: 2 }),
  totalSales: decimal("total_sales", { precision: 10, scale: 2 }),
  cashSales: decimal("cash_sales", { precision: 10, scale: 2 }),
  cardSales: decimal("card_sales", { precision: 10, scale: 2 }),
  creditSales: decimal("credit_sales", { precision: 10, scale: 2 }),
  status: text("status").notNull().default("active"), // active, closed
  notes: text("notes"),
});

export const refunds = pgTable("refunds", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull().references(() => orders.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  reason: text("reason").notNull(),
  authorizedBy: varchar("authorized_by").notNull().references(() => users.id),
  processedBy: varchar("processed_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const settlements = pgTable("settlements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  source: text("source").notNull(), // talabat, snoonu
  weekStart: timestamp("week_start").notNull(),
  weekEnd: timestamp("week_end").notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  settledAmount: decimal("settled_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, completed
  processedBy: varchar("processed_by").references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const dailyReports = pgTable("daily_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: timestamp("date").notNull(),
  totalOrders: integer("total_orders").notNull(),
  totalSales: decimal("total_sales", { precision: 10, scale: 2 }).notNull(),
  cashSales: decimal("cash_sales", { precision: 10, scale: 2 }).notNull(),
  cardSales: decimal("card_sales", { precision: 10, scale: 2 }).notNull(),
  creditSales: decimal("credit_sales", { precision: 10, scale: 2 }).notNull(),
  refunds: decimal("refunds", { precision: 10, scale: 2 }).notNull(),
  serviceCharges: decimal("service_charges", { precision: 10, scale: 2 }).notNull(),
  discounts: decimal("discounts", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  items: many(items),
}));

export const itemsRelations = relations(items, ({ one, many }) => ({
  category: one(categories, {
    fields: [items.categoryId],
    references: [categories.id],
  }),
  sizes: many(itemSizes),
  itemModifiers: many(itemModifiers),
  orderItems: many(orderItems),
}));

export const itemSizesRelations = relations(itemSizes, ({ one }) => ({
  item: one(items, {
    fields: [itemSizes.itemId],
    references: [items.id],
  }),
}));

export const modifiersRelations = relations(modifiers, ({ many }) => ({
  itemModifiers: many(itemModifiers),
}));

export const itemModifiersRelations = relations(itemModifiers, ({ one }) => ({
  item: one(items, {
    fields: [itemModifiers.itemId],
    references: [items.id],
  }),
  modifier: one(modifiers, {
    fields: [itemModifiers.modifierId],
    references: [modifiers.id],
  }),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  orderItems: many(orderItems),
  payments: many(payments),
}));

export const orderItemsRelations = relations(orderItems, ({ one, many }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  item: one(items, {
    fields: [orderItems.itemId],
    references: [items.id],
  }),
  size: one(itemSizes, {
    fields: [orderItems.sizeId],
    references: [itemSizes.id],
  }),
  modifiers: many(orderItemModifiers),
}));

export const orderItemModifiersRelations = relations(orderItemModifiers, ({ one }) => ({
  orderItem: one(orderItems, {
    fields: [orderItemModifiers.orderItemId],
    references: [orderItems.id],
  }),
  modifier: one(modifiers, {
    fields: [orderItemModifiers.modifierId],
    references: [modifiers.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
}));

// New relations
export const tablesRelations = relations(tables, ({ many }) => ({
  orders: many(orders),
}));

export const customersRelations = relations(customers, ({ many }) => ({
  orders: many(orders),
}));

export const inventoryRelations = relations(inventory, ({ many }) => ({
  itemIngredients: many(itemIngredients),
}));

export const itemIngredientsRelations = relations(itemIngredients, ({ one }) => ({
  item: one(items, {
    fields: [itemIngredients.itemId],
    references: [items.id],
  }),
  inventory: one(inventory, {
    fields: [itemIngredients.inventoryId],
    references: [inventory.id],
  }),
}));

export const shiftsRelations = relations(shifts, ({ one }) => ({
  user: one(users, {
    fields: [shifts.userId],
    references: [users.id],
  }),
}));

export const refundsRelations = relations(refunds, ({ one }) => ({
  order: one(orders, {
    fields: [refunds.orderId],
    references: [orders.id],
  }),
  authorizedBy: one(users, {
    fields: [refunds.authorizedBy],
    references: [users.id],
  }),
  processedBy: one(users, {
    fields: [refunds.processedBy],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export const insertItemSchema = createInsertSchema(items).omit({
  id: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  orderNumber: true,
  createdAt: true,
  completedAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
  orderId: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  orderId: true,
  createdAt: true,
});

// New insert schemas
export const insertTableSchema = createInsertSchema(tables).omit({
  id: true,
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  totalOrders: true,
  totalSpent: true,
  lastOrderAt: true,
  createdAt: true,
});

export const insertInventorySchema = createInsertSchema(inventory).omit({
  id: true,
  lastUpdated: true,
});

export const insertShiftSchema = createInsertSchema(shifts).omit({
  id: true,
});

export const insertRefundSchema = createInsertSchema(refunds).omit({
  id: true,
  createdAt: true,
});

export const insertSettlementSchema = createInsertSchema(settlements).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Item = typeof items.$inferSelect;
export type InsertItem = z.infer<typeof insertItemSchema>;

export type ItemSize = typeof itemSizes.$inferSelect;
export type Modifier = typeof modifiers.$inferSelect;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

// New types
export type Table = typeof tables.$inferSelect;
export type InsertTable = z.infer<typeof insertTableSchema>;

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;

export type Inventory = typeof inventory.$inferSelect;
export type InsertInventory = z.infer<typeof insertInventorySchema>;

export type Shift = typeof shifts.$inferSelect;
export type InsertShift = z.infer<typeof insertShiftSchema>;

export type Refund = typeof refunds.$inferSelect;
export type InsertRefund = z.infer<typeof insertRefundSchema>;

export type Settlement = typeof settlements.$inferSelect;
export type InsertSettlement = z.infer<typeof insertSettlementSchema>;

export type DailyReport = typeof dailyReports.$inferSelect;
