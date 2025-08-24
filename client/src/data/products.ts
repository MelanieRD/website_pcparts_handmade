import { Product } from '../types/Product';
import { getPlaceholderImage } from '../utils/placeholders';

export const products: Product[] = [
  // Computer Parts
  {
    id: '1',
    name: 'NVIDIA GeForce RTX 4080',
    price: 2000.99,
    image: getPlaceholderImage('computer', 'Tarjetas Gráficas'),
    images: [
      getPlaceholderImage('computer', 'Tarjetas Gráficas'),
      getPlaceholderImage('computer', 'Tarjetas Gráficas'),
      getPlaceholderImage('computer', 'Tarjetas Gráficas')
    ],
    category: 'computer',
    subcategory: 'Tarjetas Gráficas',
    description: 'High-performance graphics card for gaming and creative work',
    fullDescription: 'La NVIDIA GeForce RTX 4080 es una tarjeta gráfica de alto rendimiento diseñada para gaming 4K y trabajo creativo profesional. Con arquitectura Ada Lovelace y 16GB de memoria GDDR6X, ofrece ray tracing en tiempo real y DLSS 3 para el máximo rendimiento.',
    specifications: {
      'Memoria': '16GB GDDR6X',
      'Interfaz de memoria': '256-bit',
      'Velocidad base': '2205 MHz',
      'Velocidad boost': '2505 MHz',
      'Conectores': '3x DisplayPort 1.4a, 1x HDMI 2.1',
      'Consumo': '320W'
    },
    inStock: true,
    rating: 4.8,
    reviews: 324,
    brand: 'NVIDIA',
    model: 'RTX 4080'
  },
  {
    id: '2',
    name: 'AMD Ryzen 9 7950X',
    price: 699.99,
    image: getPlaceholderImage('computer', 'Procesadores'),
    images: [
      getPlaceholderImage('computer', 'Procesadores'),
      getPlaceholderImage('computer', 'Procesadores')
    ],
    category: 'computer',
    subcategory: 'Procesadores',
    description: '16-core, 32-thread processor for ultimate performance',
    fullDescription: 'El AMD Ryzen 9 7950X es el procesador más potente de la serie 7000, con 16 núcleos y 32 hilos. Perfecto para gaming, streaming, creación de contenido y aplicaciones profesionales que requieren máximo rendimiento.',
    specifications: {
      'Núcleos': '16',
      'Hilos': '32',
      'Frecuencia base': '4.5 GHz',
      'Frecuencia máxima': '5.7 GHz',
      'Cache L3': '64MB',
      'TDP': '170W',
      'Socket': 'AM5'
    },
    inStock: true,
    rating: 4.9,
    reviews: 156,
    brand: 'AMD',
    model: 'Ryzen 9 7950X'
  },
  {
    id: '3',
    name: 'Corsair Vengeance 32GB DDR5',
    price: 299.99,
    image: getPlaceholderImage('computer', 'Memoria RAM'),
    images: [
      getPlaceholderImage('computer', 'Memoria RAM')
    ],
    category: 'computer',
    subcategory: 'Memoria RAM',
    description: 'High-speed DDR5 memory for extreme performance',
    fullDescription: 'Memoria DDR5 de alta velocidad Corsair Vengeance de 32GB (2x16GB) optimizada para las últimas plataformas Intel y AMD. Ofrece velocidades superiores y menor latencia para gaming y aplicaciones exigentes.',
    specifications: {
      'Capacidad': '32GB (2x16GB)',
      'Tipo': 'DDR5',
      'Velocidad': '5600 MHz',
      'Latencia': 'CL36',
      'Voltaje': '1.25V',
      'Perfil': 'Intel XMP 3.0'
    },
    inStock: false,
    rating: 4.7,
    reviews: 89,
    brand: 'Corsair',
    model: 'Vengeance DDR5'
  },
  {
    id: '4',
    name: 'Samsung 980 PRO 2TB SSD',
    price: 199.99,
    image: getPlaceholderImage('computer', 'Almacenamiento'),
    images: [
      getPlaceholderImage('computer', 'Almacenamiento')
    ],
    category: 'computer',
    subcategory: 'Almacenamiento',
    description: 'Ultra-fast NVMe SSD with exceptional performance',
    fullDescription: 'SSD NVMe Samsung 980 PRO de 2TB con interfaz PCIe 4.0. Ofrece velocidades de lectura hasta 7,000 MB/s y escritura hasta 5,100 MB/s. Ideal para gaming, edición de video y aplicaciones que requieren acceso rápido a datos.',
    specifications: {
      'Capacidad': '2TB',
      'Interfaz': 'PCIe 4.0 x4, NVMe 1.3c',
      'Factor de forma': 'M.2 2280',
      'Lectura secuencial': 'Hasta 7,000 MB/s',
      'Escritura secuencial': 'Hasta 5,100 MB/s',
      'Garantía': '5 años'
    },
    inStock: true,
    rating: 4.8,
    reviews: 267,
    brand: 'Samsung',
    model: '980 PRO'
  },

  // Handmade Products
  {
    id: '5',
    name: 'Handwoven Wool Scarf',
    price: 89.99,
    image: getPlaceholderImage('handmade', 'Textiles'),
    images: [
      getPlaceholderImage('handmade', 'Textiles')
    ],
    category: 'handmade',
    subcategory: 'Textiles',
    description: 'Beautiful handwoven scarf made from organic wool',
    fullDescription: 'Bufanda tejida a mano con lana orgánica 100% natural. Cada pieza es única y está cuidadosamente elaborada por artesanos locales. Suave, cálida y perfecta para cualquier ocasión.',
    inStock: true,
    rating: 4.9,
    reviews: 42
  },
  {
    id: '6',
    name: 'Ceramic Coffee Mug Set',
    price: 45.99,
    image: getPlaceholderImage('handmade', 'Ceramics'),
    images: [
      getPlaceholderImage('handmade', 'Ceramics')
    ],
    category: 'handmade',
    subcategory: 'Ceramics',
    description: 'Hand-thrown ceramic mugs, perfect for your morning coffee',
    fullDescription: 'Set de tazas de cerámica hechas a mano en torno de alfarero. Cada taza tiene su propia personalidad y está diseñada para mantener la temperatura perfecta de tu bebida favorita.',
    inStock: true,
    rating: 4.6,
    reviews: 78
  },
  {
    id: '7',
    name: 'Handcrafted Leather Wallet',
    price: 129.99,
    image: getPlaceholderImage('handmade', 'Cuero'),
    images: [
      getPlaceholderImage('handmade', 'Cuero')
    ],
    category: 'handmade',
    subcategory: 'Cuero',
    description: 'Premium leather wallet with intricate hand-stitching',
    fullDescription: 'Billetera de cuero premium hecha completamente a mano con costuras intrincadas. Fabricada con cuero de alta calidad que mejora con el tiempo, ofreciendo durabilidad y estilo clásico.',
    inStock: true,
    rating: 4.8,
    reviews: 91
  },
  {
    id: '8',
    name: 'Artisan Wooden Bowl',
    price: 67.99,
    image: getPlaceholderImage('handmade', 'Madera'),
    images: [
      getPlaceholderImage('handmade', 'Madera')
    ],
    category: 'handmade',
    subcategory: 'Madera',
    description: 'Beautiful hand-carved wooden bowl from sustainable oak',
    fullDescription: 'Tazón de madera tallado a mano de roble sostenible. Cada pieza es única y muestra la belleza natural de la madera. Perfecto para servir ensaladas, frutas o como pieza decorativa.',
    inStock: false,
    rating: 4.7,
    reviews: 34
  }
];

export const computerCategories = [
  'Procesadores',
  'Tarjetas Gráficas', 
  'Memoria RAM',
  'Almacenamiento',
  'Placas Madre',
  'Fuentes de Poder',
  'Refrigeración',
  'Gabinetes'
];

export const handmadeCategories = [
  'Keycaps',
  'Charms'

];

// Function to update products (needed for admin functionality)
export const updateProducts = (newProducts: Product[]) => {
  // This is a simple in-memory update
  // In a real app, this would persist to a database
  products.length = 0;
  products.push(...newProducts);
};