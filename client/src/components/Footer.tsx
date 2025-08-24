import React from 'react';
import { Monitor, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Monitor className="h-8 w-8 text-blue-400" />
              <h3 className="text-2xl font-bold">
                Cyborg<span className="text-blue-400">Tech</span>
              </h3>
            </div>
            <p className="text-gray-400 mb-4">
              Tu destino para componentes de computadora de última generación y productos artesanales únicos.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-pink-400 cursor-pointer transition-colors" />
              <Youtube className="h-5 w-5 text-gray-400 hover:text-red-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Productos</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Procesadores</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Tarjetas Gráficas</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Memoria RAM</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Almacenamiento</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Productos Artesanales</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Soporte</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Centro de Ayuda</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Garantías</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Devoluciones</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Envíos</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <span className="text-gray-400">info@techcraft.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-blue-400" />
                <span className="text-gray-400">123 Tech Street, City</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 TechCraft Store. Todos los derechos reservados. | 
            <a href="#" className="hover:text-white transition-colors ml-1">Política de Privacidad</a> | 
            <a href="#" className="hover:text-white transition-colors ml-1">Términos de Servicio</a>
          </p>
        </div>
      </div>
    </footer>
  );
}