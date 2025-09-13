import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { apiClient } from '../../api/client'
import { Download, TrendingUp, TrendingDown } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import ThreeDChart from '../../components/animations/ThreeDChart'
import LoadingAnimation from '../../components/animations/LoadingAnimation'


export default function PnLPage() {
  const [startDate, setStartDate] = useState('2024-01-01')
  const [endDate, setEndDate] = useState('2024-12-31')

  const { data: profitLoss, isLoading } = useQuery({
    queryKey: ['profit-loss', startDate, endDate],
    queryFn: async () => {
      const response = await apiClient.get(`/reports/profit-loss?startDate=${startDate}&endDate=${endDate}`)
      return response.data
    }
  })

  const exportToPDF = () => {
    // Mock PDF export
    console.log('Exporting P&L to PDF...')
  }

  const exportToExcel = () => {
    // Mock Excel export
    console.log('Exporting P&L to Excel...')
  }

  const chartData = profitLoss ? [
    ...profitLoss.revenueItems.map((item: any) => ({
      name: item.accountName,
      value: parseFloat(item.amount),
      type: 'Revenue'
    })),
    ...profitLoss.expenseItems.map((item: any) => ({
      name: item.accountName,
      value: parseFloat(item.amount),
      type: 'Expense'
    }))
  ] : []

  // Sample 3D chart data for demo
  const revenue3DData = [
    { label: 'Sales Revenue', value: 45000, color: '#10b981' },
    { label: 'Service Revenue', value: 15000, color: '#3b82f6' },
    { label: 'Other Income', value: 5000, color: '#8b5cf6' }
  ]

  const expense3DData = [
    { label: 'Cost of Sales', value: 20000, color: '#ef4444' },
    { label: 'Operating Expenses', value: 15000, color: '#f59e0b' },
    { label: 'Administrative', value: 8000, color: '#8b5cf6' },
    { label: 'Marketing', value: 5000, color: '#06b6d4' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profit & Loss Statement</h1>
          <p className="text-gray-600">Revenue and expense analysis</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={exportToPDF} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button onClick={exportToExcel} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Parameters</CardTitle>
          <CardDescription>Select the date range for the P&L statement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-96">
          <LoadingAnimation type="particles" size="lg" message="Generating P&L report..." />
        </div>
      ) : profitLoss ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${profitLoss.totalRevenue.toFixed(2)}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                    <p className="text-2xl font-bold text-red-600">
                      ${profitLoss.totalExpenses.toFixed(2)}
                    </p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Net Income</p>
                    <p className={`text-2xl font-bold ${
                      profitLoss.netIncome >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${profitLoss.netIncome.toFixed(2)}
                    </p>
                  </div>
                  {profitLoss.netIncome >= 0 ? (
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  ) : (
                    <TrendingDown className="h-8 w-8 text-red-600" />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Revenue by account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profitLoss.revenueItems.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.accountName}</p>
                        <p className="text-sm text-gray-600">{item.accountCode}</p>
                      </div>
                      <p className="font-bold text-green-600">
                        ${parseFloat(item.amount).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>Expenses by account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profitLoss.expenseItems.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.accountName}</p>
                        <p className="text-sm text-gray-600">{item.accountCode}</p>
                      </div>
                      <p className="font-bold text-red-600">
                        ${parseFloat(item.amount).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 3D Charts Section */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ThreeDChart
              data={revenue3DData}
              type="pie"
              title="Revenue Distribution"
              className="bg-gradient-to-br from-green-900 to-emerald-900"
            />
            <ThreeDChart
              data={expense3DData}
              type="bar"
              title="Expense Breakdown"
              className="bg-gradient-to-br from-red-900 to-orange-900"
            />
          </motion.div>

          <Card>
            <CardHeader>
              <CardTitle>Revenue vs Expenses Chart</CardTitle>
              <CardDescription>Visual breakdown of revenue and expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="p-8 text-center text-gray-500">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No P&L data available for the selected period</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}