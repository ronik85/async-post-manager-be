import express from 'express';
import { loginUser, registerUser } from '../controllers/auth.controller.js';

const app = express.Router();

app.post('/login', loginUser)
app.post('/create', registerUser)

export default app;