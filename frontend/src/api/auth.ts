export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  username: string;
  email: string;
  role: string;
  tenantId?: number;
  expiresIn?: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  tenantId?: number;
}

export const authApiClient = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    // Temporary mock authentication for demo users
    const demoUsers = [
      { username: 'admin', password: 'admin123', role: 'ADMIN', tenantId: 1 },
      { username: 'demo', password: 'demo123', role: 'USER', tenantId: 1 },
      { username: 'accountant', password: 'accountant123', role: 'ACCOUNTANT', tenantId: 1 },
      { username: 'user', password: 'user123', role: 'USER', tenantId: 1 }
    ];
    
    const user = demoUsers.find(u => u.username === credentials.username && u.password === credentials.password);
    
    if (user) {
      // Return mock response
      return {
        token: 'mock-jwt-token-' + user.username,
        refreshToken: 'mock-refresh-token-' + user.username,
        username: user.username,
        email: user.username + '@example.com',
        role: user.role,
        tenantId: user.tenantId,
        expiresIn: 86400
      };
    } else {
      throw new Error('Invalid credentials');
    }
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    // Mock register for demo - simulate successful registration
    return {
      token: 'mock-jwt-token-' + userData.username,
      refreshToken: 'mock-refresh-token-' + userData.username,
      username: userData.username,
      email: userData.email,
      role: 'USER',
      tenantId: 1,
      expiresIn: 86400
    };
  },

  getCurrentUser: async (): Promise<User> => {
    // Mock getCurrentUser for demo
    const token = localStorage.getItem('token');
    if (token && token.startsWith('mock-jwt-token-')) {
      const username = token.replace('mock-jwt-token-', '');
      return {
        id: 0,
        username: username,
        email: username + '@example.com',
        role: username === 'admin' ? 'ADMIN' : 'USER',
        tenantId: 1
      };
    }
    throw new Error('No valid token');
  },

  logout: async (): Promise<void> => {
    // Mock logout - just clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  },
};
