// dependencies
const express = require('express')
const Bookmark = require('../models/bookmark')

const router = express.Router()

// GET /bookmarks
router.get('/', (req, res) => {
  Bookmark.find()
  .then(bookmarks => res.send(bookmarks))
  .catch(error => res.status(500).send({ error: error.message }))
})

// POST /bookmarks
router.post('/', (req, res) => {
  const { title, url } = req.body
  Bookmark.create({ title, url })
  .then(bookmark => res.send(bookmark))
  .catch(error => res.status(500).send({ error: error.message }))
})

// DELETE /bookmarks/:id
router.delete('/:id', (req, res) => {
  const id = req.params.id
  const { title, url } = req.body
  Bookmark.findByIdAndRemove(id)
  .then(() => res.send(200))
  .catch(error => res.status(500).send({ error: error.message }))
})

module.exports = router
