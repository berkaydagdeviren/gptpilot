import React, { useState } from 'react';
import axios from 'axios';

const CompanyUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
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
      const response = await axios.post('/api/import/companies', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message);
      console.log('File upload successful:', response.data.message);
    } catch (error) {
      console.error('Error uploading file:', error.response ? error.response.data.message : error.message);
      setMessage(error.response ? error.response.data.message : 'An error occurred during file upload.');
    }
  };

  return (
    <div>
      <h2>Upload Company CSV</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept=".csv" />
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CompanyUpload;