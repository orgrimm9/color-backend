import express, { Express, Request, Response , Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

const {signin, updateColor, verifyToken, getColor} = require('./controllers')
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

//For env File 
dotenv.config();
//Connect to database
try {
  mongoose.connect(process.env.MONGO_URI);
  console.log("connected to db");
} catch (error) {
  console.log(error);
}

const app: Application = express();
const port = process.env.PORT || 8000;

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({
  extended: true
}));

app.use(cookieParser());

app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000'
}));

app.post("/login", signin);

app.get("/getColor", verifyToken, getColor);

app.put("/updateColor",verifyToken, updateColor);

app.listen(port, () => {
  console.log(`Server is started at http://localhost:${port}`);
});