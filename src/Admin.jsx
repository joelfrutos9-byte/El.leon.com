import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { PackagePlus, FileText, Check, AlertCircle } from 'lucide-react';

export default function Admin() {
  const [tabAdmin, setTabAdmin] = useState('post'); // 'post' | 'producto'
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  // Formulario Post (Actualidad)
  const [postForm, setPostForm] = useState({
    title: '',
    category: 'Vlog / Diario Deportivo',
    video_url: '',
    description: ''
  });

  // Formulario Producto (León Store)
  const [prodForm, setProdForm] = useState({
    name: '',
    tagline: '',
    line: 'LÍNEA ORIGINAL',
    price: '',
    deposit: '',
    image: '',
    badge: 'PREVENTA',
    is_green: false,
    description: '',
    sizes: 'S, M, L, XL, XXL'
  });

  // Guardar Post
  const handleSavePost = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje(null);

    try {
      const { error } = await supabase.from('posts').insert([postForm]);
      if (error) throw error;

      setMensaje({ type: 'success', text: '¡Publicación subida a Actualidad con éxito!' });
      setPostForm({ title: '', category: 'Vlog / Diario Deportivo', video_url: '', description: '' });
    } catch (err) {
      setMensaje({ type: 'error', text: `Error: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  // Guardar Producto
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje(null);

    const priceNum = parseFloat(prodForm.price) || 0;
    const depositNum = parseFloat(prodForm.deposit) || (priceNum / 2);
    const balanceNum = priceNum - depositNum;
    const sizesArray = prodForm.sizes.split(',').map(s => s.trim()).filter(Boolean);

    try {
      const { error } = await supabase.from('products').insert([{
        name: prodForm.name,
        tagline: prodForm.tagline,
        line: prodForm.line,
        price: priceNum,
        deposit: depositNum,
        balance: balanceNum,
        image: prodForm.image,
        badge: prodForm.badge,
        is_green: prodForm.is_green,
        description: prodForm.description,
        sizes: sizesArray
      }]);

      if (error) throw error;

      setMensaje({ type: 'success', text: '¡Producto cargado en León Store con éxito!' });
      setProdForm({
        name: '', tagline: '', line: 'LÍNEA ORIGINAL', price: '', deposit: '',
        image: '', badge: 'PREVENTA', is_green: false, description: '', sizes: 'S, M, L, XL, XXL'
      });
    } catch (err) {
      setMensaje({ type: 'error', text: `Error: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-zinc-950 border border-zinc-800 p-6 sm:p-8 rounded-3xl space-y-6">
      
      {/* Botones de alternancia */}
      <div className="flex gap-2 border-b border-zinc-800 pb-4">
        <button
          type="button"
          onClick={() => { setTabAdmin('post'); setMensaje(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
            tabAdmin === 'post' ? 'bg-yellow-400 text-black' : 'bg-zinc-900 text-zinc-400'
          }`}
        >
          <FileText className="w-4 h-4" />
          Subir a Actualidad
        </button>

        <button
          type="button"
          onClick={() => { setTabAdmin('producto'); setMensaje(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
            tabAdmin === 'producto' ? 'bg-yellow-400 text-black' : 'bg-zinc-900 text-zinc-400'
          }`}
        >
          <PackagePlus className="w-4 h-4" />
          Cargar Producto Store
        </button>
      </div>

      {/* Alertas */}
      {mensaje && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${
          mensaje.type === 'success' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-red-950 text-red-400 border border-red-500/30'
        }`}>
          {mensaje.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{mensaje.text}</span>
        </div>
      )}

      {/* FORMULARIO POSTS */}
      {tabAdmin === 'post' && (
        <form onSubmit={handleSavePost} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-400 font-bold uppercase mb-1">Título *</label>
            <input
              type="text"
              required
              placeholder="Ej: Desde Adentro #01 | Primer Festival"
              value={postForm.title}
              onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label className="block text-zinc-400 font-bold uppercase mb-1">Categoría</label>
            <select
              value={postForm.category}
              onChange={(e) => setPostForm({ ...postForm, category: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400"
            >
              <option value="Vlog / Diario Deportivo">Vlog / Diario Deportivo</option>
              <option value="Noticia / Comunicado">Noticia / Comunicado</option>
              <option value="Operación Santa Cruz">Operación Santa Cruz</option>
            </select>
          </div>

          <div>
            <label className="block text-zinc-400 font-bold uppercase mb-1">Link del Video (YouTube)</label>
            <input
              type="text"
              placeholder="https://youtu.be/..."
              value={postForm.video_url}
              onChange={(e) => setPostForm({ ...postForm, video_url: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label className="block text-zinc-400 font-bold uppercase mb-1">Descripción</label>
            <textarea
              rows="4"
              placeholder="Escribí el texto de la publicación..."
              value={postForm.description}
              onChange={(e) => setPostForm({ ...postForm, description: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black py-3.5 rounded-xl text-xs uppercase tracking-wider"
          >
            {loading ? 'Publicando...' : 'Publicar en Actualidad'}
          </button>
        </form>
      )}

      {/* FORMULARIO PRODUCTOS */}
      {tabAdmin === 'producto' && (
        <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-400 font-bold uppercase mb-1">Nombre del Producto *</label>
            <input
              type="text"
              required
              placeholder="Ej: EL LEÓN — HOODIE NEGRO"
              value={prodForm.name}
              onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-400 font-bold uppercase mb-1">Subtítulo / Bajada</label>
              <input
                type="text"
                placeholder="Ej: BUZO OVERSIZE HEAVY COTTON"
                value={prodForm.tagline}
                onChange={(e) => setProdForm({ ...prodForm, tagline: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-bold uppercase mb-1">Etiqueta de Colección</label>
              <input
                type="text"
                placeholder="Ej: LÍNEA ORIGINAL / BOLIVIA 2026"
                value={prodForm.line}
                onChange={(e) => setProdForm({ ...prodForm, line: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-400 font-bold uppercase mb-1">Precio Total (ARS) *</label>
              <input
                type="number"
                required
                placeholder="35000"
                value={prodForm.price}
                onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-bold uppercase mb-1">Seña (Dejá vacío si es el 50%)</label>
              <input
                type="number"
                placeholder="17500"
                value={prodForm.deposit}
                onChange={(e) => setProdForm({ ...prodForm, deposit: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-400 font-bold uppercase mb-1">URL de la Imagen</label>
              <input
                type="text"
                placeholder="/1785149020942.png o https://..."
                value={prodForm.image}
                onChange={(e) => setProdForm({ ...prodForm, image: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-bold uppercase mb-1">Talles Separados por Coma</label>
              <input
                type="text"
                value={prodForm.sizes}
                onChange={(e) => setProdForm({ ...prodForm, sizes: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 bg-zinc-900 p-3 rounded-xl border border-zinc-800">
            <input
              type="checkbox"
              id="is_green"
              checked={prodForm.is_green}
              onChange={(e) => setProdForm({ ...prodForm, is_green: e.target.checked })}
              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
            />
            <label htmlFor="is_green" className="text-zinc-300 font-bold cursor-pointer">
              ¿Es un producto verde? (100% a beneficio de Operación Santa Cruz)
            </label>
          </div>

          <div>
            <label className="block text-zinc-400 font-bold uppercase mb-1">Descripción del Producto</label>
            <textarea
              rows="3"
              placeholder="Detalles del tejido, confección, etc..."
              value={prodForm.description}
              onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-400 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-3.5 rounded-xl text-xs uppercase tracking-wider"
          >
            {loading ? 'Cargando...' : 'Guardar Producto en la Tienda'}
          </button>
        </form>
      )}

    </div>
  );
}
```eof

Con esto tenés el control total: subís posts y cargás indumentaria directamente desde tu teléfono o la compu desde la misma app.
