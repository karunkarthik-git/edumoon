// MongoDB Sample Dataset for E-commerce Platform
// Run this script in MongoDB shell or MongoDB Compass

// Switch to ecommerce database
use('ecommerce');

// Drop existing collections if they exist
db.users.drop();
db.products.drop();
db.orders.drop();
db.categories.drop();
db.reviews.drop();

// 1. Categories Collection
db.categories.insertMany([
  {
    _id: ObjectId(),
    name: "Electronics",
    description: "Electronic devices and gadgets",
    parent: null,
    isActive: true,
    createdAt: new Date("2024-01-01")
  },
  {
    _id: ObjectId(),
    name: "Smartphones",
    description: "Mobile phones and accessories",
    parent: "Electronics",
    isActive: true,
    createdAt: new Date("2024-01-01")
  },
  {
    _id: ObjectId(),
    name: "Laptops",
    description: "Portable computers",
    parent: "Electronics",
    isActive: true,
    createdAt: new Date("2024-01-01")
  },
  {
    _id: ObjectId(),
    name: "Clothing",
    description: "Fashion and apparel",
    parent: null,
    isActive: true,
    createdAt: new Date("2024-01-01")
  },
  {
    _id: ObjectId(),
    name: "Books",
    description: "Educational and entertainment books",
    parent: null,
    isActive: true,
    createdAt: new Date("2024-01-01")
  }
]);

// 2. Users Collection
db.users.insertMany([
  {
    _id: ObjectId(),
    username: "john_doe",
    email: "john.doe@email.com",
    firstName: "John",
    lastName: "Doe",
    age: 28,
    address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA"
    },
    phone: "+1-555-0123",
    preferences: {
      newsletter: true,
      notifications: true,
      currency: "USD"
    },
    membershipLevel: "Premium",
    registeredAt: new Date("2024-01-15"),
    lastLogin: new Date("2024-12-01"),
    isActive: true,
    totalOrders: 5,
    totalSpent: 1250.99
  },
  {
    _id: ObjectId(),
    username: "jane_smith",
    email: "jane.smith@email.com",
    firstName: "Jane",
    lastName: "Smith",
    age: 32,
    address: {
      street: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90210",
      country: "USA"
    },
    phone: "+1-555-0456",
    preferences: {
      newsletter: false,
      notifications: true,
      currency: "USD"
    },
    membershipLevel: "Basic",
    registeredAt: new Date("2024-02-20"),
    lastLogin: new Date("2024-11-28"),
    isActive: true,
    totalOrders: 3,
    totalSpent: 789.50
  },
  {
    _id: ObjectId(),
    username: "mike_wilson",
    email: "mike.wilson@email.com",
    firstName: "Mike",
    lastName: "Wilson",
    age: 45,
    address: {
      street: "789 Pine Rd",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      country: "USA"
    },
    phone: "+1-555-0789",
    preferences: {
      newsletter: true,
      notifications: false,
      currency: "USD"
    },
    membershipLevel: "Gold",
    registeredAt: new Date("2023-11-10"),
    lastLogin: new Date("2024-12-02"),
    isActive: true,
    totalOrders: 12,
    totalSpent: 3456.78
  },
  {
    _id: ObjectId(),
    username: "sarah_davis",
    email: "sarah.davis@email.com",
    firstName: "Sarah",
    lastName: "Davis",
    age: 26,
    address: {
      street: "321 Elm St",
      city: "Miami",
      state: "FL",
      zipCode: "33101",
      country: "USA"
    },
    phone: "+1-555-0321",
    preferences: {
      newsletter: true,
      notifications: true,
      currency: "USD"
    },
    membershipLevel: "Premium",
    registeredAt: new Date("2024-03-05"),
    lastLogin: new Date("2024-11-30"),
    isActive: true,
    totalOrders: 8,
    totalSpent: 2100.25
  },
  {
    _id: ObjectId(),
    username: "alex_brown",
    email: "alex.brown@email.com",
    firstName: "Alex",
    lastName: "Brown",
    age: 35,
    address: {
      street: "654 Maple Dr",
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      country: "USA"
    },
    phone: "+1-555-0654",
    preferences: {
      newsletter: false,
      notifications: false,
      currency: "USD"
    },
    membershipLevel: "Basic",
    registeredAt: new Date("2024-04-12"),
    lastLogin: new Date("2024-10-15"),
    isActive: false,
    totalOrders: 1,
    totalSpent: 99.99
  }
]);

