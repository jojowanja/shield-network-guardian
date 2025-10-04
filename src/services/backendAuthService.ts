import { BACKEND_CONFIG } from '@/config/backend';

interface User {
  id: string;
  email: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
}

interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

class BackendAuthService {
  private token: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    // Load tokens from localStorage on init
    this.token = localStorage.getItem('auth_token');
    this.refreshToken = localStorage.getItem('refresh_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ data?: T; error?: string }> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }

      const response = await fetch(`${BACKEND_CONFIG.API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || 'Request failed' };
      }

      return { data };
    } catch (error) {
      console.error('Request error:', error);
      return { error: error instanceof Error ? error.message : 'Network error' };
    }
  }

  async signUp(email: string, password: string, userData?: any) {
    console.log('Attempting to sign up user:', email);

    const { data, error } = await this.request<AuthResponse>(
      BACKEND_CONFIG.ENDPOINTS.REGISTER,
      {
        method: 'POST',
        body: JSON.stringify({ email, password, ...userData }),
      }
    );

    if (error) {
      console.error('Sign up error:', error);
      return { error, user: null };
    }

    if (data) {
      this.setTokens(data.token, data.refreshToken);
      console.log('User created successfully:', data.user.id);
      return { error: null, user: data.user };
    }

    return { error: 'Unknown error', user: null };
  }

  async signIn(email: string, password: string) {
    console.log('Attempting to sign in user:', email);

    const { data, error } = await this.request<AuthResponse>(
      BACKEND_CONFIG.ENDPOINTS.LOGIN,
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );

    if (error) {
      console.error('Sign in error:', error);
      throw new Error(error);
    }

    if (data) {
      this.setTokens(data.token, data.refreshToken);
      console.log('Sign in successful:', data.user.email);
      return { shouldRedirectToWelcome: true, user: data.user };
    }

    throw new Error('Unknown error');
  }

  async resetPassword(email: string) {
    console.log('Attempting password reset for:', email);

    const { error } = await this.request(BACKEND_CONFIG.ENDPOINTS.RESET_PASSWORD, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    if (error) {
      console.error('Password reset error:', error);
      return { error };
    }

    console.log('Password reset email sent successfully');
    return { error: null };
  }

  async refreshSession() {
    console.log('Refreshing session...');

    if (!this.token) {
      return { session: null, user: null };
    }

    const { data, error } = await this.request<{ user: User }>(
      BACKEND_CONFIG.ENDPOINTS.REFRESH,
      {
        method: 'POST',
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      }
    );

    if (error) {
      console.error('Session refresh error:', error);
      this.clearTokens();
      return { session: null, user: null };
    }

    console.log('Session refreshed:', data ? 'Active' : 'None');
    return {
      session: this.token ? { access_token: this.token } : null,
      user: data?.user || null,
    };
  }

  async signOut() {
    console.log('Signing out user...');

    await this.request(BACKEND_CONFIG.ENDPOINTS.LOGOUT, {
      method: 'POST',
    });

    this.clearTokens();
    console.log('Sign out successful');
  }

  async logSignInEvent(userId: string) {
    try {
      console.log('Logging sign-in event...');
      await this.request(BACKEND_CONFIG.ENDPOINTS.SECURITY_EVENTS, {
        method: 'POST',
        body: JSON.stringify({
          user_id: userId,
          event_type: 'other',
          severity: 'low',
          description: `User signed in from ${navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Browser'} at ${new Date().toLocaleString()}`,
          resolved: true,
        }),
      });
      console.log('Sign-in event logged successfully');
    } catch (error) {
      console.error('Error logging sign-in event:', error);
    }
  }

  private setTokens(token: string, refreshToken?: string) {
    this.token = token;
    this.refreshToken = refreshToken || null;
    localStorage.setItem('auth_token', token);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
  }

  private clearTokens() {
    this.token = null;
    this.refreshToken = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }

  getToken() {
    return this.token;
  }
}

export const backendAuthService = new BackendAuthService();
