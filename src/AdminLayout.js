import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AdminLayout({ currentUser, handleLogout, children }) {
  const [activeTab, setActiveTab] = useState('products');

  const navItems = [
    { id: 'overview', label: 'Studio Overview' },
    { id: 'products', label: 'Products & Catalog' },
    { id: 'orders', label: 'Customer Orders' }
  ];

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#FAF8F5',
      color: '#2C2A29',
      fontFamily: "'Georgia', serif"
    }}>
      {/* Left Sidebar Navigation */}
      <aside style={{
        width: '260px',
        backgroundColor: '#1E242B',
        color: '#FAF8F5',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '32px 24px',
        position: 'sticky',
        top: 0,
        height: '100vh'
      }}>
        <div>
          {/* Studio Brand */}
          <div style={{
            paddingBottom: '24px',
            marginBottom: '28px',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}>
            <span style={{
              fontSize: '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#C5A880',
              display: 'block',
              marginBottom: '6px'
            }}>
              Management Portal
            </span>
            <h2 style={{
              fontSize: '16px',
              letterSpacing: '2px',
              fontWeight: 400,
              margin: 0,
              textTransform: 'uppercase'
            }}>
              STUDIO ADMIN
            </h2>
          </div>

          {/* Sidebar Menu Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    textAlign: 'left',
                    padding: '12px 16px',
                    backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                    color: isActive ? '#FAF8F5' : '#A0AAB2',
                    border: 'none',
                    fontSize: '11px',
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <Link
            to="/"
            style={{
              display: 'block',
              textAlign: 'center',
              padding: '10px 14px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#FAF8F5',
              textDecoration: 'none',
              fontSize: '11px',
              letterSpacing: '1.5px',
              textTransform: 'uppercase'
            }}
          >
            ← View Live Store
          </Link>

          <button
            onClick={handleLogout}
            style={{
              padding: '10px 14px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#E57373',
              fontSize: '11px',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '44px 48px', overflowY: 'auto' }}>
        {React.cloneElement(children, { activeTab, setActiveTab })}
      </main>
    </div>
  );
}