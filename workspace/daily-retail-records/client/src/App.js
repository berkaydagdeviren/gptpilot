import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import RetailTracking from './components/RetailTracking';
import CompanyUpload from './components/CompanyUpload';
import ProductUpload from './components/ProductUpload';
import EditSaleModal from './components/EditSaleModal'; // Updated import statement to EditSaleModal

function App() {
  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item"><Link to="/" className="nav-link">Home</Link></li>
            <li className="nav-item"><Link to="/login" className="nav-link">Login</Link></li>
            <li className="nav-item"><Link to="/register" className="nav-link">Register</Link></li>
            <li className="nav-item"><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
            <li className="nav-item"><Link to="/retail-tracking" className="nav-link">Retail Tracking</Link></li>
            <li className="nav-item"><Link to="/company-upload" className="nav-link">Upload Company Data</Link></li>
            <li className="nav-item"><Link to="/product-upload" className="nav-link">Upload Product Data</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/retail-tracking" element={<RetailTracking />} />
          <Route path="/company-upload" element={<CompanyUpload />} />
          <Route path="/product-upload" element={<ProductUpload />} />
          <Route path="/edit-sale/:id" element={<EditSaleModal />} /> {/* Updated the route component to EditSaleModal */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;