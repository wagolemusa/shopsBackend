// require('dotenv').config();

// const mongoose = require('mongoose');

// const connectionStr = `mongodb+srv://refuge:&{process.env.MONGO_PASSWORD}@cluster0.wej6jko.mongodb.net/fumbagas?retryWrites=true&w=majority`;

// mongoose.connect(connectionStr, {useNewUrlParser: true })
// .then(() => console.log('connected to mongoDB'))
// .catch(err => console.log(err))


require('dotenv').config();

const mongoose = require('mongoose');
mongoose.set("strictQuery", true);
const connectionStr = `mongodb+srv://refuge:refuge12@cluster0.wej6jko.mongodb.net/fumbagas?retryWrites=true&w=majority`;

mongoose.connect(connectionStr, {
    useNewUrlParser: true, 
    useFindAndModify: false,
    useUnifiedTopology: true,})
.then(() => console.log('connected to mongodb'))
.catch(err => console.log(err))

mongoose.connection.on('error', err => {
  console.log(err)
})