import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Check, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface Message {
  id: string;
  type: string;
  name: string;
  email: string;
  organization: string | null;
  message: string;
  extra_data: any;
  created_at: string;
  read: boolean;
}

const typeColors: Record<string, string> = {
  general: 'bg-accent/20 text-accent',
  speaker: 'bg-secondary/20 text-secondary',
  institution: 'bg-teal/20 text-teal',
};

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchMessages = async () => {
    let query = supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    if (filter !== 'all') query = query.eq('type', filter);
    const { data } = await query;
    setMessages((data as Message[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, [filter]);

  const toggleRead = async (id: string, read: boolean) => {
    await supabase.from('contact_messages').update({ read: !read }).eq('id', id);
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, read: !read } : m));
  };

  const deleteMsg = async (id: string) => {
    if (!confirm('¿Eliminar este mensaje?')) return;
    await supabase.from('contact_messages').delete().eq('id', id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const tabs = [
    { key: 'all', label: 'Todos' },
    { key: 'general', label: 'General' },
    { key: 'speaker', label: 'Oradores' },
    { key: 'institution', label: 'Instituciones' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-extrabold mb-6">Mensajes</h2>

      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => { setFilter(t.key); setLoading(true); }}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
              filter === t.key ? 'bg-secondary text-secondary-foreground' : 'glass-card'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : messages.length === 0 ? (
        <p className="text-foreground/50 text-center py-12">No hay mensajes</p>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`glass-card rounded-2xl p-4 transition-all ${!m.read ? 'border-l-4 border-l-secondary' : ''}`}
            >
              <div className="flex items-start gap-3 cursor-pointer" onClick={() => setExpandedId(expandedId === m.id ? null : m.id)}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${typeColors[m.type] || ''}`}>
                      {m.type}
                    </span>
                    <span className="font-semibold text-sm">{m.name}</span>
                    <span className="text-xs text-foreground/50">{m.email}</span>
                  </div>
                  <p className="text-sm text-foreground/70 truncate">{m.message}</p>
                  <p className="text-xs text-foreground/40 mt-1">{new Date(m.created_at).toLocaleDateString('es-AR')}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={(e) => { e.stopPropagation(); toggleRead(m.id, m.read); }} className="p-1.5 rounded-lg hover:bg-muted">
                    <Check className={`w-4 h-4 ${m.read ? 'text-accent' : 'text-foreground/30'}`} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); deleteMsg(m.id); }} className="p-1.5 rounded-lg hover:bg-destructive/20">
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                  {expandedId === m.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {expandedId === m.id && (
                <div className="mt-4 pt-4 border-t border-border/20 text-sm space-y-2">
                  <p><strong>Mensaje completo:</strong> {m.message}</p>
                  {m.organization && <p><strong>Organización:</strong> {m.organization}</p>}
                  {m.extra_data && (
                    <div>
                      <strong>Datos adicionales:</strong>
                      <pre className="mt-1 text-xs bg-muted/30 rounded-lg p-3 overflow-x-auto">
                        {JSON.stringify(m.extra_data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
