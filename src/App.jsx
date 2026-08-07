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
  Search,
  Timer,
  User,
  LogOut,
  ShieldCheck,
  Flag,
  Flame,
  Sparkle
} from 'lucide-react';
import { supabase } from './supabaseClient';
import Admin from './Admin';
import CalculadoraNutricional from './CalculadoraNutricional';
import TabataTimer from './componentes/TabataTimer';
import AuthModal from './componentes/AuthModal';

export default function App() {
  // Pestañas Principales (5 Módulos Unificados)
  // 'el-leon' | 'operacion-santa-cruz' | 'leon-store' | 'entrenamiento' | 'actualidad'
  const [activeTab, setActiveTab] = useState('el-leon');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sub-pestañas internas de León Store
  const [storeSubTab, setStoreSubTab] = useState('catalogo'); // 'catalogo' | 'como-comprar' | 'faq' | 'manada'

  // Flujo de Reserva y Checkout
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState({});
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [checkoutStep, setCheckoutStep] = useState('catalogo'); // 'catalogo' | 'formulario' | 'transferencia'

  // Formulario de Reserva
  const [buyerForm, setBuyerForm] = useState({
    nombreApellido: '',
    dni: '',
    telefono: '',
    localidad: ''
  });

  // CMS y Backend
  const [noticiasCms, setNoticiasCms] = useState([]);
  const [cargandoNoticias, setCargandoNoticias] = useState(true);

  // Sesión y Autenticación
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState('alumno');
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Contenido dinámico de Supabase
  const [posts, setPosts] = useState([]);
  const [cargandoPosts, setCargandoPosts] = useState(true);

  // Portal de Alumnos por Clave
  const [studentKey, setStudentKey] = useState('');
  const [activeStudentKey, setActiveStudentKey] = useState('');
  const [studentPosts, setStudentPosts] = useState([]);
  const [searchingStudent, setSearchingStudent] = useState(false);
  const [studentSearched, setStudentSearched] = useState(false);

  // Formulario de Diagnóstico Completo / Rutina Personalizada
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

  // Truco Secreto Admin (3 clics en el logo "EL LEÓN")
  const [logoClicks, setLogoClicks] = useState(0);

  const whatsappNumber = "5493425236731"; // Placeholder del administrador
  const instagramUrl = "https://instagram.com/joelbox_";
  const whatsappChannelUrl = "https://whatsapp.com/channel/0029Vb8f4EU3QxS1ckJsS31A";

  const SANITY_PROJECT_ID = '837br3mo';
  const SANITY_DATASET = 'production';

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

    fetchPublicPosts();

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('rol')
        .eq('id', userId)
        .single();

      if (error) throw error;
      if (data && data.rol) setUserRole(data.rol);
    } catch (err) {
      console.log('Perfil no encontrado:', err.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

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
    } fontally {
      setCargandoPosts(false);
    }
  };

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

  const handleSendCustomForm = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.edad.trim()) {
      alert('Por favor completá tu nombre y edad.');
      return;
    }

    const msg = `🥊 *FICHA DE EVALUACIÓN FÍSICA COMPLETA* 🥊\n\n` +
      `👤 *Nombre:* ${formData.nombre}\n` +
      `🎂 *Edad:* ${formData.edad} años\n` +
      `📍 *Ciudad/Localidad:* ${formData.ciudad || 'No especificada'}\n\n` +
      `🎯 *Objetivo Principal:* ${formData.objetivo}\n` +
      `📊 *Nivel de Experiencia:* ${formData.nivel}\n` +
      `📅 *Disponibilidad Semanal:* ${formData.diasDisponibles}\n` +
      `🏋️ *Lugar de Entrenamiento:* ${formData.lugar}\n` +
      `⚠️ *Lesiones/Molestias:* ${formData.lesiones}\n\n` +
      `¡Hola Joel! Te envío mi ficha diagnóstica completada desde la App para consultar por mi plan a medida.`;

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // NAVEGACIÓN PRINCIPAL (REDUCIDA A 5 PESTAÑAS)
  const mainTabs = [
    { id: 'el-leon', label: 'EL LEÓN', sub: 'Joel Díaz & Filosofía', icon: UserCheck },
    { id: 'operacion-santa-cruz', label: 'OPERACIÓN SANTA CRUZ', sub: 'Rumbo a Bolivia 2026', icon: Zap, badge: 'MISIÓN' },
    { id: 'leon-store', label: 'LEÓN STORE', sub: 'Indumentaria & Merch', icon: ShoppingBag, badge: 'PREVENTA' },
    { id: 'entrenamiento', label: 'ENTRENAMIENTO', sub: 'Clases, Timer & Nutrición', icon: Dumbbell },
    { id: 'actualidad', label: 'ACTUALIDAD', sub: 'Noticias & Comunicados', icon: Newspaper },
    ...(userRole === 'profesor' ? [{ id: 'admin', label: 'PANEL CREADOR', sub: 'Gestión & Rutinas', icon: ShieldCheck, badge: 'ADMIN' }] : [])
  ];

  // PRODUCTOS Y PRECIOS EXACTOS SOLICITADOS
  const products = [
    {
      id: 'original-01',
      name: 'EL LEÓN — ORIGINAL 01',
      tagline: 'LA PRIMERA PIEL DEL LEÓN',
      line: 'LÍNEA ORIGINAL',
      colorName: 'NEGRO',
      isGreen: false,
      price: 34900,
      deposit: 17500,
      balance: 17400,
      image: '/1785149020942.png',
      badge: 'LÍNEA ORIGINAL',
      badgeColor: 'bg-zinc-800 text-yellow-400 border-yellow-500/30',
      description: 'Corte oversize urbano. Algodón pesado de alta resistencia diseñado para el día a día y el gimnasio.',
      sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    {
      id: 'bolivia-remera',
      name: 'RUMBO A BOLIVIA — REMERA',
      tagline: 'EDICIÓN OFICIAL OPERACIÓN SANTA CRUZ',
      line: 'CAMPAÑA BOLIVIA 2026',
      colorName: 'VERDE',
      isGreen: true,
      price: 39900,
      deposit: 20000,
      balance: 19900,
      image: '/1785148963897.png',
      badge: '100% A BENEFICIO',
      badgeColor: 'bg-emerald-950 text-emerald-400 border-emerald-500/40',
      description: '100% de lo recaudado con los productos verdes está destinado a financiar el viaje y la participación de El León en Bolivia 2026.',
      sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    {
      id: 'bolivia-hoodie',
      name: 'RUMBO A BOLIVIA — HOODIE',
      tagline: 'BUZO OVERSIZE EDICIÓN LIMITADA',
      line: 'CAMPAÑA BOLIVIA 2026',
      colorName: 'VERDE',
      isGreen: true,
      price: 69900,
      deposit: 35000,
      balance: 34900,
      image: '/1785148947849.png',
      badge: '100% A BENEFICIO',
      badgeColor: 'bg-emerald-950 text-emerald-400 border-emerald-500/40',
      description: 'Buzo pesado con dos estampados. El 100% de lo recaudado con los productos verdes está destinado a financiar el viaje y la participación de El León en Bolivia 2026.',
      sizes: ['S', 'M', 'L', 'XL', 'XXL']
    }
  ];

  // Datos Operación Santa Cruz
  const recaudado = 0; // Se mantiene editable
  const objetivo = 3000000;
  const porcentaje = Math.min(Math.round((recaudado / objetivo) * 100), 100);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val);
  };

  const handleSelectTab = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    if (id === 'entrenamiento') {
      fetchPublicPosts();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSize = (productId, size) => {
    setSelectedSize(prev => ({ ...prev, [productId]: size }));
  };

  // Iniciar proceso de reserva
  const handleStartReservation = (product) => {
    const size = selectedSize[product.id];
    if (!size) {
      alert('Por favor elegí un talle antes de continuar con la reserva.');
      return;
    }
    setSelectedProduct(product);
    setCheckoutStep('formulario');
  };

  // Enviar mensaje de reserva a WhatsApp
  const handleSendReservationWhatsapp = (e) => {
    e.preventDefault();
    if (!buyerForm.nombreApellido || !buyerForm.dni || !buyerForm.telefono || !buyerForm.localidad) {
      alert('Por favor completá todos los datos de contacto y entrega.');
      return;
    }

    const size = selectedSize[selectedProduct.id];
    const totalCalc = selectedProduct.price * orderQuantity;
    const depositCalc = selectedProduct.deposit * orderQuantity;
    const balanceCalc = selectedProduct.balance * orderQuantity;
    const coleccionLabel = selectedProduct.isGreen ? "RUMBO A BOLIVIA 2026" : "ORIGINAL";

    const msg = `🦁 *NUEVA RESERVA — EL LEÓN*\n\n` +
      `Nombre: ${buyerForm.nombreApellido}\n` +
      `DNI: ${buyerForm.dni}\n` +
      `WhatsApp: ${buyerForm.telefono}\n` +
      `Localidad/Zona: ${buyerForm.localidad}\n\n` +
      `Producto: ${selectedProduct.name}\n` +
      `Talle: ${size}\n` +
      `Cantidad: ${orderQuantity}\n\n` +
      `Precio total: ${formatCurrency(totalCalc)}\n` +
      `Seña: ${formatCurrency(depositCalc)}\n` +
      `Saldo contra entrega: ${formatCurrency(balanceCalc)}\n\n` +
      `Colección:\n${coleccionLabel}`;

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
    setCheckoutStep('transferencia');
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-yellow-500 selection:text-black pb-16">
      
      {/* HEADER PRINCIPAL */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-zinc-800 px-4 py-3">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          
          {/* LOGO EL LEÓN */}
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

          {/* ACCIONES DE SESIÓN Y REDES */}
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

            {/* INDICADOR DE SESIÓN */}
            {session ? (
              <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg border ${
                  userRole === 'profesor' ? 'bg-yellow-400 text-black border-yellow-400' : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                }`}>
                  {userRole === 'profesor' ? 'Entrenador' : 'Alumno'}
                </span>
                <button 
                  onClick={handleLogout}
                  className="p-1.5 text-zinc-400 hover:text-white transition-all"
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="bg-zinc-900 hover:bg-zinc-800 text-yellow-400 font-bold border border-zinc-700 text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all uppercase"
              >
                <User className="w-3.5 h-3.5" />
                <span>Ingresar</span>
              </button>
            )}

            {/* BOTÓN MENÚ MÓVIL */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-black px-3.5 py-1.5 rounded-xl text-xs uppercase tracking-wider transition-all"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              <span>MENÚ</span>
            </button>
          </div>
        </div>

        {/* NAVEGACIÓN PRINCIPAL: LAS 5 PESTAÑAS */}
        <div className="max-w-6xl mx-auto mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {mainTabs.map(item => {
            const IconComponent = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black uppercase whitespace-nowrap transition-all border ${
                  isSelected 
                    ? 'bg-yellow-400 text-black border-yellow-400 shadow-lg shadow-yellow-400/10' 
                    : 'bg-zinc-900/90 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
                }`}
              >
                <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : 'text-yellow-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                    isSelected ? 'bg-black text-yellow-400' : 'bg-yellow-400/10 text-yellow-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* MENÚ MÓVIL DESPLEGABLE */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-6 overflow-y-auto animate-fade-in">
          <div>
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4 mb-6">
              <div>
                <span className="text-xl font-black text-yellow-400 tracking-tighter block">EL LEÓN — NAVEGACIÓN</span>
                <span className="text-xs text-zinc-400">Las 5 Pestañas de la Aplicación</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 bg-zinc-900 border border-zinc-700 rounded-full text-zinc-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {mainTabs.map((item) => {
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
            <p className="text-xs text-zinc-400">Joel Díaz — Boxeador & Profesor • @joelbox_</p>
          </div>
        </div>
      )}

      {/* RENDERIZADO DE LAS 5 PESTAÑAS */}
      <main className="max-w-6xl mx-auto px-4 pt-6">

        {/* BANNER MODO ENTRENADOR */}
        {session && userRole === 'profesor' && activeTab !== 'admin' && (
          <div className="mb-6 bg-yellow-400/10 border border-yellow-400/30 p-4 rounded-2xl flex justify-between items-center gap-3">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-yellow-400 shrink-0" />
              <div>
                <h4 className="text-xs font-black text-yellow-400 uppercase">Modo Entrenador Activado</h4>
                <p className="text-[11px] text-zinc-400">Tenés acceso habilitado al Panel Creador para subir rutinas.</p>
              </div>
            </div>
            <button
              onClick={() => handleSelectTab('admin')}
              className="bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-black px-3 py-1.5 rounded-xl uppercase tracking-wider transition-all whitespace-nowrap"
            >
              Ir al Panel
            </button>
          </div>
        )}

        {/* =========================================================================
            1. PESTAÑA: EL LEÓN (IDENTIDAD, FILOSOFÍA Y MANIFIESTO DE JOEL)
           ========================================================================= */}
        {activeTab === 'el-leon' && (
          <div className="space-y-12 animate-fade-in max-w-4xl mx-auto">
            
            {/* CABECERA & FRASE PRINCIPAL */}
            <section className="relative rounded-3xl overflow-hidden border border-zinc-800 p-8 sm:p-12 bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-center space-y-6">
              <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-500/20 px-3.5 py-1.5 rounded-full text-yellow-400 text-xs font-black uppercase tracking-widest">
                <Sparkle className="w-3.5 h-3.5" /> MARCA, IDENTIDAD & FILOSOFÍA
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-none">
                "Soy un chico normal viviendo una vida de <span className="text-yellow-400">superhéroe</span>."
              </h1>

              {/* COMPARACIÓN CON SPIDER-MAN */}
              <div className="max-w-2xl mx-auto bg-black/60 border border-zinc-800 p-5 rounded-2xl text-left space-y-3">
                <span className="text-xs font-black text-yellow-400 uppercase tracking-widest block">🕷️ La Comparación con Spider-Man</span>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic">
                  "Si tuviera que compararme con un superhéroe, sería Spider-Man. Porque detrás del boxeador no hay un personaje perfecto: hay un chico común que decidió asumir una responsabilidad extraordinaria."
                </p>
              </div>

              <div className="flex flex-wrap gap-4 justify-center pt-2">
                <div className="bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-xl text-center">
                  <span className="text-2xl font-black text-yellow-400 block">+44</span>
                  <span className="text-[10px] text-zinc-400 uppercase font-bold">Peleas Amateur</span>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-xl text-center">
                  <span className="text-2xl font-black text-white block">Campeón</span>
                  <span className="text-[10px] text-zinc-400 uppercase font-bold">Regional y Provincial</span>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-xl text-center">
                  <span className="text-2xl font-black text-yellow-400 block">3er Puesto</span>
                  <span className="text-[10px] text-zinc-400 uppercase font-bold">Nacional</span>
                </div>
              </div>
            </section>

            {/* MÓDULOS DE CONTENIDO A - J */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* A. QUIÉN SOY */}
              <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl space-y-2">
                <h3 className="text-lg font-black text-yellow-400 uppercase flex items-center gap-2">
                  <User className="w-5 h-5" /> A. Quién Soy
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Soy Joel Díaz, boxeador amateur con más de 44 peleas amateur y tercer puesto a nivel nacional. Soy un chico normal viviendo una vida de superhéroe.
                </p>
              </div>

              {/* B. QUÉ SIGNIFICA EL LEÓN */}
              <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl space-y-2">
                <h3 className="text-lg font-black text-yellow-400 uppercase flex items-center gap-2">
                  <Flame className="w-5 h-5" /> B. Qué significa El León
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Es un apodo que representa de dónde vengo y hacia dónde voy.
                </p>
              </div>

              {/* C. MI CAMINO DEPORTIVO */}
              <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl space-y-3">
                <h3 className="text-lg font-black text-yellow-400 uppercase flex items-center gap-2">
                  <Trophy className="w-5 h-5" /> C. Mi Camino Deportivo
                </h3>
                <ul className="text-xs text-zinc-300 space-y-1.5 list-disc list-inside">
                  <li>Más de 44 peleas amateur</li>
                  <li>Campeón regional</li>
                  <li>Campeón provincial</li>
                  <li>Tercer puesto a nivel nacional</li>
                </ul>
              </div>

              {/* D. MIS LOGROS MÁS IMPORTANTES */}
              <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl space-y-3">
                <h3 className="text-lg font-black text-yellow-400 uppercase flex items-center gap-2">
                  <Award className="w-5 h-5" /> D. Logros Destacados
                </h3>
                <ul className="text-xs text-zinc-300 space-y-1.5 list-disc list-inside">
                  <li>Campeón regional</li>
                  <li>Campeón provincial</li>
                  <li>Tercer puesto a nivel nacional</li>
                  <li>Volver a pelear en Santa Fe y ganar el campeonato provincial</li>
                </ul>
              </div>

              {/* E. MI OBJETIVO */}
              <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl space-y-3 md:col-span-2">
                <h3 className="text-lg font-black text-yellow-400 uppercase flex items-center gap-2">
                  <Target className="w-5 h-5" /> E. Mi Objetivo
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-zinc-300">
                  <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                    <span className="font-bold text-white block mb-1">En el Ring:</span>
                    Pelear el Campeonato Verde y Oro organizado por la WBC y llegar a ser campeón indiscutido de mi categoría.
                  </div>
                  <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                    <span className="font-bold text-white block mb-1">A Futuro:</span>
                    Retirarme a vivir entre las sierras de Jujuy durante 6 meses y luego volver para abrir mi centro de entrenamiento inspirado en mi entrenador (IMACEN).
                  </div>
                </div>
              </div>

              {/* F. BOLIVIA */}
              <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl space-y-2">
                <h3 className="text-lg font-black text-yellow-400 uppercase flex items-center gap-2">
                  <Flag className="w-5 h-5" /> F. Bolivia
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Bolivia representa mi primera oportunidad de pelear internacionalmente. También representa experiencia, crecimiento y la posibilidad de ganar un título.
                </p>
              </div>

              {/* G. MI FILOSOFÍA */}
              <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl space-y-2">
                <h3 className="text-lg font-black text-yellow-400 uppercase flex items-center gap-2">
                  <Activity className="w-5 h-5" /> G. Mi Filosofía
                </h3>
                <div className="text-xs text-zinc-300 leading-relaxed space-y-2">
                  <p>"La disciplina, un equipo de trabajo y una familia son la receta para cualquier campeón."</p>
                  <p className="font-bold text-yellow-400">"Para mí la disciplina es un estilo de vida."</p>
                  <p>"Mi estilo no viene del sacrificio. Viene de divertirme haciendo lo que hago."</p>
                </div>
              </div>

              {/* H. QUIÉN SOY FUERA DEL RING */}
              <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl space-y-2">
                <h3 className="text-lg font-black text-yellow-400 uppercase flex items-center gap-2">
                  <UserCheck className="w-5 h-5" /> H. Fuera del Ring
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  "Solo soy un chico normal. Soy el profe buena onda. El pibe que va todos los días. El enano. Satanás para mi mamá. Todos ellos soy yo. Pero en definitiva, soy normal."
                </p>
              </div>

              {/* I. MÁS ALLÁ DEL BOXEO */}
              <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl space-y-2">
                <h3 className="text-lg font-black text-yellow-400 uppercase flex items-center gap-2">
                  <Tv className="w-5 h-5" /> I. Más allá del Boxeo
                </h3>
                <ul className="text-xs text-zinc-300 space-y-1 list-disc list-inside">
                  <li>Creación de contenido</li>
                  <li>Deseo de estudiar periodismo el año que viene</li>
                  <li>Afinidad por la cumbia como buen santafesino</li>
                  <li>Disfrute de la familia, los alumnos y los amigos</li>
                </ul>
              </div>

              {/* J. EL ORIGEN DE LA MARCA */}
              <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl space-y-2 md:col-span-2">
                <h3 className="text-lg font-black text-yellow-400 uppercase flex items-center gap-2">
                  <Sparkles className="w-5 h-5" /> J. El Origen de la Marca
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  "La marca empezó para ayudar a mis papás a juntar plata para Bolivia, pero creció y ahora quiero que todos sean parte de mi camino."
                </p>
              </div>

            </div>

            {/* K. MENSAJE FINAL */}
            <div className="bg-yellow-400 text-black p-8 rounded-3xl text-center space-y-2 shadow-2xl">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-900">K. MENSAJE FINAL</h3>
              <p className="text-lg sm:text-2xl font-black uppercase tracking-tight">
                "El León existe para que otros puedan sentirse parte de este camino."
              </p>
            </div>

          </div>
        )}

        {/* =========================================================================
            2. PESTAÑA: OPERACIÓN SANTA CRUZ (RUMBO A BOLIVIA 2026)
           ========================================================================= */}
        {activeTab === 'operacion-santa-cruz' && (
          <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
            
            <div className="text-center space-y-2">
              <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase bg-emerald-950 border border-emerald-500/30 px-3 py-1 rounded-full">
                CAMPAÑA INTERNACIONAL DE AUTOGESTIÓN
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
                OPERACIÓN SANTA CRUZ
              </h2>
              <p className="text-xs sm:text-sm text-yellow-400 font-bold uppercase tracking-widest">
                RUMBO A BOLIVIA 2026
              </p>
            </div>

            {/* TABLERO DE OBJETIVO Y PROGRESO */}
            <div className="bg-zinc-950 border border-zinc-800 p-6 sm:p-8 rounded-3xl space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-xl font-black text-white uppercase">Objetivo Total de Financiación</h3>
                  <p className="text-xs text-zinc-400">Fondos destinados a pasajes, logística y campamento deportivo.</p>
                </div>

                <div className="sm:text-right">
                  <span className="text-[10px] text-zinc-400 uppercase font-mono block">Progreso actual</span>
                  <span className="text-2xl sm:text-3xl font-mono font-bold text-yellow-400">
                    ${recaudado.toLocaleString('es-AR')} <span className="text-xs text-zinc-500">/ ${objetivo.toLocaleString('es-AR')}</span>
                  </span>
                </div>
              </div>

              {/* Barra de Progreso */}
              <div className="w-full bg-zinc-900 h-5 rounded-full overflow-hidden p-0.5 border border-zinc-800">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-yellow-400 h-full rounded-full transition-all duration-700"
                  style={{ width: `${porcentaje}%` }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-900 text-xs">
                <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                  <span className="font-bold text-yellow-400 block uppercase mb-1">Misión</span>
                  Viajar a Bolivia en óptimas condiciones para competir y traer el título.
                </div>
                <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                  <span className="font-bold text-emerald-400 block uppercase mb-1">Cómo Colaborar</span>
                  Comprando indumentaria verde o sumándote a las acciones colectivas.
                </div>
                <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                  <span className="font-bold text-white block uppercase mb-1">Sponsors / Aliados</span>
                  Acompañamiento de marcas que impulsan el deporte santafesino.
                </div>
              </div>
            </div>

            {/* FRASE OBLIGATORIA PARA PRODUCTOS VERDES */}
            <div className="bg-emerald-950/80 border border-emerald-500/50 p-6 rounded-2xl text-center space-y-2">
              <span className="text-xs font-black text-emerald-400 uppercase tracking-widest block">COMPROMISO CON LA MISIÓN</span>
              <p className="text-base sm:text-xl font-black text-white uppercase">
                "El 100% de lo recaudado con los productos verdes está destinado a financiar el viaje y la participación de El León en Bolivia 2026."
              </p>
            </div>

            {/* PRODUCTOS VERDES ASOCIADOS */}
            <div className="space-y-4">
              <h3 className="text-xl font-black text-white uppercase flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-400" />
                Indumentaria Oficial de la Campaña
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.filter(p => p.isGreen).map((p) => (
                  <div key={p.id} className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden p-5 flex flex-col justify-between space-y-4 hover:border-emerald-500/50 transition-all">
                    <div className="space-y-3">
                      <div className="relative aspect-square bg-zinc-900 rounded-xl overflow-hidden">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[10px] font-black px-2 py-0.5 rounded">
                          100% A BENEFICIO
                        </span>
                      </div>

                      <div>
                        <h4 className="text-lg font-black text-white uppercase">{p.name}</h4>
                        <p className="text-xs text-zinc-400 italic">{p.tagline}</p>
                      </div>

                      <p className="text-xs text-zinc-300 leading-relaxed">{p.description}</p>

                      <div className="pt-2">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Elegir Talle:</label>
                        <div className="flex gap-1.5">
                          {p.sizes.map((sz) => (
                            <button
                              key={sz}
                              onClick={() => handleSelectSize(p.id, sz)}
                              className={`px-3 py-1 text-xs font-bold rounded border ${
                                selectedSize[p.id] === sz ? 'bg-emerald-400 text-black border-emerald-400' : 'bg-zinc-900 text-zinc-300 border-zinc-800'
                              }`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-zinc-900 flex justify-between items-end text-xs">
                        <div>
                          <span className="text-zinc-500 block">Total</span>
                          <span className="font-black text-white text-base">{formatCurrency(p.price)}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-emerald-400 font-bold block">Seña (50%)</span>
                          <span className="font-bold text-emerald-400 text-sm">{formatCurrency(p.deposit)}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        handleSelectTab('leon-store');
                        handleStartReservation(p);
                      }}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                      Reservar Producto Verde
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            3. PESTAÑA: LEÓN STORE (VENTA POR PREVENTA)
           ========================================================================= */}
        {activeTab === 'leon-store' && (
          <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
            
            <div className="text-center space-y-2">
              <span className="text-xs font-bold tracking-widest text-yellow-400 uppercase">TIENDA OFICIAL</span>
              <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">LEÓN STORE</h2>
              <p className="text-xs text-zinc-400">Venta exclusiva por sistema de PREVENTA y confección bajo pedido.</p>
            </div>

            {/* SUB-NAVEGACIÓN INTERNA STORE */}
            <div className="flex justify-center gap-2 border-b border-zinc-800 pb-3 overflow-x-auto scrollbar-none">
              {[
                { id: 'catalogo', label: 'Catálogo' },
                { id: 'como-comprar', label: 'Cómo Comprar' },
                { id: 'faq', label: 'Preguntas Frecuentes' },
                { id: 'manada', label: 'La Manada' }
              ].map(st => (
                <button
                  key={st.id}
                  onClick={() => setStoreSubTab(st.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                    storeSubTab === st.id ? 'bg-yellow-400 text-black' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* VISTA 1: CATÁLOGO DE PRODUCTOS */}
            {storeSubTab === 'catalogo' && checkoutStep === 'catalogo' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.map((p) => (
                  <div key={p.id} className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden p-5 flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-all">
                    <div className="space-y-3">
                      <div className="relative aspect-square bg-zinc-900 rounded-xl overflow-hidden">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        <span className={`absolute top-2 left-2 text-[10px] font-black px-2 py-0.5 rounded border ${p.badgeColor}`}>
                          {p.badge}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase block">{p.line}</span>
                        <h3 className="text-lg font-black text-white uppercase">{p.name}</h3>
                        <p className="text-xs text-zinc-400 italic">{p.tagline}</p>
                      </div>

                      <p className="text-xs text-zinc-300 leading-relaxed">{p.description}</p>

                      <div className="pt-2">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Elegir Talle:</label>
                        <div className="flex flex-wrap gap-1">
                          {p.sizes.map((sz) => (
                            <button
                              key={sz}
                              onClick={() => handleSelectSize(p.id, sz)}
                              className={`px-2.5 py-1 text-xs font-bold rounded border ${
                                selectedSize[p.id] === sz ? 'bg-yellow-400 text-black border-yellow-400' : 'bg-zinc-900 text-zinc-300 border-zinc-800'
                              }`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-zinc-900 flex justify-between items-end text-xs">
                        <div>
                          <span className="text-zinc-500 block">Precio Total</span>
                          <span className="font-black text-white text-base">{formatCurrency(p.price)}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-yellow-400 font-bold block">Seña (50%)</span>
                          <span className="font-bold text-yellow-400 text-sm">{formatCurrency(p.deposit)}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartReservation(p)}
                      className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                      Reservar Ahora
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* FORMULARIO DE RESERVA DIRECTO (SIN LOGIN) */}
            {checkoutStep === 'formulario' && selectedProduct && (
              <div className="bg-zinc-950 border border-zinc-800 p-6 sm:p-8 rounded-3xl space-y-6 max-w-2xl mx-auto">
                <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
                  <h3 className="text-xl font-black text-white uppercase">FORMULARIO DE RESERVA</h3>
                  <button onClick={() => setCheckoutStep('catalogo')} className="text-xs text-zinc-400 hover:text-white underline">
                    Volver al catálogo
                  </button>
                </div>

                <form onSubmit={handleSendReservationWhatsapp} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-zinc-400 font-bold uppercase mb-1">Nombre y Apellido *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Marcos Pérez"
                      value={buyerForm.nombreApellido}
                      onChange={(e) => setBuyerForm({ ...buyerForm, nombreApellido: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400"
                    />
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
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-400 font-bold uppercase mb-1">Número de Teléfono / WhatsApp *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: 3421234567"
                        value={buyerForm.telefono}
                        onChange={(e) => setBuyerForm({ ...buyerForm, telefono: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-400 font-bold uppercase mb-1">Cantidad *</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={orderQuantity}
                        onChange={(e) => setOrderQuantity(parseInt(e.target.value) || 1)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-400 font-bold uppercase mb-1">Localidad / Zona de Entrega *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Santo Tomé / Rosario"
                        value={buyerForm.localidad}
                        onChange={(e) => setBuyerForm({ ...buyerForm, localidad: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400"
                      />
                    </div>
                  </div>

                  {/* RESUMEN DE TU RESERVA AUTOMÁTICO */}
                  <div className="bg-black p-5 rounded-2xl border border-yellow-500/30 space-y-2 mt-4">
                    <span className="text-yellow-400 font-black uppercase tracking-wider block">RESUMEN DE TU RESERVA</span>
                    <div className="flex justify-between text-zinc-300">
                      <span>Producto:</span>
                      <span className="font-bold text-white">{selectedProduct.name}</span>
                    </div>
                    <div className="flex justify-between text-zinc-300">
                      <span>Talle:</span>
                      <span className="font-bold text-white">{selectedSize[selectedProduct.id]}</span>
                    </div>
                    <div className="flex justify-between text-zinc-300">
                      <span>Cantidad:</span>
                      <span className="font-bold text-white">{orderQuantity}</span>
                    </div>
                    <div className="flex justify-between text-zinc-300">
                      <span>Precio total:</span>
                      <span className="font-bold text-white">{formatCurrency(selectedProduct.price * orderQuantity)}</span>
                    </div>
                    <div className="flex justify-between text-yellow-400 font-bold">
                      <span>Seña:</span>
                      <span>{formatCurrency(selectedProduct.deposit * orderQuantity)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Saldo contra entrega:</span>
                      <span>{formatCurrency(selectedProduct.balance * orderQuantity)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-black" /> ENVIAR RESERVA POR WHATSAPP
                  </button>
                </form>
              </div>
            )}

            {/* PAGO DE SEÑA Y DATOS DE TRANSFERENCIA */}
            {checkoutStep === 'transferencia' && (
              <div className="bg-zinc-950 border border-zinc-800 p-6 sm:p-8 rounded-3xl space-y-6 max-w-xl mx-auto text-center animate-fade-in">
                <span className="text-3xl block">🦁</span>
                <h3 className="text-2xl font-black text-white uppercase">¡RESERVA PREPARADA! 🦁</h3>
                <p className="text-xs text-zinc-300">
                  Ahora transferí la seña para confirmar tu pedido.
                </p>

                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl text-left space-y-3 text-xs">
                  <span className="text-yellow-400 font-black uppercase tracking-wider block">DATOS DE TRANSFERENCIA</span>
                  <div>
                    <span className="text-zinc-500 block">Alias:</span>
                    <span className="font-mono font-bold text-white text-sm">[COMPLETAR]</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Titular:</span>
                    <span className="font-bold text-white">[COMPLETAR]</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">DNI/CUIT:</span>
                    <span className="font-mono text-white">[COMPLETAR]</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-400">El saldo restante se abona contra entrega.</p>

                <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 text-xs text-zinc-400">
                  <span className="text-yellow-400 font-bold block mb-1">BIENVENIDO A LA MANADA 🦁</span>
                  Tu compra es solo el comienzo. Como parte de la comunidad de El León podés seguir todo lo que viene.
                </div>

                <button
                  onClick={() => {
                    const msg = `¡Hola Joel! Te adjunto el comprobante de pago de la seña para mi reserva.`;
                    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
                  }}
                  className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black py-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> ENVIAR COMPROBANTE
                </button>
              </div>
            )}

            {/* VISTA 2: CÓMO FUNCIONA */}
            {storeSubTab === 'como-comprar' && (
              <div className="bg-zinc-950 border border-zinc-800 p-6 sm:p-8 rounded-3xl space-y-6">
                <h3 className="text-xl font-black text-white uppercase text-center">CÓMO FUNCIONA LA PREVENTA</h3>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-center text-xs">
                  {[
                    { step: '1', title: 'Elegís' },
                    { step: '2', title: 'Reservás' },
                    { step: '3', title: 'Transferís' },
                    { step: '4', title: 'Producimos' },
                    { step: '5', title: 'Te avisamos' },
                    { step: '6', title: 'Entregamos' }
                  ].map((st) => (
                    <div key={st.step} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-1">
                      <span className="text-yellow-400 font-black text-lg block">{st.step}</span>
                      <span className="font-bold text-white uppercase text-[11px]">{st.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VISTA 3: PREGUNTAS FRECUENTES */}
            {storeSubTab === 'faq' && (
              <div className="space-y-4">
                <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl space-y-1">
                  <h4 className="text-sm font-black text-yellow-400 uppercase">¿Por qué trabajamos por PREVENTA?</h4>
                  <p className="text-xs text-zinc-300">Producimos bajo pedido para asegurar los talles exactos y destinar los fondos directamente al financiamiento deportivo.</p>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-xl space-y-1">
                  <h4 className="text-sm font-black text-yellow-400 uppercase">¿Cómo abono el saldo restante?</h4>
                  <p className="text-xs text-zinc-300">El saldo contra entrega se liquida en mano al recibir tu prenda.</p>
                </div>
              </div>
            )}

            {/* VISTA 4: LA MANADA */}
            {storeSubTab === 'manada' && (
              <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-yellow-500/30 p-8 rounded-3xl text-center space-y-4">
                <span className="text-3xl block">🦁</span>
                <h3 className="text-2xl font-black text-white uppercase">LA MANADA</h3>
                <p className="text-xs text-zinc-300 max-w-md mx-auto">
                  "No somos clientes. Somos La Manada. Un espacio para seguir el camino de El León, conocer novedades, preventas, sorteos, contenido exclusivo y acompañar la Operación Santa Cruz."
                </p>
                <a
                  href={whatsappChannelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black px-6 py-3 rounded-xl text-xs uppercase"
                >
                  UNIRME A LA MANADA
                </a>
              </div>
            )}

          </div>
        )}

        {/* =========================================================================
            4. PESTAÑA: ENTRENAMIENTO (CLASES, RUTINAS Y TIMER BOXEO)
           ========================================================================= */}
        {activeTab === 'entrenamiento' && (
          <div className="space-y-10 animate-fade-in max-w-4xl mx-auto">
            
            <div className="text-center space-y-2">
              <span className="text-xs font-bold tracking-widest text-yellow-400 uppercase">CENTRO DE ENTRENAMIENTO</span>
              <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">ENTRENAMIENTO</h2>
            </div>

            {/* TIMER DE BOXEO REUTILIZADO */}
            <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-3xl space-y-4">
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-yellow-400" />
                <h3 className="text-xl font-black text-white uppercase">Timer Boxeo (Reloj de Ring)</h3>
              </div>
              <TabataTimer />
            </div>

            {/* CALCULADORA NUTRICIONAL */}
            <div>
              <CalculadoraNutricional />
            </div>

            {/* PORTAL PRIVADO DE ALUMNO POR CLAVE */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-yellow-400" />
                <h3 className="text-xl font-black text-white uppercase">Acceso Alumnos — Clave Personal</h3>
              </div>
              <p className="text-xs text-zinc-400">
                Ingresá la clave que te dio Joel para ver tu rutina asignada:
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
                  className="bg-yellow-400 hover:bg-yellow-300 text-black font-black px-5 py-2.5 rounded-xl text-xs uppercase"
                >
                  {searchingStudent ? '...' : 'Ingresar'}
                </button>
              </form>

              {studentSearched && (
                <div className="pt-4 border-t border-zinc-900">
                  {studentPosts.length > 0 ? (
                    <div className="space-y-4">
                      {studentPosts.map((post) => (
                        <div key={post.id} className="bg-zinc-900 border border-yellow-500/50 rounded-2xl p-5 space-y-3">
                          <h4 className="text-lg font-black text-white uppercase">{post.title}</h4>
                          <p className="text-xs text-zinc-300 whitespace-pre-line bg-black/50 p-4 rounded-xl">{post.description}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-red-400">No encontramos ninguna rutina asignada a la clave "{activeStudentKey}".</div>
                  )}
                </div>
              )}
            </div>

            {/* EVALUACIÓN FÍSICA PERSONALIZADA COMPLETA */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-zinc-900 pb-4">
                <div>
                  <h3 className="text-xl font-black text-white uppercase">PEDÍ TU PLAN PERSONALIZADO</h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Completá tu ficha física para recibir un programa técnico y físico adecuado a tus metas.
                  </p>
                </div>
                <button
                  onClick={() => setShowCustomForm(!showCustomForm)}
                  className="bg-yellow-400 hover:bg-yellow-300 text-black font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all"
                >
                  {showCustomForm ? 'CERRAR FICHA' : 'COMPLETAR FICHA'}
                </button>
              </div>

              {showCustomForm && (
                <form onSubmit={handleSendCustomForm} className="space-y-4 text-xs animate-fade-in">
                  
                  {/* FILA 1: DATOS PERSONALES */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-zinc-400 uppercase mb-1">Tu Nombre *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Marcos Pérez"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-zinc-400 uppercase mb-1">Edad *</label>
                      <input
                        type="number"
                        required
                        placeholder="Ej: 24"
                        value={formData.edad}
                        onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-zinc-400 uppercase mb-1">Ciudad / Localidad</label>
                      <input
                        type="text"
                        placeholder="Ej: Santo Tomé / Rosario"
                        value={formData.ciudad}
                        onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400"
                      />
                    </div>
                  </div>

                  {/* FILA 2: OBJETIVO Y NIVEL */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-zinc-400 uppercase mb-1">Objetivo Principal *</label>
                      <select
                        value={formData.objetivo}
                        onChange={(e) => setFormData({ ...formData, objetivo: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400"
                      >
                        <option value="Aprender Boxeo y Técnica">Aprender Boxeo y Técnica</option>
                        <option value="Bajar de peso y quemar grasa">Bajar de peso y quemar grasa</option>
                        <option value="Ganar masa muscular y fuerza">Ganar masa muscular y fuerza</option>
                        <option value="Preparación Física para Combate">Preparación Física para Combate</option>
                        <option value="Acondicionamiento físico general">Acondicionamiento físico general</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-zinc-400 uppercase mb-1">Nivel de Experiencia *</label>
                      <select
                        value={formData.nivel}
                        onChange={(e) => setFormData({ ...formData, nivel: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400"
                      >
                        <option value="Principiante (Desde cero)">Principiante (Desde cero)</option>
                        <option value="Intermedio (Ya entrené antes)">Intermedio (Ya entrené antes)</option>
                        <option value="Avanzado (Boxeador / Atleta activo)">Avanzado (Boxeador / Atleta activo)</option>
                      </select>
                    </div>
                  </div>

                  {/* FILA 3: DISPONIBILIDAD Y LUGAR */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-zinc-400 uppercase mb-1">Disponibilidad Semanal *</label>
                      <select
                        value={formData.diasDisponibles}
                        onChange={(e) => setFormData({ ...formData, diasDisponibles: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400"
                      >
                        <option value="2 días por semana">2 días por semana</option>
                        <option value="3 días por semana">3 días por semana</option>
                        <option value="4 a 5 días por semana">4 a 5 días por semana</option>
                        <option value="Todos los días">Todos los días</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-zinc-400 uppercase mb-1">¿Dónde vas a entrenar? *</label>
                      <select
                        value={formData.lugar}
                        onChange={(e) => setFormData({ ...formData, lugar: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400"
                      >
                        <option value="En gimnasio tradicional">En gimnasio tradicional</option>
                        <option value="En casa (sin equipamiento)">En casa (sin equipamiento)</option>
                        <option value="En casa (con bolsa / mancuernas)">En casa (con bolsa / mancuernas)</option>
                        <option value="Al aire libre / Parque">Al aire libre / Parque</option>
                      </select>
                    </div>
                  </div>

                  {/* FILA 4: LESIONES */}
                  <div>
                    <label className="block font-bold text-zinc-400 uppercase mb-1">Lesiones o Molestias Físicas</label>
                    <input
                      type="text"
                      placeholder="Ej: Dolor leve en rodilla derecha, hombro, etc. (O escribí 'Ninguna')"
                      value={formData.lesiones}
                      onChange={(e) => setFormData({ ...formData, lesiones: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all mt-2"
                  >
                    <Send className="w-4 h-4 fill-black" />
                    ENVIAR FICHA POR WHATSAPP A JOEL
                  </button>
                </form>
              )}
            </div>

          </div>
        )}

        {/* =========================================================================
            5. PESTAÑA: ACTUALIDAD (NOTICIAS Y COMUNICADOS)
           ========================================================================= */}
        {activeTab === 'actualidad' && (
          <div className="space-y-8 max-w-3xl mx-auto animate-fade-in">
            
            <div className="text-center space-y-2">
              <span className="text-xs font-bold tracking-widest text-yellow-400 uppercase">MEDIO OFICIAL</span>
              <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">ACTUALIDAD</h2>
              <p className="text-xs text-zinc-400">Noticias, comunicados y entrevistas del camino deportivo.</p>
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
                  <h3 className="text-xl font-black text-white uppercase">Apertura Oficial de la Operación Santa Cruz</h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Comienza la preventa oficial para financiar el viaje y la logística del equipo en Bolivia 2026.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* PESTAÑA OCULTA ADMIN */}
        {activeTab === 'admin' && (
          <div className="animate-fade-in">
            <Admin />
          </div>
        )}

      </main>

      {/* FOOTER GENERAL */}
      <footer className="border-t border-zinc-900 py-8 px-4 text-center text-xs text-zinc-600 space-y-2 mt-16">
        <p className="font-bold text-zinc-400">EL LEÓN — JOEL DIAZ (@joelbox_)</p>
        <p>Santo Tomé / Rosario, Argentina • 2026</p>
      </footer>

      {/* MODAL AUTH */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
      />

    </div>
  );
}

