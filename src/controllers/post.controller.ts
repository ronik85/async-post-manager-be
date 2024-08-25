import { Request, Response } from 'express';
import { Post } from '../models/post.model.js';
import { enqueuePost } from '../utils/rabbitmq.js';
import NodeCache from 'node-cache';

export const myCache = new NodeCache({ stdTTL: 300, checkperiod: 60 }); // Cache with a 5-minute TTL


/**
 * Create a new post and add it to the queue.
 * @param req Express request object
 * @param res Express response object
 */
export const createPost = async (req: Request, res: Response) => {
    try {
        await enqueuePost(req.body);
        await new Promise(resolve => setTimeout(resolve, 5000));
        res.status(202).json({ message: 'Post queued for creation' });
    } catch (error) {
        res.status(500).json({ message: 'Error queuing post', error });
    }
};

/**
 * Search posts by title.
 * @param req Express request object
 * @param res Express response object
 */
export const searchPosts = async (req: Request, res: Response) => {
    try {
        const query = req.query.q as string;
        // If no query is provided, fetch all posts
        if (!query) {
            // Check if cached data exists for all posts
            const cachedAllPosts = myCache.get('allPosts');
            if (cachedAllPosts) {
                return res.status(200).json(cachedAllPosts);
            }

            // If not cached, fetch all posts from the database
            const allPosts = await Post.find({});

            // Cache the result
            myCache.set('allPosts', allPosts);
            return res.status(200).json(allPosts);
        }

        // Check if cached data exists for this query
        const cachedPosts = myCache.get(query);
        if (cachedPosts) {
            return res.status(200).json(cachedPosts);
        }

        // If not cached, fetch from database
        const posts = await Post.find({ title: new RegExp(query, 'i') });

        // Cache the result
        myCache.set(query, posts);

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error searching posts', error });
    }
};



export const countPosts = async (req: Request, res: Response) => {
    try {
        const count = await Post.countDocuments();
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching post count', error });
    }
};
