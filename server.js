const express = require("express");
const app = express();
const session = require('express-session');
app.use(session({
  secret: 'keyboardkitteh',
  resave: false,
  saveUninitialized: true
}))
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/rhino", {
  useNewUrlParser: true
});

app.use(express.static(__dirname + "/static"));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

const RhinoSchema = new mongoose.Schema({
    name: String,
    placeBirth: String,
    age: Number

}, {timestamps: true});

const Rhino = mongoose.model("Rhino", RhinoSchema);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/static"));
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.get("/", (req, res) =>{
    Rhino.find()
    .then(data => res.render("index", { rhinos: data }))
    .catch(err => res.json(err));
})

app.get("/rhino/new", (req, res) =>{
    res.render('newRhino');
})



app.post("/rhinos", (req,res) => {
    console.log(req.body);
    const rhino = new Rhino();
    rhino.name = req.body.name;
    rhino.placeBirth = req.body.placeBirth;
    rhino.age = req.body.age;
    rhino
        .save()
        .then(newRhinoData => {
        console.log("Rhino Added: ", newRhinoData);
        res.redirect("/")
        })
        .catch(err => console.log(err));
});

app.get("/rhino/:id", (req, res) => {
    Rhino.findOne({_id: req.params.id})
    .then(data => res.render("viewRhino", {rhinos: data }))
    .catch(err => res.json(err));
})

app.get("/rhino/edit/:id", (req, res) => {
    console.log("imade it to the function");
    Rhino.findOne({_id: req.params.id})

    .then(data => console.log(data) || res.render("editRhino", {rhinos: data }))
    .catch(err => res.json(err));
})

app.post("/rhino/:id", (req,res) => {
    console.log("i made it momma");
    Rhino.updateOne({_id: req.params.id}, {
        name: req.body.name,
        placeBirth: req.body.placeBirth,
        age: req.body.age
         
    } )
        .then(data => res.redirect(`/rhino/${req.params.id}`))
        .catch(err => res.json(err));

})

app.post("/rhino/destroy/:id", (req,res) =>{
    console.log("i Made it to the destruction");
    Rhino.remove({_id: req.params.id})
    .then(data => res.redirect('/'))
    .catch(err => res.json(err));

})



app.listen(8000, () => console.log("You are on rhinoDashboard App"));