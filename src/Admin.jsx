import React, { useState } from 'react'
import { supabase } from './supabaseClient'
import { Lock, PlusCircle, CheckCircle, AlertCircle } from 'lucide-react'

export default function Admin() {
  const [pin, setPin] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [pinError, setPinError] = useState(false)

  // Formulario
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Boxeo')
  const [accessType, setAccessType] = useState('public')
  const [videoUrl, setVideoUrl] = useState('')
  const [description, setDescription] = useState('')
  const [password, setPassword] = useState('')

  // Estados de envío
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const PIN_CORRECTO = '0811' // Tu PIN de acceso personalizado

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
            password: accessType === 'private' ? password : null,
          }
        ])

      if (error) throw error

      setMessage({ type: 'success', text: '¡Publicación creada con éxito!' })
      // Limpiar formulario
      setTitle('')
      setVideoUrl('')
      setDescription('')
      setPassword('')
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al guardar: ' + error.message })
    } finally {
      setLoading(false)
    }
  }

  // PANTALLA DE ACCESO POR PIN
  if (!isAuthenticated) {
    return (
      <div style={{ padding: '20px', maxWidth: '400px', margin: '40px auto', textAlign: 'center', backgroundColor: '#111', color: '#fff', borderRadius: '12px', border: '1px solid #333' }}>
        <Lock size={48} color="#ffde00" style={{ marginBottom: '16px' }} />
        <h2>Panel Creador - El León</h2>
        <p style={{ color: '#aaa', fontSize: '14px' }}>Ingresá tu PIN para administrar contenido</p>

        <form onSubmit={handleLogin} style={{ marginTop: '20px' }}>
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
          {pinError && <p style={{ color: '#ff4d4d', fontSize: '14px' }}>PIN incorrecto</p>}
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
              fontSize: '16px'
            }}
          >
            Ingresar
          </button>
        </form>
      </div>
    )
  }

  // PANTALLA DEL PANEL DE CONTROL
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', color: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>🥊 Cargar Nuevo Contenido</h2>
        <button 
          onClick={() => setIsAuthenticated(false)}
          style={{ background: 'transparent', border: '1px solid #555', color: '#aaa', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}
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
          gap: '8px'
        }}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#ccc' }}>Título de la publicación *</label>
          <input
            type="text"
            required
            placeholder="Ej: Rutina de Sombra y Desplazamientos"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#222', color: '#fff', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#ccc' }}>Categoría *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#222', color: '#fff', boxSizing: 'border-box' }}
          >
            <option value="Boxeo">Boxeo / Técnica</option>
            <option value="Rutinas">Rutinas / Entrenamiento</option>
            <option value="Vlogs">Vlogs / El Diario Deportivo</option>
            <option value="Privado">Exclusivo Alumnos</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#ccc' }}>Link del Video (YouTube / Instagram / TikTok / Drive) *</label>
          <input
            type="url"
            required
            placeholder="https://..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#222', color: '#fff', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#ccc' }}>Tipo de Acceso</label>
          <select
            value={accessType}
            onChange={(e) => setAccessType(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#222', color: '#fff', boxSizing: 'border-box' }}
          >
            <option value="public">Público (Para todos)</option>
            <option value="private">Privado (Con Contraseña)</option>
          </select>
        </div>

        {accessType === 'private' && (
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#ffde00' }}>Contraseña de acceso para alumnos</label>
            <input
              type="text"
              required
              placeholder="Ej: leontraining2026"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ffde00', backgroundColor: '#222', color: '#fff', boxSizing: 'border-box' }}
            />
          </div>
        )}

        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#ccc' }}>Descripción o Notas adicionales</label>
          <textarea
            rows="4"
            placeholder="Detalles del entrenamiento, series, repeticiones..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#222', color: '#fff', boxSizing: 'border-box', resize: 'vertical' }}
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
            fontSize: '16px',
            marginTop: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <PlusCircle size={20} />
          {loading ? 'Guardando...' : 'Publicar Contenido'}
        </button>
      </form>
    </div>
  )
}
