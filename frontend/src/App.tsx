import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './hooks/useAuth'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import AnimatedBackground from './components/animations/AnimatedBackground'
import PageTransition from './components/animations/PageTransition'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import TenantOnboardingPage from './pages/tenant/TenantOnboardingPage'
import TenantDashboardPage from './pages/tenant/TenantDashboardPage'
import JournalCreatePage from './pages/ledger/JournalCreatePage'
import JournalExplorerPage from './pages/ledger/JournalExplorerPage'
import TrialBalancePage from './pages/ledger/TrialBalancePage'
import PnLPage from './pages/reports/PnLPage'
import BalanceSheetPage from './pages/reports/BalanceSheetPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 relative overflow-hidden">
            {/* Animated background */}
            <AnimatedBackground intensity={0.3} />
            
            <PageTransition>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Protected routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<TenantDashboardPage />} />
                  <Route path="onboarding" element={<TenantOnboardingPage />} />
                  
                  {/* Ledger routes */}
                  <Route path="ledger">
                    <Route path="journal/create" element={<JournalCreatePage />} />
                    <Route path="journal/explorer" element={<JournalExplorerPage />} />
                    <Route path="trial-balance" element={<TrialBalancePage />} />
                  </Route>
                  
                  {/* Reports routes */}
                  <Route path="reports">
                    <Route path="profit-loss" element={<PnLPage />} />
                    <Route path="balance-sheet" element={<BalanceSheetPage />} />
                  </Route>
                </Route>
              </Routes>
            </PageTransition>
            <Toaster position="top-right" />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App