import React, { useState } from 'react';
import { ShoppingBag, Zap, MessageCircle, Users, Award, Instagram, Flame, Newspaper, TV, Home } from 'lucide-react';

// Componentes del Universo
import { HoyEnElUniverso } from './components/HoyEnElUniverso';
import { TableroMision } from './components/TableroMision';

export default function App() {
  const [activeTab, setActiveTab] = useState('mision'); // Estado para controlar el menú
  const [selectedSize, setSelectedSize] = useState({});

  const whatsappNumber = "5493425236731";
  const instagramUrl = "https://instagram.com/joelbox_";
  const whatsappChannelUrl = "Https://whatsapp.com/channel/0029Vb8f4EU3QxS1ckJsS31A";

  const products = [
    {
      id: 'original-01',
      name: 'EL LEÓN — ORIGINAL 01',
      tagline: 'LA PRIMERA PIEL DEL LEÓN',
      line: 'LÍNEA 01 — ORIGINAL',
      price: 34900,
      deposit: 17500,
      image: '/1785149020942.png',
      badge: 'PREVENTA EXCLUSIVA',
      badgeColor: 'bg-zinc-800 text-yellow-400 border-yellow-500/30',
      description: 'Corte oversize premium. Algodón pesado de alta durabilidad. Diseñada para soportar el entrenamiento diario y marcar presencia en la calle.',
      sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    {
      id: 'bolivia-remera',
      name: 'RUMBO A BOLIVIA — REMERA',
      tagline: 'EDICIÓN OFICIAL OPERACIÓN SANTA CRUZ',
      line: 'LÍNEA 02 — CAMPAÑA BOLIVIA 2026',
      price: 34900,
      deposit: 17500,
      image: '/1785148963897.png',
      badge: '100% A BENEFICIO',
      badgeColor: 'bg-emerald-950 text-emerald-400 border-emerald-500/40',
      description: 'El 100% de la ganancia de esta prenda financia el viaje y la preparación en Bolivia. Verde combate con estética táctica.',
      sizes: ['S', 'M', 'L', 'XL', 'XXL']
    },
    {
      id: 'bolivia-hoodie',
      name: 'RUMBO A BOLIVIA — HOODIE',
      tagline: 'BUZO OVERSIZE EDICIÓN LIMITADA',
      line: 'LÍNEA 02 — CAMPAÑA BOLIVIA 2026',
      price: 58000,
      deposit: 29000,
      image: '/1785148947849.png',
      badge: '100% A BENEFICIO',
      badgeColor: 'bg-emerald-950 text-emerald-400 border-emerald-500/40',
      description: 'Frisa invisible pesada premium. Capucha doble, puños reforzados y estampado de alto impacto en espalda.',
      sizes: ['S', 'M', 'L', 'XL', 'XXL']
    }
  ];

  const handleSelectSize = (productId, size) => {
    setSelectedSize(prev => ({ ...prev, [productId]: size }));
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val);
  };

  const createOrderWhatsapp = (product) => {
    const size = selectedSize[product.id];
    if (!size) {
      alert('Por favor selecciona un talle antes de reservar.');
      return;
    }
    const msg = `¡Hola Joel! Quiero reservar la prenda: *${product.name}* en Talle *${size}*.\n\n` +
      `• Precio Preventa: ${formatCurrency(product.price)}\n` +
      `• Seña a transferir: ${formatCurrency(product.deposit)}\n\n` +
      `Quedo a la espera de los datos de transferencia para enviar el comprobante. ¡Vamos con todo!`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const createSponsorWhatsapp = () => {
    const msg = `¡Hola Joel! Me interesa sumarse como SPONSOR / PATROCINADOR para apoyarte en tu carrera y la Operación Santa Cruz Bolivia 2026. Quisiera coordinar una propuesta.`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-yellow-500 selection:text-black">
      
      {/* HEADER BAR */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-zinc-800 px-4 py-3">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('mision')}>
            <span className="text-xl font-black tracking-tighter text-yellow-400">EL LEÓN</span>
            <span className="text-[10px] bg-zinc-800 text-zinc-300 font-bold px-2 py-0.5 rounded border border-zinc-700 uppercase">Universo</span>
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

        {/* MENÚ NAVEGADOR PRINCIPAL */}
        <nav className="max-w-5xl mx-auto mt-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('mision')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all whitespace-nowrap ${
              activeTab === 'mision' ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-500/20' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Home className="w-3.5 h-3.5" /> Misión Bolivia
          </button>

          <button
            onClick={() => setActiveTab('tienda')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all whitespace-nowrap ${
              activeTab === 'tienda' ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-500/20' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Tienda
          </button>

          <button
            onClick={() => setActiveTab('elcamino')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all whitespace-nowrap ${
              activeTab === 'elcamino' ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-500/20' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <TV className="w-3.5 h-3.5" /> El Camino
          </button>

          <button
            onClick={() => setActiveTab('noticias')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all whitespace-nowrap ${
              activeTab === 'noticias' ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-500/20' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Newspaper className="w-3.5 h-3.5" /> Noticias
          </button>

          <button
            onClick={() => setActiveTab('sponsors')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all whitespace-nowrap ${
              activeTab === 'sponsors' ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-500/20' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Award className="w-3.5 h-3.5" /> Sponsors
          </button>
        </nav>
      </header>

      {/* CONTENIDO SEGÚN LA PESTAÑA SELECCIONADA */}
      <main className="max-w-5xl mx-auto px-4 py-8">

        {/* 1. VISTA: MISIÓN BOLIVIA (INICIO) */}
        {activeTab === 'mision' && (
          <div className="space-y-10 animate-fade-in">
            {/* HERO MINI */}
            <section className="relative rounded-3xl overflow-hidden border border-zinc-800 p-8 text-center bg-zinc-950">
              <div className="absolute inset-0 z-0 opacity-30">
                <img src="/E-576.jpg" alt="Joel el León" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
              </div>

              <div className="relative z-10 space-y-4 max-w-xl mx-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                  <Zap className="w-3.5 h-3.5" /> OPERACIÓN SANTA CRUZ — BOLIVIA 2026
                </span>
                <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
                  EL UNIVERSO DE <span className="text-yellow-400">EL LEÓN</span>
                </h1>
                <p className="text-zinc-300 text-xs sm:text-sm">
                  Centro oficial de operaciones, bitácora de entrenamiento y tienda de financiamiento directo para la campaña internacional.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <button 
                    onClick={() => setActiveTab('tienda')}
                    className="bg-yellow-400 text-black font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider hover:bg-yellow-300 transition-all"
                  >
                    Ir a la Tienda
                  </button>
                </div>
              </div>
            </section>

            {/* TABLERO DE MISIÓN & HOY EN EL UNIVERSO */}
            <TableroMision recaudado={0} objetivo={2600000} />
            <HoyEnElUniverso />
          </div>
        )}

        {/* 2. VISTA: TIENDA / TIENDA */}
        {activeTab === 'tienda' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center sm:text-left">
              <span className="text-xs font-bold tracking-widest text-yellow-400 uppercase">Indumentaria Oficial</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase">Catálogo de Preventa</h2>
              <p className="text-xs text-zinc-400 mt-1">Cada reserva financia directamente la preparación y el viaje a Bolivia.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map((p) => (
                <div key={p.id} className="bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition-all">
                  <div>
                    <div className="relative aspect-square bg-zinc-900 overflow-hidden flex items-center justify-center">
                      <img 
                        src={p.image} 
                        alt={p.name}
                        className="w-full h-full object-cover"
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
                          <span className="text-[10px] text-yellow-400 block uppercase font-bold">Seña</span>
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

        {/* 3. VISTA: EL CAMINO / HISTORIA */}
        {activeTab === 'elcamino' && (
          <div className="space-y-10 animate-fade-in">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold tracking-widest text-yellow-400 uppercase">Trayectoria & Filosofía</span>
              <h2 className="text-3xl font-black text-white uppercase">DETRÁS DEL GUANTE</h2>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                El trabajo diario, el gimnasio IMAD y el recorrido amateur hacia el profesionalismo.
              </p>
            </div>

            {/* GALERÍA DE FOTOS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-zinc-800">
                <img src="/E-577.jpg" alt="Ring" className="w-full h-full object-cover" />
                <span className="absolute bottom-3 left-3 text-xs font-bold text-yellow-400 uppercase">En el ring</span>
              </div>
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-zinc-800">
                <img src="/E-543.jpg" alt="Guardia" className="w-full h-full object-cover" />
                <span className="absolute bottom-3 left-3 text-xs font-bold text-yellow-400 uppercase">Foco y guardia</span>
              </div>
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-zinc-800">
                <img src="/E-524.jpg" alt="Rincón" className="w-full h-full object-cover" />
                <span className="absolute bottom-3 left-3 text-xs font-bold text-yellow-400 uppercase">En el rincón</span>
              </div>
            </div>

            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center border-b border-zinc-800 pb-6">
                <div>
                  <span className="block text-2xl font-black text-yellow-400">Peso Gallo</span>
                  <span className="text-[10px] text-zinc-400 uppercase font-bold">División</span>
                </div>
                <div>
                  <span className="block text-2xl font-black text-white">Ortodoxa</span>
                  <span className="text-[10px] text-zinc-400 uppercase font-bold">Guardia</span>
                </div>
                <div>
                  <span className="block text-2xl font-black text-yellow-400">25-10-1</span>
                  <span className="text-[10px] text-zinc-400 uppercase font-bold">Récord Amateur</span>
                </div>
                <div>
                  <span className="block text-2xl font-black text-white">El León</span>
                  <span className="text-[10px] text-zinc-400 uppercase font-bold">Apodo</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed text-center">
                Soy <strong>Joel Diaz ("El León")</strong>, boxeador amateur y profesor. Entreno en Rosario e IMAD con la meta firme de representar a mi equipo en la Operación Santa Cruz 2026.
              </p>
            </div>
          </div>
        )}

        {/* 4. VISTA: NOTICIAS & COMUNIDAD */}
        {activeTab === 'noticias' && (
          <div className="space-y-8 animate-fade-in max-w-3xl mx-auto">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold tracking-widest text-yellow-400 uppercase">Novedades</span>
              <h2 className="text-3xl font-black text-white uppercase">ÚLTIMOS COMUNICADOS</h2>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-3">
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-500/30 px-2 py-0.5 rounded">
                OFICIAL
              </span>
              <h3 className="text-xl font-black text-white uppercase">Preparación Misión Bolivia 2026</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Iniciamos la fase de preventa de indumentaria oficial para cubrir los costos logísticos del campamento de entrenamiento. Sumate adquiriendo tu prenda o apoyando desde La Manada.
              </p>
            </div>

            {/* LA MANADA */}
            <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-yellow-500/20 rounded-2xl p-6 text-center space-y-4">
              <div className="inline-flex items-center gap-1.5 text-yellow-400 text-xs font-bold">
                <Users className="w-4 h-4" />
                <span>COMUNIDAD PRIVADA</span>
              </div>
              <h3 className="text-2xl font-black text-white uppercase">Sumate a "La Manada"</h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Acceso exclusivo al día a día en WhatsApp, sorteos de indumentaria y novedades directas.
              </p>
              <a
                href={whatsappChannelUrl} 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex bg-emerald-500 hover:bg-emerald-400 text-black font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider"
              >
                Unirme al Canal de WhatsApp
              </a>
            </div>
          </div>
        )}

        {/* 5. VISTA: SPONSORS */}
        {activeTab === 'sponsors' && (
          <div className="animate-fade-in max-w-2xl mx-auto py-8">
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 text-center space-y-4">
              <div className="inline-flex items-center gap-2 text-yellow-400 bg-yellow-500/10 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/20">
                <Award className="w-4 h-4" />
                <span>ALIANZAS Y PATROCINIOS</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase">¿Querés sponsorear la campaña?</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Sumá tu marca, gimnasio o emprendimiento al equipamiento oficial y a la cobertura en redes de la <strong>Operación Santa Cruz 2026</strong>.
              </p>
              <div className="pt-2">
                <button
                  onClick={createSponsorWhatsapp}
                  className="bg-white hover:bg-zinc-200 text-black font-black px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider"
                >
                  Hablar por propuesta de Sponsor
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 py-8 px-4 text-center text-xs text-zinc-600 space-y-2 mt-12">
        <p className="font-bold text-zinc-400">EL LEÓN — JOEL DIAZ (@joelbox_)</p>
        <p>Santo Tomé / Rosario, Argentina • 2026</p>
      </footer>

    </div>
  );
}
