const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const categoryRouter = require('./routes/categoryRoute');
const productRouter = require('./routes/productRoute');
const userRouter = require('./routes/userRoute');
const cartRouter = require('./routes/cartRoute');
const orderRouter = require('./routes/orderRoute');
const orderitemRouter = require('./routes/orderitemRoute');
const uploadRouter = require('./routes/uploadRoute');
const db = require('./models'); // Ensure models are imported to initialize associations


const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use('/cat', categoryRouter);
app.use('/pro', productRouter);
app.use('/user', userRouter);
app.use('/cart',cartRouter);
app.use('/order', orderRouter);
app.use('/oitem', orderitemRouter);
app.use('/upload', uploadRouter);

// app.listen(port, () =>{
//     console.log(`listening on port ${port}`);
// });
db.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`listening on port ${port}`);
    });
}).catch(error => {
    console.error('Unable to connect to the database:', error);
});