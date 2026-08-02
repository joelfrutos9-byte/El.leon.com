import CalculadoraNutricional from './CalculadoraNutricional';
import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Zap, 
  MessageCircle, 
  Users, 
  Award, 
  Instagram, 
  Newspaper, 
  Tv, 
  Trophy,
  UserCheck,
  History,
  DollarSign,
  Utensils,
  Play,
  Video,
  Menu,
  X,
  ChevronRight,
  Dumbbell,
  Layers,
  Sparkles,
  Lock,
  PlayCircle,
  FileText,
  Send,
  Target,
  Activity,
  Key,
  CheckCircle2,
  Search
} from 'lucide-react';
import { supabase } from './supabaseClient';
import Admin from './Admin';

export default function App() {
  const [activeTab, setActiveTab] = useState('mision');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedStoreCat, setSelectedStoreCat] = useState('todos');
  const [selectedSize, setSelectedSize] = useState({});
  const [noticiasCms, setNoticiasCms] = useState([]);
  const [cargandoNoticias, setCargandoNoticias] = useState(true);

  // Estados para Clases / Contenido dinámico de Supabase
  const [posts, setPosts] = useState([]);
  const [cargandoPosts, setCargandoPosts] = useState(true);

  // Portal de Alumno Privado por Clave
  const [studentKey, setStudentKey] = useState('');
  const [activeStudentKey, setActiveStudentKey] = useState('');
  const [studentPosts, setStudentPosts] = useState([]);
  const [searchingStudent, setSearchingStudent] = useState(false);
  const [studentSearched, setStudentSearched] = useState(false);

  // Estado para desplegar el formulario de rutina personalizada
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    edad: '',
    ciudad: '',
    objetivo: 'Aprender Boxeo y Técnica',
    nivel: 'Principiante (Desde cero)',
    diasDisponibles: '3 días por semana',
    lugar: 'En gimnasio',
    lesiones: 'Ninguna'
  });

  // Truco secreto para abrir el panel de Admin (3 clicks en el Logo "EL LEÓN")
  const [logoClicks, setLogoClicks] = useState(0);

  const whatsappNumber = "5493425236731";
  const instagramUrl = "https://instagram.com/joelbox_";
  const whatsappChannelUrl = "https://whatsapp.com/channel/0029Vb8f4EU3QxS1ckJsS31A";

  const SANITY_PROJECT_ID = '837br3mo';
  const SANITY_DATASET = 'production';

  useEffect(() => {
    // Detectar si se entra con URL secreta ?admin=true
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('admin') === 'true') {
      setActiveTab('admin');
    }

    // Cargar noticias desde Sanity
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
        console.log("Consulta Sanity fallback:", err);
        setCargandoNoticias(false);
      });

    // Cargar sólo posts públicos de Supabase para el catálogo general
    fetchPublicPosts();
  }, []);

  const fetchPublicPosts = async () => {
    try {
      setCargandoPosts(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('access_type', 'public')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.log("Error cargando contenidos públicos:", err.message);
    } finally {
      setCargandoPosts(false);
    }
  };

  // Buscar contenido privado por Clave de Alumno
  const handleSearchStudentKey = async (e) => {
    e.preventDefault();
    if (!studentKey.trim()) return;

    try {
      setSearchingStudent(true);
      setStudentSearched(true);
      const cleanKey = studentKey.trim().toLowerCase();
      setActiveStudentKey(cleanKey);

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('password', cleanKey)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudentPosts(data || []);
    } catch (err) {
      console.log("Error buscando rutina de alumno:", err.message);
      setStudentPosts([]);
    } finally {
      setSearchingStudent(false);
    }
  };

  // Función secreta: Tocás 3 veces seguidas el logo EL LEÓN y te abre el Panel
  const handleLogoClick = () => {
    const newCount = logoClicks + 1;
    setLogoClicks(newCount);

    if (newCount >= 3) {
      setActiveTab('admin');
      setLogoClicks(0);
    } else {
      setTimeout(() => setLogoClicks(0), 3000);
    }
  };

  // Envío del Formulario de Rutina Personalizada a WhatsApp
  const handleSendCustomForm = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.edad.trim()) {
      alert('Por favor completá tu nombre y edad.');
      return;
    }

    const msg = `🥊 *FICHA DE EVALUACIÓN — RUTINA PERSONALIZADA* 🥊\n\n` +
      `👤 *Nombre:* ${formData.nombre}\n` +
      `🎂 *Edad:* ${formData.edad} años\n` +
      `📍 *Ciudad:* ${formData.ciudad || 'No especificada'}\n\n` +
      `🎯 *Objetivo Principal:* ${formData.objetivo}\n` +
      `📊 *Nivel de Experiencia:* ${formData.nivel}\n` +
      `📅 *Disponibilidad:* ${formData.diasDisponibles}\n` +
      `🏋️ *Lugar de Entrenamiento:* ${formData.lugar}\n` +
      `⚠️ *Lesiones/Molestias:* ${formData.lesiones}\n\n` +
      `¡Hola Joel! Te envío mi ficha completada desde la App para consultar por mi plan personalizado.`;

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // MENÚ 100% PÚBLICO
  const menuItems = [
    { id: 'mision', label: 'Rumbo a Santa Cruz', sub: 'Misión Activa 2026', icon: Zap, badge: 'ACTIVO', highlight: true },
    { id: 'clases', label: 'Clases & Rutinas', sub: 'Videos & Entrenamientos', icon: Dumbbell, badge: 'NUEVO' },
    { id: 'boxeador', label: 'El Boxeador', sub: 'Perfil de Joel Diaz', icon: UserCheck },
    { id: 'tienda', label: 'León Store', sub: 'Indumentaria & Merch', icon: ShoppingBag, badge: 'TIENDA' },
    { id: 'elcamino', label: 'El Camino', sub: 'Docuseries & Bitácora', icon: Tv },
    { id: 'noticias', label: 'Noticias', sub: 'Medio Oficial', icon: Newspaper },
    { id: 'elring', label: 'El Ring', sub: 'Historial Deportivo', icon: Trophy },
    { id: 'historia', label: 'La Historia', sub: 'Cronología Deportiva', icon: History },
    { id: 'financiacion', label: 'El León se Financia', sub: 'Hub de Autogestión', icon: DollarSign },
    { id: 'aliados', label: 'Aliados', sub: 'Marcas & Sponsors', icon: Award },
    { id: 'lamanada', label: 'La Manada', sub: 'Comunidad WhatsApp', icon: Users },
    { id: 'archivo', label: 'El Archivo', sub: 'Memoria Histórica', icon: Layers }
  ];

  // Productos León Store
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
      description: 'Corte oversize urbano. Algodón pesado de alta resistencia diseñado para soportar el entrenamiento diario.',
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
      description: 'Edición oficial de la misión activa. Todo el margen neto se destina a cubrir pasajes y logística del campamento.',
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
      description: 'Buzo pesado con capucha doble, puños reinforced y estampado táctico de alto impacto en espalda.',
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
    }
  ];

  // Acciones puntuales de financiación
  const accionesTemporales = [
    {
      id: 'empanadas-tanda-1',
      title: 'GRAN VENTA DE EMPANADAS — TANDA SANTA CRUZ',
      fecha: 'Sábado 15 de Agosto 2026',
      lugar: 'Santo Tomé / Retiro en Gimnasio IMAD',
      precioPorDocena: 14000,
      descripcion: 'Empanadas caseras de carne cortada a cuchillo. Todo lo vendido financia la logística de traslado.',
      activo: true
    }
  ];

  // Docuseries
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
    }
  ];

  // Historial Deportivo
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
    }
  ];

  const recaudado = 0;
  const objetivo = 2600000;
  const porcentaje = Math.min(Math.round((recaudado / objetivo) * 100), 100);

  const handleSelectTab = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    if (id === 'clases') {
      fetchPublicPosts();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      `• Seña del 50%: ${formatCurrency(product.deposit)}\n\n` +
      `Quedo a la espera de los datos de transferencia. ¡Vamos El León!`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const createComidaWhatsapp = (accion) => {
    const msg = `¡Hola Joel! Quiero encargar empanadas para la *${accion.title}*.\n` +
      `• Precio: ${formatCurrency(accion.precioPorDocena)} / docena\n\n` +
      `Avisame cómo transferir la seña.`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const createSponsorWhatsapp = () => {
    const msg = `¡Hola Joel! Me interesa sumarme como ALIADO / SPONSOR estratégico de El León. Quisiera coordinar una propuesta.`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const filteredProducts = selectedStoreCat === 'todos' 
    ? products 
    : products.filter(p => p.category === selectedStoreCat);

  const activeTabMeta = menuItems.find(item => item.id === activeTab) || menuItems[0];

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-yellow-500 selection:text-black pb-16">
      
      {/* HEADER PRINCIPAL */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-zinc-800 px-4 py-3">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          
          {/* LOGO EL LEÓN (3 CLICKS SEGUIDOS PARA MODO ADMIN) */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer select-none" 
            onClick={handleLogoClick}
            title="El León Boxeo"
          >
            <span className="text-xl font-black tracking-tighter text-yellow-400">EL LEÓN</span>
            <span className="text-[10px] bg-yellow-500/10 text-yellow-400 font-bold px-2 py-0.5 rounded border border-yellow-500/20 uppercase tracking-widest hidden sm:inline">
              UNIVERSO DIGITAL
            </span>
          </div>

          {/* ACCIONES SUPERIORES Y BOTÓN MENÚ */}
          <div className="flex items-center gap-2">
            <a 
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 px-3 py-1.5 rounded-full transition-colors"
            >
              <Instagram className="w-3.5 h-3.5 text-yellow-400" />
              <span>@joelbox_</span>
            </a>

            {/* BOTÓN MENÚ CELULAR / PANTALLA */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-black px-3.5 py-1.5 rounded-xl text-xs uppercase tracking-wider transition-all"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              <span>MENÚ</span>
            </button>
          </div>
        </div>

        {/* TABS SUPERIORES RÁPIDAS */}
        <div className="max-w-6xl mx-auto mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {menuItems.slice(0, 5).map(item => {
            const IconComponent = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase whitespace-nowrap transition-all ${
                  isSelected 
                    ? 'bg-zinc-100 text-black font-black' 
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800/80'
                }`}
              >
                <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : 'text-yellow-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold uppercase text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 whitespace-nowrap"
          >
            <span>+ Ver Todo</span>
          </button>
        </div>
      </header>

      {/* MENÚ DESPLEGABLE EN PANTALLA COMPLETA */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-6 overflow-y-auto animate-fade-in">
          <div>
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4 mb-6">
              <div>
                <span className="text-xl font-black text-yellow-400 tracking-tighter block">UNIVERSO DE EL LEÓN</span>
                <span className="text-xs text-zinc-400">Navegador General de Secciones</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 bg-zinc-900 border border-zinc-700 rounded-full text-zinc-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`flex items-center justify-between p-4 rounded-2xl text-left border transition-all ${
                      isSelected 
                        ? 'bg-yellow-400 text-black border-yellow-400 font-bold' 
                        : 'bg-zinc-950 text-zinc-200 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-black text-yellow-400' : 'bg-zinc-900 text-yellow-400'}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block text-sm font-black uppercase leading-tight">{item.label}</span>
                        <span className={`text-[11px] block mt-0.5 ${isSelected ? 'text-zinc-900' : 'text-zinc-400'}`}>{item.sub}</span>
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-black' : 'text-zinc-600'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-900 text-center space-y-2">
            <p className="text-xs text-zinc-400">Joel Diaz — Boxeador & Profesor • @joelbox_</p>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-yellow-400 font-bold underline uppercase tracking-wider"
            >
              Cerrar Menú
            </button>
          </div>
        </div>
      )}

      {/* TITULAR DE SECCIÓN ACTUAL */}
      <div className="bg-zinc-950 border-b border-zinc-900 py-3 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="text-zinc-600">Sección:</span>
            <span className="font-bold text-yellow-400 uppercase tracking-wider">
              {activeTab === 'admin' ? 'PANEL CREADOR' : activeTabMeta.label}
            </span>
          </div>
          <span className="text-[10px] bg-zinc-900 px-2 py-0.5 rounded text-zinc-400 font-mono hidden sm:inline">
            UNIVERSO DIGITAL / 2026
          </span>
        </div>
      </div>

      {/* VISTAS DE LAS SECCIONES */}
      <main className="max-w-6xl mx-auto px-4 pt-6">

        {/* 1. VISTA: RUMBO A SANTA CRUZ / INICIO */}
        {activeTab === 'mision' && (
          <div className="space-y-10 animate-fade-in">
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
                  Centro oficial de operaciones de <strong>Joel Diaz (@joelbox_)</strong>. Bitácora de entrenamiento, clases, tienda oficial y financiamiento autogestionado.
                </p>

                <div className="pt-2 flex flex-wrap gap-3 justify-center">
                  <button 
                    onClick={() => handleSelectTab('clases')}
                    className="bg-yellow-400 text-black font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider hover:bg-yellow-300 transition-all flex items-center justify-center gap-2"
                  >
                    <Dumbbell className="w-4 h-4" /> Ver Clases & Rutinas
                  </button>
                  <button 
                    onClick={() => handleSelectTab('tienda')}
                    className="bg-zinc-900 border border-zinc-700 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4 text-yellow-400" /> Ir a León Store
                  </button>
                </div>
              </div>
            </section>

            {/* TABLERO DE MISIÓN ACTIVA */}
            <section className="bg-zinc-950 border border-zinc-800 p-6 sm:p-8 rounded-2xl space-y-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <span className="bg-yellow-400 text-black text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
                    PROYECTO DESTACADO / TEMPORADA 01
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

              <div className="w-full bg-zinc-900 h-4 rounded-full overflow-hidden p-0.5 border border-zinc-800">
                <div 
                  className="bg-gradient-to-r from-yellow-500 to-yellow-300 h-full rounded-full transition-all duration-700"
                  style={{ width: `${porcentaje}%` }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-zinc-900">
                <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800/80">
                  <span className="text-xs font-bold text-yellow-400 block uppercase">1. Producción Textil</span>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Una fracción del pago de cada prenda cubre strictly el costo de confección.</p>
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
          </div>
        )}

        {/* 2. VISTA: CLASES & RUTINAS (+ PORTAL DE ALUMNO PRIVADO + FORMULARIO DE EVALUACIÓN) */}
        {activeTab === 'clases' && (
          <div className="space-y-8 max-w-4xl mx-auto animate-fade-in">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold tracking-widest text-yellow-400 uppercase">Centro de Entrenamiento</span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">CLASES & RUTINAS</h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
                Ingresá con tu Clave de Alumno para ver tus planes privados o pedí tu rutina a medida.
              </p>
            </div>

            {/* BUSCADOR PRIVADO DE ALUMNO */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-yellow-400" />
                <h3 className="text-xl font-black text-white uppercase">Acceso Alumnos — Tu Clave Personal</h3>
              </div>
              <p className="text-xs text-zinc-400">
                Si Joel te asignó una rutina, ingresá la clave que te dio por WhatsApp para acceder a tu plan exclusivo:
              </p>

              <form onSubmit={handleSearchStudentKey} className="flex gap-2 max-w-md">
                <input
                  type="text"
                  placeholder="Ej: marcos2026, juan-box"
                  value={studentKey}
                  onChange={(e) => setStudentKey(e.target.value)}
                  className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                />
                <button
                  type="submit"
                  disabled={searchingStudent}
                  className="bg-yellow-400 hover:bg-yellow-300 text-black font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all"
                >
                  <Search className="w-4 h-4" />
                  {searchingStudent ? 'Buscando...' : 'Ingresar'}
                </button>
              </form>

              {/* RESULTADO DE BÚSQUEDA DE ALUMNO */}
              {studentSearched && (
                <div className="pt-4 border-t border-zinc-900 animate-fade-in">
                  {studentPosts.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>¡Rutina encontrada para la clave "{activeStudentKey}"!</span>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {studentPosts.map((post) => (
                          <div key={post.id} className="bg-zinc-900/90 border border-yellow-500/50 rounded-2xl p-5 space-y-3">
                            <div className="flex justify-between items-start">
                              <span className="text-[10px] font-black uppercase tracking-wider bg-yellow-400 text-black px-2.5 py-0.5 rounded">
                                {post.category}
                              </span>
                              <span className="text-[10px] font-bold text-yellow-400 flex items-center gap-1">
                                <Lock className="w-3 h-3" /> Plan Exclusivo
                              </span>
                            </div>

                            <h4 className="text-lg font-black text-white uppercase">{post.title}</h4>

                            {post.description && (
                              <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line bg-black/50 p-4 rounded-xl border border-zinc-800">
                                {post.description}
                              </p>
                            )}

                            <a
                              href={post.video_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 bg-yellow-400 text-black font-black px-5 py-2.5 rounded-xl text-xs uppercase"
                            >
                              <PlayCircle className="w-4 h-4" /> Ver Video de la Rutina
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-red-400 bg-red-950/40 border border-red-800/50 p-4 rounded-xl">
                      No encontramos ninguna rutina activa asignada a la clave <strong>"{activeStudentKey}"</strong>. Verificá que la estés escribiendo exactamente como te la dio Joel.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* SECCIÓN DESTACADA: PEDIR RUTINA PERSONALIZADA */}
            <div className="bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border border-yellow-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2.5 py-1 rounded-md">
                    <Target className="w-3.5 h-3.5" /> PLANES A MEDIDA
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white uppercase">¿No tenés clave todavía? Pedí tu Plan</h3>
                  <p className="text-xs text-zinc-400 max-w-lg">
                    Completá tu ficha de evaluación física para que analice tus objetivos y te arme una rutina personalizada con tu propia clave.
                  </p>
                </div>

                <button
                  onClick={() => setShowCustomForm(!showCustomForm)}
                  className="bg-yellow-400 hover:bg-yellow-300 text-black font-black px-5 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all whitespace-nowrap self-stretch sm:self-auto justify-center"
                >
                  <FileText className="w-4 h-4" />
                  {showCustomForm ? 'Cerrar Ficha' : 'Completar Ficha'}
                </button>
              </div>

              {/* FORMULARIO DESPLEGABLE */}
              {showCustomForm && (
                <form onSubmit={handleSendCustomForm} className="pt-6 border-t border-zinc-800 space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Tu Nombre *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Marcos Pérez"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Edad *</label>
                      <input
                        type="number"
                        required
                        placeholder="Ej: 24"
                        value={formData.edad}
                        onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Ciudad / Localidad</label>
                      <input
                        type="text"
                        placeholder="Ej: Santo Tomé"
                        value={formData.ciudad}
                        onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Objetivo Principal *</label>
                      <select
                        value={formData.objetivo}
                        onChange={(e) => setFormData({ ...formData, objetivo: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                      >
                        <option value="Aprender Boxeo y Técnica">Aprender Boxeo y Técnica</option>
                        <option value="Bajar de peso y quemar grasa">Bajar de peso y quemar grasa</option>
                        <option value="Ganar masa muscular y fuerza">Ganar masa muscular y fuerza</option>
                        <option value="Preparación Física para Combate">Preparación Física para Combate</option>
                        <option value="Acondicionamiento físico general">Acondicionamiento físico general</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Nivel de Experiencia *</label>
                      <select
                        value={formData.nivel}
                        onChange={(e) => setFormData({ ...formData, nivel: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                      >
                        <option value="Principiante (Desde cero)">Principiante (Desde cero)</option>
                        <option value="Intermedio (Ya entrené antes)">Intermedio (Ya entrené antes)</option>
                        <option value="Avanzado (Boxeador / Atleta activo)">Avanzado (Boxeador / Atleta activo)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Disponibilidad Semanal *</label>
                      <select
                        value={formData.diasDisponibles}
                        onChange={(e) => setFormData({ ...formData, diasDisponibles: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                      >
                        <option value="2 días por semana">2 días por semana</option>
                        <option value="3 días por semana">3 días por semana</option>
                        <option value="4 a 5 días por semana">4 a 5 días por semana</option>
                        <option value="Todos los días">Todos los días</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">¿Dónde vas a entrenar? *</label>
                      <select
                        value={formData.lugar}
                        onChange={(e) => setFormData({ ...formData, lugar: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                      >
                        <option value="En gimnasio tradicional">En gimnasio tradicional</option>
                        <option value="En casa (sin equipamiento)">En casa (sin equipamiento)</option>
                        <option value="En casa (con bolsa / mancuernas)">En casa (con bolsa / mancuernas)</option>
                        <option value="Al aire libre / Parque">Al aire libre / Parque</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Lesiones o Molestias Físicas</label>
                    <input
                      type="text"
                      placeholder="Ej: Dolor leve en rodilla derecha, hombro, etc. (O escribí 'Ninguna')"
                      value={formData.lesiones}
                      onChange={(e) => setFormData({ ...formData, lesiones: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all mt-2"
                  >
                    <Send className="w-4 h-4 fill-black" />
                    Enviar Diagnóstico por WhatsApp a Joel
                  </button>
                </form>
              )}
            </div>

            {/* CATALOGO PÚBLICO GENERAL */}
            {posts.length > 0 && (
              <div className="space-y-4 pt-4">
                <h3 className="text-xl font-black text-white uppercase flex items-center gap-2">
                  <Activity className="w-5 h-5 text-yellow-400" />
                  Clases Abiertas de Muestra
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {posts.map((post) => (
                    <div 
                      key={post.id}
                      className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-all"
                    >
                      <div className="space-y-3">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2.5 py-1 rounded-md">
                          {post.category}
                        </span>

                        <h3 className="text-lg font-black text-white uppercase leading-tight">{post.title}</h3>

                        {post.description && (
                          <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
                            {post.description}
                          </p>
                        )}
                      </div>

                      <a
                        href={post.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                      >
                        <PlayCircle className="w-4 h-4" /> Ver Clase
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. VISTA: PANEL CREADOR SECRETO (ACCESO CON 3 CLICKS EN EL LOGO + PIN 0811) */}
        {activeTab === 'admin' && (
          <div className="animate-fade-in">
            <Admin />
          </div>
        )}

        {/* 4. VISTA: EL BOXEADOR */}
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

        {/* 5. VISTA: LEÓN STORE */}
        {activeTab === 'tienda' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold tracking-widest text-yellow-400 uppercase">Tienda Oficial del Universo</span>
                <h2 className="text-3xl font-black text-white uppercase">LEÓN STORE</h2>
                <p className="text-xs text-zinc-400 mt-1">Reserva el 50% vía WhatsApp y salda al recibir la prenda.</p>
              </div>

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
                        <label className="text-[11px] font-bold text-zinc-400 uppercase block mb-1.5">Seleccionar Talle:</label>
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

        {/* 6. VISTA: EL CAMINO */}
        {activeTab === 'elcamino' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold tracking-widest text-yellow-400 uppercase">Bitácora Audiovisual</span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">EL CAMINO — DOCUSERIES</h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
                El trabajo silencioso del gimnasio, los sparrings y la preparación rumbo a las metas.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

        {/* 7. VISTA: NOTICIAS */}
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
                  </div>
                ))
              ) : (
                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-3">
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-500/30 px-2.5 py-0.5 rounded uppercase">
                    SANTA CRUZ 2026
                  </span>
                  <h3 className="text-xl font-black text-white uppercase">Lanzamiento Oficial de la Preventa Bolivia</h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Apertura de la preventa de la indumentaria oficial para cubrir pasajes y gastos logísticos de la delegación en Santa Cruz de la Sierra.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 8. VISTA: EL RING */}
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

        {/* 9. VISTA: LA HISTORIA */}
        {activeTab === 'historia' && (
          <div className="space-y-8 max-w-3xl mx-auto animate-fade-in">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold tracking-widest text-yellow-400 uppercase">Cronología Deportivo</span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">LA HISTORIA</h2>
            </div>

            <div className="space-y-6 border-l-2 border-yellow-400 pl-6">
              <div className="space-y-1">
                <span className="text-xs font-bold text-yellow-400 font-mono">2026 — ETAPA ACTUAL</span>
                <h3 className="text-xl font-black text-white uppercase">Operación Santa Cruz</h3>
                <p className="text-xs text-zinc-400">Inicio de la autogestión internacional y campamento deportivo en altura.</p>
              </div>

              <div className="space-y-1 pt-4">
                <span className="text-xs font-bold text-zinc-500 font-mono">2025</span>
                <h3 className="text-xl font-black text-white uppercase">Consolidación en Gimnasio IMAD</h3>
                <p className="text-xs text-zinc-400">Temporada de combates amateur y estructuración del equipo de trabajo.</p>
              </div>
            </div>
          </div>
        )}

        {/* 10. VISTA: EL LEÓN SE FINANCIA */}
        {activeTab === 'financiacion' && (
          <div className="space-y-8 max-w-4xl mx-auto animate-fade-in">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold tracking-widest text-yellow-400 uppercase">Sistema Autogestionado</span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">EL LEÓN SE FINANCIA</h2>
            </div>

            <div className="bg-zinc-950 border border-yellow-500/30 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-yellow-400" />
                <h3 className="text-xl font-black text-white uppercase">Acciones Puntuales de Recaudación</h3>
              </div>
              {accionesTemporales.map((acc) => (
                <div key={acc.id} className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h4 className="text-lg font-black text-white uppercase">{acc.title}</h4>
                    <p className="text-xs text-zinc-400">{acc.descripcion}</p>
                  </div>
                  <button
                    onClick={() => createComidaWhatsapp(acc)}
                    className="bg-yellow-400 text-black font-black px-5 py-2.5 rounded-xl text-xs uppercase"
                  >
                    Encargar por WhatsApp
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 11. VISTA: ALIADOS */}
        {activeTab === 'aliados' && (
          <div className="space-y-8 max-w-3xl mx-auto animate-fade-in">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold tracking-widest text-yellow-400 uppercase">Red de Apoyo</span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">ALIADOS Y MARCAS</h2>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 text-center space-y-5">
              <h3 className="text-2xl font-black text-white uppercase">¿Querés sumarte como Aliado?</h3>
              <button
                onClick={createSponsorWhatsapp}
                className="bg-yellow-400 hover:bg-yellow-300 text-black font-black px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider"
              >
                QUIERO SER ALIADO — HABLAR POR WHATSAPP
              </button>
            </div>
          </div>
        )}

        {/* 12. VISTA: LA MANADA */}
        {activeTab === 'lamanada' && (
          <div className="space-y-8 max-w-3xl mx-auto animate-fade-in">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold tracking-widest text-yellow-400 uppercase">Comunidad Oficial</span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">LA MANADA</h2>
            </div>

            <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-yellow-500/30 rounded-2xl p-8 text-center space-y-5">
              <h3 className="text-2xl font-black text-white uppercase">Acceso Privado</h3>
              <a
                href={whatsappChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider"
              >
                <MessageCircle className="w-4 h-4 fill-black" /> QUIERO ENTRAR A LA MANADA
              </a>
            </div>
          </div>
        )}

        {/* 13. VISTA: EL ARCHIVO */}
        {activeTab === 'archivo' && (
          <div className="space-y-8 max-w-3xl mx-auto animate-fade-in">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold tracking-widest text-yellow-400 uppercase">Memoria Histórica</span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">EL ARCHIVO</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl">
                <span className="text-xs font-bold text-yellow-400 block font-mono">2026</span>
                <h4 className="text-lg font-black text-white uppercase mt-1">Lanzamiento del Universo Digital</h4>
                <p className="text-xs text-zinc-400">Integración de catálogo autogestionado, clases online y bitácora audiovisual.</p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 py-8 px-4 text-center text-xs text-zinc-600 space-y-2 mt-16">
        <p className="font-bold text-zinc-400">EL LEÓN — JOEL DIAZ (@joelbox_)</p>
        <p>Santo Tomé / Rosario, Argentina • 2026</p>
      </footer>

    </div>
  );
      }
