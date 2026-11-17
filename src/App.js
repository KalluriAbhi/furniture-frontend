import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import CheckoutDelivery from './CheckoutDelivery';
import AdminDashboard from './AdminDashboard';
import AuthModal from './AuthModal';
import AdminLayout from './AdminLayout';
import HeroSlider from './HeroSlider';
import ProductList from './ProductList';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import Footer from './components/Footer';

// Production API Base URL (accessible globally in this file)
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://furniture-backend.onrender.com';

// Inner Header & Navigation Component
function Header({ cartCount, currentUser, handleLogout, setIsAuthOpen }) {
  return (
    <header style={{
      backgroundColor: '#FAF9F6',
      padding: '20px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #E5E0D8',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ textAlign: 'left' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1 style={{ fontSize: '22px', letterSpacing: '3px', fontWeight: '400', margin: 0, color: '#2C2A29', textTransform: 'uppercase' }}>
            A R T I S A N  S T U D I O
          </h1>
          <span style={{ fontSize: '10px', letterSpacing: '2px', color: '#7A7267', textTransform: 'uppercase', display: 'block', marginTop: '2px' }}>
            Handloom & Woodcraft Architecture
          </span>
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link
          to="/"
          style={{
            padding: '10px 20px',
            color: '#2C2A29',
            border: '1px solid #2C2A29',
            textDecoration: 'none',
            fontSize: '12px',
            letterSpacing: '1.5px',
            textTransform: 'uppercase'
          }}
        >
          Studio Store
        </Link>

        {currentUser && currentUser.role === 'admin' && (
          <Link
            to="/admin"
            style={{
              padding: '10px 20px',
              background: '#2C2A29',
              color: '#FFF',
              border: '1px solid #2C2A29',
              textDecoration: 'none',
              fontSize: '12px',
              letterSpacing: '1.5px',
              textTransform: 'uppercase'
            }}
          >
            Admin Panel
          </Link>
        )}

        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '12px', color: '#4A3B32', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Hi, {currentUser.name}
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#7A7267',
                fontSize: '11px',
                cursor: 'pointer',
                textDecoration: 'underline',
                textTransform: 'uppercase'
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAuthOpen(true)}
            style={{
              padding: '10px 20px',
              background: 'transparent',
              color: '#2C2A29',
              border: '1px solid #E5E0D8',
              cursor: 'pointer',
              fontSize: '12px',
              letterSpacing: '1.5px',
              textTransform: 'uppercase'
            }}
          >
            Sign In
          </button>
        )}

        <Link
          to="/cart"
          style={{
            padding: '10px 20px',
            background: '#4A3B32',
            color: '#FAF9F6',
            textDecoration: 'none',
            fontSize: '12px',
            letterSpacing: '1.5px',
            textTransform: 'uppercase'
          }}
        >
          Bag ({cartCount})
        </Link>
      </div>
    </header>
  );
}

// Protected Route Guard for /admin
const ProtectedAdminRoute = ({ currentUser, children }) => {
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }
  if (currentUser.role !== 'admin') {
    alert('Access Restricted: Admin privileges required.');
    return <Navigate to="/" replace />;
  }
  return children;
};

