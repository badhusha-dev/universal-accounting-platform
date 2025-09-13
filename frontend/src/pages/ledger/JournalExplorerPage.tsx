import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { apiClient } from '../../api/client'
import { Download, Search } from 'lucide-react'

export default function JournalExplorerPage() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const { data: journalEntries, isLoading } = useQuery({
    queryKey: ['journal-entries', startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)
      
      const response = await apiClient.get(`/ledger/journal-entries?${params}`)
      return response.data
    }
  })

  const exportToCSV = () => {
    if (!journalEntries) return
    
    const csvContent = [
      ['Entry Number', 'Date', 'Description', 'Status', 'Total Debit', 'Total Credit'].join(','),
      ...journalEntries.map((entry: any) => [
        entry.entryNumber,
        entry.entryDate,
        entry.description,
        entry.status,
        entry.totalDebit,
        entry.totalCredit
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'journal-entries.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Journal Explorer</h1>
          <p className="text-gray-600">Browse and manage journal entries</p>
        </div>
        <Button onClick={exportToCSV} disabled={!journalEntries?.length}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter journal entries by date range</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex-1">
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

      <Card>
        <CardHeader>
          <CardTitle>Journal Entries</CardTitle>
          <CardDescription>
            {journalEntries?.length || 0} entries found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          ) : journalEntries?.length ? (
            <div className="space-y-4">
              {journalEntries.map((entry: any) => (
                <div key={entry.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{entry.entryNumber}</h3>
                      <p className="text-sm text-gray-600">{entry.description}</p>
                      <p className="text-xs text-gray-500">{entry.entryDate}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-xs ${
                        entry.status === 'POSTED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {entry.status}
                      </span>
                      <div className="mt-2 text-sm">
                        <p>Debit: ${entry.totalDebit}</p>
                        <p>Credit: ${entry.totalCredit}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No journal entries found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}