import React from 'react';

export const TableroMision = ({ recaudado = 0, objetivo = 2600000 }) => {
  const porcentaje = Math.min(Math.round((recaudado / objetivo) * 100), 100);

  return (
    <section id="operacion-santa-cruz" className="py-12 bg-black text-white px-4">
      <div className="max-w-4xl mx-auto bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-xl shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <span className="bg-yellow-400 text-black text-[10px] font-black px-2 py-1 uppercase rounded tracking-wider">
              TEMPORADA ACTUAL
            </span>
            <h2 className="text-2xl md:text-3xl font-black mt-2">🇧🇴 OPERACIÓN SANTA CRUZ</h2>
            <p className="text-xs text-zinc-400">Objetivo Deportivo: Competencia Internacional Bolivia 2026</p>
          </div>

          <div className="text-left md:text-right">
            <span className="text-xs text-zinc-400 uppercase font-mono block">Recaudación actual</span>
            <span className="text-2xl font-mono font-bold text-yellow-400">
              ${recaudado.toLocaleString('es-AR')} <span className="text-xs text-zinc-500">/ ${objetivo.toLocaleString('es-AR')}</span>
            </span>
          </div>
        </div>

        {/* Barra de Progreso */}
        <div className="w-full bg-zinc-800 h-4 rounded-full overflow-hidden p-0.5 border border-zinc-700">
          <div 
            className="bg-gradient-to-r from-yellow-500 to-yellow-300 h-full rounded-full transition-all duration-700"
            style={{ width: `${porcentaje}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between items-center text-[11px] font-mono text-zinc-400 mt-2">
          <span>0%</span>
          <span>{porcentaje}% COMPLETADO</span>
          <span>100%</span>
        </div>

        {/* Concepto Transparencia */}
        <div className="mt-8 pt-6 border-t border-zinc-800/80 bg-zinc-950/50 p-4 rounded-lg">
          <h4 className="text-xs font-bold text-yellow-400 uppercase mb-2 flex items-center gap-1">
            💡 ¿En qué se convierte tu apoyo?
          </h4>
          <p className="text-xs text-zinc-300 leading-relaxed">
            <strong>TU COMPRA IMPULSA EL VIAJE:</strong> Parte de tu compra cubre el costo de producción de las prendas. El margen restante se destina directamente a financiar pasajes, alojamiento, inscripciones y preparación deportiva para representar al país.
          </p>
        </div>
      </div>
    </section>
  );
};
