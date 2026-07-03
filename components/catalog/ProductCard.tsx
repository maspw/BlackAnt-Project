import Link from 'next/link';
import { Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/types/database';
import ProductImage from './ProductImage';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

function formatPrice(price: number | null): string | null {
  if (price == null) return null;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price);
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const formattedPrice = formatPrice(product.price);

  return (
    <Link
      href={`/katalog/${product.id}`}
      className="group flex flex-col no-underline"
      aria-label={`Lihat detail ${product.name}`}
    >
      {/* Image — aspect ratio 4:5 */}
      <div
        className="relative w-full overflow-hidden bg-[#f5f5f5]"
        style={{ paddingBottom: '125%', height: 0 }}
      >
        <ProductImage
          src={product.image_url}
          alt={product.name}
          priority={priority}
          className="transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>

      {/* Caption */}
      <div className="pt-3 flex flex-col gap-[5px]">
        {/* Category badge */}
        <Badge
          variant="outline"
          className="self-start text-[11px] font-normal text-[#878787] border-[#e5e5e5] rounded-none px-1.5 py-0 uppercase tracking-widest flex items-center gap-1"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          <Tag size={9} strokeWidth={1.5} aria-hidden="true" />
          {product.category}
        </Badge>

        {/* Name */}
        <p
          className="text-[16px] font-bold text-[#000000] leading-snug group-hover:text-[#878787] transition-colors duration-200 line-clamp-2"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          {product.name}
        </p>

        {/* Description */}
        {product.description && (
          <p
            className="text-[14px] font-normal text-[#878787] leading-[1.55] line-clamp-2"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            {product.description}
          </p>
        )}

        {/* Price */}
        {formattedPrice ? (
          <p
            className="mt-1 text-[15px] font-bold text-[#000000]"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            {formattedPrice}
          </p>
        ) : (
          <p
            className="mt-1 text-[14px] font-normal text-[#878787]"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          >
            Hubungi kami
          </p>
        )}
      </div>
    </Link>
  );
}
