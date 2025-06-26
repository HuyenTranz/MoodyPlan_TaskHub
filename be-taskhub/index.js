const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const AuthRouter = require('./routes/AuthRouter')
const UserRouter = require('./routes/UserRouter')

const app = express();
dotenv.config();


app.use(express.json())

mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log("Kết nối thành công port", process.env.PORT)
        })

    })
    .catch((error) => {
        console.log(error)
    })

app.use("/api/auth", AuthRouter)
app.use("/api/user", UserRouter)