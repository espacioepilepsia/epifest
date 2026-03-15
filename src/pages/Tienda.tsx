import SEO from '@/components/epifest/SEO';
import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/epifest/Header';
import Footer from '@/components/epifest/Footer';
import RegistrationModal from '@/components/epifest/RegistrationModal';
import { supabase } from '@/integrations/supabase/client';
import { ShoppingBag, Package, ArrowLeft } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  photo_url: string | null;
  mercadopago_url: string | null;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(price);

const Tienda = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [registerOpen, setRegisterOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from('products')
        .select('id, name, description, price, photo_url, mercadopago_url')
        .eq('visible', true)
        .order('display_order');
      setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Tienda" description="Merch oficial del epifest! 2026. Llevate un recuerdo del congreso y apoyá a la comunidad de epilepsia de Argentina y Latinoamérica." canonical="/tienda" />
      <Header onRegisterClick={() => setRegisterOpen(true)} />

      {/* Hero banner */}
      <div className="relative pt-24 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/3 w-[400px] h-[400px] rounded-full bg-secondary/10 blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] rounded-full bg-accent/10 blur-[100px]" />
        </div>
        <div className="container mx-auto max-w-5xl relative z-10">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al inicio
          </button>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent mb-4 block">
              Epifest 2026
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-none mb-4">
              Llevate el<br />
              <span className="text-gradient-gold">epifest</span> a casa
            </h1>
            <p className="text-foreground/60 text-lg max-w-xl">
              Merch oficial del congreso. Cada compra apoya a la comunidad de epilepsia.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Products grid */}
      <section ref={ref} className="px-4 pb-28">
        <div className="container mx-auto max-w-5xl">

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
                  <div className="h-48 bg-muted rounded-xl mb-4" />
                  <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2 mb-4" />
                  <div className="h-10 bg-muted rounded-full" />
                </div>
              ))}
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="text-center py-24">
              <Package className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
              <p className="text-foreground/50 text-lg">
                ¡Nuestro merch está en camino! Volvé pronto 💜
              </p>
            </div>
          )}

          {!loading && products.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
                  className="glass-card rounded-2xl overflow-hidden flex flex-col group"
                >
                  {product.photo_url ? (
                    <div className="overflow-hidden h-52">
                      <img
                        src={product.photo_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="h-52 bg-muted flex items-center justify-center">
                      <Package className="w-14 h-14 text-muted-foreground" />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-bold text-lg">{product.name}</h3>
                    {product.description && (
                      <p className="text-sm text-foreground/60 mt-1 flex-1">{product.description}</p>
                    )}
                    <p className="text-2xl font-extrabold text-secondary mt-3">
                      {formatPrice(product.price)}
                    </p>
                    <a
                      href={product.mercadopago_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-gold text-sm text-center mt-4 flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Comprar en Mercado Pago
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <RegistrationModal open={registerOpen} onClose={() => setRegisterOpen(false)} />
    </div>
  );
};

export default Tienda;
