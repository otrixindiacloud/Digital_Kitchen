import 'dotenv/config';
import { db } from './server/db.js';
import { users, stores, categories, items, itemSizes, modifiers, itemModifiers, tables } from './shared/schema.js';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Create a default store
    console.log('📍 Creating default store...');
    await db.insert(stores).values({
      name: { en: 'Al Matbakh Ar Raqami', ar: 'المطبخ الرقمي' },
      address: '123 Main Street, Qatar',
      phone: '+974 1234 5678',
      settings: {
        currency: 'QAR',
        serviceCharge: 10,
        vatRate: 0,
        language: 'ar'
      }
    });

    // Create default admin user
    console.log('👤 Creating default admin user...');
    await db.insert(users).values({
      username: 'admin',
      password: 'admin123', // In production, this should be hashed
      role: 'admin',
      firstName: 'System',
      lastName: 'Administrator',
      email: 'admin@matbakh.com',
      isActive: true
    });

    // Create categories
    console.log('📂 Creating categories...');
    const categoryData = [
      {
        name: { en: 'Appetizers', ar: 'المقبلات' },
        icon: '🥗',
        sortOrder: 1
      },
      {
        name: { en: 'Main Courses', ar: 'الأطباق الرئيسية' },
        icon: '🍽️',
        sortOrder: 2
      },
      {
        name: { en: 'Grilled Items', ar: 'المشاوي' },
        icon: '🔥',
        sortOrder: 3
      },
      {
        name: { en: 'Beverages', ar: 'المشروبات' },
        icon: '🥤',
        sortOrder: 4
      },
      {
        name: { en: 'Desserts', ar: 'الحلويات' },
        icon: '🍰',
        sortOrder: 5
      }
    ];

    const createdCategories = await db.insert(categories).values(categoryData).returning();

    // Create sample items
    console.log('🍕 Creating sample menu items...');
    const itemsData = [
      // Appetizers
      {
        categoryId: createdCategories[0].id,
        name: { en: 'Hummus', ar: 'حمص' },
        description: { en: 'Traditional chickpea dip with tahini', ar: 'تغميسة الحمص التقليدية بالطحينة' },
        basePrice: '15.00',
        image: '',
        active: true,
        sortOrder: 1
      },
      {
        categoryId: createdCategories[0].id,
        name: { en: 'Tabouleh', ar: 'تبولة' },
        description: { en: 'Fresh parsley salad with tomatoes and bulgur', ar: 'سلطة البقدونس الطازجة مع الطماطم والبرغل' },
        basePrice: '18.00',
        image: '',
        active: true,
        sortOrder: 2
      },
      // Main Courses
      {
        categoryId: createdCategories[1].id,
        name: { en: 'Mansaf', ar: 'منسف' },
        description: { en: 'Traditional lamb dish with yogurt sauce', ar: 'طبق اللحم التقليدي مع صلصة اللبن' },
        basePrice: '65.00',
        image: '',
        active: true,
        sortOrder: 1
      },
      {
        categoryId: createdCategories[1].id,
        name: { en: 'Kabsa', ar: 'كبسة' },
        description: { en: 'Spiced rice with chicken or lamb', ar: 'أرز مبهر مع الدجاج أو اللحم' },
        basePrice: '45.00',
        image: '',
        hasSizes: true,
        active: true,
        sortOrder: 2
      },
      // Grilled Items
      {
        categoryId: createdCategories[2].id,
        name: { en: 'Mixed Grill', ar: 'مشكل مشاوي' },
        description: { en: 'Assorted grilled meats', ar: 'مجموعة متنوعة من اللحوم المشوية' },
        basePrice: '85.00',
        image: '',
        active: true,
        sortOrder: 1
      },
      // Beverages
      {
        categoryId: createdCategories[3].id,
        name: { en: 'Arabic Coffee', ar: 'قهوة عربية' },
        description: { en: 'Traditional Arabic coffee with cardamom', ar: 'قهوة عربية تقليدية بالهيل' },
        basePrice: '8.00',
        image: '',
        hasSizes: true,
        active: true,
        sortOrder: 1
      },
      {
        categoryId: createdCategories[3].id,
        name: { en: 'Fresh Orange Juice', ar: 'عصير برتقال طازج' },
        description: { en: 'Freshly squeezed orange juice', ar: 'عصير برتقال طازج' },
        basePrice: '12.00',
        image: '',
        hasSizes: true,
        active: true,
        sortOrder: 2
      },
      // Desserts
      {
        categoryId: createdCategories[4].id,
        name: { en: 'Baklava', ar: 'بقلاوة' },
        description: { en: 'Sweet pastry with nuts and honey', ar: 'معجنات حلوة بالمكسرات والعسل' },
        basePrice: '22.00',
        image: '',
        active: true,
        sortOrder: 1
      }
    ];

    const createdItems = await db.insert(items).values(itemsData).returning();

    // Create sizes for items that have sizes
    console.log('📏 Creating item sizes...');
    const sizesData = [];
    
    // Kabsa sizes
    const kabsaItem = createdItems.find(item => item.name.en === 'Kabsa');
    if (kabsaItem) {
      sizesData.push(
        {
          itemId: kabsaItem.id,
          name: { en: 'Regular', ar: 'عادي' },
          price: '45.00',
          sortOrder: 1
        },
        {
          itemId: kabsaItem.id,
          name: { en: 'Large', ar: 'كبير' },
          price: '65.00',
          sortOrder: 2
        }
      );
    }

    // Coffee sizes
    const coffeeItem = createdItems.find(item => item.name.en === 'Arabic Coffee');
    if (coffeeItem) {
      sizesData.push(
        {
          itemId: coffeeItem.id,
          name: { en: 'Small', ar: 'صغير' },
          price: '8.00',
          sortOrder: 1
        },
        {
          itemId: coffeeItem.id,
          name: { en: 'Medium', ar: 'وسط' },
          price: '12.00',
          sortOrder: 2
        },
        {
          itemId: coffeeItem.id,
          name: { en: 'Large', ar: 'كبير' },
          price: '15.00',
          sortOrder: 3
        }
      );
    }

    // Orange juice sizes
    const juiceItem = createdItems.find(item => item.name.en === 'Fresh Orange Juice');
    if (juiceItem) {
      sizesData.push(
        {
          itemId: juiceItem.id,
          name: { en: 'Small', ar: 'صغير' },
          price: '12.00',
          sortOrder: 1
        },
        {
          itemId: juiceItem.id,
          name: { en: 'Large', ar: 'كبير' },
          price: '18.00',
          sortOrder: 2
        }
      );
    }

    if (sizesData.length > 0) {
      await db.insert(itemSizes).values(sizesData);
    }

    // Create some modifiers
    console.log('🔧 Creating modifiers...');
    const modifiersData = [
      {
        name: { en: 'Extra Spicy', ar: 'حار إضافي' },
        price: '0.00',
        active: true
      },
      {
        name: { en: 'No Onions', ar: 'بدون بصل' },
        price: '0.00',
        active: true
      },
      {
        name: { en: 'Extra Cheese', ar: 'جبنة إضافية' },
        price: '5.00',
        active: true
      },
      {
        name: { en: 'Extra Meat', ar: 'لحمة إضافية' },
        price: '15.00',
        active: true
      }
    ];

    const createdModifiers = await db.insert(modifiers).values(modifiersData).returning();

    // Create tables
    console.log('🪑 Creating restaurant tables...');
    const tablesData = [];
    for (let i = 1; i <= 20; i++) {
      tablesData.push({
        number: i,
        capacity: i <= 10 ? 4 : i <= 15 ? 6 : 8,
        section: i <= 10 ? 'main' : i <= 15 ? 'outdoor' : 'vip',
        isActive: true
      });
    }

    await db.insert(tables).values(tablesData);

    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Created:
    - 1 store
    - 1 admin user (username: admin, password: admin123)
    - ${createdCategories.length} categories
    - ${createdItems.length} menu items
    - ${sizesData.length} item sizes
    - ${createdModifiers.length} modifiers
    - 20 restaurant tables`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

seedDatabase();
