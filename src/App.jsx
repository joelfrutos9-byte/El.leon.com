import React, { useState } from 'react';
import { ShoppingBag, ShieldCheck, Zap, MessageCircle, Users, Award, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [selectedSize, setSelectedSize] = useState({});
  const whatsappNumber = "5493425236731";

  const products = [
    {
      id: 'original-01',
      name: 'EL LEÓN — ORIGINAL 01',
      tagline: 'LA PRIMERA PIEL DEL LEÓN',
      line: 'LÍNEA 01 — ORIGINAL',
      price: 34900,
      deposit: 17500,
      image: '/1000375046.png',
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
      image: '/1000375043.png',
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
      image: '/1000375042.png',
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
    const msg = `¡Hola Joel! Me interesa sumarme como SPONSOR / PATROCINADOR para apoyarte en tu carrera y la Operación Santa Cruz Bolivia 2026. Quisiera coordinar una propuesta.`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-yellow-500 selection:text-black">
      
      {/* HEADER BAR */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-zinc-800/80 px-4 py-3.5">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tighter text-yellow-400">EL LEÓN</span>
            <span className="text-xs bg-zinc-800 text-zinc-300 font-bold px-2 py-0.5 rounded border border-zinc-700">STORE</span>
          </div>
          <a 
            href="#catalogo" 
            className="text-xs font-bold bg-yellow-400 text-black px-3 py-1.5 rounded-full hover:bg-yellow-300 transition-colors uppercase tracking-wider"
          >
            Reservar
          </a>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative px-4 pt-10 pb-12 text-center border-b border-zinc-900 bg-gradient-to-b from-zinc-950 to-black">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>OPERACIÓN SANTA CRUZ — BOLIVIA 2026</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase">
            CULTURA DE <span className="text-yellow-400">DISCIPLINA</span> Y RESILIENCIA
          </h1>
          
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Indumentaria oficial de <strong className="text-white">@joelbox_</strong>. Cada reserva financia de manera directa la preparación y el viaje para la <strong className="text-white">Operación Santa Cruz 2026</strong> en Bolivia.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <a 
              href="#catalogo" 
              className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-300 text-black font-black px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider shadow-lg shadow-yellow-500/10"
            >
              <ShoppingBag className="w-4 h-4" /> Ver Colección y Preventa
            </a>
            <a 
              href="#sponsors" 
              className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-bold px-6 py-3.5 rounded-xl border border-zinc-800 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
            >
              <Award className="w-4 h-4 text-yellow-400" /> Ser Sponsor
            </a>
          </div>
        </div>
      </section>

      {/* CATALOGO */}
      <section id="catalogo" className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8 text-center sm:text-left">
          <span className="text-xs font-bold tracking-widest text-yellow-400 uppercase">Indumentaria Oficial</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase">Catálogo de Preventa</h2>
          <p className="text-xs text-zinc-400 mt-1">Producción limitada • Reserva el 50% vía WhatsApp y salda al entregar.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p.id} className="bg-zinc-950 rounded-2xl border border-zinc-800/80 overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition-all">
              <div>
                {/* Imagen del Producto */}
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

                {/* Contenido */}
                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">{p.line}</span>
                    <h3 className="text-lg font-black text-white leading-tight uppercase mt-0.5">{p.name}</h3>
                    <p className="text-xs text-zinc-400 italic mt-0.5">{p.tagline}</p>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed">{p.description}</p>

                  {/* Selección de Talle */}
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

                  {/* Precios */}
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

              {/* Botón de Acción */}
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
      </section>

      {/* COMUNIDAD PRIVADA */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-yellow-500/20 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-yellow-400 text-xs font-bold">
              <Users className="w-4 h-4" />
              <span>COMUNIDAD PRIVADA</span>
            </div>
            <h3 className="text-2xl font-black text-white uppercase">Sumate a "La Manada"</h3>
            <p className="text-xs text-zinc-400 max-w-md">
              Acompañame en el día a día del entrenamiento, contenido exclusivo de la preparación para Bolivia, sorteos de indumentaria y acceso antes que nadie a los lanzamientos.
            </p>
          </div>
          <a
            href="https://chat.whatsapp.com/" 
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-black font-black px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider shrink-0"
          >
            <MessageCircle className="w-4 h-4 fill-black" /> Unirme al Grupo WhatsApp
          </a>
        </div>
      </section>

      {/* SPONSORS Y MARCAS */}
      <section id="sponsors" className="max-w-4xl mx-auto px-4 py-12 border-t border-zinc-900">
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-yellow-400 bg-yellow-500/10 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/20">
            <Award className="w-4 h-4" />
            <span>ALIANZAS Y PATROCINIOS</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase">¿Querés sponsorear la campaña?</h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Sumá tu marca, gimnasio o emprendimiento al equipamiento oficial y la cobertura en redes de la <strong className="text-white">Operación Santa Cruz 2026</strong>. Espacios publicitarios en indumentaria y contenidos de alto impacto.
          </p>
          <div className="pt-2">
            <button
              onClick={createSponsorWhatsapp}
              className="bg-white hover:bg-zinc-200 text-black font-black px-8 py-3.5 rounded-xl transition-all inline-flex items-center gap-2 text-xs uppercase tracking-wider shadow-lg"
            >
              <MessageCircle className="w-4 h-4" /> Hablar por propuesta de Sponsor
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 py-8 px-4 text-center text-xs text-zinc-600">
        <p className="font-bold text-zinc-400">EL LEÓN — JOEL FRUTOS (@joelbox_)</p>
        <p className="mt-1">Santo Tomé / Rosario, Argentina • 2026</p>
      </footer>

    </div>
  );
}
