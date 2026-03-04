import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Trash2, Eye, EyeOff, Loader2, Package } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  photo_url: string | null;
  mercadopago_url: string | null;
  visible: boolean;
  display_order: number;
}

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('display_order');
    setProducts((data as Product[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const toggleVisibility = async (id: string, visible: boolean) => {
    await supabase.from('products').update({ visible: !visible }).eq('id', id);
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, visible: !visible } : p));
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('¿Eliminar este producto?')) return;
    await supabase.from('products').delete().eq('id', id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const data = {
      name: fd.get('name') as string,
      description: fd.get('description') as string || null,
      price: parseFloat(fd.get('price') as string) || 0,
      photo_url: fd.get('photo_url') as string || null,
      mercadopago_url: fd.get('mercadopago_url') as string || null,
      display_order: parseInt(fd.get('display_order') as string) || 0,
      visible: true,
    };

    if (editing) {
      await supabase.from('products').update(data).eq('id', editing.id);
    } else {
      await supabase.from('products').insert(data);
    }
    setSaving(false);
    setModalOpen(false);
    setEditing(null);
    fetchProducts();
  };

  const inputClass = "w-full rounded-xl bg-muted/50 border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-extrabold">Productos</h2>
        <button onClick={() => { setEditing(null); setModalOpen(true); }} className="btn-gold text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Agregar producto
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left p-3 font-semibold text-foreground/70">Foto</th>
                  <th className="text-left p-3 font-semibold text-foreground/70">Nombre</th>
                  <th className="text-left p-3 font-semibold text-foreground/70">Precio</th>
                  <th className="text-left p-3 font-semibold text-foreground/70">Orden</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-border/20">
                    <td className="p-3">
                      {p.photo_url ? (
                        <img src={p.photo_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <Package className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                    </td>
                    <td className="p-3 font-medium">{p.name}</td>
                    <td className="p-3">${p.price.toLocaleString('es-AR')}</td>
                    <td className="p-3">{p.display_order}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleVisibility(p.id, p.visible)} className="p-1.5 rounded-lg hover:bg-muted">
                          {p.visible ? <Eye className="w-4 h-4 text-accent" /> : <EyeOff className="w-4 h-4 text-foreground/40" />}
                        </button>
                        <button onClick={() => { setEditing(p); setModalOpen(true); }} className="text-xs text-accent hover:underline">Editar</button>
                        <button onClick={() => deleteProduct(p.id)} className="p-1.5 rounded-lg hover:bg-destructive/20">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={() => setModalOpen(false)}>
          <div className="glass-card rounded-3xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()} style={{ background: 'hsl(263, 70%, 18%)' }}>
            <h3 className="text-xl font-bold mb-4">{editing ? 'Editar producto' : 'Nuevo producto'}</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input name="name" required defaultValue={editing?.name} placeholder="Nombre *" className={inputClass} />
              <textarea name="description" defaultValue={editing?.description || ''} placeholder="Descripción" rows={2} className={inputClass} />
              <input name="price" type="number" step="0.01" required defaultValue={editing?.price} placeholder="Precio *" className={inputClass} />
              <input name="photo_url" defaultValue={editing?.photo_url || ''} placeholder="URL de foto" className={inputClass} />
              <input name="mercadopago_url" defaultValue={editing?.mercadopago_url || ''} placeholder="URL de Mercado Pago" className={inputClass} />
              <input name="display_order" type="number" defaultValue={editing?.display_order || 0} placeholder="Orden" className={inputClass} />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="glass-card rounded-full px-6 py-2 text-sm flex-1">Cancelar</button>
                <button type="submit" disabled={saving} className="btn-gold text-sm flex-1 flex items-center justify-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />} Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
