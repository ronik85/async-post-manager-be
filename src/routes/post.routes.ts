import { Router } from 'express';
import { countPosts, createPost, searchPosts } from '../controllers/post.controller.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/create', authenticate, createPost);
router.get('/search', authenticate, searchPosts);
router.get('/count', countPosts);

export default router;
