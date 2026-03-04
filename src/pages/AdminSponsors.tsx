import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Trash2, Eye, EyeOff, Loader2, Building2 } from 'lucide-react';

interface Sponsor {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  visible: boolean;
  display_order: number;
}

const AdminSponsors = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Sponsor | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchSponsors = async () => {
    const { data } = await supabase.from('sponsors').select('*').order('display_order');
    setSponsors((data as Sponsor[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchSponsors(); }, []);

  const toggleVisibility = async (id: string, visible: boolean) => {
    await supabase.from('sponsors').update({ visible: !visible }).eq('id', id);
    setSponsors((prev) => prev.map((s) => s.id === id ? { ...s, visible: !visible } : s));
  };

  const deleteSponsor = async (id: string) => {
    if (!confirm('¿Eliminar este sponsor?')) return;
    await supabase.from('sponsors').delete().eq('id', id);
    setSponsors((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const data = {
      name: fd.get('name') as string,
      logo_url: fd.get('logo_url') as string || null,
      website_url: fd.get('website_url') as string || null,
      display_order: parseInt(fd.get('display_order') as string) || 0,
      visible: true,
    };

    if (editing) {
      await supabase.from('sponsors').update(data).eq('id', editing.id);
    } else {
      await supabase.from('sponsors').insert(data);
    }
    setSaving(false);
    setModalOpen(false);
    setEditing(null);
    fetchSponsors();
  };

  const inputClass = "w-full rounded-xl bg-muted/50 border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-extrabold">Sponsors</h2>
        <button onClick={() => { setEditing(null); setModalOpen(true); }} className="btn-gold text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Agregar sponsor
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
                  <th className="text-left p-3 font-semibold text-foreground/70">Logo</th>
                  <th className="text-left p-3 font-semibold text-foreground/70">Nombre</th>
                  <th className="text-left p-3 font-semibold text-foreground/70">Web</th>
                  <th className="text-left p-3 font-semibold text-foreground/70">Orden</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {sponsors.map((s) => (
                  <tr key={s.id} className="border-b border-border/20">
                    <td className="p-3">
                      {s.logo_url ? (
                        <img src={s.logo_url} alt="" className="h-8 object-contain" />
                      ) : (
                        <Building2 className="w-8 h-8 text-muted-foreground" />
                      )}
                    </td>
                    <td className="p-3 font-medium">{s.name}</td>
                    <td className="p-3 text-foreground/70 text-xs">{s.website_url || '—'}</td>
                    <td className="p-3">{s.display_order}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleVisibility(s.id, s.visible)} className="p-1.5 rounded-lg hover:bg-muted">
                          {s.visible ? <Eye className="w-4 h-4 text-accent" /> : <EyeOff className="w-4 h-4 text-foreground/40" />}
                        </button>
                        <button onClick={() => { setEditing(s); setModalOpen(true); }} className="text-xs text-accent hover:underline">Editar</button>
                        <button onClick={() => deleteSponsor(s.id)} className="p-1.5 rounded-lg hover:bg-destructive/20">
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
            <h3 className="text-xl font-bold mb-4">{editing ? 'Editar sponsor' : 'Nuevo sponsor'}</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input name="name" required defaultValue={editing?.name} placeholder="Nombre *" className={inputClass} />
              <input name="logo_url" defaultValue={editing?.logo_url || ''} placeholder="URL del logo" className={inputClass} />
              <input name="website_url" defaultValue={editing?.website_url || ''} placeholder="Sitio web" className={inputClass} />
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

export default AdminSponsors;