db.products.insertMany([
  {
    _id: ObjectId(),
    name: "iPhone 15 Pro",
    description: "Latest Apple smartphone with advanced features",
    category: "Smartphones",
    brand: "Apple",
    price: 999.99,
    discountPrice: 899.99,
    currency: "USD",
    stock: 50,
    sku: "IPH15PRO128",
    specifications: {
      storage: "128GB",
      color: "Space Black",
      display: "6.1-inch Super Retina XDR",
      processor: "A17 Pro chip",
      camera: "48MP Main camera",
      battery: "All-day battery life"
    },
    images: [
      "iphone15pro_front.jpg",
      "iphone15pro_back.jpg",
      "iphone15pro_side.jpg"
    ],
    tags: ["smartphone", "apple", "5g", "premium"],
    rating: 4.7,
    reviewCount: 245,
    isActive: true,
    createdAt: new Date("2024-09-15"),
    updatedAt: new Date("2024-11-20")
  },
  {
    _id: ObjectId(),
    name: "MacBook Air M3",
    description: "Thin and lightweight laptop with M3 chip",
    category: "Laptops",
    brand: "Apple",
    price: 1299.99,
    discountPrice: null,
    currency: "USD",
    stock: 25,
    sku: "MBA13M3256",
    specifications: {
      processor: "Apple M3 chip",
      memory: "8GB unified memory",
      storage: "256GB SSD",
      display: "13.6-inch Liquid Retina",
      battery: "Up to 18 hours",
      weight: "2.7 pounds"
    },
    images: [
      "macbook_air_m3.jpg",
      "macbook_air_keyboard.jpg"
    ],
    tags: ["laptop", "apple", "m3", "ultrabook"],
    rating: 4.8,
    reviewCount: 189,
    isActive: true,
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-11-18")
  },
  {
    _id: ObjectId(),
    name: "Samsung Galaxy S24",
    description: "Flagship Android smartphone",
    category: "Smartphones",
    brand: "Samsung",
    price: 799.99,
    discountPrice: 699.99,
    currency: "USD",
    stock: 75,
    sku: "SGS24128BLK",
    specifications: {
      storage: "128GB",
      color: "Phantom Black",
      display: "6.2-inch Dynamic AMOLED",
      processor: "Snapdragon 8 Gen 3",
      camera: "50MP Triple camera",
      battery: "4000mAh"
    },
    images: [
      "galaxy_s24_front.jpg",
      "galaxy_s24_back.jpg"
    ],
    tags: ["smartphone", "samsung", "android", "5g"],
    rating: 4.5,
    reviewCount: 312,
    isActive: true,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-11-22")
  },
  {
    _id: ObjectId(),
    name: "Dell XPS 13",
    description: "Premium ultrabook for professionals",
    category: "Laptops",
    brand: "Dell",
    price: 1099.99,
    discountPrice: 999.99,
    currency: "USD",
    stock: 30,
    sku: "DELLXPS13I7",
    specifications: {
      processor: "Intel Core i7-1360P",
      memory: "16GB LPDDR5",
      storage: "512GB SSD",
      display: "13.4-inch FHD+",
      battery: "Up to 12 hours",
      weight: "2.59 pounds"
    },
    images: [
      "dell_xps13.jpg",
      "dell_xps13_open.jpg"
    ],
    tags: ["laptop", "dell", "ultrabook", "business"],
    rating: 4.4,
    reviewCount: 156,
    isActive: true,
    createdAt: new Date("2024-05-08"),
    updatedAt: new Date("2024-11-15")
  },
  {
    _id: ObjectId(),
    name: "Learning Python",
    description: "Comprehensive guide to Python programming",
    category: "Books",
    brand: "O'Reilly",
    price: 59.99,
    discountPrice: 45.99,
    currency: "USD",
    stock: 100,
    sku: "ORLPYTHON5ED",
    specifications: {
      author: "Mark Lutz",
      pages: 1648,
      edition: "5th Edition",
      publisher: "O'Reilly Media",
      language: "English",
      format: "Paperback"
    },
    images: [
      "learning_python_cover.jpg"
    ],
    tags: ["book", "programming", "python", "education"],
    rating: 4.6,
    reviewCount: 89,
    isActive: true,
    createdAt: new Date("2024-02-14"),
    updatedAt: new Date("2024-11-10")
  },
  {
    _id: ObjectId(),
    name: "Nike Air Max 90",
    description: "Classic running shoes with Air cushioning",
    category: "Clothing",
    brand: "Nike",
    price: 129.99,
    discountPrice: null,
    currency: "USD",
    stock: 200,
    sku: "NIKEAM90WHT10",
    specifications: {
      size: "10",
      color: "White/Black",
      material: "Leather and mesh",
      sole: "Rubber outsole",
      closure: "Lace-up",
      weight: "1.2 pounds"
    },
    images: [
      "nike_air_max_90.jpg",
      "nike_air_max_side.jpg"
    ],
    tags: ["shoes", "nike", "running", "sneakers"],
    rating: 4.3,
    reviewCount: 445,
    isActive: true,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-11-25")
  }
]);

