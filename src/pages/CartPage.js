import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CartPage = ({ cart, onUpdateQuantity, onRemoveFromCart }) => {
  const navigate = useNavigate();

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price || item.base_price || 0) * item.quantity,
    0
  );

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '48px 32px 96px',
      minHeight: '75vh'
    }}>
      {/* Breadcrumb / Back Link */}
      <div style={{ marginBottom: '32px' }}>
        <Link
          to="/"
          style={{
            fontSize: '12px',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#6B655E',
            textDecoration: 'none'
          }}
        >
          ← Continue Exploring Studio
        </Link>
      </div>

      <h1 style={{
        fontFamily: 'var(--font-serif, Georgia, serif)',
        fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
        fontWeight: 400,
        color: '#262422',
        marginBottom: '40px',
        borderBottom: '1px solid #E5DFD5',
        paddingBottom: '20px'
      }}>
        Your Shopping Bag
      </h1>

      {cart.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 24px',
          backgroundColor: '#F2EDE4',
          border: '1px solid #E5DFD5'
        }}>
          <p style={{
            fontFamily: 'var(--font-serif, Georgia, serif)',
            fontSize: '1.5rem',
            color: '#262422',
            marginBottom: '12px'
          }}>
            Your shopping bag is currently empty.
          </p>
          <p style={{
            fontSize: '14px',
            color: '#6B655E',
            marginBottom: '28px'
          }}>
            Discover small-batch handlooms and solid teakwood creations crafted by our artisans.
          </p>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '14px 32px',
              backgroundColor: '#262422',
              color: '#FAF8F5',
              border: 'none',
              fontSize: '12px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              cursor: 'pointer'
            }}
          >
            Return to Collection
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.6fr) minmax(300px, 1fr)',
          gap: '56px',
          alignItems: 'start'
        }}>
          {/* Left Column: Line Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {cart.map((item) => {
              const unitPrice = Number(item.price || item.base_price || 0);
              return (
                <div
                  key={item.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '110px 1fr auto',
                    gap: '24px',
                    paddingBottom: '28px',
                    borderBottom: '1px solid #E5DFD5',
                    alignItems: 'center'
                  }}
                >
                  {/* Item Image */}
                  <div style={{
                    width: '110px',
                    height: '135px',
                    backgroundColor: '#F2EDE4',
                    overflow: 'hidden'
                  }}>
                    <img
                      src={item.image_url || 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d'}
                      alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  {/* Item Details & Quantity Controls */}
                  <div>
                    <span style={{
                      fontSize: '10px',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: '#6B655E',
                      display: 'block',
                      marginBottom: '6px'
                    }}>
                      {item.craft_origin || 'Handcrafted Studio Piece'}
                    </span>
                    <h3 style={{
                      fontFamily: 'var(--font-serif, Georgia, serif)',
                      fontSize: '1.3rem',
                      fontWeight: 400,
                      color: '#262422',
                      marginBottom: '8px'
                    }}>
                      {item.name}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#6B655E', marginBottom: '16px' }}>
                      ₹{unitPrice.toLocaleString()} each
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        border: '1px solid #E5DFD5',
                        backgroundColor: '#FFF'
                      }}>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            padding: '8px 14px',
                            cursor: 'pointer',
                            fontSize: '15px'
                          }}
                        >
                          −
                        </button>
                        <span style={{ padding: '0 10px', fontSize: '13px' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            padding: '8px 14px',
                            cursor: 'pointer',
                            fontSize: '15px'
                          }}
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveFromCart(item.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#A65E46',
                          fontSize: '11px',
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          textDecoration: 'underline',
                          cursor: 'pointer'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Line Total */}
                  <div style={{ textAlign: 'right', fontSize: '16px', color: '#262422' }}>
                    ₹{(unitPrice * item.quantity).toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Order Summary Card */}
          <div style={{
            backgroundColor: '#F2EDE4',
            padding: '36px',
            border: '1px solid #E5DFD5'
          }}>
            <h2 style={{
              fontFamily: 'var(--font-serif, Georgia, serif)',
              fontSize: '1.5rem',
              fontWeight: 400,
              color: '#262422',
              marginBottom: '24px',
              paddingBottom: '16px',
              borderBottom: '1px solid #E5DFD5'
            }}>
              Order Summary
            </h2>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '14px',
              color: '#6B655E',
              marginBottom: '14px'
            }}>
              <span>Subtotal ({cart.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '14px',
              color: '#6B655E',
              marginBottom: '24px',
              paddingBottom: '20px',
              borderBottom: '1px solid #E5DFD5'
            }}>
              <span>Artisan Packaging & Delivery</span>
              <span>Calculated at checkout</span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '18px',
              color: '#262422',
              marginBottom: '28px'
            }}>
              <span>Estimated Total</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              style={{
                width: '100%',
                padding: '16px 24px',
                backgroundColor: '#262422',
                color: '#FAF8F5',
                border: 'none',
                fontSize: '12px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                cursor: 'pointer'
              }}
            >
              Proceed to Checkout
            </button>

            <p style={{
              fontSize: '12px',
              color: '#6B655E',
              marginTop: '16px',
              lineHeight: 1.6,
              textAlign: 'center'
            }}>
              Each piece is carefully inspected and wrapped in plastic-free, sustainable studio packaging.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;