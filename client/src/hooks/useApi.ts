import { useState, useEffect } from "react";
import { apiService } from "../services/api";
import type { Product, HandmadeProduct } from "../services/api";

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProducts() {
  const fetchProducts = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const products = await apiService.getAllProducts();
      setState({ data: products, loading: false, error: null, refetch: fetchProducts });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch products",
        refetch: fetchProducts,
      });
    }
  };

  const [state, setState] = useState<ApiState<Product[]>>({
    data: null,
    loading: true,
    error: null,
    refetch: fetchProducts,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  return state;
}

export function useProductById(id: string) {
  const fetchProduct = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const product = await apiService.getProductById(id);
      setState({ data: product || null, loading: false, error: null, refetch: fetchProduct });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch product",
        refetch: fetchProduct,
      });
    }
  };

  const [state, setState] = useState<ApiState<Product>>({
    data: null,
    loading: true,
    error: null,
    refetch: fetchProduct,
  });

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  return state;
}

export function useProductsByCategory(category: string) {
  const fetchProducts = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const products = await apiService.getProductsByCategory(category);
      setState({ data: products, loading: false, error: null, refetch: fetchProducts });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch products",
        refetch: fetchProducts,
      });
    }
  };

  const [state, setState] = useState<ApiState<Product[]>>({
    data: null,
    loading: true,
    error: null,
    refetch: fetchProducts,
  });

  useEffect(() => {
    if (category && category !== "all") {
      fetchProducts();
    } else {
      // If category is 'all', fetch all products
      apiService
        .getAllProducts()
        .then((products) => setState({ data: products, loading: false, error: null, refetch: fetchProducts }))
        .catch((error) =>
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error.message : "Failed to fetch products",
            refetch: fetchProducts,
          })
        );
    }
  }, [category]);

  return state;
}

export function useHandmade() {
  const fetchHandmade = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const handmade = await apiService.getAllHandmade();
      setState({ data: handmade, loading: false, error: null, refetch: fetchHandmade });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch handmade products",
        refetch: fetchHandmade,
      });
    }
  };

  const [state, setState] = useState<ApiState<HandmadeProduct[]>>({
    data: null,
    loading: true,
    error: null,
    refetch: fetchHandmade,
  });

  useEffect(() => {
    fetchHandmade();
  }, []);

  return state;
}

export function useHandmadeById(id: string) {
  const fetchHandmade = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const handmade = await apiService.getHandmadeById(id);
      setState({ data: handmade || null, loading: false, error: null, refetch: fetchHandmade });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch handmade product",
        refetch: fetchHandmade,
      });
    }
  };

  const [state, setState] = useState<ApiState<HandmadeProduct>>({
    data: null,
    loading: true,
    error: null,
    refetch: fetchHandmade,
  });

  useEffect(() => {
    if (id) {
      fetchHandmade();
    }
  }, [id]);

  return state;
}

export function useHandmadeByCategory(category: string) {
  const fetchHandmade = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const handmade = await apiService.getHandmadeByCategory(category);
      setState({ data: handmade, loading: false, error: null, refetch: fetchHandmade });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch handmade products",
        refetch: fetchHandmade,
      });
    }
  };

  const [state, setState] = useState<ApiState<HandmadeProduct[]>>({
    data: null,
    loading: true,
    error: null,
    refetch: fetchHandmade,
  });

  useEffect(() => {
    if (category && category !== "all") {
      fetchHandmade();
    } else {
      // If category is 'all', fetch all handmade products
      apiService
        .getAllHandmade()
        .then((handmade) => setState({ data: handmade, loading: false, error: null, refetch: fetchHandmade }))
        .catch((error) =>
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error.message : "Failed to fetch handmade products",
            refetch: fetchHandmade,
          })
        );
    }
  }, [category]);

  return state;
}

export function useApiHealth() {
  const fetchHealth = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const health = await apiService.healthCheck();
      setState({ data: health, loading: false, error: null, refetch: fetchHealth });
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to check API health",
        refetch: fetchHealth,
      });
    }
  };

  const [state, setState] = useState<ApiState<{ status: string; timestamp: string; service: string }>>({
    data: null,
    loading: true,
    error: null,
    refetch: fetchHealth,
  });

  useEffect(() => {
    fetchHealth();
  }, []);

  return state;
}
