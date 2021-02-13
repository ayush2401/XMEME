const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const ejs = require('ejs')
const uploadModel = require('../models/upload')
const request = require('request')
const methodOvrride = require('method-override')
var sleep = require('system-sleep')

const app = express()
const port = process.env.PORT || 8081

// sleep(10000)

const dbURL = process.env.MONGODB_URI || 'mongodb://localhost:27017/node-app'
mongoose.connect(dbURL , {useNewUrlParser: true , useUnifiedTopology: true})
    .then((result) => app.listen(port , () => {
        console.log('server running on ' + port)
    }))
    .catch((err) => console.log(err));


var imageData = uploadModel.find({}).sort({createdAt: -1})

const viewsPath = path.join(__dirname , '../templates/views')
const publicPath = path.join(__dirname , '../public')
const partialPath = path.join(__dirname,'../templates/partials')

app.set('view engine' , 'ejs')
app.set('views' , viewsPath)
mongoose.set('useFindAndModify', false);

app.use(express.static(publicPath))
app.use(express.json())
app.use(methodOvrride("_method"));
app.use(express.urlencoded({extended:true}))



var updateid;

app.post('' , (req , res) => {
    res.redirect('/add')
})


app.post('/add' , async(req , res) =>  {

   var imageDetails = new uploadModel({
       name: req.body.name,
       caption: req.body.caption,
       url: req.body.url
   })


   if(imageDetails.name =='' || imageDetails.caption == '' || imageDetails.url == '') {
        
        imageDetails.url = ''
        return res.status(404).render('index' , {
            message: 'invalid credentials',
            records: imageDetails
        })
    }
    
    
    await imageDetails.save();
    res.redirect(303 , "/info");
    // imageDetails.save((err , doc) => {

    //     if(err) throw err

    //         imageData.exec((err , data) => {
    //             if(err) throw err
    //                 res.render('index' , {
    //                     message: 'success',
    //                     records: data
    //                 })
    //         })
    // })
})

app.post('/memes' , (req , res) =>  {

    var imageDetails = new uploadModel({
        name: req.body.name,
        caption: req.body.caption,
        url: req.body.url
    })
 
 
    if(imageDetails.name =='' || imageDetails.caption == '' || imageDetails.url == '') {
         
         imageDetails.url = ''
         return res.status(404).render('index' , {
             message: 'invalid credentials',
             records: imageDetails
         })
     }
     
   
     imageDetails.save((err , doc) => {
         if(err) throw err
         const data = {
             id: doc._id
         }
         res.send(data);
     })
 })



app.get('' , (req , res) => {
   res.redirect('/info')
})

app.get('/info' , (req , res) => {

    imageData.exec((err , data) => {
        if(err) throw err
        res.render('index' , {
            message: '',
            records: data
        })
    })
})

app.get('/memes' , (req,res) => {

    imageData.exec((err , data) => {
        if(err) throw err
        res.send(data)
    })
})

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

app.delete('/delete/:id' , (req , res) => {
    const id = req.params.id;

    uploadModel.findByIdAndDelete(id)
      .then(result => {
          res.json({ redirect: '/info'})
      })
      .catch(err => {
        res.render('error' , {
            title: 'error'
        })
      })

})

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


app.patch('/updated' ,  async (req , res) => {
    
     const _id = updateid

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

        res.redirect(303 , "/info")
     }
})



app.get('/info/*' , (req , res) => {
    res.render('error' , {
        title: 'error'
    })
})

app.get('*' , (req , res) => {
    res.render('error' , {
        title: 'error'
    })
})




