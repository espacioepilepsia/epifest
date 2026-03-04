
-- Create tables for epifest 2026

-- Speakers table
CREATE TABLE public.speakers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT,
  institution TEXT,
  bio TEXT,
  photo_url TEXT,
  visible BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0,
  photo_url TEXT,
  mercadopago_url TEXT,
  visible BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Contact messages table
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('general', 'speaker', 'institution')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  organization TEXT,
  message TEXT NOT NULL,
  extra_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  read BOOLEAN NOT NULL DEFAULT false
);

-- Registrations table
CREATE TABLE public.registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  country TEXT NOT NULL,
  profile TEXT NOT NULL CHECK (profile IN ('paciente', 'familiar', 'profesional', 'otro')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Sponsors table
CREATE TABLE public.sponsors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  visible BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0
);

-- Enable RLS on all tables
ALTER TABLE public.speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;

-- Public SELECT policies for visible content
CREATE POLICY "Public can view visible speakers" ON public.speakers
  FOR SELECT USING (visible = true);

CREATE POLICY "Public can view visible products" ON public.products
  FOR SELECT USING (visible = true);

CREATE POLICY "Public can view visible sponsors" ON public.sponsors
  FOR SELECT USING (visible = true);

-- Public INSERT policies for contact and registrations
CREATE POLICY "Public can submit contact messages" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can register" ON public.registrations
  FOR INSERT WITH CHECK (true);

-- Admin (authenticated) full access policies
CREATE POLICY "Admin full access speakers" ON public.speakers
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access products" ON public.products
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access contact_messages" ON public.contact_messages
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access registrations" ON public.registrations
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access sponsors" ON public.sponsors
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('speakers', 'speakers', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('sponsors', 'sponsors', true);

-- Storage policies
CREATE POLICY "Public can view speaker photos" ON storage.objects FOR SELECT USING (bucket_id = 'speakers');
CREATE POLICY "Auth can upload speaker photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'speakers');
CREATE POLICY "Auth can update speaker photos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'speakers');
CREATE POLICY "Auth can delete speaker photos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'speakers');

CREATE POLICY "Public can view product photos" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "Auth can upload product photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'products');
CREATE POLICY "Auth can update product photos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'products');
CREATE POLICY "Auth can delete product photos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'products');

CREATE POLICY "Public can view sponsor logos" ON storage.objects FOR SELECT USING (bucket_id = 'sponsors');
CREATE POLICY "Auth can upload sponsor logos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'sponsors');
CREATE POLICY "Auth can update sponsor logos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'sponsors');
CREATE POLICY "Auth can delete sponsor logos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'sponsors');
