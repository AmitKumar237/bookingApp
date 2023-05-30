const express = require('express');
const app = express();

app.get('/test' , (req , res) =>{
    res.json('Test ok');
})

console.log("Server Started!");
app.listen(4000);