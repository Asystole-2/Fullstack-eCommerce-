const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const Instrument = require('../models/instruments');

// Get user's cart
router.get('/cart/:userId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
        if (!cart) return res.json({ items: [] });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Add item to cart
router.post('/cart/:userId/add', async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const product = await Instrument.findById(productId);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        let cart = await Cart.findOne({ userId: req.params.userId });
        if (!cart) {
            cart = new Cart({ userId: req.params.userId, items: [] });
        }

        const existingItem = cart.items.find(item => item.productId.equals(productId));
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ productId, quantity, price: product.price });
        }

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Remove item from cart
router.delete('/cart/:userId/remove/:productId', async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.params.userId });
        if (!cart) return res.status(404).json({ error: 'Cart not found' });

        cart.items = cart.items.filter(item => !item.productId.equals(req.params.productId));
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
