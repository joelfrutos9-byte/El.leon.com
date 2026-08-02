import React, { useState } from 'react'
import { supabase } from './supabaseClient'
import { Lock, PlusCircle, CheckCircle, AlertCircle, UserCheck } from 'lucide-react'

export default function Admin() {
  const [pin, setPin] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [pinError, setPinError] = useState(false)

  // Formulario de contenido
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Rutina Personalizada')
  const [accessType, setAccessType] = useState('private') // 'public' o 'private'
  const [videoUrl, setVideoUrl] = useState('')
  const [description, setDescription] = useState('')
  const [clientKey, setClientKey] = useState('') // Clave única del alumno

  // Estados de envío
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const PIN_CORRECTO = '0811' // PIN de acceso Creador

  const handleLogin = (e) => {
    e.preventDefault()
    if (pin === PIN_CORRECTO) {
      setIsAuthenticated(true)
      setPinError(false)
    } else {
      setPinError(true)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (accessType === 'private' && !clientKey.trim()) {
      setMessage({ type: 'error', text: 'Debes definir una clave única para el alumno.' })
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            title,
            category,
            access_type: accessType,
            video_url: videoUrl,
            description,
            password: accessType === 'private' ? clientKey.trim().toLowerCase() : null,
          }
        ])

      if (error) throw error

      setMessage({ 
        type: 'success', 
        text: accessType === 'private' 
          ? `¡Rutina asignada al alumno con clave "${clientKey.trim().toLowerCase()}"!` 
          : '¡Publicación pública guardada!' 
      })

      // Limpiar formulario
      setTitle('')
      setVideoUrl('')
      setDescription('')
      setClientKey('')
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al guardar: ' + error.message })
    } finally {
      setLoading(false)
    }
  }

  // PANTALLA DE ACCESO POR PIN
  if (!isAuthenticated) {
    return (
      <div style={{ padding: '20px', maxWidth: '400px', margin: '40px auto', textAlign: 'center', backgroundColor: '#111', color: '#fff', borderRadius: '16px', border: '1px solid #333' }}>
        <Lock size={48} color="#ffde00" style={{ marginBottom: '16px' }} />
        <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Panel Creador - El León</h2>
        <p style={{ color: '#aaa', fontSize: '13px', marginBottom: '20px' }}>Ingresá tu PIN para administrar rutinas de alumnos</p>

        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="PIN de acceso"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '18px',
              textAlign: 'center',
              borderRadius: '8px',
              border: '1px solid #444',
              backgroundColor: '#222',
              color: '#fff',
              marginBottom: '12px',
              boxSizing: 'border-box'
            }}
          />
          {pinError && <p style={{ color: '#ff4d4d', fontSize: '14px', marginBottom: '12px' }}>PIN incorrecto</p>}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#ffde00',
              color: '#000',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '15px'
            }}
          >
            Ingresar al Panel
          </button>
        </form>
      </div>
    )
  }

  // PANTALLA DEL PANEL DE CONTROL
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', color: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>🥊 Cargar / Asignar Rutina</h2>
        <button 
          onClick={() => setIsAuthenticated(false)}
          style={{ background: 'transparent', border: '1px solid #555', color: '#aaa', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
        >
          Salir
        </button>
      </div>

      {message && (
        <div style={{
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '20px',
          backgroundColor: message.type === 'success' ? '#1b4d2e' : '#4d1b1b',
          color: message.type === 'success' ? '#6be698' : '#e66b6b',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px'
        }}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#ccc' }}>Tipo de Publicación *</label>
          <select
            value={accessType}
            onChange={(e) => setAccessType(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#222', color: '#fff', boxSizing: 'border-box' }}
          >
            <option value="private">🔒 Rutina Personalizada (Privado para un alumno)</option>
            <option value="public">🌐 Clase / Video Público (Para todos)</option>
          </select>
        </div>

        {accessType === 'private' && (
          <div style={{ backgroundColor: '#181818', padding: '14px', borderRadius: '10px', border: '1px solid #ffde00' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#ffde00', fontWeight: 'bold' }}>
              🔑 Clave de Acceso Única para el Alumno *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: marcos2026, juan-box, etc."
              value={clientKey}
              onChange={(e) => setClientKey(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ffde00', backgroundColor: '#000', color: '#fff', boxSizing: 'border-box' }}
            />
            <p style={{ color: '#aaa', fontSize: '11px', marginTop: '6px', margin: 0 }}>
              El alumno ingresará esta clave exacta en la App para ver su rutina.
            </p>
          </div>
        )}

        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#ccc' }}>Título de la Rutina / Clase *</label>
          <input
            type="text"
            required
            placeholder="Ej: Rutina Bloque Fuerza y Sparring - Marcos"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#222', color: '#fff', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#ccc' }}>Categoría</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#222', color: '#fff', boxSizing: 'border-box' }}
          >
            <option value="Rutina Personalizada">Rutina Personalizada</option>
            <option value="Boxeo Técnico">Boxeo Técnico</option>
            <option value="Acondicionamiento">Acondicionamiento Físico</option>
            <option value="Vlog / Diario">Vlog / Diario Deportivo</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#ccc' }}>Link del Video (YouTube / Instagram / TikTok / Drive) *</label>
          <input
            type="url"
            required
            placeholder="https://..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#222', color: '#fff', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#ccc' }}>Instrucciones / Descripción detallada</label>
          <textarea
            rows="5"
            placeholder="Escribí los ejercicios, rounds, descansos, repeticiones..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#222', color: '#fff', boxSizing: 'border-box', resize: 'vertical' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px',
            backgroundColor: '#ffde00',
            color: '#000',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '15px',
            marginTop: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <PlusCircle size={20} />
          {loading ? 'Guardando...' : 'Asignar / Publicar Rutina'}
        </button>
      </form>
    </div>
  )
}
