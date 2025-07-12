// API service for communicating with the Rust server
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export interface Product {
  id: string;
  name: Record<string, string>;
  description: Record<string, string>;
  price: string;
  thumbnailImage: string;
  category: string;
  subcategory: string;
  originalPrice?: string;
  featureImages?: string[];
  specs?: Record<string, string>;
  brand?: string;
  stock?: number;
  acquisitionDate?: string;
  isNew?: boolean;
  isPopular?: boolean;
  isOffer?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface HandmadeProduct {
  id: string;
  name: Record<string, string>;
  description: Record<string, string>;
  longDescription: Record<string, string>;
  price: string;
  thumbnailImage: string;
  featureImages: string[];
  category: string;
  subcategory: string;
  specs: Record<string, string>;
  originalPrice?: string;
  stock?: number;
  acquisitionDate?: string;
  isOffer?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BuildComponent {
  productId: string;
  quantity: number;
  notes?: string;
}

export interface Build {
  id: string;
  name: Record<string, string>;
  description: Record<string, string>;
  longDescription: Record<string, string>;
  price: string;
  thumbnailImage: string;
  featureImages: string[];
  category: string;
  subcategory: string;
  specs: Record<string, string>;
  components: BuildComponent[];
  originalPrice?: string;
  stock?: number;
  acquisitionDate?: string;
  isOffer?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Utility function to check if JWT token is expired
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      console.error("Error parsing token:", error);
      return true; // Assume expired if we can't parse it
    }
  }

  // Utility function to decode and log token details
  private logTokenDetails(token: string): void {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        console.error("Token is not a valid JWT (should have 3 parts)");
        return;
      }

      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));

      console.log("Token details:", {
        header,
        payload,
        isExpired: this.isTokenExpired(token),
        currentTime: Date.now() / 1000,
        expiresAt: payload.exp,
      });
    } catch (error) {
      console.error("Error parsing token details:", error);
    }
  }

  // Utility function to validate token before making requests
  private validateToken(token: string): boolean {
    if (!token) return false;
    return !this.isTokenExpired(token);
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    // Debug logging for authentication requests
    console.log(`=== API REQUEST DEBUG for ${endpoint} ===`);
    if (options?.headers && (options.headers as any)["Authorization"]) {
      console.log(`API Request to ${endpoint}:`, {
        url,
        method: options.method || "GET",
        hasAuth: true,
        authHeader: (options.headers as any)["Authorization"].substring(0, 20) + "...",
        fullHeaders: options.headers,
        body: options.body ? JSON.parse(options.body as string) : undefined,
      });
    } else {
      console.log(`API Request to ${endpoint}:`, {
        url,
        method: options?.method || "GET",
        hasAuth: false,
        headers: options?.headers,
      });
    }

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error for ${endpoint}:`, {
          status: response.status,
          statusText: response.statusText,
          responseText: errorText,
        });
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Products API
  async getAllProducts(): Promise<Product[]> {
    return this.request<Product[]>("/api/products");
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.request<Product | null>(`/api/products/${id}`);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return this.request<Product[]>(`/api/products/category/${category}`);
  }

  // Handmade Products API
  async getAllHandmade(): Promise<HandmadeProduct[]> {
    return this.request<HandmadeProduct[]>("/api/handmade");
  }

  async getHandmadeById(id: string): Promise<HandmadeProduct | null> {
    return this.request<HandmadeProduct | null>(`/api/handmade/${id}`);
  }

  async getHandmadeByCategory(category: string): Promise<HandmadeProduct[]> {
    return this.request<HandmadeProduct[]>(`/api/handmade/category/${category}`);
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string; service: string }> {
    return this.request("/api/health");
  }

  // Seed database (for development)
  async seedDatabase(): Promise<{ message: string; timestamp: string }> {
    return this.request("/api/seed", { method: "POST" });
  }

  // Auth API
  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    return this.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string, name: string): Promise<{ token: string; user: any }> {
    return this.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });
  }

  async getCurrentUser(token: string): Promise<any> {
    return this.request("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Test function to verify auth is working
  async testAuth(token: string): Promise<any> {
    console.log("Testing auth with token:", token ? `${token.substring(0, 20)}...` : "null");
    try {
      const result = await this.getCurrentUser(token);
      console.log("Auth test successful:", result);
      return result;
    } catch (error) {
      console.error("Auth test failed:", error);
      throw error;
    }
  }

  // Test function to verify admin access
  async testAdminAccess(token: string): Promise<any> {
    console.log("Testing admin access with token:", token ? `${token.substring(0, 20)}...` : "null");
    try {
      // Try to access admin endpoint with a minimal request
      const result = await this.request("/api/admin/products", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Admin access test successful:", result);
      return result;
    } catch (error) {
      console.error("Admin access test failed:", error);
      throw error;
    }
  }

  async refreshToken(token: string): Promise<{ token: string; user: any }> {
    return this.request("/api/auth/refresh", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Admin Products API
  async createProduct(product: Omit<Product, "id">, token: string): Promise<Product> {
    console.log("=== CREATE PRODUCT DEBUG ===");
    console.log("createProduct called with token:", token ? `${token.substring(0, 20)}...` : "null");
    console.log("Full token:", token);
    console.log("Product data:", product);
    this.logTokenDetails(token);

    if (!this.validateToken(token)) {
      console.log("Token validation failed!");
      throw new Error("Token is expired or invalid");
    }
    console.log("Token validation passed!");

    // Aseguramos que la imagen es una URL string en el JSON
    const productToSend = { ...product, image: String(product.image) };

    return this.request("/api/admin/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productToSend),
    });
  }

  async updateProduct(id: string, product: Partial<Product>, token: string): Promise<Product> {
    return this.request(`/api/admin/products/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });
  }

  async deleteProduct(id: string, token: string): Promise<{ message: string }> {
    return this.request(`/api/admin/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Admin Handmade API
  async createHandmade(handmade: Omit<HandmadeProduct, "id">, token: string): Promise<HandmadeProduct> {
    return this.request("/api/admin/handmade", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(handmade),
    });
  }

  async updateHandmade(id: string, handmade: Partial<HandmadeProduct>, token: string): Promise<HandmadeProduct> {
    return this.request(`/api/admin/handmade/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(handmade),
    });
  }

  async deleteHandmade(id: string, token: string): Promise<{ message: string }> {
    return this.request(`/api/admin/handmade/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Builds API
  async getAllBuilds(): Promise<Build[]> {
    return this.request<Build[]>("/api/builds");
  }
  async deleteBuild(id: string, token: string): Promise<{ message: string }> {
    return this.request(`/api/admin/builds/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();
