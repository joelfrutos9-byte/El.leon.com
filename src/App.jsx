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
  Search,
  Timer,
  User,
  LogOut,
  ShieldCheck,
  Flag,
  Flame,
  Sparkle,
  Compass,
  Truck,
  Info,
  ExternalLink,
  ChevronDown,
  Check,
  AlertCircle,
  PackageCheck,
  CreditCard,
  ArrowRight,
  MapPin,
  Youtube,
  RefreshCw,
  Copy
} from 'lucide-react';
import { supabase } from './supabaseClient';
import Admin from './Admin';
import AuthModal from './componentes/AuthModal';

export default function App() {
  // Navegación Principal
  // 'inicio' | 'mision' | 'store' | 'contenido'
  const [activeTab, setActiveTab] = useState('inicio');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Subsecciones y filtros para León Store
  const [storeFilter, setStoreFilter] = useState('todos'); // 'todos' | 'original' | 'bolivia'
  const [storeSubTab, setStoreSubTab] = useState('catalogo'); // 'catalogo' | 'como-funciona' | 'envios'

  // Flujo de Reserva y Checkout de Preventa
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState({});
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [checkoutStep, setCheckoutStep] = useState('catalogo'); // 'catalogo' | 'formulario' | 'transferencia'

  // Estado de copiado al portapapeles
  const [copiedAlias, setCopiedAlias] = useState(false);

  // Formulario de Reserva (Requisitos mínimos)
  const [buyerForm, setBuyerForm] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    telefono: '',
    localidad: 'Santo Tomé / Santa Fe'
  });

  // Base de datos (Supabase)
  const [dbProducts, setDbProducts] = useState([]);
  const [dbPosts, setDbPosts] = useState([]);
  const [cargandoDb, setCargandoDb] = useState(true);

  // Sesión y Autenticación
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState('alumno');
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Truco Secreto Admin (3 clics en el logo "EL LEÓN")
  const [logoClicks, setLogoClicks] = useState(0);

  // Datos fijos de contacto, pago y redes
  const whatsappNumber = "5493425236731"; 
  const instagramUrl = "https://instagram.com/joelbox_";
  const youtubeUrl = "https://youtube.com/@joelbox_";

  const paymentDetails = {
    alias: "joelbox.mp",
    cbu: "0000003100096964147778",
    titular: "Joel Lautaro Frutos",
    cuit: "20-46132711-2",
    dni: "46.132.711",
    banco: "Mercado Pago"
  };

  // PRODUCTOS CONFIGURADOS CON DATOS EXACTOS
  const defaultProducts = [
    {
      id: 'original-01',
      name: 'REMERA EL LEÓN — LÍNEA ORIGINAL',
      tagline: 'LA PIEL PERMANENTE DE LA MARCA',
      line: 'LÍNEA ORIGINAL',
      colorName: 'NEGRO',
      isGreen: false,
      price: 34900,
      deposit: 20000,
      balance: 14900,
      image: '/1785149020942.png',
      badge: 'LÍNEA PERMANENTE',
      badgeColor: 'bg-[#FFD400] text-black font-black border-[#FFD400]',
      description: 'Corte oversize urbano cotidiano. Algodón pesado de alta resistencia. Representa la identidad viva de El León.',
      sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    {
      id: 'bolivia-remera',
      name: 'REMERA RUMBO A BOLIVIA — EDICIÓN ESPECIAL',
      tagline: 'EDICIÓN ESPECIAL OPERACIÓN SANTA CRUZ',
      line: 'CAMPAÑA BOLIVIA 2026',
      colorName: 'VERDE OLIVA',
      isGreen: true,
      price: 39900,
      deposit: 20000,
      balance: 19900,
      image: '/1785148963897.png',
      badge: 'EDICIÓN LIMITADA',
      badgeColor: 'bg-emerald-950 text-emerald-400 border-emerald-500/40',
      description: 'Edición especial vinculada a la Misión Santa Cruz 2026. Tejido técnico con estampa de expedición deportiva.',
      sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    {
      id: 'bolivia-hoodie',
      name: 'HOODIE RUMBO A BOLIVIA — EDICIÓN ESPECIAL',
      tagline: 'BUZO OVERSIZE HEAVY COTTON (DOS STAMPS)',
      line: 'CAMPAÑA BOLIVIA 2026',
      colorName: 'VERDE OLIVA',
      isGreen: true,
      price: 69900,
      deposit: 35000,
      balance: 34900,
      image: '/1785148947849.png',
      badge: 'EDICIÓN LIMITADA',
      badgeColor: 'bg-emerald-950 text-emerald-400 border-emerald-500/40',
      description: 'Buzo pesado con capucha reforzada y estampado táctico en espalda. Edición limitada de apoyo a la misión.',
      sizes: ['S', 'M', 'L', 'XL', 'XXL']
    }
  ];

  // Datos Misión Santa Cruz
  const objetivoEconomico = 3000000;
  const metaRemeras = 50;
  const remerasVendidas = 0;
  const metaBuzos = 25;
  const buzosVendidos = 0;
  const porcentajeMision = 18;

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

    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('admin') === 'true') {
      setActiveTab('admin');
    }

    fetchDatabaseData();

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('rol')
        .eq('id', userId)
        .single();

      if (!error && data && data.rol) setUserRole(data.rol);
    } catch (err) {
      console.log('Perfil no encontrado:', err.message);
    }
  };

  const fetchDatabaseData = async () => {
    setCargandoDb(true);
    try {
      const { data: postsData } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (postsData && postsData.length > 0) {
        setDbPosts(postsData);
      }

      const { data: prodsData } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (prodsData && prodsData.length > 0) {
        setDbProducts(prodsData);
      }
    } catch (err) {
      console.log("Carga diferida Supabase:", err.message);
    } finally {
      setCargandoDb(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

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

  const getEmbedYoutubeUrl = (url) => {
    if (!url) return null;
    if (url.indexOf("youtube.com/embed/") !== -1) return url;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2] && match[2].length === 11) {
      return "https://www.youtube.com/embed/" + match[2];
    }
    return null;
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val);
  };

  const handleSelectTab = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSize = (productId, size) => {
    setSelectedSize(prev => ({ ...prev, [productId]: size }));
  };

  const handleStartReservation = (product) => {
    const size = selectedSize[product.id];
    if (!size) {
      alert('Por favor elegí un talle antes de continuar con la reserva.');
      return;
    }
    setSelectedProduct(product);
    setCheckoutStep('formulario');
  };

  const handleCopyAlias = () => {
    navigator.clipboard.writeText(paymentDetails.alias);
    setCopiedAlias(true);
    setTimeout(() => setCopiedAlias(false), 2500);
  };

  const handleSendReservationWhatsapp = (e) => {
    e.preventDefault();
    if (!buyerForm.nombre || !buyerForm.apellido || !buyerForm.dni || !buyerForm.telefono) {
      alert('Por favor completá todos los datos obligatorios.');
      return;
    }

    const size = selectedSize[selectedProduct.id] || 'S';
    const totalCalc = selectedProduct.price * orderQuantity;
    const depositCalc = selectedProduct.deposit * orderQuantity;
    const balanceCalc = selectedProduct.balance * orderQuantity;
    const isGreenProd = selectedProduct.is_green || selectedProduct.isGreen;
    const coleccionLabel = isGreenProd ? "RUMBO A BOLIVIA 2026 (EDICIÓN ESPECIAL)" : "LÍNEA ORIGINAL";

    const lines = [
      "🦁 *NUEVA RESERVA PREVENTA — EL LEÓN*",
      "",
      "👤 *Cliente:* " + buyerForm.nombre + " " + buyerForm.apellido,
      "🪪 *DNI:* " + buyerForm.dni,
      "📱 *WhatsApp:* " + buyerForm.telefono,
      "📍 *Zona/Entrega:* " + buyerForm.localidad,
      "",
      "📦 *Producto:* " + selectedProduct.name,
      "📏 *Talle:* " + size,
      "🔢 *Cantidad:* " + orderQuantity,
      "",
      "💰 *Precio Total:* " + formatCurrency(totalCalc),
      "💳 *Seña requerida:* " + formatCurrency(depositCalc),
      "💵 *Saldo contra entrega:* " + formatCurrency(balanceCalc),
      "",
      "🏷️ *Colección:* " + coleccionLabel,
      "",
      "¡Hola Joel! Te envío la reserva desde la app para que me confirmes la recepción de la seña."
    ];

    const msg = lines.join("\n");
    window.open("https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(msg), '_blank');
    setCheckoutStep('transferencia');
  };

  const allProducts = dbProducts.length > 0 ? dbProducts : defaultProducts;
  const filteredProducts = storeFilter === 'todos' 
    ? allProducts 
    : storeFilter === 'original' 
      ? allProducts.filter(p => !p.is_green && !p.isGreen) 
      : allProducts.filter(p => p.is_green || p.isGreen);

  const navTabs = [
    { id: 'inicio', label: 'EL LEÓN', sub: 'Boxeo • Entrenamiento • Camino', icon: UserCheck },
    { id: 'mision', label: 'MISIÓN SANTA CRUZ', sub: 'Objetivo Bolivia 2026', icon: Flag, badge: 'DESAFÍO' },
    { id: 'store', label: 'LEÓN STORE', sub: 'Indumentaria & Preventa', icon: ShoppingBag, badge: 'PREVENTA' },
    { id: 'contenido', label: 'SEGUÍ EL CAMINO', sub: 'Videos, Vlogs & Redes', icon: Tv },
    ...(userRole === 'profesor' ? [{ id: 'admin', label: 'PANEL CREADOR', sub: 'Gestión & Productos', icon: ShieldCheck, badge: 'ADMIN' }] : [])
  ];

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
              href={instagramUrl}
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

        {/* 1. INICIO */}
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
                    onClick={() => handleSelectTab('mision')}
                    className="bg-[#FFD400] hover:bg-yellow-400 text-black font-black px-6 py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FFD400]/10"
                  >
                    <span>CONOCER EL PROYECTO</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button 
                    onClick={() => handleSelectTab('store')}
                    className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold border border-zinc-700/80 px-6 py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#FFD400]" />
                    <span>VER LEÓN STORE</span>
                  </button>
                </div>
              </div>
            </section>

            <section className="bg-zinc-950 border border-zinc-800/90 rounded-3xl p-6 sm:p-10 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD400]/5 rounded-full filter blur-2xl pointer-events-none"></div>

              <div className="space-y-2">
                <span className="text-[10px] font-black tracking-widest text-[#FFD400] uppercase bg-[#FFD400]/10 border border-[#FFD400]/20 px-3 py-1 rounded-full">
                  CAMPAÑA DE SEPTIEMBRE
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
                  ESTOY EMPEZANDO ALGO NUEVO.
                </h2>
              </div>

              <div className="bg-black/60 border border-zinc-800/80 p-6 rounded-2xl space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-2xl">
                <p className="text-white font-bold text-sm sm:text-base italic">
                  {"«No sé cómo va a salir. No sé hasta dónde puede llegar. Pero quiero intentarlo. Y si sale bien, con el apoyo de todos quizás podamos llegar a Bolivia.»"}
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

        {/* 2. PESTAÑA: MISIÓN ESPECIAL — SANTA CRUZ 2026 */}
        {activeTab === 'mision' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono font-black tracking-widest text-[#FFD400] uppercase bg-[#3f3a18] border border-[#FFD400]/40 px-4 py-1 rounded-full shadow-md">
                ⚡ MISIÓN ESPECIAL // EXPEDICIÓN TÁCTICA ⚡
              </span>
              <h2 className="text-3xl sm:text-6xl font-black text-white uppercase tracking-tighter drop-shadow-md">
                SANTA CRUZ <span className="text-[#FFD400]">2026</span>
              </h2>
              <p className="text-xs text-emerald-400 font-mono font-bold tracking-widest uppercase">
                [OBJETIVO EN CONSTRUCCIÓN // OPERACIÓN EN CURSO]
              </p>
            </div>

            <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-900/80 bg-[#121611] text-zinc-100 shadow-2xl p-6 sm:p-10">
              <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-900/20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#2a301e]/40 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-black/60 rounded-full blur-2xl pointer-events-none"></div>

              <div className="relative z-10 space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-emerald-900/50 pb-6">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 tracking-widest uppercase bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-1 rounded">
                      REGISTRO DE CAMPAÑA OFICIAL
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-2">
                      OBJETIVO ECONÓMICO GLOBAL
                    </h3>
                  </div>

                  <div className="bg-black/80 border-2 border-[#FFD400]/40 px-6 py-4 rounded-2xl text-right shadow-inner">
                    <span className="text-[10px] text-zinc-400 uppercase font-mono block">META ECONÓMICA DE REFERENCIA</span>
                    <span className="text-3xl sm:text-4xl font-mono font-black text-[#FFD400] tracking-tighter">
                      ${objetivoEconomico.toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>

                <div className="bg-black/70 border border-emerald-800/40 p-6 rounded-2xl space-y-3 text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium">
                  <p className="text-white font-bold text-sm sm:text-base uppercase tracking-wide">
                    «¿Podemos conseguirlo entre todos? La misión se financia con productos de El León.»
                  </p>
                  <p className="text-zinc-400">
                    No pedimos caridad ni donaciones. Estás comprando indumentaria de alta calidad con valor propio, y al mismo tiempo, formás parte directa de la expedición hacia Bolivia.
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-mono font-black text-[#FFD400] uppercase tracking-widest flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#FFD400]" />
                    PROGRESO DE UNIDADES VENDIDAS
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-black/60 border border-emerald-900/60 p-5 rounded-2xl flex justify-between items-center">
                      <div>
                        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">LÍNEA REMERAS</span>
                        <span className="text-xl font-black text-white uppercase mt-0.5 block">EDICIÓN BOLIVIA</span>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-2xl font-black text-[#FFD400]">{remerasVendidas}</span>
                        <span className="text-zinc-500 text-xs"> / {metaRemeras} META</span>
                      </div>
                    </div>

                    <div className="bg-black/60 border border-emerald-900/60 p-5 rounded-2xl flex justify-between items-center">
                      <div>
                        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">LÍNEA HOODIES / BUZOS</span>
                        <span className="text-xl font-black text-white uppercase mt-0.5 block">EDICIÓN ESPECIAL</span>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-2xl font-black text-[#FFD400]">{buzosVendidos}</span>
                        <span className="text-zinc-500 text-xs"> / {metaBuzos} META</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/80 border border-emerald-500/30 p-5 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-zinc-300 font-bold uppercase">ESTADO DE LA MISIÓN</span>
                      <span className="text-emerald-400 font-black text-sm">{porcentajeMision}% COMPLETADA</span>
                    </div>
                    <div className="w-full bg-zinc-900 h-4 rounded-full overflow-hidden p-0.5 border border-emerald-900">
                      <div 
                        className="bg-gradient-to-r from-emerald-600 via-[#FFD400] to-emerald-400 h-full rounded-full transition-all duration-700 shadow-md"
                        style={{ width: `${porcentajeMision}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 space-y-4">
                  <h4 className="text-sm font-black text-white uppercase flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#FFD400]" />
                    PRENDAS TÁCTICAS DISPONIBLES EN PREVENTA
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {allProducts.filter(p => p.is_green || p.isGreen).map((p) => (
                      <div key={p.id} className="bg-black/80 border border-emerald-800/50 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                        <div className="space-y-2">
                          <div className="relative aspect-square bg-zinc-950 rounded-xl overflow-hidden border border-emerald-900">
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                            <span className="absolute top-2 left-2 bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[9px] font-black px-2 py-0.5 rounded uppercase">
                              EDICIÓN BOLIVIA
                            </span>
                          </div>
                          <h5 className="text-sm font-black text-white uppercase">{p.name}</h5>
                          <p className="text-xs text-zinc-400">{p.tagline}</p>
                          <div className="flex justify-between text-xs font-bold pt-1 font-mono">
                            <span className="text-white">{formatCurrency(p.price)}</span>
                            <span className="text-[#FFD400]">Seña: {formatCurrency(p.deposit)}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            handleSelectTab('store');
                            handleStartReservation(p);
                          }}
                          className="w-full bg-[#FFD400] hover:bg-yellow-400 text-black font-black py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg transition-all"
                        >
                          ADQUIRIR Y SUMAR A LA MISIÓN
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* 3. STORE */}
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
              <div className="flex gap-2">
                <button
                  onClick={() => setStoreFilter('todos')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
                    storeFilter === 'todos' ? 'bg-[#FFD400] text-black' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setStoreFilter('original')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
                    storeFilter === 'original' ? 'bg-[#FFD400] text-black' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                  }`}
                >
                  Línea Original (Negra)
                </button>
                <button
                  onClick={() => setStoreFilter('bolivia')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
                    storeFilter === 'bolivia' ? 'bg-emerald-500 text-black' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                  }`}
                >
                  Edición Especial (Verde)
                </button>
              </div>

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
                      storeSubTab === sub.id ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
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
                {filteredProducts.map((p) => (
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
                                selectedSize[p.id] === sz 
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
                      <label className="block text-zinc-400 font-bold uppercase mb-1">Número de Documento (DNI) *</label>
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
                      <label className="block text-zinc-400 font-bold uppercase mb-1">Teléfono / WhatsApp *</label>
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
                    <label className="block text-zinc-400 font-bold uppercase mb-1">Localidad / Zona de Entrega *</label>
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
                      <span>Talle Seleccionado:</span>
                      <span className="font-bold text-white">{selectedSize[selectedProduct.id]}</span>
                    </div>
                    <div className="flex justify-between text-zinc-300">
                      <span>Precio total:</span>
                      <span className="font-bold text-white font-mono">{formatCurrency(selectedProduct.price * orderQuantity)}</span>
                    </div>
                    <div className="flex justify-between text-[#FFD400] font-bold">
                      <span>Seña a Transferir:</span>
                      <span className="font-mono">{formatCurrency(selectedProduct.deposit * orderQuantity)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Saldo contra entrega:</span>
                      <span className="font-mono">{formatCurrency(selectedProduct.balance * orderQuantity)}</span>
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
                      <span className="text-zinc-500 block text-[10px] font-bold uppercase">Alias Mercado Pago</span>
                      <span className="font-mono font-black text-[#FFD400] text-sm">{paymentDetails.alias}</span>
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
                      <span className="text-zinc-500 block text-[10px] font-bold uppercase">CBU</span>
                      <span className="font-mono text-white text-[11px] block select-all">{paymentDetails.cbu}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px] font-bold uppercase">Titular</span>
                      <span className="font-bold text-white text-[11px] block">{paymentDetails.titular}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px] font-bold uppercase">CUIT</span>
                      <span className="font-mono text-white text-[11px] block">{paymentDetails.cuit}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px] font-bold uppercase">DNI</span>
                      <span className="font-mono text-white text-[11px] block">{paymentDetails.dni}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-zinc-400">El saldo restante se abona contra entrega en mano o envío por correo.</p>

                <button
                  onClick={() => {
                    const msg = "¡Hola Joel! Te adjunto el comprobante de pago de la seña para mi reserva.";
                    window.open("https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(msg), '_blank');
                  }}
                  className="w-full bg-[#FFD400] hover:bg-yellow-400 text-black font-black py-4 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#FFD400]/10"
                >
                  <Send className="w-4 h-4" /> ENVIAR COMPROBANTE DE SEÑA
                </button>
              </div>
            )}

          </div>
        )}

        {/* 4. CONTENIDO */}
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
                href={instagramUrl}
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
                href={youtubeUrl}
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

                      {embedUrl ? (
                        <div className="relative aspect-video bg-zinc-900 border-b border-zinc-900 overflow-hidden">
                          <iframe
                            src={embedUrl}
                            title={post.title}
                            className="w-full h-full"
                            allowFullScreen
                          />
                        </div>
                      ) : null}

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
