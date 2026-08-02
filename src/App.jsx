import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Admin from './Admin'
import { Dumbbell, Lock, PlayCircle, Shield, Sparkles } from 'lucide-react'

export default function App() {
  const [activeTab, setActiveTab] = useState('feed') // 'feed' o 'admin'
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [unlockedPosts, setUnlockedPosts] = useState({}) // { postId: true }
  const [inputPasswords, setInputPasswords] = useState({})

  // Cargar publicaciones desde Supabase
  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Error cargando contenidos:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUnlock = (postId, correctPassword) => {
    const entered = inputPasswords[postId] || ''
    if (entered.trim() === correctPassword.trim()) {
      setUnlockedPosts(prev => ({ ...prev, [postId]: true }))
    } else {
      alert('Contraseña incorrecta')
    }
  }

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* HEADER / NAVEGACIÓN */}
      <header style={{
        backgroundColor: '#111',
        borderBottom: '1px solid #222',
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Dumbbell color="#ffde00" size={28} />
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', letterSpacing: '1px' }}>EL LEÓN</h1>
        </div>

        <nav style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => { setActiveTab('feed'); fetchPosts(); }}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: activeTab === 'feed' ? '#ffde00' : '#222',
              color: activeTab === 'feed' ? '#000' : '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Contenido
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: activeTab === 'admin' ? '#ffde00' : '#222',
              color: activeTab === 'admin' ? '#000' : '#fff',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Shield size={16} />
            Panel
          </button>
        </nav>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        {activeTab === 'admin' ? (
          <Admin />
        ) : (
          <div>
            <div style={{ marginBottom: '24px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Entrenamientos y Clases</h2>
              <p style={{ color: '#aaa', fontSize: '14px', margin: 0 }}>Accedé a las rutinas y videos oficiales</p>
            </div>

            {loading ? (
              <p style={{ textAlign: 'center', color: '#888', marginTop: '40px' }}>Cargando publicaciones...</p>
            ) : posts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#111', borderRadius: '12px', border: '1px solid #222' }}>
                <Sparkles size={36} color="#ffde00" style={{ marginBottom: '12px' }} />
                <p style={{ color: '#aaa' }}>Todavía no hay publicaciones. ¡Entrá al Panel para subir la primera!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '20px' }}>
                {posts.map((post) => {
                  const isPrivate = post.access_type === 'private'
                  const isUnlocked = unlockedPosts[post.id]

                  return (
                    <div 
                      key={post.id}
                      style={{
                        backgroundColor: '#111',
                        borderRadius: '12px',
                        border: '1px solid #222',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <span style={{ 
                            backgroundColor: '#222', 
                            color: '#ffde00', 
                            fontSize: '12px', 
                            padding: '4px 8px', 
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            textTransform: 'uppercase'
                          }}>
                            {post.category}
                          </span>
                          <h3 style={{ margin: '8px 0 4px 0', fontSize: '18px' }}>{post.title}</h3>
                        </div>

                        {isPrivate && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ffde00', fontSize: '12px' }}>
                            <Lock size={14} /> Exclusivo
                          </span>
                        )}
                      </div>

                      {post.description && (
                        <p style={{ color: '#ccc', fontSize: '14px', margin: 0, lineHeight: '1.5' }}>
                          {post.description}
                        </p>
                      )}

                      {/* LÓGICA DE VISUALIZACIÓN DE VIDEO */}
                      {isPrivate && !isUnlocked ? (
                        <div style={{ backgroundColor: '#181818', padding: '16px', borderRadius: '8px', border: '1px solid #333', textAlign: 'center', marginTop: '8px' }}>
                          <Lock size={28} color="#ffde00" style={{ marginBottom: '8px' }} />
                          <p style={{ fontSize: '14px', color: '#aaa', margin: '0 0 12px 0' }}>Este contenido requiere contraseña de alumno</p>
                          <div style={{ display: 'flex', gap: '8px', maxWidth: '300px', margin: '0 auto' }}>
                            <input
                              type="password"
                              placeholder="Contraseña"
                              value={inputPasswords[post.id] || ''}
                              onChange={(e) => setInputPasswords({ ...inputPasswords, [post.id]: e.target.value })}
                              style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#222', color: '#fff' }}
                            />
                            <button
                              onClick={() => handleUnlock(post.id, post.password)}
                              style={{ backgroundColor: '#ffde00', color: '#000', fontWeight: 'bold', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
                            >
                              Ver
                            </button>
                          </div>
                        </div>
                      ) : (
                        <a
                          href={post.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            backgroundColor: '#ffde00',
                            color: '#000',
                            padding: '10px 16px',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            textDecoration: 'none',
                            marginTop: '8px'
                          }}
                        >
                          <PlayCircle size={18} />
                          Abrir Video / Enlace
                        </a>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
