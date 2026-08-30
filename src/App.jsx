import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  ShoppingBag, 
  MessageCircle, 
  Instagram, 
  Tv, 
  Video, 
  Menu, 
  X, 
  ChevronRight, 
  ShieldCheck, 
  Send, 
  User, 
  LogOut, 
  Truck, 
  ExternalLink, 
  Check, 
  Youtube, 
  Copy 
} from 'lucide-react';
import { supabase } from './supabaseClient';
import Admin from './Admin';
import AuthModal from './componentes/AuthModal';

// --- HELPERS PURAS (Fuera del componente para evitar recreación en cada render) ---
const formatCurrency = (val) => 
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val);

const getEmbedYoutubeUrl = (url) => {
  if (!url) return null;
  if (url.includes("youtube.com/embed/")) return url;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2] && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
};

// --- DATOS CONSTANTES ---
const CONTACT_DATA = {
  whatsappNumber: "5493425236731",
  instagramUrl: "https://instagram.com/joelbox_",
  youtubeUrl: "https://youtube.com/@joel.frutosok?si=wopuwS8XylpehGhn",
  payment: {
    alias: "joelboxeador",
    titular: "Joel Frutos",
    banco: "Banco Galicia"
  }
};

const DEFAULT_PRODUCTS = [
  {
    id: 'original-01',
    name: 'REMERA EL LEÓN — LÍNEA ORIGINAL',
    tagline: 'LA PIEL PERMANENTE DE LA MARCA',
    line: 'LÍNEA ORIGINAL',
    colorName: 'NEGRO',
    price: 34900,
    deposit: 20000,
    balance: 14900,
    image: '/1785149020942.png',
    badge: 'LÍNEA PERMANENTE',
    badgeColor: 'bg-[#FFD400] text-black font-black border-[#FFD400]',
    description: 'Corte oversize urbano cotidiano. Algodón pesado de alta resistencia. Representa la identidad viva de El León.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  }
];

export default function App() {
  // Navegación Principal: 'inicio' | 'store' | 'contenido' | 'admin'
  const [activeTab, setActiveTab] = useState('inicio');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [storeSubTab, setStoreSubTab] = useState('catalogo'); // 'catalogo' | 'como-funciona' | 'envios'

  // Proceso de Checkout y Selección de Productos
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [checkoutStep, setCheckoutStep] = useState('catalogo'); // 'catalogo' | 'formulario' | 'transferencia'
  const [copiedAlias, setCopiedAlias] = useState(false);

  // Formulario del comprador
  const [buyerForm, setBuyerForm] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    telefono: '',
    localidad: 'Santo Tomé / Santa Fe'
  });

  // Base de datos y Sesión
  const [dbProducts, setDbProducts] = useState([]);
  const [dbPosts, setDbPosts] = useState([]);
  const [cargandoDb, setCargandoDb] = useState(true);
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState('alumno');
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Secreto Admin
  const [logoClicks, setLogoClicks] = useState(0);

  // Carga inicial y listeners de autenticación
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUserProfile(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchUserProfile(session.user.id);
      else setUserRole('alumno');
    });

    if (new URLSearchParams(window.location.search).get('admin') === 'true') {
      setActiveTab('admin');
    }

    fetchDatabaseData();
    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const { data } = await supabase.from('profiles').select('rol').eq('id', userId).single();
      if (data?.rol) setUserRole(data.rol);
    } catch (err) {
      console.error('Perfil no encontrado:', err.message);
    }
  };

  const fetchDatabaseData = async () => {
    setCargandoDb(true);
    try {
      const [{ data: postsData }, { data: prodsData }] = await Promise.all([
        supabase.from('posts').select('*').order('created_at', { ascending: false }),
        supabase.from('products').select('*').order('created_at', { ascending: false })
      ]);

      if (postsData?.length) setDbPosts(postsData);
      if (prodsData?.length) setDbProducts(prodsData);
    } catch (err) {
      console.error("Carga Supabase diferida:", err.message);
    } fontally {
      setCargandoDb(false);
    }
  };

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const handleLogoClick = () => {
    setLogoClicks((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        setActiveTab('admin');
        return 0;
      }
      return next;
    });
    setTimeout(() => setLogoClicks(0), 3000);
  };

  const handleSelectTab = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSize = (productId, size) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }));
  };

  const handleStartReservation = (product) => {
    if (!selectedSizes[product.id]) {
      alert('Por favor elegí un talle antes de continuar con la reserva.');
      return;
    }
    setSelectedProduct(product);
    setCheckoutStep('formulario');
  };

  const handleCopyAlias = () => {
    navigator.clipboard.writeText(CONTACT_DATA.payment.alias);
    setCopiedAlias(true);
    setTimeout(() => setCopiedAlias(false), 2500);
  };

  const handleSendReservationWhatsapp = (e) => {
    e.preventDefault();
    const { nombre, apellido, dni, telefono, localidad } = buyerForm;
    if (!nombre || !apellido || !dni || !telefono) {
      alert('Por favor completá todos los datos obligatorios.');
      return;
    }

    const size = selectedSizes[selectedProduct.id] || 'S';
    const lines = [
      "🦁 *NUEVA RESERVA PREVENTA — EL LEÓN*",
      "",
      `👤 *Cliente:* ${nombre} ${apellido}`,
      `🪪 *DNI:* ${dni}`,
      `📱 *WhatsApp:* ${telefono}`,
      `📍 *Zona/Entrega:* ${localidad}`,
      "",
      `📦 *Producto:* ${selectedProduct.name}`,
      `📏 *Talle:* ${size}`,
      `🔢 *Cantidad:* 1`,
      "",
      `💰 *Precio Total:* ${formatCurrency(selectedProduct.price)}`,
      `💳 *Seña requerida:* ${formatCurrency(selectedProduct.deposit)}`,
      `💵 *Saldo contra entrega:* ${formatCurrency(selectedProduct.balance)}`,
      "",
      "🏷️ *Colección:* LÍNEA ORIGINAL",
      "",
      "¡Hola Joel! Te envío la reserva desde la app para que me confirmes la recepción de la seña."
    ];

    window.open(`https://wa.me/${CONTACT_DATA.whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`, '_blank');
    setCheckoutStep('transferencia');
  };

  const productsList = useMemo(() => dbProducts.length > 0 ? dbProducts : DEFAULT_PRODUCTS, [dbProducts]);

  const navTabs = useMemo(() => [
    { id: 'inicio', label: 'EL LEÓN', sub: 'Boxeo • Entrenamiento • Camino', icon: User },
    { id: 'store', label: 'LEÓN STORE', sub: 'Indumentaria & Preventa', icon: ShoppingBag, badge: 'PREVENTA' },
    { id: 'contenido', label: 'SEGUÍ EL CAMINO', sub: 'Videos, Vlogs & Redes', icon: Tv },
    ...(userRole === 'profesor' ? [{ id: 'admin', label: 'PANEL CREADOR', sub: 'Gestión & Productos', icon: ShieldCheck, badge: 'ADMIN' }] : [])
  ], [userRole]);

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-[#FFD400] selection:text-black pb-20 sm:pb-12">
      
      {/* HEADER PRINCIPAL */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-zinc-800/80 px-4 py-3">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          
          <div 
            className="flex items-center gap-2 cursor-pointer select-none" 
            onClick={handleLogoClick}
            title="El León Boxeo"
          >
            <span className="text-xl sm:text-2xl font-black tracking-tighter text-[#FFD400] uppercase font-mono">
              EL LEÓN
            </span>
            <span className="text-[9px] bg-zinc-900 text-zinc-400 font-bold px-2 py-0.5 rounded border border-zinc-800 uppercase tracking-widest hidden sm:inline">
              BOXEO & ENTRENAMIENTO
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a 
              href={CONTACT_DATA.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 px-3 py-1.5 rounded-full transition-colors"
            >
              <Instagram className="w-3.5 h-3.5 text-[#FFD400]" />
              <span className="hidden sm:inline">@joelbox_</span>
            </a>

            {session ? (
              <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                  userRole === 'profesor' ? 'bg-[#FFD400] text-black' : 'bg-zinc-800 text-zinc-300'
                }`}>
                  {userRole === 'profesor' ? 'Admin' : 'Usuario'}
                </span>
                <button onClick={handleLogout} className="p-1 text-zinc-400 hover:text-white" title="Cerrar Sesión">
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="bg-zinc-900 hover:bg-zinc-800 text-[#FFD400] font-bold border border-zinc-700/80 text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 uppercase"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ingresar</span>
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center gap-1.5 bg-[#FFD400] hover:bg-yellow-400 text-black font-black px-3.5 py-1.5 rounded-xl text-xs uppercase tracking-wider transition-all"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              <span className="hidden sm:inline">MENÚ</span>
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {navTabs.map(item => {
            const IconComponent = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black uppercase whitespace-nowrap transition-all border ${
                  isSelected 
                    ? 'bg-[#FFD400] text-black border-[#FFD400] shadow-md shadow-[#FFD400]/10' 
                    : 'bg-zinc-900/90 text-zinc-400 border-zinc-800/90 hover:text-white hover:border-zinc-700'
                }`}
              >
                <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : 'text-[#FFD400]'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[8px] px-1.5 py-0.2 rounded font-mono ${
                    isSelected ? 'bg-black text-[#FFD400]' : 'bg-[#FFD400]/10 text-[#FFD400]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* NAVEGACIÓN MÓVIL (DESPLEGABLE) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-6 overflow-y-auto animate-fade-in">
          <div>
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4 mb-6">
              <div>
                <span className="text-xl font-black text-[#FFD400] uppercase tracking-wider block">EL LEÓN</span>
                <span className="text-xs text-zinc-400">Boxeo • Entrenamiento • Camino</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 bg-zinc-900 border border-zinc-700 rounded-full text-zinc-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {navTabs.map((item) => {
                const IconComponent = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`flex items-center justify-between p-4 rounded-2xl text-left border transition-all ${
                      isSelected 
                        ? 'bg-[#FFD400] text-black border-[#FFD400] font-bold' 
                        : 'bg-zinc-950 text-zinc-200 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-black text-[#FFD400]' : 'bg-zinc-900 text-[#FFD400]'}`}>
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
            <p className="text-xs text-zinc-400">Joel Frutos / Joel Díaz • @joelbox_</p>
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-4 pt-6">

        {session && userRole === 'profesor' && activeTab !== 'admin' && (
          <div className="mb-6 bg-[#FFD400]/10 border border-[#FFD400]/30 p-4 rounded-2xl flex justify-between items-center gap-3">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#FFD400] shrink-0" />
              <div>
                <h4 className="text-xs font-black text-[#FFD400] uppercase">Modo Creador Activado</h4>
                <p className="text-[11px] text-zinc-400">Tenés acceso habilitado para publicar novedades o productos.</p>
              </div>
            </div>
            <button
              onClick={() => handleSelectTab('admin')}
              className="bg-[#FFD400] hover:bg-yellow-400 text-black text-xs font-black px-3 py-1.5 rounded-xl uppercase transition-all whitespace-nowrap"
            >
              Panel
            </button>
          </div>
        )}

        {/* 1. SECCIÓN INICIO */}
        {activeTab === 'inicio' && (
          <div className="space-y-12 animate-fade-in">
            <section className="relative rounded-3xl overflow-hidden border border-zinc-800/90 bg-zinc-950 text-center p-6 sm:p-12">
              <div className="absolute inset-0 z-0">
                <img src="/E-576.jpg" alt="Joel El León" className="w-full h-full object-cover object-center opacity-30 filter grayscale" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
              </div>

              <div className="relative z-10 space-y-5 max-w-2xl mx-auto">
                <span className="inline-flex items-center gap-2 bg-[#FFD400]/10 border border-[#FFD400]/30 px-3.5 py-1 rounded-full text-[#FFD400] text-xs font-black uppercase tracking-widest">
                  EL LEÓN
                </span>
                
                <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-none">
                  BOXEO. ENTRENAMIENTO. <span className="text-[#FFD400]">CAMINO.</span>
                </h1>
                
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto font-medium">
                  "Soy Joel. Estoy construyendo algo nuevo alrededor del boxeo y quiero mostrar todo lo que pase en el camino."
                </p>

                <div className="pt-3 flex flex-wrap gap-3 justify-center">
                  <button 
                    onClick={() => handleSelectTab('store')}
                    className="bg-[#FFD400] hover:bg-yellow-400 text-black font-black px-6 py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FFD400]/10"
                  >
                    <ShoppingBag className="w-4 h-4 text-black" />
                    <span>VER LEÓN STORE</span>
                  </button>

                  <button 
                    onClick={() => handleSelectTab('contenido')}
                    className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold border border-zinc-700/80 px-6 py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                  >
                    <Tv className="w-4 h-4 text-[#FFD400]" />
                    <span>VER CONTENIDO</span>
                  </button>
                </div>
              </div>
            </section>

            <section className="bg-zinc-950 border border-zinc-800/90 rounded-3xl p-6 sm:p-10 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD400]/5 rounded-full filter blur-2xl pointer-events-none" />

              <div className="space-y-2">
                <span className="text-[10px] font-black tracking-widest text-[#FFD400] uppercase bg-[#FFD400]/10 border border-[#FFD400]/20 px-3 py-1 rounded-full">
                  SOBRE EL PROYECTO
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
                  ESTOY EMPEZANDO ALGO NUEVO.
                </h2>
              </div>

              <div className="bg-black/60 border border-zinc-800/80 p-6 rounded-2xl space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-2xl">
                <p className="text-white font-bold text-sm sm:text-base italic">
                  {"«No sé cómo va a salir. No sé hasta dónde puede llegar. Pero quiero intentarlo.»"}
                </p>
                <p>
                  El León es un proyecto en construcción. Detrás de la marca no hay un personaje perfecto ni una corporación: hay un chico común que entrena todos los días, que trabaja, da clases y decidió asumir una responsabilidad extraordinaria.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-zinc-900/80 border border-zinc-800/80 p-4 rounded-2xl text-center space-y-1">
                  <span className="text-2xl font-black text-[#FFD400] block font-mono">+44</span>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase block">Peleas Amateur</span>
                </div>
                <div className="bg-zinc-900/80 border border-zinc-800/80 p-4 rounded-2xl text-center space-y-1">
                  <span className="text-2xl font-black text-white block font-mono">Campeón</span>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase block">Regional y Provincial</span>
                </div>
                <div className="bg-zinc-900/80 border border-zinc-800/80 p-4 rounded-2xl text-center space-y-1">
                  <span className="text-2xl font-black text-[#FFD400] block font-mono">3er Puesto</span>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase block">Nacional</span>
                </div>
                <div className="bg-zinc-900/80 border border-zinc-800/80 p-4 rounded-2xl text-center space-y-1">
                  <span className="text-2xl font-black text-white block font-mono">Peso Gallo</span>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase block">Categoría</span>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* 2. SECCIÓN LEÓN STORE */}
        {activeTab === 'store' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold tracking-widest text-[#FFD400] uppercase bg-[#FFD400]/10 border border-[#FFD400]/20 px-3.5 py-1 rounded-full">
                SISTEMA DE PREVENTA OFICIAL
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">LEÓN STORE</h2>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Trabajamos mediante PREVENTA / PRODUCCIÓN BAJO PEDIDO.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-zinc-800 pb-4">
              <div className="flex gap-2 text-xs">
                {[
                  { id: 'catalogo', label: 'Catálogo' },
                  { id: 'como-funciona', label: '¿Cómo funciona?' },
                  { id: 'envios', label: 'Entregas' }
                ].map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => setStoreSubTab(sub.id)}
                    className={`px-3 py-1 rounded-lg font-bold uppercase transition-all ${
                      storeSubTab === sub.id ? 'bg-[#FFD400] text-black font-black' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>

            {storeSubTab === 'como-funciona' && (
              <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-3xl space-y-4 animate-fade-in">
                <h3 className="text-lg font-black text-white uppercase text-center">01 AL 08 — CÓMO FUNCIONA TU RESERVA</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  {[
                    { n: '01', t: 'Elegís tu producto' },
                    { n: '02', t: 'Elegís tu talle' },
                    { n: '03', t: 'Completás tus datos' },
                    { n: '04', t: 'Enviás por WhatsApp' },
                    { n: '05', t: 'Transferís la seña' },
                    { n: '06', t: 'Enviás comprobante' },
                    { n: '07', t: 'Se manda a producir' },
                    { n: '08', t: 'Recibís y pagás el saldo' }
                  ].map(step => (
                    <div key={step.n} className="bg-zinc-900 p-3.5 rounded-xl border border-zinc-800 space-y-1">
                      <span className="text-[#FFD400] font-mono font-black text-sm block">{step.n}</span>
                      <span className="text-zinc-300 font-bold uppercase text-[11px] block">{step.t}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {storeSubTab === 'envios' && (
              <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-3xl space-y-4 animate-fade-in text-xs">
                <h3 className="text-lg font-black text-white uppercase flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#FFD400]" />
                  ZONAS DE ENTREGA Y ENVÍOS
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 space-y-1">
                    <span className="text-[#FFD400] font-bold block uppercase">SANTO TOMÉ / SANTA FE</span>
                    <p className="text-zinc-300">Entrega en persona en mano sin costo extra.</p>
                  </div>
                  <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 space-y-1">
                    <span className="text-[#FFD400] font-bold block uppercase">ROSARIO</span>
                    <p className="text-zinc-300">Posibilidad de coordinar entrega en punto acordado.</p>
                  </div>
                  <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 space-y-1">
                    <span className="text-[#FFD400] font-bold block uppercase">RESTO DEL PAÍS</span>
                    <p className="text-zinc-300">Envío por Correo Argentino. El envío se abona aparte y depende del destino.</p>
                  </div>
                </div>
              </div>
            )}

            {checkoutStep === 'catalogo' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {productsList.map((p) => (
                  <div key={p.id} className="bg-zinc-950 border border-zinc-800/90 rounded-3xl overflow-hidden p-5 flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-all">
                    <div className="space-y-3">
                      <div className="relative aspect-square bg-zinc-900 rounded-2xl overflow-hidden">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        <span className={`absolute top-3 left-3 text-[9px] font-black px-2.5 py-1 rounded-md border ${p.badgeColor}`}>
                          {p.badge}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase block tracking-wider">{p.line}</span>
                        <h3 className="text-base font-black text-white uppercase leading-tight mt-0.5">{p.name}</h3>
                        <p className="text-xs text-zinc-400 italic mt-0.5">{p.tagline}</p>
                      </div>

                      <p className="text-xs text-zinc-300 leading-relaxed">{p.description}</p>

                      <div className="pt-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1.5">Elegir Talle:</label>
                        <div className="flex flex-wrap gap-1.5">
                          {p.sizes.map((sz) => (
                            <button
                              key={sz}
                              onClick={() => handleSelectSize(p.id, sz)}
                              className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
                                selectedSizes[p.id] === sz 
                                  ? 'bg-[#FFD400] text-black border-[#FFD400] scale-105 font-black' 
                                  : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                              }`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-zinc-900 flex justify-between items-end text-xs">
                        <div>
                          <span className="text-zinc-500 block text-[10px] uppercase font-bold">Precio Total</span>
                          <span className="font-black text-white text-base font-mono">{formatCurrency(p.price)}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[#FFD400] font-bold block text-[10px] uppercase">Seña Requerida</span>
                          <span className="font-bold text-[#FFD400] text-sm font-mono">{formatCurrency(p.deposit)}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartReservation(p)}
                      className="w-full bg-[#FFD400] hover:bg-yellow-400 text-black font-black py-3.5 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#FFD400]/10 transition-all"
                    >
                      QUIERO MI PRENDA
                    </button>
                  </div>
                ))}
              </div>
            )}

            {checkoutStep === 'formulario' && selectedProduct && (
              <div className="bg-zinc-950 border border-zinc-800/90 p-6 sm:p-8 rounded-3xl space-y-6 max-w-xl mx-auto animate-fade-in">
                <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
                  <div>
                    <h3 className="text-lg font-black text-white uppercase">DATOS DE TU RESERVA</h3>
                    <p className="text-xs text-zinc-400">Completá tus datos para generar la orden en WhatsApp.</p>
                  </div>
                  <button onClick={() => setCheckoutStep('catalogo')} className="text-xs text-zinc-400 hover:text-white underline">
                    Volver
                  </button>
                </div>

                <form onSubmit={handleSendReservationWhatsapp} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-400 font-bold uppercase mb-1">Nombre *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Marcos"
                        value={buyerForm.nombre}
                        onChange={(e) => setBuyerForm({ ...buyerForm, nombre: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFD400]"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-400 font-bold uppercase mb-1">Apellido *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Pérez"
                        value={buyerForm.apellido}
                        onChange={(e) => setBuyerForm({ ...buyerForm, apellido: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFD400]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-400 font-bold uppercase mb-1">DNI *</label>
                      <input
                        type="text"
                        required
                        placeholder="Sin puntos"
                        value={buyerForm.dni}
                        onChange={(e) => setBuyerForm({ ...buyerForm, dni: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFD400]"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-400 font-bold uppercase mb-1">WhatsApp *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: 3421234567"
                        value={buyerForm.telefono}
                        onChange={(e) => setBuyerForm({ ...buyerForm, telefono: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFD400]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-bold uppercase mb-1">Zona de Entrega *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Santo Tomé / Rosario / Envíos por Correo Argentino"
                      value={buyerForm.localidad}
                      onChange={(e) => setBuyerForm({ ...buyerForm, localidad: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFD400]"
                    />
                  </div>

                  <div className="bg-black p-5 rounded-2xl border border-[#FFD400]/30 space-y-2.5 mt-4">
                    <span className="text-[#FFD400] font-black uppercase tracking-wider block text-xs">RESUMEN DE TU PREVENTA</span>
                    <div className="flex justify-between text-zinc-300">
                      <span>Producto:</span>
                      <span className="font-bold text-white">{selectedProduct.name}</span>
                    </div>
                    <div className="flex justify-between text-zinc-300">
                      <span>Talle:</span>
                      <span className="font-bold text-white">{selectedSizes[selectedProduct.id]}</span>
                    </div>
                    <div className="flex justify-between text-zinc-300">
                      <span>Precio Total:</span>
                      <span className="font-bold text-white font-mono">{formatCurrency(selectedProduct.price)}</span>
                    </div>
                    <div className="flex justify-between text-[#FFD400] font-bold">
                      <span>Seña Requerida:</span>
                      <span className="font-mono">{formatCurrency(selectedProduct.deposit)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Saldo contra entrega:</span>
                      <span className="font-mono">{formatCurrency(selectedProduct.balance)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-4 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10"
                  >
                    <MessageCircle className="w-4 h-4 fill-black" /> RESERVAR Y ENVIAR POR WHATSAPP
                  </button>
                </form>
              </div>
            )}

            {checkoutStep === 'transferencia' && (
              <div className="bg-zinc-950 border border-zinc-800 p-6 sm:p-8 rounded-3xl space-y-6 max-w-lg mx-auto text-center animate-fade-in">
                <span className="text-3xl block">🦁</span>
                <h3 className="text-2xl font-black text-white uppercase">RESERVA INICIADA</h3>
                <p className="text-xs text-zinc-300">
                  Le enviamos los datos a Joel por WhatsApp. Transferí la seña para ingresar tu orden en el lote de producción.
                </p>

                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl text-left space-y-3.5 text-xs">
                  <span className="text-[#FFD400] font-black uppercase tracking-wider block border-b border-zinc-800 pb-2">
                    DATOS OFICIALES PARA EL PAGO DE SEÑA
                  </span>
                  
                  <div className="flex justify-between items-center bg-black/60 p-3 rounded-xl border border-zinc-800">
                    <div>
                      <span className="text-zinc-500 block text-[10px] font-bold uppercase">Alias</span>
                      <span className="font-mono font-black text-[#FFD400] text-sm">{CONTACT_DATA.payment.alias}</span>
                    </div>
                    <button 
                      onClick={handleCopyAlias}
                      className="bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-lg transition-all flex items-center gap-1 text-[10px] font-bold uppercase"
                      title="Copiar Alias"
                    >
                      {copiedAlias ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedAlias ? '¡Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <span className="text-zinc-500 block text-[10px] font-bold uppercase">Titular</span>
                      <span className="font-bold text-white text-[11px] block">{CONTACT_DATA.payment.titular}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px] font-bold uppercase">Banco / Entidad</span>
                      <span className="font-bold text-white text-[11px] block">{CONTACT_DATA.payment.banco}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-zinc-400">El saldo restante se abona contra entrega en mano o envío por correo.</p>

                <button
                  onClick={() => {
                    const msg = "¡Hola Joel! Te adjunto el comprobante de pago de la seña para mi reserva.";
                    window.open(`https://wa.me/${CONTACT_DATA.whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
                  }}
                  className="w-full bg-[#FFD400] hover:bg-yellow-400 text-black font-black py-4 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#FFD400]/10"
                >
                  <Send className="w-4 h-4" /> ENVIAR COMPROBANTE DE SEÑA
                </button>
              </div>
            )}

          </div>
        )}

        {/* 3. SECCIÓN CONTENIDO */}
        {activeTab === 'contenido' && (
          <div className="space-y-8 max-w-3xl mx-auto animate-fade-in">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold tracking-widest text-[#FFD400] uppercase bg-[#FFD400]/10 border border-[#FFD400]/20 px-3.5 py-1 rounded-full">
                UNIVERSO DE CONTENIDO
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">SEGUÍ EL CAMINO</h2>
              <p className="text-xs text-zinc-400">
                «Acá vas a encontrar todo lo que vaya pasando mientras intento construir esto.»
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={CONTACT_DATA.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-zinc-950 border border-zinc-800 p-5 rounded-3xl flex items-center justify-between hover:border-[#FFD400] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-zinc-900 text-[#FFD400] rounded-2xl group-hover:bg-[#FFD400] group-hover:text-black transition-all">
                    <Instagram className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-sm font-black text-white uppercase block">INSTAGRAM</span>
                    <span className="text-xs text-zinc-400 font-mono">@joelbox_</span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-[#FFD400]" />
              </a>

              <a
                href={CONTACT_DATA.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-zinc-950 border border-zinc-800 p-5 rounded-3xl flex items-center justify-between hover:border-red-500 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-zinc-900 text-red-500 rounded-2xl group-hover:bg-red-500 group-hover:text-white transition-all">
                    <Youtube className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-sm font-black text-white uppercase block">YOUTUBE</span>
                    <span className="text-xs text-zinc-400 font-mono">Desde Adentro & Vlogs</span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-red-500" />
              </a>
            </div>

            <div className="space-y-6 pt-4">
              <h3 className="text-lg font-black text-white uppercase flex items-center gap-2">
                <Video className="w-5 h-5 text-[#FFD400]" />
                DESDE ADENTRO / MI PROCESO
              </h3>

              {cargandoDb ? (
                <div className="text-center text-xs text-zinc-500 py-12 font-mono">Cargando publicaciones...</div>
              ) : dbPosts.length > 0 ? (
                dbPosts.map((post) => {
                  const embedUrl = getEmbedYoutubeUrl(post.video_url);
                  const fecha = post.created_at ? new Date(post.created_at).toLocaleDateString('es-AR', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  }) : 'Reciente';

                  return (
                    <article key={post.id} className="bg-zinc-950 border border-zinc-800/90 rounded-3xl overflow-hidden shadow-2xl">
                      <div className="p-5 flex items-center justify-between border-b border-zinc-900">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#FFD400] text-black font-black flex items-center justify-center text-xs border border-black">
                            EL
                          </div>
                          <div>
                            <h4 className="text-xs font-black uppercase text-white">Joel Frutos — @joelbox_</h4>
                            <p className="text-[10px] text-zinc-500 uppercase font-mono">{fecha}</p>
                          </div>
                        </div>

                        {post.category && (
                          <span className="text-[9px] font-black uppercase tracking-wider bg-[#FFD400]/10 text-[#FFD400] border border-[#FFD400]/20 px-2.5 py-1 rounded-full">
                            {post.category}
                          </span>
                        )}
                      </div>

                      {embedUrl && (
                        <div className="relative aspect-video bg-zinc-900 border-b border-zinc-900 overflow-hidden">
                          <iframe
                            src={embedUrl}
                            title={post.title}
                            className="w-full h-full"
                            allowFullScreen
                          />
                        </div>
                      )}

                      <div className="p-6 space-y-2">
                        <h3 className="text-lg font-black uppercase text-white">{post.title}</h3>
                        {post.description && (
                          <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
                            {post.description}
                          </p>
                        )}
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 text-center space-y-2">
                  <span className="text-2xl block">🎬</span>
                  <h4 className="text-sm font-black text-white uppercase">Primeros episodios en producción</h4>
                  <p className="text-xs text-zinc-400">Seguí a @joelbox_ en Instagram para no perderte las novedades diarias.</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* 4. SECCIÓN ADMIN */}
        {activeTab === 'admin' && (
          <div className="animate-fade-in">
            <Admin />
          </div>
        )}

      </main>

      <footer className="border-t border-zinc-900 py-8 px-4 text-center text-xs text-zinc-600 space-y-2 mt-16">
        <p className="font-bold text-zinc-400 uppercase tracking-widest">EL LEÓN — JOEL FRUTOS (@joelbox_)</p>
        <p className="text-[10px]">Santo Tomé / Santa Fe / Rosario, Argentina • 2026</p>
      </footer>

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
      />

    </div>
  );
}
