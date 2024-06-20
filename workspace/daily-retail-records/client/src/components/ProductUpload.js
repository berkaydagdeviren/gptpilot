import React, { useState } from 'react';
import axios from 'axios';

const ProductUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        setMessage('Invalid file type. Only CSV files are allowed.');
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setMessage('File is too large. Please select a file smaller than 5MB.');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setMessage('Please select a file before uploading.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/import/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message);
      console.log('File upload successful:', response.data.message);
    } catch (error) {
      const errorMessage = error.response && error.response.data && error.response.data.message ? error.response.data.message : 'An error occurred during file upload.';
      console.error('Error uploading file:', errorMessage);
      setMessage(errorMessage);
    }
  };

  return (
    <div>
      <h2>Upload Product CSV</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept=".csv" />
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ProductUpload;