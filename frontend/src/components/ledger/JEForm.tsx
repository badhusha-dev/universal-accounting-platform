import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Calculator } from 'lucide-react';
import toast from 'react-hot-toast';

interface JEFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  initialData?: any;
}

interface JournalEntryFormData {
  date: string;
  description: string;
  reference?: string;
  lines: {
    accountCode: string;
    debit: number;
    credit: number;
    currency: string;
    memo?: string;
  }[];
}

export default function JEForm({ onSubmit, isLoading = false, initialData }: JEFormProps) {
  const [isBalanced, setIsBalanced] = useState(false);
  const [balanceDifference, setBalanceDifference] = useState(0);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<JournalEntryFormData>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      description: '',
      reference: '',
      lines: [
        { accountCode: '', debit: 0, credit: 0, currency: 'USD', memo: '' },
        { accountCode: '', debit: 0, credit: 0, currency: 'USD', memo: '' },
      ],
      ...initialData,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'lines',
  });

  const watchedLines = watch('lines');

  // Calculate balance
  useEffect(() => {
    const totalDebits = watchedLines.reduce((sum, line) => sum + (line.debit || 0), 0);
    const totalCredits = watchedLines.reduce((sum, line) => sum + (line.credit || 0), 0);
    const difference = Math.abs(totalDebits - totalCredits);
    
    setIsBalanced(difference < 0.01); // Allow for small floating point differences
    setBalanceDifference(difference);
  }, [watchedLines]);

  const addLine = () => {
    append({ accountCode: '', debit: 0, credit: 0, currency: 'USD', memo: '' });
  };

  const removeLine = (index: number) => {
    if (fields.length > 2) {
      remove(index);
    }
  };

  const handleFormSubmit = (data: JournalEntryFormData) => {
    if (!isBalanced) {
      toast.error('Journal entry must be balanced before submission');
      return;
    }

    // Filter out empty lines
    const validLines = data.lines.filter(line => 
      line.accountCode && (line.debit > 0 || line.credit > 0)
    );

    if (validLines.length < 2) {
      toast.error('At least two lines are required');
      return;
    }

    onSubmit({
      ...data,
      lines: validLines,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Journal Entry
        </CardTitle>
        <CardDescription>
          Create a balanced journal entry. Debits must equal credits.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Header Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                {...register('date', { required: 'Date is required' })}
              />
              {errors.date && (
                <p className="text-sm text-red-600">{errors.date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference">Reference</Label>
              <Input
                id="reference"
                placeholder="Optional reference"
                {...register('reference')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select defaultValue="USD">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Enter journal entry description"
              {...register('description', { required: 'Description is required' })}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Balance Indicator */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              {isBalanced ? (
                <Badge variant="default" className="bg-green-500">
                  Balanced ✅
                </Badge>
              ) : (
                <Badge variant="destructive">
                  Unbalanced — difference ${balanceDifference.toFixed(2)}
                </Badge>
              )}
            </div>
            <div className="text-sm text-gray-600">
              Debits: ${watchedLines.reduce((sum, line) => sum + (line.debit || 0), 0).toFixed(2)} | 
              Credits: ${watchedLines.reduce((sum, line) => sum + (line.credit || 0), 0).toFixed(2)}
            </div>
          </div>

          {/* Journal Entry Lines */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Journal Entry Lines</Label>
              <Button type="button" variant="outline" size="sm" onClick={addLine}>
                <Plus className="h-4 w-4 mr-1" />
                Add Line
              </Button>
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-6 gap-3 p-3 border rounded-lg">
                  <div className="md:col-span-2 space-y-1">
                    <Label>Account Code</Label>
                    <Input
                      placeholder="e.g., 1000"
                      {...register(`lines.${index}.accountCode`, {
                        required: 'Account code is required',
                      })}
                    />
                    {errors.lines?.[index]?.accountCode && (
                      <p className="text-xs text-red-600">
                        {errors.lines[index]?.accountCode?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor={`debit-${index}`}>Debit</Label>
                    <Input
                      id={`debit-${index}`}
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      {...register(`lines.${index}.debit`, {
                        valueAsNumber: true,
                        min: { value: 0, message: 'Debit must be positive' },
                      })}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        if (value > 0) {
                          setValue(`lines.${index}.credit`, 0);
                        }
                      }}
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor={`credit-${index}`}>Credit</Label>
                    <Input
                      id={`credit-${index}`}
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      {...register(`lines.${index}.credit`, {
                        valueAsNumber: true,
                        min: { value: 0, message: 'Credit must be positive' },
                      })}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        if (value > 0) {
                          setValue(`lines.${index}.debit`, 0);
                        }
                      }}
                    />
                  </div>

                  <div className="space-y-1">
                    <Label>Memo</Label>
                    <Input
                      placeholder="Optional memo"
                      {...register(`lines.${index}.memo`)}
                    />
                  </div>

                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeLine(index)}
                      disabled={fields.length <= 2}
                      aria-label={`Remove line ${index + 1}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline">
              Save Draft
            </Button>
            <Button type="submit" disabled={!isBalanced || isLoading}>
              {isLoading ? 'Posting...' : 'Post Journal Entry'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
