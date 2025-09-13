import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { apiClient } from '../../api/client'
import { Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface JournalEntryForm {
  entryDate: string
  description: string
  reference?: string
  lines: JournalEntryLine[]
}

interface JournalEntryLine {
  accountId: number
  description: string
  debitAmount: number
  creditAmount: number
}

export default function JournalCreatePage() {
  const [isLoading, setIsLoading] = useState(false)
  
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm<JournalEntryForm>({
    defaultValues: {
      entryDate: new Date().toISOString().split('T')[0],
      description: '',
      reference: '',
      lines: [
        { accountId: 0, description: '', debitAmount: 0, creditAmount: 0 },
        { accountId: 0, description: '', debitAmount: 0, creditAmount: 0 }
      ]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lines'
  })

  const watchedLines = watch('lines')
  const totalDebit = watchedLines.reduce((sum, line) => sum + (line.debitAmount || 0), 0)
  const totalCredit = watchedLines.reduce((sum, line) => sum + (line.creditAmount || 0), 0)
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01

  const createJournalEntryMutation = useMutation({
    mutationFn: async (data: JournalEntryForm) => {
      const response = await apiClient.post('/ledger/journal-entries', data)
      return response.data
    },
    onSuccess: () => {
      toast.success('Journal entry created successfully!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create journal entry')
    }
  })

  const onSubmit = async (data: JournalEntryForm) => {
    if (!isBalanced) {
      toast.error('Total debits must equal total credits')
      return
    }

    setIsLoading(true)
    try {
      await createJournalEntryMutation.mutateAsync(data)
    } finally {
      setIsLoading(false)
    }
  }

  const addLine = () => {
    append({ accountId: 0, description: '', debitAmount: 0, creditAmount: 0 })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create Journal Entry</CardTitle>
          <CardDescription>
            Record a new accounting transaction with balanced debits and credits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Entry Date *
                </label>
                <Input
                  {...register('entryDate', { required: 'Entry date is required' })}
                  type="date"
                  disabled={isLoading}
                />
                {errors.entryDate && (
                  <p className="text-sm text-red-600 mt-1">{errors.entryDate.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reference
                </label>
                <Input
                  {...register('reference')}
                  placeholder="Invoice #12345"
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <Input
                  {...register('description', { required: 'Description is required' })}
                  placeholder="Transaction description"
                  disabled={isLoading}
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Journal Entry Lines</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addLine}
                  disabled={isLoading}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Line
                </Button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-12 gap-4 items-end p-4 border rounded-lg">
                    <div className="col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account ID
                      </label>
                      <Input
                        {...register(`lines.${index}.accountId`, { 
                          required: 'Account ID is required',
                          valueAsNumber: true
                        })}
                        type="number"
                        placeholder="1001"
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div className="col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <Input
                        {...register(`lines.${index}.description`)}
                        placeholder="Line description"
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Debit Amount
                      </label>
                      <Input
                        {...register(`lines.${index}.debitAmount`, { valueAsNumber: true })}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Credit Amount
                      </label>
                      <Input
                        {...register(`lines.${index}.creditAmount`, { valueAsNumber: true })}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => remove(index)}
                        disabled={isLoading || fields.length <= 2}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  <p>Total Debit: <span className="font-medium">${totalDebit.toFixed(2)}</span></p>
                  <p>Total Credit: <span className="font-medium">${totalCredit.toFixed(2)}</span></p>
                </div>
                <div className={`text-sm font-medium ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>
                  {isBalanced ? '✓ Balanced' : '✗ Not Balanced'}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" disabled={isLoading}>
                Save as Draft
              </Button>
              <Button type="submit" disabled={isLoading || !isBalanced}>
                {isLoading ? 'Creating...' : 'Create Journal Entry'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}