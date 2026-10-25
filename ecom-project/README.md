# Forma — React + Vite storefront

A responsive demo storefront built with React, TypeScript, Vite, and the FakeStoreAPI. The design uses a warm editorial style with subtle motion and mobile-friendly navigation.

## Features

- Product catalog loaded from FakeStoreAPI
- Search by product name, description, or category
- Category filters and sorting by price, rating, or name
- Wishlist / saved products, remembered in browser storage
- Shopping cart drawer with quantity controls and subtotal
- Cart contents saved in browser storage between reloads
- Simulated checkout with an order reference (no real payment)
- Responsive mobile navigation with Escape-key support
- Loading skeletons, error state with retry, and empty-result state
- Reduced-motion support and keyboard focus styles

## Requirements

- Node.js 18 or newer (Node.js 20 LTS recommended)
- npm

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Production build

```bash
npm run build
npm run preview
```

## Project structure

```text
src/
  main.tsx
  App.tsx
  styles.css
  types.ts
  components/
    Navbar.tsx
    ProductCard.tsx
    CartDrawer.tsx
    CheckoutModal.tsx
  utils/
    cart.ts
index.html
package.json
vite.config.ts
tsconfig.json
tsconfig.app.json
tsconfig.node.json
```

## How the cart works

- `addToCart(product)` adds a product or increments its quantity.
- `removeFromCart(productId)` removes an item.
- `updateQuantity(productId, quantity)` updates quantity; values below one remove the item.
- `calculateTotal(items)` calculates the subtotal.
- Cart and wishlist data are stored in browser `localStorage` on the current device. Clearing browser storage removes that saved data.

## API and demo limitations

- Products come from [FakeStoreAPI](https://fakestoreapi.com/products). An internet connection is required.
- Checkout is simulated. It does not charge a payment method, create a real order, or send customer details to a backend.
- Cart and wishlist storage is local to the browser and is not synced across devices.
- Product images and Google Fonts require an internet connection.
