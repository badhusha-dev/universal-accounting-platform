import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { apiClient } from '../../api/client'
import { Download, Building2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function BalanceSheetPage() {
  const [asOfDate, setAsOfDate] = useState(new Date().toISOString().split('T')[0])

  const { data: balanceSheet, isLoading } = useQuery({
    queryKey: ['balance-sheet', asOfDate],
    queryFn: async () => {
      const response = await apiClient.get(`/reports/balance-sheet?asOfDate=${asOfDate}`)
      return response.data
    }
  })

  const exportToPDF = () => {
    // Mock PDF export
    console.log('Exporting Balance Sheet to PDF...')
  }

  const exportToExcel = () => {
    // Mock Excel export
    console.log('Exporting Balance Sheet to Excel...')
  }

  const chartData = balanceSheet ? [
    { name: 'Assets', value: parseFloat(balanceSheet.totalAssets) },
    { name: 'Liabilities', value: parseFloat(balanceSheet.totalLiabilities) },
    { name: 'Equity', value: parseFloat(balanceSheet.totalEquity) }
  ] : []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Balance Sheet</h1>
          <p className="text-gray-600">Assets, liabilities, and equity as of a specific date</p>
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
          <CardDescription>Select the date for the balance sheet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                As of Date
              </label>
              <Input
                type="date"
                value={asOfDate}
                onChange={(e) => setAsOfDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
      ) : balanceSheet ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Assets</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ${parseFloat(balanceSheet.totalAssets).toFixed(2)}
                    </p>
                  </div>
                  <Building2 className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Liabilities</p>
                    <p className="text-2xl font-bold text-red-600">
                      ${parseFloat(balanceSheet.totalLiabilities).toFixed(2)}
                    </p>
                  </div>
                  <Building2 className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Equity</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${parseFloat(balanceSheet.totalEquity).toFixed(2)}
                    </p>
                  </div>
                  <Building2 className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600">Assets</CardTitle>
                <CardDescription>What the company owns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {balanceSheet.assets.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.accountName}</p>
                        <p className="text-sm text-gray-600">{item.accountCode}</p>
                      </div>
                      <p className="font-bold text-blue-600">
                        ${parseFloat(item.amount).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Liabilities</CardTitle>
                <CardDescription>What the company owes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {balanceSheet.liabilities.map((item: any, index: number) => (
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

            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Equity</CardTitle>
                <CardDescription>Owner's stake in the company</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {balanceSheet.equity.map((item: any, index: number) => (
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
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Balance Sheet Overview</CardTitle>
              <CardDescription>Visual representation of assets, liabilities, and equity</CardDescription>
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

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Balance Sheet Equation</h3>
                <p className="text-2xl font-bold text-gray-800">
                  Assets = Liabilities + Equity
                </p>
                <p className="text-lg text-gray-600 mt-2">
                  ${parseFloat(balanceSheet.totalAssets).toFixed(2)} = ${parseFloat(balanceSheet.totalLiabilities).toFixed(2)} + ${parseFloat(balanceSheet.totalEquity).toFixed(2)}
                </p>
                <div className={`mt-4 px-4 py-2 rounded-lg ${
                  Math.abs(parseFloat(balanceSheet.totalAssets) - (parseFloat(balanceSheet.totalLiabilities) + parseFloat(balanceSheet.totalEquity))) < 0.01
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {Math.abs(parseFloat(balanceSheet.totalAssets) - (parseFloat(balanceSheet.totalLiabilities) + parseFloat(balanceSheet.totalEquity))) < 0.01
                    ? '✓ Balance Sheet is Balanced'
                    : '✗ Balance Sheet is Not Balanced'
                  }
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="p-8 text-center text-gray-500">
            <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No balance sheet data available for the selected date</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}