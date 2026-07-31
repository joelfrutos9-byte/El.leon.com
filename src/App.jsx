import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Zap, 
  MessageCircle, 
  Users, 
  Award, 
  Instagram, 
  Flame, 
  Newspaper, 
  Tv, 
  Home,
  Trophy,
  Calendar,
  Clock,
  Target,
  ChevronRight,
  Eye,
  HelpCircle,
  CheckCircle2,
  Dumbbell,
  Video,
  Play,
  ArrowUpRight,
  DollarSign,
  Package,
  History,
  ShieldCheck,
  Share2,
  Utensils,
  UserCheck,
  Sparkles,
  Info
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('mision');
  const [selectedStoreCat, setSelectedStoreCat] = useState('todos');
  const [selectedSize, setSelectedSize] = useState({});
  const [noticiasCms, setNoticiasCms] = useState([]);
  const [cargandoNoticias, setCargandoNoticias] = useState(true);
  const [activeSeason, setActiveSeason] = useState('temp1');
  const [modalVideo, setModalVideo] = useState(null);

  const whatsappNumber = "5493425236731";
  const instagramUrl = "https://instagram.com/joelbox_";
  const whatsappChannelUrl = "https://whatsapp.com/channel/0029Vb8f4EU3QxS1ckJsS31A";

  // Configuración Sanity (Project ID: 837br3mo) con fallback resiliente
  const SANITY_PROJECT_ID = '837br3mo';
  const SANITY_DATASET = 'production';

  useEffect(() => {
    const query = encodeURIComponent('*[_type in ["noticia", "post"]] | order(_createdAt desc)');
    const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${SANITY_DATASET}?query=${query}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.result && data.result.length > 0) {
          setNoticiasCms(data.result);
        }
        setCargandoNoticias(false);
      })
      .catch(err => {
        console.log("Consulta de Sanity con respuesta local:", err);
        setCargandoNoticias(false);
      });
  }, []);

  // Catálogo de Productos Permanente (León Store + Fight Shop)
  const products = [
    {
      id: 'original-01',
      name: 'EL LEÓN — ORIGINAL 01',
      tagline: 'LA PRIMERA PIEL DEL LEÓN',
      line: 'LÍNEA 01 — ORIGINAL',
      category: 'merch',
      price: 34900,
      deposit: 17500,
      image: '/1785149020942.png',
      badge: 'PREVENTA EXCLUSIVA',
      badgeColor: 'bg-zinc-800 text-yellow-400 border-yellow-500/30',
      description: 'Corte oversize urbano. Algodón pesado de alta resistencia diseñado para aguantar el entrenamiento diario y marcar presencia.',
      sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    {
      id: 'bolivia-remera',
      name: 'RUMBO A BOLIVIA — REMERA',
      tagline: 'EDICIÓN OFICIAL OPERACIÓN SANTA CRUZ',
      line: 'LÍNEA 02 — CAMPAÑA BOLIVIA 2026',
      category: 'santa_cruz',
      price: 34900,
      deposit: 17500,
      image: '/1785148963897.png',
      badge: '100% A BENEFICIO',
      badgeColor: 'bg-emerald-950 text-emerald-400 border-emerald-500/40',
      description: 'Edición oficial de la misión activa. Todo el margen neto se destina a cubrir pasajes y logística del campamento en altura.',
      sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    {
      id: 'bolivia-hoodie',
      name: 'RUMBO A BOLIVIA — HOODIE',
      tagline: 'BUZO OVERSIZE EDICIÓN LIMITADA',
      line: 'LÍNEA 02 — CAMPAÑA BOLIVIA 2026',
      category: 'santa_cruz',
      price: 58000,
      deposit: 29000,
      image: '/1785148947849.png',
      badge: '100% A BENEFICIO',
      badgeColor: 'bg-emerald-950 text-emerald-400 border-emerald-500/40',
      description: 'Buzo pesado con capucha doble, puños reforzados y estampado táctico de alto impacto en espalda.',
      sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    {
      id: 'fight-vendas',
      name: 'VENDAS OFICIALES EL LEÓN 4.5M',
      tagline: 'PROTECCIÓN Y SOPORTE PRO',
      line: 'FIGHT SHOP — EQUIPAMIENTO',
      category: 'fight_shop',
      price: 12500,
      deposit: 6250,
      image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600&auto=format&fit=crop&q=80',
      badge: 'PRÓXIMAMENTE',
      badgeColor: 'bg-yellow-950 text-yellow-400 border-yellow-500/30',
      description: 'Vendas semi-elásticas con sujeción de pulgar y velcro de alta resistencia para guanteos exigentes.',
      sizes: ['ÚNICO']
    },
    {
      id: 'fight-soga',
      name: 'SOGA DE VELOCIDAD TÁCTICA',
      tagline: 'FOOTWORK Y CARDIO DE COMBATE',
      line: 'FIGHT SHOP — ENTRENAMIENTO',
      category: 'fight_shop',
      price: 18900,
      deposit: 9450,
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
      badge: 'PRÓXIMAMENTE',
      badgeColor: 'bg-yellow-950 text-yellow-400 border-yellow-500/30',
      description: 'Rulemanes de alta precisión y cable regulable para entrenamiento de ritmo, coordinación y piernas.',
      sizes: ['AJUSTABLE']
    }
  ];

  // Acciones Puntuales de Recaudación (Comida / Eventos temporales - Separados de León Store)
  const accionesTemporales = [
    {
      id: 'empanadas-tanda-1',
      title: 'GRAN VENTA DE EMPANADAS — TANDA SANTA CRUZ',
      fecha: 'Sábado 15 de Agosto 2026',
      lugar: 'Santo Tomé / Retiro en Gimnasio IMAD',
      precioPorDocena: 14000,
      descripcion: 'Empanadas caseras de carne cortada a cuchillo. Todo lo vendido financia la logística de traslado de la delegación.',
      activo: true
    }
  ];

  // Bitácora Audiovisual (El Camino)
  const episodiosDocu = [
    {
      id: 'ep-01',
      number: 'EP. 01',
      title: 'Decidimos Ir — Rumbo a Bolivia 2026',
      date: 'Febrero 2026',
      duration: '08:45 min',
      thumbnail: '/E-576.jpg',
      description: 'El momento en que fijamos el objetivo de la Operación Santa Cruz y organizamos la autogestión de la campaña.',
      videoUrl: 'https://instagram.com/joelbox_'
    },
    {
      id: 'ep-02',
      number: 'EP. 02',
      title: 'Doble Turno y Bolsa Pesada en IMAD',
      date: 'Febrero 2026',
      duration: '12:10 min',
      thumbnail: '/20240203092340_IMG_2552.jpg',
      description: 'Rutina completa de preparación física, sparring técnico e intensificación del trabajo diario.',
      videoUrl: 'https://instagram.com/joelbox_'
    },
    {
      id: 'ep-03',
      number: 'EP. 03',
      title: 'Detrás de la Preventa Oficial',
      date: 'Marzo 2026',
      duration: '06:30 min',
      thumbnail: '/20240203095134_IMG_2729.jpg',
      description: 'El proceso transparente de producción de indumentaria para generar fondos directos sin intermediarios.',
      videoUrl: 'https://instagram.com/joelbox_'
    }
  ];

  // Historial Deportivo (El Ring)
  const peleasHistorial = [
    {
      id: 'p-01',
      fecha: 'Por Confirmar 2026',
      rival: 'Por Confirmar',
      lugar: 'Rosario / Santa Fe, Arg',
      categoria: 'Peso Gallo (Amateur)',
      resultado: 'PRÓXIMO COMBATE',
      metodo: 'En negociación',
      status: 'proximo'
    },
    {
      id: 'p-02',
      fecha: 'Temporada 2025',
      rival: 'Rival Provincial',
      lugar: 'Santa Fe, Argentina',
      categoria: 'Peso Gallo',
      resultado: 'VICTORIA',
      metodo: 'Puntos (Decisión Unánime)',
      status: 'pasado'
    },
    {
      id: 'p-03',
      fecha: 'Temporada 2025',
      rival: 'Rival Regional',
      lugar: 'Rosario, Argentina',
      categoria: 'Peso Gallo',
      resultado: 'VICTORIA',
      metodo: 'Puntos',
      status: 'pasado'
    }
  ];

  // Tablero de Misión Actual
  const recaudado = 0;
  const objetivo = 2600000;
  const porcentaje = Math.min(Math.round((recaudado / objetivo) * 100), 100);

  const handleSelectSize = (productId, size) => {
    setSelectedSize(prev => ({ ...prev, [productId]: size }));
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val);
  };

  const createOrderWhatsapp = (product) => {
    const size = selectedSize[product.id];
    if (!size) {
      alert('Por favor selecciona un talle o formato antes de reservar.');
      return;
    }
    const msg = `¡Hola Joel! Quiero reservar el producto: *${product.name}* (Talle/Opción: *${size}*).\n\n` +
      `• Precio Preventa: ${formatCurrency(product.price)}\n` +
      `• Seña del 50% a transferir: ${formatCurrency(product.deposit)}\n\n` +
      `Quedo a la espera de los datos bancarios/Alias para enviar el comprobante. ¡Vamos El León!`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const createComidaWhatsapp = (accion) => {
    const msg = `¡Hola Joel! Quiero reservar docenas de empandas para la *${accion.title}*.\n` +
      `• Valor por docena: ${formatCurrency(accion.precioPorDocena)}\n\n` +
      `Avisame los datos para transferir la seña y coordinar el retiro/entrega.`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const createSponsorWhatsapp = () => {
    const msg = `¡Hola Joel! Me interesa sumarme como ALIADO / SPONSOR estratégico de El León y respaldar el camino deportivo y las misiones activas. Quisiera coordinar una propuesta.`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const filteredProducts = selectedStoreCat === 'todos' 
    ? products 
    : products.filter(p => p.category === selectedStoreCat);

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-yellow-500 selection:text-black pb-12">
      
      {/* HEADER NAVEGADOR UNIFICADO */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-zinc-800/80 px-4 pt-3.5 pb-2">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('mision')}>
            <span className="text-xl font-black tracking-tighter text-yellow-400">EL LEÓN</span>
            <span className="text-[10px] bg-yellow-500/10 text-yellow-400 font-bold px-2 py-0.5 rounded border border-yellow-500/20 uppercase">
              UNIVERSO DIGITAL
            </span>
          </div>
          
          <a 
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 px-3 py-1.5 rounded-full transition-colors"
          >
            <Instagram className="w-3.5 h-3.5 text-yellow-400" />
            <span className="hidden sm:inline">@joelbox_</span>
          </a>
        </div>

        {/* MENÚ DE NAVEGACIÓN COMPLETO */}
        <nav className="max-w-6xl mx-auto mt-3 flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
          <button
            onClick={() => setActiveTab('mision')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black uppercase transition-all whitespace-nowrap ${
              activeTab === 'mision' ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-500/20 scale-105' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Home className="w-3.5 h-3.5" /> Inicio
          </button>

          <button
            onClick={() => setActiveTab('boxeador')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black uppercase transition-all whitespace-nowrap ${
              activeTab === 'boxeador' ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-500/20 scale-105' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" /> El Boxeador
          </button>

          <button
            onClick={() => setActiveTab('tienda')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black uppercase transition-all whitespace-nowrap ${
              activeTab === 'tienda' ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-500/20 scale-105' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" /> León Store
          </button>

          <button
            onClick={() => setActiveTab('elcamino')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black uppercase transition-all whitespace-nowrap ${
              activeTab === 'elcamino' ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-500/20 scale-105' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Tv className="w-3.5 h-3.5" /> El Camino
          </button>

          <button
            onClick={() => setActiveTab('noticias')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black uppercase transition-all whitespace-nowrap ${
              activeTab === 'noticias' ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-500/20 scale-105' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Newspaper className="w-3.5 h-3.5" /> Noticias
          </button>

          <button
            onClick={() => setActiveTab('elring')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black uppercase transition-all whitespace-nowrap ${
              activeTab === 'elring' ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-500/20 scale-105' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" /> El Ring
          </button>

          <button
            onClick={() => setActiveTab('financiacion')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black uppercase transition-all whitespace-nowrap ${
              activeTab === 'financiacion' ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-500/20 scale-105' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" /> Financiación
          </button>

          <button
            onClick={() => setActiveTab('aliados')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black uppercase transition-all whitespace-nowrap ${
              activeTab === 'aliados' ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-500/20 scale-105' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Award className="w-3.5 h-3.5" /> Aliados
          </button>

          <button
            onClick={() => setActiveTab('lamanada')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black uppercase transition-all whitespace-nowrap ${
              activeTab === 'lamanada' ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-500/20 scale-105' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> La Manada
          </button>

          <button
            onClick={() => setActiveTab('archivo')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black uppercase transition-all whitespace-nowrap ${
              activeTab === 'archivo' ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-500/20 scale-105' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <History className="w-3.5 h-3.5" /> El Archivo
          </button>
        </nav>
      </header>

      {/* CONTENIDOS DINÁMICOS */}
      <main className="max-w-6xl mx-auto px-4 pt-6">

        {/* 1. VISTA: INICIO / PORTADA & MISIÓN SANTA CRUZ */}
        {activeTab === 'mision' && (
          <div className="space-y-10 animate-fade-in">
            {/* HERO CINEMATOGRÁFICO */}
            <section className="relative rounded-3xl overflow-hidden border border-zinc-800 p-6 sm:p-12 text-center bg-zinc-950">
              <div className="absolute inset-0 z-0">
                <img src="/E-576.jpg" alt="Joel El León" className="w-full h-full object-cover object-center opacity-30 filter grayscale" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
              </div>

              <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                  <Zap className="w-3.5 h-3.5" /> MISIÓN ACTIVA: OPERACIÓN SANTA CRUZ 2026
                </span>
                
                <h1 className="text-3xl sm:text-6xl font-black text-white uppercase tracking-tight leading-none">
                  EL UNIVERSO DIGITAL DE <span className="text-yellow-400">EL LEÓN</span>
                </h1>
                
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
                  Centro oficial de operaciones de <strong>Joel Diaz (@joelbox_)</strong>. Bitácora de entrenamiento, tienda oficial y financiamiento autogestionado.
                </p>

                <div className="pt-2 flex flex-wrap gap-3 justify-center">
                  <button 
                    onClick={() => setActiveTab('tienda')}
                    className="bg-yellow-400 text-black font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider hover:bg-yellow-300 transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" /> Ir a León Store
                  </button>
                  <button 
                    onClick={() => setActiveTab('elcamino')}
                    className="bg-zinc-900 border border-zinc-700 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                  >
                    <Tv className="w-4 h-4 text-yellow-400" /> Ver El Camino
                  </button>
                  <button 
                    onClick={() => setActiveTab('aliados')}
                    className="bg-zinc-900 border border-zinc-700 text-zinc-300 font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                  >
                    <Award className="w-4 h-4 text-emerald-400" /> Ser Aliado
                  </button>
                </div>
              </div>
            </section>

            {/* TABLERO DE MISIÓN ACTIVA */}
            <section className="bg-zinc-950 border border-zinc-800 p-6 sm:p-8 rounded-2xl space-y-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <span className="bg-yellow-400 text-black text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
                    PROYECTO DESTACO / TEMPORADA 01
                  </span>
                  <h2 className="text-2xl font-black text-white uppercase mt-1.5 flex items-center gap-2">
                    🇧🇴 OPERACIÓN SANTA CRUZ 2026
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">Campamento internacional de entrenamiento en altura y logística.</p>
                </div>

                <div className="sm:text-right">
                  <span className="text-[10px] text-zinc-400 uppercase font-mono block">Progreso actual</span>
                  <span className="text-2xl font-mono font-bold text-yellow-400">
                    ${recaudado.toLocaleString('es-AR')} <span className="text-xs text-zinc-500">/ ${objetivo.toLocaleString('es-AR')}</span>
                  </span>
                </div>
              </div>

              {/* Barra de Progreso */}
              <div className="w-full bg-zinc-900 h-4 rounded-full overflow-hidden p-0.5 border border-zinc-800">
                <div 
                  className="bg-gradient-to-r from-yellow-500 to-yellow-300 h-full rounded-full transition-all duration-700"
                  style={{ width: `${porcentaje}%` }}
                />
              </div>

              {/* Desglose de Transparencia */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-zinc-900">
                <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800/80">
                  <span className="text-xs font-bold text-yellow-400 block uppercase">1. Producción Textil</span>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Una fracción del pago de cada prenda cubre estrictamente el costo de confección.</p>
                </div>
                <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800/80">
                  <span className="text-xs font-bold text-yellow-400 block uppercase">2. Logística & Traslado</span>
                  <p className="text-[11px] text-zinc-400 mt-0.5">El margen neto financia directamente pasajes terrestres/aéreos y estadía.</p>
                </div>
                <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800/80">
                  <span className="text-xs font-bold text-yellow-400 block uppercase">3. Preparación de Combate</span>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Soporta los insumos de vendaje, suplementación e indumentaria técnica.</p>
                </div>
              </div>
            </section>

            {/* PRÓXIMO COMBATE */}
            <section className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <span className="text-[10px] font-bold text-red-400 bg-red-950/80 border border-red-500/30 px-2.5 py-0.5 rounded uppercase">
                  PRÓXIMO COMBATE EN EL RING
                </span>
                <h3 className="text-2xl font-black text-white uppercase">JOEL DIAZ VS RIVAL (POR CONFIRMAR)</h3>
                <p className="text-xs text-zinc-400">Categoría Peso Gallo • Rosario / Santa Fe, Argentina • 2026</p>
              </div>

              <button 
                onClick={() => setActiveTab('elring')}
                className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider border border-zinc-700 whitespace-nowrap"
              >
                Ver Historial →
              </button>
            </section>

            {/* NO ME CREAS. MIRÁ. (PRUEBA SOCIAL Y EVIDENCIA) */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold tracking-widest text-yellow-400 uppercase block">Prueba Social & Evidencia</span>
                  <h2 className="text-2xl font-black text-white uppercase">NO ME CREAS. MIRÁ.</h2>
                </div>
                <span className="text-xs text-zinc-500 hidden sm:inline">Trabajo real diario</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-800 group">
                  <img src="/20240203092340_IMG_2552.jpg" alt="Entrenamiento pesado" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-[10px] text-yellow-400 font-bold uppercase block">Gimnasio IMAD</span>
                    <span className="text-xs font-bold text-white uppercase block">Bolsa Pesada & Cardio</span>
                  </div>
                </div>

                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-800 group">
                  <img src="/20240203095134_IMG_2729.jpg" alt="El equipo" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-[10px] text-yellow-400 font-bold uppercase block">Equipo Técnico</span>
                    <span className="text-xs font-bold text-white uppercase block">Sparring y Táctica</span>
                  </div>
                </div>

                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-800 group">
                  <img src="/E-543.jpg" alt="Guardia" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-[10px] text-yellow-400 font-bold uppercase block">Foco & Disciplina</span>
                    <span className="text-xs font-bold text-white uppercase block">Camino al Profesionalismo</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* 2. VISTA: EL BOXEADOR (BIOGRAFÍA Y FICHA TÉCNICA) */}
        {activeTab === 'boxeador' && (
          <div className="space-y-8 max-w-4xl mx-auto animate-fade-in">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold tracking-widest text-yellow-400 uppercase">Perfil Oficial</span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">EL BOXEADOR</h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
                Joel Diaz — Atleta amateur, profesor de boxeo y creador de contenido deportivo.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-zinc-950 border border-zinc-800 p-6 sm:p-8 rounded-3xl">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-zinc-800">
                <img src="/E-524.jpg" alt="Joel Diaz El León" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <span className="absolute bottom-3 left-3 text-xs font-bold text-yellow-400 uppercase">En el rincón</span>
              </div>

              <div className="space-y-5">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest">Biografía & Identidad</span>
                  <h3 className="text-2xl font-black text-white uppercase">JOEL DIAZ ("EL LEÓN")</h3>
                  <p className="text-xs text-zinc-400">Rosario / Santo Tomé, Santa Fe, Argentina</p>
                </div>

                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  Entreno día a día en el gimnasio IMAD con una sola visión: superarme combate tras combate, transmitir la disciplina del boxeo a mis alumnos y llevar nuestra bandera a torneos internacionales.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zinc-900">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase block font-bold">División</span>
                    <span className="text-sm font-black text-white">Peso Gallo</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase block font-bold">Guardia</span>
                    <span className="text-sm font-black text-white">Ortodoxa</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase block font-bold">Récord Amateur</span>
                    <span className="text-sm font-black text-yellow-400">25-10-1</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase block font-bold">Gimnasio Base</span>
                    <span className="text-sm font-black text-white">IMAD Boxing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. VISTA: LEÓN STORE & FIGHT SHOP */}
        {activeTab === 'tienda' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold tracking-widest text-yellow-400 uppercase">Tienda Oficial del Universo</span>
                <h2 className="text-3xl font-black text-white uppercase">LEÓN STORE</h2>
                <p className="text-xs text-zinc-400 mt-1">Reserva el 50% vía WhatsApp y salda al recibir la prenda.</p>
              </div>

              {/* Filtros de Categoría */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedStoreCat('todos')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                    selectedStoreCat === 'todos' ? 'bg-yellow-400 text-black' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setSelectedStoreCat('merch')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                    selectedStoreCat === 'merch' ? 'bg-yellow-400 text-black' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                  }`}
                >
                  Línea Original
                </button>
                <button
                  onClick={() => setSelectedStoreCat('santa_cruz')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                    selectedStoreCat === 'santa_cruz' ? 'bg-yellow-400 text-black' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                  }`}
                >
                  Campaña Bolivia
                </button>
                <button
                  onClick={() => setSelectedStoreCat('fight_shop')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                    selectedStoreCat === 'fight_shop' ? 'bg-yellow-400 text-black' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                  }`}
                >
                  Fight Shop
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <div key={p.id} className="bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition-all">
                  <div>
                    <div className="relative aspect-square bg-zinc-900 overflow-hidden flex items-center justify-center">
                      <img 
                        src={p.image} 
                        alt={p.name}
                        className="w-full h-full object-cover object-center"
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = 'https://via.placeholder.com/600x600/18181b/ffffff?text=EL+LEON';
                        }}
                      />
                      <div className={`absolute top-3 left-3 text-[10px] font-black tracking-wider px-2.5 py-1 rounded-md border ${p.badgeColor}`}>
                        {p.badge}
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div>
                        <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">{p.line}</span>
                        <h3 className="text-lg font-black text-white leading-tight uppercase mt-0.5">{p.name}</h3>
                        <p className="text-xs text-zinc-400 italic mt-0.5">{p.tagline}</p>
                      </div>

                      <p className="text-xs text-zinc-300 leading-relaxed">{p.description}</p>

                      <div className="pt-2">
                        <label className="text-[11px] font-bold text-zinc-400 uppercase block mb-1.5">Seleccionar Talle / Talla:</label>
                        <div className="flex flex-wrap gap-1.5">
                          {p.sizes.map((size) => (
                            <button
                              key={size}
                              onClick={() => handleSelectSize(p.id, size)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-md border transition-all ${
                                selectedSize[p.id] === size
                                  ? 'bg-yellow-400 text-black border-yellow-400 scale-105'
                                  : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-zinc-900 flex justify-between items-end">
                        <div>
                          <span className="text-[10px] text-zinc-400 block uppercase">Precio</span>
                          <span className="text-lg font-black text-white">{formatCurrency(p.price)}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-yellow-400 block uppercase font-bold">Seña de Reserva (50%)</span>
                          <span className="text-sm font-bold text-yellow-400">{formatCurrency(p.deposit)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <button
                      onClick={() => createOrderWhatsapp(p)}
                      className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                    >
                      <MessageCircle className="w-4 h-4 fill-black" /> Reservar por WhatsApp
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. VISTA: EL CAMINO (DOCUSERIES AUDIOVISUAL) */}
        {activeTab === 'elcamino' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold tracking-widest text-yellow-400 uppercase">Bitácora Audiovisual</span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">EL CAMINO — DOCUSERIES</h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
                El trabajo silencioso del gimnasio, los sparrings y la preparación rumbo a las metas.
              </p>
            </div>

            {/* Selector de Temporadas */}
            <div className="flex justify-center gap-2">
              <button 
                onClick={() => setActiveSeason('temp1')}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${
                  activeSeason === 'temp1' ? 'bg-yellow-400 text-black' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                }`}
              >
                Temporada 01 — Rumbo a Santa Cruz (2026)
              </button>
            </div>

            {/* Grid de Episodios */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {episodiosDocu.map((ep) => (
                <div key={ep.id} className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="relative aspect-video bg-zinc-900 overflow-hidden group">
                      <img src={ep.thumbnail} alt={ep.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center pl-0.5 text-black">
                          <Play className="w-6 h-6 fill-black" />
                        </div>
                      </div>
                      <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                        {ep.duration}
                      </span>
                    </div>

                    <div className="p-5 space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-bold text-yellow-400 uppercase">
                        <span>{ep.number}</span>
                        <span className="text-zinc-500">{ep.date}</span>
                      </div>
                      <h3 className="text-base font-black text-white uppercase">{ep.title}</h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">{ep.description}</p>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <a
                      href={ep.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-zinc-700"
                    >
                      <Video className="w-4 h-4 text-yellow-400" /> Ver Episodio
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. VISTA: NOTICIAS (SANITY + FALLBACK LOCAL) */}
        {activeTab === 'noticias' && (
          <div className="space-y-8 max-w-3xl mx-auto animate-fade-in">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold tracking-widest text-yellow-400 uppercase">Medio Oficial</span>
              <h2 className="text-3xl font-black text-white uppercase">📰 NOTICIAS DE EL LEÓN</h2>
            </div>

            <div className="space-y-4">
              {cargandoNoticias ? (
                <div className="text-center text-xs text-zinc-500 py-6 font-mono">Cargando noticias desde Sanity...</div>
              ) : noticiasCms.length > 0 ? (
                noticiasCms.map((n, idx) => (
                  <div key={n._id || idx} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-3">
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-500/30 px-2.5 py-0.5 rounded uppercase">
                      {n.categoria || 'OFICIAL'}
                    </span>
                    <h3 className="text-xl font-black text-white uppercase">{n.titulo || n.title}</h3>
                    <p className="text-xs text-zinc-300 leading-relaxed">{n.resumen || n.summary}</p>
                    {n.videoUrl && (
                      <a href={n.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-block text-xs font-bold text-yellow-400 underline mt-2">
                        Ver más detalles →
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <div className="space-y-4">
                  <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-3">
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-500/30 px-2.5 py-0.5 rounded uppercase">
                      SANTA CRUZ 2026
                    </span>
                    <h3 className="text-xl font-black text-white uppercase">Lanzamiento Oficial de la Preventa Bolivia</h3>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      Apertura de la preventa de la indumentaria oficial para cubrir pasajes y gastos logísticos de la delegación en Santa Cruz de la Sierra.
                    </p>
                  </div>

                  <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-3">
                    <span className="text-[10px] font-bold text-yellow-400 bg-yellow-950 border border-yellow-500/30 px-2.5 py-0.5 rounded uppercase">
                      ENTRENAMIENTO
                    </span>
                    <h3 className="text-xl font-black text-white uppercase">Intensificación de guanteos en Gimnasio IMAD</h3>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      Planificación del esquema táctico y acondicionamiento aeróbico con el equipo técnico.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 6. VISTA: EL RING / HISTORIAL DEPORTIVO */}
        {activeTab === 'elring' && (
          <div className="space-y-8 max-w-4xl mx-auto animate-fade-in">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold tracking-widest text-yellow-400 uppercase">Historial Deportivo</span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">EL RING</h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
                Registro transparente de combates amateur.
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-zinc-400 uppercase block">Registro de Peleas</span>
              {peleasHistorial.map((p) => (
                <div key={p.id} className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                        p.status === 'proximo' ? 'bg-red-950 text-red-400 border border-red-500/30' : 'bg-emerald-950 text-emerald-400'
                      }`}>
                        {p.resultado}
                      </span>
                      <span className="text-xs font-mono text-zinc-500">{p.fecha}</span>
                    </div>
                    <h4 className="text-lg font-black text-white uppercase mt-1">Joel Diaz VS {p.rival}</h4>
                    <p className="text-xs text-zinc-400">{p.lugar} • {p.categoria}</p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs font-bold text-yellow-400 uppercase block">{p.metodo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. VISTA: EL LEÓN SE FINANCIA & ACCIONES PUNTUALES */}
        {activeTab === 'financiacion' && (
          <div className="space-y-10 max-w-4xl mx-auto animate-fade-in">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold tracking-widest text-yellow-400 uppercase">Sistema Autogestionado</span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">EL LEÓN SE FINANCIA</h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
                El proyecto se sostiene con múltiples pilares autogestionados y el apoyo de la comunidad.
              </p>
            </div>

            {/* SECCIÓN DE ACCIONES PUNTUALES (COMIDA Y RECAUDACIONES SEPARADAS DE STORE) */}
            <div className="bg-zinc-950 border border-yellow-500/30 rounded-2xl p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-yellow-400" />
                <h3 className="text-xl font-black text-white uppercase">Acciones Puntuales de Recaudación</h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Ventas especiales de comida y eventos temporales creados exclusivamente para financiar los traslados y misiones activas.
              </p>

              {accionesTemporales.map((acc) => (
                <div key={acc.id} className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-yellow-400 bg-yellow-950 border border-yellow-500/30 px-2 py-0.5 rounded uppercase">
                      ACCIÓN ACTIVA
                    </span>
                    <h4 className="text-lg font-black text-white uppercase">{acc.title}</h4>
                    <p className="text-xs text-zinc-400">{acc.descripcion}</p>
                    <span className="text-[11px] text-zinc-500 block font-mono">Retiro: {acc.lugar} • {acc.fecha}</span>
                  </div>

                  <div className="text-left sm:text-right space-y-2 w-full sm:w-auto">
                    <span className="text-lg font-black text-white block">{formatCurrency(acc.precioPorDocena)} / docena</span>
                    <button
                      onClick={() => createComidaWhatsapp(acc)}
                      className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-300 text-black font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
                    >
                      <MessageCircle className="w-4 h-4 fill-black" /> Encargar por WhatsApp
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Hub de Pilares de Financiación */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl space-y-3">
                <ShoppingBag className="w-6 h-6 text-yellow-400" />
                <h3 className="text-lg font-black text-white uppercase">1. León Store</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Venta de indumentaria oficial. El margen neto financia directamente los viajes y campamentos de entrenamiento.
                </p>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl space-y-3">
                <Award className="w-6 h-6 text-yellow-400" />
                <h3 className="text-lg font-black text-white uppercase">2. Red de Aliados</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Patrocinio directo, suplementación y servicios profesionales aportados por marcas e instituciones aliadas.
                </p>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl space-y-3">
                <Dumbbell className="w-6 h-6 text-yellow-400" />
                <h3 className="text-lg font-black text-white uppercase">3. Clases de Boxeo</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Acondicionamiento físico y técnica de boxeo dictados por Joel Diaz.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 8. VISTA: ALIADOS */}
        {activeTab === 'aliados' && (
          <div className="space-y-8 max-w-3xl mx-auto animate-fade-in">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold tracking-widest text-yellow-400 uppercase">Red de Apoyo</span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">ALIADOS Y MARCAS</h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
                Este proyecto no busca simples sponsores: construye alianzas estratégicas reales.
              </p>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 text-center space-y-5">
              <h3 className="text-2xl font-black text-white uppercase">¿Querés sumarte como Aliado?</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
                  <span className="text-yellow-400 font-bold text-xs uppercase block">Patrocinio de Misión</span>
                  <p className="text-xs text-zinc-400 mt-1">Apoyo financiero directo para pasajes y equipamiento deportivo.</p>
                </div>
                <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
                  <span className="text-yellow-400 font-bold text-xs uppercase block">Canje & Servicios</span>
                  <p className="text-xs text-zinc-400 mt-1">Suplementación, indumentaria, kinesiología y servicios de entrenamiento.</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={createSponsorWhatsapp}
                  className="bg-yellow-400 hover:bg-yellow-300 text-black font-black px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider"
                >
                  QUIERO SER ALIADO — HABLAR POR WHATSAPP
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 9. VISTA: LA MANADA (COMUNIDAD EXCLUSIVA) */}
        {activeTab === 'lamanada' && (
          <div className="space-y-8 max-w-3xl mx-auto animate-fade-in">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold tracking-widest text-yellow-400 uppercase">Comunidad Oficial</span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">LA MANADA</h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
                Formá parte directa del día a día de las misiones y entrenamientos.
              </p>
            </div>

            <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-yellow-500/30 rounded-2xl p-8 text-center space-y-5">
              <div className="inline-flex items-center gap-2 text-yellow-400 bg-yellow-500/10 px-3.5 py-1 rounded-full text-xs font-bold border border-yellow-500/20">
                <Users className="w-4 h-4" />
                <span>CANAL EXCLUSIVO DE WHATSAPP</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase">Acceso Privado</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-2">
                <div className="bg-zinc-950/80 p-4 rounded-xl border border-zinc-800">
                  <span className="text-yellow-400 font-bold text-xs uppercase block">01. Cobertura</span>
                  <p className="text-[11px] text-zinc-400 mt-1">Videos de entrenamientos y detrás de escena antes que en redes.</p>
                </div>
                <div className="bg-zinc-950/80 p-4 rounded-xl border border-zinc-800">
                  <span className="text-yellow-400 font-bold text-xs uppercase block">02. Preventas</span>
                  <p className="text-[11px] text-zinc-400 mt-1">Acceso prioritario al catálogo de indumentaria y talles limitados.</p>
                </div>
                <div className="bg-zinc-950/80 p-4 rounded-xl border border-zinc-800">
                  <span className="text-yellow-400 font-bold text-xs uppercase block">03. Beneficios</span>
                  <p className="text-[11px] text-zinc-400 mt-1">Sorteos de merchandising e invitaciones a combates.</p>
                </div>
              </div>

              <div className="pt-3">
                <a
                  href={whatsappChannelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-black" /> QUIERO ENTRAR A LA MANADA
                </a>
              </div>
            </div>
          </div>
        )}

        {/* 10. VISTA: EL ARCHIVO & CRONOLOGÍA HISTÓRICA */}
        {activeTab === 'archivo' && (
          <div className="space-y-8 max-w-3xl mx-auto animate-fade-in">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold tracking-widest text-yellow-400 uppercase">Memoria Histórica</span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">EL ARCHIVO</h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
                La historia completa del proyecto guardada para siempre.
              </p>
            </div>

            <div className="space-y-6">
              <div className="border-l-2 border-yellow-400 pl-6 space-y-2">
                <span className="text-xs font-bold text-yellow-400 font-mono">2026</span>
                <h3 className="text-xl font-black text-white uppercase">Lanzamiento Operación Santa Cruz</h3>
                <p className="text-xs text-zinc-400">Inicio de la campaña autogestionada para la preparación internacional en Bolivia.</p>
              </div>

              <div className="border-l-2 border-zinc-800 pl-6 space-y-2">
                <span className="text-xs font-bold text-zinc-500 font-mono">2025</span>
                <h3 className="text-xl font-black text-white uppercase">Consolidación Amateur en Gimnasio IMAD</h3>
                <p className="text-xs text-zinc-400">Peleas regionales, sparrings intensivos y estructuración de la marca El León.</p>
              </div>

              <div className="border-l-2 border-zinc-800 pl-6 space-y-2">
                <span className="text-xs font-bold text-zinc-500 font-mono">2024</span>
                <h3 className="text-xl font-black text-white uppercase">Inicios del Proyecto</h3>
                <p className="text-xs text-zinc-400">Primeras bitácoras de entrenamiento y dictado de clases técnicas.</p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER OFICIAL */}
      <footer className="border-t border-zinc-900 py-8 px-4 text-center text-xs text-zinc-600 space-y-2 mt-16">
        <p className="font-bold text-zinc-400">EL LEÓN — JOEL DIAZ (@joelbox_)</p>
        <p>Santo Tomé / Rosario, Argentina • 2026</p>
      </footer>

    </div>
  );
              }
