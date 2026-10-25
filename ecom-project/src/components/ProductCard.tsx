import { useState } from "react";
import { Heart, Plus, Star } from "lucide-react";
import type { Product } from "../types";

interface ProductCardProps {
  product: Product;
  index: number;
  onAdd: (product: Product) => void;
  isFavorite: boolean;
  onToggleFavorite: (product: Product) => void;
}

export default function ProductCard({ product, index, onAdd, isFavorite, onToggleFavorite }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const category = product.category.replace(/\b\w/g, (letter) => letter.toUpperCase());

  function handleAdd() {
    onAdd(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 900);
  }

  return (
    <article className="product-card" style={{ animationDelay: `${Math.min(index % 8, 7) * 55}ms` }}>
      <div className="product-image-wrap">
        <span className="product-category">{category}</span>
        <button className={`favorite-button ${isFavorite ? "is-favorite" : ""}`} aria-label={`${isFavorite ? "Remove" : "Add"} ${product.title} ${isFavorite ? "from" : "to"} wishlist`} aria-pressed={isFavorite} onClick={() => onToggleFavorite(product)}>
          <Heart size={17} fill={isFavorite ? "currentColor" : "none"} />
        </button>
        <img className="product-image" src={product.image} alt={product.title} loading="lazy" />
        {added && <div className="added-toast" role="status">Added to your bag ✓</div>}
      </div>
      <div className="product-info">
        <div className="product-title-row"><h3 title={product.title}>{product.title}</h3></div>
        <div className="product-meta"><span className="product-price">${product.price.toFixed(2)}</span><span className="rating"><Star size={12} fill="currentColor" /> {product.rating?.rate ?? "—"} <span>({product.rating?.count ?? 0})</span></span></div>
        <button className={`add-button ${added ? "is-added" : ""}`} onClick={handleAdd}>{added ? "Added to bag" : "Add to bag"} <Plus size={14} /></button>
      </div>
    </article>
  );
}
