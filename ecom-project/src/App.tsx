import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowRight, Heart, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";
import type { CartItem, Product } from "./types";

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("forma-cart");
      return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
      return [];
    }
  });
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem("forma-favorites");
      return saved ? (JSON.parse(saved) as number[]) : [];
    } catch {
      return [];
    }
  });
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function loadProducts() {
      try {
        setLoading(true);
        setError("");
        const response = await fetch("https://fakestoreapi.com/products", { signal: controller.signal });
        if (!response.ok) throw new Error("Catalog request failed");
        setProducts((await response.json()) as Product[]);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError("We couldn't reach the product catalog. Check your connection and try again.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void loadProducts();
    return () => controller.abort();
  }, [retryCount]);

  useEffect(() => {
    try { localStorage.setItem("forma-cart", JSON.stringify(cart)); } catch { /* Storage may be unavailable in private browsing. */ }
  }, [cart]);

  useEffect(() => {
    try { localStorage.setItem("forma-favorites", JSON.stringify(favorites)); } catch { /* Storage may be unavailable in private browsing. */ }
  }, [favorites]);

  const categories = useMemo(() => ["All", ...Array.from(new Set(products.map((product) => product.category)))], [products]);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = category === "All" || product.category === category;
      const matchesSearch = !term || product.title.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) || product.category.toLowerCase().includes(term);
      const matchesFavorites = !favoritesOnly || favorites.includes(product.id);
      return matchesCategory && matchesSearch && matchesFavorites;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0);
      if (sortBy === "name") return a.title.localeCompare(b.title);
      return 0;
    });
  }, [products, category, search, favoritesOnly, favorites, sortBy]);

  function addToCart(product: Product) {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...current, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
  }

  function toggleFavorite(product: Product) {
    setFavorites((current) => current.includes(product.id)
      ? current.filter((id) => id !== product.id)
      : [...current, product.id]);
  }

  function removeFromCart(productId: number) {
    setCart((current) => current.filter((item) => item.id !== productId));
  }

  function updateQuantity(productId: number, quantity: number) {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart((current) => current.map((item) => item.id === productId ? { ...item, quantity } : item));
  }

  function completeCheckout() {
    setOrderNumber(`FM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);
    setCart([]);
    setCartOpen(false);
  }

  return (
    <main>
      <Navbar cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} onCartClick={() => setCartOpen(true)} />
      <section className="hero" id="home">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={14} /> THE EVERYDAY EDIT</div>
          <h1>Good things.<br /><span>Well chosen.</span></h1>
          <p>Thoughtful finds for your wardrobe, your space, and everything in between.</p>
          <button className="hero-cta" onClick={() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })}>Explore the collection <ArrowDown size={17} /></button>
          <div className="hero-note"><span className="note-dot" /> Curated for the way you live</div>
        </div>
        <div className="hero-art">
          <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
          <div className="art-sticker">A LITTLE<br />MORE YOU</div>
          <div className="art-card art-card-back"><span>FORM</span><span>FUNCTION</span><span>FEELING</span></div>
          <div className="art-card art-card-front"><div className="art-sun" /><div className="art-arch"><div className="arch-inner" /></div><span className="art-caption">THE GOOD<br />STUFF</span></div>
          <div className="art-spark spark-a">✳</div><div className="art-spark spark-b">✦</div>
        </div>
        <div className="hero-bottom"><span>01 / THE COLLECTION</span><span>SCROLL TO DISCOVER ↓</span></div>
      </section>

      <section className="catalog-section" id="catalog">
        <div className="section-heading">
          <div><div className="eyebrow muted">FIND YOUR FAVORITE</div><h2>The collection<span>.</span></h2></div>
          <p>Useful things, lovely details, and a few things you didn&apos;t know you needed.</p>
        </div>
        <div className="catalog-tools">
          <div className="search-wrap"><Search size={18} /><input aria-label="Search products" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search the collection..." />{search && <button className="clear-search" onClick={() => setSearch("")} aria-label="Clear search">×</button>}</div>
          <div className="filter-label"><SlidersHorizontal size={15} /> FILTER BY</div>
          <div className="category-list">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`category-chip ${category === item ? "active" : ""}`}>{item === "All" ? "Everything" : item.replace(/\b\w/g, (letter) => letter.toUpperCase())}</button>)}</div>
        </div>
        <div className="catalog-controls-row">
          <button className={`favorites-filter ${favoritesOnly ? "active" : ""}`} type="button" onClick={() => setFavoritesOnly((value) => !value)} aria-pressed={favoritesOnly}>
            <Heart size={15} fill={favoritesOnly ? "currentColor" : "none"} /> Saved ({favorites.length})
          </button>
          <label className="sort-control">Sort by
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort products">
              <option value="featured">Featured</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="rating">Top rated</option>
              <option value="name">Name: A–Z</option>
            </select>
          </label>
        </div>
        <div className="results-line"><span>{loading ? "Gathering the good stuff..." : `${filteredProducts.length} ${filteredProducts.length === 1 ? "piece" : "pieces"} to explore`}</span><span className="sort-label">DISCOVERED, NOT OVERWHELMING</span></div>
        {loading && <div className="product-grid">{Array.from({ length: 8 }).map((_, index) => <div className="skeleton-card" key={index}><div className="skeleton-image" /><div className="skeleton-line" /><div className="skeleton-line short" /></div>)}</div>}
        {!loading && error && <div className="state-panel"><div className="state-icon">↻</div><h3>One moment, please.</h3><p>{error}</p><button className="dark-button" onClick={() => setRetryCount((count) => count + 1)}>Try again <ArrowRight size={16} /></button></div>}
        {!loading && !error && filteredProducts.length === 0 && <div className="state-panel"><div className="state-icon">⌕</div><h3>No matches just yet.</h3><p>Try another search or choose a different category.</p><button className="dark-button" onClick={() => { setSearch(""); setCategory("All"); }}>Reset filters</button></div>}
        {!loading && !error && filteredProducts.length > 0 && <div className="product-grid">{filteredProducts.map((product, index) => <ProductCard key={product.id} product={product} index={index} onAdd={addToCart} isFavorite={favorites.includes(product.id)} onToggleFavorite={toggleFavorite} />)}</div>}
      </section>

      <section className="closing-banner" id="story">
        <div className="closing-mark">f.</div><div><div className="eyebrow">MAKE ROOM FOR GOOD THINGS</div><h2>Small finds.<br /><em>Big feelings.</em></h2></div>
        <button onClick={() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })}>Back to the collection <ArrowRight size={17} /></button><div className="closing-decoration">✳</div>
      </section>
      <footer id="footer"><span>FORMA® — A LITTLE SHOP OF GOOD THINGS</span><span>MADE FOR EVERYDAY LIVING · 2026</span></footer>

      <CartDrawer open={cartOpen} items={cart} onClose={() => setCartOpen(false)} onRemove={removeFromCart} onUpdateQuantity={updateQuantity} onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }} />
      <CheckoutModal open={checkoutOpen} items={cart} orderNumber={orderNumber} onClose={() => setCheckoutOpen(false)} onConfirm={completeCheckout} />
    </main>
  );
}
