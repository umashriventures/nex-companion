# Razorpay Payment Integration Requirements

## Overview
This document outlines the backend requirements for integrating Razorpay payments into the Nex Companion application. The goal is to allow users to upgrade their subscription tiers (e.g., Free to Pro) using Razorpay.

## Actors
- **Client (Frontend)**: React application.
- **Backend**: API server handling business logic and database updates.
- **Razorpay**: Payment gateway.

## Workflow
1. **Order Creation**: Client requests an order for a specific plan. Backend communicates with Razorpay to create an order instance.
2. **Payment Execution**: Client uses the order ID to open the Razorpay Checkout form. User completes payment.
3. **Verification**: client sends the payment signature to the Backend. Backend verifies the signature and updates the user's subscription status.

## API Endpoints Required

### 1. Create Order
**Endpoint**: `POST /payment/create-order`
**Auth**: Bearer Token required.

**Request Body**:
```json
{
  "planId": "TIER_1", // or "TIER_2"
  "currency": "INR"   // Optional, default to INR
}
```

**Backend Logic**:
1. Validate `planId` and determine the amount (e.g., TIER_1 = 1200 INR).
2. Initialize Razorpay instance using `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.
3. Call Razorpay API to create an order:
   ```javascript
   const options = {
     amount: 120000, // Amount in lowest denomination (paise)
     currency: "INR",
     receipt: "receipt_order_12345", // Unique identifier for this transaction
     notes: {
       planId: "TIER_1",
       userId: "user_firebase_uid"
     }
   };
   const order = await instance.orders.create(options);
   ```
4. Return the order details to the frontend.

**Response**:
```json
{
  "id": "order_EKwxwAgItmmXdp",
  "currency": "INR",
  "amount": 120000,
  "keyId": "rzp_test_..." // Public Key for frontend to initialize checkout
}
```

### 2. Verify Payment
**Endpoint**: `POST /payment/verify`
**Auth**: Bearer Token required.

**Request Body**:
```json
{
  "razorpay_order_id": "order_EKwxwAgItmmXdp",
  "razorpay_payment_id": "pay_29ZZMnzJ131n",
  "razorpay_signature": "b2a...912"
}
```

**Backend Logic**:
1. Generate the expected signature using HMAC SHA256:
   ```javascript
   generated_signature = hmac_sha256(order_id + "|" + payment_id, secret);
   ```
2. Compare `generated_signature` with `razorpay_signature`.
3. **If Match**:
   - Payment is successful.
   - Update user's `tier` in the database to the purchased plan.
   - Return success.
4. **If Mismatch**:
   - Return 400 Bad Request (Potential fraud).

**Response (Success)**:
```json
{
  "status": "success",
  "tier": "TIER_1",
  "updatedAt": "2024-01-01T12:00:00Z"
}
```

## Environment Variables
Ensure the following are set in the backend environment:
- `RAZORPAY_KEY_ID`: Public Key from Razorpay Dashboard.
- `RAZORPAY_KEY_SECRET`: Secret Key from Razorpay Dashboard.
