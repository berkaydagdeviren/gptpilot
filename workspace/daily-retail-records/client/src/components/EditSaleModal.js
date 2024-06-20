import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const EditSaleModal = ({ show, onHide, saleId, onSaleUpdated }) => {
  const [saleData, setSaleData] = useState({ itemsSold: [] });
  const [updatedPrices, setUpdatedPrices] = useState({});

  useEffect(() => {
    if (saleId) {
      fetchSaleData(saleId);
    }
  }, [saleId]);

  const fetchSaleData = async (id) => {
    try {
      const response = await axios.get(`/api/sales/${id}`);
      setSaleData(response.data);
      const initialPrices = {};
      response.data.itemsSold.forEach(item => {
        initialPrices[item._id] = item.price;
      });
      setUpdatedPrices(initialPrices);
    } catch (error) {
      console.error("Error fetching sale data:", error);
    }
  };

  const handlePriceChange = (itemId, price) => {
    setUpdatedPrices(prev => ({ ...prev, [itemId]: price }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`/api/sales/${saleId}`, { itemsSold: saleData.itemsSold.map(item => ({ ...item, price: updatedPrices[item._id] })) });
      console.log('Sale updated successfully');
      onSaleUpdated();
      onHide();
    } catch (error) {
      console.error("Error updating sale:", error);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Sale</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {saleData.itemsSold.map(item => (
            <Form.Group key={item._id}>
              <Form.Label>{item.itemName}</Form.Label>
              <Form.Control
                type="number"
                value={updatedPrices[item._id]}
                onChange={(e) => handlePriceChange(item._id, e.target.value)}
                required
              />
            </Form.Group>
          ))}
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditSaleModal;