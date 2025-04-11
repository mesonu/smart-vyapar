# Invoice Management System Documentation

## Overview
The Invoice Management System handles the creation, management, and tracking of invoices throughout their lifecycle. It includes features for invoice generation, status tracking, item management, and history logging.

## Database Tables

### Invoices Table
```sql
CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id INTEGER REFERENCES customers(id),
  user_id INTEGER REFERENCES users(id),
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  paid_amount DECIMAL(10,2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'INR',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### InvoiceItems Table
```sql
CREATE TABLE invoice_items (
  id SERIAL PRIMARY KEY,
  invoice_id INTEGER REFERENCES invoices(id),
  product_id INTEGER REFERENCES products(id),
  description TEXT,
  quantity DECIMAL(10,2) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  tax_rate DECIMAL(5,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  discount_type VARCHAR(20),
  discount_value DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  subtotal DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### InvoiceHistory Table
```sql
CREATE TABLE invoice_history (
  id SERIAL PRIMARY KEY,
  invoice_id INTEGER REFERENCES invoices(id),
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Features with Use Cases

### 1. Invoice Creation
**Use Cases:**
1. **New Invoice Creation**
   - User selects customer and products
   - System calculates totals and taxes
   - Invoice is generated with unique number
   - Items are added with proper calculations
   - Invoice is saved in draft status

2. **Bulk Order Handling**
   - Multiple products are selected
   - System calculates bulk discounts
   - Items are grouped by category
   - Tax calculations are applied
   - Invoice is generated with all items

3. **Recurring Invoices**
   - Recurring template is created
   - Schedule is set (weekly/monthly)
   - System generates invoices automatically
   - Notifications are sent to customer
   - Payment reminders are scheduled

4. **Proforma Invoices**
   - Draft invoice is created
   - Customer details are verified
   - Items and prices are confirmed
   - Proforma is sent for approval
   - Final invoice is generated after approval

### 2. Invoice Status Management
**Use Cases:**
1. **Status Updates**
   - Invoice is created in draft status
   - Status changes to sent when emailed
   - Status updates to paid when payment received
   - Overdue status is set automatically
   - Cancelled status for voided invoices

2. **Payment Tracking**
   - Partial payments are recorded
   - Balance is updated automatically
   - Payment history is maintained
   - Overdue notifications are sent
   - Payment reminders are scheduled

3. **Invoice Editing**
   - Draft invoices can be modified
   - Changes are logged in history
   - Version control is maintained
   - Previous versions are accessible
   - Audit trail is preserved

### 3. Invoice Items Management
**Use Cases:**
1. **Item Addition**
   - Products are selected from catalog
   - Quantities are specified
   - Prices are calculated
   - Discounts are applied
   - Tax calculations are performed

2. **Item Modification**
   - Existing items are updated
   - Quantities are adjusted
   - Prices are modified
   - Discounts are recalculated
   - Totals are updated

3. **Item Removal**
   - Items are removed from invoice
   - Totals are recalculated
   - Tax amounts are updated
   - History is logged
   - Audit trail is maintained

### 4. History Tracking
**Use Cases:**
1. **Change Logging**
   - All modifications are recorded
   - User actions are tracked
   - Timestamps are maintained
   - Previous values are stored
   - Change reasons are documented

2. **Audit Trail**
   - Complete history is available
   - Changes can be reviewed
   - User actions are traceable
   - Reports can be generated
   - Compliance requirements are met

## API Endpoints

### Invoice Creation
```http
POST /api/invoices
Content-Type: application/json

{
  "customer_id": 123,
  "issue_date": "2024-03-20",
  "due_date": "2024-04-20",
  "items": [
    {
      "product_id": 456,
      "quantity": 2,
      "unit_price": 1000.00
    }
  ]
}
```

### Invoice Status Update
```http
PUT /api/invoices/:id/status
Content-Type: application/json

{
  "status": "paid",
  "notes": "Payment received via UPI"
}
```

### Invoice Item Management
```http
POST /api/invoices/:id/items
Content-Type: application/json

{
  "product_id": 789,
  "quantity": 1,
  "unit_price": 500.00
}
```

## Error Handling

### Common Error Codes
- 400: Invalid invoice data
- 401: Unauthorized access
- 403: Forbidden operation
- 404: Invoice not found
- 409: Invoice conflict
- 422: Unprocessable invoice
- 500: Internal server error

## Security Measures

### Data Security
- Role-based access control
- Data encryption
- Secure API endpoints
- Audit logging
- Input validation

### Access Control
- User permissions
- Customer access limits
- API rate limiting
- IP restrictions
- Session management

## Integration Points

### External Systems
- Payment gateways
- Accounting software
- CRM systems
- Inventory management
- Reporting tools

### Internal Systems
- User management
- Product catalog
- Customer management
- Notification system
- Reporting system

## Monitoring and Logging

### System Logs
- Invoice creation
- Status changes
- Item modifications
- Payment updates
- User actions

### Analytics
- Invoice volume
- Payment patterns
- Customer behavior
- Revenue tracking
- Performance metrics

## Best Practices

### Invoice Management
1. Validate all input data
2. Maintain audit trails
3. Implement proper error handling
4. Use secure communication
5. Regular backups

### Data Integrity
1. Validate calculations
2. Check for duplicates
3. Maintain referential integrity
4. Regular data validation
5. Error recovery procedures

## Future Enhancements

### Planned Features
1. Multi-currency support
2. Advanced reporting
3. Automated workflows
4. Integration with more systems
5. Enhanced analytics
6. Mobile app support
7. API versioning
8. Webhook support
9. Bulk operations
10. Custom templates 