import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Download, Search } from 'lucide-react';

interface Registration {
  id: string;
  name: string;
  email: string;
  country: string;
  profile: string;
  created_at: string;
}

const AdminRegistrations = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterProfile, setFilterProfile] = useState('');

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('registrations').select('*').order('created_at', { ascending: false });
      setRegistrations((data as Registration[]) || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = registrations.filter((r) => {
    const matchesSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.email.toLowerCase().includes(search.toLowerCase()) || r.country.toLowerCase().includes(search.toLowerCase());
    const matchesProfile = !filterProfile || r.profile === filterProfile;
    return matchesSearch && matchesProfile;
  });

  const exportCSV = () => {
    const headers = ['Nombre', 'Email', 'País', 'Perfil', 'Fecha'];
    const rows = filtered.map((r) => [r.name, r.email, r.country, r.profile, new Date(r.created_at).toLocaleDateString('es-AR')]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inscripciones-epifest-2026.csv';
    a.click();
  };

  const inputClass = "rounded-xl bg-muted/50 border border-border px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50";

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-extrabold">Inscripciones ({filtered.length})</h2>
        <button onClick={exportCSV} className="btn-gold text-sm flex items-center gap-2">
          <Download className="w-4 h-4" /> Exportar CSV
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, email o país..."
            className={`${inputClass} pl-9 w-full`}
          />
        </div>
        <select
          value={filterProfile}
          onChange={(e) => setFilterProfile(e.target.value)}
          className={inputClass}
        >
          <option value="">Todos los perfiles</option>
          <option value="paciente">Paciente</option>
          <option value="familiar">Familiar</option>
          <option value="profesional">Profesional</option>
          <option value="otro">Otro</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left p-3 font-semibold text-foreground/70">Fecha</th>
                  <th className="text-left p-3 font-semibold text-foreground/70">Nombre</th>
                  <th className="text-left p-3 font-semibold text-foreground/70">Email</th>
                  <th className="text-left p-3 font-semibold text-foreground/70">País</th>
                  <th className="text-left p-3 font-semibold text-foreground/70">Perfil</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-b border-border/20">
                    <td className="p-3 text-foreground/60">{new Date(r.created_at).toLocaleDateString('es-AR')}</td>
                    <td className="p-3 font-medium">{r.name}</td>
                    <td className="p-3 text-foreground/70">{r.email}</td>
                    <td className="p-3">{r.country}</td>
                    <td className="p-3">
                      <span className="glass-card rounded-full px-3 py-1 text-xs">{r.profile}</span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="p-6 text-center text-foreground/50">Sin resultados</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRegistrations;
