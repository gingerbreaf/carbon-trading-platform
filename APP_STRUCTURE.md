# Application Structure Overview

## 🗺️ Page Flow

```
┌─────────────┐
│ Login Page  │
│             │
│  Username   │
│  Password   │
│   [Login]   │
└──────┬──────┘
       │ Authentication
       ▼
┌─────────────────────────────────────────────────┐
│              Main Application                    │
│  ┌─────────────────────────────────────────┐   │
│  │         Navigation Bar                   │   │
│  │  [Dashboard] [Requests Received] [Logout]│   │
│  └─────────────────────────────────────────┘   │
│                                                  │
│  ┌──────────────────┐  ┌──────────────────┐   │
│  │   Dashboard      │  │ Requests Received│   │
│  │                  │  │                   │   │
│  │  ┌────────────┐  │  │  ⚠️  Overdue!    │   │
│  │  │  Balances  │  │  │                   │   │
│  │  │  💰 🌳     │  │  │  ☑️ [Select All] │   │
│  │  └────────────┘  │  │                   │   │
│  │                  │  │  ☐ Request 1      │   │
│  │  [+ New Request] │  │  ☐ Request 2      │   │
│  │                  │  │  ☐ Request 3      │   │
│  │  My Requests:    │  │                   │   │
│  │  ┌────────────┐  │  │  [Accept] [Reject]│   │
│  │  │ Request 1  │  │  │                   │   │
│  │  │ [Edit] [Del]  │  └──────────────────┘   │
│  │  └────────────┘  │                           │
│  │  ┌────────────┐  │                           │
│  │  │ Request 2  │  │                           │
│  │  │ [Edit] [Del]  │                           │
│  │  └────────────┘  │                           │
│  └──────────────────┘                           │
└─────────────────────────────────────────────────┘
```

## 📂 File Structure & Dependencies

```
src/
│
├── main.jsx                    # App entry point
│   └── imports App.jsx
│
├── App.jsx                     # Router & Auth Provider
│   ├── uses AuthProvider
│   ├── uses BrowserRouter
│   └── defines Routes:
│       ├── /login → Login
│       ├── / → Landing (protected)
│       └── /requests-received → RequestsReceived (protected)
│
├── context/
│   └── AuthContext.jsx         # Global auth state
│       ├── manages user state
│       ├── handles login/logout
│       └── uses api.js
│
├── services/
│   └── api.js                  # API layer
│       └── all backend calls
│
├── components/
│   ├── Layout.jsx              # App shell
│   │   ├── Navigation bar
│   │   ├── User info
│   │   └── Logout button
│   │
│   ├── ProtectedRoute.jsx      # Route guard
│   │   └── redirects if not authenticated
│   │
│   ├── BalanceCard.jsx         # Balance display
│   │   └── shows carbon + cash
│   │
│   ├── RequestTable.jsx        # Reusable table
│   │   ├── used in Landing
│   │   ├── used in RequestsReceived
│   │   └── handles both outgoing/incoming views
│   │
│   └── RequestModal.jsx        # Create/Edit form
│       └── modal dialog with form
│
└── pages/
    ├── Login.jsx               # Login page
    │   ├── uses AuthContext
    │   └── uses api.js
    │
    ├── Landing.jsx             # Dashboard page
    │   ├── uses Layout
    │   ├── uses BalanceCard
    │   ├── uses RequestTable
    │   ├── uses RequestModal
    │   └── uses api.js
    │
    └── RequestsReceived.jsx    # Incoming requests
        ├── uses Layout
        ├── uses RequestTable
        └── uses api.js
```

## 🔄 Data Flow

### Login Flow
```
User Input (username/password)
    ↓
Login Component
    ↓
AuthContext.login()
    ↓
api.login() → POST /auth/login
    ↓
Store JWT in localStorage
    ↓
Load user data → GET /account/balance
    ↓
Update AuthContext state
    ↓
Redirect to Dashboard
```

### View Dashboard Flow
```
Landing Component mounts
    ↓
Parallel API calls:
    ├── api.getAccountBalance() → GET /account/balance
    └── api.getMyRequests() → GET /requests/my
    ↓
Update local state
    ↓
Render BalanceCard + RequestTable
```

### Create Request Flow
```
User clicks "+ New Request"
    ↓
RequestModal opens
    ↓
User fills form
    ↓
Submit form
    ↓
api.createRequest() → POST /requests/new
    ↓
Close modal
    ↓
Refresh data (reload dashboard)
```

### Accept Request Flow
```
User clicks "Accept" on request
    ↓
api.updateRequestStatus(id, 'ACCEPTED')
    ↓
PATCH /requests/{id}/status
    ↓
Reload requests list
    ↓
Update table view
```

### Bulk Accept Flow
```
User checks multiple boxes
    ↓
User clicks "Accept Selected"
    ↓
api.bulkUpdateStatus(ids, 'ACCEPTED')
    ↓
POST /requests/bulk-action
    ↓
Clear selection
    ↓
Reload requests list
```

