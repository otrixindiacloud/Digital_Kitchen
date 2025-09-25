import { 
  users, categories, items, itemSizes, modifiers, itemModifiers, 
  orders, orderItems, orderItemModifiers, payments, settlements,
  tables, inventory, shifts,
  type User, type InsertUser, type Category, type InsertCategory,
  type Item, type InsertItem, type ItemSize, type Modifier,
  type Order, type InsertOrder, type OrderItem, type InsertOrderItem,
  type Payment, type InsertPayment, type Table, type InsertTable,
  type Inventory, type InsertInventory, type Shift, type InsertShift,
  type Settlement, type InsertSettlement
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, or } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: string, user: Partial<User>): Promise<User>;
  updateUserStatus(id: string, isActive: boolean): Promise<void>;

  // Categories
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<Category>): Promise<Category>;
  updateCategoryStatus(id: string, active: boolean): Promise<void>;

  // Items
  getItemsByCategory(categoryId: string): Promise<(Item & { sizes: ItemSize[]; modifiers: Modifier[] })[]>;
  getItem(id: string): Promise<Item | undefined>;
  createItem(item: InsertItem): Promise<Item>;
  getAllItems(): Promise<Item[]>;
  updateItem(id: string, item: Partial<Item>): Promise<Item>;
  updateItemStatus(id: string, active: boolean): Promise<void>;

  // Orders
  getOrders(limit?: number): Promise<Order[]>;
  getOrder(id: string): Promise<(Order & { items: OrderItem[] }) | undefined>;
  createOrder(order: any): Promise<Order>;
  updateOrderStatus(orderId: string, status: string): Promise<void>;

  // Order Items
  addOrderItem(orderItem: any): Promise<OrderItem>;

  // Payments
  addPayment(payment: any): Promise<Payment>;

  // Kitchen orders
  getKitchenOrders(): Promise<(Order & { items: OrderItem[] })[]>;

  // Tables
  getTables(): Promise<Table[]>;
  createTable(table: InsertTable): Promise<Table>;
  updateTable(id: string, table: Partial<Table>): Promise<Table>;
  updateTableStatus(id: string, status: string): Promise<void>;
  updateTableActive(id: string, isActive: boolean): Promise<void>;
  getTableOrders(): Promise<any[]>;

  // Inventory
  getInventory(): Promise<Inventory[]>;
  createInventoryItem(item: InsertInventory): Promise<Inventory>;
  updateInventoryItem(id: string, item: Partial<Inventory>): Promise<Inventory>;
  updateInventoryItemStatus(id: string, isActive: boolean): Promise<void>;
  getInventoryMovements(): Promise<any[]>;
  createInventoryMovement(movement: any): Promise<any>;

  // Shifts
  getShifts(): Promise<Shift[]>;
  getCurrentShift(): Promise<Shift | undefined>;
  startShift(shift: InsertShift): Promise<Shift>;
  endShift(id: string, endData: any): Promise<Shift>;

  // Settlements
  getSettlements(): Promise<Settlement[]>;
  createSettlement(settlement: InsertSettlement): Promise<Settlement>;
  processSettlement(id: string): Promise<Settlement>;
  getDeliverySummary(): Promise<any[]>;

  // Settings
  getSettings(): Promise<any>;
  updateSettings(settings: any): Promise<any>;

  // Reports & Analytics
  getSalesReport(from: string, to: string, comparison: string): Promise<any>;
  getTimeSeriesReport(from: string, to: string): Promise<any>;
  getCategoryPerformanceReport(from: string, to: string): Promise<any>;
  getPaymentMethodReport(from: string, to: string): Promise<any>;
  getTopItemsReport(from: string, to: string, limit: number): Promise<any>;
  getHourlyReport(from: string, to: string): Promise<any>;
  getComprehensiveReport(from: string, to: string): Promise<any>;

  // Seed data
  seedData(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(categories.sortOrder);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [created] = await db
      .insert(categories)
      .values(category)
      .returning();
    return created;
  }

  async getItemsByCategory(categoryId: string): Promise<(Item & { sizes: ItemSize[]; modifiers: Modifier[] })[]> {
    const itemsList = await db.select().from(items).where(eq(items.categoryId, categoryId)).orderBy(items.sortOrder);
    
    const itemsWithSizesAndModifiers = await Promise.all(
      itemsList.map(async (item) => {
        const sizes = await db.select().from(itemSizes).where(eq(itemSizes.itemId, item.id)).orderBy(itemSizes.sortOrder);
        
        const itemModifiersList = await db.select({ 
          modifier: modifiers 
        })
        .from(itemModifiers)
        .innerJoin(modifiers, eq(itemModifiers.modifierId, modifiers.id))
        .where(eq(itemModifiers.itemId, item.id));
        
        const itemModifierData = itemModifiersList.map(im => im.modifier);
        
        return { ...item, sizes, modifiers: itemModifierData };
      })
    );
    
    return itemsWithSizesAndModifiers;
  }

  async getItem(id: string): Promise<Item | undefined> {
    const [item] = await db.select().from(items).where(eq(items.id, id));
    return item || undefined;
  }

  async createItem(item: InsertItem): Promise<Item> {
    const [created] = await db
      .insert(items)
      .values(item)
      .returning();
    return created;
  }

  async getOrders(limit = 50): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(limit);
  }

  async getOrder(id: string): Promise<(Order & { items: OrderItem[] }) | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    if (!order) return undefined;

    const orderItemsList = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
    
    return { ...order, items: orderItemsList };
  }

  async createOrder(order: any): Promise<Order> {
    const [created] = await db
      .insert(orders)
      .values(order)
      .returning();
    return created;
  }

  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    await db.update(orders).set({ status }).where(eq(orders.id, orderId));
  }

  async addOrderItem(orderItem: any): Promise<OrderItem> {
    const [created] = await db
      .insert(orderItems)
      .values(orderItem)
      .returning();
    return created;
  }

  async addPayment(payment: any): Promise<Payment> {
    const [created] = await db
      .insert(payments)
      .values(payment)
      .returning();
    return created;
  }

  // Staff Management
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(users.createdAt);
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const [updated] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updated;
  }

  async updateUserStatus(id: string, isActive: boolean): Promise<void> {
    await db.update(users).set({ isActive }).where(eq(users.id, id));
  }

  // Menu Management
  async getAllItems(): Promise<Item[]> {
    return await db.select().from(items).orderBy(items.sortOrder);
  }

  async updateItem(id: string, itemData: Partial<Item>): Promise<Item> {
    const [updated] = await db
      .update(items)
      .set(itemData)
      .where(eq(items.id, id))
      .returning();
    return updated;
  }

  async updateItemStatus(id: string, active: boolean): Promise<void> {
    await db.update(items).set({ active }).where(eq(items.id, id));
  }

  async updateCategory(id: string, categoryData: Partial<Category>): Promise<Category> {
    const [updated] = await db
      .update(categories)
      .set(categoryData)
      .where(eq(categories.id, id))
      .returning();
    return updated;
  }

  async updateCategoryStatus(id: string, active: boolean): Promise<void> {
    await db.update(categories).set({ active }).where(eq(categories.id, id));
  }

  // Inventory Management
  async getInventory(): Promise<Inventory[]> {
    return await db.select().from(inventory).orderBy(inventory.lastUpdated);
  }

  async createInventoryItem(inventoryData: InsertInventory): Promise<Inventory> {
    const [created] = await db
      .insert(inventory)
      .values(inventoryData)
      .returning();
    return created;
  }

  async updateInventoryItem(id: string, inventoryData: Partial<Inventory>): Promise<Inventory> {
    const [updated] = await db
      .update(inventory)
      .set(inventoryData)
      .where(eq(inventory.id, id))
      .returning();
    return updated;
  }

  async updateInventoryItemStatus(id: string, isActive: boolean): Promise<void> {
    await db.update(inventory).set({ isActive }).where(eq(inventory.id, id));
  }

  async getInventoryMovements(): Promise<any[]> {
    // For now, return empty array - would need to create inventory_movements table
    return [];
  }

  async createInventoryMovement(movementData: any): Promise<any> {
    // For now, just return the movement data - would need to create inventory_movements table
    return movementData;
  }

  // Table Management
  async getTables(): Promise<Table[]> {
    return await db.select().from(tables).orderBy(tables.number);
  }

  async createTable(tableData: InsertTable): Promise<Table> {
    const [created] = await db
      .insert(tables)
      .values(tableData)
      .returning();
    return created;
  }

  async updateTable(id: string, tableData: Partial<Table>): Promise<Table> {
    const [updated] = await db
      .update(tables)
      .set(tableData)
      .where(eq(tables.id, id))
      .returning();
    return updated;
  }

  async updateTableStatus(id: string, status: string): Promise<void> {
    await db.update(tables).set({ status }).where(eq(tables.id, id));
  }

  async updateTableActive(id: string, isActive: boolean): Promise<void> {
    await db.update(tables).set({ isActive }).where(eq(tables.id, id));
  }

  async getTableOrders(): Promise<any[]> {
    return await db.select({
      id: orders.id,
      tableNumber: orders.tableNumber,
      orderNumber: orders.orderNumber,
      customerName: orders.customerName,
      total: orders.total,
      status: orders.status,
      createdAt: orders.createdAt
    })
    .from(orders)
    .where(and(
      eq(orders.type, "dine-in"),
      // Only get orders from today
    ))
    .orderBy(desc(orders.createdAt));
  }

  // Shift Management
  async getShifts(): Promise<Shift[]> {
    return await db.select().from(shifts).orderBy(desc(shifts.startTime));
  }

  async getCurrentShift(): Promise<Shift | undefined> {
    const [shift] = await db.select().from(shifts).where(eq(shifts.status, "active"));
    return shift || undefined;
  }

  async startShift(shiftData: InsertShift): Promise<Shift> {
    const [created] = await db
      .insert(shifts)
      .values(shiftData)
      .returning();
    return created;
  }

  async endShift(id: string, endData: any): Promise<Shift> {
    const [updated] = await db
      .update(shifts)
      .set({
        endTime: new Date(),
        closingCash: endData.closingCash,
        notes: endData.notes,
        status: 'closed'
      })
      .where(eq(shifts.id, id))
      .returning();
    return updated;
  }

  // Settlement Management
  async getSettlements(): Promise<Settlement[]> {
    return await db.select().from(settlements).orderBy(desc(settlements.createdAt));
  }

  async createSettlement(settlementData: InsertSettlement): Promise<Settlement> {
    const [created] = await db
      .insert(settlements)
      .values(settlementData)
      .returning();
    return created;
  }

  async processSettlement(id: string): Promise<Settlement> {
    const [updated] = await db
      .update(settlements)
      .set({ status: 'completed' })
      .where(eq(settlements.id, id))
      .returning();
    return updated;
  }

  async getDeliverySummary(): Promise<any[]> {
    // Mock delivery summary data
    return [
      {
        id: '1',
        name: 'Talabat',
        orders: 25,
        totalAmount: 450.00,
        commission: 45.00,
        netAmount: 405.00,
        weekStart: new Date().toISOString(),
        weekEnd: new Date().toISOString(),
        status: 'pending'
      },
      {
        id: '2',
        name: 'Snoonu',
        orders: 18,
        totalAmount: 320.00,
        commission: 32.00,
        netAmount: 288.00,
        weekStart: new Date().toISOString(),
        weekEnd: new Date().toISOString(),
        status: 'pending'
      }
    ];
  }

  // Settings Management
  async getSettings(): Promise<any> {
    // Mock settings data
    return {
      id: '1',
      name: { en: 'Digital Kitchen', ar: 'المطبخ الرقمي' },
      address: 'Restaurant Address',
      phone: '+974 1234 5678',
      settings: {
        currency: 'QAR',
        taxRate: 0,
        serviceChargeRate: 0,
        language: 'en',
        timezone: 'Asia/Qatar',
        receiptFooter: 'Thank you for dining with us!',
        autoLogout: 30,
        enableNotifications: true,
        enableSounds: true,
        printerSettings: {
          receiptPrinter: '',
          kitchenPrinter: '',
          paperSize: '80mm'
        },
        deliverySettings: {
          talabatEnabled: true,
          snoouEnabled: true,
          deliverooEnabled: false,
          autoAcceptOrders: false
        },
        posSettings: {
          quickPayEnabled: true,
          splitBillEnabled: true,
          discountEnabled: true,
          refundEnabled: true
        }
      }
    };
  }

  async updateSettings(settingsData: any): Promise<any> {
    // For now, just return the settings data - would need to update stores table
    return settingsData;
  }

  async getKitchenOrders(): Promise<(Order & { items: OrderItem[] })[]> {
    const fourHoursAgo = new Date();
    fourHoursAgo.setHours(fourHoursAgo.getHours() - 4);
    
    console.log("Fetching kitchen orders from:", fourHoursAgo.toISOString());
    
    const ordersList = await db.select().from(orders)
      .where(or(
        eq(orders.status, "confirmed"),
        eq(orders.status, "ready")
      ))
      .orderBy(orders.createdAt);

    console.log("Found orders:", ordersList.length);

    const ordersWithItems = await Promise.all(
      ordersList.map(async (order) => {
        const orderItemsList = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
        return { ...order, items: orderItemsList };
      })
    );

    console.log("Orders with items:", ordersWithItems.length);
    return ordersWithItems;
  }

  // Reports & Analytics methods
  async getSalesReport(from: string, to: string, comparison: string): Promise<any> {
    try {
      // Current period data
      const currentPeriodOrders = await db
        .select()
        .from(orders)
        .where(
          and(
            eq(orders.status, 'completed'),
            sql`${orders.createdAt} >= ${from}::date`,
            sql`${orders.createdAt} <= ${to}::date + interval '1 day'`
          )
        );

      const totalRevenue = currentPeriodOrders.reduce((sum, order) => sum + parseFloat(order.total), 0);
      const totalOrders = currentPeriodOrders.length;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      const totalCustomers = new Set(currentPeriodOrders.map(order => order.customerPhone || order.customerName || `table-${order.tableNumber}`)).size;

      // Previous period for comparison
      let previousPeriodRevenue = 0;
      let previousPeriodOrders = 0;
      let revenueChange = 0;
      let ordersChange = 0;

      if (comparison === 'previous_period') {
        const daysDiff = Math.ceil((new Date(to).getTime() - new Date(from).getTime()) / (1000 * 60 * 60 * 24));
        const prevTo = new Date(from);
        prevTo.setDate(prevTo.getDate() - 1);
        const prevFrom = new Date(prevTo);
        prevFrom.setDate(prevFrom.getDate() - daysDiff);

        const previousOrders = await db
          .select()
          .from(orders)
          .where(
            and(
              eq(orders.status, 'completed'),
              sql`${orders.createdAt} >= ${prevFrom.toISOString().split('T')[0]}::date`,
              sql`${orders.createdAt} <= ${prevTo.toISOString().split('T')[0]}::date + interval '1 day'`
            )
          );

        previousPeriodRevenue = previousOrders.reduce((sum, order) => sum + parseFloat(order.total), 0);
        previousPeriodOrders = previousOrders.length;

        revenueChange = previousPeriodRevenue > 0 ? ((totalRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100 : 0;
        ordersChange = previousPeriodOrders > 0 ? ((totalOrders - previousPeriodOrders) / previousPeriodOrders) * 100 : 0;
      }

      return {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        totalCustomers,
        previousPeriodRevenue,
        previousPeriodOrders,
        revenueChange,
        ordersChange
      };
    } catch (error) {
      console.error('Error generating sales report:', error);
      return {
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        totalCustomers: 0,
        previousPeriodRevenue: 0,
        previousPeriodOrders: 0,
        revenueChange: 0,
        ordersChange: 0
      };
    }
  }

  async getTimeSeriesReport(from: string, to: string): Promise<any> {
    try {
      const ordersData = await db
        .select({
          date: sql`DATE(${orders.createdAt})`.as('date'),
          revenue: sql`SUM(${orders.total})`.as('revenue'),
          orders: sql`COUNT(*)`.as('orders'),
          customers: sql`COUNT(DISTINCT COALESCE(${orders.customerPhone}, ${orders.customerName}, CONCAT('table-', ${orders.tableNumber})))`.as('customers')
        })
        .from(orders)
        .where(
          and(
            eq(orders.status, 'completed'),
            sql`${orders.createdAt} >= ${from}::date`,
            sql`${orders.createdAt} <= ${to}::date + interval '1 day'`
          )
        )
        .groupBy(sql`DATE(${orders.createdAt})`)
        .orderBy(sql`DATE(${orders.createdAt})`);

      return ordersData.map(row => ({
        date: row.date,
        revenue: parseFloat(row.revenue as string) || 0,
        orders: parseInt(row.orders as string) || 0,
        customers: parseInt(row.customers as string) || 0
      }));
    } catch (error) {
      console.error('Error generating time series report:', error);
      return [];
    }
  }

  async getCategoryPerformanceReport(from: string, to: string): Promise<any> {
    try {
      const categoryData = await db
        .select({
          categoryId: categories.id,
          categoryName: categories.name,
          revenue: sql`SUM(${orderItems.totalPrice})`.as('revenue'),
          orders: sql`COUNT(DISTINCT ${orderItems.orderId})`.as('orders')
        })
        .from(orderItems)
        .innerJoin(items, eq(orderItems.itemId, items.id))
        .innerJoin(categories, eq(items.categoryId, categories.id))
        .innerJoin(orders, eq(orderItems.orderId, orders.id))
        .where(
          and(
            eq(orders.status, 'completed'),
            sql`${orders.createdAt} >= ${from}::date`,
            sql`${orders.createdAt} <= ${to}::date + interval '1 day'`
          )
        )
        .groupBy(categories.id, categories.name)
        .orderBy(sql`SUM(${orderItems.totalPrice}) DESC`);

      const totalRevenue = categoryData.reduce((sum, cat) => sum + parseFloat(cat.revenue as string), 0);

      return categoryData.map(cat => ({
        categoryId: cat.categoryId,
        categoryName: (cat.categoryName as any)?.en || 'Unknown Category',
        revenue: parseFloat(cat.revenue as string) || 0,
        orders: parseInt(cat.orders as string) || 0,
        percentage: totalRevenue > 0 ? (parseFloat(cat.revenue as string) / totalRevenue) * 100 : 0
      }));
    } catch (error) {
      console.error('Error generating category performance report:', error);
      return [];
    }
  }

  async getPaymentMethodReport(from: string, to: string): Promise<any> {
    try {
      const paymentData = await db
        .select({
          method: payments.method,
          amount: sql`SUM(${payments.amount})`.as('amount'),
          count: sql`COUNT(*)`.as('count')
        })
        .from(payments)
        .innerJoin(orders, eq(payments.orderId, orders.id))
        .where(
          and(
            eq(orders.status, 'completed'),
            sql`${orders.createdAt} >= ${from}::date`,
            sql`${orders.createdAt} <= ${to}::date + interval '1 day'`
          )
        )
        .groupBy(payments.method)
        .orderBy(sql`SUM(${payments.amount}) DESC`);

      const totalAmount = paymentData.reduce((sum, payment) => sum + parseFloat(payment.amount as string), 0);

      return paymentData.map(payment => ({
        method: payment.method,
        amount: parseFloat(payment.amount as string) || 0,
        count: parseInt(payment.count as string) || 0,
        percentage: totalAmount > 0 ? (parseFloat(payment.amount as string) / totalAmount) * 100 : 0
      }));
    } catch (error) {
      console.error('Error generating payment method report:', error);
      return [];
    }
  }

  async getTopItemsReport(from: string, to: string, limit: number): Promise<any> {
    try {
      const topItemsData = await db
        .select({
          itemId: orderItems.itemId,
          itemName: orderItems.itemName,
          quantity: sql`SUM(${orderItems.quantity})`.as('quantity'),
          revenue: sql`SUM(${orderItems.totalPrice})`.as('revenue')
        })
        .from(orderItems)
        .innerJoin(orders, eq(orderItems.orderId, orders.id))
        .where(
          and(
            eq(orders.status, 'completed'),
            sql`${orders.createdAt} >= ${from}::date`,
            sql`${orders.createdAt} <= ${to}::date + interval '1 day'`
          )
        )
        .groupBy(orderItems.itemId, orderItems.itemName)
        .orderBy(sql`SUM(${orderItems.quantity}) DESC`)
        .limit(limit);

      return topItemsData.map(item => ({
        itemId: item.itemId,
        itemName: (item.itemName as any)?.en || 'Unknown Item',
        quantity: parseInt(item.quantity as string) || 0,
        revenue: parseFloat(item.revenue as string) || 0
      }));
    } catch (error) {
      console.error('Error generating top items report:', error);
      return [];
    }
  }

  async getHourlyReport(from: string, to: string): Promise<any> {
    try {
      const hourlyData = await db
        .select({
          hour: sql`EXTRACT(hour FROM ${orders.createdAt})`.as('hour'),
          orders: sql`COUNT(*)`.as('orders'),
          revenue: sql`SUM(${orders.total})`.as('revenue')
        })
        .from(orders)
        .where(
          and(
            eq(orders.status, 'completed'),
            sql`${orders.createdAt} >= ${from}::date`,
            sql`${orders.createdAt} <= ${to}::date + interval '1 day'`
          )
        )
        .groupBy(sql`EXTRACT(hour FROM ${orders.createdAt})`)
        .orderBy(sql`EXTRACT(hour FROM ${orders.createdAt})`);

      // Fill in missing hours with zero values
      const fullHourlyData = Array.from({ length: 24 }, (_, hour) => {
        const existingData = hourlyData.find(data => parseInt(data.hour as string) === hour);
        return {
          hour,
          orders: existingData ? parseInt(existingData.orders as string) : 0,
          revenue: existingData ? parseFloat(existingData.revenue as string) : 0
        };
      });

      return fullHourlyData;
    } catch (error) {
      console.error('Error generating hourly report:', error);
      return Array.from({ length: 24 }, (_, hour) => ({ hour, orders: 0, revenue: 0 }));
    }
  }

  async getComprehensiveReport(from: string, to: string): Promise<any> {
    try {
      const [
        salesData,
        timeSeriesData,
        categoryData,
        paymentData,
        topItems,
        hourlyData
      ] = await Promise.all([
        this.getSalesReport(from, to, 'previous_period'),
        this.getTimeSeriesReport(from, to),
        this.getCategoryPerformanceReport(from, to),
        this.getPaymentMethodReport(from, to),
        this.getTopItemsReport(from, to, 10),
        this.getHourlyReport(from, to)
      ]);

      return {
        period: { from, to },
        summary: salesData,
        timeSeries: timeSeriesData,
        categories: categoryData,
        paymentMethods: paymentData,
        topItems,
        hourlyDistribution: hourlyData,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating comprehensive report:', error);
      return {
        period: { from, to },
        summary: {},
        timeSeries: [],
        categories: [],
        paymentMethods: [],
        topItems: [],
        hourlyDistribution: [],
        generatedAt: new Date().toISOString()
      };
    }
  }

  async seedData(): Promise<void> {
    // Check if data already exists
    const existingCategories = await db.select().from(categories).limit(1);
    const existingUsers = await db.select().from(users).limit(1);
    
    if (existingCategories.length > 0 && existingUsers.length > 0) {
      console.log("Data already seeded");
      return;
    }

    // Seed default users if they don't exist
    if (existingUsers.length === 0) {
      console.log("Seeding users...");
      
      const defaultUsers = [
        {
          username: 'admin',
          password: 'admin123', // In production, this should be hashed
          role: 'admin',
          firstName: 'System',
          lastName: 'Administrator',
          email: 'admin@restaurant.com',
          isActive: true
        },
        {
          username: 'manager',
          password: 'manager123',
          role: 'manager',
          firstName: 'Restaurant',
          lastName: 'Manager',
          email: 'manager@restaurant.com',
          isActive: true
        },
        {
          username: 'cashier',
          password: 'cashier123',
          role: 'cashier',
          firstName: 'POS',
          lastName: 'Cashier',
          email: 'cashier@restaurant.com',
          isActive: true
        }
      ];

      for (const userData of defaultUsers) {
        await db.insert(users).values(userData);
      }
      
      console.log("Users seeded successfully");
    }
    
    if (existingCategories.length > 0) return;

    // Seed categories
    const categoriesData = [
      { name: { en: "Drinks", ar: "المشروبات" }, icon: "fas fa-glass-water", sortOrder: 1 },
      { name: { en: "Bread", ar: "الخبز" }, icon: "fas fa-bread-slice", sortOrder: 2 },
      { name: { en: "Pizza", ar: "البيتزا" }, icon: "fas fa-pizza-slice", sortOrder: 3 },
      { name: { en: "Egyptian Mishaltet", ar: "المشلتّت المصري" }, icon: "fas fa-cookie", sortOrder: 4 },
      { name: { en: "Syrian Pastries", ar: "الفطائر الشامية" }, icon: "fas fa-seedling", sortOrder: 5 },
    ];

    const createdCategories = await Promise.all(
      categoriesData.map(async (cat) => {
        const [created] = await db.insert(categories).values(cat).returning();
        return created;
      })
    );

    // Seed items
    const itemsData = [
      // Drinks
      { 
        categoryId: createdCategories[0].id, 
        name: { en: "Water", ar: "ماء" }, 
        basePrice: "1.00",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        sortOrder: 1
      },
      { 
        categoryId: createdCategories[0].id, 
        name: { en: "Soft Drink", ar: "مشروبات غازية" }, 
        basePrice: "3.00",
        image: "https://images.unsplash.com/photo-1581006852262-e4307cf6283a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        sortOrder: 2
      },
      { 
        categoryId: createdCategories[0].id, 
        name: { en: "Fresh Juice", ar: "عصير طازج" }, 
        basePrice: "5.00",
        image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        sortOrder: 3
      },
      { 
        categoryId: createdCategories[0].id, 
        name: { en: "Arabic Coffee", ar: "قهوة عربية" }, 
        basePrice: "4.00",
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        sortOrder: 4
      },
      { 
        categoryId: createdCategories[0].id, 
        name: { en: "Karak Tea", ar: "شاي كرك" }, 
        basePrice: "3.00",
        image: "https://images.unsplash.com/photo-1597318121491-754d76e1da9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        sortOrder: 5
      },

      // Bread
      { 
        categoryId: createdCategories[1].id, 
        name: { en: "Tandoor Bread (3 pcs)", ar: "خبز تنّور (٣ قطع)" }, 
        basePrice: "1.00",
        image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        sortOrder: 1
      },

      // Pizza (with sizes)
      { 
        categoryId: createdCategories[2].id, 
        name: { en: "Margherita Pizza", ar: "بيتزا مارغريتا" }, 
        basePrice: "20.00",
        hasSizes: true,
        image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        sortOrder: 1
      },
      { 
        categoryId: createdCategories[2].id, 
        name: { en: "Vegetable Pizza", ar: "بيتزا خضار" }, 
        basePrice: "20.00",
        hasSizes: true,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        sortOrder: 2
      },
      { 
        categoryId: createdCategories[2].id, 
        name: { en: "Chicken Pizza", ar: "بيتزا دجاج" }, 
        basePrice: "20.00",
        hasSizes: true,
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        sortOrder: 3
      },
      { 
        categoryId: createdCategories[2].id, 
        name: { en: "Meat Pizza", ar: "بيتزا لحم" }, 
        basePrice: "20.00",
        hasSizes: true,
        image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        sortOrder: 4
      },

      // Mishaltet (with sizes)
      { 
        categoryId: createdCategories[3].id, 
        name: { en: "Plain Mishaltet", ar: "مشلتّت سادة" }, 
        basePrice: "20.00",
        hasSizes: true,
        image: "https://images.unsplash.com/photo-1549312420-a2b544d5346b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        sortOrder: 1
      },
      { 
        categoryId: createdCategories[3].id, 
        name: { en: "Honey & Cheese", ar: "عسل وجبنة" }, 
        basePrice: "20.00",
        hasSizes: true,
        image: "https://images.unsplash.com/photo-1607854980393-89bae9b2e70c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        sortOrder: 2
      },
      { 
        categoryId: createdCategories[3].id, 
        name: { en: "Honey & Cream", ar: "عسل وقشطة" }, 
        basePrice: "20.00",
        hasSizes: true,
        image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        sortOrder: 3
      },

      // Pastries
      { 
        categoryId: createdCategories[4].id, 
        name: { en: "Zaatar Pie", ar: "فطيرة زعتر" }, 
        basePrice: "5.00",
        image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        sortOrder: 1
      },
      { 
        categoryId: createdCategories[4].id, 
        name: { en: "Cheese Pie", ar: "فطيرة جبنة" }, 
        basePrice: "6.00",
        image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        sortOrder: 2
      },
      { 
        categoryId: createdCategories[4].id, 
        name: { en: "Spinach Pie", ar: "فطيرة سبانخ" }, 
        basePrice: "5.00",
        image: "https://images.unsplash.com/photo-1577303935007-0d306ee4d985?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        sortOrder: 3
      },
      { 
        categoryId: createdCategories[4].id, 
        name: { en: "Meat Pie", ar: "فطيرة لحم" }, 
        basePrice: "6.00",
        image: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
        sortOrder: 4
      },
    ];

    const createdItems = await Promise.all(
      itemsData.map(async (item) => {
        const [created] = await db.insert(items).values(item).returning();
        return created;
      })
    );

    // Seed sizes for items that have sizes
    const sizesData: Array<{
      itemId: string;
      name: { en: string; ar: string };
      price: string;
      sortOrder: number;
    }> = [];
    createdItems.forEach((item) => {
      if (item.hasSizes) {
        sizesData.push(
          { itemId: item.id, name: { en: "Small (S)", ar: "صغير" }, price: item.basePrice, sortOrder: 1 },
          { itemId: item.id, name: { en: "Medium (M)", ar: "وسط" }, price: "30.00", sortOrder: 2 }
        );
      }
    });

    if (sizesData.length > 0) {
      await db.insert(itemSizes).values(sizesData);
    }

    console.log("Seed data created successfully");
  }
}

export const storage = new DatabaseStorage();
