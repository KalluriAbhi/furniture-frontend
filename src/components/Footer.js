import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer style={{
      backgroundColor: '#F2EDE4',
      color: '#2C2A29',
      borderTop: '1px solid #E5DFD5',
      marginTop: '80px',
      padding: '72px 48px 36px'
    }}>
      <div style={{
        maxWidth: '1320px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '48px',
        paddingBottom: '56px',
        borderBottom: '1px solid #DFD8CC'
      }}>
        {/* Brand Column */}
        <div>
          <h4 style={{
            fontSize: '18px',
            letterSpacing: '3px',
            fontWeight: 400,
            textTransform: 'uppercase',
            marginBottom: '14px'
          }}>
            A R T I S A N &nbsp; S T U D I O
          </h4>
          <p style={{ fontSize: '13px', color: '#6B655E', lineHeight: 1.8 }}>
            Slow-made teakwood furniture and handloom textiles celebrating generational craft clusters across India.
          </p>
        </div>

        {/* Collections Column */}
        <div>
          <span style={{
            fontSize: '11px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: '#6B655E',
            display: 'block',
            marginBottom: '16px'
          }}>
            Collections
          </span>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
            <li><Link to="/" style={{ color: '#2C2A29', textDecoration: 'none' }}>Handloom Textiles</Link></li>
            <li><Link to="/" style={{ color: '#2C2A29', textDecoration: 'none' }}>Seasoned Woodcraft</Link></li>
            <li><Link to="/" style={{ color: '#2C2A29', textDecoration: 'none' }}>Living & Dining</Link></li>
            <li><Link to="/cart" style={{ color: '#2C2A29', textDecoration: 'none' }}>Shopping Bag</Link></li>
          </ul>
        </div>

        {/* Studio Care Column */}
        <div>
          <span style={{
            fontSize: '11px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: '#6B655E',
            display: 'block',
            marginBottom: '16px'
          }}>
            Client Care
          </span>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#2C2A29' }}>
            <li>Made-to-Order Timelines</li>
            <li>Wood & Textile Care Guide</li>
            <li>White-Glove Delivery</li>
            <li>Bespoke Trade Inquiries</li>
          </ul>
        </div>

        {/* Studio Dispatch Newsletter */}
        <div>
          <span style={{
            fontSize: '11px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: '#6B655E',
            display: 'block',
            marginBottom: '16px'
          }}>
            The Studio Dispatch
          </span>
          <p style={{ fontSize: '13px', color: '#6B655E', lineHeight: 1.7, marginBottom: '16px' }}>
            Notes on new loom releases, craft stories, and private previews.
          </p>
          {subscribed ? (
            <p style={{ fontSize: '13px', color: '#A65E46', fontStyle: 'italic' }}>
              Thank you for joining our studio journal.
            </p>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: 'flex', borderBottom: '1px solid #2C2A29', paddingBottom: '6px' }}>
              <input
                type="email"
                required
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '13px',
                  color: '#2C2A29'
                }}
              />
              <button
                type="submit"
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '11px',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color: '#2C2A29',
                  cursor: 'pointer'
                }}
              >
                Join
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom Copyright Row */}
      <div style={{
        maxWidth: '1320px',
        margin: '24px auto 0',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '11px',
        letterSpacing: '1px',
        color: '#6B655E',
        textTransform: 'uppercase'
      }}>
        <span>© {new Date().getFullYear()} Artisan Studio. All Rights Reserved.</span>
        <span>Crafted in Small Batches • Hyderabad & Maheshwar</span>
      </div>
    </footer>
  );
}