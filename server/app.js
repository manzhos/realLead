import express from 'express';
import cors from 'cors'
import bodyParser from 'body-parser';
import 'dotenv/config'

import { Server } from "socket.io";

import connectDB from "./db/mongoose.js";

// import routes
import UserRoute from './routes/user.routes.js'
import ProjectRoute from './routes/project.routes.js'
import ChannelRoute from './routes/channel.routes.js'

const app = express()
const PORT = process.env.PORT || 3300;
const WEBSOCKET_PORT = process.env.WEBSOCKET_PORT || 3330;

app.use(cors({origin:true}));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/test', (req, res) => res.send('Hello World'));

app.use(express.json({ extended: true }))
app.use('/api', UserRoute);
app.use('/api', ProjectRoute);
app.use('/api', ChannelRoute);

// connect to DB
connectDB();

// start websocket
const io = new Server(WEBSOCKET_PORT || 3330, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  transports: ['websocket', 'polling', 'flashsocket']
});
console.log('IO:', io);

io.on("connection", (socket) => {
  console.log(`Websocket has been settled on the port ${WEBSOCKET_PORT}`);
  //send message
  socket.emit("hello", "world");
  //receive message
  socket.on("howdy", (arg) => {
    console.log(arg);
  });
});


// start server
app.listen(PORT, () => console.log(`App has been started on the port ${PORT}...`));