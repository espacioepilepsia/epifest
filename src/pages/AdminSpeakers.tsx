import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Trash2, Eye, EyeOff, Loader2, User } from 'lucide-react';

interface Speaker {
  id: string;
  name: string;
  title: string | null;
  institution: string | null;
  bio: string | null;
  photo_url: string | null;
  visible: boolean;
  display_order: number;
}

const AdminSpeakers = () => {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Speaker | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchSpeakers = async () => {
    const { data } = await supabase.from('speakers').select('*').order('display_order');
    setSpeakers((data as Speaker[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchSpeakers(); }, []);

  const toggleVisibility = async (id: string, visible: boolean) => {
    await supabase.from('speakers').update({ visible: !visible }).eq('id', id);
    setSpeakers((prev) => prev.map((s) => s.id === id ? { ...s, visible: !visible } : s));
  };

  const deleteSpeaker = async (id: string) => {
    if (!confirm('¿Eliminar este orador?')) return;
    await supabase.from('speakers').delete().eq('id', id);
    setSpeakers((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const data = {
      name: fd.get('name') as string,
      title: fd.get('title') as string || null,
      institution: fd.get('institution') as string || null,
      bio: fd.get('bio') as string || null,
      photo_url: fd.get('photo_url') as string || null,
      display_order: parseInt(fd.get('display_order') as string) || 0,
      visible: true,
    };

    if (editing) {
      await supabase.from('speakers').update(data).eq('id', editing.id);
    } else {
      await supabase.from('speakers').insert(data);
    }
    setSaving(false);
    setModalOpen(false);
    setEditing(null);
    fetchSpeakers();
  };

  const inputClass = "w-full rounded-xl bg-muted/50 border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-extrabold">Oradores</h2>
        <button onClick={() => { setEditing(null); setModalOpen(true); }} className="btn-gold text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Agregar orador
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
                  <th className="text-left p-3 font-semibold text-foreground/70">Título</th>
                  <th className="text-left p-3 font-semibold text-foreground/70">Institución</th>
                  <th className="text-left p-3 font-semibold text-foreground/70">Orden</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {speakers.map((s) => (
                  <tr key={s.id} className="border-b border-border/20">
                    <td className="p-3">
                      {s.photo_url ? (
                        <img src={s.photo_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <User className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                    </td>
                    <td className="p-3 font-medium">{s.name}</td>
                    <td className="p-3 text-foreground/70">{s.title}</td>
                    <td className="p-3 text-foreground/70">{s.institution}</td>
                    <td className="p-3">{s.display_order}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleVisibility(s.id, s.visible)} className="p-1.5 rounded-lg hover:bg-muted">
                          {s.visible ? <Eye className="w-4 h-4 text-accent" /> : <EyeOff className="w-4 h-4 text-foreground/40" />}
                        </button>
                        <button onClick={() => { setEditing(s); setModalOpen(true); }} className="text-xs text-accent hover:underline">Editar</button>
                        <button onClick={() => deleteSpeaker(s.id)} className="p-1.5 rounded-lg hover:bg-destructive/20">
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={() => setModalOpen(false)}>
          <div className="glass-card rounded-3xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()} style={{ background: 'hsl(263, 70%, 18%)' }}>
            <h3 className="text-xl font-bold mb-4">{editing ? 'Editar orador' : 'Nuevo orador'}</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input name="name" required defaultValue={editing?.name} placeholder="Nombre *" className={inputClass} />
              <input name="title" defaultValue={editing?.title || ''} placeholder="Título" className={inputClass} />
              <input name="institution" defaultValue={editing?.institution || ''} placeholder="Institución" className={inputClass} />
              <textarea name="bio" defaultValue={editing?.bio || ''} placeholder="Bio" rows={2} className={inputClass} />
              <input name="photo_url" defaultValue={editing?.photo_url || ''} placeholder="URL de foto" className={inputClass} />
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

export default AdminSpeakers;
