# Quick Start Guide

## 🚀 Application is Running!

Your Carbon Credit Trading Platform frontend is now running at:
**http://localhost:5174/**

## 📋 What's Been Built

A complete MVP frontend implementing all core hackathon requirements:

### ✅ 3 Main Pages
1. **Login Page** - Authentication with username/password
2. **Dashboard** - View balances, manage your outgoing requests
3. **Requests Received** - Handle incoming requests from other companies

### ✅ All Required Features
- Company balance display (carbon credits + cash)
- Create/Edit/Delete buy/sell requests
- View and manage incoming requests
- Accept/Reject requests (individual and bulk)
- Overdue request alerts (>7 days)
- Protected routes with JWT authentication

## 🔧 Next Steps

### 1. Backend Setup
Ensure your backend API is running on `http://localhost:8080`

The frontend expects these endpoints:
```
POST   /api/v1/auth/login
GET    /api/v1/account/balance
GET    /api/v1/requests/my
POST   /api/v1/requests/new
PUT    /api/v1/requests/{id}
DELETE /api/v1/requests/{id}
GET    /api/v1/requests/incoming
PATCH  /api/v1/requests/{id}/status
POST   /api/v1/requests/bulk-action
GET    /api/v1/requests/alerts
```

### 2. Test the Application

#### Login Flow
1. Open http://localhost:5174/
2. Enter credentials (backend should provide test accounts)
3. You'll be redirected to the Dashboard

#### Dashboard Features
- View your company's carbon and cash balances
- See all your outgoing requests
- Click "+ New Request" to create a request
- Click "Edit" on pending requests to modify them
- Click "Delete" to remove pending requests

#### Requests Received
- Navigate to "Requests Received" in the top menu
- View all incoming requests from other companies
- Click "Accept" or "Reject" on individual requests
- Use checkboxes to select multiple and bulk accept/reject
- See alerts for overdue requests

### 3. Common Test Scenarios

**Scenario 1: Create a Buy Request**
1. Go to Dashboard
2. Click "+ New Request"
3. Fill in:
   - Target Company ID: (e.g., 2)
   - Type: BUY
   - Price: 25.00
   - Quantity: 100
   - Reason: "Monthly Carbon Offset"
4. Click "Create"

**Scenario 2: Bulk Accept Requests**
1. Go to "Requests Received"
2. Check boxes next to multiple pending requests
3. Click "Accept Selected"
4. Requests are processed in bulk

**Scenario 3: Edit a Request**
1. Go to Dashboard
2. Find a pending request
3. Click "Edit"
4. Change price or quantity
5. Click "Update"

## 📁 Key Files

```
src/
├── pages/
│   ├── Login.jsx           - Login page
│   ├── Landing.jsx         - Dashboard page
│   └── RequestsReceived.jsx - Incoming requests page
├── components/
│   ├── Layout.jsx          - Navigation and layout
│   ├── BalanceCard.jsx     - Balance display
│   ├── RequestTable.jsx    - Reusable table component
│   └── RequestModal.jsx    - Create/Edit form
├── services/
│   └── api.js              - All API calls
└── context/
    └── AuthContext.jsx     - Authentication state
```

## 🎨 Design Philosophy

**MVP Focus:**
- Clean, functional UI
- No unnecessary animations
- Focus on core functionality
- Easy to understand and extend

**User Experience:**
- Clear visual feedback
- Confirmation for destructive actions
- Loading states during API calls
- Error messages when things fail

## 🐛 Troubleshooting

### "Login failed"
- Check that backend is running
- Verify credentials with backend team
- Check browser console for errors

### "Failed to load data"
- Ensure backend API is accessible
- Check CORS settings on backend
- Verify JWT token is valid

### Server not starting
```bash
# Kill any process on the port and restart
killall node
npm run dev
```

### Dependencies issues
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## 📊 Status Indicators

### Request Types
- 🔵 **BUY** - Company wants to purchase carbon credits
- 🟢 **SELL** - Company wants to sell carbon credits

### Request Status
- 🟡 **PENDING** - Awaiting response (can edit/delete)
- 🟢 **ACCEPTED** - Request approved
- 🔴 **REJECTED** - Request declined

### Overdue Requests
- Highlighted in yellow background
- Alert banner shown on Requests Received page
- Defined as requests older than 7 days

## 🔐 Security Notes

- JWT tokens stored in localStorage
- Tokens sent in Authorization header
- Protected routes redirect to login if not authenticated
- Tokens should expire (handled by backend)

## 📚 Additional Documentation

- `FRONTEND_README.md` - Detailed technical documentation
- `IMPLEMENTATION_CHECKLIST.md` - Feature completion checklist
- `api_endpoints_md.md` - API endpoint reference
- `techtrek_hackathon_md.md` - Original requirements

## 🎯 Hackathon Tips

1. **Demo Flow**: Login → Show Dashboard → Create Request → Show Requests Received → Accept Request
2. **Highlight Features**: Bulk operations, overdue alerts, real-time balance updates
3. **Explain Decisions**: MVP focus, clean code structure, reusable components
4. **Future Enhancements**: Mention dashboard visualizations, real-time updates, multi-approval workflow

## 💡 Pro Tips

- Use browser DevTools Network tab to debug API calls
- Check Console for any JavaScript errors
- Test with multiple browser tabs to simulate different companies
- Clear localStorage if authentication gets stuck: `localStorage.clear()`

---

**Ready to demo!** 🎉

Your frontend is fully functional and implements all required features for the hackathon.
Good luck! 🍀

