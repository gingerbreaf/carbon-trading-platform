# API Endpoints Documentation

## 0. Shared Standards (Headers & Formats)

- **Base URL:** `http://localhost:8080/api/v1`
- **Headers:** All protected routes require `Authorization: Bearer <JWT_TOKEN>`
- **Date Format:** ISO 8601 (`YYYY-MM-DDTHH:mm:ssZ`)
- **Naming:** camelCase for JSON keys

---

## 1. Authentication Module

| Method | Endpoint | Description | Payload (Request Body) |
|--------|----------|-------------|------------------------|
| **POST** | `/auth/login` | Authenticates user & returns JWT | `{ "username": "...", "password": "..." }` |
| **POST** | `/auth/register` | Create a new company account | `{ "companyName": "...", "password": "..." }` |

---

## 2. Account & Dashboard

| Method | Endpoint | Description | Query/Params | Response |
|--------|----------|-------------|--------------|----------|
| **GET** | `/account/balance` | Returns balances & company name | None | `{ "companyName": "DBS", "carbonBalance": 500, "cashBalance": 10000.50 }` |

---

## 3. Outgoing Requests (My Company)

These endpoints handle the **"Landing Page"** requirements for viewing, creating, and managing requests your company has made.

| Method | Endpoint | Description | Payload / Params |
|--------|----------|-------------|------------------|
| **GET** | `/requests/my` | List all requests made by your company | `[]` (Returns array of objects) |
| **POST** | `/requests/new` | Create a new Buy/Sell request | `{ "targetCompanyId": 2, "price": 25.0, "quantity": 100, "reason": "Monthly Offset", "type": "BUY" }` |
| **PUT** | `/requests/{id}` | Edit a pending request | `{ "price": 24.5, "quantity": 110 }` |
| **DELETE** | `/requests/{id}` | Delete a pending request | None |

---

## 4. Incoming Requests (Received)

These endpoints handle the **"Requests Received Page"** where you interact with other companies.

| Method | Endpoint | Description | Payload / Params |
|--------|----------|-------------|------------------|
| **GET** | `/requests/incoming` | List requests from others to you | `[]` (Includes `isOverdue: true/false` logic) |
| **PATCH** | `/requests/{id}/status` | Accept or Reject a specific request | `{ "status": "ACCEPTED" }` or `{ "status": "REJECTED" }` |
| **POST** | `/requests/bulk-action` | Bulk accept/reject (Bonus/Efficiency) | `{ "ids": [1, 2, 3], "status": "ACCEPTED" }` |
| **GET** | `/requests/alerts` | Returns overdue items (>7 days) | None |

---

## 5. Proposed Request Object Schema

To ensure consistency, both teams should use this structure for any "Request" object:

```json
{
  "id": 101,
  "requestDate": "2026-01-02T09:00:00Z",
  "companyName": "Tesla Inc",
  "carbonUnitPrice": 55.0,
  "carbonQuantity": 200,
  "requestReason": "Surplus Credits",
  "requestType": "SELL",
  "status": "PENDING",
  "isOverdue": false
}
```

### Schema Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | Number | Unique identifier for the request |
| `requestDate` | String (ISO 8601) | Timestamp when request was created |
| `companyName` | String | Name of the company involved in the request |
| `carbonUnitPrice` | Number | Price per tonne of carbon credits (SGD) |
| `carbonQuantity` | Number | Quantity of carbon credits in tonnes |
| `requestReason` | String | Reason for the request |
| `requestType` | String | Either "BUY" or "SELL" |
| `status` | String | Request status: "PENDING", "ACCEPTED", or "REJECTED" |
| `isOverdue` | Boolean | Whether the request is overdue (>7 days old) |