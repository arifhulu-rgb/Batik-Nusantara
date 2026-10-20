
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../../ProductContext.jsx'

function AdminDashboard() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts()

  const [form, setForm] = useState({
    name: '',
    category: 'Fashion Pria',
    price: '',
    stock: '',
  })

  const [image, setImage] = useState('')
  const [editId, setEditId] = useState(null)

  const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(price)

  function resetForm() {
    setEditId(null)
    setForm({
      name: '',
      category: 'Fashion Pria',
      price: '',
      stock: '',
    })
    setImage('')
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Silakan pilih file gambar.')
      event.target.value = ''
      return
    }

    // Batasi ukuran gambar maksimal 2 MB
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran gambar maksimal 2 MB.')
      event.target.value = ''
      return
    }

    const reader = new FileReader()

    reader.onloadend = () => {
      setImage(reader.result)
    }

    reader.readAsDataURL(file)
  }

  function handleSubmit(event) {
    event.preventDefault()

    const productData = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      image,
    }

    if (editId !== null) {
      updateProduct({ ...productData, id: editId })
    } else {
      addProduct(productData)
    }

    resetForm()
  }

  function handleEdit(product) {
    setEditId(product.id)

    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock ?? 0),
    })

    setImage(product.image || '')

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleDelete(id) {
    if (window.confirm('Yakin ingin menghapus produk ini?')) {
      deleteProduct(id)

      if (editId === id) {
        resetForm()
      }
    }
  }

  const totalStock = products.reduce(
    (total, product) => total + Number(product.stock || 0),
    0,
  )

  const inventoryValue = products.reduce(
    (total, product) =>
      total + Number(product.price) * Number(product.stock || 0),
    0,
  )

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <p className="section-label">BATIK NUSANTARA</p>
          <h1>Admin Dashboard</h1>
          <p>Kelola produk dan inventaris toko batik.</p>
        </div>

        <Link to="/" className="admin-back">
          Lihat Toko →
        </Link>
      </header>

      <section className="admin-stats">
        <article className="admin-stat">
          <span>Total Produk</span>
          <strong>{products.length}</strong>
        </article>

        <article className="admin-stat">
          <span>Total Stok</span>
          <strong>{totalStock}</strong>
        </article>

        <article className="admin-stat">
          <span>Nilai Inventaris</span>
          <strong>{formatPrice(inventoryValue)}</strong>
        </article>
      </section>

      <section className="admin-panel">
        <h2>{editId !== null ? 'Edit Produk' : 'Tambah Produk'}</h2>

        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Nama produk
            <input
              value={form.name}
              onChange={(event) =>
                setForm({ ...form, name: event.target.value })
              }
              placeholder="Contoh: Kemeja Batik"
              required
            />
          </label>

          <label>
            Kategori
            <select
              value={form.category}
              onChange={(event) =>
                setForm({ ...form, category: event.target.value })
              }
            >
              <option>Fashion Pria</option>
              <option>Fashion Wanita</option>
              <option>Aksesori</option>
            </select>
          </label>

          <label>
            Harga (Rp)
            <input
              type="number"
              min="1"
              value={form.price}
              onChange={(event) =>
                setForm({ ...form, price: event.target.value })
              }
              required
            />
          </label>

          <label>
            Stok
            <input
              type="number"
              min="0"
              step="1"
              value={form.stock}
              onChange={(event) =>
                setForm({ ...form, stock: event.target.value })
              }
              required
            />
          </label>

          <label className="admin-image-field">
            Foto produk
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            <small>Pilih gambar dari komputer. Maksimal 2 MB.</small>
          </label>

          {image && (
            <div className="admin-image-preview">
              <img src={image} alt="Preview produk" />
              <button
                type="button"
                className="admin-cancel"
                onClick={() => setImage('')}
              >
                Hapus foto
              </button>
            </div>
          )}

          <div className="admin-form-actions">
            <button type="submit" className="add-button">
              {editId !== null ? 'Simpan Perubahan' : 'Tambah Produk'}
            </button>

            {editId !== null && (
              <button
                type="button"
                className="admin-cancel"
                onClick={resetForm}
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="admin-panel">
        <h2>Daftar Produk</h2>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Foto</th>
                <th>Produk</th>
                <th>Kategori</th>
                <th>Harga</th>
                <th>Stok</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="admin-table-image"
                      />
                    ) : (
                      <span>Belum ada foto</span>
                    )}
                  </td>

                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{formatPrice(product.price)}</td>
                  <td>{product.stock ?? 0}</td>

                  <td>
                    <div className="admin-actions">
                      <button
                        type="button"
                        className="admin-edit"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="admin-delete"
                        onClick={() => handleDelete(product.id)}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

export default AdminDashboard
