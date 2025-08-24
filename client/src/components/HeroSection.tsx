

import { Cpu, HardDrive, MemoryStick, Monitor, CircuitBoard, Zap } from 'lucide-react';

export default function HeroSection() {
  return (
    <div className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden py-8 sm:py-12">
      {/* Animated background particles */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-4 left-4 animate-pulse">
          <Cpu className="h-8 w-8 text-blue-400 animate-bounce" style={{animationDelay: '0s'}} />
        </div>
        <div className="absolute top-8 right-16 animate-pulse">
          <MemoryStick className="h-6 w-6 text-cyan-400 animate-bounce" style={{animationDelay: '0.5s'}} />
        </div>
        <div className="absolute bottom-6 left-16 animate-pulse">
          <HardDrive className="h-7 w-7 text-green-400 animate-bounce" style={{animationDelay: '1s'}} />
        </div>
        <div className="absolute bottom-8 right-8 animate-pulse">
          <Monitor className="h-8 w-8 text-purple-400 animate-bounce" style={{animationDelay: '1.5s'}} />
        </div>
        <div className="absolute top-12 left-1/2 animate-pulse">
          <CircuitBoard className="h-6 w-6 text-yellow-400 animate-bounce" style={{animationDelay: '2s'}} />
        </div>
        <div className="absolute bottom-12 left-1/3 animate-pulse">
          <Zap className="h-5 w-5 text-red-400 animate-bounce" style={{animationDelay: '2.5s'}} />
        </div>
      </div>
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
      
      <div className="relative container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl lg:text-4xl font-bold mb-2 leading-tight">
              Cyborg<span className="text-blue-400">Tech</span>
              <span className="text-lg lg:text-xl text-cyan-200 block">Store</span>
            </h1>
            <p className="text-base lg:text-lg text-slate-200 max-w-2xl">
              Componentes de alta calidad para tu PC gaming y workstation
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <Cpu className="h-5 w-5 text-blue-400" />
              <span className="text-sm font-medium">Alta Performance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}