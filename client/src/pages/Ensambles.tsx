import React, { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import BuildCard from "../components/BuildCard";
import BuildDetailsModal from "../components/BuildDetailsModal";
import HeroSection from "../components/HeroSection";
import InfoSection from "../components/InfoSection";
import LoadingState from "../components/LoadingState";
import { useI18n } from "../hooks/useI18n";

interface Build {
  id: string;
  name: Record<string, string>;
  description: Record<string, string>;
  longDescription: Record<string, string>;
  price: string;
  originalPrice?: string;
  mainImage: string;
  images: string[];
  category: string;
  specs: Record<string, string>;
  features: string[];
  isOffer?: boolean;
  isNew?: boolean;
  isPopular?: boolean;
}

const Ensambles: React.FC = () => {
  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBuild, setSelectedBuild] = useState<Build | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { t, loading: i18nLoading } = useI18n();

  useEffect(() => {
    // Simular carga de datos - en el futuro esto vendría de un archivo JSON
    const mockBuilds: Build[] = [
      {
        id: "build1",
        name: {
          es: "PC Gaming Ultra Pro",
          en: "Ultra Pro Gaming PC",
          fr: "PC Gaming Ultra Pro",
        },
        description: {
          es: "Potente PC gaming con RTX 4080 y procesador Intel i9-13900K. Rendimiento excepcional para gaming 4K.",
          en: "Powerful gaming PC with RTX 4080 and Intel i9-13900K processor. Exceptional performance for 4K gaming.",
          fr: "PC gaming puissant avec RTX 4080 et processeur Intel i9-13900K. Performance exceptionnelle pour le gaming 4K.",
        },
        longDescription: {
          es: "Esta PC gaming de alto rendimiento está diseñada para ofrecer la mejor experiencia de gaming posible. Equipada con la potente tarjeta gráfica NVIDIA GeForce RTX 4080 con 16GB de memoria GDDR6X, capaz de ejecutar cualquier juego en 4K con configuraciones máximas. El procesador Intel Core i9-13900K con 24 núcleos (8 P-cores + 16 E-cores) y 32 hilos proporciona un rendimiento excepcional para gaming, streaming y multitarea. El sistema de refrigeración líquida personalizado mantiene temperaturas óptimas incluso durante sesiones intensivas. Con 32GB de RAM DDR5-6000MHz y un SSD NVMe de 2TB, disfrutarás de tiempos de carga ultrarrápidos y un sistema completamente responsivo.",
          en: "This high-performance gaming PC is designed to deliver the ultimate gaming experience. Equipped with the powerful NVIDIA GeForce RTX 4080 graphics card with 16GB GDDR6X memory, capable of running any game in 4K with maximum settings. The Intel Core i9-13900K processor with 24 cores (8 P-cores + 16 E-cores) and 32 threads provides exceptional performance for gaming, streaming, and multitasking. The custom liquid cooling system maintains optimal temperatures even during intensive sessions. With 32GB DDR5-6000MHz RAM and a 2TB NVMe SSD, you'll enjoy ultra-fast loading times and a completely responsive system.",
          fr: "Ce PC gaming haute performance est conçu pour offrir l'expérience de jeu ultime. Équipé de la puissante carte graphique NVIDIA GeForce RTX 4080 avec 16GB de mémoire GDDR6X, capable d'exécuter n'importe quel jeu en 4K avec des paramètres maximum. Le processeur Intel Core i9-13900K avec 24 cœurs (8 P-cores + 16 E-cores) et 32 threads offre des performances exceptionnelles pour le gaming, le streaming et le multitâche. Le système de refroidissement liquide personnalisé maintient des températures optimales même pendant les sessions intensives. Avec 32GB de RAM DDR5-6000MHz et un SSD NVMe de 2TB, vous profiterez de temps de chargement ultra-rapides et d'un système complètement réactif.",
        },
        price: "$2,999.99",
        originalPrice: "$3,299.99",
        mainImage: "/assets/builds/pc-gaming-ultra-main.jpg",
        images: [
          "/assets/builds/pc-gaming-ultra-main.jpg",
          "/assets/builds/pc-gaming-ultra-side.jpg",
          "/assets/builds/pc-gaming-ultra-interior.jpg",
          "/assets/builds/pc-gaming-ultra-rgb.jpg",
          "/assets/builds/pc-gaming-ultra-back.jpg",
        ],
        category: "gaming",
        specs: {
          Procesador: "Intel Core i9-13900K (24 núcleos, 32 hilos)",
          "Tarjeta Gráfica": "NVIDIA GeForce RTX 4080 16GB GDDR6X",
          "Memoria RAM": "32GB DDR5-6000MHz (2x16GB)",
          Almacenamiento: "2TB SSD NVMe PCIe 4.0",
          "Placa Base": "ASUS ROG Maximus Z790 Hero",
          Refrigeración: "Sistema líquido personalizado 360mm",
          Fuente: "Corsair RM850x 850W 80+ Gold",
          Case: "Lian Li O11 Dynamic EVO",
          Ventiladores: "6x Corsair LL120 RGB",
          "Sistema Operativo": "Windows 11 Pro",
        },
        features: ["Rendimiento 4K Ultra", "Refrigeración líquida personalizada", "Iluminación RGB sincronizada", "Cableado personalizado", "Overclock optimizado", "Garantía extendida"],
        isOffer: true,
        isPopular: true,
      },
      {
        id: "build2",
        name: {
          es: "PC Workstation Elite",
          en: "Elite Workstation PC",
          fr: "PC Workstation Elite",
        },
        description: {
          es: "Estación de trabajo profesional con AMD Ryzen 9 7950X y RTX 4090. Perfecta para renderizado y edición de video.",
          en: "Professional workstation with AMD Ryzen 9 7950X and RTX 4090. Perfect for rendering and video editing.",
          fr: "Station de travail professionnelle avec AMD Ryzen 9 7950X et RTX 4090. Parfaite pour le rendu et l'édition vidéo.",
        },
        longDescription: {
          es: "Esta estación de trabajo de élite está diseñada para profesionales que requieren el máximo rendimiento en tareas intensivas. El procesador AMD Ryzen 9 7950X con 16 núcleos y 32 hilos ofrece un rendimiento excepcional en aplicaciones de renderizado, edición de video y modelado 3D. La tarjeta gráfica NVIDIA GeForce RTX 4090 con 24GB de memoria GDDR6X es la más potente disponible, ideal para renderizado en tiempo real y machine learning. El sistema incluye 64GB de RAM DDR5 de alta velocidad y múltiples unidades de almacenamiento para un flujo de trabajo eficiente.",
          en: "This elite workstation is designed for professionals who require maximum performance in intensive tasks. The AMD Ryzen 9 7950X processor with 16 cores and 32 threads delivers exceptional performance in rendering, video editing, and 3D modeling applications. The NVIDIA GeForce RTX 4090 graphics card with 24GB GDDR6X memory is the most powerful available, ideal for real-time rendering and machine learning. The system includes 64GB high-speed DDR5 RAM and multiple storage units for efficient workflow.",
          fr: "Cette station de travail d'élite est conçue pour les professionnels qui nécessitent des performances maximales dans les tâches intensives. Le processeur AMD Ryzen 9 7950X avec 16 cœurs et 32 threads offre des performances exceptionnelles dans les applications de rendu, d'édition vidéo et de modélisation 3D. La carte graphique NVIDIA GeForce RTX 4090 avec 24GB de mémoire GDDR6X est la plus puissante disponible, idéale pour le rendu en temps réel et l'apprentissage automatique. Le système comprend 64GB de RAM DDR5 haute vitesse et plusieurs unités de stockage pour un flux de travail efficace.",
        },
        price: "$4,299.99",
        mainImage: "/assets/builds/pc-workstation-elite-main.jpg",
        images: [
          "/assets/builds/pc-workstation-elite-main.jpg",
          "/assets/builds/pc-workstation-elite-side.jpg",
          "/assets/builds/pc-workstation-elite-interior.jpg",
          "/assets/builds/pc-workstation-elite-detail.jpg",
        ],
        category: "workstation",
        specs: {
          Procesador: "AMD Ryzen 9 7950X (16 núcleos, 32 hilos)",
          "Tarjeta Gráfica": "NVIDIA GeForce RTX 4090 24GB GDDR6X",
          "Memoria RAM": "64GB DDR5-6000MHz (4x16GB)",
          Almacenamiento: "4TB SSD NVMe PCIe 4.0",
          "Placa Base": "ASUS ROG Crosshair X670E Hero",
          Refrigeración: "Sistema líquido personalizado 420mm",
          Fuente: "Seasonic PRIME TX-1300 1300W 80+ Titanium",
          Case: "Fractal Design Torrent",
          Ventiladores: "5x Noctua NF-A12x25",
          "Sistema Operativo": "Windows 11 Pro",
        },
        features: ["Rendimiento profesional", "Refrigeración optimizada", "Cableado profesional", "Configuración estable", "Soporte técnico premium", "Certificación ISV"],
        isNew: true,
      },
      {
        id: "build3",
        name: {
          es: "PC Streaming Pro",
          en: "Pro Streaming PC",
          fr: "PC Streaming Pro",
        },
        description: {
          es: "PC optimizada para streaming con doble GPU y capturadora integrada. Perfecta para creadores de contenido.",
          en: "Streaming-optimized PC with dual GPU and integrated capture card. Perfect for content creators.",
          fr: "PC optimisé pour le streaming avec double GPU et carte de capture intégrée. Parfaite pour les créateurs de contenu.",
        },
        longDescription: {
          es: "Esta PC está específicamente diseñada para streamers y creadores de contenido que necesitan transmitir en alta calidad mientras juegan. El sistema utiliza una configuración de doble GPU donde una tarjeta se encarga del gaming y la otra del encoding del stream. Incluye una capturadora integrada para máxima calidad de video y latencia mínima. El procesador AMD Ryzen 7 7800X3D con tecnología 3D V-Cache proporciona un rendimiento excepcional en gaming mientras mantiene recursos disponibles para el streaming.",
          en: "This PC is specifically designed for streamers and content creators who need to stream in high quality while gaming. The system uses a dual GPU configuration where one card handles gaming and the other handles stream encoding. Includes an integrated capture card for maximum video quality and minimal latency. The AMD Ryzen 7 7800X3D processor with 3D V-Cache technology provides exceptional gaming performance while keeping resources available for streaming.",
          fr: "Ce PC est spécialement conçu pour les streamers et créateurs de contenu qui doivent diffuser en haute qualité tout en jouant. Le système utilise une configuration double GPU où une carte gère le gaming et l'autre l'encodage du stream. Inclut une carte de capture intégrée pour une qualité vidéo maximale et une latence minimale. Le processeur AMD Ryzen 7 7800X3D avec technologie 3D V-Cache offre des performances de gaming exceptionnelles tout en gardant des ressources disponibles pour le streaming.",
        },
        price: "$2,199.99",
        mainImage: "/assets/builds/pc-streaming-pro-main.jpg",
        images: ["/assets/builds/pc-streaming-pro-main.jpg", "/assets/builds/pc-streaming-pro-side.jpg", "/assets/builds/pc-streaming-pro-interior.jpg"],
        category: "streaming",
        specs: {
          Procesador: "AMD Ryzen 7 7800X3D (8 núcleos, 16 hilos)",
          "Tarjeta Gráfica": "NVIDIA GeForce RTX 4070 Ti 12GB GDDR6X",
          "Tarjeta Secundaria": "NVIDIA GeForce RTX 3060 12GB GDDR6",
          Capturadora: "Elgato 4K60 Pro MK.2",
          "Memoria RAM": "32GB DDR5-5600MHz (2x16GB)",
          Almacenamiento: "2TB SSD NVMe PCIe 4.0",
          "Placa Base": "MSI MPG B650 Carbon WiFi",
          Refrigeración: "Sistema líquido 280mm + ventiladores RGB",
          Fuente: "Corsair RM750x 750W 80+ Gold",
          Case: "NZXT H7 Flow",
          "Sistema Operativo": "Windows 11 Home",
        },
        features: ["Doble GPU para streaming", "Capturadora integrada", "Optimización para OBS", "Cableado organizado", "Iluminación RGB", "Configuración lista para stream"],
        isPopular: true,
      },
    ];

    setBuilds(mockBuilds);
    setLoading(false);
  }, []);

  // Mostrar loading mientras se cargan las traducciones o productos
  if (i18nLoading || loading) {
    return <LoadingState message={t("ensambles.loading") || "Cargando ensambles..."} />;
  }

  const handleViewDetails = (build: Build) => {
    setSelectedBuild(build);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedBuild(null);
  };

  const categories = [
    { icon: "🎮", key: "ensambles.categories.gaming" },
    { icon: "💼", key: "ensambles.categories.workstation" },
    { icon: "📺", key: "ensambles.categories.streaming" },
    { icon: "🏢", key: "ensambles.categories.office" },
    { icon: "🎨", key: "ensambles.categories.creative" },
    { icon: "⚡", key: "ensambles.categories.performance" },
  ];

  const infoItems = [
    {
      icon: "🔧",
      title: t("ensambles.why_choose.professional.title") || "Ensamblaje Profesional",
      description: t("ensambles.why_choose.professional.description") || "Cada PC es ensamblada por expertos con años de experiencia",
    },
    {
      icon: "⚡",
      title: t("ensambles.why_choose.optimization.title") || "Optimización Completa",
      description: t("ensambles.why_choose.optimization.description") || "Configuración y overclock optimizados para máximo rendimiento",
    },
    {
      icon: "🛡️",
      title: t("ensambles.why_choose.warranty.title") || "Garantía Extendida",
      description: t("ensambles.why_choose.warranty.description") || "Garantía de 2 años en todo el sistema y soporte técnico",
    },
  ];

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <Navigation />

      <HeroSection
        title={t("ensambles.title") || "Ensambles Personalizados"}
        subtitle={t("ensambles.subtitle") || "Descubre nuestras PCs ensambladas a medida con componentes de alta calidad. Cada ensamble es único y optimizado para tu uso específico."}
        categories={categories}
        titleIcon="🖥️"
      />

      {/* Contenido principal */}
      <main
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "3rem 2rem",
          background: "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)",
        }}
      >
        {/* Grid de ensambles */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "2rem",
            marginTop: "2rem",
          }}
        >
          {builds.map((build) => (
            <BuildCard key={build.id} build={build} onViewDetails={handleViewDetails} />
          ))}
        </div>

        <InfoSection title={t("ensambles.why_choose.title") || "¿Por qué elegir nuestros ensambles?"} items={infoItems} titleIcon="🛠️" />
      </main>

      <BuildDetailsModal build={selectedBuild} isOpen={modalOpen} onClose={handleCloseModal} />

      <Footer />
    </div>
  );
};

export default Ensambles;
