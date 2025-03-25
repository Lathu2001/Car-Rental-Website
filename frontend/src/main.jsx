import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import * as bootstrap from 'bootstrap'
import './index.css'
import { Provider } from 'react-redux';
import {store} from './components/Redux/store.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
