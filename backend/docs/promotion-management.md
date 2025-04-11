# Promotion Management System Documentation

## Overview
The Promotion Management System handles the creation, management, and tracking of promotional campaigns and discounts. It provides tools for creating various types of promotions, managing their lifecycle, and tracking their effectiveness.

## Database Tables

### Promotions Table
```sql
CREATE TABLE promotions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  type VARCHAR(20) NOT NULL,
  discount_type VARCHAR(20) NOT NULL,
  discount_value DECIMAL(10,2) NOT NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  min_purchase_amount DECIMAL(10,2),
  max_discount_amount DECIMAL(10,2),
  usage_limit INTEGER,
  per_user_limit INTEGER,
  status VARCHAR(20) DEFAULT 'active',
  conditions JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Product Promotions Table
```sql
CREATE TABLE product_promotions (
  id SERIAL PRIMARY KEY,
  promotion_id INTEGER REFERENCES promotions(id),
  product_id INTEGER REFERENCES products(id),
  discount_type VARCHAR(20) NOT NULL,
  discount_value DECIMAL(10,2) NOT NULL,
  min_quantity INTEGER,
  max_quantity INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(promotion_id, product_id)
);
```

### Promotion Usage Table
```sql
CREATE TABLE promotion_usage (
  id SERIAL PRIMARY KEY,
  promotion_id INTEGER REFERENCES promotions(id),
  user_id INTEGER REFERENCES users(id),
  order_id INTEGER REFERENCES orders(id),
  discount_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Promotion History Table
```sql
CREATE TABLE promotion_history (
  id SERIAL PRIMARY KEY,
  promotion_id INTEGER REFERENCES promotions(id),
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Features with Use Cases

### 1. Promotion Creation
**Use Cases:**
1. **Discount Promotions**
   - Percentage discounts
   - Fixed amount discounts
   - Buy X get Y free
   - Bundle discounts

2. **Time-based Promotions**
   - Flash sales
   - Seasonal discounts
   - Holiday specials
   - Limited-time offers

3. **Quantity-based Promotions**
   - Bulk discounts
   - Minimum purchase requirements
   - Maximum discount limits
   - Tiered pricing

### 2. Promotion Management
**Use Cases:**
1. **Promotion Rules**
   - Product eligibility
   - Category restrictions
   - Customer segment targeting
   - Usage limits

2. **Promotion Scheduling**
   - Start/end date management
   - Time zone handling
   - Recurring promotions
   - Automated activation

3. **Promotion Monitoring**
   - Usage tracking
   - Performance analytics
   - Budget monitoring
   - ROI calculation

### 3. Promotion Analytics
**Use Cases:**
1. **Performance Tracking**
   - Usage statistics
   - Revenue impact
   - Customer engagement
   - Conversion rates

2. **Campaign Analysis**
   - A/B testing
   - Effectiveness comparison
   - Customer behavior
   - Market response

## API Endpoints

### Promotion Management
```http
POST /api/promotions
Content-Type: application/json

{
  "name": "Summer Sale 2024",
  "description": "Summer special discount",
  "type": "discount",
  "discount_type": "percentage",
  "discount_value": 20.00,
  "start_date": "2024-06-01T00:00:00Z",
  "end_date": "2024-08-31T23:59:59Z",
  "min_purchase_amount": 1000.00,
  "usage_limit": 1000
}
```

### Product Promotion Assignment
```http
POST /api/promotions/:id/products
Content-Type: application/json

{
  "product_id": 123,
  "discount_type": "percentage",
  "discount_value": 15.00,
  "min_quantity": 2
}
```

### Promotion Usage Tracking
```http
POST /api/promotions/:id/usage
Content-Type: application/json

{
  "user_id": 456,
  "order_id": 789,
  "discount_amount": 200.00
}
```

## Error Handling

### Common Error Codes
- 400: Invalid promotion data
- 401: Unauthorized access
- 403: Forbidden operation
- 404: Promotion not found
- 409: Promotion conflict
- 422: Unprocessable promotion
- 500: Internal server error

## Security Measures

### Data Security
- Role-based access control
- Data validation
- Usage limits
- Audit logging

### Access Control
- User permissions
- Promotion access levels
- API rate limiting
- IP restrictions

## Integration Points

### External Systems
- Marketing platforms
- Analytics tools
- Email service
- SMS service

### Internal Systems
- Product management
- Order management
- User management
- Notification system

## Monitoring and Logging

### System Logs
- Promotion creation
- Usage tracking
- Status changes
- Performance metrics

### Analytics
- Usage patterns
- Revenue impact
- Customer behavior
- Campaign effectiveness

## Best Practices

### Promotion Management
1. Clear naming conventions
2. Proper validation
3. Usage tracking
4. Performance monitoring
5. Regular review

### Data Protection
1. Secure storage
2. Access control
3. Audit trails
4. Data retention
5. Privacy compliance

## Future Enhancements

### Planned Features
1. Advanced targeting
2. Dynamic pricing
3. AI-powered recommendations
4. Multi-channel campaigns
5. Advanced analytics
6. Mobile app support
7. API versioning
8. Webhook support
9. Bulk operations
10. Custom templates 