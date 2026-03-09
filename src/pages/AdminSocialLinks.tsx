import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  display_order: number;
  visible: boolean;
}

const AdminSocialLinks = () => {
  const queryClient = useQueryClient();

  const { data: links = [], isLoading } = useQuery({
    queryKey: ['admin_social_links'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as SocialLink[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (link: SocialLink) => {
      const { error } = await supabase
        .from('social_links')
        .update({ url: link.url, visible: link.visible, display_order: link.display_order })
        .eq('id', link.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_social_links'] });
      toast.success('Red social actualizada');
    },
  });

  const addMutation = useMutation({
    mutationFn: async ({ platform, url }: { platform: string; url: string }) => {
      const { error } = await supabase
        .from('social_links')
        .insert({ platform, url, display_order: links.length + 1 });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_social_links'] });
      toast.success('Red social agregada');
      setNewPlatform('');
      setNewUrl('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('social_links').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_social_links'] });
      toast.success('Red social eliminada');
    },
  });

  const [newPlatform, setNewPlatform] = useState('');
  const [newUrl, setNewUrl] = useState('');

  if (isLoading) return <p>Cargando...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Redes Sociales</h1>

      <div className="space-y-4">
        {links.map((link) => (
          <LinkRow
            key={link.id}
            link={link}
            onSave={(updated) => updateMutation.mutate(updated)}
            onDelete={() => deleteMutation.mutate(link.id)}
          />
        ))}
      </div>

      <div className="border-t pt-4 space-y-2">
        <h3 className="font-semibold">Agregar nueva red</h3>
        <div className="flex gap-2">
          <Input placeholder="Plataforma (ej: twitter)" value={newPlatform} onChange={(e) => setNewPlatform(e.target.value)} />
          <Input placeholder="URL" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} />
          <Button onClick={() => addMutation.mutate({ platform: newPlatform, url: newUrl })} disabled={!newPlatform}>
            Agregar
          </Button>
        </div>
      </div>
    </div>
  );
};

function LinkRow({ link, onSave, onDelete }: { link: SocialLink; onSave: (l: SocialLink) => void; onDelete: () => void }) {
  const [url, setUrl] = useState(link.url);
  const [visible, setVisible] = useState(link.visible);

  return (
    <div className="flex items-center gap-3 p-3 border rounded-lg">
      <span className="font-medium capitalize w-24">{link.platform}</span>
      <Input className="flex-1" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL" />
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Visible</span>
        <Switch checked={visible} onCheckedChange={setVisible} />
      </div>
      <Button size="sm" onClick={() => onSave({ ...link, url, visible })}>Guardar</Button>
      <Button size="sm" variant="destructive" onClick={onDelete}>Eliminar</Button>
    </div>
  );
}

export default AdminSocialLinks;
