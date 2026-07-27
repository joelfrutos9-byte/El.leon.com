import React, { useState } from 'react';
import { 
  X, 
  Menu, 
  Flame, 
  ChevronRight, 
  Instagram, 
  MessageCircle, 
  User, 
  ArrowRight,
  Info
} from 'lucide-react';

// ========================================
// CONFIGURACIÓN GLOBAL Y PLACEHOLDERS
// ========================================
const CONFIG = {
  instagramUser: 'joelbox_',
  instagramUrl: 'https://www.instagram.com/joelbox_/',
  whatsappNumber: '3425236731', // Tu WhatsApp configurado
  whatsappDisplay: '+54 9 342 523-6731',
  linkLaManada: '[LINK DE WHATSAPP DE LA MANADA]', // Reemplazar cuando crees el grupo
  bankData: {
    alias: '[COMPLETAR ALIAS]',
    titular: '[COMPLETAR TITULAR]',
    cuit: '[COMPLETAR DNI/CUIT]'
  }
};

// ========================================
// CATÁLOGO OFICIAL V2 — PREVENTA
// ========================================
const PRODUCTS = [
  {
    id: 'prod-original-01',
    name: 'EL LEÓN — ORIGINAL 01',
    line: 'ORIGINAL',
    category: 'LÍNEA 01 — ORIGINAL',
    badge: 'PREVENTA',
    color: 'Negro Profundo',
    tagline: 'LA PRIMERA PIEL DEL LEÓN.',
    description: 'La prenda madre de EL LEÓN. Representa la mentalidad y la identidad de la marca independientemente de cualquier campaña.',
    price: 34900,
    deposit: 17500,
    balance: 17400,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: ['1000375045.png'],
    isFundraiser: false
  },
  {
    id: 'prod-bolivia-remera',
    name: 'RUMBO A BOLIVIA — REMERA',
    line: 'RUMBO A BOLIVIA 2026',
    category: 'LÍNEA 02 — OPERACIÓN SANTA CRUZ',
    badge: 'PREVENTA',
    color: 'Verde Botella',
    tagline: 'EDICIÓN ESPECIAL INTERNACIONAL',
    description: 'Remera oficial del proyecto Operación Santa Cruz. Diseño técnico conmemorativo.',
    price: 39900,
    deposit: 20000,
    balance: 19900,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: ['1000375043.png'],
    isFundraiser: true
  },
  {
    id: 'prod-bolivia-hoodie',
    name: 'RUMBO A BOLIVIA — HOODIE',
    line: 'RUMBO A BOLIVIA 2026',
    category: 'LÍNEA 02 — OPERACIÓN SANTA CRUZ',
    badge: 'PREVENTA',
    color: 'Verde Botella',
    tagline: 'BUZO PESADO DE ALGODÓN CON FRIZA',
    description: 'Buzo con capucha de máxima densidad. Incluye doble estampado documental de la delegación en Santa Cruz de la Sierra.',
    price: 69900,
    deposit: 35000,
    balance: 34900,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: ['1000375042.png'],
    isFundraiser: true
  }
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Estado del flujo de Reserva
  const [reservationModal, setReservationModal] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    nombre: '',
    dni: '',
    telefono: '',
    localidad: ''
  });
  const [activeStep, setActiveStep] = useState(1);

  const handleOpenReservation = (prod) => {
    setReservationModal(prod);
    setSelectedSize('M');
    setQuantity(1);
    setActiveStep(1);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const totalAmount = reservationModal ? reservationModal.price * quantity : 0;
  const totalDeposit = reservationModal ? reservationModal.deposit * quantity : 0;
  const totalBalance = reservationModal ? reservationModal.balance * quantity : 0;

  const handleSendWhatsAppReservation = (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.telefono || !formData.dni) {
      alert('Por favor completá los campos obligatorios.');
      return;
    }

    const lineText = reservationModal.isFundraiser ? 'RUMBO A BOLIVIA 2026' : 'ORIGINAL';

    const message = 
`🦁 NUEVA RESERVA — EL LEÓN

Nombre: ${formData.nombre}
DNI: ${formData.dni}
Teléfono: ${formData.telefono}
Localidad/Zona: ${formData.localidad || 'No especificada'}

Producto: ${reservationModal.name}
Talle: ${selectedSize}
Cantidad: ${quantity}

Precio total: $${totalAmount.toLocaleString()}
Seña: $${totalDeposit.toLocaleString()}
Saldo contra entrega: $${totalBalance.toLocaleString()}

Colección:
${lineText}`;

    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setActiveStep(2);
  };

  return (
    <div className="min-h-screen bg-black text-stone-100 font-sans selection:bg-[#ffde00] selection:text-black">
      
      {/* BANNER SUPERIOR */}
      <div className="bg-[#ffde00] text-black font-black text-[11px] uppercase tracking-widest py-2 px-4 text-center flex items-center justify-center gap-2">
        <Flame className="w-3.5 h-3.5 fill-black shrink-0" />
        <span>SISTEMA DE PREVENTA OFICIAL • PRODUCCIÓN BAJO PEDIDO</span>
        <Flame className="w-3.5 h-3.5 fill-black shrink-0" />
      </div>

      {/* NAVEGACIÓN */}
      <nav className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-stone-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-stone-300 p-1">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
          <a href="#" className="text-2xl font-black tracking-tighter text-white uppercase italic">
            EL LEÓN <span className="text-[#ffde00]">.</span>
          </a>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-stone-400">
          <a href="#inicio" className="hover:text-[#ffde00] transition">Inicio</a>
          <a href="#coleccion" className="hover:text-[#ffde00] transition">Colección</a>
          <a href="#bolivia" className="hover:text-[#ffde00] transition">Rumbo a Bolivia</a>
          <a href="#manifiesto" className="hover:text-[#ffde00] transition">Manifiesto</a>
          <a href="#historia" className="hover:text-[#ffde00] transition">Sobre El León</a>
          <a href="#lamanada" className="hover:text-[#ffde00] transition">La Manada</a>
        </div>

        <a 
          href={CONFIG.instagramUrl} 
          target="_blank" 
          rel="noreferrer" 
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-stone-300 hover:text-[#ffde00] transition"
        >
          <Instagram className="w-4 h-4 text-[#ffde00]" />
          <span className="hidden sm:inline">@{CONFIG.instagramUser}</span>
        </a>
      </nav>

      {/* MENÚ MÓVIL */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[65px] bg-stone-950 border-b border-stone-800 p-6 z-30 flex flex-col gap-5 font-bold uppercase tracking-wider text-sm">
          <a href="#inicio" onClick={() => setIsMenuOpen(false)}>Inicio</a>
          <a href="#coleccion" onClick={() => setIsMenuOpen(false)}>Colección Preventa</a>
          <a href="#bolivia" onClick={() => setIsMenuOpen(false)} className="text-emerald-400">Rumbo a Bolivia 2026</a>
          <a href="#manifiesto" onClick={() => setIsMenuOpen(false)}>Manifiesto</a>
          <a href="#historia" onClick={() => setIsMenuOpen(false)}>Sobre El León</a>
          <a href="#lamanada" onClick={() => setIsMenuOpen(false)} className="text-[#ffde00]">La Manada</a>
        </div>
      )}

      {/* HERO SECTION */}
      <header id="inicio" className="relative bg-gradient-to-b from-stone-900 via-stone-950 to-black py-20 px-6 text-center border-b border-stone-800">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="inline-block bg-stone-900 border border-stone-700 text-[#ffde00] text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full">
            BOXEADOR. GUERRERO. MARCA.
          </span>
          <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">
            EL LEÓN <br />
            <span className="text-stone-500 font-light text-3xl md:text-5xl block mt-2">Nacida del ring.</span>
          </h1>
          <p className="text-stone-300 text-base md:text-lg max-w-xl mx-auto font-light leading-relaxed">
            Construida para los que siguen advancing. Sistema exclusivo de reservas por preventa.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <a href="#coleccion" className="bg-[#ffde00] text-black font-black uppercase text-xs tracking-widest px-8 py-4 hover:bg-yellow-400 transition flex items-center gap-2">
              VER COLECCIÓN <ChevronRight className="w-4 h-4" />
            </a>
            <a href="#historia" className="bg-stone-900 border border-stone-700 text-white font-bold uppercase text-xs tracking-widest px-6 py-4 hover:border-[#ffde00] transition">
              CONOCÉ EL LEÓN
            </a>
          </div>
        </div>
      </header>

      {/* DOS FORMAS DE LLEVAR EL LEÓN */}
      <section className="border-b border-stone-800 bg-black py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="bg-stone-950 border border-stone-800 p-8 space-y-4 hover:border-stone-600 transition">
            <div className="flex items-center justify-between">
              <span className="bg-stone-900 text-white font-mono text-[10px] uppercase tracking-widest px-3 py-1 border border-stone-800">
                LÍNEA 01
              </span>
              <span className="text-stone-500 font-mono text-xs">COLOR: NEGRO</span>
            </div>
            <h3 className="text-2xl font-black uppercase italic">EL LEÓN — ORIGINAL</h3>
            <p className="text-stone-400 text-xs leading-relaxed">
              "La marca." Representa la mentalidad, la disciplina y la identidad pura de la marca.
            </p>
            <a href="#coleccion" className="inline-flex items-center text-[#ffde00] font-bold text-xs uppercase tracking-widest hover:underline gap-1 pt-2">
              Ver Línea Original <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="bg-emerald-950/20 border border-emerald-900/60 p-8 space-y-4 hover:border-emerald-500/60 transition">
            <div className="flex items-center justify-between">
              <span className="bg-emerald-950 text-emerald-400 font-mono text-[10px] uppercase tracking-widest px-3 py-1 border border-emerald-800">
                LÍNEA 02 — CAMPAÑA
              </span>
              <span className="text-emerald-500 font-mono text-xs">🇦🇷 → 🇧🇴</span>
            </div>
            <h3 className="text-2xl font-black uppercase italic text-emerald-400">RUMBO A BOLIVIA 2026</h3>
            <p className="text-stone-300 text-xs leading-relaxed">
              "El viaje." El 100% de lo recaudado con esta colección está destinado a financiar la participación en Bolivia.
            </p>
            <a href="#bolivia" className="inline-flex items-center text-emerald-400 font-bold text-xs uppercase tracking-widest hover:underline gap-1 pt-2">
              Ver Operación Santa Cruz <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* OPERACIÓN SANTA CRUZ */}
      <section id="bolivia" className="bg-stone-950 border-b border-stone-800 py-20 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <span className="text-emerald-400 font-mono text-xs uppercase tracking-widest">
              🇦🇷 → 🇧🇴 OPERACIÓN SANTA CRUZ
            </span>
            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tight">
              RUMBO A BOLIVIA <span className="text-emerald-500">2026</span>
            </h2>
            <p className="text-stone-300 text-sm md:text-base max-w-2xl mx-auto font-light leading-relaxed">
              Esta colección nace para financiar el viaje y la participación de El León en Bolivia.
            </p>
            <div className="inline-block bg-emerald-950/80 border border-emerald-700/50 p-4 rounded-none max-w-xl">
              <p className="text-emerald-400 font-black text-xs md:text-sm uppercase tracking-wider text-center">
                100% DE LO RECAUDADO CON LOS PRODUCTOS VERDES SE DESTINA A LA CAMPAÑA.
              </p>
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <a 
              href="#coleccion" 
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase text-xs tracking-widest px-8 py-4 transition"
            >
              AYUDAR A LLEVAR AL LEÓN A BOLIVIA
            </a>
          </div>
        </div>
      </section>

      {/* CATÁLOGOS */}
      <section id="coleccion" className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-stone-800 pb-6 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tight">
              CATÁLOGO DE <span className="text-[#ffde00]">PREVENTA</span>
            </h2>
            <p className="text-stone-400 text-xs tracking-widest uppercase mt-1">Producción bajo pedido • Reserva con seña</p>
          </div>

          <div className="bg-stone-900 border border-stone-800 px-4 py-2 text-[11px] font-mono text-stone-300 flex items-center gap-2">
            <Info className="w-4 h-4 text-[#ffde00] shrink-0" />
            <span>Fabricación exclusiva tras confirmar seña vía WhatsApp.</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRODUCTS.map((prod) => (
            <div 
              key={prod.id} 
              className={`bg-stone-950 border ${prod.isFundraiser ? 'border-emerald-900/60 hover:border-emerald-500' : 'border-stone-800 hover:border-[#ffde00]'} transition duration-300 flex flex-col justify-between`}
            >
              <div className="relative aspect-square bg-stone-900 overflow-hidden cursor-pointer" onClick={() => setSelectedProduct(prod)}>
                <img 
                  src={prod.images[0]} 
                  alt={prod.name} 
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                  <span className="bg-black/90 border border-stone-700 text-[#ffde00] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
                    {prod.badge}
                  </span>
                  {prod.isFundraiser && (
                    <span className="bg-emerald-950 border border-emerald-700 text-emerald-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 flex items-center gap-1">
                      🇦🇷 → 🇧🇴 RUMBO A BOLIVIA 2026
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow justify-between space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest block">{prod.category}</span>
                  <h3 className="font-black text-xl leading-snug uppercase italic">{prod.name}</h3>
                  <p className="text-stone-400 text-xs font-light">{prod.tagline}</p>

                  {prod.isFundraiser && (
                    <div className="bg-emerald-950/40 border border-emerald-900/50 p-2.5 text-[10px] text-emerald-300 font-mono mt-2">
                      El 100% de lo recaudado con esta colección está destinado a financiar el viaje de El León a Bolivia.
                    </div>
                  )}
                </div>

                <div className="space-y-4 pt-4 border-t border-stone-900">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-stone-500 text-[10px] uppercase font-mono block">Precio Preventa</span>
                      <span className="text-2xl font-black text-white">${prod.price.toLocaleString()}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[#ffde00] text-[10px] uppercase font-mono block">Seña Requerida</span>
                      <span className="text-sm font-bold text-stone-300">${prod.deposit.toLocaleString()}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleOpenReservation(prod)}
                    className={`w-full py-3.5 text-xs font-black uppercase tracking-widest transition flex items-center justify-center gap-2 ${
                      prod.isFundraiser 
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-black' 
                        : 'bg-[#ffde00] hover:bg-yellow-400 text-black'
                    }`}
                  >
                    RESERVAR MI PRENDA
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MANIFIESTO */}
      <section id="manifiesto" className="bg-gradient-to-b from-black to-stone-950 border-y border-stone-800 py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <span className="text-[#ffde00] font-mono text-xs uppercase tracking-widest">// IDENTIDAD Y MENTALIDAD</span>
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tight leading-none">
            EL LEÓN NO ES <br />
            <span className="text-stone-500">SOLO UNA ROPA.</span>
          </h2>
          
          <div className="space-y-6 text-stone-300 text-base md:text-xl font-light leading-relaxed italic border-y border-stone-900 py-8">
            <p>"Es la mentalidad de levantarte cuando nadie te está mirando."</p>
            <p>"De entrenar cuando no tenés ganas."</p>
            <p>"De entrar al ring sabiendo que podés perder y hacerlo igual."</p>
            <p className="text-[#ffde00] font-black uppercase not-italic text-2xl pt-2">
              EL LEÓN ES PARA LOS QUE SIGUEN AVANZANDO.
            </p>
          </div>
        </div>
      </section>

      {/* SOBRE MÍ */}
      <section id="historia" className="bg-black py-20 px-6 border-b border-stone-800">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-[#ffde00] font-mono text-xs uppercase tracking-widest">
              <User className="w-4 h-4" />
              <span>SOBRE MI TRAYECTORIA</span>
            </div>
            <h2 className="text-4xl font-black uppercase italic">¿QUÉ ES EL LEÓN?</h2>
            
            <div className="space-y-4 text-stone-300 text-sm leading-relaxed font-light">
              <p>
                Soy <strong className="text-white font-bold">Joel Frutos</strong>, boxeador amateur.
              </p>
              <p>
                El León nació de una idea simple: convertir todo lo que aprendí dentro del ring en una marca que pueda llevar cualquiera.
              </p>
              <p>
                El boxeo me enseñó que no siempre gana el más fuerte.
              </p>
              <p className="text-[#ffde00] font-bold uppercase text-base">
                Gana el que sigue.
              </p>
            </div>

            <a 
              href={CONFIG.instagramUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="inline-flex items-center gap-2 border border-stone-700 bg-stone-900 px-6 py-3.5 text-xs font-bold uppercase tracking-widest hover:border-[#ffde00] transition"
            >
              <Instagram className="w-4 h-4 text-[#ffde00]" />
              SEGUIR EL DIA A DIA EN INSTAGRAM
            </a>
          </div>

          <div className="relative border border-stone-800 bg-stone-950 p-2">
            <img 
              src="1000375045.png" 
              alt="Joel Frutos El León" 
              className="w-full h-auto object-cover grayscale contrast-125"
            />
          </div>
        </div>
      </section>

      {/* MODAL DETALLE DE PRODUCTO */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-950 border border-stone-800 max-w-3xl w-full p-6 md:p-8 relative my-8 space-y-6">
            <button 
              onClick={() => setSelectedProduct(null)} 
              className="absolute top-4 right-4 text-stone-400 hover:text-white p-2"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="aspect-square bg-stone-900 overflow-hidden border border-stone-800">
                  <img src={selectedProduct.images[0]} alt={selectedProduct.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-[10px] text-stone-500 uppercase font-mono text-center">Producción bajo pedido • Preventa Oficial</p>
              </div>

              <div className="space-y-5 flex flex-col justify-between">
                <div>
                  <span className="text-[#ffde00] text-[10px] font-mono tracking-widest uppercase">{selectedProduct.category}</span>
                  <h3 className="text-2xl font-black uppercase italic mt-1">{selectedProduct.name}</h3>
                  <p className="text-stone-400 text-xs mt-2">{selectedProduct.description}</p>
                  
                  <div className="mt-4 p-3 bg-stone-900 border border-stone-800 space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-stone-400">Precio Preventa:</span>
                      <span className="text-white font-bold">${selectedProduct.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-[#ffde00]">Seña para confirmar:</span>
                      <span className="text-[#ffde00] font-bold">${selectedProduct.deposit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-stone-400">Saldo contra entrega:</span>
                      <span className="text-white font-bold">${selectedProduct.balance.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-stone-900 pt-4 space-y-2">
                  <h4 className="text-xs font-bold uppercase text-[#ffde00]">¿Cómo funciona la preventa?</h4>
                  <ol className="text-[11px] text-stone-400 space-y-1 list-decimal list-inside font-light">
                    <li>Elegís tu prenda y talle.</li>
                    <li>Completás tus datos y enviás la reserva por WhatsApp.</li>
                    <li>Transferís la seña para confirmar la producción.</li>
                    <li>Cuando la prenda está lista, te avisamos y abonás el saldo contra entrega.</li>
                  </ol>
                </div>

                <button 
                  onClick={() => {
                    const prod = selectedProduct;
                    setSelectedProduct(null);
                    handleOpenReservation(prod);
                  }}
                  className="w-full bg-[#ffde00] text-black font-black uppercase text-xs tracking-widest py-4 hover:bg-yellow-400 transition"
                >
                  RESERVAR AHORA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL RESERVA POR PASOS */}
      {reservationModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-950 border border-stone-800 max-w-xl w-full p-6 md:p-8 relative my-8 space-y-6">
            
            <button 
              onClick={() => setReservationModal(null)} 
              className="absolute top-4 right-4 text-stone-400 hover:text-white p-2"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="border-b border-stone-800 pb-4">
              <span className="text-[#ffde00] font-mono text-[10px] uppercase tracking-widest">
                PASO {activeStep} DE 2 • PREVENTA OFICIAL
              </span>
              <h3 className="text-2xl font-black uppercase italic mt-1">RESERVA: {reservationModal.name}</h3>
            </div>

            {/* PASO 1 */}
            {activeStep === 1 && (
              <form onSubmit={handleSendWhatsAppReservation} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-stone-400 block mb-2">Talle:</label>
                    <div className="flex flex-wrap gap-1.5">
                      {reservationModal.sizes.map(size => (
                        <button 
                          type="button"
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-3 py-2 border text-xs font-bold ${selectedSize === size ? 'border-[#ffde00] text-[#ffde00] bg-stone-900' : 'border-stone-800 text-stone-400'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-stone-400 block mb-2">Cantidad:</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="10"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="w-full bg-stone-900 border border-stone-800 p-2.5 text-white text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold uppercase text-[#ffde00] block">Datos del Comprador</span>
                  
                  <input 
                    type="text" 
                    name="nombre" 
                    placeholder="Nombre y Apellido *" 
                    required
                    value={formData.nombre} 
                    onChange={handleInputChange} 
                    className="w-full bg-stone-900 border border-stone-800 p-3 text-white text-xs placeholder:text-stone-600 focus:border-[#ffde00] outline-none"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <input 
                      type="text" 
                      name="dni" 
                      placeholder="Número de DNI *" 
                      required
                      value={formData.dni} 
                      onChange={handleInputChange} 
                      className="w-full bg-stone-900 border border-stone-800 p-3 text-white text-xs placeholder:text-stone-600 focus:border-[#ffde00] outline-none"
                    />
                    <input 
                      type="tel" 
                      name="telefono" 
                      placeholder="Teléfono / WhatsApp *" 
                      required
                      value={formData.telefono} 
                      onChange={handleInputChange} 
                      className="w-full bg-stone-900 border border-stone-800 p-3 text-white text-xs placeholder:text-stone-600 focus:border-[#ffde00] outline-none"
                    />
                  </div>

                  <input 
                    type="text" 
                    name="localidad" 
                    placeholder="Localidad / Zona de entrega" 
                    value={formData.localidad} 
                    onChange={handleInputChange} 
                    className="w-full bg-stone-900 border border-stone-800 p-3 text-white text-xs placeholder:text-stone-600 focus:border-[#ffde00] outline-none"
                  />
                </div>

                <div className="bg-stone-900 border border-stone-800 p-4 space-y-2 text-xs font-mono">
                  <span className="text-stone-400 font-bold uppercase block text-[10px]">RESUMEN DE RESERVA</span>
                  <div className="flex justify-between text-stone-300">
                    <span>Precio total:</span>
                    <span className="font-bold">${totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[#ffde00] font-bold">
                    <span>Seña para encargar:</span>
                    <span>${totalDeposit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-stone-300">
                    <span>Saldo contra entrega:</span>
                    <span>${totalBalance.toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-[#25D366] text-black font-black uppercase text-xs tracking-widest py-4 hover:bg-green-400 transition flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-black" />
                  ENVIAR RESERVA POR WHATSAPP
                </button>
              </form>
            )}

            {/* PASO 2 */}
            {activeStep === 2 && (
              <div className="space-y-6">
                <div className="bg-stone-900 border border-stone-800 p-4 text-center space-y-2">
                  <h4 className="text-xl font-black text-[#ffde00] uppercase italic">¡RESERVA REGISTRADA! 🦁</h4>
                  <p className="text-stone-300 text-xs font-light">
                    Tu lugar en la preventa está reservado de forma provisoria.
                  </p>
                  <p className="text-stone-400 text-[11px]">
                    Para confirmar definitivamente tu pedido, realizá la transferencia de la seña y enviá el comprobante por WhatsApp.
                  </p>
                </div>

                <div className="bg-stone-900/60 border border-stone-800 p-4 space-y-3 font-mono text-xs">
                  <span className="text-[#ffde00] font-bold uppercase block text-[10px]">DATOS PARA TRANSFERENCIA</span>
                  <div className="flex justify-between items-center text-stone-300">
                    <span>Alias:</span>
                    <span className="font-bold text-white">{CONFIG.bankData.alias}</span>
                  </div>
                  <div className="flex justify-between items-center text-stone-300">
                    <span>Titular:</span>
                    <span className="font-bold text-white">{CONFIG.bankData.titular}</span>
                  </div>
                  <div className="flex justify-between items-center text-stone-300">
                    <span>DNI / CUIT:</span>
                    <span className="font-bold text-white">{CONFIG.bankData.cuit}</span>
                  </div>
                </div>

                <a 
                  href={`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent('Hola! Adjunto el comprobante de pago de mi seña.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-stone-900 border border-stone-700 text-white font-black uppercase text-xs tracking-widest py-3.5 hover:border-[#ffde00] transition flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  ENVIAR COMPROBANTE POR WHATSAPP
                </a>

                <div id="lamanada" className="bg-emerald-950/30 border border-emerald-900/60 p-5 space-y-3 text-center">
                  <h4 className="text-lg font-black text-emerald-400 uppercase italic">BIENVENIDO A LA MANADA 🦁</h4>
                  <p className="text-stone-300 text-xs font-light">
                    Tu compra es solo el comienzo. Como parte de la comunidad de El León, podés unirte a La Manada y acompañar todo lo que viene.
                  </p>
                  
                  <a 
                    href={CONFIG.linkLaManada}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase text-xs tracking-widest py-3.5 transition"
                  >
                    UNIRME A LA MANADA
                  </a>
                </div>

                <button 
                  onClick={() => setReservationModal(null)}
                  className="w-full text-stone-500 text-xs uppercase tracking-widest py-2 hover:text-white"
                >
                  Cerrar Ventana
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* BENEFICIOS DE LA MANADA */}
      <section className="bg-stone-950 border-t border-stone-800 py-20 px-6">
        <div className="max-w-4xl mx-auto space-y-8 text-center">
          <div className="space-y-3">
            <span className="text-[#ffde00] font-mono text-xs uppercase tracking-widest">COMUNIDAD PRIVADA DE WHATSAPP</span>
            <h2 className="text-4xl font-black uppercase italic">¿QUÉ HAY EN LA MANADA?</h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-left font-mono text-xs">
            <div className="bg-stone-900 p-4 border border-stone-800 text-stone-300 flex items-start gap-2">
              <span className="text-lg">🥊</span> <span>Evolución y novedades de El León.</span>
            </div>
            <div className="bg-stone-900 p-4 border border-stone-800 text-stone-300 flex items-start gap-2">
              <span className="text-lg">🇧🇴</span> <span>Seguimiento de Operación Santa Cruz.</span>
            </div>
            <div className="bg-stone-900 p-4 border border-stone-800 text-stone-300 flex items-start gap-2">
              <span className="text-lg">👕</span> <span>Acceso anticipado a nuevas prendas.</span>
            </div>
            <div className="bg-stone-900 p-4 border border-stone-800 text-stone-300 flex items-start gap-2">
              <span className="text-lg">🔥</span> <span>Preventas especiales.</span>
            </div>
            <div className="bg-stone-900 p-4 border border-stone-800 text-stone-300 flex items-start gap-2">
              <span className="text-lg">🎁</span> <span>Sorteos y beneficios exclusivos.</span>
            </div>
            <div className="bg-stone-900 p-4 border border-stone-800 text-stone-300 flex items-start gap-2">
              <span className="text-lg">🎥</span> <span>Contenido detrás de escena y noticias.</span>
            </div>
          </div>

          <p className="text-xl font-black italic text-[#ffde00] uppercase tracking-wider">
            "NO SOMOS CLIENTES. SOMOS LA MANADA."
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-stone-900 bg-black py-12 px-6 text-center text-stone-500 text-xs space-y-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <p className="font-black text-2xl text-white uppercase italic">EL LEÓN <span className="text-[#ffde00]">.</span></p>
          
          <div className="flex justify-center gap-6 font-bold text-stone-400 pt-2">
            <a href={CONFIG.instagramUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#ffde00] transition">
              <Instagram className="w-4 h-4 text-[#ffde00]" />
              <span>@{CONFIG.instagramUser}</span>
            </a>
          </div>

          <p className="text-stone-600 pt-4">© 2026 TEAM EL LEÓN. TODOS LOS DERECHOS RESERVADOS.</p>
        </div>
      </footer>

    </div>
  );
}
