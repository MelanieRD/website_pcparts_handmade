import React from 'react';
import { Monitor, Heart, Package, Filter, Cpu, HardDrive, MemoryStick, X } from 'lucide-react';
import { computerCategories, handmadeCategories } from '../data/products';

interface CategoryFilterProps {
  activeCategory: 'all' | 'computer' | 'handmade';
  activeSubcategory: string;
  onCategoryChange: (category: 'all' | 'computer' | 'handmade') => void;
  onSubcategoryChange: (subcategory: string) => void;
  productCounts: {
    all: number;
    computer: number;
    handmade: number;
  };
  isOpen?: boolean;
  onClose?: () => void;
}

export default function CategoryFilter({ 
  activeCategory, 
  activeSubcategory,
  onCategoryChange, 
  onSubcategoryChange,
  productCounts,
  isOpen = true,
  onClose
}: CategoryFilterProps) {
  const getSubcategoryIcon = (subcategory: string) => {
    switch (subcategory) {
      case 'Procesadores': return <Cpu className="h-4 w-4" />;
      case 'Tarjetas Gráficas': return <Monitor className="h-4 w-4" />;
      case 'Memoria RAM': return <MemoryStick className="h-4 w-4" />;
      case 'Almacenamiento': return <HardDrive className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && onClose && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />
      )}
      
      <div className={`bg-white rounded-xl shadow-lg border border-gray-100 ${
        onClose ? 'lg:relative lg:p-6' : 'p-6'
      } ${
        onClose && isOpen 
          ? 'fixed top-0 left-0 w-full h-full z-50 p-6 overflow-y-auto lg:static lg:h-auto lg:w-auto lg:z-auto lg:shadow-lg'
          : onClose && !isOpen
          ? 'hidden lg:block'
          : ''
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-800">Categorías</h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors lg:hidden"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          )}
        </div>
      
      <div className="space-y-3">
        <button
          onClick={() => onCategoryChange('all')}
          className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
            activeCategory === 'all'
              ? 'bg-blue-50 text-blue-700 border-2 border-blue-200 shadow-sm'
              : 'text-gray-700 hover:bg-gray-50 border-2 border-transparent'
          }`}
        >
          <div className="flex items-center space-x-3">
            <Package className="h-5 w-5" />
            <span className="font-medium">Todos los Productos</span>
          </div>
          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
            {productCounts.all}
          </span>
        </button>

        <button
          onClick={() => onCategoryChange('computer')}
          className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
            activeCategory === 'computer'
              ? 'bg-blue-50 text-blue-700 border-2 border-blue-200 shadow-sm'
              : 'text-gray-700 hover:bg-gray-50 border-2 border-transparent'
          }`}
        >
          <div className="flex items-center space-x-3">
            <Monitor className="h-5 w-5" />
            <span className="font-medium">Componentes PC</span>
          </div>
          <span className="bg-blue-200 text-blue-700 px-2 py-1 rounded-full text-sm">
            {productCounts.computer}
          </span>
        </button>

        <button
          onClick={() => onCategoryChange('handmade')}
          className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
            activeCategory === 'handmade'
              ? 'bg-green-50 text-green-700 border-2 border-green-200 shadow-sm'
              : 'text-gray-700 hover:bg-gray-50 border-2 border-transparent'
          }`}
        >
          <div className="flex items-center space-x-3">
            <Heart className="h-5 w-5" />
            <span className="font-medium">Artesanales</span>
          </div>
          <span className="bg-green-200 text-green-700 px-2 py-1 rounded-full text-sm">
            {productCounts.handmade}
          </span>
        </button>
      </div>
      
      {/* Subcategories */}
      {(activeCategory === 'computer' || activeCategory === 'handmade') && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-md font-medium text-gray-700 mb-4">Subcategorías</h3>
          <div className="space-y-2">
            <button
              onClick={() => onSubcategoryChange('')}
              className={`w-full text-left p-2 rounded-lg transition-all duration-200 text-sm ${
                activeSubcategory === ''
                  ? 'bg-gray-100 text-gray-800 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Todas las subcategorías
            </button>
            {(activeCategory === 'computer' ? computerCategories : handmadeCategories).map((subcategory: string) => (
              <button
                key={subcategory}
                onClick={() => onSubcategoryChange(subcategory)}
                className={`w-full flex items-center space-x-2 p-2 rounded-lg transition-all duration-200 text-sm ${
                  activeSubcategory === subcategory
                    ? activeCategory === 'computer'
                      ? 'bg-blue-100 text-blue-800 font-medium'
                      : 'bg-green-100 text-green-800 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {getSubcategoryIcon(subcategory)}
                <span>{subcategory}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      </div>
    </>
  );
}