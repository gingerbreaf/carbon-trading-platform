# Mock API Setup Guide

This project includes a **Mock API Service** that allows the frontend team to test and develop the application without requiring a running backend server.

## Quick Start

### 1. Enable Mock API

Create a `.env.local` file in the root directory with the following content:

```env
VITE_USE_MOCK_API=true
```

### 2. Start the Development Server

```bash
npm run dev
```

The app will now use the mock API service instead of making real HTTP requests. You'll see a console message:
```
🔧 Using Mock API Service (backend not required)
```

## How It Works

- When `VITE_USE_MOCK_API=true`, the app uses `src/services/mockApi.js`
- When `VITE_USE_MOCK_API=false` (or not set), the app uses the real API at `http://localhost:8080/api/v1`
- The mock API stores data in memory (resets on page refresh)
- All API methods are implemented with realistic delays to simulate network latency

## Mock Data

The mock API includes sample data:

### Sample Requests (My Requests)
- Tesla Inc - SELL request (PENDING)
- Google LLC - BUY request (ACCEPTED)
- Microsoft Corp - SELL request (PENDING, overdue)

### Sample Incoming Requests
- Apple Inc - BUY request (PENDING)
- Amazon Web Services - BUY request (PENDING)
- Meta Platforms - BUY request (PENDING, overdue)

### Account Balance
- Company Name: DBS
- Carbon Balance: 500 tonnes
- Cash Balance: SGD 10,000.50

## Testing Features

### Authentication
- **Login**: Accepts any username/password combination
- **Register**: Accepts any company name/password combination
- Tokens are stored in localStorage (just like real API)

### CRUD Operations
- ✅ Create new requests
- ✅ View all requests (my requests & incoming)
- ✅ Edit pending requests
- ✅ Delete pending requests
- ✅ Accept/Reject incoming requests
- ✅ Bulk accept/reject operations
- ✅ View overdue alerts

### Error Handling
The mock API includes basic validation:
- Requires authentication for protected routes
- Validates required fields
- Prevents editing/deleting non-pending requests
- Returns appropriate error messages

## Switching to Real API

When the backend is ready:

1. Set `VITE_USE_MOCK_API=false` in `.env.local`, or
2. Remove the `VITE_USE_MOCK_API` variable entirely, or
3. Delete the `.env.local` file

The app will automatically switch to using the real API service.

## Customizing Mock Data

To modify the mock data, edit `src/services/mockApi.js`:

- `mockRequests`: Your outgoing requests
- `incomingRequests`: Requests from other companies
- `nextId` / `nextIncomingId`: Auto-incrementing IDs

## Notes

- Mock data is stored in memory and resets on page refresh
- Network delays are simulated (300-500ms) for realism
- All API methods match the real API interface
- The mock API validates requests but doesn't enforce all business rules

