
CREATE TABLE public.social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  url text NOT NULL DEFAULT '',
  display_order integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view visible social links" ON public.social_links
  FOR SELECT USING (visible = true);

CREATE POLICY "Admin full access social_links" ON public.social_links
  FOR ALL USING (true) WITH CHECK (true);

INSERT INTO public.social_links (platform, url, display_order) VALUES
  ('instagram', 'https://instagram.com/epifest', 1),
  ('facebook', '', 2),
  ('youtube', '', 3),
  ('tiktok', '', 4),
  ('linkedin', '', 5);
