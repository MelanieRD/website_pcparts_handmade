import { useState } from 'react';
import { ShoppingCart, Menu, X, Search, Heart, User, Minus, Plus, Trash2, Settings } from 'lucide-react';
import { CartItem } from '../types/Product';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  cartItems: CartItem[];
  onCategoryChange: (category: 'all' | 'computer' | 'handmade') => void;
  activeCategory: 'all' | 'computer' | 'handmade';
  onSearchChange: (search: string) => void;
  searchQuery: string;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
  onUpdateCartQuantity: (productId: string, newQuantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
}

function Header({ 
  cartItems, 
  onSearchChange,
  searchQuery,
  onOpenAuth,
  onOpenAdmin,
  onUpdateCartQuantity,
  onRemoveFromCart,
  onClearCart
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img 
                src="/images/logoCyborg.png" 
                alt="CyborgTech Logo" 
                className="h-10 w-10 object-contain"
              />
              <h1 className="text-2xl font-bold text-gray-800">
                Cyborg<span className="text-primary-600">Tech</span>
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
           
            
             
            </nav>

            {/* Search Bar */}
            <div className="hidden lg:flex items-center max-w-md flex-1 mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-red-500 transition-colors">
                <Heart className="h-6 w-6" />
              </button>
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
              
              {/* User Menu */}
              
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <User className="h-6 w-6" />
                  {isAuthenticated && user && (
                    <span className="text-sm font-medium">{user.name}</span>
                  )}
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {!isAuthenticated ? (
                      <button
                        onClick={() => {
                          onOpenAuth();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Iniciar Sesión
                      </button>
                    ) : (
                      <>
                        <div className="px-4 py-2 border-b border-gray-200">
                          <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                        {user?.role === 'admin' && (
                          <button
                            onClick={() => {
                              onOpenAdmin();
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                          >
                            <Settings className="h-4 w-4" />
                            <span>Panel Admin</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Cerrar Sesión
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-primary-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Search */}
          <div className="lg:hidden mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="container mx-auto px-4 py-4 space-y-2">
              
            
              <div className="flex items-center space-x-4 pt-4">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500">
                  <Heart className="h-5 w-5" />
                  <span>Favoritos</span>
                </button>
                <button
                  onClick={() => {
                    setIsCartOpen(!isCartOpen);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 text-gray-600 hover:text-primary-600"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Carrito ({cartItemCount})</span>
                </button>
                <button
                  onClick={() => {
                    if (isAuthenticated) {
                      logout();
                    } else {
                      onOpenAuth();
                    }
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 text-gray-600 hover:text-primary-600"
                >
                  <User className="h-5 w-5" />
                  <span>{isAuthenticated ? 'Cerrar Sesión' : 'Iniciar Sesión'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsCartOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Carrito de Compras</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1 hover:bg-gray-100 rounded text-gray-800 hover:text-gray-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <p className="text-gray-700 text-center py-8">Tu carrito está vacío</p>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm text-gray-900 line-clamp-2 mb-2">{item.name}</h3>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-1 bg-white rounded-lg border border-gray-300 p-1">
                            <button
                              onClick={() => onUpdateCartQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center rounded bg-gray-200 hover:bg-gray-300 text-gray-700 hover:text-gray-900 transition-colors border border-gray-300 hover:border-gray-400"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => {
                                const newQuantity = parseInt(e.target.value) || 0;
                                onUpdateCartQuantity(item.id, newQuantity);
                              }}
                              className="w-12 text-center text-sm font-medium bg-transparent border-none focus:outline-none text-gray-900"
                              min="1"
                            />
                            <button
                              onClick={() => onUpdateCartQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center rounded bg-gray-200 hover:bg-gray-300 text-gray-700 hover:text-gray-900 transition-colors border border-gray-300 hover:border-gray-400"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          
                          {/* Remove Button */}
                          <button
                            onClick={() => onRemoveFromCart(item.id)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar producto"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <p className="font-semibold text-blue-700">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">Total:</span>
                      <span className="font-bold text-xl text-blue-700">${cartTotal.toFixed(2)}</span>
                    </div>
                    
                    {/* Clear Cart Button */}
                    {cartItems.length > 0 && (
                      <button
                        onClick={() => {
                          if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
                            onClearCart();
                          }
                        }}
                        className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium text-sm"
                      >
                        Vaciar Carrito
                      </button>
                    )}
                    
                    {/* WhatsApp Checkout Button */}
                    <button 
                      onClick={() => {
                        // Prepare WhatsApp message
                        const message = `¡Hola! Quiero proceder al pago de mi carrito:\n\n${cartItems.map(item => 
                          `• ${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`
                        ).join('\n')}\n\n*Total: $${cartTotal.toFixed(2)}*\n\n¿Podrían ayudarme con el proceso de compra?`;
                        
                        const whatsappNumber = '1234567890'; // Replace with actual WhatsApp number
                        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
                        
                        window.open(whatsappUrl, '_blank');
                        setIsCartOpen(false);
                      }}
                      className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                      Proceder al Pago (WhatsApp)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;