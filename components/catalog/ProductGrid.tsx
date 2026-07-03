import type { Product } from '@/types/database';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-16"
      role="list"
      aria-label="Daftar produk"
    >
      {products.map((product, index) => (
        <div key={product.id} role="listitem">
          <ProductCard
            product={product}
            // Prioritaskan 3 gambar pertama untuk LCP
            priority={index < 3}
          />
        </div>
      ))}
    </div>
  );
}
