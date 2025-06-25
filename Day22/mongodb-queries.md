# MongoDB Practice Queries

This document contains various MongoDB queries to practice NoSQL operations using the e-commerce dataset.

## Database Setup

First, make sure you have MongoDB running and execute the sample-data.js file:
```bash
mongosh
load('sample-data.js')
```

## 1. Basic CRUD Operations

### Find Operations

```javascript
// Switch to ecommerce database
use('ecommerce');

// 1. Find all users
db.users.find();

// 2. Find all users with pretty formatting
db.users.find().pretty();

// 3. Find user by username
db.users.findOne({username: "john_doe"});

// 4. Find all active users
db.users.find({isActive: true});

// 5. Find users with Premium membership
db.users.find({membershipLevel: "Premium"});

// 6. Find products with price less than $100
db.products.find({price: {$lt: 100}});

// 7. Find products with discount
db.products.find({discountPrice: {$ne: null}});

// 8. Find orders with status 'delivered'
db.orders.find({status: "delivered"});
```

### Projection (Selecting specific fields)

```javascript
// 9. Get only username and email from users
db.users.find({}, {username: 1, email: 1, _id: 0});

// 10. Get product names and prices only
db.products.find({}, {name: 1, price: 1, _id: 0});

// 11. Get user info excluding address
db.users.find({}, {address: 0});
```

### Insert Operations

```javascript
// 12. Insert a new user
db.users.insertOne({
  username: "new_user",
  email: "new.user@email.com",
  firstName: "New",
  lastName: "User",
  age: 25,
  address: {
    street: "456 New St",
    city: "Boston",
    state: "MA",
    zipCode: "02101",
    country: "USA"
  },
  membershipLevel: "Basic",
  registeredAt: new Date(),
  isActive: true,
  totalOrders: 0,
  totalSpent: 0
});

// 13. Insert multiple products
db.products.insertMany([
  {
    name: "iPad Air",
    description: "Powerful tablet for creativity",
    category: "Electronics",
    brand: "Apple",
    price: 599.99,
    stock: 40,
    rating: 4.5,
    isActive: true,
    createdAt: new Date()
  },
  {
    name: "AirPods Pro",
    description: "Wireless earbuds with noise cancellation",
    category: "Electronics",
    brand: "Apple",
    price: 249.99,
    stock: 80,
    rating: 4.6,
    isActive: true,
    createdAt: new Date()
  }
]);
```

### Update Operations

```javascript
// 14. Update user's last login
db.users.updateOne(
  {username: "john_doe"},
  {$set: {lastLogin: new Date()}}
);

// 15. Update product stock
db.products.updateOne(
  {name: "iPhone 15 Pro"},
  {$inc: {stock: -1}}
);

// 16. Update multiple users' newsletter preference
db.users.updateMany(
  {membershipLevel: "Basic"},
  {$set: {"preferences.newsletter": false}}
);

// 17. Add new field to all products
db.products.updateMany(
  {},
  {$set: {featured: false}}
);
```

### Delete Operations

```javascript
// 18. Delete a review
db.reviews.deleteOne({rating: {$lt: 3}});

// 19. Delete inactive users
db.users.deleteMany({isActive: false});
```

## 2. Advanced Query Operations

### Comparison Operators

```javascript
// 20. Find users older than 30
db.users.find({age: {$gt: 30}});

// 21. Find products between $500 and $1000
db.products.find({
  price: {$gte: 500, $lte: 1000}
});

// 22. Find users not from NY or CA
db.users.find({
  "address.state": {$nin: ["NY", "CA"]}
});

// 23. Find orders with total greater than $1000
db.orders.find({total: {$gt: 1000}});
```

### Logical Operators

```javascript
// 24. Find Premium or Gold members
db.users.find({
  $or: [
    {membershipLevel: "Premium"},
    {membershipLevel: "Gold"}
  ]
});

// 25. Find active users with more than 5 orders
db.users.find({
  $and: [
    {isActive: true},
    {totalOrders: {$gt: 5}}
  ]
});

// 26. Find products that are NOT electronics
db.products.find({
  category: {$not: /Electronics/}
});
```

