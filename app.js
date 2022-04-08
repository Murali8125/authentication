//jshint esversion:6

require('dotenv').config()
const express=require('express')
const bodyParser=require('body-parser')
const mongoose=require('mongoose')
var encrypt = require('mongoose-encryption')
const app=express();


app.use(express.static("public"))
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({
    extended:true
}))
mongoose.connect("mongodb://localhost:27017/userDB")

var userSchema = new mongoose.Schema({
    email:String,
    password:String
    // whatever else
});


// var encKey = process.env.SOME_32BYTE_BASE64_STRING
// var sigKey = process.env.SOME_64BYTE_BASE64_STRING

const secret=process.env.SECRET

userSchema.plugin(encrypt, {secret:secret, encryptedFields: ['password']})

// userSchema.plugin(encrypt,{secret:secret,encryptedFields:['password']})

const User=new mongoose.model("User",userSchema)

app.get("/",function(req,res)
{
    res.render("home")
})
app.get("/login",function(req,res)
{
    res.render("login")
})
app.get("/register",function(req,res)
{
    res.render("register")
})
app.listen(3000,function()
{
    console.log("server started")
})
app.post("/register",function(req,res)
{
    const newUser=new User({
        email:req.body.username,
        password:req.body.password
    })
    newUser.save(function(err){
        if(err){
            console.log("error")
        }
        else{
            res.render("secrets")
        }
    })
})
app.post("/login",function(req,res){
    const email=req.body.username
    const password=req.body.password
    User.findOne({email:email},function(err,foundList)
    {
        if(!err){
            if(foundList.password===password){
            res.render("secrets")
            }
            else{
                res.render("wrongdetails")
            }
        }
        else{
            res.render("notregistered")
        }
    })
})