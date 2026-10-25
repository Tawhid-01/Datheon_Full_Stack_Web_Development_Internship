import { useEffect } from "react";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import type { CartItem } from "../types";
import { calculateTotal } from "../utils/cart";

interface CartDrawerProps {
  open: boolean;
  items: CartItem[];
  onClose: () => void;
  onRemove: (productId: number) => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onCheckout: () => void;
}

export default function CartDrawer({ open, items, onClose, onRemove, onUpdateQuantity, onCheckout }: CartDrawerProps) {
  const total = calculateTotal(items);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open, onClose]);

  return (
    <>
      <div className={`drawer-backdrop ${open ? "visible" : ""}`} onClick={onClose} aria-hidden="true" />
      <aside className={`cart-drawer ${open ? "open" : ""}`} aria-label="Shopping bag" aria-hidden={!open}>
        <div className="drawer-header"><div><span className="eyebrow muted">YOUR GOOD FINDS</span><h2>Your bag <span>({count})</span></h2></div><button className="icon-button" onClick={onClose} aria-label="Close cart"><X size={21} /></button></div>
        {items.length === 0 ? (
          <div className="empty-cart"><div className="empty-bag"><ShoppingBag size={28} /></div><h3>Your bag is taking a little break.</h3><p>Find something that feels like you.</p><button className="dark-button" onClick={onClose}>Explore the collection <ArrowRight size={16} /></button></div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="cart-item-image"><img src={item.image} alt={item.title} /></div>
                  <div className="cart-item-content">
                    <h3>{item.title}</h3><span className="cart-item-price">${item.price.toFixed(2)}</span>
                    <div className="cart-item-bottom">
                      <div className="quantity-control">
                        <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} aria-label={`Decrease ${item.title} quantity`}><Minus size={13} /></button>
                        <span>{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} aria-label={`Increase ${item.title} quantity`}><Plus size={13} /></button>
                      </div>
                      <button className="remove-button" onClick={() => onRemove(item.id)} aria-label={`Remove ${item.title}`}><Trash2 size={14} /> Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="drawer-footer"><div className="subtotal-row"><span>Subtotal</span><strong>${total.toFixed(2)}</strong></div><p>Shipping and taxes are calculated at checkout.</p><button className="checkout-button" onClick={onCheckout}>Continue to checkout <ArrowRight size={17} /></button><span className="secure-note">A smooth checkout, just ahead.</span></div>
          </>
        )}
      </aside>
    </>
  );
}
