import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const EditSalePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [saleData, setSaleData] = useState({ itemsSold: [] });
  const [updatedPrices, setUpdatedPrices] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSaleData = async () => {
      try {
        const response = await axios.get(`/api/sales/${id}`);
        setSaleData(response.data);
        const initialPrices = {};
        response.data.itemsSold.forEach(item => {
          initialPrices[item.productId] = item.price;
        });
        setUpdatedPrices(initialPrices);
      } catch (error) {
        console.error("Error fetching sale data:", error);
        setError('Failed to fetch sale data. Please try again later.');
      }
    };
    fetchSaleData();
  }, [id]);

  const handlePriceChange = (itemId, price) => {
    setUpdatedPrices(prev => ({ ...prev, [itemId]: price }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedItemsSold = saleData.itemsSold.map(item => ({
        ...item,
        price: updatedPrices[item.productId] || item.price
      }));
      await axios.patch(`/api/sales/${id}`, { itemsSold: updatedItemsSold });
      console.log('Sale updated successfully');
      navigate('/retail-tracking');
    } catch (error) {
      console.error("Error updating sale:", error.response ? error.response.data : error.message);
      setError('Error updating sale. ' + (error.response ? error.response.data.message : error.message));
    }
  };

  return (
    <div className="edit-sale-page container">
      <h2>Edit Sale</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        {saleData.itemsSold.map((item, index) => (
          <Form.Group key={index}>
            <Form.Label>{item.itemName}</Form.Label>
            <Form.Control
              type="number"
              value={updatedPrices[item.productId]}
              onChange={(e) => handlePriceChange(item.productId, e.target.value)}
              required
            />
          </Form.Group>
        ))}
        <Button variant="primary" type="submit">Save Changes</Button>
        <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
      </Form>
    </div>
  );
};

export default EditSalePage;