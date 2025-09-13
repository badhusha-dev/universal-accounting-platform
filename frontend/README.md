# Universal Accounting Platform - Frontend

A modern React + TypeScript frontend built with Vite, styled with Tailwind CSS and shadcn/ui components. This frontend integrates with the Universal Accounting Platform backend API Gateway.

## 🚀 Features

- **Authentication System**
  - Login/Register pages with form validation
  - JWT token management with automatic refresh
  - Protected routes with authentication guards

- **Tenant Management**
  - Business onboarding flow
  - Tenant dashboard with Chart of Accounts display
  - Support for 10 business types (Retail, Restaurant, Freelancer, etc.)

- **Ledger & Accounting Module**
  - **Journal Entry Creation**: Multi-line form with real-time balance validation
  - **Journal Explorer**: Browse, filter, and export journal entries with pagination
  - **Trial Balance**: View account balances grouped by type with export capabilities
  - **Real-time Activity Feed**: Live updates via Server-Sent Events with polling fallback
  - **Account Autocomplete**: Smart account code suggestions from chart of accounts

- **Financial Reports**
  - **Profit & Loss (P&L)**: Revenue vs expenses with charts and trend analysis
  - **Balance Sheet**: Assets, liabilities, and equity with visual breakdowns
  - **Export Functionality**: CSV, XLSX, and PDF export for all reports
  - **Dimension Filtering**: Filter by project, branch, or department

- **Modern UI/UX**
  - Responsive design with mobile-first approach
  - Beautiful shadcn/ui components
  - Dark/light theme support
  - Loading states and error handling
  - Real-time balance indicators and validation

- **State Management**
  - React Query for server state management
  - Local storage for JWT persistence
  - Optimistic updates and caching

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: React Router v6
- **State Management**: TanStack React Query
- **HTTP Client**: Axios
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📁 Project Structure

```
src/
├── api/                 # API client and configurations
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── layout/         # Layout components (Navbar, Sidebar)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Page components
│   ├── auth/           # Authentication pages
│   └── tenant/         # Tenant management pages
├── types/              # TypeScript type definitions
└── App.tsx             # Main application component
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API Gateway running on `http://localhost:8080`

### Installation

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests with Vitest
- `npm run test:ui` - Run tests with UI interface
- `npm run test:coverage` - Run tests with coverage report

## 🔧 Configuration

### API Configuration

The frontend is configured to proxy API requests to the backend:

- **Development**: Requests to `/api/*` are proxied to `http://localhost:8080`
- **Production**: Update the API base URL in `src/api/client.ts`

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:8080
```

## 🎨 UI Components

This project uses shadcn/ui components built on top of Radix UI primitives:

- **Button** - Various button styles and sizes
- **Input** - Form input fields with validation
- **Card** - Content containers with headers and descriptions
- **Select** - Dropdown selections with search
- **Avatar** - User profile images
- **Dropdown Menu** - Context menus
- **Table** - Data tables with sorting and pagination
- **Badge** - Status indicators and labels
- **Charts** - Recharts integration for financial visualizations

## 🔐 Authentication Flow

1. **Registration**: Users create accounts with name, email, and password
2. **Login**: JWT token is stored in localStorage
3. **Protected Routes**: Authentication guard redirects to login if not authenticated
4. **Logout**: Clears JWT and redirects to login page

## 🏢 Tenant Onboarding

1. **Business Setup**: Users select business type and enter business name
2. **Chart of Accounts**: System automatically seeds COA based on business type
3. **Dashboard**: Users can view their business information and accounts

## 📊 Ledger & Accounting Module

### Journal Entry Creation
- **Multi-line Form**: Create journal entries with multiple debit/credit lines
- **Real-time Validation**: Live balance checking with visual indicators
- **Account Autocomplete**: Smart suggestions from chart of accounts
- **Balance Enforcement**: Prevents submission of unbalanced entries

### Journal Explorer
- **Advanced Filtering**: Filter by date range, account code, source, reference
- **Pagination**: Server-side pagination with configurable page sizes
- **Expandable Rows**: View journal entry details inline
- **Export Functionality**: Export filtered results to CSV

### Trial Balance
- **Account Grouping**: View balances grouped by account type (Assets, Liabilities, etc.)
- **Balance Validation**: Visual indicators for balanced/unbalanced states
- **Export Options**: Download as CSV or PDF
- **Date Selection**: View balances as of any specific date

### Financial Reports
- **P&L Report**: Revenue vs expenses with interactive charts
- **Balance Sheet**: Assets, liabilities, and equity breakdown
- **Chart Integration**: Recharts for data visualization
- **Dimension Filtering**: Filter by project, branch, or department
- **Export Support**: Multiple format support (XLSX, PDF)

### Real-time Features
- **Activity Feed**: Live updates on journal entries and account changes
- **Server-Sent Events**: Real-time connection with polling fallback
- **Toast Notifications**: Instant feedback on journal entry postings
- **Auto-refresh**: Background data updates without user intervention

## 📱 Responsive Design

The application is fully responsive with:

- **Mobile-first approach**: Optimized for mobile devices
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Sidebar**: Collapsible navigation on mobile
- **Touch-friendly**: Large touch targets and gestures

## 🔄 State Management

### React Query Integration

- **Caching**: Automatic caching of API responses
- **Background Updates**: Data refreshes in background
- **Error Handling**: Global error handling with toast notifications
- **Loading States**: Built-in loading indicators

### Authentication State

- **Context Provider**: Global auth state management
- **Persistence**: JWT stored in localStorage
- **Auto-refresh**: Token validation on app startup

## 🚀 Deployment

### Production Build

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Environment Setup

For production deployment:

1. Update API base URL in `src/api/client.ts`
2. Configure proper CORS settings on backend
3. Set up proper error monitoring
4. Configure CDN for static assets

## 🧪 Testing

The project includes comprehensive testing setup with Vitest and React Testing Library:

### Running Tests
```bash
# Run all tests
npm run test

# Run tests with UI interface
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

### Test Structure
- **Unit Tests**: Component-level testing with mocked dependencies
- **Integration Tests**: Full user flow testing with API mocks
- **Test Coverage**: Comprehensive coverage reporting

### Test Examples
- **Journal Entry Form**: Balance validation, form submission, error handling
- **API Integration**: Journal creation flow, error scenarios
- **Component Behavior**: User interactions, state changes

### Test Files
```
src/__tests__/
├── ledger/
│   ├── JEForm.test.tsx              # Journal entry form unit tests
│   └── JournalCreatePage.integration.test.tsx  # Integration tests
└── test/
    └── setup.ts                     # Test configuration
```

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript for all new code
3. Follow the component naming conventions
4. Add proper error handling
5. Write meaningful commit messages
6. Include tests for new features
7. Ensure test coverage is maintained

## 📄 License

This project is part of the Universal Accounting Platform.
