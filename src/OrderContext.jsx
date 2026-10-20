
import { createContext, useContext, useEffect, useState } from 'react'

const OrderContext = createContext()

function loadOrders() {
  try {
    return JSON.parse(localStorage.getItem('batik-nusantara-orders')) || []
  } catch {
    return []
  }
}

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(loadOrders)

  useEffect(() => {
    localStorage.setItem('batik-nusantara-orders', JSON.stringify(orders))
  }, [orders])

  function addOrder(order) {
    setOrders((current) => [
      {
        ...order,
        id: `ORD-${Date.now()}`,
        createdAt: new Date().toLocaleString('id-ID'),
        status: 'Diproses',
      },
      ...current,
    ])
  }

  function updateOrderStatus(id, status) {
    setOrders((current) =>
      current.map((order) =>
        order.id === id ? { ...order, status } : order,
      ),
    )
  }

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  return useContext(OrderContext)
}

