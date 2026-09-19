import apiClient from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: 'dispatcher' | 'mechanic_lead' | 'warehouse_manager' | 'operations_manager' | 'director';
  poolId?: string;
  poolName?: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  token?: string;
  user: UserProfile;
  message?: string;
}

export const authService = {
  /**
   * Inisialisasi CSRF Cookie Laravel Sanctum sebelum request login
   */
  async getCsrfCookie(): Promise<void> {
    const sanctumBase = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || '';
    await apiClient.get(`${sanctumBase}/sanctum/csrf-cookie`);
  },

  /**
   * Login ke backend Laravel (Mendukung Bearer Token Sanctum & Token Response)
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Panggil CSRF cookie jika menggunakan Sanctum cookie
      await this.getCsrfCookie().catch(() => {
        // Fallback jika backend menggunakan pure Bearer Token API
      });

      const response = await apiClient.post<AuthResponse>('/login', credentials);
      const data = response.data;

      if (data.token) {
        localStorage.setItem('tayo_auth_token', data.token);
      }
      if (data.user) {
        localStorage.setItem('tayo_user_profile', JSON.stringify(data.user));
      }

      return data;
    } catch (err) {
      // Mock Fallback jika backend offline
      if (import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true') {
        const mockUser: UserProfile = {
          id: 1,
          name: 'Ratna Sari',
          email: credentials.email || 'ratna.sari@tayo-trans.co.id',
          role: 'operations_manager',
          poolName: 'Pool Pusat Pulogebang',
          avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
        };
        const mockResponse: AuthResponse = {
          token: 'mock-jwt-token-tayo-2024-sanctum',
          user: mockUser,
          message: 'Login sukses (Mock Fallback Mode)',
        };
        localStorage.setItem('tayo_auth_token', mockResponse.token!);
        localStorage.setItem('tayo_user_profile', JSON.stringify(mockUser));
        return mockResponse;
      }
      throw err;
    }
  },

  /**
   * Logout dari sesi Laravel
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/logout');
    } catch {
      // Abaikan error jaringan saat logout
    } finally {
      localStorage.removeItem('tayo_auth_token');
      localStorage.removeItem('tayo_user_profile');
    }
  },

  /**
   * Dapatkan profil user yang sedang login dari Laravel
   */
  async getMe(): Promise<UserProfile | null> {
    try {
      const response = await apiClient.get<{ user: UserProfile } | UserProfile>('/user');
      const user = 'user' in response.data ? response.data.user : response.data;
      localStorage.setItem('tayo_user_profile', JSON.stringify(user));
      return user;
    } catch (err) {
      const saved = localStorage.getItem('tayo_user_profile');
      if (saved) {
        return JSON.parse(saved);
      }
      return null;
    }
  },

  /**
   * Cek status autentikasi lokal
   */
  isAuthenticated(): boolean {
    return Boolean(localStorage.getItem('tayo_auth_token') || localStorage.getItem('tayo_user_profile'));
  },

  /**
   * Dapatkan user lokal yang tersimpan
   */
  getCurrentUser(): UserProfile | null {
    const saved = localStorage.getItem('tayo_user_profile');
    return saved ? JSON.parse(saved) : null;
  }
};

export default authService;

