
import { Link } from 'react-router-dom'
import { useCart } from '../CartContext.jsx'

function Cart() {
  const { cart, removeFromCart, totalPrice } = useCart()

  const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(price)

  return (
    <section className="cart-page">
      <div className="section-heading">
        <div>
          <p className="section-label">PESANAN KAMU</p>
          <h1>Keranjang Belanja</h1>
          <p className="section-description">
            Periksa kembali produk batik pilihanmu.
          </p>
        </div>
      </div>

      {cart.length === 0 ? (
        <p className="empty-message">
          Keranjang masih kosong. Yuk, pilih produk batik favoritmu!
        </p>
      ) : (
        <div className="cart-list">
          {cart.map((product, index) => (
            <article
              className="cart-item"
              key={`${product.id}-${index}`}
            >
              <img src={product.image} alt={product.name} />

              <div>
                <h2>{product.name}</h2>
                <p>{formatPrice(product.price)}</p>
              </div>

              <button
                className="remove-button"
                onClick={() => removeFromCart(index)}
              >
                Hapus
              </button>
            </article>
          ))}

          <div className="cart-total">
            <span>Total belanja</span>
            <strong>{formatPrice(totalPrice)}</strong>
          </div>

          <Link className="add-button checkout-link" to="/checkout">
            Lanjut ke Checkout
          </Link>
        </div>
      )}
    </section>
  )
}

export default Cart
