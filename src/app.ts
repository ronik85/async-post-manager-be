import express, { Express } from "express";
import dotenv from "dotenv";
import NodeCache from 'node-cache'
import { connectDB } from "./utils/db.js";
import cors from 'cors'


// importing routes
import userRoute from './routes/user.routes.js'


dotenv.config();

const PORT = process.env.PORT || 3000;
const mongo_uri = process.env.MONGO_URI || ''
connectDB(mongo_uri)

export const myCache = new NodeCache();


const app: Express = express();
app.use(express.json())
app.use(cors())

app.use("/api/user", userRoute)

app.listen(PORT, () => { 
    console.log(`Server is running on port http://localhost:${PORT}`)
})
