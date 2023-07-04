const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const User = require('./models/User');
const Place = require('./models/Place');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();
const app = express();
const PORT = 7000;

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'sdfghjuytdcvjytrdtyhbiuytegvbjiuytdty';

app.use(express.json());
app.use(cookieParser());
app.use('/uploads' , express.static(__dirname+'/uploads'));
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
        res.status(422).json("User Not found!");
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

app.post('/upload-by-link' , async (req , res) => {
    const {link} = req.body;
    const newName = 'photo'+Date.now()+ '.jpg';
    await imageDownloader.image({
        url: link,
        dest: __dirname+'/uploads/' + newName,
    });
    res.json(newName);
})

const photosMiddleware = multer({dest:'uploads/'});
app.post('/upload' , photosMiddleware.array('photos',100) ,(req , res) => {
    const uploadedFiles = [];
    for(let i=0; i < req.files.length ; i++){
        const {path , originalname} = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path+'.'+ext;
        fs.renameSync(path,newPath);
        uploadedFiles.push(newPath.replace('uploads\\' , ''));
    }
    console.log(uploadedFiles);
    res.json(uploadedFiles);
})

app.post('/places' , async(req , res) =>{
    const {token} = req.cookies;

    const {
        title,
        address,
        addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
    } = req.body;

    jwt.verify(token , jwtSecret , {} , async (err , userData) =>{
        if(err) throw err;
        const placeDoc = await Place.create({
            owner:userData.id,
            title,
            address,
            photos:addedPhotos,
            description,
            perks,
            extraInfo,
            checkIn,
            checkOut,
            maxGuests,
        });
        res.json(placeDoc);
    })
    
});

app.get('/places' , (req,res) =>{
    const {token} = req.cookies;
    jwt.verify(token , jwtSecret , {} , async (err , userData) =>{
        if(err) throw err;
        const {id} = userData;
        res.json(await Place.find({owner:id}));
    })
})

app.get('/places/:id' , async(req,res) => {
    const {id} = req.params;
    res.json(await Place.findById(id));
})

app.put('/places' , async(req,res) => {
    const {token} = req.cookies;
    const {
        id,
        title,
        address,
        addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
    } = req.body;

    jwt.verify(token , jwtSecret , {} , async (err , userData) =>{
        if(err) throw err;
        const placeDoc = await Place.findById(id);
        if(placeDoc.owner.toString() === userData.id){
            placeDoc.set({
                title,
                address,
                photos:addedPhotos,
                description,
                perks,
                extraInfo,
                checkIn,
                checkOut,
                maxGuests,
            });
            await placeDoc.save();
            res.json('ok');
        }
    });
})

console.log(`Server Started on ${PORT}!`);
app.listen(PORT);