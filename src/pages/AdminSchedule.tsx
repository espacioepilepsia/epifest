import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Save, GripVertical } from 'lucide-react';
import { toast } from 'sonner';

interface ScheduleItem {
  id: string;
  day: number;
  block_name: string;
  talk_title: string;
  topic: string;
  speaker: string;
  time_arg: string;
  display_order: number;
  is_break: boolean;
}

const AdminSchedule = () => {
  const queryClient = useQueryClient();
  const [activeDay, setActiveDay] = useState<1 | 2>(1);
  const [editedItems, setEditedItems] = useState<Record<string, Partial<ScheduleItem>>>({});

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['admin_schedule'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schedule_items')
        .select('*')
        .order('day')
        .order('display_order');
      if (error) throw error;
      return data as ScheduleItem[];
    },
  });

  const dayItems = items.filter((i) => i.day === activeDay);

  const updateMutation = useMutation({
    mutationFn: async (item: ScheduleItem) => {
      const { error } = await supabase
        .from('schedule_items')
        .update({
          block_name: item.block_name,
          talk_title: item.talk_title,
          topic: item.topic,
          speaker: item.speaker,
          time_arg: item.time_arg,
          display_order: item.display_order,
          is_break: item.is_break,
        })
        .eq('id', item.id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin_schedule'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('schedule_items').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin_schedule'] }),
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const maxOrder = dayItems.length > 0 ? Math.max(...dayItems.map((i) => i.display_order)) + 1 : 1;
      const { error } = await supabase.from('schedule_items').insert({
        day: activeDay,
        block_name: '',
        talk_title: 'Nueva charla',
        topic: '',
        speaker: '',
        time_arg: '',
        display_order: maxOrder,
        is_break: false,
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin_schedule'] }),
  });

  const getEdited = (item: ScheduleItem): ScheduleItem => ({
    ...item,
    ...editedItems[item.id],
  });

  const handleChange = (id: string, field: keyof ScheduleItem, value: string | number | boolean) => {
    setEditedItems((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSave = async (item: ScheduleItem) => {
    const edited = getEdited(item);
    await updateMutation.mutateAsync(edited);
    setEditedItems((prev) => {
      const next = { ...prev };
      delete next[item.id];
      return next;
    });
    toast.success('Guardado');
  };

  const handleSaveAll = async () => {
    const toSave = dayItems.filter((i) => editedItems[i.id]);
    for (const item of toSave) {
      await updateMutation.mutateAsync(getEdited(item));
    }
    setEditedItems({});
    toast.success(`${toSave.length} items guardados`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este ítem?')) return;
    await deleteMutation.mutateAsync(id);
    toast.success('Eliminado');
  };

  const pendingCount = Object.keys(editedItems).filter((id) => dayItems.some((i) => i.id === id)).length;

  if (isLoading) return <div className="animate-spin w-8 h-8 border-2 border-secondary border-t-transparent rounded-full mx-auto mt-20" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-2xl font-extrabold">Cronograma</h1>
        <div className="flex gap-2">
          {pendingCount > 0 && (
            <Button onClick={handleSaveAll} className="bg-accent text-accent-foreground">
              <Save className="w-4 h-4 mr-1" /> Guardar todos ({pendingCount})
            </Button>
          )}
          <Button onClick={() => addMutation.mutate()} variant="outline">
            <Plus className="w-4 h-4 mr-1" /> Agregar
          </Button>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {[1, 2].map((d) => (
          <button
            key={d}
            onClick={() => setActiveDay(d as 1 | 2)}
            className={`rounded-full px-5 py-2 text-sm font-bold transition-all ${
              activeDay === d ? 'bg-secondary text-secondary-foreground' : 'glass-card'
            }`}
          >
            Día {d}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {dayItems.map((item) => {
          const edited = getEdited(item);
          const isDirty = !!editedItems[item.id];
          return (
            <div
              key={item.id}
              className={`glass-card rounded-xl p-4 grid grid-cols-1 md:grid-cols-[60px_100px_1fr_1fr_1fr_1fr_auto_auto] gap-2 items-center ${
                isDirty ? 'ring-1 ring-accent' : ''
              }`}
            >
              <div className="text-muted-foreground text-xs flex items-center gap-1">
                <GripVertical className="w-3 h-3" />
                <Input
                  value={edited.display_order}
                  onChange={(e) => handleChange(item.id, 'display_order', Number(e.target.value))}
                  className="w-14 h-8 text-xs"
                  type="number"
                />
              </div>
              <Input
                value={edited.time_arg}
                onChange={(e) => handleChange(item.id, 'time_arg', e.target.value)}
                placeholder="HH:MM"
                className="h-8 text-xs"
              />
              <Input
                value={edited.block_name}
                onChange={(e) => handleChange(item.id, 'block_name', e.target.value)}
                placeholder="Bloque"
                className="h-8 text-xs"
              />
              <Input
                value={edited.talk_title}
                onChange={(e) => handleChange(item.id, 'talk_title', e.target.value)}
                placeholder="Título"
                className="h-8 text-xs"
              />
              <Input
                value={edited.topic}
                onChange={(e) => handleChange(item.id, 'topic', e.target.value)}
                placeholder="Tema"
                className="h-8 text-xs"
              />
              <Input
                value={edited.speaker}
                onChange={(e) => handleChange(item.id, 'speaker', e.target.value)}
                placeholder="Orador/a"
                className="h-8 text-xs"
              />
              <label className="flex items-center gap-1 text-xs text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={edited.is_break}
                  onChange={(e) => handleChange(item.id, 'is_break', e.target.checked)}
                  className="rounded"
                />
                Pausa
              </label>
              <div className="flex gap-1">
                {isDirty && (
                  <Button size="sm" variant="ghost" onClick={() => handleSave(item)} className="h-8 w-8 p-0">
                    <Save className="w-4 h-4 text-accent" />
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id)} className="h-8 w-8 p-0">
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminSchedule;
