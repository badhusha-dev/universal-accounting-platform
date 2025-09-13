import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import toast from 'react-hot-toast'
import { Copy, Check } from 'lucide-react'
import AnimatedBackground from '../../components/animations/AnimatedBackground'

interface LoginForm {
  username: string
  password: string
}

const demoUsers = [
  { username: 'admin', password: 'admin123', role: 'ADMIN', tenant: 'Universal Accounting Demo', description: 'Full system access' },
  { username: 'accountant', password: 'accountant123', role: 'ACCOUNTANT', tenant: 'Universal Accounting Demo', description: 'Accounting operations' },
  { username: 'user', password: 'user123', role: 'USER', tenant: 'Universal Accounting Demo', description: 'Basic user access' },
  { username: 'restaurant', password: 'restaurant123', role: 'ACCOUNTANT', tenant: 'Bella Vista Restaurant', description: 'Restaurant business' },
  { username: 'retail', password: 'retail123', role: 'ACCOUNTANT', tenant: 'TechMart Electronics', description: 'Retail business' },
  { username: 'freelancer', password: 'freelancer123', role: 'USER', tenant: 'Alex Freelancer Services', description: 'Freelancer business' },
]

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [copiedUser, setCopiedUser] = useState<string | null>(null)
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    try {
      await login(data.username, data.password)
      toast.success('Login successful!')
      navigate('/dashboard')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const copyCredentials = (user: typeof demoUsers[0]) => {
    setValue('username', user.username)
    setValue('password', user.password)
    setCopiedUser(user.username)
    setTimeout(() => setCopiedUser(null), 2000)
    toast.success(`Credentials copied for ${user.username}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Enhanced animated background for login */}
      <AnimatedBackground intensity={0.4} />
      
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="w-full backdrop-blur-sm bg-white/90 border-white/20 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Sign in</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Input
                  {...register('username', { required: 'Username is required' })}
                  placeholder="Username"
                  disabled={isLoading}
                />
                {errors.username && (
                  <p className="text-sm text-red-600 mt-1">{errors.username.message}</p>
                )}
              </div>
              
              <div>
                <Input
                  {...register('password', { required: 'Password is required' })}
                  type="password"
                  placeholder="Password"
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
                )}
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-500">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
          </Card>
        </motion.div>

        {/* Demo Users */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="w-full backdrop-blur-sm bg-white/90 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Demo Users</CardTitle>
            <CardDescription>
              Click on any user to automatically fill in the login form
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {demoUsers.map((user, index) => (
                <motion.div
                  key={user.username}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => copyCredentials(user)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{user.username}</span>
                        <Badge variant="secondary" className="text-xs">
                          {user.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{user.description}</p>
                      <p className="text-xs text-gray-500">{user.tenant}</p>
                    </div>
                    <div className="ml-2">
                      {copiedUser === user.username ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              className="mt-4 p-3 bg-blue-50 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.8 }}
            >
              <h4 className="font-medium text-blue-900 mb-2">Quick Start Guide:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>admin</strong> - Full system access with all permissions</li>
                <li>• <strong>accountant</strong> - Accounting operations and reporting</li>
                <li>• <strong>user</strong> - Basic user access for data entry</li>
                <li>• <strong>restaurant/retail/freelancer</strong> - Business-specific accounts</li>
              </ul>
            </motion.div>
          </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}