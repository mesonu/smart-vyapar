# Payment Management System Documentation

## Overview
The Payment Management System handles all payment-related operations in the application, including processing payments, managing payment statuses, handling refunds, and sending payment notifications.

## Database Tables

### Payments Table
```sql
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  invoice_id INTEGER REFERENCES invoices(id),
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  transaction_id VARCHAR(100),
  payment_date TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### PaymentStatus Table
```sql
CREATE TABLE payment_status (
  id SERIAL PRIMARY KEY,
  payment_id INTEGER REFERENCES payments(id),
  status VARCHAR(20) NOT NULL,
  status_date TIMESTAMP NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Features with Use Cases

### 1. Payment Processing
**Use Cases:**
1. **Online Payment Processing**
   - Customer selects products and proceeds to checkout
   - System presents available payment methods
   - Customer enters payment details
   - System processes payment through selected gateway
   - Payment status is updated in real-time

2. **Partial Payment Handling**
   - Customer requests to pay invoice in installments
   - System creates partial payment schedule
   - Customer makes first payment
   - System updates invoice with partial payment status
   - Remaining balance is tracked

3. **Payment Retry**
   - Initial payment attempt fails
   - System automatically retries payment
   - Customer receives notification of retry
   - Payment succeeds on second attempt
   - System updates payment status

4. **Multiple Payment Methods**
   - Customer adds items to cart
   - System shows available payment options
   - Customer selects UPI payment
   - System generates UPI QR code
   - Payment is processed after scan

### 2. Payment Status Tracking
**Use Cases:**
1. **Real-time Status Updates**
   - Payment is initiated
   - System receives webhook from payment gateway
   - Status is updated in database
   - Customer receives status notification
   - Admin dashboard reflects new status

2. **Payment Reconciliation**
   - Daily payment batch processing
   - System matches payments with invoices
   - Discrepancies are flagged
   - Reconciliation report is generated
   - Issues are resolved manually

3. **Status History Tracking**
   - Payment status changes from pending to processing
   - System logs status change with timestamp
   - Status changes to completed
   - Complete history is available for audit
   - History can be exported for reporting

### 3. Refund Management
**Use Cases:**
1. **Full Refund Processing**
   - Customer requests refund for paid invoice
   - Admin approves refund request
   - System initiates refund through payment gateway
   - Refund status is tracked
   - Customer receives refund notification

2. **Partial Refund Handling**
   - Customer returns partial order
   - System calculates refund amount
   - Partial refund is processed
   - Original payment is updated
   - New refund record is created

3. **Automatic Refund Processing**
   - Payment gateway reports failed transaction
   - System automatically initiates refund
   - Refund is processed without manual intervention
   - Customer receives automatic notification
   - System logs refund details

### 4. Payment Notifications
**Use Cases:**
1. **Payment Success Notification**
   - Payment is successfully processed
   - System triggers WhatsApp notification
   - Email receipt is sent
   - Invoice is marked as paid
   - Customer receives confirmation

2. **Payment Failure Alert**
   - Payment attempt fails
   - System sends failure notification
   - Customer receives retry instructions
   - Admin is notified of failure
   - System logs failure reason

3. **Refund Status Update**
   - Refund is initiated
   - System sends refund initiated notification
   - Refund is processed
   - Completion notification is sent
   - Customer receives refund confirmation

## API Endpoints

### Payment Processing
```http
POST /api/payments/process
Content-Type: application/json

{
  "invoice_id": "123",
  "amount": 1000.00,
  "payment_method": "upi",
  "payment_details": {
    "upi_id": "user@upi"
  }
}
```

### Payment Status Update
```http
PUT /api/payments/:id/status
Content-Type: application/json

{
  "status": "completed",
  "transaction_id": "txn_123456",
  "notes": "Payment processed successfully"
}
```

### Refund Processing
```http
POST /api/payments/:id/refund
Content-Type: application/json

{
  "amount": 1000.00,
  "reason": "Customer request"
}
```

## Notification Templates

### Payment Success
```
Payment of ₹{{amount}} for invoice #{{invoice_number}} has been successfully processed.
```

### Payment Failed
```
Payment of ₹{{amount}} for invoice #{{invoice_number}} has failed. Please try again.
```

### Refund Initiated
```
Refund of ₹{{amount}} for invoice #{{invoice_number}} has been initiated.
```

### Refund Processed
```
Refund of ₹{{amount}} for invoice #{{invoice_number}} has been processed.
```

## Error Handling

### Common Error Codes
- 400: Invalid payment details
- 401: Unauthorized access
- 402: Payment required
- 403: Payment forbidden
- 404: Payment not found
- 409: Payment conflict
- 422: Unprocessable payment
- 429: Too many payment attempts
- 500: Internal server error

## Security Measures

### Payment Data Security
- PCI DSS compliance
- Tokenization of sensitive data
- Encryption of payment information
- Secure API endpoints

### Rate Limiting
- Per-user rate limiting
- Per-IP rate limiting
- Payment attempt limits
- Refund request limits

## Integration Points

### Payment Gateways
- Razorpay
- Stripe
- PayPal
- Custom payment processors

### Notification Services
- WhatsApp Business API
- Email service
- SMS service

## Monitoring and Logging

### Payment Logs
- Payment attempts
- Successful payments
- Failed payments
- Refund requests
- Status changes

### Analytics
- Payment success rates
- Average payment time
- Refund rates
- Payment method distribution

## Best Practices

### Payment Processing
1. Always validate payment details before processing
2. Implement proper error handling
3. Use secure communication channels
4. Maintain audit trails
5. Implement proper logging

### Refund Handling
1. Validate refund requests
2. Check payment status before refund
3. Maintain refund history
4. Send refund notifications
5. Monitor refund patterns

## Future Enhancements

### Planned Features
1. Recurring payments
2. Payment scheduling
3. Multi-currency support
4. Advanced analytics
5. Automated reconciliation
6. Payment gateway failover
7. Enhanced fraud detection
8. Payment method preferences
9. Bulk payment processing
10. Payment method tokenization 