## 🎨 Component Hierarchy

```
App
└── BrowserRouter
    └── AuthProvider
        ├── Login (route: /login)
        │   └── Login form
        │
        └── ProtectedRoute (routes: / and /requests-received)
            └── Layout
                ├── Navigation Bar
                │   ├── Brand
                │   ├── Nav Links
                │   └── User Menu
                │
                └── Main Content
                    ├── Landing (route: /)
                    │   ├── Page Header
                    │   ├── BalanceCard
                    │   ├── RequestTable
                    │   └── RequestModal (conditional)
                    │
                    └── RequestsReceived (route: /requests-received)
                        ├── Page Header
                        ├── Bulk Actions
                        ├── Overdue Alert (conditional)
                        └── RequestTable
```

## 🔐 Authentication Flow

```
┌─────────────────┐
│ User visits app │
└────────┬────────┘
         │
         ▼
┌────────────────────┐
│ Check localStorage │
│ for JWT token      │
└────────┬───────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
  Token     No Token
  exists    
    │         │
    │         └──→ Redirect to /login
    │
    ├──→ Load user data
    │
    ├──→ Success: Set user in AuthContext
    │
    ├──→ Failure: Clear token, redirect to /login
    │
    └──→ User can access protected routes
```

## 📡 API Integration Points

### Authentication Module
- `POST /auth/login` - Used by: Login page
- JWT stored in localStorage
- Token included in all subsequent requests

### Account Module
- `GET /account/balance` - Used by: Landing page (BalanceCard)

### Outgoing Requests
- `GET /requests/my` - Used by: Landing page (RequestTable)
- `POST /requests/new` - Used by: Landing page (RequestModal)
- `PUT /requests/{id}` - Used by: Landing page (RequestModal)
- `DELETE /requests/{id}` - Used by: Landing page (RequestTable)

### Incoming Requests
- `GET /requests/incoming` - Used by: RequestsReceived page
- `PATCH /requests/{id}/status` - Used by: RequestsReceived page
- `POST /requests/bulk-action` - Used by: RequestsReceived page
- `GET /requests/alerts` - Used by: RequestsReceived page

## 🎯 Key Features Map

```
Feature: Login [Requirement 1]
├── Page: Login.jsx
├── Context: AuthContext.jsx
└── API: POST /auth/login

Feature: Balance Display [Requirement 2]
├── Page: Landing.jsx
├── Component: BalanceCard.jsx
└── API: GET /account/balance

Feature: View My Requests [Requirement 3]
├── Page: Landing.jsx
├── Component: RequestTable.jsx
└── API: GET /requests/my

Feature: Create/Edit/Delete Requests [Requirement 4]
├── Page: Landing.jsx
├── Component: RequestModal.jsx + RequestTable.jsx
└── APIs:
    ├── POST /requests/new
    ├── PUT /requests/{id}
    └── DELETE /requests/{id}

Feature: View Incoming Requests [Requirement 5]
├── Page: RequestsReceived.jsx
├── Component: RequestTable.jsx
└── API: GET /requests/incoming

Feature: Accept/Reject Requests [Requirement 6]
├── Page: RequestsReceived.jsx
├── Component: RequestTable.jsx
└── APIs:
    ├── PATCH /requests/{id}/status
    └── POST /requests/bulk-action

Feature: Overdue Alerts [Requirement 7]
├── Page: RequestsReceived.jsx
├── Logic: Alert banner + row highlighting
└── API: GET /requests/alerts
```

## 🧩 Reusable Components

### RequestTable
**Purpose:** Display requests in a table format  
**Used In:** Landing.jsx, RequestsReceived.jsx  
**Props:**
- `requests` - Array of request objects
- `onEdit` - Edit handler (Landing only)
- `onDelete` - Delete handler (Landing only)
- `onAccept` - Accept handler (RequestsReceived only)
- `onReject` - Reject handler (RequestsReceived only)
- `selectedIds` - Array of selected IDs (RequestsReceived only)
- `onSelect` - Checkbox handler (RequestsReceived only)
- `showActions` - Show edit/delete buttons
- `showReceivedActions` - Show accept/reject buttons

### RequestModal
**Purpose:** Create or edit request  
**Used In:** Landing.jsx  
**Props:**
- `request` - Request object (null for create, object for edit)
- `onClose` - Close handler with refresh flag

### BalanceCard
**Purpose:** Display account balances  
**Used In:** Landing.jsx  
**Props:**
- `balance` - Object with companyName, carbonBalance, cashBalance

### Layout
**Purpose:** App shell with navigation  
**Used In:** All protected routes  
**Children:** Page content

### ProtectedRoute
**Purpose:** Redirect to login if not authenticated  
**Used In:** App.jsx routing  
**Children:** Protected page content

---

This structure provides a clean separation of concerns, reusable components, and clear data flow for the MVP hackathon project.

