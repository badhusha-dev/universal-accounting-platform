import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Building2, 
  BookOpen, 
  FileText, 
  BarChart3,
  Calculator,
  Search
} from 'lucide-react'

export default function Sidebar() {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/onboarding', label: 'Onboarding', icon: Building2 },
    { path: '/ledger/journal/create', label: 'Create Journal', icon: BookOpen },
    { path: '/ledger/journal/explorer', label: 'Journal Explorer', icon: Search },
    { path: '/ledger/trial-balance', label: 'Trial Balance', icon: Calculator },
    { path: '/reports/profit-loss', label: 'Profit & Loss', icon: BarChart3 },
    { path: '/reports/balance-sheet', label: 'Balance Sheet', icon: FileText },
  ]

  return (
    <aside className="w-64 bg-white shadow-sm min-h-screen">
      <div className="p-4">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}