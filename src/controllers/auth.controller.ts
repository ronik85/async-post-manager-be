import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

/**
 * Generates a JWT token for a user.
 * 
 * @param id - The user's ID.
 * @returns The generated JWT token.
 */

const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: '30d',
    });
};

/**
 * Registers a new user by saving their details to the db.
 * 
 * @param req - The HTTP request object containing user details.
 * @param res - The HTTP response object.
 * 
 * @throws 400 - If the user already exists.
 * @throws 500 - If there is a server error.
 */

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        // Create a new user
        const newUser = await User.create({ username, password });


        res.status(201).json({
            message: "User created successfully",
            username: `hello ${newUser.username}`,
            token: generateToken(newUser._id as string),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


/**
 * Authenticates a user by checking their credentials and returning a JWT token.
 * 
 * @param req - The HTTP request object containing user credentials.
 * @param res - The HTTP response object.
 * 
 * @throws 400 - If the credentials are invalid.
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    try {
        // Find the user by username
        const user = await User.findOne({ username });

        if (user && (await user.matchPassword(password))) {
            // User is authenticated, return user details and token
            res.json({
                // _id: user._id,
                message: "login Successful",
                username: user.username,
                token: generateToken(user._id as string),
            });
        } else {
            // Invalid credentials
            res.status(400).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
