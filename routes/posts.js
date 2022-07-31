const express = require('express')
const router = express.Router();
const modules = require('../module/posts')

const middleware = require('../middleware/auth')

router.get('/', modules.getposts)
router.get('/:id', modules.getPost)
router.get('/search', modules.getPostsBySearch)
router.post('/', middleware.auth, modules.createposts)
router.patch('/:id', middleware.auth, modules.updateposts)
router.delete('/:id', middleware.auth, modules.deletePost)
router.patch('/:id/likePost', middleware.auth, modules.likePost)
router.post('/:id/commentPost', middleware.auth, modules.commentPost)

module.exports = router;