### Element Operators

```javascript
// 27. Find users who have phone numbers
db.users.find({phone: {$exists: true}});

// 28. Find products without discount
db.products.find({discountPrice: {$exists: false}});

// 29. Find reviews with string type rating
db.reviews.find({rating: {$type: "string"}});
```

### Array Operators

```javascript
// 30. Find products with 'smartphone' tag
db.products.find({tags: "smartphone"});

// 31. Find products with multiple specific tags
db.products.find({
  tags: {$all: ["smartphone", "apple"]}
});

// 32. Find products with exactly 4 tags
db.products.find({tags: {$size: 4}});

// 33. Find orders with multiple items
db.orders.find({
  "items.1": {$exists: true}
});
```

### Regular Expressions

```javascript
// 34. Find users with email ending in gmail.com
db.users.find({email: /gmail\.com$/});

// 35. Find products with names starting with 'iPhone'
db.products.find({name: /^iPhone/});

// 36. Find products with case-insensitive search for 'apple'
db.products.find({brand: /apple/i});
```

## 3. Aggregation Pipeline

### Basic Aggregation

```javascript
// 37. Count users by membership level
db.users.aggregate([
  {$group: {
    _id: "$membershipLevel",
    count: {$sum: 1}
  }}
]);

// 38. Average price by category
db.products.aggregate([
  {$group: {
    _id: "$category",
    avgPrice: {$avg: "$price"},
    count: {$sum: 1}
  }}
]);

// 39. Total revenue by month
db.orders.aggregate([
  {$group: {
    _id: {
      year: {$year: "$orderDate"},
      month: {$month: "$orderDate"}
    },
    totalRevenue: {$sum: "$total"},
    orderCount: {$sum: 1}
  }}
]);
```

### Advanced Aggregation

```javascript
// 40. User spending analysis
db.users.aggregate([
  {$match: {isActive: true}},
  {$group: {
    _id: "$membershipLevel",
    avgSpent: {$avg: "$totalSpent"},
    maxSpent: {$max: "$totalSpent"},
    minSpent: {$min: "$totalSpent"},
    userCount: {$sum: 1}
  }},
  {$sort: {avgSpent: -1}}
]);

// 41. Product performance report
db.products.aggregate([
  {$match: {isActive: true}},
  {$project: {
    name: 1,
    brand: 1,
    price: 1,
    rating: 1,
    reviewCount: 1,
    discountPercent: {
      $cond: {
        if: {$ne: ["$discountPrice", null]},
        then: {
          $multiply: [
            {$divide: [
              {$subtract: ["$price", "$discountPrice"]},
              "$price"
            ]},
            100
          ]
        },
        else: 0
      }
    }
  }},
  {$sort: {rating: -1, reviewCount: -1}}
]);

// 42. Order analysis with customer details
db.orders.aggregate([
  {$lookup: {
    from: "users",
    localField: "userId",
    foreignField: "username",
    as: "customer"
  }},
  {$unwind: "$customer"},
  {$project: {
    orderNumber: 1,
    total: 1,
    status: 1,
    customerName: {
      $concat: ["$customer.firstName", " ", "$customer.lastName"]
    },
    customerState: "$customer.address.state",
    orderDate: 1
  }},
  {$sort: {orderDate: -1}}
]);
```

### Complex Aggregations

