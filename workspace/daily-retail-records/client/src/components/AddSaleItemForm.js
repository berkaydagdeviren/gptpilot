import React, { useState } from 'react';
import axios from 'axios';

const AddSaleItemForm = ({ saleId, onItemAdded }) => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!itemName || !quantity) {
      setError('Item name and quantity are required.');
      return;
    }
    if (isNaN(quantity) || quantity <= 0) {
      setError('Quantity must be a positive number.');
      return;
    }
    if (price && (isNaN(price) || price <= 0)) {
      setError('Price must be a positive number if specified.');
      return;
    }

    try {
      const response = await axios.post('/api/sales/add-item', {
        saleId,
        itemName,
        quantity: parseInt(quantity, 10),
        price: price ? parseFloat(price) : undefined,
      });
      onItemAdded(response.data); // Callback to update the parent component's state
      setItemName('');
      setQuantity('');
      setPrice('');
      setError('');
      console.log('Item added successfully to sale record.');
    } catch (err) {
      console.error('Failed to add item to sale record:', err.response ? err.response.data : err);
      setError('Failed to add item to sale record. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="itemName">Item Name:</label>
        <input
          type="text"
          id="itemName"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="quantity">Quantity:</label>
        <input
          type="number"
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="price">Price (optional):</label>
        <input
          type="text"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Add Item</button>
    </form>
  );
};

export default AddSaleItemForm;