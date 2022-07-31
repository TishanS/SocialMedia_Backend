const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config();
const bodyParser = require('body-parser');
const postRoutes = require('./routes/posts')
const userRoutes = require('./routes/user')

// app.use(cors())
// app.use(bodyParser.json({ limit: "30mb", extended: "true"}));
// app.use(bodyParser.urlencoded({ limit: "30mb", extended:  "true"}));

app.use(express.json({ limit: '30mb', extended: true }))
app.use(express.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());

app.use('/posts', postRoutes);
app.use('/user', userRoutes);

const CONNECTION_URL = 'mongodb+srv://Tishan:ZS7jEzX5qsbmgTI2@cluster1.ucjer.mongodb.net/?retryWrites=true&w=majority'

app.get('/',(req,res,next)=>{
    res.send('Welcome to Heroku')
    console.log('middleware')

    next();
})

const PORT = process.env.PORT || 5000;
// app.listen(port, function () {
//     console.log(`Server is running in port: ${port}`)
// })


mongoose.connect(CONNECTION_URL).then(()=>{
    app.listen(PORT, ()=> {
        console.log(`Server is running in ${PORT}`)
    })
}).catch((error)=> {
    console.log(error)
})


