
// dependencies which needs to be installed
const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const ejs = require('ejs')
const uploadModel = require('../models/upload')
const request = require('request')
const methodOvrride = require('method-override')
var sleep = require('system-sleep')

const app = express()

// merging local port to port used in deployment
const port = process.env.PORT || 8081

// merging the remote databse url mongodbatlas used for deployment along with the local mongodb 
const dbURL = process.env.MONGODB_URI || 'mongodb://localhost:27017/node-app'
mongoose.connect(dbURL , {useNewUrlParser: true , useUnifiedTopology: true})
    .then((result) => app.listen(port , () => {
        console.log('server running on ' + port)
    }))
    .catch((err) => console.log(err));


// imageData stores the entire info about the memes in latest created order
var imageData = uploadModel.find({}).sort({createdAt: -1})

// path containing the templates and frontend resources
const viewsPath = path.join(__dirname , '../templates/views')
const publicPath = path.join(__dirname , '../public')

// assigning setting names to value
app.set('view engine' , 'ejs')
app.set('views' , viewsPath)
// removing deprecation with disabling 
mongoose.set('useFindAndModify', false);

// registering middlewares
app.use(express.static(publicPath))
app.use(express.json())
app.use(methodOvrride("_method"));
app.use(express.urlencoded({extended:true}))


// global parameter to store id of the meme to be updated
var updateid;

// routing HTTP POST request with the root and redirecting to the form window
app.post('' , (req , res) => {
    res.redirect('/add')
})

// update window to fetch request with name , caption , url 
app.post('/add' , async(req , res) =>  {

   var imageDetails = new uploadModel({
       name: req.body.name,
       caption: req.body.caption,
       url: req.body.url
   })

   // form validation with any empty credentials throwing a 404 satus
   if(imageDetails.name =='' || imageDetails.caption == '' || imageDetails.url == '') {
        
        imageDetails.url = ''
        return res.status(404).render('index' , {
            message: 'invalid credentials',
            records: imageDetails
        })
    }
    
    // saving the new entry to the databse
    await imageDetails.save();

    // redirecting to the home page
    res.redirect(303 , "/info");
    
})

// HTTP post request to /memes returning the id of the new save meme
app.post('/memes' , (req , res) =>  {
   
    // imageDetails is an object containing new data
    var imageDetails = new uploadModel({
        name: req.body.name,
        caption: req.body.caption,
        url: req.body.url
    })
  
    // form validation for empty credentials
    if(imageDetails.name =='' || imageDetails.caption == '' || imageDetails.url == '') {
         
         imageDetails.url = ''
         return res.status(404).render('index' , {
             message: 'invalid credentials',
             records: imageDetails
         })
     }
     
     
     // new meme saved to databse with a JSON response with ID of the unique ID of the saved meme
     imageDetails.save((err , doc) => {
         if(err) throw err
         const data = {
             id: doc._id
         }
         res.send(data);
     })
 })



// callback function routing the HTTP get request redirecting to the home page
app.get('' , (req , res) => {
   res.redirect('/info')
})

// a middleware sub-stack that handles GET requests to the /info
app.get('/info' , (req , res) => {
    
    // records stores the data of the memes posted
    imageData.exec((err , data) => {
        if(err) throw err
        res.render('index' , {
            message: '',
            records: data
        })
    })
})

// a middleware sub-stack that handles GET requests to the /memes , sending back JSON response
app.get('/memes' , (req,res) => {

    imageData.exec((err , data) => {
        if(err) throw err
        res.send(data)
    })
})

// GET request to /meme/:id to access info about any meme posted with the given ID
app.get('/memes/:id' , (req,res) => {

    const id = req.params.id
    uploadModel.findById(id)
    .then(result => {
        res.json(result)
    })
    .catch(err => {
        res.render('error' , {
            title: 'error'
        })
    })
})

// a middleware sub-stack that handles DELETE requests to the /delete/:id 
app.delete('/delete/:id' , (req , res) => {
    const id = req.params.id;
    
    // finding meme by ID and delete
    uploadModel.findByIdAndDelete(id)
      .then(result => {
          res.json({ redirect: '/info'})
      }) // if no such meme returning a error response
      .catch(err => {
        res.render('error' , {
            title: 'error'
        })
      })

})

// handler for /update/:id with renders the update window to edit the meme
app.get('/update/:id' , (req , res) => {
    updateid = req.params.id;
    try {
    res.render('updateinfo',{
        id:updateid
    })
    }catch(err) {
        res.render('error' , {
            title: 'error'
        })
    }
})


// PATCH method to update data send through the update form
app.patch('/updated' ,  async (req , res) => {
    
     const _id = updateid
    
     // validation 
     if(req.body.caption == '' || req.body.url == '') {
        res.render('error' , {
            title: 'error'
        })
     }
     else {
       await uploadModel.findByIdAndUpdate(_id , {
            caption: req.body.caption,
            url: req.body.url
        })
        
        // redirection to home with a valid edit
        res.redirect(303 , "/info")
     }
})


// handling errors with any inncorrect request made from the home page sending back a 404 response
app.get('/info/*' , (req , res) => {
    res.staus(404).render('error' , {
        title: 'error'
    })
})

// handling errors with any inncorrect resquest
app.get('*' , (req , res) => {
    res.status(404).render('error' , {
        title: 'error'
    })
})




