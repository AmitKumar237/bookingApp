const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const CokkieParser = require('cookie-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const app = express();
const PORT = 7000;

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'sdfghjuytdcvjytrdtyhbiuytegvbjiuytdty';

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials : true,
    origin : 'http://localhost:5173',
}))

console.log(process.env.MONGO_URL);
mongoose.connect(process.env.MONGO_URL);
console.log("Connection done");

app.get('/test' , (req , res) =>{
    res.json('Test ok');
})

// Registering a user into the database
app.post('/register' , async (req , res) =>{
    const {name,email,password} = req.body;

    try{
        const userDoc = await User.create({
                name,
                email,
                password:bcrypt.hashSync(password , bcryptSalt),
        });

        res.json(userDoc);
    }catch(e){
        res.status(422).json(e);
    }
})

// Login Attempt for the user
app.post('/login' , async (req , res) =>{
    const {email , password} = req.body;
    const userDoc = await User.findOne({email});

    if(userDoc){
        const passok = bcrypt.compareSync(password , userDoc.password);
        if(passok){
            jwt.sign({email:userDoc.email , id:userDoc._id} , jwtSecret , {} , (err , token) => {
                if(err) throw err;
                res.cookie('token' , token).json(userDoc);
            })
        }else{
            res.status(422).json("Password is not ok");
        }
    }else{
        res.json("User Not found!");
    }
});

app.post('/logout' , async(req , res) => {
    res.cookie('token' , '').json(true);
})

// Getting a profile of a single person
app.get('/profile' ,  (req , res) =>{
    const {token} = req.cookies;

    if(token){
        jwt.verify(token , jwtSecret , {} , async (err , userData) =>{
            if(err) throw err;
            const {name , email , _id} = await User.findById(userData.id);
            res.json({name , email , _id});
        })
    }else{  
        res.json(null);
    }
})

console.log(`Server Started on ${PORT}!`);
app.listen(PORT);