import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { apiClient } from '../../api/client'
import { Building2, DollarSign, TrendingUp, Users } from 'lucide-react'
import ThreeDChart from '../../components/animations/ThreeDChart'
import LoadingAnimation from '../../components/animations/LoadingAnimation'

export default function TenantDashboardPage() {
  const { data: tenant, isLoading } = useQuery({
    queryKey: ['tenant'],
    queryFn: async () => {
      const response = await apiClient.get('/tenants/1') // Mock tenant ID
      return response.data
    }
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingAnimation type="dna" size="lg" message="Loading your dashboard..." />
      </div>
    )
  }

  const stats = [
    {
      title: 'Total Revenue',
      value: '$65,000',
      change: '+12.5%',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Total Expenses',
      value: '$45,000',
      change: '+8.2%',
      icon: TrendingUp,
      color: 'text-red-600'
    },
    {
      title: 'Net Income',
      value: '$20,000',
      change: '+15.3%',
      icon: TrendingUp,
      color: 'text-blue-600'
    },
    {
      title: 'Active Users',
      value: '5',
      change: '+2',
      icon: Users,
      color: 'text-purple-600'
    }
  ]

  // Sample data for 3D charts
  const revenueData = [
    { label: 'Q1', value: 15000, color: '#3b82f6' },
    { label: 'Q2', value: 18000, color: '#8b5cf6' },
    { label: 'Q3', value: 22000, color: '#06b6d4' },
    { label: 'Q4', value: 25000, color: '#10b981' }
  ]

  const expenseData = [
    { label: 'Office', value: 8000, color: '#ef4444' },
    { label: 'Marketing', value: 5000, color: '#f59e0b' },
    { label: 'Operations', value: 12000, color: '#8b5cf6' },
    { label: 'Other', value: 3000, color: '#06b6d4' }
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back to Universal Accounting</p>
      </motion.div>

      {tenant && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>{tenant.name}</span>
              </CardTitle>
              <CardDescription>
                {tenant.businessType} • {tenant.currencyCode}
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>
      )}

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className={`text-sm ${stat.color}`}>{stat.change}</p>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* 3D Charts Section */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <ThreeDChart
          data={revenueData}
          type="bar"
          title="Quarterly Revenue"
          className="bg-gradient-to-br from-blue-900 to-purple-900"
        />
        <ThreeDChart
          data={expenseData}
          type="pie"
          title="Expense Distribution"
          className="bg-gradient-to-br from-red-900 to-orange-900"
        />
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Journal Entries</CardTitle>
            <CardDescription>Latest accounting transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: 'JE-001', description: 'Office supplies purchase', amount: '$150.00', date: '2024-01-15' },
                { id: 'JE-002', description: 'Client payment received', amount: '$2,500.00', date: '2024-01-14' },
                { id: 'JE-003', description: 'Monthly rent payment', amount: '$1,200.00', date: '2024-01-13' },
              ].map((entry, index) => (
                <motion.div 
                  key={entry.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div>
                    <p className="font-medium">{entry.id}</p>
                    <p className="text-sm text-gray-600">{entry.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{entry.amount}</p>
                    <p className="text-sm text-gray-600">{entry.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common accounting tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { title: 'Create Journal Entry', description: 'Record a new transaction', color: 'blue' },
                { title: 'View Trial Balance', description: 'Check account balances', color: 'green' },
                { title: 'Generate Reports', description: 'Create financial reports', color: 'purple' }
              ].map((action, index) => (
                <motion.button 
                  key={action.title}
                  className={`w-full text-left p-3 bg-${action.color}-50 hover:bg-${action.color}-100 rounded-lg transition-colors`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <p className={`font-medium text-${action.color}-900`}>{action.title}</p>
                  <p className={`text-sm text-${action.color}-700`}>{action.description}</p>
                </motion.button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}