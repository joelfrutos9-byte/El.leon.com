import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { CheckCircle2, Calendar, Scale, Activity, FileText, Send, Flame, Award, TrendingUp, BarChart2 } from 'lucide-react';

export default function TrackerRutina({ studentKey }) {
  const [completado, setCompletado] = useState(true);
  const [intensidad, setIntensidad] = useState(8);
  const [pesoHoy, setPesoHoy] = useState('');
  const [notas, setNotas] = useState('');
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMessage] = useState(null);
  const [vistaGrafico, setVistaGrafico] = useState('peso'); // 'peso' o 'rpe'

  useEffect(() => {
    if (studentKey) {
      cargarHistorial();
    }
  }, [studentKey]);

  const cargarHistorial = async () => {
    try {
      const { data, error } = await supabase
        .from('registros_alumnos')
        .select('*')
        .eq('student_key', studentKey.toLowerCase().trim())
        .order('created_at', { ascending: true }); // Orden ascendente para el gráfico

      if (error) throw error;
      setHistorial(data || []);
    } catch (err) {
      console.log('Error cargando historial:', err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const nuevoRegistro = {
        student_key: studentKey.toLowerCase().trim(),
        completado,
        intensidad: parseInt(intensidad),
        peso: pesoHoy ? parseFloat(pesoHoy) : null,
        notas: notas.trim()
      };

      const { error } = await supabase
        .from('registros_alumnos')
        .insert([nuevoRegistro]);

      if (error) throw error;

      setMessage({ type: 'success', text: '¡Entrenamiento registrado con éxito! 🥊' });
      setNotas('');
      setPesoHoy('');
      cargarHistorial();
    } catch (err) {
      setMessage({ type: 'error', text: 'Error al registrar: ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  // Métricas calculadas
  const totalCumplidos = historial.filter(h => h.completado).length;
  const porcentajeCumplimiento = historial.length > 0 ? Math.round((totalCumplidos / historial.length) * 100) : 0;
  
  // Registros con peso cargado para el gráfico
  const registrosPeso = historial.filter(h => h.peso !== null && h.peso !== undefined && !isNaN(h.peso));
  const promedioRPE = historial.length > 0 ? (historial.reduce((acc, curr) => acc + (curr.intensidad || 0), 0) / historial.length).toFixed(1) : 0;

  // Cálculo de puntos para gráfico SVG de peso
  const renderGraficoPeso = () => {
    if (registrosPeso.length < 2) {
      return (
        <div className="h-32 flex items-center justify-center text-xs text-zinc-500 italic bg-black/40 rounded-xl border border-zinc-800/80">
          Cargá al menos 2 registros de peso para ver la curva de evolución.
        </div>
      );
    }

    const pesos = registrosPeso.map(r => parseFloat(r.peso));
    const minPeso = Math.min(...pesos) - 0.5;
    const maxPeso = Math.max(...pesos) + 0.5;
    const range = maxPeso - minPeso || 1;

    const width = 300;
    const height = 100;

    const points = registrosPeso.map((r, index) => {
      const x = (index / (registrosPeso.length - 1)) * width;
      const y = height - ((parseFloat(r.peso) - minPeso) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="space-y-2">
        <div className="relative w-full h-32 bg-black/60 rounded-xl p-3 border border-zinc-800/80 flex flex-col justify-between">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            {/* Lógica de línea de tendencia */}
            <polyline
              fill="none"
              stroke="#ffde00"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
            {/* Puntos en los nodos */}
            {registrosPeso.map((r, index) => {
              const x = (index / (registrosPeso.length - 1)) * width;
              const y = height - ((parseFloat(r.peso) - minPeso) / range) * height;
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#000"
                  stroke="#ffde00"
                  strokeWidth="2"
                />
              );
            })}
          </svg>
        </div>

        <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
          <span>Inicio: {pesos[0]} kg</span>
          <span>Actual: {pesos[pesos.length - 1]} kg</span>
        </div>
      </div>
    );
  };

  // Cálculo de gráfico SVG de RPE / Intensidad
  const renderGraficoRPE = () => {
    if (historial.length < 2) {
      return (
        <div className="h-32 flex items-center justify-center text-xs text-zinc-500 italic bg-black/40 rounded-xl border border-zinc-800/80">
          Cargá al menos 2 sesiones para ver el gráfico de esfuerzo.
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <div className="w-full h-32 bg-black/60 rounded-xl p-3 border border-zinc-800/80 flex items-end gap-1.5 justify-between">
          {historial.slice(-10).map((r, index) => {
            const hPercent = (r.intensidad / 10) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                <span className="text-[9px] font-bold text-yellow-400">{r.intensidad}</span>
                <div 
                  className="w-full bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-t-sm transition-all"
                  style={{ height: `${hPercent}%` }}
                />
              </div>
            );
          })}
        </div>
        <span className="text-[10px] text-zinc-500 block text-right">Últimas 10 sesiones (Escala RPE 1-10)</span>
      </div>
    );
  };

  const historialInvertido = [...historial].reverse();

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
      {/* CABECERA CON RESUMEN Y RACHA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-900 pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-yellow-500/10 text-yellow-400 text-[10px] font-black border border-yellow-500/20 uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5" /> DIARIO & EVOLUCIÓN
          </span>
          <h3 className="text-2xl font-black text-white uppercase tracking-tight mt-1">
            SEGUIMIENTO DEL ALUMNO
          </h3>
          <p className="text-xs text-zinc-400">
            Registrá tus entrenamientos diarios y observá tus estadísticas de evolución física.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-zinc-900/80 border border-zinc-800 p-3 rounded-2xl">
          <div className="p-2.5 bg-yellow-400 text-black rounded-xl">
            <Flame className="w-5 h-5 fill-black" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase block">Racha Registrada</span>
            <span className="text-lg font-black text-white">{totalCumplidos} <span className="text-xs text-yellow-400">Sesiones</span></span>
          </div>
        </div>
      </div>

      {/* BLOQUE DE ESTADÍSTICAS Y GRÁFICOS */}
      <div className="bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-yellow-400" />
            <h4 className="text-sm font-black text-white uppercase">Gráfico de Evolución</h4>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setVistaGrafico('peso')}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                vistaGrafico === 'peso' ? 'bg-yellow-400 text-black' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              Peso Corporal
            </button>
            <button
              onClick={() => setVistaGrafico('rpe')}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                vistaGrafico === 'rpe' ? 'bg-yellow-400 text-black' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              Intensidad (RPE)
            </button>
          </div>
        </div>

        {/* MÉTRICAS RÁPIDAS */}
        <div className="grid grid-cols-3 gap-2 py-1 text-center">
          <div className="bg-black/50 p-2.5 rounded-xl border border-zinc-800">
            <span className="text-[9px] text-zinc-500 uppercase block font-bold">Cumplimiento</span>
            <span className="text-base font-black text-emerald-400">{porcentajeCumplimiento}%</span>
          </div>
          <div className="bg-black/50 p-2.5 rounded-xl border border-zinc-800">
            <span className="text-[9px] text-zinc-500 uppercase block font-bold">RPE Promedio</span>
            <span className="text-base font-black text-yellow-400">{promedioRPE}/10</span>
          </div>
          <div className="bg-black/50 p-2.5 rounded-xl border border-zinc-800">
            <span className="text-[9px] text-zinc-500 uppercase block font-bold">Último Pesaje</span>
            <span className="text-base font-black text-white">
              {registrosPeso.length > 0 ? `${registrosPeso[registrosPeso.length - 1].peso} kg` : 'N/A'}
            </span>
          </div>
        </div>

        {/* RENDER DEL GRÁFICO SELECCIONADO */}
        {vistaGrafico === 'peso' ? renderGraficoPeso() : renderGraficoRPE()}
      </div>

      {mensaje && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${
          mensaje.type === 'success' ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-400' : 'bg-red-950/80 border border-red-500/40 text-red-400'
        }`}>
          <Award className="w-4 h-4" />
          {mensaje.text}
        </div>
      )}

      {/* FORMULARIO DE REGISTRO DIARIO */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <CheckCircle2 className={`w-6 h-6 ${completado ? 'text-yellow-400' : 'text-zinc-600'}`} />
            <div>
              <span className="text-xs font-black text-white uppercase block">¿Completaste la rutina de hoy?</span>
              <span className="text-[10px] text-zinc-400">Confirmá que realizaste el plan indicado</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setCompletado(!completado)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${
              completado ? 'bg-yellow-400 text-black' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
            }`}
          >
            {completado ? 'SÍ, CUMPLIDA' : 'INCOMPLETA'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* INTENSIDAD / FATIGA */}
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-zinc-400 uppercase">Esfuerzo Percibido (RPE)</label>
              <span className="text-xs font-black text-yellow-400 bg-black px-2 py-0.5 rounded border border-zinc-800">
                {intensidad} / 10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={intensidad}
              onChange={(e) => setIntensidad(e.target.value)}
              className="w-full accent-yellow-400 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-zinc-500 font-mono">
              <span>1 (Muy Suave)</span>
              <span>5 (Moderado)</span>
              <span>10 (Exigencia Máxima)</span>
            </div>
          </div>

          {/* PESO DE HOY */}
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-yellow-400" /> Peso Corporal de hoy (opcional)
            </label>
            <input
              type="number"
              step="0.1"
              placeholder="Ej: 64.5"
              value={pesoHoy}
              onChange={(e) => setPesoHoy(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-yellow-400"
            />
            <span className="text-[9px] text-zinc-500 block">Ingresá tu pesaje en ayunas o post-entreno</span>
          </div>
        </div>

        {/* NOTAS Y OBSERVACIONES */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-yellow-400" /> Notas o sensaciones del entrenamiento
          </label>
          <textarea
            rows="3"
            placeholder="Ej: 'Completé los 4 rounds de bolsa sin problemas, pero sentí molestia leve en el gemelo derecho...'"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-yellow-400 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Send className="w-4 h-4 fill-black" />
          {loading ? 'Guardando...' : 'Registrar Mi Entrenamiento'}
        </button>
      </form>

      {/* HISTORIAL DE SESIONES ANTERIORES */}
      <div className="pt-6 border-t border-zinc-900 space-y-3">
        <h4 className="text-sm font-black text-white uppercase flex items-center gap-2">
          <Calendar className="w-4 h-4 text-yellow-400" /> Historial Reciente de Sesiones
        </h4>

        {historial.length === 0 ? (
          <p className="text-xs text-zinc-500 italic py-2">No registraste entrenamientos aún. ¡Completá el primero arriba!</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {historialInvertido.map((reg) => (
              <div key={reg.id} className="bg-zinc-900/60 border border-zinc-800/80 p-3.5 rounded-xl space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-zinc-400">
                    {new Date(reg.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </span>
                  <span className={`font-black text-[10px] px-2 py-0.5 rounded uppercase ${
                    reg.completado ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-red-950 text-red-400 border border-red-500/30'
                  }`}>
                    {reg.completado ? 'Cumplido ✅' : 'Incompleto ❌'}
                  </span>
                </div>

                <div className="flex gap-4 text-[11px] text-zinc-300">
                  <span>⚡ RPE: <strong className="text-yellow-400">{reg.intensidad}/10</strong></span>
                  {reg.peso && <span>⚖️ Peso: <strong>{reg.peso} kg</strong></span>}
                </div>

                {reg.notas && (
                  <p className="text-[11px] text-zinc-400 italic bg-black/40 p-2 rounded-lg border border-zinc-900">
                    "{reg.notas}"
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
    }