db.orders.insertMany([
  {
    _id: ObjectId(),
    orderNumber: "ORD-2024-001",
    userId: "john_doe",
    items: [
      {
        productId: "iPhone 15 Pro",
        productName: "iPhone 15 Pro",
        quantity: 1,
        unitPrice: 899.99,
        totalPrice: 899.99
      },
      {
        productId: "Learning Python",
        productName: "Learning Python",
        quantity: 1,
        unitPrice: 45.99,
        totalPrice: 45.99
      }
    ],
    subtotal: 945.98,
    tax: 85.14,
    shipping: 9.99,
    discount: 50.00,
    total: 991.11,
    currency: "USD",
    status: "delivered",
    paymentMethod: "credit_card",
    paymentStatus: "paid",
    shippingAddress: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA"
    },
    orderDate: new Date("2024-11-15"),
    shippedDate: new Date("2024-11-17"),
    deliveredDate: new Date("2024-11-20"),
    trackingNumber: "TRK123456789"
  },
  {
    _id: ObjectId(),
    orderNumber: "ORD-2024-002",
    userId: "jane_smith",
    items: [
      {
        productId: "Samsung Galaxy S24",
        productName: "Samsung Galaxy S24",
        quantity: 1,
        unitPrice: 699.99,
        totalPrice: 699.99
      }
    ],
    subtotal: 699.99,
    tax: 62.99,
    shipping: 0.00,
    discount: 0.00,
    total: 762.98,
    currency: "USD",
    status: "shipped",
    paymentMethod: "debit_card",
    paymentStatus: "paid",
    shippingAddress: {
      street: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90210",
      country: "USA"
    },
    orderDate: new Date("2024-11-28"),
    shippedDate: new Date("2024-11-29"),
    deliveredDate: null,
    trackingNumber: "TRK987654321"
  },
  {
    _id: ObjectId(),
    orderNumber: "ORD-2024-003",
    userId: "mike_wilson",
    items: [
      {
        productId: "MacBook Air M3",
        productName: "MacBook Air M3",
        quantity: 1,
        unitPrice: 1299.99,
        totalPrice: 1299.99
      },
      {
        productId: "Dell XPS 13",
        productName: "Dell XPS 13",
        quantity: 1,
        unitPrice: 999.99,
        totalPrice: 999.99
      }
    ],
    subtotal: 2299.98,
    tax: 206.99,
    shipping: 0.00,
    discount: 100.00,
    total: 2406.97,
    currency: "USD",
    status: "processing",
    paymentMethod: "paypal",
    paymentStatus: "paid",
    shippingAddress: {
      street: "789 Pine Rd",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      country: "USA"
    },
    orderDate: new Date("2024-12-01"),
    shippedDate: null,
    deliveredDate: null,
    trackingNumber: null
  },
  {
    _id: ObjectId(),
    orderNumber: "ORD-2024-004",
    userId: "sarah_davis",
    items: [
      {
        productId: "Nike Air Max 90",
        productName: "Nike Air Max 90",
        quantity: 2,
        unitPrice: 129.99,
        totalPrice: 259.98
      }
    ],
    subtotal: 259.98,
    tax: 23.40,
    shipping: 9.99,
    discount: 0.00,
    total: 293.37,
    currency: "USD",
    status: "cancelled",
    paymentMethod: "credit_card",
    paymentStatus: "refunded",
    shippingAddress: {
      street: "321 Elm St",
      city: "Miami",
      state: "FL",
      zipCode: "33101",
      country: "USA"
    },
    orderDate: new Date("2024-11-25"),
    shippedDate: null,
    deliveredDate: null,
    trackingNumber: null,
    cancellationReason: "Customer request"
  }
]);
db.reviews.insertMany([
  {
    _id: ObjectId(),
    productId: "iPhone 15 Pro",
    userId: "john_doe",
    rating: 5,
    title: "Excellent phone!",
    comment: "The camera quality is amazing and the performance is top-notch. Highly recommended!",
    verified: true,
    helpful: 15,
    notHelpful: 2,
    createdAt: new Date("2024-11-25"),
    updatedAt: new Date("2024-11-25")
  },
  {
    _id: ObjectId(),
    productId: "iPhone 15 Pro",
    userId: "sarah_davis",
    rating: 4,
    title: "Great but expensive",
    comment: "Love the features but the price is quite high. Overall satisfied with the purchase.",
    verified: true,
    helpful: 8,
    notHelpful: 1,
    createdAt: new Date("2024-11-20"),
    updatedAt: new Date("2024-11-20")
  },
  {
    _id: ObjectId(),
    productId: "Samsung Galaxy S24",
    userId: "jane_smith",
    rating: 5,
    title: "Best Android phone",
    comment: "Switched from iPhone and couldn't be happier. Great value for money!",
    verified: true,
    helpful: 12,
    notHelpful: 0,
    createdAt: new Date("2024-11-30"),
    updatedAt: new Date("2024-11-30")
  },
  {
    _id: ObjectId(),
    productId: "MacBook Air M3",
    userId: "mike_wilson",
    rating: 5,
    title: "Perfect for work",
    comment: "Lightweight, fast, and excellent battery life. Perfect for business use.",
    verified: true,
    helpful: 20,
    notHelpful: 1,
    createdAt: new Date("2024-11-18"),
    updatedAt: new Date("2024-11-18")
  },
  {
    _id: ObjectId(),
    productId: "Learning Python",
    userId: "alex_brown",
    rating: 4,
    title: "Comprehensive guide",
    comment: "Very detailed book, though can be overwhelming for beginners. Good reference material.",
    verified: true,
    helpful: 6,
    notHelpful: 3,
    createdAt: new Date("2024-10-20"),
    updatedAt: new Date("2024-10-20")
  }
]);

print("Sample data inserted successfully!");
print("Collections created: users, products, orders, categories, reviews");
