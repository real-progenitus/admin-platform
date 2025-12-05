import { useState, useEffect } from 'react';
import { LoginRequest, LoginResponse } from '@admin-platform/shared-auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export function useAuth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<LoginResponse['user'] | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    refreshAccessToken();
  }, []);

  const refreshAccessToken = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.accessToken);
        
        const payload = JSON.parse(atob(data.accessToken.split('.')[1]));
        setUser({
          id: payload.sub,
          email: payload.email,
          role: payload.role,
        });
        setIsAuthenticated(true);
      }
    } catch (err) {
      // Refresh failed, user needs to login again
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const loginRequest: LoginRequest = { email, password };
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(loginRequest),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data: LoginResponse = await response.json();
      setAccessToken(data.accessToken);
      setIsAuthenticated(true);
      setUser(data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout error:', err);
    }
    
    setAccessToken(null);
    setIsAuthenticated(false);
    setUser(null);
    setEmail('');
    setPassword('');
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isLoading,
    isAuthenticated,
    user,
    accessToken,
    handleLogin,
    handleLogout,
  };
}
