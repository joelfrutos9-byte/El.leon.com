import React, { useState } from 'react';
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
  Home
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('mision');
  const [selectedSize, setSelectedSize] = useState({});

  const whatsappNumber = "5493425236731";
  const instagramUrl = "https://instagram.com/joelbox_";
  const whatsappChannelUrl = "https://whatsapp.com/channel/0029Vb8f4EU3QxS1ckJsS31A";

  // Catálogo de Productos
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
      description: 'Corte oversize de alta durabilidad. Diseñada para soportar el entrenamiento diario y marcar presencia en la calle.',
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
      badge: 'PREVENTA',
      badgeColor: 'bg-emerald-950 text-emerald-400 border-emerald-500/40',
      description: 'Edición oficial para financiar el viaje y la preparación internacional. Verde combate con estética táctica.',
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
      badge: 'PREVENTA',
      badgeColor: 'bg-emerald-950 text-emerald-400 border-emerald-500/40',
      description: 'Buzo pesado con capucha doble, puños reforzados y estampado de alto impacto en la espalda.',
      sizes: ['S', 'M', 'L', 'XL', 'XXL']
    }
  ];

  // Datos para el Tablero de Misión
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
    const msg = `¡Hola Joel! Me interesa sumarme como SPONSOR / PATROCINADOR para apoyarte en tu carrera y la Operación Santa Cruz Bolivia 2026. Quisiera coordinar una propuesta.`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-yellow-500 selection:text-black pb-12">
      
      {/* HEADER PRINCIPAL */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-zinc-800/80 px-4 pt-3.5 pb-2">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('mision')}>
            <span className="text-xl font-black tracking-tighter text-yellow-400">EL LEÓN</span>
            <span className="text-[10px] bg-zinc-800 text-zinc-300 font-bold px-2 py-0.5 rounded border border-zinc-700 uppercase">
              UNIVERSO
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

        {/* NAVEGACIÓN EN PESTAÑAS (TAB BAR) */}
        <nav className="max-w-5xl mx-auto mt-3 flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
          <button
            onClick={() => setActiveTab('mision')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all whitespace-nowrap ${
              activeTab === 'mision' ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-500/20 scale-105' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Home className="w-3.5 h-3.5" /> Misión Bolivia
          </button>

          <button
            onClick={() => setActiveTab('tienda')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all whitespace-nowrap ${
              activeTab === 'tienda' ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-500/20 scale-105' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" /> León Store
          </button>

          <button
            onClick={() => setActiveTab('elcamino')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all whitespace-nowrap ${
              activeTab === 'elcamino' ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-500/20 scale-105' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Tv className="w-3.5 h-3.5" /> El Camino
          </button>

          <button
            onClick={() => setActiveTab('noticias')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all whitespace-nowrap ${
              activeTab === 'noticias' ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-500/20 scale-105' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Newspaper className="w-3.5 h-3.5" /> Noticias
          </button>

          <button
            onClick={() => setActiveTab('sponsors')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all whitespace-nowrap ${
              activeTab === 'sponsors' ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-500/20 scale-105' : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Award className="w-3.5 h-3.5" /> Sponsors
          </button>
        </nav>
      </header>

      {/* VISTAS DINÁMICAS */}
      <main className="max-w-5xl mx-auto px-4 pt-6">

        {/* 1. VISTA: MISIÓN BOLIVIA (INICIO) */}
        {activeTab === 'mision' && (
          <div className="space-y-8">
            {/* HERO PRINCIPAL */}
            <section className="relative rounded-3xl overflow-hidden border border-zinc-800 p-6 sm:p-12 text-center bg-zinc-950">
              <div className="absolute inset-0 z-0">
                <img src="/E-576.jpg" alt="Joel el León en combate" className="w-full h-full object-cover object-center opacity-30 filter grayscale" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
              </div>

              <div className="relative z-10 space-y-4 max-w-xl mx-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                  <Zap className="w-3.5 h-3.5" /> OPERACIÓN SANTA CRUZ — BOLIVIA 2026
                </span>
                
                <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-none">
                  CULTURA DE <span className="text-yellow-400">DISCIPLINA</span> Y RESILIENCIA
                </h1>
                
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                  Centro de operaciones oficial de <strong>Joel Frutos (@joelbox_)</strong>. Todo lo recaudado impulsa directamente los viajes y la preparación deportiva.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
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
                    <Flame className="w-4 h-4 text-yellow-400" /> Mi Historia
                  </button>
                </div>
              </div>
            </section>

            {/* TABLERO DE MISIÓN */}
            <section className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <span className="bg-yellow-400 text-black text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                    MISIÓN ACTIVA
                  </span>
                  <h2 className="text-xl font-black text-white uppercase mt-1">🇧🇴 TABLERO DE RECAUDACIÓN</h2>
                  <p className="text-xs text-zinc-400">Financiamiento de pasajes, preparación y campamento internacional.</p>
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

              {/* Bloque Transparencia */}
              <div className="pt-3 border-t border-zinc-900 text-xs text-zinc-400 space-y-1">
                <span className="font-bold text-yellow-400 uppercase text-[11px] block">💡 Tu compra impulsa el viaje</span>
                <p className="leading-relaxed">
                  Parte de tu compra en la tienda cubre el costo de producción de la prenda. El margen restante se destina directamente a los gastos del viaje y la preparación.
                </p>
              </div>
            </section>

            {/* HOY EN EL UNIVERSO LEÓN */}
            <section className="space-y-3">
              <span className="text-xs font-bold tracking-widest text-yellow-400 uppercase block">🟢 Hoy en el Universo León</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-zinc-950 border-l-4 border-yellow-400 border border-zinc-800 p-4 rounded-xl">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase block">PROYECTO ACTUAL</span>
                  <h3 className="font-black text-sm text-white mt-1 uppercase">Operación Santa Cruz</h3>
                  <p className="text-xs text-zinc-400 mt-1">Rumbo a Bolivia 2026</p>
                </div>

                <div className="bg-zinc-950 border-l-4 border-red-600 border border-zinc-800 p-4 rounded-xl">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase block">PRÓXIMO COMBATE</span>
                  <h3 className="font-black text-sm text-white mt-1 uppercase">Joel Frutos VS Rival</h3>
                  <p className="text-xs text-zinc-400 mt-1">Por confirmar</p>
                </div>

                <div className="bg-zinc-950 border-l-4 border-zinc-500 border border-zinc-800 p-4 rounded-xl flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase block">DOCUMENTAL</span>
                    <h3 className="font-black text-sm text-white mt-1 uppercase">Ep. 01 — Decidimos ir</h3>
                  </div>
                  <button 
                    onClick={() => setActiveTab('elcamino')}
                    className="text-xs text-yellow-400 font-bold underline mt-2 text-left"
                  >
                    Ver en El Camino →
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* 2. VISTA: LEÓN STORE / TIENDA */}
        {activeTab === 'tienda' && (
          <div className="space-y-6">
            <div className="text-center sm:text-left">
              <span className="text-xs font-bold tracking-widest text-yellow-400 uppercase">Indumentaria Oficial</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase">LEÓN STORE</h2>
              <p className="text-xs text-zinc-400 mt-1">Producción limitada • Reserva el 50% vía WhatsApp y salda al entregar.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map((p) => (
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
                          <span className="text-[10px] text-zinc-400 block uppercase">Precio Preventa</span>
                          <span className="text-lg font-black text-white">{formatCurrency(p.price)}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-yellow-400 block uppercase font-bold">Seña de Reserva</span>
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
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold tracking-widest text-yellow-400 uppercase">Trayectoria & Filosofía</span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">DETRÁS DEL GUANTE</h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
                El boxeo no es solo lo que pasa arriba del cuadrilátero, es el trabajo silencioso de todos los días.
              </p>
            </div>

            {/* Grid de Galería de Pelea */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-zinc-800">
                <img src="/E-577.jpg" alt="Joel arriba del ring" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <span className="absolute bottom-3 left-3 text-xs font-bold text-yellow-400 uppercase">En el ring</span>
              </div>

              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-zinc-800">
                <img src="/E-543.jpg" alt="Joel en guardia" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <span className="absolute bottom-3 left-3 text-xs font-bold text-yellow-400 uppercase">Foco y guardia</span>
              </div>

              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-zinc-800">
                <img src="/E-524.jpg" alt="Joel en el rincón" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <span className="absolute bottom-3 left-3 text-xs font-bold text-yellow-400 uppercase">En el rincón</span>
              </div>
            </div>

            {/* Galería Secundaria de Entrenamiento */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-800">
                <img src="/20240203092340_IMG_2552.jpg" alt="Entrenamiento en la bolsa" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <span className="absolute bottom-3 left-3 text-xs font-bold text-yellow-400 uppercase">Entrenamiento pesado</span>
              </div>

              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-800">
                <img src="/20240203095134_IMG_2729.jpg" alt="Equipo IMAD" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <span className="absolute bottom-3 left-3 text-xs font-bold text-yellow-400 uppercase">El equipo — IMAD</span>
              </div>
            </div>

            {/* Ficha Técnica */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
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
                Soy <strong>Joel Diaz ("El León")</strong>, boxeador amateur y profesor. Entreno día a día con una sola meta: superarme, representar a mi gimnasio y llevar la bandera lo más alto posible en la <strong>Operación Santa Cruz — Bolivia 2026</strong>.
              </p>
            </div>
          </div>
        )}

        {/* 4. VISTA: NOTICIAS & LA MANADA */}
        {activeTab === 'noticias' && (
          <div className="space-y-8 max-w-3xl mx-auto">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold tracking-widest text-yellow-400 uppercase">Medio Oficial</span>
              <h2 className="text-3xl font-black text-white uppercase">📰 NOTICIAS DE EL LEÓN</h2>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-3">
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-500/30 px-2 py-0.5 rounded">
                OFICIAL
              </span>
              <h3 className="text-xl font-black text-white uppercase">Lanzamiento Oficial de la Preventa Bolivia 2026</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Apertura oficial del catálogo de indumentaria para cubrir el margen de pasajes y logística del próximo campamento. Las reservas se realizan directamente vía WhatsApp con seña del 50%.
              </p>
            </div>

            {/* COMUNIDAD LA MANADA */}
            <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-yellow-500/20 rounded-2xl p-6 text-center space-y-4">
              <div className="inline-flex items-center gap-1.5 text-yellow-400 text-xs font-bold">
                <Users className="w-4 h-4" />
                <span>COMUNIDAD PRIVADA</span>
              </div>
              <h3 className="text-2xl font-black text-white uppercase">Sumate a "La Manada"</h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Canal exclusivo para recibir el día a día de los entrenamientos, sorteos de indumentaria y novedades antes que nadie.
              </p>
              <a
                href={whatsappChannelUrl} 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider"
              >
                <MessageCircle className="w-4 h-4 fill-black" /> Unirme al Canal de WhatsApp
              </a>
            </div>
          </div>
        )}

        {/* 5. VISTA: SPONSORS */}
        {activeTab === 'sponsors' && (
          <div className="max-w-2xl mx-auto py-6">
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
