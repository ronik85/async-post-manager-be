import express, { Express } from "express";
import dotenv from "dotenv";
import { connectDB } from "./utils/db.js";
import cors from 'cors'


// importing routes
import userRoute from './routes/user.routes.js'
import postRoute from './routes/post.routes.js'
import { consumePosts } from "./utils/rabbitmq.js";


dotenv.config();

const PORT = process.env.PORT || 3000;
const mongo_uri = process.env.MONGO_URI || ''
connectDB(mongo_uri)



const app: Express = express();
app.use(express.json())
app.use(cors())

app.use("/api/user", userRoute)
app.use("/api/post", postRoute)

consumePosts().catch(console.error);

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`)
})
