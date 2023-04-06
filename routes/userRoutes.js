const router = require('express').Router();
const order = require('../models/Order')
const User = require('../models/User')

// Signup
router.post("/signup", async(req, res) => {
    const { name, email, password } = req.body;
    try{
        const user = await User.create({ 
            name,
            email,
            password
        })
        res.status(201).json({
            user
        })
    }catch(err){
        console.log(err)
        if(err.code === 11000) return res.status(400).send("Email already exists")
        res.status(400).send(err.message)
    }
})

// Login
router.post('/login', async(req, res) => {
    const {email, password} = req.body;
    try {
      const user = await User.findByCredentials(email, password);
      res.json(user)
    } catch (e) {
      res.status(400).send(e.message)
    }
  })

// Grt users
router.get('/', async(req, res) => {
    try{
        const users = await User.find({ isAdmin: false }).populate('orders');
        res.json(users)
    }catch(err){
        res.status(400).send(err.message);
    }
})


// grtting user Orders
router.get('/:id/orders', async(req, res) => {

    const {id} = req.params;
    try{
        const user = await User.findById(id).populate('orders');
        res.json(user.orders);
    }catch(e){
        res.status(400).send(e.message);
    }
})

// update user notifications
router.post('/:id/updateNotifications', async(req, res) => {
    const { id } = req.params;
    try{

        const user = await User.findById(id);
        user.notifications.forEach((notif) => {
            notif.status = "read"
        })
        user.markModified('notifications');
        await user.save();
        res.status(200).send();
    }catch (e){
        res.status(400).send(e.message)
    }
})


module.exports = router;

