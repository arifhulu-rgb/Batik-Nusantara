
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './CartContext.jsx'
import { ProductProvider } from './ProductContext.jsx'
import { OrderProvider } from './OrderContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <ProductProvider>
          <OrderProvider>
            <App />
          </OrderProvider>
        </ProductProvider>
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
)
