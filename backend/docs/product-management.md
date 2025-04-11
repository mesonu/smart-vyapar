# Product Management System Documentation

## Overview

The Product Management System is a comprehensive solution for managing products, inventory, and related features. This document outlines the system's features, database structure, and relationships.

## Core Features

### 1. Product Management
- Create, read, update, and delete products
- Track product details (name, description, SKU, barcode)
- Manage pricing (purchase price, selling price, MRP)
- Stock management with min/max levels
- Product categorization
- Product status tracking (active, inactive, discontinued)

### 2. Product Variants
- Support for product variations
- Variant-specific pricing
- Variant-specific stock tracking
- Variant attributes management

### 3. Product Reviews
- Customer reviews and ratings
- Review moderation system
- Helpful votes tracking
- Review images support
- Review status management (pending, approved, rejected)

### 4. Product Tags
- Tag-based product organization
- Tag management
- Many-to-many relationship with products
- Tag status tracking

### 5. Product Discounts
- Discount management
- Multiple discount types (percentage, fixed)
- Time-based discounts
- Quantity-based discounts
- Discount status tracking

### 6. Inventory Management
- Stock tracking
- Stock level alerts
- Inventory transactions
- Stock movement history
- Reorder point management

### 7. Promotions
- Promotion management
- Promotion types (percentage, fixed)
- Time-based promotions
- Promotion status tracking

## Database Structure

