import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
import Star from './Star';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>{/* <App /> */ <Star starLength={10} />}</React.StrictMode>
);
