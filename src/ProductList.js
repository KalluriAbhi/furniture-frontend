import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['All', 'Handlooms', 'Woodcraft', 'Home Accents'];

export default function ProductList({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  const navigate = useNavigate();

  const handleCardClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://process.env.REACT_APP_API_URL/api/products');
        const data = Array.isArray(res.data) ? res.data : (res.data.products || []);
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    if (activeCategory === 'All') return true;
    const searchPool = `${product.category || ''} ${product.craft_origin || ''} ${product.name || ''}`.toLowerCase();
    if (activeCategory === 'Handlooms') return searchPool.includes('loom') || searchPool.includes('silk') || searchPool.includes('cotton') || searchPool.includes('textile');
    if (activeCategory === 'Woodcraft') return searchPool.includes('wood') || searchPool.includes('teak') || searchPool.includes('table') || searchPool.includes('chair');
    if (activeCategory === 'Home Accents') return searchPool.includes('accent') || searchPool.includes('decor') || searchPool.includes('lamp') || searchPool.includes('brass');
    return true;
  });

  if (loading) return <p style={{ textAlign: 'center', color: '#7A7267', padding: '60px 0' }}>Curating studio pieces...</p>;

  return (
    <section style={{ maxWidth: '1320px', margin: '72px auto', padding: '0 48px' }}>
      {/* Section Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span style={{ fontSize: '11px', letterSpacing: '3px', color: '#7A7267', textTransform: 'uppercase' }}>
          Handcrafted Collection
        </span>
        <h3 style={{ fontFamily: 'var(--font-serif, Georgia, serif)', fontSize: '30px', fontWeight: '400', letterSpacing: '1.5px', textTransform: 'uppercase', margin: '8px 0 0 0', color: '#2C2A29' }}>
          Featured Studio Pieces
        </h3>
      </div>

      {/* Minimalist Editorial Filter Tabs */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '28px',
        marginBottom: '48px',
        borderBottom: '1px solid #E5E0D8',
        paddingBottom: '16px'
      }}>
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: isActive ? '1.5px solid #2C2A29' : '1.5px solid transparent',
                paddingBottom: '8px',
                fontSize: '12px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: isActive ? '#2C2A29' : '#7A7267',
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#7A7267', padding: '48px 0', fontStyle: 'italic' }}>
          No studio pieces found under {activeCategory} at the moment.
        </p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
          gap: '44px 32px'
        }}>
          {filteredProducts.map((product) => (
            <div 
              key={product.product_id} 
              onClick={() => handleCardClick(product.product_id)}
              className="nico-product-card"
              style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ aspectRatio: '4 / 5', backgroundColor: '#F2EDE4', overflow: 'hidden', marginBottom: '16px' }}>
                <img 
                  src={product.image_url || 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d'} 
                  alt={product.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                  onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
              </div>

              <span style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#7A7267', marginBottom: '4px' }}>
                {product.craft_origin || 'Artisanal Handcrafted'}
              </span>
              <h4 style={{ fontFamily: 'var(--font-serif, Georgia, serif)', fontSize: '19px', fontWeight: '400', margin: '0 0 10px 0', color: '#2C2A29' }}>
                {product.name}
              </h4>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <span style={{ fontSize: '14px', color: '#2C2A29' }}>
                  ₹{parseFloat(product.base_price || 0).toLocaleString()}
                </span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart({
                      id: `prod-${product.product_id}`,
                      product_id: product.product_id,
                      name: product.name,
                      price: parseFloat(product.base_price || 0),
                      image_url: product.image_url,
                      craft_origin: product.craft_origin,
                      quantity: 1
                    });
                  }}
                  style={{
                    padding: '8px 16px',
                    background: 'transparent',
                    color: '#2C2A29',
                    border: '1px solid #2C2A29',
                    cursor: 'pointer',
                    fontSize: '10px',
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase'
                  }}
                >
                  Add to Bag
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}