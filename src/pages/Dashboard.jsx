
import { useState } from 'react'
import { useCart } from '../CartContext.jsx'
import { useProducts } from '../ProductContext.jsx'
import '../App.css'

const initialDetails = {
  1: {
    image: '/images/kemeja-batik.jpg',
    description:
      'Kemeja batik pria dengan motif tradisional yang cocok untuk acara formal maupun kasual.',
    rating: 4.8,
    totalReviews: 24,
    category: 'Kemeja',
  },
  2: {
    image: '/images/dress-batik.jpg',
    description:
      'Dress batik dengan motif elegan untuk acara resmi dan berbagai kesempatan istimewa.',
    rating: 5.0,
    totalReviews: 12,
    category: 'Dress',
  },
  3: {
    image: '/images/rok-batik.jpg',
    description:
      'Rok batik bermotif klasik yang memadukan unsur budaya dengan gaya modern.',
    rating: 4.7,
    totalReviews: 18,
    category: 'Rok',
  },
  4: {
    image: '/images/kipas-batik.jpg',
    description:
      'Kipas bermotif batik yang cocok sebagai aksesori maupun koleksi kerajinan Nusantara.',
    rating: 4.6,
    totalReviews: 9,
    category: 'Aksesori',
  },
}

function Dashboard() {
  const { products } = useProducts()
  const { addToCart } = useCart()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Semua Kategori')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedRating, setSelectedRating] = useState(5)
  const [reviewName, setReviewName] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [reviewMessage, setReviewMessage] = useState('')
  const [reviews, setReviews] = useState([])
  const [productRatings, setProductRatings] = useState(() =>
    Object.fromEntries(
      Object.entries(initialDetails).map(([id, detail]) => [
        id,
        {
          total: detail.rating * detail.totalReviews,
          count: detail.totalReviews,
        },
      ]),
    ),
  )

  const categories = [
    'Semua Kategori',
    ...new Set(
      products.map((product) => {
        const detail = initialDetails[product.id]
        return detail?.category ?? product.category
      }),
    ),
  ]

  const normalizedProducts = products.map((product) => {
    const detail = initialDetails[product.id] ?? {}

    return {
      ...product,
      category: detail.category ?? product.category ?? 'Lainnya',
      image: product.image ?? detail.image ?? '',
      description:
        product.description ??
        detail.description ??
        'Produk batik pilihan dari Batik Nusantara.',
    }
  })

  const filteredProducts = normalizedProducts.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesCategory =
      category === 'Semua Kategori' ||
      product.category === category

    return matchesSearch && matchesCategory
  })

  const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(price)

  function getRating(product) {
    const data = productRatings[product.id]
    const detail = initialDetails[product.id]

    if (data) {
      return {
        average: data.count > 0 ? data.total / data.count : 0,
        count: data.count,
      }
    }

    return {
      average: detail?.rating ?? 0,
      count: detail?.totalReviews ?? 0,
    }
  }

  function renderRating(product) {
    const { average, count } = getRating(product)

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '6px',
          margin: '8px 0 12px',
        }}
      >
        <span style={{ color: '#E5A000', fontSize: '17px' }}>
          ★★★★★
        </span>
        <strong>{average.toFixed(1)}</strong>
        <span style={{ color: '#777', fontSize: '12px' }}>
          ({count} ulasan)
        </span>
      </div>
    )
  }

  function openProduct(product) {
    setSelectedProduct(product)
    setSelectedRating(5)
    setReviewName('')
    setReviewText('')
    setReviewMessage('')
  }

  function handleReviewSubmit(event) {
    event.preventDefault()
    if (!selectedProduct) return

    if (!reviewText.trim()) {
      setReviewMessage('Silakan tulis ulasan terlebih dahulu.')
      return
    }

    const newReview = {
      id: `${Date.now()}-${Math.random()}`,
      productId: selectedProduct.id,
      name: reviewName.trim() || 'Pengunjung',
      rating: selectedRating,
      comment: reviewText.trim(),
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    }

    setReviews((current) => [newReview, ...current])

    setProductRatings((current) => {
      const previous = current[selectedProduct.id] ?? {
        total: getRating(selectedProduct).average *
          getRating(selectedProduct).count,
        count: getRating(selectedProduct).count,
      }

      return {
        ...current,
        [selectedProduct.id]: {
          total: previous.total + selectedRating,
          count: previous.count + 1,
        },
      }
    })

    setReviewText('')
    setReviewName('')
    setReviewMessage('Terima kasih! Ulasan kamu berhasil dikirim.')
  }

  const selectedProductReviews = selectedProduct
    ? reviews.filter(
        (review) => review.productId === selectedProduct.id,
      )
    : []

  return (
    <>
      <main className="dashboard" id="produk">
        <div className="toolbar">
          <input
            type="search"
            placeholder="Cari produk batik..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Cari produk batik"
          />

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Filter kategori produk"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <section className="section-heading">
          <div>
            <p className="section-label">KOLEKSI BATIK INDONESIA</p>
            <h1>Jelajahi Produk</h1>
            <p className="section-description">
              Temukan pilihan busana dan aksesori batik untuk gayamu.
            </p>
          </div>

          <span className="product-count">
            {filteredProducts.length} produk
          </span>
        </section>

        <div className="category-list">
          {categories.map((item) => (
            <button
              key={item}
              className={
                category === item
                  ? 'category-button active'
                  : 'category-button'
              }
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <button
                  className="image-button"
                  onClick={() => openProduct(product)}
                  aria-label={`Lihat detail ${product.name}`}
                >
                  {product.image ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    <span>Produk Batik</span>
                  )}
                  <span className="image-label">{product.category}</span>
                </button>

                <div className="product-info">
                  <p className="product-category">{product.category}</p>
                  <h2>{product.name}</h2>
                  {renderRating(product)}
                  <p className="price">{formatPrice(product.price)}</p>

                  <button
                    className="detail-button"
                    onClick={() => openProduct(product)}
                  >
                    Lihat Detail
                  </button>

                  <button
                    className="add-button"
                    onClick={() => addToCart(product)}
                  >
                    + Tambah ke Keranjang
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="empty-message">
            Produk tidak ditemukan. Coba kata kunci atau kategori lain.
          </p>
        )}
      </main>

      {selectedProduct && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedProduct(null)}
        >
          <section
            className="product-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`Detail ${selectedProduct.name}`}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedProduct(null)}
              aria-label="Tutup detail produk"
            >
              ×
            </button>

            {selectedProduct.image && (
              <img
                className="modal-image"
                src={selectedProduct.image}
                alt={selectedProduct.name}
              />
            )}

            <p className="product-category">{selectedProduct.category}</p>
            <h2>{selectedProduct.name}</h2>
            {renderRating(selectedProduct)}
            <p className="price">{formatPrice(selectedProduct.price)}</p>
            <p className="modal-description">{selectedProduct.description}</p>

            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #eadcc9' }}>
              <h3>Tulis Ulasan Produk</h3>
              <p>Bagikan pendapatmu tentang produk ini.</p>

              <form onSubmit={handleReviewSubmit}>
                <label htmlFor="review-name">Nama (opsional)</label>
                <input
                  id="review-name"
                  value={reviewName}
                  onChange={(event) => setReviewName(event.target.value)}
                  placeholder="Masukkan nama kamu"
                />

                <p>Rating kamu</p>
                <div style={{ display: 'flex', gap: '8px', margin: '8px 0' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      aria-label={`${star} bintang`}
                      aria-pressed={selectedRating === star}
                      onClick={() => setSelectedRating(star)}
                      style={{
                        padding: '4px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        fontSize: '32px',
                        color: star <= selectedRating ? '#E5A000' : '#D5D5D5',
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>

                <p>{selectedRating} dari 5 bintang</p>

                <label htmlFor="review-comment">Ulasan atau komentar</label>
                <textarea
                  id="review-comment"
                  placeholder="Bagikan pendapatmu tentang produk ini..."
                  value={reviewText}
                  onChange={(event) => setReviewText(event.target.value)}
                  rows={4}
                  required
                />

                <button className="detail-button" type="submit">
                  Kirim Ulasan
                </button>

                {reviewMessage && <p role="status">{reviewMessage}</p>}
              </form>
            </div>

            <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #eadcc9' }}>
              <h3>Ulasan Pembeli ({selectedProductReviews.length})</h3>

              {selectedProductReviews.length > 0 ? (
                selectedProductReviews.map((review) => (
                  <article
                    key={review.id}
                    style={{ padding: '16px 0', borderBottom: '1px solid #eee2d5' }}
                  >
                    <strong>{review.name}</strong>
                    <p style={{ color: '#E5A000', margin: '6px 0' }}>
                      {'★'.repeat(review.rating)}
                      <span style={{ color: '#D5D5D5' }}>
                        {'★'.repeat(5 - review.rating)}
                      </span>
                    </p>
                    <p>{review.comment}</p>
                    <small>{review.date}</small>
                  </article>
                ))
              ) : (
                <p style={{ color: '#777' }}>
                  Belum ada komentar baru untuk produk ini.
                </p>
              )}
            </div>

            <button
              className="add-button"
              style={{ marginTop: '20px' }}
              onClick={() => {
                addToCart(selectedProduct)
                setSelectedProduct(null)
              }}
            >
              + Tambah ke Keranjang
            </button>
          </section>
        </div>
      )}
    </>
  )
}

export default Dashboard
