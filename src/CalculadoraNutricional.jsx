import React, { useState } from 'react';
import { Calculator, Flame, Sparkles, ArrowRight } from 'lucide-react';

export default function CalculadoraNutricional() {
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [edad, setEdad] = useState('');
  const [actividad, setActividad] = useState('1.55'); // Moderado / Boxeo 3-4 días
  const [objetivo, setObjetivo] = useState('mantener'); // bajar, mantener, subir
  const [resultados, setResultados] = useState(null);

  const calcular = (e) => {
    e.preventDefault();
    if (!peso || !altura || !edad) return;

    const p = parseFloat(peso);
    const a = parseFloat(altura);
    const eAnios = parseInt(edad);
    const act = parseFloat(actividad);

    // TMB - Fórmula Harris-Benedict (Ajustada)
    let tmb = 88.362 + (13.397 * p) + (4.799 * a) - (5.677 * eAnios);
    let tdee = tmb * act;

    // Ajuste por objetivo
    if (objetivo === 'bajar') tdee -= 400; // Déficit progresivo
    if (objetivo === 'subir') tdee += 400; // Superávit magro

    // Macros enfocados en deportista / boxeo
    const proteinaGrams = Math.round(p * 2.0); // 2g por kg de peso
    const grasaGrams = Math.round(p * 0.9);    // 0.9g por kg de peso
    const proteCal = proteinaGrams * 4;
    const grasaCal = grasaGrams * 9;
    const carbCal = Math.max(0, tdee - (proteCal + grasaCal));
    const carbGrams = Math.round(carbCal / 4);

    // Hidratación recomendada
    const aguaLitros = (p * 0.035 + 1.0).toFixed(1);

    setResultados({
      calorias: Math.round(tdee),
      proteinas: proteinaGrams,
      carbohidratos: carbGrams,
      grasas: grasaGrams,
      agua: aguaLitros
    });
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
      <div className="space-y-1">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-yellow-500/10 text-yellow-400 text-[10px] font-black border border-yellow-500/20 uppercase tracking-wider">
          <Calculator className="w-3.5 h-3.5" /> HERRAMIENTA LIBRE Y GRATUITA
        </span>
        <h3 className="text-2xl font-black text-white uppercase tracking-tight">
          CALCULADORA FÍSICA & MACROS
        </h3>
        <p className="text-xs text-zinc-400">
          Ingresá tus datos para obtener tu gasto calórico diario, distribución de nutrientes e hidratación recomendada para potenciar tu rendimiento.
        </p>
      </div>

      <form onSubmit={calcular} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">Peso (kg) *</label>
            <input
              type="number"
              required
              step="0.1"
              placeholder="Ej: 65"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">Altura (cm) *</label>
            <input
              type="number"
              required
              placeholder="Ej: 168"
              value={altura}
              onChange={(e) => setAltura(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">Edad *</label>
            <input
              type="number"
              required
              placeholder="Ej: 22"
              value={edad}
              onChange={(e) => setEdad(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">Nivel de Actividad *</label>
            <select
              value={actividad}
              onChange={(e) => setActividad(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
            >
              <option value="1.375">Entrenamiento Ligero (1-2 días/semana)</option>
              <option value="1.55">Boxeo / Gimnasio Moderado (3-4 días/semana)</option>
              <option value="1.725">Doble Turno / Atleta Activo (5-7 días/semana)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">Objetivo Deportivo *</label>
            <select
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
            >
              <option value="bajar">Definir / Bajar de Categoría (Déficit)</option>
              <option value="mantener">Mantenimiento de Peso y Rendimiento</option>
              <option value="subir">Ganar Masa Muscular Magra (Superávit)</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 fill-black" />
          Calcular Mi Plan Nutricional
        </button>
      </form>

      {/* RESULTADOS DEL CÁLCULO */}
      {resultados && (
        <div className="pt-6 border-t border-zinc-800 space-y-4 animate-fade-in">
          <div className="bg-gradient-to-r from-yellow-500/10 via-zinc-900 to-zinc-900 border border-yellow-500/40 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase text-yellow-400 tracking-wider block">Meta Calórica Diaria</span>
              <span className="text-3xl font-black text-white">{resultados.calorias} <span className="text-xs text-zinc-400">kcal/día</span></span>
            </div>
            <div className="p-3 bg-yellow-400 text-black rounded-xl">
              <Flame className="w-6 h-6 fill-black" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 text-center">
              <span className="text-[10px] font-bold text-zinc-500 uppercase block">Proteínas</span>
              <span className="text-xl font-black text-yellow-400">{resultados.proteinas}g</span>
              <span className="text-[9px] text-zinc-400 block mt-0.5">Recuperación</span>
            </div>

            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 text-center">
              <span className="text-[10px] font-bold text-zinc-500 uppercase block">Carbohidratos</span>
              <span className="text-xl font-black text-white">{resultados.carbohidratos}g</span>
              <span className="text-[9px] text-zinc-400 block mt-0.5">Energía</span>
            </div>

            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 text-center">
              <span className="text-[10px] font-bold text-zinc-500 uppercase block">Grasas</span>
              <span className="text-xl font-black text-white">{resultados.grasas}g</span>
              <span className="text-[9px] text-zinc-400 block mt-0.5">Salud Hormonal</span>
            </div>

            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 text-center">
              <span className="text-[10px] font-bold text-zinc-500 uppercase block">Agua Mínima</span>
              <span className="text-xl font-black text-emerald-400">{resultados.agua}L</span>
              <span className="text-[9px] text-zinc-400 block mt-0.5">Hidratación</span>
            </div>
          </div>

          {/* GANCHO DE VENTA / CONSULTA PRIVADA */}
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <p className="text-xs font-bold text-white">¿Querés una rutina de entrenamiento adaptada a tu objetivo?</p>
              <p className="text-[10px] text-zinc-400">Consultá por los planes de entrenamiento personalizado.</p>
            </div>
            <a
              href="https://wa.me/5493410000000?text=Hola%20Joel!%20Usé%20la%20calculadora%20de%20la%20app%20y%20quiero%20información%20sobre%20las%20rutinas%20personalizadas."
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-yellow-400 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              Consultar por WhatsApp <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