### 1. Products Table
```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(100) NOT NULL,
    description VARCHAR(1000),
    sku VARCHAR(50) UNIQUE,
    barcode VARCHAR(50) UNIQUE,
    category_id INTEGER REFERENCES categories(id),
    unit VARCHAR(20) NOT NULL,
    purchase_price DECIMAL(10,2) NOT NULL,
    selling_price DECIMAL(10,2) NOT NULL,
    mrp DECIMAL(10,2),
    tax_rate DECIMAL(5,2),
    hsn_code VARCHAR(20),
    stock_quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
    min_stock_level DECIMAL(10,2),
    max_stock_level DECIMAL(10,2),
    reorder_point DECIMAL(10,2),
    manufacturer VARCHAR(100),
    brand VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active',
    images TEXT[],
    specifications JSONB,
    notes VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Product Variants Table
```sql
CREATE TABLE product_variants (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    attributes JSONB NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    images TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Product Reviews Table
```sql
CREATE TABLE product_reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    user_id INTEGER REFERENCES users(id),
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title VARCHAR(100),
    comment TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    helpful_votes INTEGER DEFAULT 0,
    images TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Product Tags Table
```sql
CREATE TABLE product_tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(500),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_tag_relations (
    product_id INTEGER REFERENCES products(id),
    tag_id INTEGER REFERENCES product_tags(id),
    PRIMARY KEY (product_id, tag_id)
);
```

### 5. Product Discounts Table
```sql
CREATE TABLE product_discounts (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    discount_type VARCHAR(20) NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    min_quantity INTEGER,
    max_quantity INTEGER,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6. Product History Table
```sql
CREATE TABLE product_history (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    field VARCHAR(100) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    change_type VARCHAR(20) NOT NULL,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 7. Inventory Transactions Table
```sql
CREATE TABLE inventory_transactions (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    user_id INTEGER REFERENCES users(id),
    type VARCHAR(10) NOT NULL,
    quantity INTEGER NOT NULL,
    reference VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 8. Promotions Table
```sql
CREATE TABLE promotions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_promotions (
    product_id INTEGER REFERENCES products(id),
    promotion_id INTEGER REFERENCES promotions(id),
    PRIMARY KEY (product_id, promotion_id)
);
```

## Relationships

1. **Products**
   - Belongs to User
   - Belongs to Category
   - Has many Invoice Items
   - Has many Variants
   - Has many Reviews
   - Has many Tags (through ProductTagRelations)
   - Has many Discounts
   - Has many History entries
   - Has many Inventory Transactions
   - Has many Promotions (through ProductPromotions)

2. **Product Variants**
   - Belongs to Product

3. **Product Reviews**
   - Belongs to Product
   - Belongs to User

4. **Product Tags**
   - Belongs to many Products (through ProductTagRelations)

5. **Product Discounts**
   - Belongs to Product

6. **Product History**
   - Belongs to Product
   - Belongs to User

7. **Inventory Transactions**
   - Belongs to Product
   - Belongs to User

8. **Promotions**
   - Belongs to User
   - Belongs to many Products (through ProductPromotions)

## Indexes

1. **Products**
   - Primary key (id)
   - Unique (sku)
   - Unique (barcode)
   - Foreign key (category_id)
   - Status
   - Created at

2. **Product Variants**
   - Primary key (id)
   - Unique (sku)
   - Foreign key (product_id)
   - Status

3. **Product Reviews**
   - Primary key (id)
   - Foreign key (product_id)
   - Foreign key (user_id)
   - Status
   - Rating

4. **Product Tags**
   - Primary key (id)
   - Unique (name)
   - Unique (slug)
   - Status

5. **Product Discounts**
   - Primary key (id)
   - Foreign key (product_id)
   - Status
   - Start date
   - End date

6. **Product History**
   - Primary key (id)
   - Foreign key (product_id)
   - Foreign key (user_id)
   - Created at

7. **Inventory Transactions**
   - Primary key (id)
   - Foreign key (product_id)
   - Foreign key (user_id)

8. **Promotions**
   - Primary key (id)
   - Foreign key (user_id)

## API Endpoints

### Products
- GET /api/products - List all products
- GET /api/products/:id - Get product by ID
- POST /api/products - Create new product
- PUT /api/products/:id - Update product
- DELETE /api/products/:id - Delete product
- GET /api/products/stats - Get product statistics
- GET /api/products/low-stock - Get low stock products
- PUT /api/products/:id/stock - Update product stock

### Product Variants
- GET /api/products/:id/variants - List product variants
- POST /api/products/:id/variants - Create variant
- PUT /api/products/:id/variants/:variantId - Update variant
- DELETE /api/products/:id/variants/:variantId - Delete variant

### Product Reviews
- GET /api/reviews - List all reviews
- POST /api/reviews - Create review
- PUT /api/reviews/:id - Update review
- DELETE /api/reviews/:id - Delete review
- PUT /api/reviews/:id/status - Update review status
- POST /api/reviews/:id/helpful - Mark review as helpful

### Product Tags
- GET /api/tags - List all tags
- POST /api/tags - Create tag
- PUT /api/tags/:id - Update tag
- DELETE /api/tags/:id - Delete tag

### Product Discounts
- GET /api/products/:id/discounts - List product discounts
- POST /api/products/:id/discounts - Create discount
- PUT /api/products/:id/discounts/:discountId - Update discount
- DELETE /api/products/:id/discounts/:discountId - Delete discount

### Promotions
- GET /api/promotions - List all promotions
- POST /api/promotions - Create promotion
- PUT /api/promotions/:id - Update promotion
- DELETE /api/promotions/:id - Delete promotion

## Validation Rules

### Products
- Name: Required, 2-100 characters
- Description: Optional, max 1000 characters
- SKU: Optional, unique, max 50 characters
- Barcode: Optional, unique, max 50 characters
- Unit: Required, 1-20 characters
- Purchase Price: Required, minimum 0
- Selling Price: Required, minimum 0
- MRP: Optional, minimum 0
- Tax Rate: Optional, 0-100
- Stock Quantity: Required, minimum 0
- Status: Enum (active, inactive, discontinued)

### Product Variants
- SKU: Required, unique, 1-50 characters
- Name: Required, 1-100 characters
- Price: Required, minimum 0
- Stock Quantity: Required, minimum 0
- Status: Enum (active, inactive)

### Product Reviews
- Rating: Required, 1-5
- Title: Optional, max 100 characters
- Comment: Optional
- Status: Enum (pending, approved, rejected)

### Product Tags
- Name: Required, unique, 1-50 characters
- Slug: Required, unique, 1-50 characters
- Description: Optional, max 500 characters
- Status: Enum (active, inactive)

### Product Discounts
- Name: Required, 1-100 characters
- Description: Optional, max 500 characters
- Discount Type: Enum (percentage, fixed)
- Discount Value: Required, minimum 0
- Start Date: Required
- End Date: Required
- Status: Enum (active, inactive, expired)

## Security

1. **Authentication**
   - All endpoints require authentication
   - JWT token-based authentication
   - Token expiration handling

2. **Authorization**
   - Role-based access control
   - Admin-specific endpoints
   - User-specific data access

3. **Data Validation**
   - Input validation for all endpoints
   - SQL injection prevention
   - XSS protection

## Error Handling

1. **HTTP Status Codes**
   - 200: Success
   - 201: Created
   - 400: Bad Request
   - 401: Unauthorized
   - 403: Forbidden
   - 404: Not Found
   - 500: Internal Server Error

2. **Error Response Format**
```json
{
  "error": "Error message",
  "details": "Additional error details"
}
```

## Best Practices

1. **Database**
   - Use transactions for multiple operations
   - Implement proper indexing
   - Regular database backups
   - Optimize queries

2. **Code**
   - Follow RESTful principles
   - Implement proper error handling
   - Use middleware for common operations
   - Maintain consistent response formats

3. **Security**
   - Regular security audits
   - Input validation
   - Proper error messages
   - Rate limiting

4. **Performance**
   - Implement caching where appropriate
   - Optimize database queries
   - Use pagination for large datasets
   - Monitor system performance 