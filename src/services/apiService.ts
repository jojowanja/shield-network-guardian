interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

interface RequestOptions {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

class ApiService {
  private baseUrl: string;
  private defaultTimeout = 10000;
  private defaultRetries = 3;
  private defaultRetryDelay = 1000;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private async makeRequest<T>(
    url: string,
    options: RequestInit = {},
    requestOptions: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      timeout = this.defaultTimeout,
      retries = this.defaultRetries,
      retryDelay = this.defaultRetryDelay,
    } = requestOptions;

    const fullUrl = this.baseUrl + url;
    let lastError: Error;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await this.fetchWithTimeout(fullUrl, options, timeout);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        let data: T;

        if (contentType?.includes('application/json')) {
          data = await response.json();
        } else {
          data = await response.text() as T;
        }

        return {
          data,
          status: response.status,
        };
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on certain errors
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          // Network error, can retry
        } else if (error instanceof Error && error.name === 'AbortError') {
          // Timeout, can retry
        } else {
          // Other errors (like HTTP 4xx), don't retry
          break;
        }

        if (attempt < retries) {
          await this.delay(retryDelay * Math.pow(2, attempt)); // Exponential backoff
        }
      }
    }

    return {
      error: lastError.message,
      status: 0,
    };
  }

  async get<T>(url: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, { method: 'GET' }, options);
  }

  async post<T>(
    url: string,
    data?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      },
      options
    );
  }

  async put<T>(
    url: string,
    data?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(
      url,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      },
      options
    );
  }

  async delete<T>(url: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, { method: 'DELETE' }, options);
  }
}

// Create instances for different services
export const piApiService = new ApiService('');
export const supabaseApiService = new ApiService('');
export default ApiService;
