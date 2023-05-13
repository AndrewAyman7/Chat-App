import React from 'react';


import 'react-app-polyfill/ie11'; 
import 'react-app-polyfill/stable';

import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter} from "react-router-dom"

import "bootstrap/dist/css/bootstrap.min.css";   
import "jquery/dist/jquery.min.js";              
import "popper.js/dist/umd/popper.min.js";        
import "bootstrap/dist/js/bootstrap.min.js";

import "react-toastify/dist/ReactToastify.css";

import store from './redux/store';
import {Provider} from "react-redux";  // Connect between React App & Redux


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);



