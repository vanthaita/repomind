import { API_BASE_URL } from '@/constants/api';
import { AppError, createErrorResponse } from '@/utils/error';
import { cache } from '@/utils/storage';

interface RequestConfig extends Omit<RequestInit, 'cache'> {
  cache?: boolean;
  cacheTTL?: number;
  retries?: number;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const {
      cache: useCache = false,
      cacheTTL = 5 * 60 * 1000, // 5 minutes
      retries = 3,
      ...requestConfig
    } = config;

    const url = `${this.baseURL}${endpoint}`;
    const cacheKey = `api:${url}:${JSON.stringify(requestConfig)}`;

    // Check cache first
    if (useCache) {
      const cachedData = cache.get<T>(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }

    // Retry logic
    let lastError: Error;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            ...requestConfig.headers,
          },
          ...requestConfig,
        });

        if (!response.ok) {
          throw new AppError(
            'NETWORK_ERROR',
            `HTTP ${response.status}: ${response.statusText}`,
            response.status
          );
        }

        const data = await response.json();

        // Cache successful responses
        if (useCache && data.success) {
          cache.set(cacheKey, data, cacheTTL);
        }

        return data;
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === retries) {
          throw lastError;
        }

        // Wait before retrying (exponential backoff)
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  // GET request
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', ...config });
  }

  // POST request
  async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', ...config });
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    });
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Export for convenience
export default apiClient; 