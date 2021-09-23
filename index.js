const express = require('express')
const app = express()
var bodyParser = require('body-parser')
const mongoose = require('mongoose');
const User = require('./models/User');
const path = require('path');
const Upload = require('./models/Upload');
const multer = require('multer');
const session = require('express-session');
const users = require ('./routes/users');
const passport = require('passport');

const port = 3001

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

// database
mongoose.connect('mongodb://localhost/user', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function(){

  console.log("MongoDB is now Connected")
});

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

//seting up multer file storage 

const storage = multer.diskStorage({
  destination: 'public/uploads/',
  filename: function (req, file, cb) {
    cb(null, 'myapp '+ Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('filetoupload');

function checkFileType(file, cb) {
  const filetypes = /jpg|png|jpeg|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('ERROR : Images only !');
  }
}


// express session
app.use(session({
secret: 'keyboard cat',
resave: true,
saveUninitialized: true

}))
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

// express messages
app.use(require('connect-flash')());
app.use(function (req, res, next){

  res.locals.messages = require('express-messages')(req, res);
  next();
});


app.post('/uploads',upload,(req, res) => {

  const upload = new Upload({image:req.file.filename})
upload.save()
.then(results =>{
  req.flash('success','File Uploaded Successfully');
  res.redirect('/');
})
.catch(err => {console.log(err)});

});


app.get('/', (req, res) => {
  res.render('index',{


  })
})

app.get('/uploads', (req, res) => {
  res.render('uploads',{


  })
})

  app.get('/404', (req, res) => {
    res.render('404' ,{
      })

  })

  app.get('/blog', (req, res) => {

    res.render('blog', {

    })
  })

  app.get('/cart', (req, res) => {

    res.render('cart', {

    })
  })

  app.get('/checkout', (req, res) => {

    res.render('checkout', {

    })
  })

  app.get('/contact', (req, res) => {

    res.render('contact', {

    })
  })

  app.get('/product', (req, res) => {

    res.render('product', {

    })
  })

  app.get('/shop', (req, res) => {

    res.render('shop', {

    })
  })

  app.use('/users',users);

  
  



app.listen(port, () => {
  console.log('Server is running: ${port}')
})