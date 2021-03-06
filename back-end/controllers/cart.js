const cartService = require('../services/cart')

const cartController = {
    find: async (req, res) => {
        const {_id} = req.params
        const cart = await cartService.find(_id)

        return res.json(cart)
    },

    substitute: async (req, res) => {
        const {_id, cart: newCart} = req.body
        await cartService.substitute(_id, newCart)

        const cart = await cartService.update(_id)

        return res.json(cart)
    },

    edit: async (req, res) => {
        const {_id, sku, quantity, specs} = req.body
        const cart = await cartService.edit(_id, sku, quantity, specs)

        return res.json(cart)
    },

    update: async (req, res) => {
        const {_id} = req.body
        const cart = await cartService.update(_id)

        return res.json(cart)
    },

    remove: async (req, res) => {
        const {_id, sku} = req.body
        const cart = (await cartService.remove(_id, sku)).cart

        return res.json(cart)
    }
}

module.exports = cartController