import { useState } from 'react';
import { X, Plus, Edit, Trash2, Package, TrendingUp, Users, DollarSign, BarChart3 } from 'lucide-react';
import { Product } from '../types/Product';
import { Sale } from '../types/Sale';
import ProductForm from './ProductForm';
import SalesTable from './SalesTable';
import { addProduct, updateProduct, deleteProduct } from '../firebase/products';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
}

// Mock sales data
const mockSales: Sale[] = [
  {
    id: '1',
    productId: '1',
    productName: 'NVIDIA GeForce RTX 4080',
    quantity: 1,
    price: 1199.99,
    total: 1199.99,
    customerEmail: 'customer1@example.com',
    customerName: 'Juan Pérez',
    date: '2025-01-15',
    status: 'completed'
  },
  {
    id: '2',
    productId: '2',
    productName: 'AMD Ryzen 9 7950X',
    quantity: 2,
    price: 699.99,
    total: 1399.98,
    customerEmail: 'customer2@example.com',
    customerName: 'María García',
    date: '2025-01-14',
    status: 'pending'
  }
];

export default function AdminPanel({ isOpen, onClose, products, onUpdateProducts }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'sales' | 'analytics'>('overview');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [sales] = useState<Sale[]>(mockSales);

  if (!isOpen) return null;

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsProductFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsProductFormOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await deleteProduct(productId);
        // No need to update local state - Firebase subscription will handle it
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error al eliminar el producto. Inténtalo de nuevo.');
      }
    }
  };

  const handleSaveProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      if (selectedProduct) {
        // Edit existing product
        await updateProduct(selectedProduct.id, productData);
      } else {
        // Add new product
        await addProduct(productData);
      }
      setIsProductFormOpen(false);
      // No need to update local state - Firebase subscription will handle it
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error al guardar el producto. Inténtalo de nuevo.');
    }
  };

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalSales = sales.length;
  const lowStockProducts = products.filter(p => !p.inStock).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Panel de Administración</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-blue-700 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Resumen
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'products'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Productos
              </button>
              <button
                onClick={() => setActiveTab('sales')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'sales'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Ventas
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'analytics'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Analytics</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-blue-50 p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 text-sm font-medium">Total Productos</p>
                        <p className="text-3xl font-bold text-blue-900">{products.length}</p>
                      </div>
                      <Package className="h-12 w-12 text-blue-600" />
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 text-sm font-medium">Ingresos Totales</p>
                        <p className="text-3xl font-bold text-green-900">${totalRevenue.toFixed(2)}</p>
                      </div>
                      <DollarSign className="h-12 w-12 text-green-600" />
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-600 text-sm font-medium">Ventas Totales</p>
                        <p className="text-3xl font-bold text-purple-900">{totalSales}</p>
                      </div>
                      <TrendingUp className="h-12 w-12 text-purple-600" />
                    </div>
                  </div>
                  
                  <div className="bg-red-50 p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-600 text-sm font-medium">Stock Bajo</p>
                        <p className="text-3xl font-bold text-red-900">{lowStockProducts}</p>
                      </div>
                      <Users className="h-12 w-12 text-red-600" />
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
                  <div className="space-y-4">
                    {sales.slice(0, 5).map((sale) => (
                      <div key={sale.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                        <div>
                          <p className="font-medium">{sale.productName}</p>
                          <p className="text-sm text-gray-600">{sale.customerName} - {sale.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${sale.total.toFixed(2)}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            sale.status === 'completed' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {sale.status === 'completed' ? 'Completado' : 'Pendiente'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Gestión de Productos</h3>
                  <button
                    onClick={handleAddProduct}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Agregar Producto</span>
                  </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Producto
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Categoría
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Precio
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Stock
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                          <tr key={product.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="h-12 w-12 rounded-lg object-cover"
                                />
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {product.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {product.brand}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                product.category === 'computer'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {product.subcategory}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ${product.price.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                product.inStock
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {product.inStock ? 'En Stock' : 'Agotado'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditProduct(product)}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sales' && (
              <SalesTable sales={sales} />
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold flex items-center space-x-2">
                      <BarChart3 className="h-6 w-6 text-blue-600" />
                      <span>Dashboard de Analytics - CyborgTech</span>
                    </h3>
                    <p className="text-gray-600 mt-1">Dashboard completo con datos en tiempo real de ventas y performance</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => window.open('http://localhost:3000/d/cyborgtech_avanzado_uid/cyborgtech-dashboard-avanzado-completo', '_blank')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Abrir en Nueva Pestaña
                    </button>
                  </div>
                </div>

                {/* Grafana Dashboard Iframe */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600 ml-4">Grafana Dashboard - CyborgTech Analytics</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        🔄 Actualización automática cada 1 min
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
                    <iframe
                      src="http://localhost:3000/d/cyborgtech_avanzado_uid?orgId=1&kiosk&theme=dark&refresh=1m"
                      className="absolute top-0 left-0 w-full h-full border-0"
                      title="CyborgTech Analytics Dashboard"
                      loading="lazy"
                      allowFullScreen
                      style={{ 
                        minHeight: '600px',
                        transform: 'scale(1.0)',
                        transformOrigin: 'top left'
                      }}
                    />

                  </div>
                  
                  {/* Dashboard Info Footer */}
                  <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <span>📊 10 Paneles Activos</span>
                        <span>🔄 Última actualización: {new Date().toLocaleTimeString('es-ES')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600">🟢 Conectado</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-xl text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm">Dashboard Status</p>
                        <p className="text-2xl font-bold">Online</p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-blue-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-xl text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm">Data Source</p>
                        <p className="text-2xl font-bold">API</p>
                      </div>
                      <Package className="h-8 w-8 text-green-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-xl text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm">Refresh Rate</p>
                        <p className="text-2xl font-bold">1min</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-purple-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-xl text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100 text-sm">Panels</p>
                        <p className="text-2xl font-bold">10</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-orange-200" />
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">💡 Instrucciones de Uso</h4>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• El dashboard se actualiza automáticamente cada minuto</li>
                    <li>• Usa el botón "Abrir en Nueva Pestaña" para ver en pantalla completa</li>
                    <li>• Los datos provienen del API de CyborgTech en tiempo real</li>
                    <li>• Puedes interactuar directamente con los paneles desde el iframe</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Form Modal */}
      {isProductFormOpen && (
        <ProductForm
          product={selectedProduct}
          isOpen={isProductFormOpen}
          onClose={() => setIsProductFormOpen(false)}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
}