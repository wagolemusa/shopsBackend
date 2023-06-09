const router = require('express').Router();
const Order = require('../models/Order');
const User = require('../models/User');

// creating an order
router.post('/', async(req, res) => {

    const io = req.app.get('socketio');

    const { userId, cart, district, town, phone} = req.body;
    try{
        const user = await User.findById(userId);
        const order = await Order.create({owner: user._id, products: cart, district,town,phone})
        order.count = cart.count;
        order.total = cart.total;
        await order.save();
        user.cart = {total: 0, count: 0};
        user.orders.push(order);
        const notification = {status: 'unread', message: `New order from ${user.name}`, time: new Date()};
        io.sockets.emit('new-order', notification);
        user.markModified('orders');
        await user.save();
        res.status(200).json(user)
    } catch(e){
        res.status(400).json(e.message)
        console.log(e)
    }
})


// getting all orders

router.get('/', async(req, res)=> {
    try {
      const sort = {'_id' : -1}
      const orders = await Order.find().populate('owner', ['email', 'name']).sort(sort);
      res.status(200).json(orders);
    } catch (e) {
      res.status(400).json(e.message)
    }
  })


  // shipping orders
  router.patch('/:id/mark-shipped', async(req, res) => {
    const io = req.app.get('socketio');

    const { ownerId } = req.body;
    const { id } = req.params;
    try{
      const user = await User.findById(ownerId);
      await Order.findByIdAndUpdate(id, { status: 'shipped'});
      const orders = await Order.find().populate('owner', ['email', 'name']);
      const notification = {status: 'unread', message: `Order ${id} shipped with success`, time: new Date()};
      io.sockets.emit("notification", notification, ownerId);
      user.notifications.push(notification);
      await user.save();
      res.status(200).json(orders)
    }catch(e){
      res.status(400).json(e.message);
      console.log(e)
    }
  })



  
module.exports = router;