import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Users, MessageSquare, Mic, Package, RefreshCw } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ registrations: 0, unreadMessages: 0, speakers: 0, products: 0 });
  const [recentRegs, setRecentRegs] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [regs, msgs, spk, prod] = await Promise.all([
        supabase.from('registrations').select('*', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('read', false),
        supabase.from('speakers').select('*', { count: 'exact', head: true }).eq('visible', true),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('visible', true),
      ]);
      setStats({
        registrations: regs.count || 0,
        unreadMessages: msgs.count || 0,
        speakers: spk.count || 0,
        products: prod.count || 0,
      });

      const { data } = await supabase.from('registrations').select('*').order('created_at', { ascending: false }).limit(10);
      setRecentRegs(data || []);
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Inscripciones', value: stats.registrations, icon: Users, color: 'text-accent' },
    { label: 'Mensajes sin leer', value: stats.unreadMessages, icon: MessageSquare, color: 'text-secondary' },
    { label: 'Oradores activos', value: stats.speakers, icon: Mic, color: 'text-teal' },
    { label: 'Productos activos', value: stats.products, icon: Package, color: 'text-coral' },
  ];

  const syncToPerfit = async () => {
    // 1. Obtener todos los mensajes para ver el campo 'recibir_info'
    const { data: msgs } = await supabase.from('contact_messages')
      .select('*')
      .or('extra_data->>recibir_info.eq.Sí,extra_data->>recibir_info.eq.si');

    if (!msgs || msgs.length === 0) {
      alert('No se encontraron inscripciones que aceptaran recibir información.');
      return;
    }

    if (!confirm(`¿Sincronizar ${msgs.length} contactos con Perfit (Lista 37)?`)) return;

    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby8Br9NewMUC0joB5252UFBkRNk1R8XVLdmFCo6PHiYgOnGiPNBDsPWfqvJ8TGnhXSn/exec';

    let count = 0;
    for (const m of msgs) {
      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({
            'tipo': 'perfit_sync',
            'email': m.email,
            'name': m.name
          }),
        });
        count++;
      } catch (e) {
        console.error('Error sincronizando Perfit:', m.email, e);
      }
    }

    alert(`¡Sincronización con Perfit finalizada! Se procesaron ${count} contactos.`);
  };


  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-extrabold">Dashboard</h2>
        <div className="flex gap-2">
          <button onClick={syncToPerfit} className="flex items-center gap-2 text-[10px] bg-indigo-600 text-white hover:opacity-90 py-2 px-4 rounded-xl font-bold transition-all shadow-md uppercase tracking-wider">
            <RefreshCw className="w-3 h-3" />
            Sincronizar a Perfit
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="glass-card rounded-2xl p-6">
            <c.icon className={`w-6 h-6 ${c.color} mb-2`} />
            <p className="text-3xl font-extrabold">{c.value}</p>
            <p className="text-xs text-foreground/60">{c.label}</p>
          </div>
        ))}
      </div>

      <h3 className="text-lg font-bold mb-4">Últimas inscripciones</h3>
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left p-3 font-semibold text-foreground/70">Nombre</th>
                <th className="text-left p-3 font-semibold text-foreground/70">Email</th>
                <th className="text-left p-3 font-semibold text-foreground/70">País</th>
                <th className="text-left p-3 font-semibold text-foreground/70">Perfil</th>
              </tr>
            </thead>
            <tbody>
              {recentRegs.map((r) => (
                <tr key={r.id} className="border-b border-border/20">
                  <td className="p-3">{r.name}</td>
                  <td className="p-3 text-foreground/70">{r.email}</td>
                  <td className="p-3">{r.country}</td>
                  <td className="p-3">
                    <span className="glass-card rounded-full px-3 py-1 text-xs">{r.profile}</span>
                  </td>
                </tr>
              ))}
              {recentRegs.length === 0 && (
                <tr><td colSpan={4} className="p-6 text-center text-foreground/50">Sin inscripciones aún</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
