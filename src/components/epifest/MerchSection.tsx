import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { ShoppingBag, Package } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  photo_url: string | null;
  mercadopago_url: string | null;
  available: boolean;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(price);

const MerchSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from('products')
        .select('id, name, description, price, photo_url, mercadopago_url, available')
        .eq('visible', true)
        .order('display_order');
      setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <section id="tienda" className="section-padding bg-muted/30" ref={ref}>
      <div className="container mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-3xl md:text-5xl font-extrabold mb-10"
        >
          Llevate el epifest a casa 💜
        </motion.h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
                <div className="h-48 bg-muted rounded-xl mb-4" />
                <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2 mb-4" />
                <div className="h-10 bg-muted rounded-full" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-foreground/60 text-center py-12">
            Próximamente — ¡nuestro merch está en camino!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
                className="glass-card rounded-2xl overflow-hidden flex flex-col group"
              >
                {/* Foto cuadrada 1:1 */}
                <div className="aspect-square overflow-hidden">
                  {product.photo_url ? (
                    <img
                      src={product.photo_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Package className="w-14 h-14 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-base leading-tight">{product.name}</h3>
                  {product.description && (
                    <p className="text-sm text-foreground/60 mt-1 flex-1">{product.description}</p>
                  )}
                  <p className="text-2xl font-extrabold text-secondary mt-3">
                    {formatPrice(product.price)}
                  </p>

                  {product.available ? (
                    <a
                      href={product.mercadopago_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-gold text-sm text-center mt-4 flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Comprar
                    </a>
                  ) : (
                    <button
                      disabled
                      className="mt-4 w-full rounded-full px-6 py-3 text-sm font-bold bg-muted text-muted-foreground cursor-not-allowed opacity-60"
                    >
                      Sin stock
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MerchSection;
