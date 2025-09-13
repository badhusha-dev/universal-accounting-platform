import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { apiClient } from '../../api/client'
import toast from 'react-hot-toast'

interface TenantForm {
  name: string
  businessType: string
  email: string
  phone?: string
  address?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
  currencyCode: string
}

const businessTypes = [
  'Retail',
  'Restaurant',
  'Freelancer',
  'Manufacturing',
  'Service',
  'Technology',
  'Healthcare',
  'Education',
  'Other'
]

export default function TenantOnboardingPage() {
  const [isLoading, setIsLoading] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm<TenantForm>({
    defaultValues: {
      currencyCode: 'USD'
    }
  })

  const createTenantMutation = useMutation({
    mutationFn: async (data: TenantForm) => {
      const response = await apiClient.post('/tenants', data)
      return response.data
    },
    onSuccess: () => {
      toast.success('Tenant created successfully!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create tenant')
    }
  })

  const onSubmit = async (data: TenantForm) => {
    setIsLoading(true)
    try {
      await createTenantMutation.mutateAsync(data)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Tenant Onboarding</CardTitle>
          <CardDescription>
            Set up your business information to get started with Universal Accounting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name *
                </label>
                <Input
                  {...register('name', { required: 'Business name is required' })}
                  placeholder="Enter business name"
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Type *
                </label>
                <select
                  {...register('businessType', { required: 'Business type is required' })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  disabled={isLoading}
                >
                  <option value="">Select business type</option>
                  {businessTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.businessType && (
                  <p className="text-sm text-red-600 mt-1">{errors.businessType.message}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <Input
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  type="email"
                  placeholder="business@example.com"
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <Input
                  {...register('phone')}
                  placeholder="+1 (555) 123-4567"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <Input
                {...register('address')}
                placeholder="123 Main Street"
                disabled={isLoading}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <Input
                  {...register('city')}
                  placeholder="New York"
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <Input
                  {...register('state')}
                  placeholder="NY"
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code
                </label>
                <Input
                  {...register('postalCode')}
                  placeholder="10001"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <Input
                  {...register('country')}
                  placeholder="United States"
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency *
                </label>
                <select
                  {...register('currencyCode', { required: 'Currency is required' })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  disabled={isLoading}
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                </select>
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating Tenant...' : 'Create Tenant'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}