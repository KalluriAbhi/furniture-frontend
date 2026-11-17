import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminDashboard({ activeTab = 'products', setActiveTab }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSubTab, setCurrentSubTab] = useState('inventory'); // 'inventory' or 'add'

  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    base_price: '',
    stock_quantity: 10,
    material: '',
    craft_origin: '',
    care_instructions: '',
    image_url: ''
  });

  const [statusMsg, setStatusMsg] = useState('');

 const fetchData = async () => {
    setLoading(true);
    try {
      const prodRes = await axios.get('process.env.REACT_APP_API_URL/api/products');
      const prodData = Array.isArray(prodRes.data) ? prodRes.data : (prodRes.data.products || []);
      setProducts(prodData);

      // Make sure this points to /api/admin/orders
      const orderRes = await axios.get('process.env.REACT_APP_API_URL/api/admin/orders');
      const orderData = Array.isArray(orderRes.data) ? orderRes.data : (orderRes.data.orders || []);
      setOrders(orderData);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setStatusMsg('');
    try {
      const token = localStorage.getItem('studio_token');
      await axios.post(
        'http://process.env.REACT_APP_API_URL/api/admin/products',
        {
          ...newProduct,
          sku: newProduct.sku || `SKU-${Date.now()}`,
          base_price: parseFloat(newProduct.base_price),
          stock_quantity: parseInt(newProduct.stock_quantity, 10)
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      setNewProduct({
        name: '',
        sku: '',
        base_price: '',
        stock_quantity: 10,
        material: '',
        craft_origin: '',
        care_instructions: '',
        image_url: ''
      });
      setStatusMsg('New studio piece added successfully.');
      setCurrentSubTab('inventory');
      fetchData();
    } catch (err) {
      console.error('Failed to add product:', err);
      setStatusMsg('Error adding product. Check backend logs.');
    }
  };

 const handleDeleteProduct = async (productId, productName) => {
    const confirmed = window.confirm(`Remove "${productName}" permanently from the studio catalog?`);
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('studio_token');
      // Pass productId directly (e.g., 102 instead of #102)
      await axios.delete(`http://process.env.REACT_APP_API_URL/api/products/${productId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      setProducts((prev) => prev.filter((p) => p.product_id !== productId));
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert('Could not delete product.');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    backgroundColor: '#FFF',
    border: '1px solid #DFD8CC',
    fontSize: '13px',
    color: '#2C2A29',
    outline: 'none'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '10px',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    color: '#6B655E',
    marginBottom: '6px'
  };

  // Determine active view based on sidebar selection or internal sub-tabs
  const currentView = activeTab;

   
 return (
    <div style={{ maxWidth: '1200px' }}>
      {statusMsg && (
        <div style={{
          padding: '12px 18px',
          backgroundColor: '#F2EDE4',
          border: '1px solid #2C2A29',
          fontSize: '13px',
          marginBottom: '24px'
        }}>
          {statusMsg}
        </div>
      )}

      {/* OVERVIEW TAB */}
      {currentView === 'overview' && (
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 400, marginBottom: '28px' }}>Studio Overview</h1>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '40px' }}>
            <div style={{ backgroundColor: '#F2EDE4', padding: '28px', border: '1px solid #DFD8CC' }}>
              <span style={labelStyle}>Active Catalog Pieces</span>
              <div style={{ fontSize: '32px', marginTop: '8px' }}>{products.length}</div>
            </div>
            <div style={{ backgroundColor: '#F2EDE4', padding: '28px', border: '1px solid #DFD8CC' }}>
              <span style={labelStyle}>Total Orders Received</span>
              <div style={{ fontSize: '32px', marginTop: '8px' }}>{orders.length}</div>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCTS & CATALOG TAB */}
      {currentView === 'products' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 400, margin: 0 }}>Products & Catalog</h1>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setCurrentSubTab('inventory')}
                style={{
                  padding: '10px 18px',
                  backgroundColor: currentSubTab === 'inventory' ? '#2C2A29' : 'transparent',
                  color: currentSubTab === 'inventory' ? '#FAF8F5' : '#2C2A29',
                  border: '1px solid #2C2A29',
                  fontSize: '11px',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  cursor: 'pointer'
                }}
              >
                View Inventory ({products.length})
              </button>
              <button
                onClick={() => setCurrentSubTab('add')}
                style={{
                  padding: '10px 18px',
                  backgroundColor: currentSubTab === 'add' ? '#2C2A29' : 'transparent',
                  color: currentSubTab === 'add' ? '#FAF8F5' : '#2C2A29',
                  border: '1px solid #2C2A29',
                  fontSize: '11px',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  cursor: 'pointer'
                }}
              >
                + Add New Product
              </button>
            </div>
          </div>

          {currentSubTab === 'add' ? (
            <form
              onSubmit={handleAddProduct}
              style={{
                backgroundColor: '#F2EDE4',
                padding: '36px',
                border: '1px solid #DFD8CC'
              }}
            >
              <h3 style={{ fontSize: '16px', fontWeight: 400, letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: 0, marginBottom: '20px' }}>
                Add New Studio Piece
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={labelStyle}>Product Name *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="e.g. Handwoven Tussar Throw"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newProduct.base_price}
                    onChange={(e) => setNewProduct({ ...newProduct, base_price: e.target.value })}
                    placeholder="6500"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Stock Qty</label>
                  <input
                    type="number"
                    value={newProduct.stock_quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={labelStyle}>Craft Origin</label>
                  <input
                    type="text"
                    value={newProduct.craft_origin}
                    onChange={(e) => setNewProduct({ ...newProduct, craft_origin: e.target.value })}
                    placeholder="e.g. Maheshwar Handlooms"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Material & Composition</label>
                  <input
                    type="text"
                    value={newProduct.material}
                    onChange={(e) => setNewProduct({ ...newProduct, material: e.target.value })}
                    placeholder="e.g. 100% Seasoned Teak Wood"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={labelStyle}>Image URL</label>
                  <input
                    type="text"
                    value={newProduct.image_url}
                    onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Care Instructions</label>
                  <input
                    type="text"
                    value={newProduct.care_instructions}
                    onChange={(e) => setNewProduct({ ...newProduct, care_instructions: e.target.value })}
                    placeholder="e.g. Wipe with soft dry cloth"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  style={{
                    padding: '14px 28px',
                    backgroundColor: '#2C2A29',
                    color: '#FAF8F5',
                    border: 'none',
                    fontSize: '11px',
                    letterSpacing: '1.8px',
                    textTransform: 'uppercase',
                    cursor: 'pointer'
                  }}
                >
                  Publish to Storefront
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentSubTab('inventory')}
                  style={{
                    padding: '14px 28px',
                    backgroundColor: 'transparent',
                    color: '#2C2A29',
                    border: '1px solid #2C2A29',
                    fontSize: '11px',
                    letterSpacing: '1.8px',
                    textTransform: 'uppercase',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div style={{ backgroundColor: '#FFF', border: '1px solid #DFD8CC' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F2EDE4', borderBottom: '1px solid #DFD8CC', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#6B655E' }}>
                    <th style={{ padding: '16px' }}>ID</th>
                    <th style={{ padding: '16px' }}>Product Name</th>
                    <th style={{ padding: '16px' }}>SKU</th>
                    <th style={{ padding: '16px' }}>Base Price</th>
                    <th style={{ padding: '16px' }}>Stock</th>
                    <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="6" style={{ padding: '24px', textAlign: 'center' }}>Loading catalog...</td></tr>
                  ) : products.length === 0 ? (
                    <tr><td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: '#6B655E' }}>No products found.</td></tr>
                  ) : (
                    products.map((prod) => (
                      <tr key={prod.product_id} style={{ borderBottom: '1px solid #F0ECE1', fontSize: '14px' }}>
                        <td style={{ padding: '16px', color: '#6B655E' }}>#{prod.product_id}</td>
                        <td style={{ padding: '16px', fontWeight: 500 }}>{prod.name}</td>
                        <td style={{ padding: '16px', color: '#6B655E' }}>{prod.sku || '—'}</td>
                        <td style={{ padding: '16px' }}>₹{Number(prod.base_price || 0).toLocaleString()}</td>
                        <td style={{ padding: '16px', color: prod.stock_quantity > 0 ? '#2E7D32' : '#C62828' }}>
                          {prod.stock_quantity > 0 ? `${prod.stock_quantity} in stock` : 'Out of stock'}
                        </td>
                        <td style={{ padding: '16px', textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => handleDeleteProduct(prod.product_id, prod.name)}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: 'transparent',
                              border: '1px solid #A94442',
                              color: '#A94442',
                              fontSize: '11px',
                              letterSpacing: '1px',
                              textTransform: 'uppercase',
                              cursor: 'pointer'
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ORDERS TAB */}
      {currentView === 'orders' && (
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 400, marginBottom: '28px' }}>Customer Orders</h1>
          <div style={{ backgroundColor: '#FFF', border: '1px solid #DFD8CC' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#F2EDE4', borderBottom: '1px solid #DFD8CC', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#6B655E' }}>
                  <th style={{ padding: '16px' }}>Order ID</th>
                  <th style={{ padding: '16px' }}>Recipient</th>
                  <th style={{ padding: '16px' }}>Destination</th>
                  <th style={{ padding: '16px' }}>Total</th>
                  <th style={{ padding: '16px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: '#6B655E', fontStyle: 'italic' }}>
                      No customer orders recorded yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((order, idx) => (
                    <tr key={order.order_id || order.id || idx} style={{ borderBottom: '1px solid #F0ECE1', fontSize: '14px' }}>
                      <td style={{ padding: '16px' }}>#{order.order_id || order.id}</td>
                      <td style={{ padding: '16px' }}>{order.customer_name || 'Guest'}</td>
                      <td style={{ padding: '16px', color: '#6B655E', maxWidth: '280px' }}>{order.shipping_address || '—'}</td>
                      <td style={{ padding: '16px' }}>₹{Number(order.total_amount || 0).toLocaleString()}</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ padding: '4px 10px', backgroundColor: '#F2EDE4', fontSize: '11px', letterSpacing: '1px' }}>
                          {order.status || 'Confirmed'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}