import { useState, type FormEvent } from "react";
import { ArrowRight, Check, CheckCircle2, LockKeyhole, X } from "lucide-react";
import type { CartItem } from "../types";
import { calculateTotal } from "../utils/cart";

interface CheckoutModalProps {
  open: boolean;
  items: CartItem[];
  orderNumber: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function CheckoutModal({ open, items, orderNumber, onClose, onConfirm }: CheckoutModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onConfirm();
    setConfirmed(true);
  }

  function closeModal() {
    setConfirmed(false);
    setName("");
    setEmail("");
    setAddress("");
    onClose();
  }

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal(); }}>
      <section className="checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
        <button className="modal-close icon-button" onClick={closeModal} aria-label="Close checkout"><X size={20} /></button>
        {confirmed ? (
          <div className="order-success">
            <div className="success-icon"><CheckCircle2 size={34} /></div>
            <span className="eyebrow muted">IT'S OFFICIAL</span>
            <h2 id="checkout-title">Good things<br /><em>are on the way.</em></h2>
            <p>Your demo order has been placed successfully. No payment was collected.</p>
            <div className="order-reference"><span>ORDER REFERENCE</span><strong>{orderNumber}</strong><Check size={16} /></div>
            <button className="checkout-button" onClick={closeModal}>Back to shopping <ArrowRight size={17} /></button>
          </div>
        ) : (
          <>
            <div className="checkout-heading"><span className="eyebrow muted">JUST A FEW DETAILS</span><h2 id="checkout-title">Make it <em>yours.</em></h2><p>This is a simulated checkout — no payment will be taken.</p></div>
            <div className="checkout-summary"><div><span>{items.reduce((sum, item) => sum + item.quantity, 0)} items in your bag</span><strong>${calculateTotal(items).toFixed(2)}</strong></div>{items.slice(0, 3).map((item) => <div className="summary-item" key={item.id}><span>{item.title} × {item.quantity}</span><span>${(item.price * item.quantity).toFixed(2)}</span></div>)}</div>
            <form className="checkout-form" onSubmit={submitOrder}>
              <label>Full name<input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" autoComplete="name" /></label>
              <label>Email address<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" /></label>
              <label>Delivery address<textarea required value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Street, city, postal code" rows={2} autoComplete="street-address" /></label>
              <button className="checkout-button" type="submit">Place demo order <ArrowRight size={17} /></button>
              <div className="secure-note"><LockKeyhole size={12} /> Demo only — no real payment or order processing</div>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
