import React, { useState } from 'react'
import { supabase } from '../supabaseClient' // Ajustá la ruta según tu proyecto

export function RoleModal({ user, onComplete }) {
  const [selectedRole, setSelectedRole] = useState(null)
  const [passkey, setPasskey] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const TEACHER_KEY = "0811"

  const handleSaveRole = async () => {
    setErrorMsg('')

    if (selectedRole === 'profesor' && passkey !== TEACHER_KEY) {
      setErrorMsg('Clave de profesor incorrecta.')
      return
    }

    setLoading(true)

    // Guarda o actualiza el rol en Supabase
    const { error } = await supabase
      .from('profiles')
      .upsert({ 
        id: user.id, 
        email: user.email,
        role: selectedRole,
        updated_at: new Date()
      })

    setLoading(false)

    if (error) {
      setErrorMsg('Error al guardar el rol. Reintentá.')
    } else {
      onComplete(selectedRole)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-900 border border-amber-400/30 rounded-2xl p-6 max-w-md w-full shadow-2xl text-white">
        <h2 className="text-xl font-bold text-amber-400 mb-2 text-center">
          ¡Bienvenido a El León!
        </h2>
        <p className="text-zinc-400 text-sm text-center mb-6">
          Seleccioná tu tipo de cuenta:
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            type="button"
            onClick={() => { setSelectedRole('alumno'); setErrorMsg(''); }}
            className={`p-4 rounded-xl font-semibold border flex flex-col items-center gap-2 transition ${
              selectedRole === 'alumno' 
                ? 'bg-amber-400 text-black border-amber-400' 
                : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-500'
            }`}
          >
            <span className="text-2xl">🥊</span>
            <span>Alumno</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('profesor')}
            className={`p-4 rounded-xl font-semibold border flex flex-col items-center gap-2 transition ${
              selectedRole === 'profesor' 
                ? 'bg-amber-400 text-black border-amber-400' 
                : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-500'
            }`}
          >
            <span className="text-2xl">📋</span>
            <span>Profesor</span>
          </button>
        </div>

        {selectedRole === 'profesor' && (
          <div className="mb-4">
            <label className="block text-xs text-zinc-400 mb-1">
              Clave de Acceso Profesor:
            </label>
            <input
              type="password"
              placeholder="Ingresá la clave"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:border-amber-400"
            />
          </div>
        )}

        {errorMsg && (
          <p className="text-red-400 text-xs text-center mb-4">
            {errorMsg}
          </p>
        )}

        <button
          onClick={handleSaveRole}
          disabled={!selectedRole || loading}
          className="w-full py-3 bg-amber-400 text-black font-bold rounded-xl hover:bg-amber-300 disabled:opacity-50 transition"
        >
          {loading ? 'Guardando...' : 'Confirmar'}
        </button>
      </div>
    </div>
  )
}
