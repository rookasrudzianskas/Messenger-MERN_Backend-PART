// import dependencies
import express from "express";
import Pusher from "pusher";
import mongoose from "mongoose";
import cors from "cors";

// app config
const app = express();
const port = process.env.PORT || 8000;

// middlewares


// db config

const mongoURI = 'mongodb+srv://admin:e1mte3hnzmomacf9@cluster0.etlot.mongodb.net/messenger-backend?retryWrites=true&w=majority';
mongoose.connect(mongoURI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

mongoose.connection.once('open', () => {
    console.log('DB is connected');
})

// api routes
app.get('/', (req, res) => res.status(200).send("Hello World 🚀"));


// listen
app.listen(port, () => console.log(`listening on ${port}`));
