const express = require('express');
const cors = require('cors')
const app = express();
const http = require('http');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET);
require('./connection')
const server = http.createServer(app);
const { Server } = require('socket.io')

const io = new Server(server, {
    cors: 'https://shop-frontend-oeb3vwjhl-wagolemusa.vercel.app',
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
})

const User = require('./models/User')
const userRoutes = require('./routes/userRoutes')
const productRoutes = require('./routes/productRoutes')
const imageRoutes = require('./routes/imageRoutes')
const orderRoutes = require('./routes/orderRoutes')


app.use(cors());
app.use(express.urlencoded({ extended: true}));
app.use(express.json())
app.use('/users', userRoutes)
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/image', imageRoutes);

app.post('/create-payment', async(req, res) => {
    const{ amount } = req.body;
    try{
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            payment_method_types: ['card']
        });
        res.status(200).json(paymentIntent)

    }catch(e){
        console.log(e)
        res.status(400).json(e.message)
    }
    
})


server.listen(5000, () => {
    console.log('server is runing on port', 5000)
})

app.set('socketio', io)