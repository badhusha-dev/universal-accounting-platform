import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { apiClient } from '../../api/client'
import { Download, Calculator } from 'lucide-react'

export default function TrialBalancePage() {
  const [asOfDate, setAsOfDate] = useState(new Date().toISOString().split('T')[0])

  const { data: trialBalance, isLoading } = useQuery({
    queryKey: ['trial-balance', asOfDate],
    queryFn: async () => {
      const response = await apiClient.get(`/reports/trial-balance?asOfDate=${asOfDate}`)
      return response.data
    }
  })

  const exportToCSV = () => {
    if (!trialBalance?.items) return
    
    const csvContent = [
      ['Account Code', 'Account Name', 'Account Type', 'Debit Balance', 'Credit Balance'].join(','),
      ...trialBalance.items.map((item: any) => [
        item.accountCode,
        item.accountName,
        item.accountType,
        item.debitBalance,
        item.creditBalance
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'trial-balance.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const totalDebit = trialBalance?.items?.reduce((sum: number, item: any) => sum + parseFloat(item.debitBalance || 0), 0) || 0
  const totalCredit = trialBalance?.items?.reduce((sum: number, item: any) => sum + parseFloat(item.creditBalance || 0), 0) || 0

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trial Balance</h1>
          <p className="text-gray-600">Account balances as of a specific date</p>
        </div>
        <Button onClick={exportToCSV} disabled={!trialBalance?.items?.length}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Parameters</CardTitle>
          <CardDescription>Select the date for the trial balance</CardDescription>
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

      <Card>
        <CardHeader>
          <CardTitle>Trial Balance Report</CardTitle>
          <CardDescription>
            As of {asOfDate} • {trialBalance?.items?.length || 0} accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          ) : trialBalance?.items?.length ? (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Account Code</th>
                      <th className="text-left p-2">Account Name</th>
                      <th className="text-left p-2">Type</th>
                      <th className="text-right p-2">Debit Balance</th>
                      <th className="text-right p-2">Credit Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trialBalance.items.map((item: any, index: number) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-mono text-sm">{item.accountCode}</td>
                        <td className="p-2">{item.accountName}</td>
                        <td className="p-2">
                          <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                            {item.accountType}
                          </span>
                        </td>
                        <td className="p-2 text-right">
                          {parseFloat(item.debitBalance || 0) > 0 ? `$${parseFloat(item.debitBalance).toFixed(2)}` : '-'}
                        </td>
                        <td className="p-2 text-right">
                          {parseFloat(item.creditBalance || 0) > 0 ? `$${parseFloat(item.creditBalance).toFixed(2)}` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 font-bold">
                      <td colSpan={3} className="p-2">TOTAL</td>
                      <td className="p-2 text-right">${totalDebit.toFixed(2)}</td>
                      <td className="p-2 text-right">${totalCredit.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Balance Check:</span>
                  <span className={Math.abs(totalDebit - totalCredit) < 0.01 ? 'text-green-600' : 'text-red-600'}>
                    {Math.abs(totalDebit - totalCredit) < 0.01 ? '✓ Balanced' : '✗ Not Balanced'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Difference: ${Math.abs(totalDebit - totalCredit).toFixed(2)}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No trial balance data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}