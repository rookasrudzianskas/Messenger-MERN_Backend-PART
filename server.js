// import dependencies
import express from "express";
import Pusher from "pusher";
import mongoose from "mongoose";
import cors from "cors";

import mongoMessages from "./messageModal.js";


// app config
const app = express();
const port = process.env.PORT || 8000;

const pusher = new Pusher({
    appId: "1219149",
    key: "a06555855a0276a2e1a5",
    secret: "46e7641f0b07cd52a647",
    cluster: "eu",
    useTLS: true
});

// middlewares
app.use(express.json());
app.use(cors());

// db config

const mongoURI = 'mongodb+srv://admin:e1mte3hnzmomacf9@cluster0.etlot.mongodb.net/messenger-backend?retryWrites=true&w=majority';
mongoose.connect(mongoURI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

mongoose.connection.once('open', () => {
    console.log('DB is connected');

    // then something changes here, this will know about it!
    const changeStream = mongoose.connection.collection("messages").watch();
    changeStream.on("change", (change) => {
        pusher.trigger('messages', 'newMessages', {
           'change': change,
        });
    })
})

// api routes
app.get('/', (req, res) => res.status(200).send("Hello World 🚀"));

app.post('/save/message', (req, res) => {
    const dbMessage = req.body;

    mongoMessages.create(dbMessage, (err, data) => {
        if(err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(data);
        }
    });
})

app.get('/retrieve/conversation', (req, res) => {
    mongoMessages.find((err, data) => {
        if(err) {
            res.status(500).send(err);
        } else {
            data.sort((b, a) => {
                return a.timestamp - b.timestamp;
            });

            res.status(200).send(data);
        }
    })
})

// this is the end
// listen
app.listen(port, () => console.log(`listening on ${port}`));
