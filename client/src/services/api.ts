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

// Nueva interfaz para ventas
export interface Sale {
  id: string;
  productId: string;
  productType: "product" | "handmade" | "build";
  productName: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  discount?: string;
  finalPrice: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  paymentMethod: string;
  notes?: string;
  saleDate: string;
  createdAt?: string;
}

export interface SaleRequest {
  productId: string;
  productType: "product" | "handmade" | "build";
  quantity: number;
  discount?: number;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  paymentMethod: string;
  notes?: string;
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

      const data = await response.json();

      // Convert backend snake_case to frontend camelCase for specific endpoints
      if (endpoint.includes("/products") || endpoint.includes("/handmade") || endpoint.includes("/builds")) {
        return this.convertSnakeCaseToCamelCase(data);
      }

      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  private convertSnakeCaseToCamelCase<T>(data: any): T {
    if (Array.isArray(data)) {
      return data.map((item) => this.convertSnakeCaseToCamelCase(item)) as T;
    }

    if (data && typeof data === "object") {
      const converted: any = {};
      for (const [key, value] of Object.entries(data)) {
        const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        converted[camelKey] = this.convertSnakeCaseToCamelCase(value);
      }
      return converted as T;
    }

    return data as T;
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

    // Convert frontend camelCase to backend snake_case
    const productToSend = {
      name: product.name,
      description: product.description,
      price: product.price,
      thumbnail_image: product.thumbnailImage,
      category: product.category,
      subcategory: product.subcategory,
      original_price: product.originalPrice,
      feature_images: product.featureImages,
      specs: product.specs,
      brand: product.brand,
      stock: product.stock,
      acquisition_date: product.acquisitionDate,
      is_new: product.isNew,
      is_popular: product.isPopular,
      is_offer: product.isOffer,
    };

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
    // Convert frontend camelCase to backend snake_case
    const productToSend: any = {};

    if (product.name !== undefined) productToSend.name = product.name;
    if (product.description !== undefined) productToSend.description = product.description;
    if (product.price !== undefined) productToSend.price = product.price;
    if (product.thumbnailImage !== undefined) productToSend.thumbnail_image = product.thumbnailImage;
    if (product.category !== undefined) productToSend.category = product.category;
    if (product.subcategory !== undefined) productToSend.subcategory = product.subcategory;
    if (product.originalPrice !== undefined) productToSend.original_price = product.originalPrice;
    if (product.featureImages !== undefined) productToSend.feature_images = product.featureImages;
    if (product.specs !== undefined) productToSend.specs = product.specs;
    if (product.brand !== undefined) productToSend.brand = product.brand;
    if (product.stock !== undefined) productToSend.stock = product.stock;
    if (product.acquisitionDate !== undefined) productToSend.acquisition_date = product.acquisitionDate;
    if (product.isNew !== undefined) productToSend.is_new = product.isNew;
    if (product.isPopular !== undefined) productToSend.is_popular = product.isPopular;
    if (product.isOffer !== undefined) productToSend.is_offer = product.isOffer;

    return this.request(`/api/admin/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productToSend),
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
    // Convert frontend camelCase to backend snake_case
    const handmadeToSend = {
      name: handmade.name,
      description: handmade.description,
      long_description: handmade.longDescription,
      price: handmade.price,
      thumbnail_image: handmade.thumbnailImage,
      feature_images: handmade.featureImages,
      category: handmade.category,
      subcategory: handmade.subcategory,
      specs: handmade.specs,
      original_price: handmade.originalPrice,
      stock: handmade.stock,
      acquisition_date: handmade.acquisitionDate,
      is_offer: handmade.isOffer,
    };

    return this.request("/api/admin/handmade", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(handmadeToSend),
    });
  }

  async updateHandmade(id: string, handmade: Partial<HandmadeProduct>, token: string): Promise<HandmadeProduct> {
    // Convert frontend camelCase to backend snake_case
    const handmadeToSend: any = {};

    if (handmade.name !== undefined) handmadeToSend.name = handmade.name;
    if (handmade.description !== undefined) handmadeToSend.description = handmade.description;
    if (handmade.longDescription !== undefined) handmadeToSend.long_description = handmade.longDescription;
    if (handmade.price !== undefined) handmadeToSend.price = handmade.price;
    if (handmade.thumbnailImage !== undefined) handmadeToSend.thumbnail_image = handmade.thumbnailImage;
    if (handmade.featureImages !== undefined) handmadeToSend.feature_images = handmade.featureImages;
    if (handmade.category !== undefined) handmadeToSend.category = handmade.category;
    if (handmade.subcategory !== undefined) handmadeToSend.subcategory = handmade.subcategory;
    if (handmade.specs !== undefined) handmadeToSend.specs = handmade.specs;
    if (handmade.originalPrice !== undefined) handmadeToSend.original_price = handmade.originalPrice;
    if (handmade.stock !== undefined) handmadeToSend.stock = handmade.stock;
    if (handmade.acquisitionDate !== undefined) handmadeToSend.acquisition_date = handmade.acquisitionDate;
    if (handmade.isOffer !== undefined) handmadeToSend.is_offer = handmade.isOffer;

    return this.request(`/api/admin/handmade/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(handmadeToSend),
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

  // Sales API
  async getAllSales(token: string): Promise<Sale[]> {
    return this.request<Sale[]>("/api/admin/sales", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async createSale(sale: SaleRequest, token: string): Promise<Sale> {
    return this.request("/api/admin/sales", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(sale),
    });
  }

  async getSaleById(id: string, token: string): Promise<Sale> {
    return this.request<Sale>(`/api/admin/sales/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();
