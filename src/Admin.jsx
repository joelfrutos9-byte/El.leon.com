import React, { useState } from 'react'
import { supabase } from './supabaseClient'
import { Lock, PlusCircle, CheckCircle, AlertCircle, UserCheck, Search, Activity, Scale, Calendar } from 'lucide-react'

export default function Admin() {
  const [pin, setPin] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [pinError, setPinError] = useState(false)
  const [activeTabAdmin, setActiveTabAdmin] = useState('cargar') // 'cargar' o 'supervisar'

  // Formulario de contenido
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Rutina Personalizada')
  const [accessType, setAccessType] = useState('private')
  const [videoUrl, setVideoUrl] = useState('')
  const [description, setDescription] = useState('')
  const [clientKey, setClientKey] = useState('')

  // Supervisión de Alumno
  const [searchKey, setSearchKey] = useState('')
  const [alumnosRegistros, setAlumnosRegistros] = useState([])
  const [cargandoSupervision, setCargandoSupervision] = useState(false)
  const [busquedaRealizada, setBusquedaRealizada] = useState(false)

  // Estados de envío
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const PIN_CORRECTO = '0811'

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

  const handleBuscarAlumno = async (e) => {
    e.preventDefault()
    if (!searchKey.trim()) return

    setCargandoSupervision(true)
    setBusquedaRealizada(true)

    try {
      const { data, error } = await supabase
        .from('registros_alumnos')
        .select('*')
        .eq('student_key', searchKey.trim().toLowerCase())
        .order('created_at', { ascending: false })

      if (error) throw error
      setAlumnosRegistros(data || [])
    } catch (err) {
      console.log('Error buscando registros:', err.message)
      setAlumnosRegistros([])
    } finally {
      setCargandoSupervision(false)
    }
  }

  // PANTALLA DE ACCESO POR PIN
  if (!isAuthenticated) {
    return (
      <div style={{ padding: '20px', maxWidth: '400px', margin: '40px auto', textAlign: 'center', backgroundColor: '#111', color: '#fff', borderRadius: '16px', border: '1px solid #333' }}>
        <Lock size={48} color="#ffde00" style={{ marginBottom: '16px' }} />
        <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Panel Creador - El León</h2>
        <p style={{ color: '#aaa', fontSize: '13px', marginBottom: '20px' }}>Ingresá tu PIN para administrar contenido y supervisar alumnos</p>

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
    <div style={{ padding: '20px', maxWidth: '650px', margin: '0 auto', color: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>🥊 Panel de Control Creador</h2>
        <button 
          onClick={() => setIsAuthenticated(false)}
          style={{ background: 'transparent', border: '1px solid #555', color: '#aaa', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
        >
          Salir
        </button>
      </div>

      {/* BOTONES NAVEGACIÓN PANEL */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTabAdmin('cargar')}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: activeTabAdmin === 'cargar' ? '#ffde00' : '#222',
            color: activeTabAdmin === 'cargar' ? '#000' : '#fff',
            fontWeight: 'bold',
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          ➕ Asignar / Cargar Rutina
        </button>

        <button
          onClick={() => setActiveTabAdmin('supervisar')}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: activeTabAdmin === 'supervisar' ? '#ffde00' : '#222',
            color: activeTabAdmin === 'supervisar' ? '#000' : '#fff',
            fontWeight: 'bold',
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          📊 Supervisar Alumnos
        </button>
      </div>

      {activeTabAdmin === 'cargar' ? (
        <div>
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
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#ccc' }}>Link del Video *</label>
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
      ) : (
        /* VISTA DE SUPERVISIÓN DE ALUMNOS */
        <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #222' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', color: '#ffde00' }}>
            🔍 Supervisar Progreso de Alumnos
          </h3>
          <p style={{ fontSize: '12px', color: '#aaa', marginBottom: '16px' }}>
            Ingresá la clave del alumno para ver sus días entrenados, RPE promedio, evolución de peso y notas.
          </p>

          <form onSubmit={handleBuscarAlumno} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Clave del alumno (Ej: marcos2026)"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }}
            />
            <button
              type="submit"
              style={{ backgroundColor: '#ffde00', color: '#000', fontWeight: 'bold', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
            >
              Buscar
            </button>
          </form>

          {cargandoSupervision ? (
            <p style={{ fontSize: '12px', color: '#888', textAlign: 'center' }}>Cargando registros...</p>
          ) : busquedaRealizada && (
            <div>
              {alumnosRegistros.length === 0 ? (
                <p style={{ fontSize: '13px', color: '#ff4d4d', textAlign: 'center' }}>
                  No hay entrenamientos registrados aún para la clave "{searchKey}".
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <p style={{ fontSize: '13px', color: '#6be698', fontWeight: 'bold' }}>
                    ¡{alumnosRegistros.length} sesiones registradas por el alumno!
                  </p>

                  {alumnosRegistros.map((reg) => (
                    <div key={reg.id} style={{ backgroundColor: '#1a1a1a', padding: '12px', borderRadius: '8px', border: '1px solid #333' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                        <span style={{ color: '#aaa' }}>
                          📅 {new Date(reg.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </span>
                        <span style={{ color: reg.completado ? '#6be698' : '#e66b6b', fontWeight: 'bold' }}>
                          {reg.completado ? 'CUMPLIDO ✅' : 'INCOMPLETO ❌'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#fff', marginBottom: '6px' }}>
                        <span>⚡ RPE: <strong style={{ color: '#ffde00' }}>{reg.intensidad}/10</strong></span>
                        {reg.peso && <span>⚖️ Peso: <strong>{reg.peso} kg</strong></span>}
                      </div>

                      {reg.notas && (
                        <p style={{ fontSize: '12px', color: '#ccc', fontStyle: 'italic', margin: 0, backgroundColor: '#000', padding: '8px', borderRadius: '6px' }}>
                          "{reg.notas}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
                  }