// Reusable Storefront Shell
function StorefrontShell({
  children,
  totalCartCount,
  currentUser,
  handleLogout,
  isAuthOpen,
  setIsAuthOpen,
  setCurrentUser
}) {
  return (
    <div style={{ backgroundColor: '#FAF9F6', minHeight: '100vh', color: '#2C2A29', fontFamily: "'Georgia', serif" }}>
      <div style={{ backgroundColor: '#4A3B32', color: '#F5EFE6', textAlign: 'center', padding: '8px', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>
        Artisanal Handloom & Handcrafted Creations • Ethically Sourced & Made to Order
      </div>

      <Header
        cartCount={totalCartCount}
        currentUser={currentUser}
        handleLogout={handleLogout}
        setIsAuthOpen={setIsAuthOpen}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => setCurrentUser(user)}
      />

      {children}
      <Footer />
    </div>
  );
}

// Inner App Component wrapped in Router
function MainApp() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('studio_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('studio_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Failed to parse saved user', err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('studio_token');
    localStorage.removeItem('studio_user');
    setCurrentUser(null);
    navigate('/');
  };

  const handleAddToCart = (comboItem, qtyToAdd = 1) => {
    const itemId = comboItem.id || `prod-${comboItem.product_id}`;
    const itemPrice = Number(comboItem.price || comboItem.base_price || 0);

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(item => item.id === itemId);
      let updatedCart;
      if (existingIndex > -1) {
        updatedCart = [...prevCart];
        updatedCart[existingIndex].quantity += qtyToAdd;
      } else {
        updatedCart = [...prevCart, { ...comboItem, id: itemId, price: itemPrice, quantity: qtyToAdd }];
      }
      localStorage.setItem('studio_cart', JSON.stringify(updatedCart));
      return updatedCart;
    });

    navigate('/cart');
  };

  const handleUpdateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(id);
      return;
    }
    setCart(prevCart => {
      const updatedCart = prevCart.map(item =>
        item.id === id ? { ...item, quantity: newQty } : item
      );
      localStorage.setItem('studio_cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const handleRemoveFromCart = (id) => {
    setCart(prevCart => {
      const updatedCart = prevCart.filter(item => item.id !== id);
      localStorage.setItem('studio_cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const handleClearCart = () => {
    setCart([]);
    localStorage.removeItem('studio_cart');
    navigate('/');
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const shellProps = {
    totalCartCount,
    currentUser,
    handleLogout,
    isAuthOpen,
    setIsAuthOpen,
    setCurrentUser
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <StorefrontShell {...shellProps}>
            <main style={{ margin: '0 auto', padding: '0 0px 40px 0px' }}>
              <HeroSlider onShopClick={() => window.scrollTo({ top: 500, behavior: 'smooth' })} />
              <section style={{
                backgroundColor: 'var(--bg-sand)',
                padding: '96px 24px',
                textAlign: 'center',
                borderBottom: '1px solid var(--border-subtle)'
              }}>
                <div style={{ maxWidth: '680px', margin: '0 auto' }}>
                  <span style={{
                    fontSize: '11px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'var(--accent-terracotta)',
                    display: 'block',
                    marginBottom: '16px'
                  }}>
                    OUR PHILOSOPHY
                  </span>
                  <h2 style={{
                    fontSize: 'clamp(1.9rem, 3.2vw, 2.75rem)',
                    lineHeight: 1.25,
                    marginBottom: '20px',
                    color: 'var(--text-charcoal)'
                  }}>
                    Objects that carry the warmth of the hands that made them.
                  </h2>
                  <p style={{
                    fontSize: '15px',
                    color: 'var(--text-muted)',
                    lineHeight: 1.8
                  }}>
                    Every piece in our studio is produced in small batches—bridging generational Indian woodworking and handloom traditions with calm, contemporary forms.
                  </p>
                </div>
              </section>

              <div id="collection-grid">
                <ProductList onAddToCart={handleAddToCart} />
              </div>
            </main>
          </StorefrontShell>
        }
      />

      <Route
        path="/products/:id"
        element={
          <StorefrontShell {...shellProps}>
            <ProductDetail onAddToCart={handleAddToCart} />
          </StorefrontShell>
        }
      />

      <Route
        path="/cart"
        element={
          <StorefrontShell {...shellProps}>
            <CartPage
              cart={cart}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveFromCart={handleRemoveFromCart}
            />
          </StorefrontShell>
        }
      />

      <Route
        path="/checkout"
        element={
          <StorefrontShell {...shellProps}>
            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
              <CheckoutDelivery cartItems={cart} onClearCart={handleClearCart} currentUser={currentUser} />
            </main>
          </StorefrontShell>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute currentUser={currentUser}>
            <AdminLayout currentUser={currentUser} handleLogout={handleLogout}>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedAdminRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}