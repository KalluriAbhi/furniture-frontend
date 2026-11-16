import React, { useState } from 'react';

export default function ProductDetailModal({ product, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAddToCartClick = () => {
    onAddToCart({
      id: `prod-${product.product_id}`,
      name: product.name,
      price: parseFloat(product.base_price),
      quantity: quantity
    });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(44, 42, 41, 0.75)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        backgroundColor: '#FAF9F6',
        maxWidth: '900px',
        width: '100%',
        borderRadius: '4px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        position: 'relative',
        fontFamily: "'Georgia', serif",
        maxHeight: '90vh'
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: '#2C2A29',
            zIndex: 10
          }}
        >
          ✕
        </button>

        {/* Left: Product Image */}
        <div style={{ flex: 1, backgroundColor: '#E5E0D8', minHeight: '400px' }}>
          <img 
            src={product.image_url || 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d'} 
            alt={product.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>

        {/* Right: Rich Artisanal Details */}
        <div style={{ flex: 1, padding: '40px', overflowY: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '10px', letterSpacing: '2px', color: '#7A7267', textTransform: 'uppercase' }}>
              {product.craft_origin || 'Handcrafted Artisan Piece'}
            </span>
            <h2 style={{ fontSize: '24px', fontWeight: '400', color: '#2C2A29', margin: '8px 0 12px 0' }}>
              {product.name}
            </h2>
            <div style={{ fontSize: '18px', color: '#2C2A29', marginBottom: '24px', fontWeight: 'normal' }}>
              ₹{parseFloat(product.base_price).toLocaleString()}
            </div>

            <div style={{ borderTop: '1px solid #E5E0D8', paddingTop: '16px', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#7A7267', margin: '0 0 4px 0' }}>
                Material & Texture
              </h4>
              <p style={{ fontSize: '13px', color: '#4A3B32', margin: 0, lineHeight: '1.5' }}>
                {product.material || 'Ethically sourced organic fibers and natural solid wood.'}
              </p>
            </div>

            <div style={{ borderTop: '1px solid #E5E0D8', paddingTop: '16px', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#7A7267', margin: '0 0 4px 0' }}>
                Care Instructions
              </h4>
              <p style={{ fontSize: '13px', color: '#4A3B32', margin: 0, lineHeight: '1.5' }}>
                {product.care_instructions || 'Dry clean only. Store in a breathable cotton cover away from direct sunlight.'}
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div style={{ borderTop: '1px solid #E5E0D8', paddingTop: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ display: 'flex', border: '1px solid #E5E0D8', borderRadius: '4px' }}>
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ padding: '10px 14px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px' }}
              >
                -
              </button>
              <span style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', fontSize: '13px' }}>{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                style={{ padding: '10px 14px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px' }}
              >
                +
              </button>
            </div>

            <button 
              onClick={handleAddToCartClick}
              style={{
                flex: 1,
                padding: '12px 20px',
                backgroundColor: '#2C2A29',
                color: '#FAF9F6',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '11px',
                letterSpacing: '2px',
                textTransform: 'uppercase'
              }}
            >
              Add to Bag
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}