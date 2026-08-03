import React, { useState, useEffect, useRef } from 'react';

export default function TabataTimer() {
  const [workTime, setWorkTime] = useState(180); // 3 min por defecto (Boxeo)
  const [restTime, setRestTime] = useState(60);   // 1 min descanso
  const [totalRounds, setTotalRounds] = useState(5);

  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(workTime);
  const [status, setStatus] = useState('IDLE'); // IDLE, WORK, REST, FINISHED
  const [isRunning, setIsRunning] = useState(false);

  const timerRef = useRef(null);

  // 🔔 Sintetizador de Campana de Boxeo Real (Web Audio API)
  const playBellSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      
      // Frecuencias metálicas armónicas de una campana de acero
      const frequencies = [800, 1200, 1650, 2100];
      const now = audioCtx.currentTime;

      frequencies.forEach((freq, index) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = index === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now);

        // Volumen decreciente según el armónico
        const baseGain = 0.3 / (index + 1);
        gain.gain.setValueAtTime(baseGain, now);
        // Decaimiento natural largo tipo campana
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + 2.5);
      });
    } catch (e) {
      console.log("Audio no soportado o requiere interacción previa del usuario");
    }
  };

  // Pitido corto para los últimos 3 segundos del round
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

  // Lógica del Cronómetro
  useEffect(() => {
    if (!isRunning) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 1) {
          if (prev <= 4) playBeep(400, 100); // Avisos de últimos 3 segundos
          return prev - 1;
        }

        // Cambio de Round / Descanso
        if (status === 'WORK') {
          if (currentRound >= totalRounds) {
            setIsRunning(false);
            setStatus('FINISHED');
            playBellSound(); // Campana final
            return 0;
          } else {
            playBellSound(); // Campana de fin de round
            setStatus('REST');
            return restTime;
          }
        } else if (status === 'REST') {
          playBellSound(); // Campana de inicio de nuevo round
          setCurrentRound((r) => r + 1);
          setStatus('WORK');
          return workTime;
        }
        return 0;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isRunning, status, currentRound, totalRounds, workTime, restTime]);

  const startTimer = () => {
    if (status === 'IDLE' || status === 'FINISHED') {
      setCurrentRound(1);
      setStatus('WORK');
      setTimeLeft(workTime);
      playBellSound(); // Campanazo al iniciar
    }
    setIsRunning(true);
  };

  const pauseTimer = () => setIsRunning(false);

  const resetTimer = () => {
    setIsRunning(false);
    setStatus('IDLE');
    setCurrentRound(1);
    setTimeLeft(workTime);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getBgColor = () => {
    if (status === 'WORK') return 'bg-red-600 animate-pulse';
    if (status === 'REST') return 'bg-green-600';
    return 'bg-zinc-900';
  };

  return (
    <div className={`max-w-md mx-auto rounded-2xl p-6 text-white shadow-2xl transition-colors duration-500 ${getBgColor()}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black tracking-wider uppercase">🥊 EL LEÓN TIMER</h2>
        <span className="text-sm font-semibold bg-black/40 px-3 py-1 rounded-full">
          Round {currentRound} / {totalRounds}
        </span>
      </div>

      <div className="text-center my-10">
        <p className="text-sm uppercase tracking-widest text-zinc-200 mb-2 font-bold">
          {status === 'WORK' && '🔥 ¡A DARLE CON TODO!'}
          {status === 'REST' && '💧 RESPIRÁ Y RECUPERÁ'}
          {status === 'IDLE' && 'LISTO PARA ENTRENAR'}
          {status === 'FINISHED' && '🏆 ¡ENTRENAMIENTO FINALIZADO!'}
        </p>
        <div className="text-7xl font-extrabold tracking-tighter drop-shadow-lg">
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="flex gap-3 justify-center mb-6">
        {!isRunning ? (
          <button
            onClick={startTimer}
            className="flex-1 bg-white text-black font-black py-3 rounded-xl shadow-lg hover:bg-zinc-200 transition text-lg"
          >
            {status === 'IDLE' ? '▶ INICIAR' : '▶ REANUDAR'}
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="flex-1 bg-yellow-500 text-black font-black py-3 rounded-xl shadow-lg hover:bg-yellow-400 transition text-lg"
          >
            ⏸ PAUSAR
          </button>
        )}
        <button
          onClick={resetTimer}
          className="bg-black/40 px-5 py-3 font-bold rounded-xl hover:bg-black/60 transition"
        >
          🔄
        </button>
      </div>

      {status === 'IDLE' && (
        <div className="border-t border-white/20 pt-4 flex gap-2 justify-center">
          <button
            onClick={() => { setWorkTime(180); setRestTime(60); setTotalRounds(5); setTimeLeft(180); }}
            className="text-xs bg-black/30 px-3 py-2 rounded-lg hover:bg-black/50 font-semibold"
          >
            Boxeo (3m / 1m)
          </button>
          <button
            onClick={() => { setWorkTime(120); setRestTime(30); setTotalRounds(4); setTimeLeft(120); }}
            className="text-xs bg-black/30 px-3 py-2 rounded-lg hover:bg-black/50 font-semibold"
          >
            Sparring (2m / 30s)
          </button>
          <button
            onClick={() => { setWorkTime(20); setRestTime(10); setTotalRounds(8); setTimeLeft(20); }}
            className="text-xs bg-black/30 px-3 py-2 rounded-lg hover:bg-black/50 font-semibold"
          >
            Tabata (20s / 10s)
          </button>
        </div>
      )}
    </div>
  );
}
