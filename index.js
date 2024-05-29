import express from 'express'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import postRoutes from './routes/posts.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import multer from 'multer'
import dontenv from 'dotenv'
import mongoose from 'mongoose'

dontenv.config()

const app =  express()

const connectDB = async ()=>{
  try {
      await mongoose.connect(process.env.MONGO)
      console.log("MongoDB connected Successfully");
  } catch (error) {
      throw error
  }

}

mongoose.connection.on("disconnected",()=>{
  console.log("mongoDB disconnected");
})


app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:3500',  // replace with your front-end domain
    credentials: true
}))
app.options('*',cors())

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../client/public/upload')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+file.originalname)
    }
})
  

const upload = multer({storage})

app.post('/api/upload',upload.single('file'),function (req, res){
    const file = req.file;
    res.status(200).json(file.filename)
})

// Routes
app.use('/api/auth',authRoutes);
app.use('/api/users',userRoutes);
app.use('/api/posts',postRoutes);

// PORT 
const port  = 8800

app.listen(port,()=>{
    connectDB()
    console.log(`App Running in ${port}`);
})