
import { Link, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import { useCart } from './CartContext.jsx'
import './App.css'

function App() {
  const { totalItems } = useCart()

  return (
    <div className="store">
      <header className="navbar">
        <Link className="brand" to="/">
          <span className="brand-mark">B.</span>
          <span>Batik Nusantara</span>
        </Link>

        <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/">Koleksi</Link>
          <Link className="nav-cart" to="/cart">
            Keranjang ({totalItems})
          </Link>
          <Link to="/admin/dashboard">Admin</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route
          path="/cart"
          element={
            <main className="dashboard">
              <Cart />
            </main>
          }
        />

        <Route
          path="/checkout"
          element={
            <main className="dashboard">
              <Checkout />
            </main>
          }
        />

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />
      </Routes>

      <footer className="footer">
        <div>
          <Link className="footer-brand" to="/">
            Batik Nusantara
          </Link>
          <p>
            Merayakan warisan budaya melalui karya batik Indonesia.
          </p>
        </div>

        <p className="copyright">
          © 2026 Batik Nusantara. Seluruh hak cipta dilindungi.
        </p>
      </footer>
    </div>
  )
}

export default App
