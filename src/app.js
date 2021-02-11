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

sleep(10000)

const dbURL = 'mongodb://localhost:27017/node-app'
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
    res.redirect('/memes')
})


app.post('/memes' , (req , res) =>  {

   var imageDetails = new uploadModel({
       name: req.body.name,
       caption: req.body.caption,
       url: req.body.url
   })


   if(imageDetails.name =='' || imageDetails.caption == '' || imageDetails.url == '') {
        
        imageDetails.url = ''
        return res.render('index' , {
            message: 'invalid credentials',
            records: imageDetails
        })
    }

  
    imageDetails.save((err , doc) => {

        if(err) throw err
            imageData.exec((err , data) => {
                if(err) throw err
                    res.render('index' , {
                        message: 'success',
                        records: data
                    })
            })
    })
})



app.get('' , (req , res) => {
   res.redirect('/memes')
})

app.get('/memes' , (req , res) => {

    imageData.exec((err , data) => {
        if(err) throw err
        res.render('index' , {
            message: '',
            records: data
        })
    })
})

app.delete('/delete/:id' , (req , res) => {
    const id = req.params.id;

    uploadModel.findByIdAndDelete(id)
      .then(result => {
          res.json({ redirect: '/memes'})
      })
      .catch(err => {
          console.log(err)
      })

})

app.get('/update/:id' , (req , res) => {
    updateid = req.params.id;
    try {
    res.render('updateinfo',{
        id:updateid
    })
    }catch(err) {
        console.log(err)
    }
})


app.patch('/updated' ,  (req , res) => {
    
     const _id = updateid

     if(req.body.caption == '' || req.body.url == '') {
        res.render('error' , {
            title: 'error'
        })
     }
     else {
        uploadModel.findByIdAndUpdate(_id , {
            caption: req.body.caption,
            url: req.body.url
        } , (err , docs) => {
            if(err)
            console.log(err)
            else {
                imageData.exec((err , data) => {
                    if(err) throw err
                    res.render('index' , {
                        message: '',
                        records: data
                    })
                })
            }
       })
    }
})



app.get('/memes/*' , (req , res) => {
    res.render('error' , {
        title: 'error'
    })
})

app.get('*' , (req , res) => {
    res.render('error' , {
        title: 'error'
    })
})




