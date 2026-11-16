import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ComboBuilder = ({ comboId, onAddToCart}) => {
  const [combo, setCombo] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch Combo & Items from Backend API
    axios.get(`http://localhost:5000/api/combos/${comboId}`)
      .then((res) => {
        const { combo, items } = res.data;
        setCombo(combo);
        setSlots(items);

        // Set initial selected items to defaults
        const initialSelections = {};
        let initialBaseSum = parseFloat(combo.base_combo_price);

        items.forEach((slot) => {
          initialSelections[slot.combo_item_id] = {
            productId: slot.default_product_id,
            price: parseFloat(slot.default_product_price),
            name: slot.default_product_name,
            defaultPrice: parseFloat(slot.default_product_price)
          };
        });

        setSelectedItems(initialSelections);
        setTotalPrice(initialBaseSum);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading combo:', err);
        setLoading(false);
      });
  }, [comboId]);

  // Handle Replacement Selection & Calculate Price Delta
  const handleItemSwap = (slotId, newProduct, defaultPrice) => {
    const updatedSelections = {
      ...selectedItems,
      [slotId]: {
        productId: newProduct.product_id,
        price: parseFloat(newProduct.base_price),
        name: newProduct.name,
        defaultPrice: defaultPrice
      }
    };

    // Calculate Dynamic Total Price (Base Combo Price + Delta)
    let newTotal = parseFloat(combo.base_combo_price);
    Object.values(updatedSelections).forEach((item) => {
      const priceDelta = item.price - item.defaultPrice;
      newTotal += priceDelta;
    });

    setSelectedItems(updatedSelections);
    setTotalPrice(newTotal);
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Combo Builder...</div>;
  if (!combo) return <div style={{ padding: '40px', textAlign: 'center' }}>Combo not found.</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', fontFamily: 'sans-serif', padding: '20px' }}>
      <h1 style={{ marginBottom: '8px' }}>{combo.name}</h1>
      <p style={{ color: '#666', marginBottom: '24px' }}>{combo.description}</p>

      {/* Slots Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {slots.map((slot) => {
          const currentSelected = selectedItems[slot.combo_item_id];
          const defaultPrice = parseFloat(slot.default_product_price);

          return (
            <div key={slot.combo_item_id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: '#fff' }}>
              <h3 style={{ marginTop: 0, color: '#333' }}>
                Slot: <span style={{ color: '#0070f3' }}>{slot.slot_category_name}</span>
              </h3>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                <div>
                  <p style={{ margin: '4px 0', fontWeight: 'bold' }}>Currently Selected: {currentSelected?.name}</p>
                  <p style={{ margin: '4px 0', color: '#555' }}>
                    Price: ₹{currentSelected?.price.toLocaleString()} 
                    {currentSelected?.price !== defaultPrice && (
                      <span style={{ color: currentSelected?.price > defaultPrice ? 'red' : 'green', marginLeft: '8px' }}>
                        ({currentSelected?.price > defaultPrice ? `+₹${(currentSelected.price - defaultPrice).toLocaleString()}` : `-₹${(defaultPrice - currentSelected.price).toLocaleString()}`})
                      </span>
                    )}
                  </p>
                </div>

                {/* Dropdown to Swap Items in the same category */}
                <select
                  value={currentSelected?.productId}
                  onChange={(e) => {
                    const selectedProd = slot.available_replacements.find(p => p.product_id === parseInt(e.target.value));
                    handleItemSwap(slot.combo_item_id, selectedProd, defaultPrice);
                  }}
                  style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc', cursor: 'pointer' }}
                >
                  {slot.available_replacements.map((prod) => (
                    <option key={prod.product_id} value={prod.product_id}>
                      {prod.name} — ₹{parseFloat(prod.base_price).toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div style={{ marginTop: '30px', padding: '20px', borderTop: '2px solid #111', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0 }}>Total Combo Price: ₹{totalPrice.toLocaleString()}</h2>
          <p style={{ margin: '4px 0', color: '#777', fontSize: '14px' }}>Includes custom replacements and active discounts</p>
        </div>
       
       <button
  onClick={() => {
    const customComboItem = {
      id: comboId || 1,
      name: 'Custom Furniture Combo',
      price: totalPrice, // <-- Change 'currentComboPrice' to whatever your state variable for the price is named
      quantity: 1
    };
    if (typeof onAddToCart === 'function') {
      onAddToCart(customComboItem);
    }
  }}
  style={{
    padding: '12px 24px',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer'
  }}
>
  Add Custom Combo to Cart
</button>
      </div>
    </div>
  );
};

export default ComboBuilder;