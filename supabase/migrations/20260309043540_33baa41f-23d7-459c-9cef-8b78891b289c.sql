
CREATE TABLE public.schedule_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day integer NOT NULL DEFAULT 1,
  block_name text NOT NULL DEFAULT '',
  talk_title text NOT NULL DEFAULT '',
  topic text NOT NULL DEFAULT '',
  speaker text NOT NULL DEFAULT '',
  time_arg text NOT NULL DEFAULT '',
  display_order integer NOT NULL DEFAULT 0,
  is_break boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.schedule_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view schedule" ON public.schedule_items
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admin full access schedule_items" ON public.schedule_items
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
