
import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  function addToCart(product) {
    setCart((currentCart) => [...currentCart, product])
  }

  function removeFromCart(indexToRemove) {
    setCart((currentCart) =>
      currentCart.filter((_, index) => index !== indexToRemove),
    )
  }

  function clearCart() {
    setCart([])
  }

  const totalItems = cart.length

  const totalPrice = cart.reduce(
    (total, product) => total + product.price,
    0,
  )

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
