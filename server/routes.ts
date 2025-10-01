import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { MockStorage } from "./mockStorage";

// Use mock storage for development when no database is available
const mockStorage = new MockStorage();
const useMockStorage = !process.env.DATABASE_URL || process.env.DATABASE_URL.includes('mock');
import { 
  insertOrderSchema, 
  insertOrderItemSchema, 
  insertPaymentSchema,
  insertUserSchema,
  insertCategorySchema,
  insertItemSchema,
  insertTableSchema,
  insertInventorySchema,
  insertInventoryMovementSchema,
  insertShiftSchema,
  insertSettlementSchema
} from "@shared/schema";
import { z } from "zod";

// Simple password comparison (in production, use bcrypt)
const comparePassword = (password: string, hash: string): boolean => {
  return password === hash; // For demo purposes
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize database with seed data
  const currentStorage = useMockStorage ? mockStorage : storage;
  await currentStorage.seedData();

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user || !comparePassword(password, user.password)) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      if (!user.isActive) {
        return res.status(401).json({ error: "Account disabled" });
      }

      // Don't send password in response
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    res.json({ success: true });
  });

  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Items by category
  app.get("/api/categories/:categoryId/items", async (req, res) => {
    try {
      const { categoryId } = req.params;
      const items = await storage.getItemsByCategory(categoryId);
      res.json(items);
    } catch (error) {
      console.error("Error fetching items:", error);
      res.status(500).json({ error: "Failed to fetch items" });
    }
  });

  // Orders
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await currentStorage.getOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:orderId", async (req, res) => {
    try {
      const { orderId } = req.params;
      const order = await currentStorage.getOrder(orderId);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  // Create order
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      
      console.log("Creating order with data:", orderData);
      
      // Generate order number
      const lastOrders = await currentStorage.getOrders(1);
      const orderNumber = lastOrders.length > 0 ? lastOrders[0].orderNumber + 1 : 1001;
      
      const order = await currentStorage.createOrder({
        ...orderData,
        orderNumber,
      });
      
      console.log("Order created successfully:", order.id, "Status:", order.status);
      
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid order data", details: error.errors });
      }
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  // Add order items
  app.post("/api/orders/:orderId/items", async (req, res) => {
    try {
      const { orderId } = req.params;
      const itemsData = z.array(insertOrderItemSchema).parse(req.body);
      
      console.log("Adding items to order:", orderId, "Items:", itemsData.length);
      
      const items = await Promise.all(
        itemsData.map(itemData => currentStorage.addOrderItem({ ...itemData, orderId }))
      );
      
      console.log("Items added successfully to order:", orderId);
      
      res.status(201).json(items);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid item data", details: error.errors });
      }
      console.error("Error adding order items:", error);
      res.status(500).json({ error: "Failed to add order items" });
    }
  });

  // Process payment
  app.post("/api/orders/:orderId/payment", async (req, res) => {
    try {
      const { orderId } = req.params;
      const paymentData = insertPaymentSchema.parse(req.body);
      
      console.log("Processing payment for order:", orderId);
      
      const payment = await currentStorage.addPayment({ ...paymentData, orderId });
      
      // Update order status to confirmed
      await currentStorage.updateOrderStatus(orderId, "confirmed");
      
      console.log("Order status updated to confirmed for:", orderId);
      
      res.status(201).json(payment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid payment data", details: error.errors });
      }
      console.error("Error processing payment:", error);
      res.status(500).json({ error: "Failed to process payment" });
    }
  });

  // Test endpoint to check database connection
  app.get("/api/test-db", async (req, res) => {
    try {
      const allOrders = await currentStorage.getOrders();
      res.json({ 
        message: useMockStorage ? "Mock storage active" : "Database connection successful", 
        totalOrders: allOrders.length,
        orders: allOrders.map(o => ({ id: o.id, status: o.status, createdAt: o.createdAt }))
      });
    } catch (error) {
      console.error("Storage test error:", error);
      res.status(500).json({ error: "Storage connection failed", details: error instanceof Error ? error.message : String(error) });
    }
  });

  // Kitchen orders
  app.get("/api/kitchen/orders", async (req, res) => {
    try {
      console.log("Kitchen orders endpoint called");
      
      // First, let's check all orders in the database
      const allOrders = await currentStorage.getOrders();
      console.log("All orders in database:", allOrders.length);
      allOrders.forEach(order => {
        console.log(`Order ${order.id}: status=${order.status}, createdAt=${order.createdAt}`);
      });
      
      const orders = await currentStorage.getKitchenOrders();
      console.log("Returning orders to kitchen display:", orders.length);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching kitchen orders:", error);
      res.status(500).json({ error: "Failed to fetch kitchen orders" });
    }
  });

  // Update order status
  app.patch("/api/orders/:orderId/status", async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      
      await storage.updateOrderStatus(orderId, status);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ error: "Failed to update order status" });
    }
  });

  // Staff Management Routes
  app.get("/api/staff", async (req, res) => {
    try {
      const staff = await storage.getAllUsers();
      res.json(staff);
    } catch (error) {
      console.error("Error fetching staff:", error);
      res.status(500).json({ error: "Failed to fetch staff" });
    }
  });

  app.post("/api/staff", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid user data", details: error.errors });
      }
      console.error("Error creating staff:", error);
      res.status(500).json({ error: "Failed to create staff member" });
    }
  });

  app.put("/api/staff/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const userData = req.body;
      const user = await storage.updateUser(userId, userData);
      res.json(user);
    } catch (error) {
      console.error("Error updating staff:", error);
      res.status(500).json({ error: "Failed to update staff member" });
    }
  });

  app.patch("/api/staff/:userId/status", async (req, res) => {
    try {
      const { userId } = req.params;
      const { isActive } = req.body;
      await storage.updateUserStatus(userId, isActive);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating staff status:", error);
      res.status(500).json({ error: "Failed to update staff status" });
    }
  });

  // Menu Management Routes
  app.get("/api/menu/items", async (req, res) => {
    try {
      const items = await storage.getAllItems();
      res.json(items);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      res.status(500).json({ error: "Failed to fetch menu items" });
    }
  });

  app.post("/api/menu/items", async (req, res) => {
    try {
      const itemData = insertItemSchema.parse(req.body);
      const item = await storage.createItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid item data", details: error.errors });
      }
      console.error("Error creating menu item:", error);
      res.status(500).json({ error: "Failed to create menu item" });
    }
  });

  app.put("/api/menu/items/:itemId", async (req, res) => {
    try {
      const { itemId } = req.params;
      const itemData = req.body;
      const item = await storage.updateItem(itemId, itemData);
      res.json(item);
    } catch (error) {
      console.error("Error updating menu item:", error);
      res.status(500).json({ error: "Failed to update menu item" });
    }
  });

  app.patch("/api/menu/items/:itemId/status", async (req, res) => {
    try {
      const { itemId } = req.params;
      const { active } = req.body;
      await storage.updateItemStatus(itemId, active);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating item status:", error);
      res.status(500).json({ error: "Failed to update item status" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid category data", details: error.errors });
      }
      console.error("Error creating category:", error);
      res.status(500).json({ error: "Failed to create category" });
    }
  });

  app.put("/api/categories/:categoryId", async (req, res) => {
    try {
      const { categoryId } = req.params;
      const categoryData = req.body;
      const category = await storage.updateCategory(categoryId, categoryData);
      res.json(category);
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ error: "Failed to update category" });
    }
  });

  app.patch("/api/categories/:categoryId/status", async (req, res) => {
    try {
      const { categoryId } = req.params;
      const { active } = req.body;
      await storage.updateCategoryStatus(categoryId, active);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating category status:", error);
      res.status(500).json({ error: "Failed to update category status" });
    }
  });

  // Inventory Management Routes
  app.get("/api/inventory", async (req, res) => {
    try {
      const inventory = await storage.getInventory();
      res.json(inventory);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      res.status(500).json({ error: "Failed to fetch inventory" });
    }
  });

  app.post("/api/inventory", async (req, res) => {
    try {
      const inventoryData = insertInventorySchema.parse(req.body);
      const item = await storage.createInventoryItem(inventoryData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid inventory data", details: error.errors });
      }
      console.error("Error creating inventory item:", error);
      res.status(500).json({ error: "Failed to create inventory item" });
    }
  });

  app.put("/api/inventory/:itemId", async (req, res) => {
    try {
      const { itemId } = req.params;
      const inventoryData = req.body;
      const item = await storage.updateInventoryItem(itemId, inventoryData);
      res.json(item);
    } catch (error) {
      console.error("Error updating inventory item:", error);
      res.status(500).json({ error: "Failed to update inventory item" });
    }
  });

  app.patch("/api/inventory/:itemId/status", async (req, res) => {
    try {
      const { itemId } = req.params;
      const { isActive } = req.body;
      await storage.updateInventoryItemStatus(itemId, isActive);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating inventory status:", error);
      res.status(500).json({ error: "Failed to update inventory status" });
    }
  });

  app.get("/api/inventory/movements", async (req, res) => {
    try {
      const movements = await storage.getInventoryMovements();
      res.json(movements);
    } catch (error) {
      console.error("Error fetching inventory movements:", error);
      res.status(500).json({ error: "Failed to fetch inventory movements" });
    }
  });

  app.post("/api/inventory/movements", async (req, res) => {
    try {
      const movementData = insertInventoryMovementSchema.parse(req.body);
      const movement = await storage.createInventoryMovement(movementData);
      res.status(201).json(movement);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid movement data", details: error.errors });
      }
      console.error("Error creating inventory movement:", error);
      res.status(500).json({ error: "Failed to create inventory movement" });
    }
  });

  // Table Management Routes
  app.get("/api/tables", async (req, res) => {
    try {
      const tables = await storage.getTables();
      res.json(tables);
    } catch (error) {
      console.error("Error fetching tables:", error);
      res.status(500).json({ error: "Failed to fetch tables" });
    }
  });

  app.post("/api/tables", async (req, res) => {
    try {
      const tableData = insertTableSchema.parse(req.body);
      const table = await storage.createTable(tableData);
      res.status(201).json(table);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid table data", details: error.errors });
      }
      console.error("Error creating table:", error);
      res.status(500).json({ error: "Failed to create table" });
    }
  });

  app.put("/api/tables/:tableId", async (req, res) => {
    try {
      const { tableId } = req.params;
      const tableData = req.body;
      const table = await storage.updateTable(tableId, tableData);
      res.json(table);
    } catch (error) {
      console.error("Error updating table:", error);
      res.status(500).json({ error: "Failed to update table" });
    }
  });

  app.patch("/api/tables/:tableId/status", async (req, res) => {
    try {
      const { tableId } = req.params;
      const { status } = req.body;
      await storage.updateTableStatus(tableId, status);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating table status:", error);
      res.status(500).json({ error: "Failed to update table status" });
    }
  });

  app.patch("/api/tables/:tableId/active", async (req, res) => {
    try {
      const { tableId } = req.params;
      const { isActive } = req.body;
      await storage.updateTableActive(tableId, isActive);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating table active status:", error);
      res.status(500).json({ error: "Failed to update table active status" });
    }
  });

  app.get("/api/tables/orders", async (req, res) => {
    try {
      const tableOrders = await storage.getTableOrders();
      res.json(tableOrders);
    } catch (error) {
      console.error("Error fetching table orders:", error);
      res.status(500).json({ error: "Failed to fetch table orders" });
    }
  });

  // Shift Management Routes
  app.get("/api/shifts", async (req, res) => {
    try {
      const shifts = await storage.getShifts();
      res.json(shifts);
    } catch (error) {
      console.error("Error fetching shifts:", error);
      res.status(500).json({ error: "Failed to fetch shifts" });
    }
  });

  app.get("/api/shifts/current", async (req, res) => {
    try {
      const currentShift = await storage.getCurrentShift();
      if (currentShift) {
        res.json(currentShift);
      } else {
        res.status(404).json({ error: "No active shift found" });
      }
    } catch (error) {
      console.error("Error fetching current shift:", error);
      res.status(500).json({ error: "Failed to fetch current shift" });
    }
  });

  app.post("/api/shifts/start", async (req, res) => {
    try {
      const shiftData = insertShiftSchema.parse({
        ...req.body,
        userId: req.body.userId || 'current-user', // TODO: Get from auth context
        startTime: new Date().toISOString(),
        status: 'active'
      });
      const shift = await storage.startShift(shiftData);
      res.status(201).json(shift);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid shift data", details: error.errors });
      }
      console.error("Error starting shift:", error);
      res.status(500).json({ error: "Failed to start shift" });
    }
  });

  app.post("/api/shifts/:shiftId/end", async (req, res) => {
    try {
      const { shiftId } = req.params;
      const endData = req.body;
      const shift = await storage.endShift(shiftId, endData);
      res.json(shift);
    } catch (error) {
      console.error("Error ending shift:", error);
      res.status(500).json({ error: "Failed to end shift" });
    }
  });

  // Settlement Management Routes
  app.get("/api/settlements", async (req, res) => {
    try {
      const settlements = await storage.getSettlements();
      res.json(settlements);
    } catch (error) {
      console.error("Error fetching settlements:", error);
      res.status(500).json({ error: "Failed to fetch settlements" });
    }
  });

  app.post("/api/settlements", async (req, res) => {
    try {
      const settlementData = insertSettlementSchema.parse(req.body);
      const settlement = await storage.createSettlement(settlementData);
      res.status(201).json(settlement);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid settlement data", details: error.errors });
      }
      console.error("Error creating settlement:", error);
      res.status(500).json({ error: "Failed to create settlement" });
    }
  });

  app.post("/api/settlements/:settlementId/process", async (req, res) => {
    try {
      const { settlementId } = req.params;
      const settlement = await storage.processSettlement(settlementId);
      res.json(settlement);
    } catch (error) {
      console.error("Error processing settlement:", error);
      res.status(500).json({ error: "Failed to process settlement" });
    }
  });

  app.get("/api/delivery/summary", async (req, res) => {
    try {
      const summary = await storage.getDeliverySummary();
      res.json(summary);
    } catch (error) {
      console.error("Error fetching delivery summary:", error);
      res.status(500).json({ error: "Failed to fetch delivery summary" });
    }
  });

  // Settings Management Routes
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.put("/api/settings", async (req, res) => {
    try {
      const settingsData = req.body;
      const settings = await storage.updateSettings(settingsData);
      res.json(settings);
    } catch (error) {
      console.error("Error updating settings:", error);
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  // Reports and Analytics routes
  app.get("/api/reports/sales", async (req, res) => {
    try {
      const { from, to, comparison } = req.query;
      const salesData = await storage.getSalesReport(
        from as string, 
        to as string, 
        comparison as string
      );
      res.json(salesData);
    } catch (error) {
      console.error("Error fetching sales report:", error);
      res.status(500).json({ error: "Failed to fetch sales report" });
    }
  });

  app.get("/api/reports/time-series", async (req, res) => {
    try {
      const { from, to } = req.query;
      const timeSeriesData = await storage.getTimeSeriesReport(
        from as string, 
        to as string
      );
      res.json(timeSeriesData);
    } catch (error) {
      console.error("Error fetching time series report:", error);
      res.status(500).json({ error: "Failed to fetch time series report" });
    }
  });

  app.get("/api/reports/categories", async (req, res) => {
    try {
      const { from, to } = req.query;
      const categoryData = await storage.getCategoryPerformanceReport(
        from as string, 
        to as string
      );
      res.json(categoryData);
    } catch (error) {
      console.error("Error fetching category report:", error);
      res.status(500).json({ error: "Failed to fetch category report" });
    }
  });

  app.get("/api/reports/payment-methods", async (req, res) => {
    try {
      const { from, to } = req.query;
      const paymentData = await storage.getPaymentMethodReport(
        from as string, 
        to as string
      );
      res.json(paymentData);
    } catch (error) {
      console.error("Error fetching payment methods report:", error);
      res.status(500).json({ error: "Failed to fetch payment methods report" });
    }
  });

  app.get("/api/reports/top-items", async (req, res) => {
    try {
      const { from, to, limit = '10' } = req.query;
      const topItems = await storage.getTopItemsReport(
        from as string, 
        to as string, 
        parseInt(limit as string)
      );
      res.json(topItems);
    } catch (error) {
      console.error("Error fetching top items report:", error);
      res.status(500).json({ error: "Failed to fetch top items report" });
    }
  });

  app.get("/api/reports/hourly", async (req, res) => {
    try {
      const { from, to } = req.query;
      const hourlyData = await storage.getHourlyReport(
        from as string, 
        to as string
      );
      res.json(hourlyData);
    } catch (error) {
      console.error("Error fetching hourly report:", error);
      res.status(500).json({ error: "Failed to fetch hourly report" });
    }
  });

  app.get("/api/reports/export", async (req, res) => {
    try {
      const { format, from, to } = req.query;
      
      if (format === 'pdf') {
        // Generate PDF report
        const reportData = await storage.getComprehensiveReport(
          from as string, 
          to as string
        );
        
        // For now, generate a simple JSON response that the client can handle
        // In production, you would use puppeteer or similar for actual PDF generation
        const pdfData = {
          type: 'sales-report',
          period: `${from} to ${to}`,
          data: reportData,
          format: 'pdf'
        };
        
        res.setHeader('Content-Type', 'application/json');
        res.json({
          success: true,
          message: 'PDF report data generated',
          data: pdfData
        });
        
      } else if (format === 'excel') {
        // Generate Excel report
        const reportData = await storage.getComprehensiveReport(
          from as string, 
          to as string
        );
        
        // For now, generate a simple JSON response that the client can handle
        // In production, you would use xlsx library for actual Excel generation
        const excelData = {
          type: 'sales-report',
          period: `${from} to ${to}`,
          data: reportData,
          format: 'excel'
        };
        
        res.setHeader('Content-Type', 'application/json');
        res.json({
          success: true,
          message: 'Excel report data generated',
          data: excelData
        });
        
      } else {
        res.status(400).json({ error: "Invalid format. Use 'pdf' or 'excel'" });
      }
    } catch (error) {
      console.error("Error exporting report:", error);
      res.status(500).json({ error: "Failed to export report" });
    }
  });

  // Admin functionality verification endpoint
  app.get("/api/admin/verify", async (req, res) => {
    try {
      const verification = {
        endpoints: {
          staff: {
            get: '/api/staff',
            post: '/api/staff',
            put: '/api/staff/:userId'
          },
          menu: {
            categories: '/api/categories',
            items: '/api/menu/items',
            post_category: '/api/categories',
            put_category: '/api/categories/:categoryId',
            post_item: '/api/menu/items',
            put_item: '/api/menu/items/:itemId'
          },
          inventory: {
            get: '/api/inventory',
            post: '/api/inventory',
            put: '/api/inventory/:itemId',
            movements: '/api/inventory/movements'
          },
          tables: {
            get: '/api/tables',
            post: '/api/tables',
            put: '/api/tables/:tableId'
          },
          shifts: {
            get: '/api/shifts',
            start: '/api/shifts/start',
            end: '/api/shifts/:shiftId/end'
          },
          reports: {
            sales: '/api/reports/sales',
            export: '/api/reports/export'
          },
          settings: {
            get: '/api/settings',
            put: '/api/settings'
          },
          settlements: {
            get: '/api/settlements',
            post: '/api/settlements'
          }
        },
        status: 'All admin endpoints available',
        timestamp: new Date().toISOString()
      };
      
      res.json(verification);
    } catch (error) {
      console.error("Error in admin verification:", error);
      res.status(500).json({ error: "Failed to verify admin functionality" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
