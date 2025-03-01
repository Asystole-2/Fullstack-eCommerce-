import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const CartPage = () => {
    const [cart, setCart] = useState(null)
    const userId = localStorage.getItem('userId')

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axios.get(`/api/cart/${userId}`)
                setCart(response.data)
            } catch (error) {
                console.error('Error fetching cart:', error)
            }
        }
        fetchCart();
    }, [userId])

    const handleRemoveFromCart = async (productId) => {
        try {
            await axios.delete(`/api/cart/${userId}/remove/${productId}`)
            setCart((prevCart) => ({
                ...prevCart,
                items: prevCart.items.filter(item => item.productId._id !== productId),
            }))
        } catch (error) {
            console.error('Error removing item from cart:', error)
        }
    }

    if (!cart) return <p>Loading...</p>

    return (
        <div>
            <h1>Shopping Cart</h1>
            <Link to="/MainPage">Continue Shopping</Link>
            {cart.items.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <ul>
                    {cart.items.map(item => (
                        <li key={item.productId._id}>
                            {item.productId.name} - {item.quantity} x ${item.price.toFixed(2)}
                            <button onClick={() => handleRemoveFromCart(item.productId._id)}>Remove</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default CartPage
