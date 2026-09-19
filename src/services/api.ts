import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

/**
 * Konfigurasi HTTP Client Axios Terstandarisasi untuk Backend Laravel
 * Mendukung:
 * 1. Laravel Sanctum (Cookie-based Session Auth & Bearer Token)
 * 2. Laravel Passport (OAuth2 Bearer Token)
 * 3. Otomatisasi Header JSON & X-Requested-With untuk mencegah redirect HTML
 * 4. Interseptor Response untuk standardisasi pesan error validasi (HTTP 422) & autentikasi (HTTP 401)
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true, // Wajib untuk Laravel Sanctum CSRF cookies
  timeout: 15000,
});

// Request Interceptor: Lampirkan Bearer Token jika tersimpan di localStorage
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('tayo_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

// Response Interceptor: Tangani error umum Laravel secara terpusat
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<any>) => {
    if (error.response) {
      const { status, data } = error.response;

      // 401: Token kedaluwarsa / Sesi berakhir
      if (status === 401) {
        localStorage.removeItem('tayo_auth_token');
        localStorage.removeItem('tayo_user_profile');
        window.dispatchEvent(new CustomEvent('tayo-unauthorized'));
      }

      // Format pesan error standar dari Laravel
      const parsedError: ApiErrorResponse = {
        message: data?.message || 'Terjadi kesalahan pada server Laravel.',
        errors: data?.errors || undefined,
        status,
      };

      return Promise.reject(parsedError);
    } else if (error.request) {
      // Tidak ada respon dari server (Backend Laravel belum menyala / offline)
      const networkError: ApiErrorResponse = {
        message: 'Tidak dapat terhubung ke backend Laravel. Pastikan php artisan serve berjalan di port 8000.',
        status: 0,
      };
      return Promise.reject(networkError);
    }

    return Promise.reject({
      message: error.message || 'Terjadi kesalahan tidak terduga.',
      status: -1,
    });
  }
);

export default apiClient;

