const mongoose = require("mongoose")
const cityies = require('./cities')
const {descriptors , places} = require('./seedhelper')
const campground = require("../model/campground");
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
  .then(() => console.log('Connected!'))
  .catch(err => console.log("error during connected to the db"))
const db = mongoose.connection;
const sample = arr => arr[Math.floor(Math.random()*arr.length)]

const sedding = async()=>{
    await campground.deleteMany({});
    for(let i=0; i<50;i++){
      let Price =  Math.floor(Math.random()*20)+10
        let random1000= Math.floor(Math.random()*1000)+1
        const c =   new campground({
            author : '6596931a6a8ee04a7fa17658',
            location : `${cityies[random1000].city},${cityies[random1000].state}`,
            title : `${sample(descriptors)} ${sample(places)}`,
            Price,
            geo_coordinates:{
              coordinates : [
                cityies[random1000].longitude,
                cityies[random1000].latitude

              ]
            },
            description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio, doloremque iure, sequi, facere excepturi numquam necessitatibus incidunt illo aliquam beatae recusandae fuga laboriosam a ipsa? Nihil consequuntur dolor possimus hic",
            images : [  
              {
                url: 'https://res.cloudinary.com/dvosfhyof/image/upload/v1705778866/suryafile/lcb6paykn8djfq2ee8ly.png',
                filename: 'suryafile/lcb6paykn8djfq2ee8ly'
              },
              {
                url: 'https://res.cloudinary.com/dvosfhyof/image/upload/v1705778867/suryafile/vnpa5vdx5477ueovoqsi.png',
                filename: 'suryafile/vnpa5vdx5477ueovoqsi'
              },
              {
                url: 'https://res.cloudinary.com/dvosfhyof/image/upload/v1705778867/suryafile/loixivocbpqgpxbh1w7n.png',
                filename: 'suryafile/loixivocbpqgpxbh1w7n'
              }
            ]
          })
  await c.save()      }   

}
sedding()
.then(()=>{
 mongoose.connection.close()
})