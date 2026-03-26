import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Download, Search, ChevronDown, ChevronUp } from 'lucide-react';

interface Registration {
  id: string;
  name: string;
  email: string;
  country: string;
  profile: string;
  created_at: string;
  // Campos extra
  edad?: string;
  genero?: string;
  ciudad?: string;
  picnic?: string;
  relacion?: string;
  info?: string;
  comentarios?: string;
}

const AdminRegistrations = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Filtros individuales por columna
  const [filters, setFilters] = useState({
    fecha: '',
    name: '',
    email: '',
    country: '',
    ciudad: '',
    edad: '',
    genero: '',
    profile: '',
    picnic: '',
    info: '',
    comentarios: ''
  });

  useEffect(() => {
    const fetch = async () => {
      // 1. Obtener de la tabla registrations
      const { data: regs } = await supabase.from('registrations').select('*').order('created_at', { ascending: false });
      
      // 2. Obtener de la tabla contact_messages (donde están todos los campos detallados)
      const { data: msgs } = await supabase.from('contact_messages')
        .select('*')
        .or('extra_data->>asunto.eq.inscripcion_epifest,extra_data->>asunto.eq.picnic')
        .order('created_at', { ascending: false });

      // 3. Unificar y priorizar la información de contact_messages si existe el mismo email
      const map = new Map<string, Registration>();
      
      (regs || []).forEach(r => {
        map.set(r.email.toLowerCase(), { ...r });
      });

      (msgs || []).forEach(m => {
        const extra = m.extra_data as any;
        const email = m.email.toLowerCase();
        const existing = map.get(email);
        
        map.set(email, {
          id: existing?.id || m.id,
          name: m.name,
          email: m.email,
          country: extra.pais || extra.ciudad || existing?.country || 'Argentina',
          profile: extra.relacion || existing?.profile || 'otro',
          created_at: m.created_at,
          // Datos extra del formulario
          edad: extra.edad,
          genero: extra.genero,
          ciudad: extra.ciudad,
          picnic: extra.picnic,
          relacion: extra.relacion,
          info: extra.recibir_info,
          comentarios: m.message === '(sin comentarios)' ? undefined : m.message
        });
      });

      const unified = Array.from(map.values()).sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setRegistrations(unified);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = registrations.filter((r) => {
    // 1. Filtro global (search)
    const searchStr = search.toLowerCase();
    const globalMatch = !search || 
      r.name.toLowerCase().includes(searchStr) || 
      r.email.toLowerCase().includes(searchStr) || 
      r.country.toLowerCase().includes(searchStr) ||
      (r.ciudad?.toLowerCase().includes(searchStr));
    
    if (!globalMatch) return false;

    // 2. Filtros por columna
    const f = filters;
    const matchesFecha = !f.fecha || new Date(r.created_at).toLocaleDateString('es-AR').includes(f.fecha);
    const matchesName = !f.name || r.name.toLowerCase().includes(f.name.toLowerCase());
    const matchesEmail = !f.email || r.email.toLowerCase().includes(f.email.toLowerCase());
    const matchesCountry = !f.country || r.country.toLowerCase().includes(f.country.toLowerCase());
    const matchesCiudad = !f.ciudad || (r.ciudad?.toLowerCase() || '').includes(f.ciudad.toLowerCase());
    const matchesEdad = !f.edad || (r.edad || '').includes(f.edad);
    const matchesGenero = !f.genero || (r.genero || '').includes(f.genero);
    const matchesProfile = !f.profile || r.profile === f.profile || r.relacion === f.profile;
    const matchesPicnic = !f.picnic || (f.picnic === 'SÍ' ? r.picnic?.includes('SÍ') : !r.picnic?.includes('SÍ'));
    const matchesInfo = !f.info || r.info === f.info;
    const matchesComentarios = !f.comentarios || (r.comentarios?.toLowerCase() || '').includes(f.comentarios.toLowerCase());

    return matchesFecha && matchesName && matchesEmail && matchesCountry && matchesCiudad && matchesEdad && matchesGenero && matchesProfile && matchesPicnic && matchesInfo && matchesComentarios;
  });

  const exportCSV = () => {
    const headers = ['Fecha', 'Nombre', 'Email', 'País', 'Ciudad', 'Perfil', 'Edad', 'Género', 'Picnic', 'Recibir Info', 'Comentarios'];
    const rows = filtered.map((r) => [
      new Date(r.created_at).toLocaleDateString('es-AR'),
      r.name, r.email, r.country, r.ciudad || '-', r.profile || r.relacion || '-',
      r.edad || '-', r.genero || '-', r.picnic || '-', r.info || '-', r.comentarios || '-'
    ]);
    const csv = [headers, ...rows].map((r) => r.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inscripciones-epifest-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const inputClass = "rounded-xl bg-muted/50 border border-border px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary/50";
  const colFilterClass = "w-full bg-card/40 border-none px-1.5 py-1 text-[10px] text-foreground focus:outline-none focus:ring-1 focus:ring-accent/30 rounded";

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-4 shrink-0">
        <h2 className="text-2xl font-extrabold">Inscripciones ({filtered.length})</h2>
        <button onClick={exportCSV} className="btn-gold text-xs flex items-center gap-2">
          <Download className="w-3 h-3" /> Exportar CSV Completo
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-4 shrink-0">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Búsqueda rápida global..."
            className={`${inputClass} pl-9 w-full h-8 text-xs`}
          />
        </div>
        <button 
          onClick={() => setFilters({ fecha: '', name: '', email: '', country: '', ciudad: '', edad: '', genero: '', profile: '', picnic: '', info: '', comentarios: '' })}
          className="text-[10px] uppercase tracking-widest font-bold text-foreground/40 hover:text-accent transition-colors px-2"
        >
          Limpiar todos los filtros
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden shadow-xl border border-border/20 flex-1 flex flex-col">
          <div className="overflow-auto flex-1 scrollbar-thin scrollbar-thumb-accent/20">
            <table className="w-full text-[11px] border-collapse min-w-max">
              <thead className="sticky top-0 z-10 bg-muted/95 backdrop-blur-md shadow-sm">
                <tr className="border-b border-border/30 whitespace-nowrap">
                  <th className="text-left p-2.5 font-bold text-foreground/60 uppercase tracking-tighter w-24">Fecha</th>
                  <th className="text-left p-2.5 font-bold text-foreground/60 uppercase tracking-tighter w-40">Nombre</th>
                  <th className="text-left p-2.5 font-bold text-foreground/60 uppercase tracking-tighter w-48">Email</th>
                  <th className="text-left p-2.5 font-bold text-foreground/60 uppercase tracking-tighter w-24">País</th>
                  <th className="text-left p-2.5 font-bold text-foreground/60 uppercase tracking-tighter w-28">Ciudad</th>
                  <th className="text-left p-2.5 font-bold text-foreground/60 uppercase tracking-tighter w-24">Edad</th>
                  <th className="text-left p-2.5 font-bold text-foreground/60 uppercase tracking-tighter w-24">Género</th>
                  <th className="text-left p-2.5 font-bold text-foreground/60 uppercase tracking-tighter w-40">Relación/Perfil</th>
                  <th className="text-left p-2.5 font-bold text-foreground/60 uppercase tracking-tighter w-20">Picnic</th>
                  <th className="text-left p-2.5 font-bold text-foreground/60 uppercase tracking-tighter w-16">Info</th>
                  <th className="text-left p-2.5 font-bold text-foreground/60 uppercase tracking-tighter min-w-[200px]">Comentarios</th>
                </tr>
                {/* Fila de Filtros */}
                <tr className="bg-card/30 border-b border-border/20">
                  <td className="p-1 px-2.5"><input value={filters.fecha} onChange={e => setFilters({...filters, fecha: e.target.value})} placeholder="Filtro..." className={colFilterClass} /></td>
                  <td className="p-1 px-2.5"><input value={filters.name} onChange={e => setFilters({...filters, name: e.target.value})} placeholder="Filtro..." className={colFilterClass} /></td>
                  <td className="p-1 px-2.5"><input value={filters.email} onChange={e => setFilters({...filters, email: e.target.value})} placeholder="Filtro..." className={colFilterClass} /></td>
                  <td className="p-1 px-2.5"><input value={filters.country} onChange={e => setFilters({...filters, country: e.target.value})} placeholder="Filtro..." className={colFilterClass} /></td>
                  <td className="p-1 px-2.5"><input value={filters.ciudad} onChange={e => setFilters({...filters, ciudad: e.target.value})} placeholder="Filtro..." className={colFilterClass} /></td>
                  <td className="p-1 px-2.5">
                    <select value={filters.edad} onChange={e => setFilters({...filters, edad: e.target.value})} className={colFilterClass}>
                      <option value="">Todo</option>
                      {['0 a 18 años','18 a 25 años','25 a 35 años','35 a 45 años','Más de 45 años'].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </td>
                  <td className="p-1 px-2.5">
                    <select value={filters.genero} onChange={e => setFilters({...filters, genero: e.target.value})} className={colFilterClass}>
                      <option value="">Todo</option>
                      {['Femenino','Masculino','Otro','Prefiero no responder'].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </td>
                  <td className="p-1 px-2.5">
                    <select value={filters.profile} onChange={e => setFilters({...filters, profile: e.target.value})} className={colFilterClass}>
                      <option value="">Todo</option>
                      <option value="paciente">Paciente</option>
                      <option value="familiar">Familiar</option>
                      <option value="profesional">Profesional</option>
                      <option value="otro">Otro</option>
                    </select>
                  </td>
                  <td className="p-1 px-2.5">
                    <select value={filters.picnic} onChange={e => setFilters({...filters, picnic: e.target.value})} className={colFilterClass}>
                      <option value="">Todo</option>
                      <option value="SÍ">SÍ</option>
                      <option value="No">No</option>
                    </select>
                  </td>
                  <td className="p-1 px-2.5">
                    <select value={filters.info} onChange={e => setFilters({...filters, info: e.target.value})} className={colFilterClass}>
                      <option value="">Todo</option>
                      <option value="Sí">Sí</option>
                      <option value="No">No</option>
                    </select>
                  </td>
                  <td className="p-1 px-2.5"><input value={filters.comentarios} onChange={e => setFilters({...filters, comentarios: e.target.value})} placeholder="Filtro..." className={colFilterClass} /></td>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr 
                    key={r.id} 
                    className="border-b border-border/10 hover:bg-muted/30 transition-colors whitespace-nowrap"
                  >
                    <td className="p-2.5 text-foreground/50">{new Date(r.created_at).toLocaleDateString('es-AR')}</td>
                    <td className="p-2.5 font-semibold text-foreground/90">{r.name}</td>
                    <td className="p-2.5 text-foreground/70">{r.email}</td>
                    <td className="p-2.5">{r.country}</td>
                    <td className="p-2.5 text-foreground/60">{r.ciudad || '-'}</td>
                    <td className="p-2.5">{r.edad || '-'}</td>
                    <td className="p-2.5">{r.genero || '-'}</td>
                    <td className="p-2.5">
                      <span className="bg-accent/10 border border-accent/20 rounded px-1.5 py-0.5 font-medium">
                        {r.profile || r.relacion || 'otro'}
                      </span>
                    </td>
                    <td className="p-2.5">
                      {r.picnic?.includes('SÍ') ? <span className="text-green-500 font-bold text-[10px]">¡SÍ!</span> : <span className="text-foreground/30">No</span>}
                    </td>
                    <td className="p-2.5 text-foreground/50">{r.info || '-'}</td>
                    <td className="p-2.5 text-foreground/50 truncate max-w-[200px]" title={r.comentarios}>
                      {r.comentarios || '-'}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={11} className="p-12 text-center text-foreground/50">Sin resultados</td></tr>
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
