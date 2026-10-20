
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../CartContext.jsx'

function Checkout() {
  const { cart, totalPrice, clearCart } = useCart()

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    payment: 'Transfer Bank (Simulasi)',
  })

  const [order, setOrder] = useState(null)

  const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(price)

  function handleChange(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (cart.length === 0) return

    setOrder({
      ...form,
      products: [...cart],
      total: totalPrice,
      orderNumber: `BN-${Date.now().toString().slice(-8)}`,
    })

    clearCart()
  }

  if (order) {
    return (
      <section className="cart-page">
        <div className="section-heading">
          <div>
            <p className="section-label">PESANAN BERHASIL</p>
            <h1>Terima Kasih!</h1>
            <p className="section-description">
              Pesanan simulasi kamu berhasil dibuat.
            </p>
          </div>
        </div>

        <div className="checkout-panel">
          <p>Nomor pesanan</p>
          <h2>{order.orderNumber}</h2>

          <p>
            <strong>Nama:</strong> {order.name}
          </p>

          <p>
            <strong>Nomor HP:</strong> {order.phone}
          </p>

          <p>
            <strong>Alamat:</strong> {order.address}
          </p>

          <p>
            <strong>Metode pembayaran:</strong> {order.payment}
          </p>

          <h3>Ringkasan pesanan</h3>

          {order.products.map((product, index) => (
            <div
              key={`${product.id}-${index}`}
              className="checkout-product"
            >
              <span>{product.name}</span>
              <strong>{formatPrice(product.price)}</strong>
            </div>
          ))}

          <div className="cart-total">
            <span>Total pembayaran</span>
            <strong>{formatPrice(order.total)}</strong>
          </div>

          <p className="section-description">
            Ini hanya simulasi checkout. Belum ada pembayaran
            sungguhan yang diproses.
          </p>

          <Link className="detail-button checkout-link" to="/">
            Kembali Belanja
          </Link>
        </div>
      </section>
    )
  }

  if (cart.length === 0) {
    return (
      <section className="cart-page">
        <p className="section-label">CHECKOUT</p>
        <h1>Keranjang Masih Kosong</h1>
        <p className="section-description">
          Pilih produk batik terlebih dahulu sebelum checkout.
        </p>
        <Link className="detail-button checkout-link" to="/">
          Jelajahi Produk
        </Link>
      </section>
    )
  }

  return (
    <section className="cart-page">
      <div className="section-heading">
        <div>
          <p className="section-label">SELANGKAH LAGI</p>
          <h1>Checkout</h1>
          <p className="section-description">
            Lengkapi informasi pengiriman pesananmu.
          </p>
        </div>
      </div>

      <div className="checkout-layout">
        <form className="checkout-panel" onSubmit={handleSubmit}>
          <h2>Informasi Pembeli</h2>

          <label htmlFor="name">Nama lengkap</label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Masukkan nama lengkap"
            required
          />

          <label htmlFor="phone">Nomor HP</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="Contoh: 081234567890"
            pattern="[0-9+() -]{8,20}"
            title="Masukkan nomor HP yang valid."
            required
          />

          <label htmlFor="address">Alamat pengiriman</label>
          <textarea
            id="address"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Nama jalan, desa, kecamatan, kabupaten"
            rows={4}
            required
          />

          <label htmlFor="payment">Metode pembayaran</label>
          <select
            id="payment"
            name="payment"
            value={form.payment}
            onChange={handleChange}
          >
            <option>Transfer Bank (Simulasi)</option>
            <option>COD (Simulasi)</option>
            <option>E-Wallet (Simulasi)</option>
          </select>

          <button className="add-button" type="submit">
            Buat Pesanan
          </button>
        </form>

        <aside className="checkout-panel">
          <h2>Ringkasan Pesanan</h2>

          {cart.map((product, index) => (
            <div
              className="checkout-product"
              key={`${product.id}-${index}`}
            >
              <div>
                <strong>{product.name}</strong>
                <p>{formatPrice(product.price)}</p>
              </div>
            </div>
          ))}

          <div className="cart-total">
            <span>Total belanja</span>
            <strong>{formatPrice(totalPrice)}</strong>
          </div>

          <p className="section-description">
            Pembayaran dan pengiriman belum terhubung ke layanan nyata.
          </p>
        </aside>
      </div>
    </section>
  )
}

export default Checkout
