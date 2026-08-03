import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings, Flame, Shield, Volume2 } from 'lucide-react';

export default function TabataTimer() {
  // Configuración
  const [workTime, setWorkTime] = useState(180); // Segundos de trabajo (default 3 min)
  const [restTime, setRestTime] = useState(60);   // Segundos de descanso (default 1 min)
  const [totalRounds, setTotalRounds] = useState(12); // Total de rounds por set
  const [totalSets, setTotalSets] = useState(1);      // Vueltas / Sets totales
  const [setRestTime, setSetRestTime] = useState(60);  // Descanso entre sets/vueltas

  // Estados dinámicos de ejecución
  const [currentRound, setCurrentRound] = useState(1);
  const [currentSet, setCurrentSet] = useState(1);
  const [timeLeft, setTimeLeft] = useState(workTime);
  const [status, setStatus] = useState('IDLE'); // IDLE, WORK, REST, SET_REST, FINISHED
  const [isRunning, setIsRunning] = useState(false);
  const [showCustomConfig, setShowCustomConfig] = useState(false);

  const timerRef = useRef(null);

  // 🔔 Sintetizador de Campana de Boxeo Real (Web Audio API)
  const playBellSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const frequencies = [800, 1200, 1650, 2100];
      const now = audioCtx.currentTime;

      frequencies.forEach((freq, index) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = index === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now);

        const baseGain = 0.3 / (index + 1);
        gain.gain.setValueAtTime(baseGain, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + 2.5);
      });
    } catch (e) {
      console.log("Audio no habilitado");
    }
  };

  // Pitido corto para los últimos 3 segundos
  const playBeep = (frequency = 440, duration = 150) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = frequency;
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      setTimeout(() => {
        osc.stop();
        audioCtx.close();
      }, duration);
    } catch (e) {}
  };

  // Motor del temporizador
  useEffect(() => {
    if (!isRunning) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 1) {
          if (prev <= 4) playBeep(450, 120); // Cuenta regresiva últimos segundos
          return prev - 1;
        }

        // Transición de estados al llegar a 0
        if (status === 'WORK') {
          if (currentRound >= totalRounds) {
            // Terminó el set/vuelta actual
            if (currentSet >= totalSets) {
              setIsRunning(false);
              setStatus('FINISHED');
              playBellSound();
              return 0;
            } else {
              // Descanso entre sets/vueltas
              playBellSound();
              setStatus('SET_REST');
              return setRestTime;
            }
          } else {
            // Descanso de round regular
            playBellSound();
            setStatus('REST');
            return restTime;
          }
        } else if (status === 'REST') {
          playBellSound();
          setCurrentRound((r) => r + 1);
          setStatus('WORK');
          return workTime;
        } else if (status === 'SET_REST') {
          playBellSound();
          setCurrentSet((s) => s + 1);
          setCurrentRound(1);
          setStatus('WORK');
          return workTime;
        }

        return 0;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isRunning, status, currentRound, currentSet, totalRounds, totalSets, workTime, restTime, setRestTime]);

  const startTimer = () => {
    if (status === 'IDLE' || status === 'FINISHED') {
      setCurrentRound(1);
      setCurrentSet(1);
      setStatus('WORK');
      setTimeLeft(workTime);
      playBellSound();
    }
    setIsRunning(true);
  };

  const pauseTimer = () => setIsRunning(false);

  const resetTimer = () => {
    setIsRunning(false);
    setStatus('IDLE');
    setCurrentRound(1);
    setCurrentSet(1);
    setTimeLeft(workTime);
  };

  // presets rápidos
  const applyPresetPro12 = () => {
    setIsRunning(false);
    setStatus('IDLE');
    setWorkTime(180);
    setRestTime(60);
    setTotalRounds(12);
    setTotalSets(1);
    setTimeLeft(180);
  };

  const applyPresetPro10 = () => {
    setIsRunning(false);
    setStatus('IDLE');
    setWorkTime(120);
    setRestTime(30);
    setTotalRounds(10);
    setTotalSets(1);
    setTimeLeft(120);
  };

  const applyPresetTabataClassic = () => {
    setIsRunning(false);
    setStatus('IDLE');
    setWorkTime(20);
    setRestTime(10);
    setTotalRounds(8);
    setTotalSets(1);
    setTimeLeft(20);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getBgStyle = () => {
    if (status === 'WORK') return 'bg-red-950/80 border-red-500/80';
    if (status === 'REST') return 'bg-emerald-950/80 border-emerald-500/80';
    if (status === 'SET_REST') return 'bg-blue-950/80 border-blue-500/80';
    return 'bg-zinc-950 border-zinc-800';
  };

  return (
    <div className={`max-w-md mx-auto rounded-3xl p-6 text-white border shadow-2xl transition-all duration-500 ${getBgStyle()}`}>
      
      {/* HEADER DEL TIMER */}
      <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-yellow-400" />
          <h3 className="font-black tracking-wider uppercase text-sm">EL LEÓN RING TIMER</h3>
        </div>
        <button
          onClick={() => setShowCustomConfig(!showCustomConfig)}
          className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 ${
            showCustomConfig ? 'bg-yellow-400 text-black border-yellow-400' : 'bg-zinc-900 border-zinc-700 text-zinc-300'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>{showCustomConfig ? 'Cerrar' : 'Ajustes'}</span>
        </button>
      </div>

      {/* PANEL DE CONFIGURACIÓN PERSONALIZADA */}
      {showCustomConfig && status === 'IDLE' && (
        <div className="bg-zinc-900/90 border border-zinc-700/80 p-4 rounded-2xl mb-6 space-y-3 animate-fade-in text-xs">
          <span className="font-black text-yellow-400 uppercase tracking-wider block">Configurador de Trabajo / Tabata</span>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-zinc-400 block mb-1 font-bold">Trabajo (seg):</label>
              <input
                type="number"
                value={workTime}
                onChange={(e) => {
                  const val = Math.max(5, parseInt(e.target.value) || 0);
                  setWorkTime(val);
                  setTimeLeft(val);
                }}
                className="w-full bg-black border border-zinc-700 rounded-lg p-2 text-white font-bold focus:border-yellow-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-zinc-400 block mb-1 font-bold">Descanso (seg):</label>
              <input
                type="number"
                value={restTime}
                onChange={(e) => setRestTime(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-black border border-zinc-700 rounded-lg p-2 text-white font-bold focus:border-yellow-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-zinc-400 block mb-1 font-bold">Ciclos / Rounds:</label>
              <input
                type="number"
                value={totalRounds}
                onChange={(e) => setTotalRounds(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-black border border-zinc-700 rounded-lg p-2 text-white font-bold focus:border-yellow-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-zinc-400 block mb-1 font-bold">Vueltas / Sets:</label>
              <input
                type="number"
                value={totalSets}
                onChange={(e) => setTotalSets(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-black border border-zinc-700 rounded-lg p-2 text-white font-bold focus:border-yellow-400 focus:outline-none"
              />
            </div>
          </div>

          {totalSets > 1 && (
            <div>
              <label className="text-zinc-400 block mb-1 font-bold">Descanso entre Vueltas (seg):</label>
              <input
                type="number"
                value={setRestTime}
                onChange={(e) => setSetRestTime(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-black border border-zinc-700 rounded-lg p-2 text-white font-bold focus:border-yellow-400 focus:outline-none"
              />
            </div>
          )}
        </div>
      )}

      {/* METRICAS DE ROUNDS Y SETS */}
      <div className="flex justify-between items-center bg-black/40 border border-white/5 rounded-2xl p-3 mb-6 font-mono text-xs">
        <div>
          <span className="text-zinc-500 block text-[10px] uppercase font-sans">Round / Ciclo</span>
          <span className="text-lg font-black text-yellow-400">{currentRound} / {totalRounds}</span>
        </div>
        
        {totalSets > 1 && (
          <div className="text-right">
            <span className="text-zinc-500 block text-[10px] uppercase font-sans">Vuelta / Set</span>
            <span className="text-lg font-black text-blue-400">{currentSet} / {totalSets}</span>
          </div>
        )}
      </div>

      {/* PANTALLA PRINCIPAL DE CONTEO */}
      <div className="text-center my-6">
        <p className="text-xs uppercase tracking-widest font-black mb-2 text-zinc-300">
          {status === 'WORK' && '🔥 ¡A DARLE CON TODO! (WORK)'}
          {status === 'REST' && '💧 RESPIRÁ Y RECUPERÁ (REST)'}
          {status === 'SET_REST' && '🌀 DESCANSO ENTRE VUELTAS'}
          {status === 'IDLE' && 'PRONTO PARA ARRANCAR'}
          {status === 'FINISHED' && '🏆 ¡ENTRENAMIENTO FINALIZADO!'}
        </p>
        
        <div className="text-8xl font-black font-mono tracking-tight drop-shadow-2xl my-2 text-white">
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* CONTROLES PRINCIPALES */}
      <div className="flex gap-2 justify-center mb-6">
        {!isRunning ? (
          <button
            onClick={startTimer}
            className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-black font-black py-4 rounded-2xl shadow-lg transition-all text-base uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-black" />
            {status === 'IDLE' ? 'INICIAR' : 'REANUDAR'}
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="flex-1 bg-orange-500 hover:bg-orange-400 text-black font-black py-4 rounded-2xl shadow-lg transition-all text-base uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Pause className="w-5 h-5 fill-black" />
            PAUSAR
          </button>
        )}
        
        <button
          onClick={resetTimer}
          className="bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 p-4 rounded-2xl transition-all"
          title="Resetear Reloj"
        >
          <RotateCcw className="w-5 h-5 text-zinc-300" />
        </button>
      </div>

      {/* BOTONES DE ACCESO RÁPIDO / PRESETS */}
      {status === 'IDLE' && (
        <div className="border-t border-white/10 pt-4 space-y-2">
          <span className="text-[10px] text-zinc-400 font-bold uppercase block text-center">Presets Rápidos</span>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={applyPresetPro12}
              className={`p-2 rounded-xl text-[11px] font-black border transition-all text-center ${
                workTime === 180 && totalRounds === 12 
                  ? 'bg-yellow-400 text-black border-yellow-400' 
                  : 'bg-zinc-900/90 text-zinc-300 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              12 R (3m x 1m)
            </button>

            <button
              onClick={applyPresetPro10}
              className={`p-2 rounded-xl text-[11px] font-black border transition-all text-center ${
                workTime === 120 && totalRounds === 10 
                  ? 'bg-yellow-400 text-black border-yellow-400' 
                  : 'bg-zinc-900/90 text-zinc-300 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              10 R (2m x 30s)
            </button>

            <button
              onClick={applyPresetTabataClassic}
              className={`p-2 rounded-xl text-[11px] font-black border transition-all text-center ${
                workTime === 20 && totalRounds === 8 
                  ? 'bg-yellow-400 text-black border-yellow-400' 
                  : 'bg-zinc-900/90 text-zinc-300 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              Tabata (20s x 10s)
            </button>
          </div>
        </div>
      )}

    </div>
  );
      }
