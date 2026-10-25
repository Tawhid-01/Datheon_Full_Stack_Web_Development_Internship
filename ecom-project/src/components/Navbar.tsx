import { useEffect, useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
}

const links = [
  { label: "Home", href: "#home" },
  { label: "Collection", href: "#catalog" },
  { label: "Our story", href: "#story" },
  { label: "Contact", href: "#footer" },
];

export default function Navbar({ cartCount, onCartClick }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="navbar">
      <a className="brand" href="#home" onClick={closeMenu} aria-label="Forma home">
        <span className="brand-mark">f.</span>
        <span>fiona<span className="brand-dot">®</span></span>
      </a>

      <nav id="main-navigation" className={`nav-links ${menuOpen ? "is-open" : ""}`} aria-label="Main navigation">
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={closeMenu}>
            {link.label}
          </a>
        ))}
      </nav>

      <div className="nav-actions">
        <span className="nav-tagline">GOOD THINGS, WELL CHOSEN</span>
        <button className="cart-trigger" type="button" onClick={() => { closeMenu(); onCartClick(); }} aria-label={`Open shopping bag, ${cartCount} items`}>
          <ShoppingBag size={16} />
          <span>Bag</span>
          <span className="cart-badge" aria-live="polite">{cartCount}</span>
        </button>
        <button
          className="mobile-menu"
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}
