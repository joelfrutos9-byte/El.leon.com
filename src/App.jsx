import React, { useState } from 'react';
import { ShoppingBag, ShieldCheck, Zap, MessageCircle, Users, Award, Instagram, Flame, Dumbbell, Target } from 'lucide-react';

export default function App() {
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
          
          <div className="flex items-center gap-2 sm:gap-3">
            <a 
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 px-3 py-1.5 rounded-full transition-colors"
            >
              <Instagram className="w-3.5 h-3.5 text-yellow-400" />
              <span className="hidden sm:inline">@joelbox_</span>
            </a>
            <a 
              href="#catalogo" 
              className="text-xs font-bold bg-yellow-400 text-black px-3 py-1.5 rounded-full hover:bg-yellow-300 transition-colors uppercase tracking-wider"
            >
              Reservar
            </a>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4 py-16 text-center border-b border-zinc-900 overflow-hidden">
        {/* Imagen de fondo completa */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/E-576.jpg" 
            alt="Joel el León en combate" 
            className="w-full h-full object-cover object-center opacity-45 filter grayscale brightness-90"
          />
          {/* Sombras suaves arriba y abajo para legibilidad del texto */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto space-y-5 my-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-400 text-xs font-bold backdrop-blur-sm">
            <Zap className="w-3.5 h-3.5" />
            <span>OPERACIÓN SANTA CRUZ — BOLIVIA 2026</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase drop-shadow-md">
            CULTURA DE <span className="text-yellow-400">DISCIPLINA</span> Y RESILIENCIA
          </h1>
          
          <p className="text-zinc-200 text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-medium drop-shadow-sm">
            Indumentaria oficial de <strong className="text-white">Joel Frutos (@joelbox_)</strong>. Cada reserva financia directamente la preparación y el viaje de la <strong className="text-yellow-400">Operación Santa Cruz 2026</strong>.
          </p>

          <div className="pt-3 flex flex-col sm:flex-row gap-3 justify-center">
            <a 
              href="#catalogo" 
              className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-300 text-black font-black px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider shadow-lg shadow-yellow-500/20"
            >
              <ShoppingBag className="w-4 h-4" /> Ver Colección y Preventa
            </a>
            <a 
              href="#historia" 
              className="w-full sm:w-auto bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 font-bold px-6 py-3.5 rounded-xl border border-zinc-700 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider backdrop-blur-md"
            >
              <Flame className="w-4 h-4 text-yellow-400" /> Mi Historia
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

      {/* SECCIÓN MI HISTORIA */}
      <section id="historia" className="border-t border-zinc-900 bg-zinc-950/60 py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-10">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-bold tracking-widest text-yellow-400 uppercase">Trayectoria & Filosofía</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">DETRÁS DEL GUANTE</h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
              El boxeo no es solo lo que pasa arriba del cuadrilátero, es el trabajo silencioso de todos los días.
            </p>
          </div>

          {/* Grid de Galería de Pelea */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-zinc-800 group">
              <img src="/E-577.jpg" alt="Joel arriba del ring" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              <span className="absolute bottom-3 left-3 text-xs font-bold text-yellow-400 uppercase">En el ring</span>
            </div>

            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-zinc-800 group">
              <img src="/E-543.jpg" alt="Joel en guardia" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              <span className="absolute bottom-3 left-3 text-xs font-bold text-yellow-400 uppercase">Foco y guardia</span>
            </div>

            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-zinc-800 group">
              <img src="/E-524.jpg" alt="Joel en el rincón" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              <span className="absolute bottom-3 left-3 text-xs font-bold text-yellow-400 uppercase">En el rincón</span>
            </div>
          </div>

          {/* Galería Secundaria de Entrenamiento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-800/80 group">
              <img src="/20240203092340_IMG_2552.jpg" alt="Entrenamiento en la bolsa" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              <span className="absolute bottom-3 left-3 text-xs font-bold text-yellow-400 uppercase">Entrenamiento pesado</span>
            </div>

            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-800/80 group">
              <img src="/20240203095134_IMG_2729.jpg" alt="Equipo de entrenamiento" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              <span className="absolute bottom-3 left-3 text-xs font-bold text-yellow-400 uppercase">El equipo — IMAD</span>
            </div>
          </div>

          {/* Texto Biográfico */}
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

            <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
              <p>
                Soy <strong className="text-white">Joel Frutos ("El León")</strong>, boxeador amateur y profesor. Entreno día a día con una sola meta: superarme, representar a mi gimnasio y llevar la bandera lo más alto posible.
              </p>
              <p>
                Hoy estoy enfocado en la <strong className="text-yellow-400">Operación Santa Cruz — Bolivia 2026</strong>. Lanzar esta marca e indumentaria es la herramienta que me permite financiar los viajes, la logística, los campamentos y todo lo que exige una preparación de alto rendimiento sin aflojar.
              </p>
            </div>

            {/* CTA Redes en Historia */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-800">
              <span className="text-xs font-bold text-zinc-400 uppercase text-center sm:text-left">Seguí el día a día del entrenamiento en Instagram:</span>
              <a 
                href={instagramUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-yellow-400 hover:bg-yellow-300 text-black font-black px-5 py-2.5 rounded-xl transition-all inline-flex items-center gap-2 text-xs uppercase tracking-wider shrink-0"
              >
                <Instagram className="w-4 h-4" /> Seguir a @joelbox_
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* COMUNIDAD PRIVADA */}
      <section className="max-w-4xl mx-auto px-4 py-12">
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
            href={whatsappChannelUrl} 
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-black font-black px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider shrink-0"
          >
            <MessageCircle className="w-4 h-4 fill-black" /> Unirme al Canal de WhatsApp
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
      <footer className="border-t border-zinc-900 py-8 px-4 text-center text-xs text-zinc-600 space-y-2">
        <p className="font-bold text-zinc-400">EL LEÓN — JOEL DIAZ (@joelbox_)</p>
        <p>Santo Tomé / Rosario, Argentina • 2026</p>
      </footer>

    </div>
  );
}
