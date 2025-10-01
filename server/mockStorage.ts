import type { 
  User, InsertUser, Category, InsertCategory,
  Item, InsertItem, ItemSize, Modifier,
  Order, InsertOrder, OrderItem, InsertOrderItem,
  Payment, InsertPayment, Table, InsertTable,
  Inventory, InsertInventory, Shift, InsertShift,
  Settlement, InsertSettlement
} from "@shared/schema";

// Mock data storage
let mockOrders: Order[] = [];
let mockOrderItems: OrderItem[] = [];
let mockPayments: Payment[] = [];
let mockCategories: Category[] = [];
let mockItems: Item[] = [];
let mockUsers: User[] = [];
let mockTables: Table[] = [];

export class MockStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    return mockUsers.find(u => u.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return mockUsers.find(u => u.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser = {
      id: `user_${Date.now()}`,
      ...user,
      createdAt: new Date(),
      isActive: true
    };
    mockUsers.push(newUser);
    return newUser;
  }

  async getAllUsers(): Promise<User[]> {
    return mockUsers;
  }

  async updateUser(id: string, user: Partial<User>): Promise<User> {
    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) throw new Error("User not found");
    mockUsers[index] = { ...mockUsers[index], ...user };
    return mockUsers[index];
  }

  async updateUserStatus(id: string, isActive: boolean): Promise<void> {
    const user = mockUsers.find(u => u.id === id);
    if (user) user.isActive = isActive;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return mockCategories;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const newCategory = {
      id: `cat_${Date.now()}`,
      ...category,
      active: true,
      createdAt: new Date()
    };
    mockCategories.push(newCategory);
    return newCategory;
  }

  async updateCategory(id: string, category: Partial<Category>): Promise<Category> {
    const index = mockCategories.findIndex(c => c.id === id);
    if (index === -1) throw new Error("Category not found");
    mockCategories[index] = { ...mockCategories[index], ...category };
    return mockCategories[index];
  }

  async updateCategoryStatus(id: string, active: boolean): Promise<void> {
    const category = mockCategories.find(c => c.id === id);
    if (category) category.active = active;
  }

  // Items
  async getItemsByCategory(categoryId: string): Promise<(Item & { sizes: ItemSize[]; modifiers: Modifier[] })[]> {
    const items = mockItems.filter(item => item.categoryId === categoryId);
    return items.map(item => ({ ...item, sizes: [], modifiers: [] }));
  }

  async getItem(id: string): Promise<Item | undefined> {
    return mockItems.find(item => item.id === id);
  }

  async createItem(item: InsertItem): Promise<Item> {
    const newItem = {
      id: `item_${Date.now()}`,
      ...item,
      active: true,
      createdAt: new Date()
    };
    mockItems.push(newItem);
    return newItem;
  }

  async getAllItems(): Promise<Item[]> {
    return mockItems;
  }

  async updateItem(id: string, item: Partial<Item>): Promise<Item> {
    const index = mockItems.findIndex(i => i.id === id);
    if (index === -1) throw new Error("Item not found");
    mockItems[index] = { ...mockItems[index], ...item };
    return mockItems[index];
  }

  async updateItemStatus(id: string, active: boolean): Promise<void> {
    const item = mockItems.find(i => i.id === id);
    if (item) item.active = active;
  }

  // Orders
  async getOrders(limit = 50): Promise<Order[]> {
    return mockOrders.slice(0, limit);
  }

  async getOrder(id: string): Promise<(Order & { items: OrderItem[] }) | undefined> {
    const order = mockOrders.find(o => o.id === id);
    if (!order) return undefined;
    const items = mockOrderItems.filter(item => item.orderId === id);
    return { ...order, items };
  }

  async createOrder(order: any): Promise<Order> {
    const newOrder = {
      id: `order_${Date.now()}`,
      orderNumber: mockOrders.length + 1001,
      ...order,
      status: "pending",
      createdAt: new Date()
    };
    mockOrders.push(newOrder);
    console.log("Mock order created:", newOrder.id, "Status:", newOrder.status);
    return newOrder;
  }

  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    const order = mockOrders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      console.log("Mock order status updated:", orderId, "to", status);
    }
  }

  // Order Items
  async addOrderItem(orderItem: any): Promise<OrderItem> {
    const newItem = {
      id: `item_${Date.now()}`,
      ...orderItem,
      createdAt: new Date()
    };
    mockOrderItems.push(newItem);
    console.log("Mock order item added:", newItem.id, "to order:", orderItem.orderId);
    return newItem;
  }

  // Payments
  async addPayment(payment: any): Promise<Payment> {
    const newPayment = {
      id: `payment_${Date.now()}`,
      ...payment,
      createdAt: new Date()
    };
    mockPayments.push(newPayment);
    console.log("Mock payment added:", newPayment.id, "for order:", payment.orderId);
    return newPayment;
  }

  // Kitchen orders
  async getKitchenOrders(): Promise<(Order & { items: OrderItem[] })[]> {
    const fourHoursAgo = new Date();
    fourHoursAgo.setHours(fourHoursAgo.getHours() - 4);
    
    console.log("Mock: Fetching kitchen orders from:", fourHoursAgo.toISOString());
    
    const confirmedOrders = mockOrders.filter(order => 
      order.status === "confirmed" && 
      order.createdAt && 
      new Date(order.createdAt) >= fourHoursAgo
    );
    
    console.log("Mock: Found confirmed orders:", confirmedOrders.length);
    
    const ordersWithItems = confirmedOrders.map(order => {
      const items = mockOrderItems.filter(item => item.orderId === order.id);
      return { ...order, items };
    });
    
    console.log("Mock: Orders with items:", ordersWithItems.length);
    return ordersWithItems;
  }

  // Mock implementations for other methods
  async getTables(): Promise<Table[]> {
    return mockTables;
  }

  async createTable(table: InsertTable): Promise<Table> {
    const newTable: Table = {
      id: `table_${Date.now()}`,
      ...table,
    };
    mockTables.push(newTable);
    return newTable;
  }

  async updateTable(id: string, table: Partial<Table>): Promise<Table> {
    const index = mockTables.findIndex(t => t.id === id);
    if (index === -1) throw new Error("Table not found");
    mockTables[index] = { ...mockTables[index], ...table };
    return mockTables[index];
  }

  async updateTableStatus(id: string, status: string): Promise<void> {
    const table = mockTables.find(t => t.id === id);
    if (table) table.status = status;
  }

  async updateTableActive(id: string, isActive: boolean): Promise<void> {
    const table = mockTables.find(t => t.id === id);
    if (table) table.isActive = isActive;
  }

  async getTableOrders(): Promise<any[]> { return []; }

  async getInventory(): Promise<Inventory[]> { return []; }
  async createInventoryItem(item: InsertInventory): Promise<Inventory> { return {} as Inventory; }
  async updateInventoryItem(id: string, item: Partial<Inventory>): Promise<Inventory> { return {} as Inventory; }
  async updateInventoryItemStatus(id: string, isActive: boolean): Promise<void> {}
  async getInventoryMovements(): Promise<any[]> { return []; }
  async createInventoryMovement(movement: any): Promise<any> { return movement; }

  async getShifts(): Promise<Shift[]> { return []; }
  async getCurrentShift(): Promise<Shift | undefined> { return undefined; }
  async startShift(shift: InsertShift): Promise<Shift> { return {} as Shift; }
  async endShift(id: string, endData: any): Promise<Shift> { return {} as Shift; }

  async getSettlements(): Promise<Settlement[]> { return []; }
  async createSettlement(settlement: InsertSettlement): Promise<Settlement> { return {} as Settlement; }
  async processSettlement(id: string): Promise<Settlement> { return {} as Settlement; }
  async getDeliverySummary(): Promise<any[]> { return []; }

  async getSettings(): Promise<any> { return {}; }
  async updateSettings(settings: any): Promise<any> { return settings; }

  async getSalesReport(from: string, to: string, comparison: string): Promise<any> { return {}; }
  async getTimeSeriesReport(from: string, to: string): Promise<any> { return []; }
  async getCategoryPerformanceReport(from: string, to: string): Promise<any> { return []; }
  async getPaymentMethodReport(from: string, to: string): Promise<any> { return []; }
  async getTopItemsReport(from: string, to: string, limit: number): Promise<any> { return []; }
  async getHourlyReport(from: string, to: string): Promise<any> { return []; }
  async getComprehensiveReport(from: string, to: string): Promise<any> { return {}; }

  async seedData(): Promise<void> {
    console.log("Mock storage: Seeding data...");
    
    // Create some mock categories
    mockCategories = [
      {
        id: "cat_1",
        name: { en: "Drinks", ar: "المشروبات" },
        icon: "fas fa-glass-water",
        sortOrder: 1,
        active: true,
        createdAt: new Date()
      },
      {
        id: "cat_2", 
        name: { en: "Pizza", ar: "البيتزا" },
        icon: "fas fa-pizza-slice",
        sortOrder: 2,
        active: true,
        createdAt: new Date()
      }
    ];

    // Create some mock items
    mockItems = [
      {
        id: "item_1",
        categoryId: "cat_1",
        name: { en: "Water", ar: "ماء" },
        basePrice: "1.00",
        image: "",
        hasSizes: false,
        sortOrder: 1,
        active: true,
        createdAt: new Date()
      },
      {
        id: "item_2",
        categoryId: "cat_2",
        name: { en: "Margherita Pizza", ar: "بيتزا مارغريتا" },
        basePrice: "20.00",
        image: "",
        hasSizes: true,
        sortOrder: 1,
        active: true,
        createdAt: new Date()
      }
    ];

    // Create some mock users
    mockUsers = [
      {
        id: "user_1",
        username: "admin",
        password: "admin123",
        role: "admin",
        firstName: "Admin",
        lastName: "User",
        email: "admin@test.com",
        isActive: true,
        createdAt: new Date()
      }
    ];

    console.log("Mock storage: Data seeded successfully");
  }
}
