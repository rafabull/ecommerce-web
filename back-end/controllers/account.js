const accountService = require('../services/account')

const accountController = {
  find: async (req, res) => {
    const accounts = await accountService.find()

    return res.json(accounts)
  },

  findByEmail: async (req, res) => {
    const {email} = req.body
    const account = await accountService.findByEmail(email)

    return res.json(account)
  },

  findById: async (req, res) => {
    const {_id} = req.params
    const account = await accountService.findById(_id)

    return res.json(account)
  },

  checkExitence: async (req, res) => {
    const {email} = req.params
    const exists = await accountService.checkExistence({email})

    return res.json(exists)
  },

  update: async (req, res) => {
    const {_id, updates} = req.body

    try{
      await accountService.update(_id, updates)
      return res.status(200).json()
    }

    catch(e){ return res.status(400).json() }
  },

  delete: async (req, res) => {
    try{
      const {email} = req.body
      await accountService.delete(email)
      return res.json(true)
    }

    catch{ return res.json(false) }
  }
}

module.exports = accountController