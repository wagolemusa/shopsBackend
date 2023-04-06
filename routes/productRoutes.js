const router = require('express').Router();
const Product = require('../models/Product');
const User = require('../models/User');

// get Products
router.get('/', async(req, res)=> {
  try {
    const sort = {'_id': -1}
    const products = await Product.find().sort(sort);
    res.status(200).json(products);
  } catch (e) {
    res.status(400).send(e.message);
  }
})

// Create Product 
router.post('/', async(req, res)=> {
    try {
      const {name, description, price, category, images: pictures} = req.body;
      const product = await Product.create({name, description, price, category, pictures});
      const products = await Product.find();
      res.status(201).json(products);
    } catch (e) {
      res.status(400).send(e.message);
    }
  })

// Update product
router.patch('/:id', async(req, res) => {
    const { id } = req.params;
    try{
        const { name, description, price, category, image: pictures } = req.body;
        const product = await Product.findByIdAndUpdate(id, {name, description,price, category, pictures});
        const products = await Product.find();
        res.status(201).json(products);
        
    }catch(err){
        console.log(err)
        req.status(400).send(err.message)
    }
})

// Delete a product
router.delete('/:id', async(req, res) => {
    const { id} = req.params;
    const { user_id } = req.body;

    try{
        const user = await User.findById(user_id);
        if (!user.isAdmin){
            return res.status(401).json({
                success: false,
                message: "You don't have permision"
            })
        }
        await Product.findByIdAndDelete(id);
        const products = await Product.find();
        res.status(201).json(products);

    }catch(err){
        console.log(err)
        req.status(400).send(err.message)
    }
})


// get One product

router.get('/:id', async(req, res)=> {
    const {id} = req.params;
    try {
      const product = await Product.findById(id);
      const similar = await Product.find({category: product.category}).limit(5);
      res.status(200).json({product, similar})
    } catch (e) {
      res.status(400).send(e.message);
    }
  });
  

  router.get('/category/:category', async(req,res)=> {
    const {category} = req.params;
    try {
      let products;
      const sort = {'_id': -1}
      if(category === "all"){
        products = await Product.find().sort(sort);
      } else {
        products = await Product.find({category}).sort(sort)
      }
      res.status(200).json(products)
    } catch (e) {
      res.status(400).send(e.message);
    }
  })

// Add to Cart Product
router.post('/add-to-cart', async(req, res) => {
  const {userId, productId, price} = req.body;
  try{
    const user = await User.findById(userId);
    const userCart = user.cart;
    if(user.cart[productId]){ //if product is in exits in the cart
      userCart[productId] += 1; // then inreament by 1
    } else {
      userCart[productId] = 1;
    }
    userCart.count += 1;
    userCart.total = Number(userCart.total) + Number(price);
    user.cart = userCart;
    user.markModified('cart');
    await user.save();
    res.status(200).json(user)

  }catch(e){
    console.log(e)
    res.status(400).send(e.message);
  }
})

// Increase to cart
router.post('/increase-cart', async(req, res) => {
  const { userId, productId, price} = req.body
  try{
    const user = await  User.findById(userId);
    const userCart = user.cart;
    userCart.total += Number(price);
    userCart.count += 1;
    userCart[productId] +=1;
    user.cart = userCart;
    user.markModified('cart');
    await user.save()
    res.status(201).json(user)
  }catch(e){
    console.log(e)
    res.status(400).send(e.message);
  }
})

// Decrease to cart
router.post('/decrease-cart', async(req, res) => {
  const { userId, productId, price} = req.body
  try{
    const user = await  User.findById(userId);
    const userCart = user.cart;
    userCart.total -= Number(price);
    userCart.count -= 1;
    userCart[productId] -=1;
    user.cart = userCart;
    user.markModified('cart');
    await user.save()
    res.status(201).json(user)
  }catch(e){
    console.log(e)
    res.status(400).send(e.message);
  }
})

// Remove from cart
router.post('/remove-from-cart', async(req, res) => {
  const { userId, productId, price} = req.body
  try{
    const user = await  User.findById(userId);
    const userCart = user.cart;
    userCart.total -= Number(userCart[productId]) * Number(price);
    userCart.count -= userCart[productId];
    delete userCart[productId];
    user.cart = userCart;
    user.markModified('cart');
    await user.save()
    res.status(201).json(user)
  }catch(e){
    console.log(e)
    res.status(400).send(e.message);
  }
})


module.exports = router;