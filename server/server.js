import express from 'express';
import mongoose from 'mongoose';
import employeesRouter from './routes/employees.js';
import cors from 'cors';
import {config} from 'dotenv';


const app = express();

config({
  path:"./config.env"
});


const PORT = process.env.PORT;

app.use(cors())
app.use(express.json());  


mongoose.connect(process.env.MONGO_URI, {
  dbName: "employeeDB",
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Failed to connect to MongoDB:', error);
  });

app.use('/', employeesRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
