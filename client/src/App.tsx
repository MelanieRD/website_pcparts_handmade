import React, { useState, useMemo } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import CategoryFilter from './components/CategoryFilter';
import ProductGrid from './components/ProductGrid';
import ProductDetail from './components/ProductDetail';
import AuthModal from './components/AuthModal';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
import { products, updateProducts } from './data/products';
import { Product, CartItem } from './types/Product';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'computer' | 'handmade'>('all');
  const [activeSubcategory, setActiveSubcategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [currentProducts, setCurrentProducts] = useState<Product[]>(products);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter products based on category and search query
  const filteredProducts = useMemo(() => {
    return currentProducts.filter(product => {
      const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
      const matchesSubcategory = activeSubcategory === '' || product.subcategory === activeSubcategory;
      const matchesSearch = searchQuery === '' || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.subcategory.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesSubcategory && matchesSearch;
    });
  }, [activeCategory, activeSubcategory, searchQuery, currentProducts]);

  // Product counts for filter badges
  const productCounts = useMemo(() => ({
    all: currentProducts.length,
    computer: currentProducts.filter(p => p.category === 'computer').length,
    handmade: currentProducts.filter(p => p.category === 'handmade').length,
  }), [currentProducts]);

  const handleAddToCart = (product: Product) => {
    if (!product.inStock) return;
    
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const handleUpdateCartQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsProductDetailOpen(true);
  };

  const handleCategoryChange = (category: 'all' | 'computer' | 'handmade') => {
    setActiveCategory(category);
    setActiveSubcategory(''); // Reset subcategory when changing main category
  };

  const handleUpdateProducts = (newProducts: Product[]) => {
    setCurrentProducts(newProducts);
    updateProducts(newProducts);
  };
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Header
          cartItems={cartItems}
          onCategoryChange={handleCategoryChange}
          activeCategory={activeCategory}
          onSearchChange={setSearchQuery}
          searchQuery={searchQuery}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onOpenAdmin={() => setIsAdminPanelOpen(true)}
          onUpdateCartQuantity={handleUpdateCartQuantity}
          onRemoveFromCart={handleRemoveFromCart}
          onClearCart={handleClearCart}
        />
        
        <HeroSection />

        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile Filter Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal className="h-5 w-5" />
                <span className="font-medium">Filtros</span>
              </button>
            </div>

            {/* Sidebar */}
            <aside className="lg:w-1/4">
              <CategoryFilter
                activeCategory={activeCategory}
                activeSubcategory={activeSubcategory}
                onCategoryChange={handleCategoryChange}
                onSubcategoryChange={setActiveSubcategory}
                productCounts={productCounts}
                isOpen={isMobileFilterOpen}
                onClose={() => setIsMobileFilterOpen(false)}
              />
            </aside>

            {/* Main Content */}
            <section className="lg:w-3/4 space-y-6">
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {activeCategory === 'all' && 'Todos los Productos'}
                      {activeCategory === 'computer' && 'Componentes de Computadora'}
                      {activeCategory === 'handmade' && 'Productos Artesanales'}
                      {activeSubcategory && ` - ${activeSubcategory}`}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                      {searchQuery && ` para "${searchQuery}"`}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 bg-white">
                      <option value="">Ordenar por popularidad</option>
                      <option value="price-asc">Precio: menor a mayor</option>
                      <option value="price-desc">Precio: mayor a menor</option>
                      <option value="rating">Mejor calificado</option>
                      <option value="newest">Más nuevo</option>
                    </select>
                  </div>
                </div>
              </div>

              <ProductGrid
                products={filteredProducts}
                onAddToCart={handleAddToCart}
                onViewDetails={handleViewDetails}
              />
            </section>
          </div>
        </main>

        {/* Product Detail Modal */}
        {selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            isOpen={isProductDetailOpen}
            onClose={() => {
              setIsProductDetailOpen(false);
              setSelectedProduct(null);
            }}
            onAddToCart={handleAddToCart}
          />
        )}

        {/* Auth Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />

        {/* Admin Panel */}
        <AdminPanel
          isOpen={isAdminPanelOpen}
          onClose={() => setIsAdminPanelOpen(false)}
          products={currentProducts}
          onUpdateProducts={handleUpdateProducts}
        />

        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;