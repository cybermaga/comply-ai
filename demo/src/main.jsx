import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GuidedDemo from './GuidedDemo.jsx';
import './index.css';

// Standalone guided-demo app. Any path renders the demo (no product screens).
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<GuidedDemo />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
