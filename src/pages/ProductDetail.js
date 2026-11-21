import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetail.css';
import axios from 'axios'; 
import { API_BASE_URL } from '../config';
 
const ProductDetail = ({ onAddToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedQty, setSelectedQty] = useState(1);

  // Single declaration of handleAddToCart
  const handleAddToCart = () => {
    if (onAddToCart && product) {
      onAddToCart(product, selectedQty);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    axios.get(`${API_BASE_URL}/api/products`)
      .then((res) => {
        const found = res.data.find((p) => p.product_id.toString() === id);
        setProduct(found);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch product details:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="nico-loading">Loading studio piece...</div>;
  if (!product) return <div className="nico-loading">Product not found.</div>;

  return (
    <div className="nico-product-page">
      <div className="nico-breadcrumb-bar">
        <button onClick={() => navigate(-1)} className="nico-back-btn">
          ← Back to Collection
        </button>
      </div>

      <div className="nico-product-container">
        {/* Left: Cinematic Image Gallery */}
        <div className="nico-gallery-section">
          <div className="nico-main-img-wrap">
            <img 
              src={product.image_url || 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace'} 
              alt={product.name} 
              className="nico-detail-img"
            />
          </div>
        </div>

        {/* Right: Editorial Information & Actions */}
        <div className="nico-info-section">
          <span className="nico-detail-origin">
            {product.craft_origin || 'Handcrafted Studio Piece'}
          </span>
          
          <h1 className="nico-detail-title">{product.name}</h1>
          
          <p className="nico-detail-price">
            ₹{parseFloat(product.base_price || 0).toLocaleString()}
          </p>

          <div className="nico-divider" />

          {product.material && (
            <div className="nico-meta-group">
              <span className="nico-meta-label">Material & Composition</span>
              <p className="nico-meta-text">{product.material}</p>
            </div>
          )}

          {product.care_instructions && (
            <div className="nico-meta-group">
              <span className="nico-meta-label">Care Instructions</span>
              <p className="nico-meta-text">{product.care_instructions}</p>
            </div>
          )}

          <div className="nico-meta-group">
            <span className="nico-meta-label">Availability</span>
            <p className="nico-meta-text">
              {product.stock_quantity > 0 ? `${product.stock_quantity} pieces available in studio` : 'Made to order'}
            </p>
          </div>

          {/* Quantity selector & Add to Bag */}
          <div className="nico-purchase-actions">
            <div className="nico-qty-selector">
              <button onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}>-</button>
              <span>{selectedQty}</span>
              <button onClick={() => setSelectedQty(selectedQty + 1)}>+</button>
            </div>

            <button onClick={handleAddToCart} className="nico-add-bag-btn">
              Add to Shopping Bag
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;