```javascript
// 43. Top selling products
db.orders.aggregate([
  {$unwind: "$items"},
  {$group: {
    _id: "$items.productName",
    totalQuantity: {$sum: "$items.quantity"},
    totalRevenue: {$sum: "$items.totalPrice"},
    orderCount: {$sum: 1}
  }},
  {$sort: {totalQuantity: -1}},
  {$limit: 5}
]);

// 44. Customer lifetime value
db.orders.aggregate([
  {$match: {status: {$ne: "cancelled"}}},
  {$group: {
    _id: "$userId",
    totalSpent: {$sum: "$total"},
    orderCount: {$sum: 1},
    avgOrderValue: {$avg: "$total"},
    firstOrder: {$min: "$orderDate"},
    lastOrder: {$max: "$orderDate"}
  }},
  {$lookup: {
    from: "users",
    localField: "_id",
    foreignField: "username",
    as: "userInfo"
  }},
  {$unwind: "$userInfo"},
  {$project: {
    customerName: {
      $concat: ["$userInfo.firstName", " ", "$userInfo.lastName"]
    },
    totalSpent: 1,
    orderCount: 1,
    avgOrderValue: 1,
    membershipLevel: "$userInfo.membershipLevel",
    daysSinceFirstOrder: {
      $divide: [
        {$subtract: [new Date(), "$firstOrder"]},
        1000 * 60 * 60 * 24
      ]
    }
  }},
  {$sort: {totalSpent: -1}}
]);

// 45. Review sentiment analysis
db.reviews.aggregate([
  {$lookup: {
    from: "products",
    localField: "productId",
    foreignField: "name",
    as: "product"
  }},
  {$unwind: "$product"},
  {$group: {
    _id: {
      product: "$productId",
      brand: "$product.brand"
    },
    avgRating: {$avg: "$rating"},
    reviewCount: {$sum: 1},
    totalHelpful: {$sum: "$helpful"},
    ratingDistribution: {
      $push: "$rating"
    }
  }},
  {$sort: {avgRating: -1, reviewCount: -1}}
]);
```

## 4. Indexing

```javascript
// 46. Create indexes for better performance
db.users.createIndex({email: 1});
db.users.createIndex({username: 1});
db.products.createIndex({category: 1, price: 1});
db.products.createIndex({name: "text", description: "text"});
db.orders.createIndex({userId: 1, orderDate: -1});
db.reviews.createIndex({productId: 1, rating: -1});

// 47. Text search on products
db.products.find({$text: {$search: "apple smartphone"}});

// 48. View existing indexes
db.users.getIndexes();
db.products.getIndexes();
```

## 5. Data Modification Queries

```javascript
// 49. Add tags to existing products
db.products.updateMany(
  {brand: "Apple"},
  {$addToSet: {tags: "premium"}}
);

// 50. Remove a tag from products
db.products.updateMany(
  {},
  {$pull: {tags: "old_tag"}}
);

// 51. Increment review count for products
db.products.updateMany(
  {},
  {$inc: {reviewCount: 1}}
);

// 52. Set default values for missing fields
db.users.updateMany(
  {"preferences.currency": {$exists: false}},
  {$set: {"preferences.currency": "USD"}}
);
```

## 6. Validation and Schema

```javascript
// 53. Add validation rules
db.createCollection("new_products", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "price", "category"],
      properties: {
        name: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        price: {
          bsonType: "number",
          minimum: 0,
          description: "must be a number greater than 0"
        },
        category: {
          bsonType: "string",
          description: "must be a string and is required"
        }
      }
    }
  }
});
```

## 7. Performance and Optimization Queries

```javascript
// 54. Explain query execution
db.products.find({price: {$gt: 500}}).explain("executionStats");

// 55. Find slow queries (if profiling is enabled)
db.system.profile.find().sort({ts: -1}).limit(5);

// 56. Get collection statistics
db.products.stats();

// 57. Get database statistics
db.stats();
```

## Practice Exercises

1. Find all users who have spent more than $2000 and are Premium members
2. Get the top 3 most expensive products in each category
3. Calculate the conversion rate (orders/users) by membership level
4. Find products that have reviews but no ratings above 4
5. Create a report showing monthly revenue trends
6. Find users who haven't placed an order in the last 30 days
7. Calculate the average shipping cost by state
8. Find products that are frequently bought together
9. Create a customer segmentation based on spending and order frequency
10. Implement a recommendation system based on user purchase history

These queries will help you practice various MongoDB concepts including CRUD operations, aggregation pipelines, indexing, and performance optimization.
