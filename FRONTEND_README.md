# Carbon Credit Trading Platform - Frontend

React-based frontend for the Carbon Credit Trading Platform hackathon project.

## Features Implemented

### ✅ Core Requirements

#### 1. Authentication Module [1]
- Login page with username/password authentication
- JWT token-based authentication
- Protected routes for authenticated users
- Auto-redirect on login/logout

#### 2. Landing Page / Dashboard [2, 3, 4]
- **Balance Display**: Shows company's carbon credits and cash balance
- **My Requests Table**: View all outgoing requests with:
  - Request Date
  - Company Name
  - Request Type (Buy/Sell)
  - Carbon Price (SGD/Tonne)
  - Carbon Quantity (Tonnes)
  - Requesting Reason
  - Status (Pending/Accepted/Rejected)
- **Create Request**: Modal form to create new buy/sell requests
- **Edit Request**: Edit pending requests (only for pending status)
- **Delete Request**: Remove pending requests with confirmation

#### 3. Requests Received Page [5, 6, 7]
- **View Incoming Requests**: See all requests from other companies
- **Accept/Reject**: Individual request approval actions
- **Bulk Operations**: Select multiple requests and accept/reject in bulk
- **Overdue Alerts**: Alert banner for requests older than 7 days
- **Visual Indicators**: Highlighted rows for overdue requests

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── BalanceCard.jsx     # Display account balances
│   ├── Layout.jsx          # Main layout with navigation
│   ├── ProtectedRoute.jsx  # Route guard for authentication
│   ├── RequestModal.jsx    # Create/Edit request form
│   └── RequestTable.jsx    # Reusable table for requests
├── context/             # React Context providers
│   └── AuthContext.jsx     # Authentication state management
├── pages/               # Main application pages
│   ├── Landing.jsx         # Dashboard page
│   ├── Login.jsx           # Login page
│   └── RequestsReceived.jsx # Incoming requests page
├── services/            # API integration
│   └── api.js              # API service layer
├── App.jsx              # Main app component with routing
└── main.jsx             # Application entry point
```

## Tech Stack

- **React 19** - UI library
- **React Router DOM** - Client-side routing
- **Vite** - Build tool and dev server
- **CSS** - Styling (no external UI libraries for MVP)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on `http://localhost:8080`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## API Integration

The frontend expects the backend API to be running at `http://localhost:8080/api/v1`.

### API Endpoints Used

- `POST /auth/login` - User authentication
- `GET /account/balance` - Get account balances
- `GET /requests/my` - Get outgoing requests
- `POST /requests/new` - Create new request
- `PUT /requests/{id}` - Update request
- `DELETE /requests/{id}` - Delete request
- `GET /requests/incoming` - Get incoming requests
- `PATCH /requests/{id}/status` - Accept/Reject request
- `POST /requests/bulk-action` - Bulk accept/reject
- `GET /requests/alerts` - Get overdue alerts

## Features & Usage

### Login
1. Enter username and password
2. Click "Login"
3. Upon successful authentication, redirected to Dashboard

### Dashboard
1. View your company's carbon and cash balances at the top
2. See all your outgoing requests in the table
3. **Create Request**: Click "+ New Request" button
   - Fill in target company ID, type, price, quantity, reason
   - Submit to create
4. **Edit Request**: Click "Edit" on any pending request
   - Modify price, quantity, or reason
   - Cannot change target company
5. **Delete Request**: Click "Delete" on any pending request
   - Confirm deletion in popup

### Requests Received
1. View all incoming requests from other companies
2. **Individual Actions**:
   - Click "Accept" to approve a request
   - Click "Reject" to decline a request
3. **Bulk Actions**:
   - Check boxes next to requests
   - Click "Accept Selected" or "Reject Selected"
4. **Overdue Alerts**: Yellow banner appears if any requests are >7 days old

## Key Design Decisions

### MVP Focus
- Clean, functional UI without fancy animations
- Focus on core functionality over aesthetics
- Responsive design for different screen sizes

### State Management
- React Context for authentication state
- Local component state for page-specific data
- No external state management library (Redux, etc.)

### Error Handling
- User-friendly error messages
- Form validation
- API error handling with try-catch

### User Experience
- Confirmation dialogs for destructive actions
- Loading states for async operations
- Visual feedback for status (colors, badges)
- Disabled actions for non-pending requests

## Troubleshooting

### API Connection Issues
- Ensure backend is running on `http://localhost:8080`
- Check browser console for CORS errors
- Verify API endpoints match the expected format

### Authentication Issues
- Clear localStorage if experiencing login issues: `localStorage.clear()`
- Check that JWT token is being stored properly
- Verify token is sent in Authorization header

### Build Issues
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf .vite`

## Future Enhancements (Not in MVP)

- Dashboard with data visualizations
- Multi-layer approval workflows
- Real-time notifications
- Request history and analytics
- Company directory for easier request creation
- File attachments for requests
- Request comments/messages

## Development Notes

- All API calls go through the `api.js` service layer
- Authentication token is stored in localStorage
- Protected routes automatically redirect to login if not authenticated
- Table component is reusable for both outgoing and incoming requests
- Modal form handles both create and edit operations

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript features required
- CSS Grid and Flexbox for layouts

