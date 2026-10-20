
import { createContext, useContext, useEffect, useState } from 'react'

const ProductContext = createContext()

const initialProducts = [
  {
    id: 1,
    name: 'Kemeja Batik Pria',
    category: 'Fashion Pria',
    price: 250000,
    stock: 12,
    image: '/images/kemeja-batik.jpg',
    description: 'Kemeja batik pria dengan motif tradisional.',
  },
  {
    id: 2,
    name: 'Dress Batik Modern',
    category: 'Fashion Wanita',
    price: 350000,
    stock: 8,
    image: '/images/dress-batik.jpg',
    description: 'Dress batik elegan untuk berbagai kesempatan.',
  },
  {
    id: 3,
    name: 'Rok Batik Tradisional',
    category: 'Fashion Wanita',
    price: 175000,
    stock: 15,
    image: '/images/rok-batik.jpg',
    description: 'Rok batik bermotif klasik dengan gaya modern.',
  },
  {
    id: 4,
    name: 'Kipas Batik Handmade',
    category: 'Aksesori',
    price: 75000,
    stock: 20,
    image: '/images/kipas-batik.jpg',
    description: 'Kipas batik sebagai aksesori dan kerajinan Nusantara.',
  },
]

function loadProducts() {
  try {
    const saved = localStorage.getItem('batik-nusantara-products')

    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (error) {
    console.error('Gagal membaca data produk:', error)
  }

  return initialProducts
}

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(loadProducts)

  useEffect(() => {
    try {
      localStorage.setItem(
        'batik-nusantara-products',
        JSON.stringify(products),
      )
    } catch (error) {
      console.error('Gagal menyimpan data produk:', error)
    }
  }, [products])

  function addProduct(product) {
    setProducts((current) => [
      ...current,
      { ...product, id: Date.now() },
    ])
  }

  function updateProduct(updatedProduct) {
    setProducts((current) =>
      current.map((product) =>
        product.id === updatedProduct.id
          ? { ...product, ...updatedProduct }
          : product,
      ),
    )
  }

  function deleteProduct(id) {
    setProducts((current) =>
      current.filter((product) => product.id !== id),
    )
  }

  return (
    <ProductContext.Provider
      value={{ products, setProducts, addProduct, updateProduct, deleteProduct }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export function useProducts() {
  return useContext(ProductContext)
}
